# 🛠️ OPAQUE — Proof of Alpha

**OPAQUE** is a confidential computing showcase built for the **iExec x ChainGPT Vibe Coding Hackathon**. It demonstrates a robust Web3 architecture for protecting DeFi portfolio balances using (simulated) iExec TEE Enclaves, while generating auditable ZK-proofs of PnL, wrapped in a hyper-responsive Cyberpunk UI.

![Opaque Protocol Preview](./public/window.svg)

## 🌟 Key Features
- **Multi-Route SaaS Dashboard:** Next.js 13+ App Router (Compute Vault, Shield Assets, Risk Analytics, Settings).
- **Wallet Auth:** Native Web3 Injection using `wagmi` & `viem` with Hydration mismatch guards.
- **AI Risk Audit:** Real-time ChainGPT API integration for analyzing on-chain portfolio risk metrics.
- **TEE Smart Encryption (Mock):** iExec Nox Confidential workflow visualization with Cryptographic Wallet Signatures (EIP-191).
- **Absolute Responsive UI:** Native CSS grid layouts that flawlessly fallback on Mobile + Slide-over drawers.

---

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
CHAINGPT_API_KEY="6ee6a784-6611-4af0-bb20-00c919958919"
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
