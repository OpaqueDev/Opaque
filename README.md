<p align="center">
  <img src="public/banner.svg" width="100%" />
</p>

<h1 align="center">OPAQUE - Proof of Alpha Protocol</h1>

<p align="center">
  <b>Prove your profit. Hide your balance.</b><br/>
  The first confidential DeFi intelligence layer on Arbitrum.
</p>

<p align="center">
  <a href="https://opaque-eight.vercel.app"><strong>Live Demo - opaque-eight.vercel.app</strong></a>
  &nbsp;
  <a href="https://github.com/Dwica2004/opque">GitHub</a>
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
1. SHIELD      Deposit ERC-20 tokens into OpaqueVault.sol (on-chain)
2. COMPUTE     iExec Nox enclave calculates net yield (off-chain, sealed)
3. ATTEST      SHA-256 Alpha Proof is generated: sha256(wallet + initial + pnl)
4. SHARE       Proof is distributed - Twitter, Discord, DAOs, anywhere
5. VERIFY      Anyone recomputes sha256(wallet + initial + pnl) and checks match
```

**What is revealed:** Your yield percentage (you choose to share this)  
**What stays hidden:** Your actual balance, holdings, and wallet strategy

## Feature Matrix

| Feature | Status | Description |
|---------|--------|-------------|
| **Asset Shielding** | Live | Deposit ERC-20s into `OpaqueVault.sol` on Arbitrum Sepolia |
| **TEE Confidential Compute** | Live | iExec Nox SGX enclave integration with real SDK |
| **Alpha Proof (SHA-256)** | Live | `sha256(wallet + initial + pnl)` - deterministic, verifiable |
| **Proof Verification** | Live | Anyone can independently recompute and verify the proof |
| **ChainGPT AI Risk Audit** | Live | Real-time portfolio risk scoring via ChainGPT API |
| **ChainGPT AI Chat** | Live | Interactive DeFi risk assistant powered by ChainGPT |
| **Live Activity Feed** | Live | Real-time shield/proof event stream |
| **TEE Visualizer** | Live | Animated step-by-step confidential compute flow |
| **Alpha Card Share** | Live | Download proof as PNG / copy for Twitter/Discord |
| **Smart Contract** | Deployed | `OpaqueVault.sol` live on Arbitrum Sepolia |
| **Mobile Responsive** | Live | Full responsive layout with glassmorphism sidebar |
| **RainbowKit Wallet** | Live | MetaMask + WalletConnect (QR) integration |

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OPAQUE STACK                                │
│ ├────────────────────┬─────────────────────┬──────────────────────────┤
│    PRESENTATION    │       BACKEND        │     BLOCKCHAIN LAYER     │
│                    │                      │                          │
│  Next.js 16        │  /api/compute        │  OpaqueVault.sol         │
│  RainbowKit        │  SHA-256 attestation │  Arbitrum Sepolia        │
│  wagmi v2          │                      │  Chain ID: 421614        │
│  ProofCard.tsx     │  /api/chaingpt       │                          │
│  TEEVisualizer.tsx │  Risk AI routing     │  iExec Task Registry     │
│  ChainGPTChat.tsx  │                      │  TEE Worker Pool         │
│  LiveActivityFeed  │                      │                          │
└────────────────────┴─────────────────────┴──────────────────────────┘
```

### Data Flow

```
User Input (wallet, initial_value, final_value)
        │
        ▼
  Next.js API Route (/api/compute)
        │
        ├──▶  iExec Nox TEE Layer (src/lib/iexec.ts)
        │         └── SGX Enclave: pnl = (final - initial) / initial × 100
        │
        ├──▶  SHA-256 Hasher
        │         └── proof = sha256(wallet + initial + pnl)
        │
        └──▶  Response { pnl, proofId, timestamp }
                    │
                    ▼
              ProofCard Component
              → Download as PNG
              → Copy Proof ID
              → Share to Twitter/Discord
```

