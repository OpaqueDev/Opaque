# 🛠️ OPAQUE: Technical App Blueprint
**Comprehensive Development Guide for iExec x ChainGPT Challenge**

## 1. Project Overview
OPAQUE is a decentralized application (dApp) that enables users to manage DeFi portfolios with absolute privacy. It leverages iExec's Confidential Computing to hide balances while allowing users to prove their trading performance.

## 2. Technical Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js, Tailwind CSS, Framer Motion |
| **Web3 Provider** | Wagmi, Viem, RainbowKit |
| **Privacy** | iExec Nox SDK (Confidential Assets) |
| **AI / Security** | ChainGPT API (Risk Analytics) |
| **Blockchain** | Arbitrum Sepolia Testnet |

## 3. Core Logic Implementation

### 3.1. Shielding Logic (The Vault)
The process of "shielding" involves moving assets from a public state to a confidential state:
1. **Approval:** User approves the Nox contract to spend the target ERC-20.
2. **Wrapping:** Call `nox.wrap(amount)` to lock tokens in the TEE-managed vault.
3. **Private Balance:** The balance is now stored in an encrypted state, only queryable by the owner's signature.

### 3.2. ASCII Encryption UI (Smart Blur)
To maintain the "OPAQUE" aesthetic:
* Implement a React Hook `useAsciiBlur(value, isPrivate)`:
  * If `isPrivate` is true, return a string of randomized characters: `█ ▓ ▒ ░ ◉`.
  * Update the string every 100ms to create a "scanning" effect.

### 3.3. ChainGPT Portfolio Audit
1. Fetch the list of shielded assets.
2. Send contract addresses to the ChainGPT Security API.
3. Calculate an aggregate "Safety Score" based on:
   - Contract verified status.
   - Liquidity/Volume ratio.
   - Recent exploit history.

## 4. User Interface Modules
- **Connect Module:** Standard Web3 connection.
- **Shield/Unshield Tab:** Simple input for wrapping/unwrapping assets.
- **Analytics Dashboard:**
    - Large PnL Percentage (Publicly shareable).
    - Encrypted Asset List (The Opaque view).
    - ChainGPT Safety Gauge.
- **Social Proof Tool:** Export verified PnL to a stylized "Alpha Card" (PNG).

## 5. Deployment Checklist
- [ ] Deploy test tokens on Arbitrum Sepolia.
- [ ] Initialize iExec Nox worker pool.
- [ ] Configure ChainGPT API environment variables.
- [ ] Set up Vercel deployment for the Next.js frontend.
