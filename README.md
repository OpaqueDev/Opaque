# 🛠️ OPAQUE — Proof of Alpha

**OPAQUE** is a confidential computing showcase built for the **iExec x ChainGPT Vibe Coding Hackathon**. It demonstrates a robust Web3 architecture for protecting DeFi portfolio balances using (simulated) iExec TEE Enclaves, while generating auditable ZK-proofs of PnL, wrapped in a hyper-responsive Cyberpunk UI.

![Opaque Protocol Preview](./public/window.svg)

## 🌟 Key Features
- **Multi-Route SaaS Dashboard:** Next.js 13+ App Router (Compute Vault, Shield Assets, Risk Analytics, Settings).
- **Wallet Auth:** Native Web3 Injection using `wagmi` & `viem` with Hydration mismatch guards.
- **AI Risk Audit:** Real-time ChainGPT API integration for analyzing on-chain portfolio risk metrics.
- **TEE Smart Encryption:** iExec Nox Confidential workflow visualization with Cryptographic Wallet Signatures (EIP-191).
- **Absolute Responsive UI:** Native CSS grid layouts that flawlessly fallback on Mobile + Slide-over drawers.

---

## ⚙️ How It Works in 4 Steps
1. **Wallet Connection & Authentication**: The user links their EVM-compatible wallet.
2. **Asset Shielding**: Assets are deposited into the `OpaqueVault.sol` contract and instantly masked by the enclave.
3. **Confidential Compute (iExec TEE)**: An Intel SGX worker computes the user's Net Yield natively without revealing base asset numbers to the public ledger.
4. **ZKP Proof Generation**: A deterministic `SHA-256` reference is generated containing the Alpha score block to be shared virally.

---

## 💼 Business Model
- **Shielding & Unwrap Fee**: The protocol charges a flat **0.05% protocol tax** strictly when unshielding confidential assets to public addresses.
- **Alpha Group Badges**: Subscription tier integrations allowing verifiable top traders (e.g., Yields > 100%) to auto-mint NFT badges, acting as an immutable flex.

## ⚡ Quick Start for the Team

### 1. Clone & Install
Ensure you have Node.js 18+ installed on your laptop.
```bash
git pull origin main
npm install
```

### 2. Environment Setup (CRITICAL ⚠️)
Because we integrated the real **ChainGPT API** for the Analytics tab, you must set up your local secrets. 
1. Create a file named `.env.local` EXACTLY in the root folder (`d:\opaque\.env.local`).
2. Paste the following ChainGPT API Key inside:
```ini
CHAINGPT_API_KEY=""
```

> **Note:** If you run the app without this file, the API Route `POST /api/chaingpt` will crash and trigger the fallback UI.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `3001`) in Google Chrome.

---

## 📋 Team Testing Workflow

1. **Connect Wallet:** Click "Connect Wallet" on the dashboard. Wagmi will request your MetaMask extension.
2. **Tab 1: Shield Assets (`/dashboard/shield`)**
   - Enter an amount (e.g. 1000 USDC).
   - Click "Shield Assets Now".
   - **Crucial:** Approve the real MetaMask signatures that pop up. The UI will simulate the iExec wrapping process with terminal logs showing the encryption state.
3. **Tab 2: Compute Vault (`/dashboard`)**
   - Click Generate Proof to trigger the API.
   - It will render the hyper-contrast **Alpha Compartment Share Card** showing the ZKP reference ID.
4. **Tab 3: Analytics (`/dashboard/analytics`)**
   - The app will securely ping the serverless route (`/api/chaingpt`).
   - Observe the Loading Spinners. The live Risk Audit data from ChainGPT will dynamically inject.
5. **Mobile Test:**
   - Shrink your Chrome window below 900px width.
   - Verify the grid collapses and the side drawer hamburger menu works perfectly.

---

## 🤝 Project Structure Insight
- `src/app/page.tsx` - The majestic landing page.
- `src/app/dashboard/layout.tsx` - The Next.js side-drawer layout & Wagmi wrapper.
- `src/app/api/chaingpt/route.ts` - Server-side backend for securely communicating with AI without exposing keys.
- `src/components/ProofCard.tsx` - The custom Framer Motion component rendering the gorgeous PnL Certificate.

---
*Built aggressively during the Dorahacks Vibe Coding sprint.* GLHF! 🚀
