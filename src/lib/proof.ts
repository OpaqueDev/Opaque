export type AlphaProofStatus = "VALID" | "INVALID" | "EXPIRED" | "PENDING";

export type AlphaProofInput = {
  wallet: string;
  pnl: string | number;
  timestamp: number | string;
};

export type TEEAttestationMetadata = {
  status: "verified" | "pending" | "failed";
  workerId: string;
  computeTimestamp: number;
  inputPrivacy: string;
  outputRevealed: string;
  network: string;
  proofHash: string;
  isDemo: boolean;
};

export type AlphaProofRecord = AlphaProofInput & {
  proofId: string;
  alias?: string;
  riskScore?: string;
  riskAdjustedAlpha?: number;
  consistencyScore?: number;
  maxDrawdown?: string;
  winRate?: string;
  status?: AlphaProofStatus;
  demo?: boolean;
  attestation?: TEEAttestationMetadata;
};

export type VerificationResult = {
  status: AlphaProofStatus;
  message: string;
  expectedProofId?: string;
  record?: AlphaProofRecord;
};

export const PROOF_NETWORK = "Arbitrum Sepolia";
export const PROOF_COMPUTE_LAYER = "iExec Nox TEE";
export const PROOF_RISK_LAYER = "ChainGPT";

const PROOF_TTL_SECONDS = 180 * 24 * 60 * 60;

function hasValidWindowCrypto() {
  return typeof globalThis.crypto !== "undefined" && !!globalThis.crypto.subtle;
}