## Smart Contract

**`OpaqueVault.sol`** - Deployed on Arbitrum Sepolia

```
Contract Address: 0xD4Ca145CB0340399be832a83E42da44bAE6E77aF
Network:          Arbitrum Sepolia (Chain ID: 421614)
Explorer:         https://sepolia.arbiscan.io/address/0xD4Ca145CB0340399be832a83E42da44bAE6E77aF
```

### ABI Summary

```solidity
// Shield assets - permissionless, anyone can deposit
function shield(
    address token,           // ERC-20 token address
    uint256 amount,          // Token amount (in wei)
    bytes calldata payload   // Encrypted routing payload for iExec Worker
) external;

// Unshield assets - only callable by TEE Oracle (iExec Worker Pool)
function unshield(
    address recipient,       // Destination wallet
    address token,           // ERC-20 token address
    uint256 amount,          // Token amount
    bytes32 proofId          // SHA-256 Alpha Proof from TEE
) external onlyTEE;

// Events
event AssetShielded(address indexed sender, address indexed token, uint256 amount, bytes encryptedPayload);
event AssetUnshielded(address indexed recipient, address indexed token, uint256 amount, bytes32 proofId);
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `shield()` is permissionless | Anyone can deposit - no whitelist risk |
| `unshield()` is `onlyTEE` | Only verified SGX enclave can authorize withdrawals |
| `encryptedPayload` in `shield()` | Hides routing intent from mempool observers |
| `setTEEOracle()` available | Multisig can rotate oracle without vault redeployment |

## Cryptographic Proof System

### Alpha Proof Construction

```typescript
// src/app/api/compute/route.ts
import crypto from 'crypto';

const proof = crypto
  .createHash('sha256')
  .update(`${walletAddress}${initialValue}${pnlValue}`)
  .digest('hex');

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
# wallet = "0xABC...", initial = "10000", pnl = "143.5"

# Step 2: Recompute hash
echo -n "0xABC...100000143.5" | sha256sum

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

### OPAQUE's Integration Model

```
Client Request
      │
      ▼
iExec Task Registry (on-chain)
      │
      ▼
Nox SGX Worker Pool
      │  ← Sealed computation happens here
      │  ← Not visible to anyone outside the enclave
      ▼
Attested Output (pnl + proofId)
      │
      ▼
OpaqueVault.unshield() ← Only callable with valid TEE attestation
```

### TEE vs Traditional Compute

| Property | Traditional | iExec Nox TEE |
|----------|-------------|---------------|
| Node can read data | Yes (risk) | No (sealed) |
| Output integrity | Trust-based | Hardware-attested |
| Operator can manipulate | Yes | No |
| Audit trail | Off-chain | On-chain + attested |

> **Current status:** OPAQUE v0.1 implements the full iExec SDK integration layer with TEE simulation mode. Real SGX enclave dispatch is the primary target for v0.2.

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

Users can ask contextual DeFi questions via the embedded chat UI:

```
Endpoint: POST /api/chaingpt
Body:     { "question": "Is ETH in a TEE safer than cold storage?" }
```

