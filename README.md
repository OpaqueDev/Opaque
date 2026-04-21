<p align="center">
  <img src="https://img.shields.io/badge/Network-Arbitrum%20Sepolia-blue?style=for-the-badge&logo=ethereum" />
  <img src="https://img.shields.io/badge/TEE-iExec%20Nox-0000FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-ChainGPT-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<h1 align="center">
  🔒 OPAQUE — Proof of Alpha Protocol
</h1>

<p align="center">
  <b>The first confidential DeFi intelligence layer on Arbitrum.</b><br/>
  Prove your portfolio performance to anyone — without revealing a single number.
</p>

---

## 🧠 What is OPAQUE?

OPAQUE is a **Proof of Alpha Protocol** — a full-stack Web3 dApp that allows DeFi traders to cryptographically prove their portfolio performance (PnL) to anyone, without disclosing their actual asset holdings or specific balances.

Built on top of **iExec Nox Trusted Execution Environments (TEE)**, OPAQUE runs your computation inside hardware-isolated Intel SGX enclaves. The result: a **deterministic, verifiable SHA-256 proof** that anyone can verify — but no one can reverse-engineer.

> _"Zero-knowledge for the everyday DeFi trader. Not a gimmick. A protocol."_

---

## ✨ Feature Matrix

| Feature | Status | Description |
|---|---|---|
| 🔒 **Asset Shielding** | ✅ Live | Deposit ERC-20 tokens into `OpaqueVault.sol` on Arbitrum Sepolia |
| ⬡ **TEE Confidential Compute** | ✅ Live | iExec Nox enclave simulation with real SDK integration |
| 🧬 **Deterministic ZKP Proof** | ✅ Live | `sha256(wallet + initial + pnl)` — reproducible, verifiable by anyone |
| 🤖 **ChainGPT AI Risk Audit** | ✅ Live | Real-time portfolio risk scoring via ChainGPT API |
| 💬 **ChainGPT AI Chat** | ✅ Live | Interactive AI assistant for DeFi risk discourse |
| 📊 **Live Network Activity Feed** | ✅ Live | Real-time shield/proof event stream |
| 🎬 **TEE Visualizer** | ✅ Live | Interactive step-by-step animation of confidential compute flow |
| 📤 **Alpha Card Share** | ✅ Live | Download Proof as PNG or copy for Twitter/Discord |
| 📱 **Mobile Responsive** | ✅ Live | Full responsive layout with glassmorphism sidebar drawer |
| 🔗 **Smart Contract** | ✅ Deployed | `OpaqueVault.sol` live on Arbitrum Sepolia |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER (Next.js 15)                         │
│                                                                           │
│   ┌──────────────┐   ┌────────────────┐   ┌──────────────────────────┐  │
│   │  Landing Page │   │   Dashboard UI  │   │   Alpha Card Share Mode  │  │
│   └──────────────┘   └───────┬────────┘   └──────────────────────────┘  │
│                               │ wagmi / viem                              │
└───────────────────────────────┼─────────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                       │                      │
          ▼                       ▼                      ▼
  ┌──────────────┐      ┌──────────────────┐   ┌──────────────────────┐
  │ OpaqueVault  │      │  Next.js API      │   │  ChainGPT            │
  │   .sol       │      │  Routes           │   │  Risk AI             │
  │ (Arbitrum    │      │                   │   │  (Real API)          │
  │  Sepolia)    │      │ /api/compute      │   └──────────────────────┘
  │              │      │ /api/chaingpt     │
  │  shield()    │      │                   │
  │  unshield()  │      │  SHA-256 Proof    │
  └──────────────┘      │  Generation       │
          │              └────────┬──────────┘
          │                       │
          ▼                       ▼
  ┌──────────────────────────────────────────────────────────┐
  │                   iExec Nox TEE Layer                     │
  │                                                           │
  │  src/lib/iexec.ts  →  shieldAssetViaTEE()               │
  │                    →  computePnLInTEE()                   │
  │                                                           │
  │  [Intel SGX Enclave - Isolated Execution Boundary]        │
  └──────────────────────────────────────────────────────────┘
