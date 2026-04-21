# Developer Feedback: iExec & ChainGPT Hackathon

## 🛠️ iExec Nox Experience
**What went well:**
The concept of TEE and confidential computing (Nox) is highly compelling for DeFi. The documentation surrounding the basic SGX execution flow is well thought out, and the separation of public smart contracts alongside off-chain oracles provides an excellent architectural foundation.

**Areas for Improvement:**
1. **Developer Tooling:** Mocking/Simulating the Nox environment locally is challenging for rapid Hackathon sprints. A local `Nox Simulator` docker container that doesn't strictly verify hardware signatures would dramatically speed up Web3 developer onboarding.
2. **React/Frontend Integrations:** We'd love to see more off-the-shelf React Hooks (`@iexec/react`) to manage the asynchronous delays of computing tasks directly from Wallets.

## 🤖 ChainGPT API Experience
**What went well:**
The response time and accuracy of the LLM evaluating Web3 specific contexts is incredible. The output was easily parsable into our Next.js backend.

**Areas for Improvement:**
1. **Contract Auditing Endpoint:** A dedicated endpoint specifically formatted for parsing `0x...` contract addresses and returning strict JSON evaluations would be a massive upgrade over generic prompting.
2. **Rate Limits:** More transparent rate-limit headers in the API response would help developers implement better fallback UIs.

*(Submitted by the Opaque Protocol Team - "Proof of Alpha")*
