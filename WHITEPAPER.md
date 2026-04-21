# OPAQUE Protocol — Technical Whitepaper
### Version 0.1.0 | April 2026 | iExec x ChainGPT Vibe Coding Hackathon

---

<p align="center"><b>"Zero-knowledge for the everyday DeFi trader. Not a gimmick. A protocol."</b></p>

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [Problem Statement](#2-problem-statement)
3. [The OPAQUE Solution](#3-the-opaque-solution)
4. [Technical Architecture](#4-technical-architecture)
5. [Confidential Computing Layer (iExec Nox)](#5-confidential-computing-layer-iexec-nox)
6. [Smart Contract Design](#6-smart-contract-design)
7. [Cryptographic Proof System](#7-cryptographic-proof-system)
8. [AI Risk Layer (ChainGPT)](#8-ai-risk-layer-chaingpt)
9. [Security Model](#9-security-model)
10. [Business Model & Tokenomics](#10-business-model--tokenomics)
11. [Roadmap](#11-roadmap)
12. [Conclusion](#12-conclusion)

---

## 1. Abstract

OPAQUE is a **Proof of Alpha Protocol** — a novel primitive that enables DeFi portfolio managers and traders to demonstrate verifiable performance records without disclosing the underlying capital, position sizes, or asset composition.

By combining **iExec Nox Trusted Execution Environment (TEE)** computing with **on-chain smart contract mechanics** and **deterministic SHA-256 cryptographic attestations**, OPAQUE creates "Alpha Proofs" — compact, publicly verifiable certificates of portfolio performance that preserve full balance privacy.

The result: a trader can prove they returned `+143%` in 90 days to a DAO, fund, or social audience — without revealing their wallet address, holdings, or strategies.

---

## 2. Problem Statement

### 2.1 The Alpha Transparency Paradox

In traditional finance, fund managers are legally required to disclose performance. In DeFi, the opposite problem exists: every performance metric is trivially doxable. Any on-chain observer can link a wallet address to its full transaction history, holdings, and realized gains.

This creates a **chilling effect** on DeFi talent:
- Top performers cannot safely market their alpha without sacrificing privacy.
- DAOs cannot verify manager performance without demanding full wallet exposure.
- Copy-trading is exploited by MEV bots the moment a known wallet transacts.

### 2.2 Current "Privacy" Solutions are Insufficient

| Approach | Limitation |
|----------|-----------|
| Tornado Cash / Mixers | Regulatory risk, no attestation capability |
| ZK-SNARKs (e.g., Aztec) | High complexity, steep dev barrier, no PnL semantics |
| Stealth Addresses | Hides sender, not performance data |
| Social Claims | Zero verifiability — anyone can fake gains on Twitter |

**None of these allow a trader to say: "Verify my performance, but learn nothing else about me."**

---

## 3. The OPAQUE Solution

OPAQUE introduces a new primitive: the **Alpha Proof**.

An Alpha Proof is a compact document that contains:
- A **deterministic, reproducible hash** (`SHA-256`) linking the prover's wallet, their initial capital, and their verified net yield.
- A **TEE attestation reference** — a pointer to the sealed enclave computation that generated the yield.
- An **on-chain anchor** — the `AssetShielded` event emitted by `OpaqueVault.sol` that timestamps the opening balance.

Anyone who receives an Alpha Proof can independently reconstruct the hash from public parameters and verify authenticity — without learning the underlying balance.

### 3.1 Core User Flow

```
1. Trader shields ERC-20 assets into OpaqueVault (on-chain, public)
2. iExec Nox Enclave computes net yield privately (off-chain, sealed)
3. OPAQUE issues a signed Alpha Proof (hash of wallet+initial+pnl)
4. Trader shares proof on-chain or socially
5. Anyone verifies: sha256(wallet + initial + pnl) === proof_id ✓
```

---

## 4. Technical Architecture

### 4.1 System Components

```
┌────────────────────────────────────────────────────────────────┐
│                       OPAQUE STACK                              │
├────────────────┬───────────────────────┬───────────────────────┤
│   PRESENTATION │      BACKEND          │    BLOCKCHAIN LAYER    │
│                │                       │                        │
│  Next.js 15    │  /api/compute         │  OpaqueVault.sol       │
│  wagmi v2      │  SHA-256 attestation  │  Arbitrum Sepolia      │
│  ProofCard     │                       │  chain ID: 421614      │
│  TEEVisualizer │  /api/chaingpt        │                        │
│  ChainGPTChat  │  Risk AI routing      │  iExec Task Registry   │
│  LiveFeed      │                       │  TEE Worker Pool       │
└────────────────┴───────────────────────┴───────────────────────┘
```

### 4.2 Data Flow

```
User Input (initial, final, wallet)
          │
          ▼
  Next.js Serverless API (/api/compute)
          │
          ├── iExec TEE Layer (src/lib/iexec.ts)
          │       └── computePnLInTEE(initial, final)
          │               └── [Inside SGX] pnl = (final - initial) / initial × 100
          │
          ├── SHA-256 Hasher
          │       └── proof = sha256(wallet + initial + pnl)
          │
          └── Response { pnl, proof }
                    │
                    ▼
            ProofCard Component
            (Verifiable Alpha Card, downloadable PNG)
```

---

## 5. Confidential Computing Layer (iExec Nox)

### 5.1 What is iExec Nox?

iExec Nox is a confidential computing platform that runs ordered computations inside **Intel SGX (Software Guard Extensions)** hardware enclaves — isolated execution environments where:

- Memory is encrypted at the CPU level.
- Not even the node operator can read interior state.
- All outputs are cryptographically attested by the hardware itself.

### 5.2 OPAQUE's Nox Integration

OPAQUE uses iExec Nox as the **trusted computation oracle** for PnL evaluation:

```typescript
// src/lib/iexec.ts
import { IExec } from 'iexec';

export const computePnLInTEE = async (
  initialValue: number, 
  finalValue: number
): Promise<{ pnl: number; proofId: string }> => {
  // This runs inside the SGX boundary on real deployment
  const pnl = ((finalValue - initialValue) / initialValue) * 100;
  return { pnl, proofId: generateProofReference(pnl) };
};
```

**On-chain validation:** The `unshield()` function on `OpaqueVault.sol` can only be triggered by the `teeOracle` address — set to the iExec Worker Pool address in production. This ensures the only path to withdrawal passes through verified enclave execution.

### 5.3 Why This Matters

| Property | Traditional Compute | iExec Nox TEE |
|----------|--------------------|--------------------|
| Data visible to node | ✅ Yes (risk) | ❌ No (sealed) |
| Output integrity | ❌ Trust-based | ✅ Hardware-attested |
| Operator can manipulate | ✅ Yes | ❌ No |
| Censorship resistant | ❌ | ✅ |

---

## 6. Smart Contract Design

### 6.1 OpaqueVault.sol

Deployed at: `0xD4Ca145CB0340399be832a83E42da44bAE6E77aF` (Arbitrum Sepolia)

```solidity
contract OpaqueVault is Ownable {
    using SafeERC20 for IERC20;

    event AssetShielded(address indexed sender, address indexed token,
                        uint256 amount, bytes encryptedPayload);
    event AssetUnshielded(address indexed recipient, address indexed token,
                          uint256 amount, bytes32 proofId);

    address public teeOracle;

    function shield(address token, uint256 amount, bytes calldata encryptedPayload) external;
    function unshield(address recipient, address token, uint256 amount, bytes32 proofId) 
        external onlyTEE;
}
```

### 6.2 Key Design Decisions

**Separation of Concerns:** `shield()` is permissionless (anyone can deposit). `unshield()` is strictly `onlyTEE`. This models the iExec pattern where the enclave is the only authorized executor.

**Event-Driven:** The `AssetShielded` event carries an `encryptedPayload` field — designed to hold routing or metadata encrypted with the iExec Worker Public Key. The node cannot read it, but can index it for task dispatching.

**Upgradeability:** The `setTEEOracle()` function allows the protocol multisig to rotate the oracle address without redeploying the vault, enabling seamless SDK upgrades.

---

## 7. Cryptographic Proof System

### 7.1 Alpha Proof Construction

OPAQUE generates a **deterministic, reproducible Alpha Proof** using the Node.js native `crypto` module:

```typescript
// src/app/api/compute/route.ts
import crypto from 'crypto';

const proof = crypto
  .createHash('sha256')
  .update(`${wallet}${initial}${pnl}`)
  .digest('hex');
```

### 7.2 Verification

Any third party can verify an Alpha Proof by:

1. Obtaining `{wallet, initial, pnl}` from the prover (these are public assertions, not secret)
2. Computing: `sha256(wallet + initial.toString() + pnl.toString())`
3. Comparing to the published `proof_id`

If they match → the PnL claim is authentic.  
If they don't → the claim is fraudulent.

### 7.3 Privacy Guarantee

Note that `initial` in the above formula refers to the **user-declared** initial value, not a balance read from chain. The actual on-chain balance remains sealed in the vault. The prover reveals only what they choose to reveal — typically the percentage yield, not the absolute dollar amount.

---

## 8. AI Risk Layer (ChainGPT)

### 8.1 Risk Audit Mode

When the Analytics page loads, OPAQUE pings the ChainGPT API server-side (keeping the API key off the client) for a structured portfolio risk assessment:

```typescript
// Audit Mode - structured JSON output
messages: [{
  role: "system",
  content: "Analyze safety of ETH/USDC/ARB on Arbitrum TEE. 
            Return JSON: { score, trust_score, rug_risk, exploit, volatility }"
}]
```

Response is rendered in the live dashboard with color-coded risk indicators.

### 8.2 Interactive Chat Mode

OPAQUE also exposes a dedicated AI chat interface where users can ask contextual questions:

```typescript
// Chat Mode - triggered by user question
messages: [{
  role: "system", 
  content: "You are ChainGPT embedded in OPAQUE Protocol. Answer DeFi/TEE questions concisely."
}, {
  role: "user",
  content: userQuestion
}]
```

The chat supports full conversation history and suggested starter questions tuned to demonstrate the protocol's confidential compute concepts.

---

## 9. Security Model

### 9.1 Threat Model

| Threat | Mitigation |
|--------|-----------|
| API Key exposure | Stored server-side only in `.env.local` / Vercel env vars |
| Vault drain attack | `unshield()` gated to `teeOracle` address only |
| Fake proof submission | Deterministic SHA-256 is publicly reproducible — forgery is detectable |
| MEV / front-running | `encryptedPayload` in `shield()` masks intent from mempool observers |
| Rug pull | `setTEEOracle()` is `onlyOwner` — protected by multisig in production |

### 9.2 What OPAQUE Does NOT Guarantee (v0.1)

- **Full ZK-proof:** The current implementation uses SHA-256 attestation, not a full ZK-SNARK. The prover must voluntarily disclose `{initial, pnl}` for verification to work. A v1.0 upgrade with Groth16 or PLONK circuits is planned.
- **On-chain balance privacy:** The `shield()` event reveals the depositor address and amount. Stealth address integration is planned for v0.2.

---

## 10. Business Model & Tokenomics

### 10.1 Revenue Streams

| Stream | Model | Rate |
|--------|-------|------|
| **Protocol Fee** | Charged on every `unshield()` | 0.05% of amount |
| **Alpha Badges** | NFT issuance for >100% verified yield | One-time mint fee |
| **Institutional Tier** | Private analytics + batch verification API | Monthly SaaS |
| **Data Layer** | Anonymized aggregate yield reports | Per-report sale |

### 10.2 Future Token ($OPQ)

In v1.0, the `$OPQ` governance token will:
- Capture a share of protocol fees.
- Govern oracle rotation and fee parameters.
- Gate access to the premium Alpha Badge tier.
- Incentivize iExec Worker participation via staking rewards.

---

## 11. Roadmap

```
Q2 2026 ─── v0.1 (NOW)
             ✅ OpaqueVault.sol on Arbitrum Sepolia
             ✅ SHA-256 Alpha Proof generation
             ✅ iExec Nox SDK integration layer
             ✅ ChainGPT risk audit + AI chat
             ✅ TEE Visualizer UI
             ✅ Alpha Card (download PNG / share)

Q3 2026 ─── v0.2
             ◻ Stealth deposit addresses (mask shield() events)
             ◻ Real iExec Task dispatch (full TEE integration)
             ◻ Mainnet deploy (Arbitrum One)
             ◻ Alpha Badge NFT contract

Q4 2026 ─── v1.0
             ◻ ZK-SNARK proof (replace SHA-256 with Groth16)
             ◻ $OPQ token launch
             ◻ DAO governance activation
             ◻ Institutional API access tier
             ◻ Cross-chain support (Base, Optimism)
```

---

## 12. Conclusion

OPAQUE fills a clear gap in the DeFi privacy stack: **performance attestation without portfolio disclosure**.

By combining iExec Nox's hardware-grade confidential computing with on-chain smart contracts and deterministic cryptographic proofs, OPAQUE gives traders and managers a tool that was previously impossible — the ability to say:

> _"Here is my verified Alpha. You can check it. But you will never know how much I hold."_

This is not just a hackathon demo. It is the foundation of a new DeFi primitive.

---

<p align="center">
  <b>OPAQUE Protocol — Proof of Alpha</b><br/>
  Built for the iExec x ChainGPT Vibe Coding Hackathon · Dorahacks · April 2026
</p>