async function sha256Hex(payload: string) {
  if (!hasValidWindowCrypto()) {
    throw new Error("SHA-256 crypto provider unavailable");
  }

  const data = new TextEncoder().encode(payload);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeProofId(proofId: string) {
  return proofId.replace(/^0x/i, "").toLowerCase();
}

export function normalizePnl(pnl: string | number) {
  if (typeof pnl === "number") {
    return `${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}`;
  }

  const cleaned = pnl.trim().replace("%", "");
  const numeric = Number(cleaned);
  if (Number.isFinite(numeric)) {
    return `${numeric >= 0 ? "+" : ""}${numeric.toFixed(2)}`;
  }

  return cleaned;
}

export async function generateAlphaProof(input: AlphaProofInput) {
  const payload = `${input.wallet.toLowerCase()}${normalizePnl(input.pnl)}${Number(input.timestamp)}`;
  return sha256Hex(payload);
}

export function maskWallet(wallet?: string) {
  if (!wallet) return "0x0000...0000";
  if (wallet.length <= 12) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

export function formatProofTimestamp(timestamp?: number | string) {
  if (!timestamp) return "Not published";
  const numeric = Number(timestamp);
  const ms = numeric > 10_000_000_000 ? numeric : numeric * 1000;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(ms));
}

export function buildVerifyPath(proofId: string, input?: Partial<AlphaProofInput>) {
  const cleanProofId = normalizeProofId(proofId);
  const params = new URLSearchParams();

  if (input?.wallet) params.set("wallet", input.wallet);
  if (input?.pnl !== undefined) params.set("pnl", normalizePnl(input.pnl));
  if (input?.timestamp !== undefined) params.set("ts", String(input.timestamp));

  const query = params.toString();
  return `/verify/${cleanProofId}${query ? `?${query}` : ""}`;
}

export function buildMockAttestation(
  proofHash: string,
  timestamp: number | string,
  status: TEEAttestationMetadata["status"] = "verified",
): TEEAttestationMetadata {
  const cleanProof = normalizeProofId(proofHash);

  return {
    status,
    workerId: `nox-worker-${cleanProof.slice(0, 8) || "demo0000"}`,
    computeTimestamp: Number(timestamp),
    inputPrivacy: "encrypted",
    outputRevealed: "PnL only",
    network: PROOF_NETWORK,
    proofHash: cleanProof,
    isDemo: true,
  };
}

export const DEMO_ALPHA_PROOFS: AlphaProofRecord[] = [
  {
    alias: "Demo Prover",
    wallet: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    pnl: "+128.40",
    timestamp: 1777593600,
    proofId: "7b9982917eacd6f32a658537f9d14f953e07524251941f9016daa44ada13d559",
    riskScore: "A",
    riskAdjustedAlpha: 96,
    consistencyScore: 94,
    maxDrawdown: "-6.8%",
    winRate: "78%",
    status: "VALID" as const,
    demo: true,
  },
  {
    alias: "CipherFund",
    wallet: "0x1111111111111111111111111111111111111111",
    pnl: "+84.20",
    timestamp: 1777507200,
    proofId: "598a115e6f0fa825a01a1b13015d14934cbf32fa236922d521d0fb27392e0b78",
    riskScore: "A-",
    riskAdjustedAlpha: 91,
    consistencyScore: 88,
    maxDrawdown: "-8.4%",
    winRate: "72%",
    status: "VALID" as const,
    demo: true,
  },
  {
    alias: "NoxDelta",
    wallet: "0x2222222222222222222222222222222222222222",
    pnl: "+61.75",
    timestamp: 1777420800,
    proofId: "fdfde14ee4ff022703683b95f704e65614fcf8bd64b3e535a3c632323a05ea5a",
    riskScore: "B+",
    riskAdjustedAlpha: 86,
    consistencyScore: 91,
    maxDrawdown: "-4.9%",
    winRate: "69%",
    status: "VALID" as const,
    demo: true,
  },
  {
    alias: "SealedAlpha",
    wallet: "0x3333333333333333333333333333333333333333",
    pnl: "+44.10",
    timestamp: 1777334400,
    proofId: "c3c7b57630d0a25cec1ee23702009388d0616716f0066f87298d5d732bf14bbc",
    riskScore: "B",
    riskAdjustedAlpha: 79,
    consistencyScore: 83,
    maxDrawdown: "-7.2%",
    winRate: "64%",
    status: "VALID" as const,
    demo: true,
  },
  {
    alias: "PrivateYield",
    wallet: "0x4444444444444444444444444444444444444444",
    pnl: "+37.80",
    timestamp: 1777248000,
    proofId: "922e361bc96d432b2a1e1674887063ec3bf01e3c6a8c29f5b1484054340dd728",
    riskScore: "B",
    riskAdjustedAlpha: 74,
    consistencyScore: 82,
    maxDrawdown: "-5.5%",
    winRate: "61%",
    status: "VALID" as const,
    demo: true,
  },
  {
    alias: "MaskedMacro",
    wallet: "0x5555555555555555555555555555555555555555",
    pnl: "+22.45",
    timestamp: 1777161600,
    proofId: "7e5b903af9dbee767e5edc17ce64f4cd4f849f803f656a43915c29423b36a1c8",
    riskScore: "B-",
    riskAdjustedAlpha: 68,
    consistencyScore: 76,
    maxDrawdown: "-3.2%",
    winRate: "57%",
    status: "VALID" as const,
    demo: true,
  },
].map(record => ({
  ...record,
  attestation: buildMockAttestation(record.proofId, record.timestamp, "verified"),
}));

export function getMockProofRecord(proofId: string) {
  const cleanProofId = normalizeProofId(proofId);

  if (cleanProofId === "demo") {
    return DEMO_ALPHA_PROOFS[0];
  }

  return DEMO_ALPHA_PROOFS.find(record => normalizeProofId(record.proofId) === cleanProofId);
}

export async function verifyAlphaProof(
  proofId: string,
  input?: Partial<AlphaProofInput>,
): Promise<VerificationResult> {
  const cleanProofId = normalizeProofId(proofId);
  const registryRecord = getMockProofRecord(cleanProofId);

  if (!input?.wallet || input.pnl === undefined || input.timestamp === undefined) {
    if (registryRecord) {
      return {
        status: "VALID",
        message: registryRecord.demo
          ? "Valid demo proof found in the local OPAQUE proof registry."
          : "Valid proof found in the OPAQUE proof registry.",
        expectedProofId: registryRecord.proofId,
        record: registryRecord,
      };
    }

    return {
      status: "PENDING",
      message: "Proof metadata was not published with this link. Ask the prover for wallet, PnL, and timestamp inputs to recompute the hash.",
    };
  }

  const expectedProofId = await generateAlphaProof(input as AlphaProofInput);
  const timestamp = Number(input.timestamp);
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (Number.isFinite(timestamp) && nowSeconds - timestamp > PROOF_TTL_SECONDS) {
    return {
      status: "EXPIRED",
      message: "Proof inputs recomputed correctly, but the timestamp is outside the demo verification window.",
      expectedProofId,
      record: {
        wallet: input.wallet,
        pnl: input.pnl,
        timestamp,
        proofId: cleanProofId,
        status: "EXPIRED",
        attestation: buildMockAttestation(cleanProofId, timestamp, "pending"),
      },
    };
  }

  const isMatch = expectedProofId === cleanProofId;

  return {
    status: isMatch ? "VALID" : "INVALID",
    message: isMatch
      ? "SHA-256 proof recomputed successfully. Balance, holdings, strategy, and shielded amount remain hidden."
      : "The recomputed SHA-256 proof does not match the published Proof ID.",
    expectedProofId,
    record: {
      wallet: input.wallet,
      pnl: normalizePnl(input.pnl),
      timestamp,
      proofId: cleanProofId,
      status: isMatch ? "VALID" : "INVALID",
      attestation: buildMockAttestation(cleanProofId, timestamp, isMatch ? "verified" : "failed"),
    },
  };
}
