/**
 * enclave-pnl.ts
 *
 * TEE Enclave PnL Computation Engine
 * Runs server-side only — never exposed to the client bundle.
 *
 * Flow:
 *   1. Fetch AssetShielded event logs from OpaqueVault (on-chain deposit history)
 *   2. Resolve token prices via CoinGecko at deposit time + current price
 *   3. Compute PnL = ((currentValue - initialValue) / initialValue) * 100
 *   4. Return only { proof_hash, pnl_percentage, verification_timestamp }
 *      — raw balances are never included in the output
 */

import crypto from "crypto";
import { createPublicClient, http, parseAbiItem, formatUnits } from "viem";
import { arbitrumSepolia } from "viem/chains";

// ── On-chain config ────────────────────────────────────────────────────────────
const VAULT_ADDRESS = (process.env.NEXT_PUBLIC_VAULT_ADDRESS ?? "") as `0x${string}`;
const USDC_ADDRESS  = (process.env.NEXT_PUBLIC_USDC_ADDRESS  ?? "") as `0x${string}`;

const ASSET_SHIELDED_EVENT = parseAbiItem(
  "event AssetShielded(address indexed sender, address indexed token, uint256 amount, bytes encryptedPayload)"
);

// ── CoinGecko token ID map ─────────────────────────────────────────────────────
const COINGECKO_IDS: Record<string, string> = {
  [USDC_ADDRESS.toLowerCase()]: "usd-coin",
  "0x912ce59144191c1204e64559fe8253a0e49e6548": "arbitrum",   // ARB
  "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": "weth",        // WETH on Arb
};

// USDC is always $1 — skip API call
const STABLE_TOKENS = new Set([USDC_ADDRESS.toLowerCase()]);

// ── Types ──────────────────────────────────────────────────────────────────────
export interface DepositEvent {
  token: `0x${string}`;
  amount: bigint;       // raw wei
  blockNumber: bigint;
  txHash: `0x${string}`;
  blockTimestamp?: number; // unix seconds, fetched lazily
}

export interface EnclaveResult {
  proof_hash: string;
  pnl_percentage: string;  // e.g. "+42.50" or "-8.30"
  pnl_display: string;     // e.g. "+42.50%"
  verification_timestamp: number;
  deposits_analysed: number;
}

// ── Public client (read-only, no private key needed) ──────────────────────────
function getClient() {
  return createPublicClient({
    chain: arbitrumSepolia,
    transport: http(),
  });
}

// ── 1. Fetch on-chain deposit history ─────────────────────────────────────────
async function fetchDepositEvents(wallet: `0x${string}`): Promise<DepositEvent[]> {
  if (!VAULT_ADDRESS || VAULT_ADDRESS === "0x") return [];
  const client = getClient();

  const logs = await client.getLogs({
    address: VAULT_ADDRESS,
    event: ASSET_SHIELDED_EVENT,
    args: { sender: wallet },
    fromBlock: 0n,
    toBlock: "latest",
  });

  return logs.map(log => ({
    token:       log.args.token   as `0x${string}`,
    amount:      log.args.amount  as bigint,
    blockNumber: log.blockNumber  as bigint,
    txHash:      log.transactionHash as `0x${string}`,
  }));
}

// ── 2. Fetch block timestamps in batch ────────────────────────────────────────
async function enrichWithTimestamps(events: DepositEvent[]): Promise<DepositEvent[]> {
  const client = getClient();
  const blockNumbers = [...new Set(events.map(e => e.blockNumber))];

  const blockMap = new Map<bigint, number>();
  await Promise.all(
    blockNumbers.map(async bn => {
      try {
        const block = await client.getBlock({ blockNumber: bn });
        blockMap.set(bn, Number(block.timestamp));
      } catch {}
    })
  );

  return events.map(e => ({ ...e, blockTimestamp: blockMap.get(e.blockNumber) }));
}