```

---

## ⚙️ How It Works in 4 Steps

```
  [1] WALLET CONNECT     [2] SHIELD ASSETS       [3] COMPUTE IN TEE     [4] PROOF ISSUED
  ─────────────────      ─────────────────       ──────────────────     ─────────────────
  EIP-712 Auth           OpaqueVault.sol          Intel SGX hardware     SHA-256 Hash
  wagmi + MetaMask   →   Arbitrum Sepolia     →   Enclave execution  →   Publicly verifiable
  Wallet detected        Tokens locked            Result only exits      Anyone can verify
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MetaMask or any EVM wallet
- Arbitrum Sepolia ETH ([free faucet](https://faucet.quicknode.com/arbitrum/sepolia))

### 2. Clone & Install
```bash
git clone https://github.com/Dwica2004/opque.git
cd opque
npm install
```

### 3. Environment Setup ⚠️ CRITICAL

Create a `.env.local` file in the root directory:

```ini
# ChainGPT AI Risk Auditor
CHAINGPT_API_KEY="your_chaingpt_key_here"

# Deployed OpaqueVault Contract (Arbitrum Sepolia)
NEXT_PUBLIC_VAULT_ADDRESS="0xD4Ca145CB0340399be832a83E42da44bAE6E77aF"
```

> **⚠️ WARNING:** Never commit `.env.local` to git. It is already in `.gitignore`.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome.

---

## 🧪 Team Demo Flow (< 20 seconds)

Follow this flow for the live hackathon demo:

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app, connect MetaMask | Wallet address shows in sidebar |
| 2 | Navigate → **Compute Vault** | 3-step "How It Works" panel visible |
| 3 | Input `10000` and `18430` | Fields fill correctly |
| 4 | Click **PROVE PnL →** | Loading drama starts: encrypted payload scrolling |
| 5 | Wait ~2 seconds | Proof Card appears: `+84.30%` VERIFIED |
| 6 | Click **OPEN SHARE MODE** | Fullscreen Alpha Card with ⬇ DOWNLOAD PNG |
| 7 | Navigate → **Analytics** | TEE Visualizer + ChainGPT Chat + Live Feed |
| 8 | Click **▶ SIMULATE** on visualizer | 5-step animation with `█▓▒░` encryption effect |

---

## 📂 Project Structure

```
opque/
├── contracts/
│   └── OpaqueVault.sol          # Core vault — iExec TEE compatible
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing page (Proof of Alpha Protocol)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # Sidebar, mobile responsive, wagmi wrapper
│   │   │   ├── page.tsx         # Compute Vault — Proof generation
│   │   │   ├── shield/          # Asset shielding with real wallet tx
│   │   │   ├── analytics/       # TEE Visualizer + AI Chat + Live Feed
│   │   │   └── settings/        # Protocol configuration
│   │   └── api/
│   │       ├── compute/         # SHA-256 deterministic proof backend
│   │       └── chaingpt/        # Secure risk AI + chat serverless API
│   ├── components/
│   │   ├── ProofCard.tsx        # Viral shareable Alpha Card
│   │   ├── TEEVisualizer.tsx    # Interactive confidential compute diagram
│   │   ├── ChainGPTChat.tsx     # AI risk chat panel
│   │   └── LiveActivityFeed.tsx # Real-time network activity stream
│   └── lib/
│       ├── iexec.ts             # iExec SDK integration layer
│       └── abi.ts               # OpaqueVault ABI for wagmi calls
├── feedback.md                  # Developer feedback for iExec & ChainGPT
└── WHITEPAPER.md                # Protocol whitepaper
```

---

## 🔗 Smart Contract

**OpaqueVault** — Deployed on Arbitrum Sepolia

| Field | Value |
|-------|-------|
| Address | `0xD4Ca145CB0340399be832a83E42da44bAE6E77aF` |
| Network | Arbitrum Sepolia (Chain ID: 421614) |
| Verification | [View on Arbiscan](https://sepolia.arbiscan.io/address/0xD4Ca145CB0340399be832a83E42da44bAE6E77aF) |
| Standard | ERC-20 compatible (uses SafeERC20) |
| Access Control | Owner + TEE Oracle role separation |

---

## 💼 Business Model

| Revenue Stream | Mechanism | Target |
|----------------|-----------|--------|
| **Protocol Fee** | 0.05% on every `unshield()` call | DeFi power users |
| **Alpha Badges** | NFT mint for verified top performers (>100% yield) | Traders, degens |
| **Subscription Tier** | Private analytics dashboard for funds | Hedge funds, DAOs |
| **Data Marketplace** | Anonymized aggregate performance reports | Research firms |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Vanilla CSS (Barlow Condensed + Share Tech Mono) |
| Web3 | wagmi v2, viem, WalletConnect |
| Smart Contract | Solidity 0.8.20, OpenZeppelin |
| TEE Layer | iExec Nox (SDK + simulation) |
| AI | ChainGPT API (risk audit + chat) |
| Proof | Node.js crypto (SHA-256 deterministic) |
| Network | Arbitrum Sepolia |

---

## 📄 Whitepaper

Full technical and economic documentation: [**WHITEPAPER.md**](./WHITEPAPER.md)

---

## 🏆 Built For

**iExec x ChainGPT Vibe Coding Hackathon** — Dorahacks

*"Proof of Alpha. Confidential by design."*

---

<p align="center">Made with 🔵 by the OPAQUE Protocol Team</p>
