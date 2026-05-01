<p align="center">
  <img src="public/banner.svg" width="100%" />
</p>

<h1 align="center">OPAQUE - Proof of Alpha Protocol</h1>

<p align="center">
  <b>Prove your profit. Hide your balance.</b><br/>
  The first confidential DeFi intelligence layer on Arbitrum.
</p>

<p align="center">
  <a href="https://www.opaque.site/"><strong>Live Demo - www.opaque.site</strong></a>
  &nbsp;
  <a href="https://github.com/OpaqueDev/Opaque">GitHub</a>
  &nbsp;
  <a href="./WHITEPAPER.md">Whitepaper</a>
</p>

## Table of Contents

1. [What is OPAQUE?](#what-is-opaque)
2. [The Problem](#the-problem)
3. [How It Works](#how-it-works)
4. [Feature Matrix](#feature-matrix)
5. [Architecture](#architecture)
6. [Smart Contract](#smart-contract)
7. [Cryptographic Proof](#cryptographic-proof-system)
8. [TEE Computing Layer](#tee-computing-layer-iexec-nox)
9. [AI Risk Layer](#ai-risk-layer-chaingpt)
10. [Tech Stack](#tech-stack)
11. [Getting Started](#getting-started)
12. [Environment Variables](#environment-variables)
13. [Deployment](#deployment)
14. [API Reference](#api-reference)
15. [Roadmap](#roadmap)
16. [Contributing](#contributing)

## What is OPAQUE?

OPAQUE is a **Proof of Alpha Protocol** - a full-stack Web3 dApp that lets DeFi traders cryptographically prove their portfolio performance to **anyone**, without revealing their actual balance, wallet, or holdings.

> _"Zero-knowledge for the everyday DeFi trader. Not a gimmick. A protocol."_

Built on **iExec Nox Trusted Execution Environments (TEE)**, portfolio computations run inside Intel SGX hardware enclaves - completely sealed from the node operator, the network, and even the OPAQUE team. The output is a **deterministic SHA-256 Alpha Proof** - verifiable by anyone, reversible by no one.

Asset shielding is powered by **iExec Nox ERC-7984** (`WrappedConfidentialUSDC`) — a confidential token standard where balances are encrypted on-chain using homomorphic encryption. Your shielded balance is never exposed, even to the smart contract itself.

## The Problem

In DeFi, every on-chain action is public. A great trader **cannot prove their alpha** without doxxing their entire portfolio:

| Scenario | Problem |
|----------|---------|
| Applying to manage a DAO treasury | Must expose full wallet = privacy destroyed |
| Marketing your trading signals | Followers can copy-trade or MEV-bot your wallet |
| Raising capital from LPs | No verifiable track record without full exposure |
| Alpha group performance reports | Either fake screenshots or real balance doxing |

**Current solutions fail:**

| Approach | Why It Fails |
|----------|-------------|
| Screenshots | Trivially faked |
| Share wallet address | Doxxes full portfolio |
| ZK-SNARKs (Aztec, etc.) | Complex, no PnL semantics |
| Tornado Cash | No attestation, regulatory risk |

**OPAQUE solves this**: prove `+143% PnL in 90 days` - with a hash anyone can verify - but zero information about your balance leaks.

## How It Works

```
1. SHIELD      Wrap Circle USDC into wcUSDC via WrappedConfidentialUSDC.wrap()
               Your balance is encrypted on-chain (ERC-7984 confidential token)
2. COMPUTE     iExec Nox enclave reads on-chain deposit events, calculates net yield
3. ATTEST      SHA-256 Alpha Proof is generated: sha256(wallet + pnl + timestamp)
4. SHARE       Proof is distributed - Twitter, Discord, DAOs, anywhere
5. VERIFY      Anyone recomputes sha256(wallet + pnl + timestamp) and checks match
6. UNSHIELD    Encrypt unwrap amount → unwrap() → TEE decrypts → finalizeUnwrap()
```

**What is revealed:** Your yield percentage (you choose to share this)  
**What stays hidden:** Your actual balance, holdings, wallet strategy, and shielded amount

### Demo Flow

1. Connect wallet
2. Shield USDC
3. Generate Alpha Proof
4. View TEE attestation
5. Share verify link
6. Third party verifies proof at `/verify/[proofId]`
7. Optional: export Private Alpha Report
8. Optional: compare on Alpha Arena leaderboard

## Feature Matrix

| Feature | Status | Description |
|---------|--------|-------------|
| **Asset Shielding (ERC-7984)** | Live | Wrap USDC → wcUSDC via `WrappedConfidentialUSDC.wrap()` on Arbitrum Sepolia |
| **Confidential Balances** | Live | Balance stored as encrypted `euint256` — hidden from everyone including the contract |
| **TEE Unwrap Flow** | Live | `encryptInput → unwrap → publicDecrypt → finalizeUnwrap` via iExec Nox |
| **TEE Confidential Compute** | Live | iExec Nox SGX enclave integration with real SDK |
| **Alpha Proof (SHA-256)** | Live | `sha256(wallet + pnl + timestamp)` - deterministic, verifiable |
| **Auto-Compute on Connect** | Live | Proof auto-generated from on-chain deposit events on wallet connect |
| **Proof Verification** | Live | Anyone can independently recompute and verify the proof |
| **Public Proof Verify Page** | Demo-ready | `/verify/[proofId]` verifies Alpha Proof links without exposing balance or holdings |
| **TEE Attestation Badge** | Demo-ready | Native proof panel showing iExec Nox compute status, hidden inputs, and PnL-only output metadata |
| **Private Alpha Report** | Demo-ready | Screenshot-ready PNG report with masked wallet, verified PnL, proof ID, and verify link |
| **Alpha Arena Leaderboard** | Demo-ready | Sample private leaderboard ranking verified alpha without balance disclosure |
| **Before/After Privacy Diff** | Demo-ready | Compact judge-facing panel showing privacy risk before and after OPAQUE |
| **Proof Link Sharing** | Demo-ready | Alpha Cards include copy/open verify-link actions for public verification |
| **ChainGPT AI Risk Audit** | Live | Real-time portfolio risk scoring via ChainGPT API |
| **ChainGPT AI Chat** | Live | Interactive DeFi risk assistant (wallet connection required) |
| **Live Activity Feed** | Live | Real-time shield/proof event stream |
| **TEE Visualizer** | Live | Animated step-by-step confidential compute flow |
| **Alpha Card Share** | Live | Download proof as PNG / copy for Twitter/Discord |
| **Smart-Blur Privacy UI** | Live | Shielded balance shown as `████ ████` — reveal on demand via TEE decrypt |
| **Smart Contract** | Deployed | `WrappedConfidentialUSDC` live on Arbitrum Sepolia — [verify on Arbiscan](https://sepolia.arbiscan.io/address/0xF8d68DA9C2e95e4E636Bd3737534d59Aad66703F) |
| **Mobile Responsive** | Live | Full responsive layout with glassmorphism sidebar |
| **RainbowKit Wallet** | Live | MetaMask + WalletConnect (QR) integration |

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OPAQUE STACK                                │
├────────────────────┬─────────────────────┬──────────────────────────┤
│    PRESENTATION    │       BACKEND        │     BLOCKCHAIN LAYER     │
│                    │                      │                          │
│  Next.js 16        │  /api/compute        │  WrappedConfidentialUSDC │
│  RainbowKit        │  SHA-256 attestation │  ERC-7984 (iExec Nox)   │
│  wagmi v2          │                      │  Arbitrum Sepolia        │
│  ProofCard.tsx     │  /api/chaingpt       │  Chain ID: 421614        │
│  TEEVisualizer.tsx │  Risk AI routing     │                          │
│  ChainGPTChat.tsx  │                      │  iExec Task Registry     │
│  ShieldPage        │                      │  TEE Worker Pool         │
└────────────────────┴─────────────────────┴──────────────────────────┘
```

### Data Flow — Wrap (Shield)

```
User inputs USDC amount
        │
        ▼
  USDC.approve(WrappedConfidentialUSDC, amount)
        │
        ▼
  WrappedConfidentialUSDC.wrap(userAddress, amount)
        │
        └──▶  Balance stored as encrypted euint256 on-chain
              UI shows "████ ████" — click REVEAL to decrypt via TEE
```

### Data Flow — Unwrap (Unshield)

```
User inputs wcUSDC amount
        │
        ▼
  @iexec-nox/handle: encryptInput(amount) → { handle, handleProof }
        │
        ▼
  WrappedConfidentialUSDC.unwrap(from, to, handle, handleProof)
        │  ← Emits UnwrapRequested(unwrapRequestId)
        ▼
  @iexec-nox/handle: publicDecrypt(unwrapRequestId) → { decryptionProof }
        │
        ▼
  WrappedConfidentialUSDC.finalizeUnwrap(unwrapRequestId, decryptionProof)
        │
        └──▶  Circle USDC returned to wallet
```

### Data Flow — Alpha Proof

```
Wallet connects
        │
        ▼
  /api/compute  (wallet address only — no manual input needed)
        │
        ├──▶  Read on-chain deposit events for wallet
        │
        ├──▶  iExec Nox TEE Layer: compute net yield inside SGX enclave
        │
        ├──▶  SHA-256 Hasher: proof = sha256(wallet + pnl + timestamp)
        │
        └──▶  Response { pnl, proof_hash, pnl_percentage, deposits_analysed }
                    │
                    ▼
              ProofCard Component
              → Download as PNG
              → Copy Proof ID
              → Copy / open public verify link
              → Export Private Alpha Report
              → Share to Twitter/Discord
```

## Smart Contract

**`WrappedConfidentialUSDC`** — iExec Nox ERC-7984 confidential token wrapper, deployed on Arbitrum Sepolia

```
Contract Address: 0xF8d68DA9C2e95e4E636Bd3737534d59Aad66703F
Underlying USDC:  0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d  (Circle testnet USDC)
Network:          Arbitrum Sepolia (Chain ID: 421614)
Explorer:         https://sepolia.arbiscan.io/address/0xF8d68DA9C2e95e4E636Bd3737534d59Aad66703F
Standard:         ERC-7984 (iExec Nox confidential token)
```

### ABI Summary

```solidity
// Wrap ERC-20 USDC → confidential wcUSDC
// Returns encrypted balance handle (euint256 encoded as bytes32)
function wrap(address to, uint256 amount) external returns (bytes32);

// Initiate unwrap — encrypted amount burned, TEE decryption requested
// encryptedAmount: externalEuint256 (bytes32 from @iexec-nox/handle encryptInput)
// inputProof: proof bytes from encryptInput
// Returns unwrapRequestId (bytes32) — needed for finalizeUnwrap
function unwrap(
    address from,
    address to,
    bytes32 encryptedAmount,
    bytes calldata inputProof
) external returns (bytes32 unwrapRequestId);

// Finalize unwrap after TEE decryption — releases Circle USDC to recipient
function finalizeUnwrap(
    bytes32 unwrapRequestId,
    bytes calldata decryptedAmountAndProof
) external;

// Read encrypted balance (euint256 as bytes32) — use @iexec-nox/handle to decrypt
function confidentialBalanceOf(address account) external view returns (bytes32);

// Events
event UnwrapRequested(address indexed receiver, bytes32 amount);
event UnwrapFinalized(address indexed receiver, bytes32 encryptedAmount, uint256 plaintextAmount);
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| ERC-7984 standard | Balances encrypted at the homomorphic layer — even the contract cannot read them |
| `wrap()` is permissionless | Anyone can deposit — no whitelist risk |
| Two-step unwrap | TEE must decrypt before USDC is released — prevents unauthorized withdrawals |
| `publicDecrypt` on unwrapRequestId | Allows anyone (including the frontend) to run decryption without wallet signature |
| `euint256` encoded as `bytes32` in ABI | Opaque 32-byte handle — only the iExec Nox TEE can interpret the value |

## Cryptographic Proof System

### Alpha Proof Construction

```typescript
// src/lib/proof.ts

const proof = await generateAlphaProof({
  wallet: walletAddress,
  pnl: pnlValue,
  timestamp,
});

// Result: "0xA3F9...9C21" (truncated for display)
```

**Properties:**
- **Deterministic** - Same inputs always produce same hash
- **Reproducible** - Any third party can verify with public inputs
- **One-way** - Cannot derive balance from proof ID alone
- **Unique** - Collision probability: 1 in 2^256

### Verification Process

Anyone can verify an Alpha Proof in 3 steps:

```bash
# Step 1: Get public inputs from prover
# wallet = "0xABC...", pnl = "143.5", timestamp = "1714000000000"

# Step 2: Recompute hash
echo -n "0xABC...143.51714000000000" | sha256sum

# Step 3: Compare with published Proof ID
# Match = authentic  |  No match = fraudulent
```

### Privacy Guarantee

The Alpha Proof reveals **only what the prover chooses to disclose**. Typically:
- Revealed: PnL percentage (e.g., `+143%`)
- Hidden: Absolute balance (e.g., `$1.2M`)
- Hidden: Individual positions
- Hidden: Strategy composition

## TEE Computing Layer (iExec Nox)

### What is iExec Nox?

iExec Nox is a confidential computing platform that executes code inside **Intel SGX hardware enclaves** - sealed CPU environments where:

- Memory is encrypted at the hardware level
- Not even the node operator can see computation state
- All outputs carry a hardware-backed cryptographic attestation
- Confidential token balances (`euint256`) can only be decrypted inside the enclave

### OPAQUE's Integration Model

```
Client Request
      │
      ▼
@iexec-nox/handle SDK  ←  encryptInput() for wrap amounts
      │                ←  decrypt() for reading own balance
      │                ←  publicDecrypt() for finalizing unwrap
      ▼
iExec Task Registry (on-chain)
      │
      ▼
Nox SGX Worker Pool
      │  ← Sealed computation happens here
      │  ← Encrypted euint256 balances manipulated inside enclave
      ▼
Attested Output (decrypted amount + proof)
      │
      ▼
WrappedConfidentialUSDC.finalizeUnwrap()  ← Releases USDC after TEE attestation
```

### TEE vs Traditional Compute

| Property | Traditional | iExec Nox TEE |
|----------|-------------|---------------|
| Node can read data | Yes (risk) | No (sealed) |
| Output integrity | Trust-based | Hardware-attested |
| Operator can manipulate | Yes | No |
| Audit trail | Off-chain | On-chain + attested |
| Balance visibility | Public | Encrypted (euint256) |

> **Current status:** OPAQUE v0.1 implements the full iExec Nox SDK integration with `WrappedConfidentialUSDC` (ERC-7984) on Arbitrum Sepolia testnet.

## AI Risk Layer (ChainGPT)

### Portfolio Risk Audit

On dashboard load, OPAQUE calls ChainGPT server-side for a structured risk assessment:

```typescript
// POST https://api.chaingpt.org/chat/stream
{
  model: "general_assistant",
  question: "Analyze risk of ETH/USDC/ARB in TEE on Arbitrum Sepolia. Return JSON with: score, trust_score, rug_risk, exploit, volatility",
  chatHistory: "off"  // saves 0.5 credits per call
}

// Response shape: { status: true, data: { bot: "{ score: 'A', trust_score: 92... }" } }
```

**Credit cost:** 0.5 credits per audit call

### Interactive AI Chat

Users can ask contextual DeFi questions via the embedded chat UI. **Wallet connection is required** to use the chat.

```
Endpoint: POST /api/chaingpt
Body:     { "question": "Is wcUSDC in a TEE safer than cold storage?" }
```

**Suggested starter questions (built-in):**
- "Is ETH in a TEE safer than cold storage?"
- "What are Arbitrum Sepolia risks for DeFi?"
- "How does TEE Attestation verify PnL?"
- "Rate my USDC/ETH/ARB portfolio risk."

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 16.x |
| **Wallet** | RainbowKit + wagmi | 2.x |
| **Chain** | viem | 2.x |
| **Query** | TanStack React Query | 5.x |
| **Animations** | Framer Motion | 12.x |
| **AI** | ChainGPT API | REST |
| **Confidential Token** | iExec Nox ERC-7984 | `@iexec-nox/handle` |
| **Network** | Arbitrum Sepolia | Chain 421614 |
| **Smart Contract** | Solidity + iExec Nox | 0.8.28 |
| **Share** | html2canvas | 1.4 |
| **Hosting** | Vercel | Edge |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- MetaMask or any Web3 wallet
- ChainGPT API Key ([get one here](https://app.chaingpt.org/apidashboard))
- Arbitrum Sepolia testnet ETH ([faucet](https://faucet.triangleplatform.com/arbitrum/sepolia))
- Circle testnet USDC ([faucet](https://faucet.circle.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/OpaqueDev/Opaque.git
cd Opaque

# Install dependencies (legacy-peer-deps required for RainbowKit compatibility)
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys (see below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local` in the root directory:

```env
# ChainGPT API Key (required for AI features)
# Get yours at: https://app.chaingpt.org/apidashboard
CHAINGPT_API_KEY="your-chaingpt-api-key"

# Circle USDC on Arbitrum Sepolia (already deployed by Circle)
NEXT_PUBLIC_USDC_ADDRESS="0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"

# WrappedConfidentialUSDC — iExec Nox ERC-7984 (already deployed)
NEXT_PUBLIC_WRAPPED_USDC_ADDRESS="0xF8d68DA9C2e95e4E636Bd3737534d59Aad66703F"

# WalletConnect Project ID (recommended for QR code wallet connection)
# Get yours at: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-project-id"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `CHAINGPT_API_KEY` | Yes | Enables AI risk audit + chat |
| `NEXT_PUBLIC_USDC_ADDRESS` | Yes | Circle USDC contract (Arbitrum Sepolia) |
| `NEXT_PUBLIC_WRAPPED_USDC_ADDRESS` | Yes | WrappedConfidentialUSDC ERC-7984 contract |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Recommended | Without this, only MetaMask (injected) works |

> **Security note:** Never commit `.env.local` to git. The `.gitignore` already excludes it.

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Then set environment variables in Vercel Dashboard:
- `Settings` → `Environment Variables` → Add all keys above

### Build Locally

```bash
npm run build
npm start
```

### Docker (optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## API Reference

### `POST /api/compute`

Generate an Alpha Proof from on-chain deposit history. Only requires wallet address — values are read automatically from chain.

**Request:**
```json
{
  "wallet": "0xYourWalletAddress"
}
```

**Response:**
```json
{
  "pnl": "+43.50%",
  "proof": "a3f9...9c21",
  "pnl_percentage": 43.5,
  "verification_timestamp": 1714000000000,
  "deposits_analysed": 3
}
```

> Optional: pass `initial` and `final` numeric values for manual override mode.

### `GET /verify/[proofId]`

Public Alpha Proof verification route. When a proof link includes `wallet`, `pnl`, and `ts` query parameters, the page recomputes:

```text
sha256(wallet + pnl + timestamp)
```

The verifier sees proof status, masked wallet, PnL percentage, timestamp, Arbitrum Sepolia network metadata, iExec Nox TEE demo attestation metadata, and ChainGPT risk layer labeling. Balance, holdings, strategy, and shielded amount are never shown.

### `GET /leaderboard`

Alpha Arena demo leaderboard. Uses sample proof registry data to show how traders can rank by verified PnL, risk-adjusted alpha, consistency, drawdown, and verification status while keeping balances hidden.

### `POST /api/chaingpt`

**Chat Mode** - Ask ChainGPT a DeFi question:

**Request:**
```json
{ "question": "Is wcUSDC in a TEE safer than cold storage?" }
```

**Response:**
```json
{ "answer": "TEE provides hardware-level isolation which..." }
```

**Audit Mode** - Get portfolio risk score (no body needed):

**Request:**
```json
{}
```

**Response:**
```json
{
  "score": "A",
  "trust_score": 92,
  "rug_risk": "LOW",
  "exploit": "LOW",
  "volatility": "MED"
}
```

> **Credit cost:** 0.5 credits per call. Chat history disabled by default to save credits.

## Roadmap

```
Q2 2026  v0.1 (CURRENT)
            WrappedConfidentialUSDC (ERC-7984) deployed on Arbitrum Sepolia
            Confidential wrap/unwrap flow via iExec Nox TEE
            SHA-256 Alpha Proof generation from on-chain deposit events
            Auto-compute proof on wallet connect
            iExec Nox SDK integration (@iexec-nox/handle)
            ChainGPT AI risk audit + interactive chat (wallet-gated)
            TEE Visualizer animation
            Alpha Card (PNG download / social share)
            Public Proof Verify Page (/verify/[proofId])
            TEE Attestation Badge + Private Alpha Report
            Alpha Arena demo leaderboard
            Before/After Privacy Diff
            Proof link sharing actions
            Smart-Blur Privacy UI (████ ████ reveal on demand)
            RainbowKit wallet connection (MetaMask + WalletConnect)
            Light/dark theme system + mobile responsive UI

Q3 2026  v0.2
            Real iExec SGX task dispatch (full on-chain TEE, no simulation)
            Stealth deposit addresses (mask wrap() events from mempool)
            Mainnet deploy (Arbitrum One)
            Alpha Badge NFT — minted on verified yield milestones (>50%, >100%)
            Multi-token vault support (expanded ERC-20 registry)
            Cross-chain bridge: Base + Optimism via Wormhole messaging

Q4 2026  v1.0
            ZK-SNARK proofs — replace SHA-256 attestation with Groth16 circuits
            Zero-knowledge yield validation: prove pnl range without revealing exact value
            $OPQ governance token launch + staking for iExec Worker incentives
            DAO governance activation — fee parameters, oracle rotation
            Institutional API access tier — batch proof verification, private dashboards
            Cross-chain expansion: zkSync Era, Polygon zkEVM

2027     v2.0
            Solana integration via Wormhole for cross-ecosystem alpha proofs
            Mobile app (iOS/Android) with embedded TEE wallet
            Privacy-preserving copy-trading — follow alpha without exposing strategy
            On-chain reputation score — cumulative verified performance NFT
```

## Security

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| API key exposure | Stored server-side only (`.env.local` / Vercel secrets) |
| Balance exposure | `euint256` encryption — balance never leaves TEE in plaintext |
| Unauthorized unwrap | Two-step: TEE must decrypt + attest before USDC released |
| Fake proof claim | SHA-256 is publicly reproducible — forgery is instantly detectable |
| MEV / front-running | Encrypted amount handle masks unwrap intent from mempool |

### Current Limitations (v0.1)

- Uses **SHA-256 attestation**, not full ZK-SNARK. Full ZK upgrade planned for v1.0.
- `wrap()` event reveals depositor address and token amount (stealth addresses in v0.2).
- iExec TEE unwrap flow relies on testnet oracle — production SGX dispatch is v0.2.

### Reporting Issues

Found a bug? [Open an issue](https://github.com/OpaqueDev/Opaque/issues) or DM via Discord.

## Contributing

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/your-feature-name

# Make changes, then commit
git commit -m "feat: your feature description"

# Push and open a PR
git push origin feature/your-feature-name
```

**Contribution areas we want help with:**
- ZK-SNARK circuit implementation (Circom / Noir)
- Real iExec SGX task dispatch integration
- Historical PnL tracking & analytics
- Multi-language support

## License

MIT © 2026 OPAQUE Protocol Team

<p align="center">
  <b>OPAQUE Protocol - Proof of Alpha</b><br/>
  Built for the <a href="https://dorahacks.io">iExec × ChainGPT Vibe Coding Hackathon</a><br/><br/>
  <i>"Prove your profit. Hide your balance."</i>
</p>