// ── 3. Get token price via CoinGecko ──────────────────────────────────────────
async function getTokenPrice(tokenAddress: string, atUnixTimestamp?: number): Promise<number> {
  const addr = tokenAddress.toLowerCase();

  if (STABLE_TOKENS.has(addr)) return 1.0;

  const coinId = COINGECKO_IDS[addr];
  if (!coinId) return 1.0; // fallback: treat unknown token as $1

  try {
    if (atUnixTimestamp) {
      // Historical price: CoinGecko /coins/{id}/history?date=DD-MM-YYYY
      const date = new Date(atUnixTimestamp * 1000);
      const dd   = String(date.getUTCDate()).padStart(2, "0");
      const mm   = String(date.getUTCMonth() + 1).padStart(2, "0");
      const yyyy = date.getUTCFullYear();
      const url  = `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${dd}-${mm}-${yyyy}&localization=false`;
      const res  = await fetch(url, { next: { revalidate: 3600 } });
      const data = await res.json();
      return data?.market_data?.current_price?.usd ?? 1.0;
    } else {
      // Current price
      const url  = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
      const res  = await fetch(url, { next: { revalidate: 60 } });
      const data = await res.json();
      return data?.[coinId]?.usd ?? 1.0;
    }
  } catch {
    return 1.0;
  }
}

// ── 4. Core PnL calculation (runs entirely server-side / TEE boundary) ─────────
async function computePnL(
  wallet: `0x${string}`,
  events: DepositEvent[]
): Promise<{ initialValueUSD: number; currentValueUSD: number }> {
  if (events.length === 0) return { initialValueUSD: 0, currentValueUSD: 0 };

  // Group by token
  const byToken = new Map<string, DepositEvent[]>();
  for (const e of events) {
    const key = e.token.toLowerCase();
    if (!byToken.has(key)) byToken.set(key, []);
    byToken.get(key)!.push(e);
  }

  let initialValueUSD = 0;
  let currentValueUSD = 0;

  for (const [tokenAddr, deposits] of byToken.entries()) {
    const currentPrice = await getTokenPrice(tokenAddr);

    for (const dep of deposits) {
      // USDC has 6 decimals, everything else 18
      const decimals = tokenAddr === USDC_ADDRESS.toLowerCase() ? 6 : 18;
      const tokenAmount = parseFloat(formatUnits(dep.amount, decimals));

      // Historical price at deposit time
      const depositPrice = await getTokenPrice(tokenAddr, dep.blockTimestamp);

      initialValueUSD += tokenAmount * depositPrice;
      currentValueUSD += tokenAmount * currentPrice;
    }
  }

  return { initialValueUSD, currentValueUSD };
}

// ── 5. Deterministic proof hash (TEE attestation simulation) ─────────────────
function buildProofHash(
  wallet: string,
  initialValueUSD: number,
  pnlPercentage: number,
  timestamp: number
): string {
  // Only the result exits the enclave — never raw balances
  const payload = `${wallet}|${pnlPercentage.toFixed(6)}|${timestamp}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

// ── Main export: fetchAndComputePnL ───────────────────────────────────────────
export async function fetchAndComputePnL(
  wallet: `0x${string}`,
  // Optional overrides for manual input mode (dashboard form)
  manualInitial?: number,
  manualFinal?: number
): Promise<EnclaveResult> {
  const timestamp = Math.floor(Date.now() / 1000);

  let initialValueUSD: number;
  let currentValueUSD: number;
  let depositsAnalysed: number;

  if (manualInitial !== undefined && manualFinal !== undefined) {
    // Manual input mode: user provided initial/final directly
    initialValueUSD = manualInitial;
    currentValueUSD = manualFinal;
    depositsAnalysed = 0;
  } else {
    // Automatic mode: pull from on-chain event logs + live prices
    const rawEvents   = await fetchDepositEvents(wallet);
    const events      = await enrichWithTimestamps(rawEvents);
    depositsAnalysed  = events.length;
    ({ initialValueUSD, currentValueUSD } = await computePnL(wallet, events));
  }

  // Guard against divide-by-zero
  const pnlPercentage = initialValueUSD > 0
    ? ((currentValueUSD - initialValueUSD) / initialValueUSD) * 100
    : 0;

  const proof_hash = buildProofHash(wallet, initialValueUSD, pnlPercentage, timestamp);

  // Format display string — raw balances are NOT returned
  const sign       = pnlPercentage >= 0 ? "+" : "";
  const pnl_str    = pnlPercentage.toFixed(2);

  return {
    proof_hash,
    pnl_percentage:  `${sign}${pnl_str}`,
    pnl_display:     `${sign}${pnl_str}%`,
    verification_timestamp: timestamp,
    deposits_analysed: depositsAnalysed,
  };
}