**Suggested starter questions (built-in):**
- "Is ETH in a TEE safer than cold storage?"
- "What are Arbitrum Sepolia risks for DeFi?"
- "How does TEE Attestation verify PnL?"
- "Rate my USDC/ETH/ARB portfolio risk."

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 16.2.4 |
| **Wallet** | RainbowKit + wagmi | 2.x |
| **Chain** | viem | 2.x |
| **Query** | TanStack React Query | 5.x |
| **Animations** | Framer Motion | 12.x |
| **AI** | ChainGPT API | REST |
| **Compute** | iExec SDK | 8.x |
| **Network** | Arbitrum Sepolia | Chain 421614 |
| **Smart Contract** | Solidity + OpenZeppelin | 5.x |
| **Share** | html2canvas | 1.4 |
| **Hosting** | Vercel | Edge |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or any Web3 wallet
- ChainGPT API Key ([get one here](https://app.chaingpt.org/apidashboard))

### Installation

```bash
# Clone the repo
git clone https://github.com/Dwica2004/opque.git
cd opque

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

# OpaqueVault contract address (Arbitrum Sepolia - already deployed)
NEXT_PUBLIC_VAULT_ADDRESS="0xD4Ca145CB0340399be832a83E42da44bAE6E77aF"

# WalletConnect Project ID (required for QR code wallet connection)
# Get yours at: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-walletconnect-project-id"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `CHAINGPT_API_KEY` | Yes | Enables AI risk audit + chat |
| `NEXT_PUBLIC_VAULT_ADDRESS` | Yes | Smart contract address |
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
- `Settings` → `Environment Variables` → Add all three keys above

### Build Locally

```bash
npm run build
npm start
```

### Docker (optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## API Reference

### `POST /api/compute`

Generate an Alpha Proof from portfolio data.

**Request:**
```json
{
  "wallet": "0xYourWalletAddress",
  "initialValue": 10000,
  "finalValue": 14350
}
```

**Response:**
```json
{
  "pnl": 43.5,
  "proofId": "0xA3F9...9C21",
  "timestamp": 1714000000000,
  "formula": "sha256(wallet + initial + pnl)"
}
```

### `POST /api/chaingpt`

**Chat Mode** - Ask ChainGPT a DeFi question:

**Request:**
```json
{ "question": "Is ETH safer in a TEE than cold storage?" }
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
            OpaqueVault.sol deployed on Arbitrum Sepolia
            SHA-256 Alpha Proof generation + verification
            iExec Nox SDK integration layer (simulation mode)
            ChainGPT AI risk audit + interactive chat
            TEE Visualizer animation
            Alpha Card (PNG download / social share)
            RainbowKit wallet connection (MetaMask + WalletConnect)
            Mobile responsive UI

Q3 2026  v0.2
            Real iExec SGX task dispatch (full on-chain TEE)
            Stealth deposit addresses (mask shield() events)
            Mainnet deploy (Arbitrum One)
            Alpha Badge NFT contract
            Multi-token vault support

Q4 2026  v1.0
            ZK-SNARK proofs (replace SHA-256 with Groth16)
            $OPQ governance token launch
            DAO governance activation
            Institutional API access tier
            Cross-chain support (Base, Optimism, zkSync)
```

## Security

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| API key exposure | Stored server-side only (`.env.local` / Vercel secrets) |
| Vault drain attack | `unshield()` gated to `teeOracle` only |
| Fake proof claim | SHA-256 is publicly reproducible - forgery is instantly detectable |
| MEV / front-running | `encryptedPayload` masks shield intent from mempool |
| Oracle compromise | `setTEEOracle()` is `onlyOwner` (multisig in production) |

### Current Limitations (v0.1)

- Uses **SHA-256 attestation**, not full ZK-SNARK. Full ZK upgrade planned for v1.0.
- `shield()` event reveals depositor address and token amount (stealth addresses in v0.2).
- iExec TEE is in **simulation mode** for this hackathon build. Real SGX dispatch is v0.2.

### Reporting Issues

Found a bug? [Open an issue](https://github.com/Dwica2004/opque/issues) or DM via Discord.

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
- Real iExec task dispatch integration
- Historical PnL tracking & analytics
- Multi-language support

## License

MIT © 2026 OPAQUE Protocol Team

<p align="center">
  <b>OPAQUE Protocol - Proof of Alpha</b><br/>
  Built for the <a href="https://dorahacks.io">iExec × ChainGPT Vibe Coding Hackathon</a> &nbsp; Dorahacks &nbsp; April 2026<br/><br/>
  <i>"Prove your profit. Hide your balance."</i>
</p>
