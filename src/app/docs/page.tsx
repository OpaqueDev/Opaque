"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Shield, Cpu, Lock, Terminal, Box, Zap } from "lucide-react";

export default function DocsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#04040d", color: "#fff", paddingBottom: "100px" }}>
      {/* Navbar */}
      <nav style={{ padding: "24px 5%", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(4,4,13,0.8)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="bc" style={{ fontSize: "24px", color: "#fff", display: "flex", alignItems: "center", gap: "10px", letterSpacing: "1px" }}>
            <div style={{ width: "12px", height: "12px", background: "#0000FF" }}></div>
            OPAQUE_
          </div>
        </Link>
        <Link href="/dashboard" className="mono" style={{ textDecoration: "none", color: "#fff", background: "#0000FF", padding: "10px 20px", fontSize: "14px", textTransform: "uppercase" }}>
          LAUNCH APP
        </Link>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "60px" }}>
          <div className="mono" style={{ color: "#0000FF", marginBottom: "16px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={16} /> PROTOCOL DOCUMENTATION
          </div>
          <h1 className="bc" style={{ fontSize: "48px", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "2px" }}>
            Proof of Alpha Protocol
          </h1>
          <p style={{ color: "#888", fontSize: "18px", lineHeight: 1.6, maxWidth: "700px" }}>
            The first confidential DeFi intelligence layer on Arbitrum. Prove your portfolio performance to anyone — without revealing a single number.
          </p>
        </div>

        {/* Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "60px" }}>
          
          <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "30px" }}>
            <Shield color="#0000FF" size={32} style={{ marginBottom: "20px" }} />
            <h3 className="bc" style={{ fontSize: "24px", marginBottom: "12px" }}>The Alpha Paradox</h3>
            <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.6 }}>
              In traditional finance, managers must disclose performance. In DeFi, doing so exposes your entire wallet history to MEV bots and copy-traders. OPAQUE solves this by letting you generate a cryptographic hash that proves your PnL without revealing your balance.
            </p>
          </div>

          <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "30px" }}>
            <Cpu color="#0000FF" size={32} style={{ marginBottom: "20px" }} />
            <h3 className="bc" style={{ fontSize: "24px", marginBottom: "12px" }}>TEE Confidential Compute</h3>
            <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.6 }}>
              Built on iExec Nox Intel SGX enclaves. When you compute your yield, it happens inside a hardware-isolated environment. Not even the node operator can see your numbers. The result is a hardware-backed attestation you can trust.
            </p>
          </div>

          <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "30px" }}>
            <Lock color="#0000FF" size={32} style={{ marginBottom: "20px" }} />
            <h3 className="bc" style={{ fontSize: "24px", marginBottom: "12px" }}>SHA-256 Attestation</h3>
            <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.6 }}>
              The protocol outputs a deterministic hash: <code>sha256(wallet + initial + pnl)</code>. Anyone can independently verify this hash if you provide the inputs, but no one can reverse-engineer your balance from the proof ID alone.
            </p>
          </div>

          <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "30px" }}>
            <Zap color="#0000FF" size={32} style={{ marginBottom: "20px" }} />
            <h3 className="bc" style={{ fontSize: "24px", marginBottom: "12px" }}>ChainGPT Risk AI</h3>
            <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.6 }}>
              OPAQUE integrates the ChainGPT Web3 LLM to provide real-time portfolio risk assessments. Audits run server-side to analyze your specific token composition and network exposure on Arbitrum.
            </p>
          </div>

        </div>

        {/* Architecture Section */}
        <h2 className="bc" style={{ fontSize: "32px", marginBottom: "30px", borderBottom: "1px solid #1a1a2e", paddingBottom: "16px" }}>Technical Architecture</h2>
        
        <div style={{ background: "#0a0a14", border: "1px solid #1a1a2e", padding: "40px", marginBottom: "60px", position: "relative", overflow: "hidden" }}>
          {/* Subtle grid background */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundSize: "40px 40px", backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)", zIndex: 0 }}></div>
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ background: "#0000FF", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>1</div>
                <div style={{ flex: 1, background: "#111", border: "1px solid #333", padding: "20px" }}>
                  <h4 className="mono" style={{ color: "#0000FF", marginBottom: "8px" }}>SHIELD</h4>
                  <p style={{ color: "#aaa", fontSize: "14px" }}>User deposits ERC-20 tokens into <code>OpaqueVault.sol</code> on Arbitrum Sepolia.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ background: "#0000FF", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>2</div>
                <div style={{ flex: 1, background: "#111", border: "1px solid #333", padding: "20px" }}>
                  <h4 className="mono" style={{ color: "#0000FF", marginBottom: "8px" }}>COMPUTE</h4>
                  <p style={{ color: "#aaa", fontSize: "14px" }}>iExec Nox enclave calculates net yield off-chain inside sealed SGX hardware.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ background: "#0000FF", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>3</div>
                <div style={{ flex: 1, background: "#111", border: "1px solid #333", padding: "20px" }}>
                  <h4 className="mono" style={{ color: "#0000FF", marginBottom: "8px" }}>ATTEST</h4>
                  <p style={{ color: "#aaa", fontSize: "14px" }}>Enclave generates deterministic proof: <code>sha256(wallet + initial + pnl)</code>.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ background: "#0000FF", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>4</div>
                <div style={{ flex: 1, background: "#111", border: "1px solid #333", padding: "20px" }}>
                  <h4 className="mono" style={{ color: "#0000FF", marginBottom: "8px" }}>SHARE</h4>
                  <p style={{ color: "#aaa", fontSize: "14px" }}>User distributes the Proof ID socially (Twitter, Discord, DAOs).</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ background: "#0000FF", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>5</div>
                <div style={{ flex: 1, background: "#111", border: "1px solid #333", padding: "20px" }}>
                  <h4 className="mono" style={{ color: "#0000FF", marginBottom: "8px" }}>VERIFY</h4>
                  <p style={{ color: "#aaa", fontSize: "14px" }}>Anyone can independently recompute the hash to verify authenticity without knowing the absolute balance.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Smart Contract */}
        <h2 className="bc" style={{ fontSize: "32px", marginBottom: "30px", borderBottom: "1px solid #1a1a2e", paddingBottom: "16px" }}>Smart Contract</h2>
        <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "30px", marginBottom: "60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div className="mono" style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>Contract</div>
              <div style={{ fontSize: "16px", color: "#fff" }}>OpaqueVault.sol</div>
            </div>
            <div>
              <div className="mono" style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>Network</div>
              <div style={{ fontSize: "16px", color: "#0000FF" }}>Arbitrum Sepolia</div>
            </div>
            <div>
              <div className="mono" style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>Address</div>
              <a href="https://sepolia.arbiscan.io/address/0xD4Ca145CB0340399be832a83E42da44bAE6E77aF" target="_blank" rel="noreferrer" className="mono" style={{ fontSize: "14px", color: "#aaa", textDecoration: "underline" }}>
                0xD4Ca145CB...a44bAE6E77aF
              </a>
            </div>
          </div>
          
          <pre className="mono" style={{ background: "#04040d", padding: "20px", border: "1px solid #222", overflowX: "auto", fontSize: "13px", color: "#00FF00", lineHeight: 1.5 }}>
{`// Shield assets — permissionless
function shield(address token, uint256 amount, bytes calldata payload) external;

// Unshield assets — only callable by TEE Oracle
function unshield(address recipient, address token, uint256 amount, bytes32 proofId) external onlyTEE;

// Events
event AssetShielded(address indexed sender, address indexed token, uint256 amount, bytes encryptedPayload);
event AssetUnshielded(address indexed recipient, address indexed token, uint256 amount, bytes32 proofId);`}
          </pre>
        </div>

        {/* API Reference */}
        <h2 className="bc" style={{ fontSize: "32px", marginBottom: "30px", borderBottom: "1px solid #1a1a2e", paddingBottom: "16px" }}>API Reference</h2>
        
        <div style={{ marginBottom: "30px" }}>
          <h3 className="mono" style={{ fontSize: "18px", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ background: "#0000FF", padding: "4px 8px", fontSize: "12px", color: "#fff" }}>POST</span> /api/compute
          </h3>
          <p style={{ color: "#888", marginBottom: "16px" }}>Generates a deterministic Alpha Proof from portfolio data.</p>
          <pre className="mono" style={{ background: "#080812", padding: "20px", border: "1px solid #1a1a2e", overflowX: "auto", fontSize: "13px", color: "#aaa" }}>
{`// Request
{
  "wallet": "0xYourWalletAddress",
  "initialValue": 10000,
  "finalValue": 14350
}

// Response
{
  "pnl": 43.5,
  "proofId": "0xA3F9...9C21",
  "timestamp": 1714000000000,
  "formula": "sha256(wallet + initial + pnl)"
}`}
          </pre>
        </div>

        <div style={{ marginBottom: "60px" }}>
          <h3 className="mono" style={{ fontSize: "18px", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ background: "#0000FF", padding: "4px 8px", fontSize: "12px", color: "#fff" }}>POST</span> /api/chaingpt
          </h3>
          <p style={{ color: "#888", marginBottom: "16px" }}>Routes risk assessments and chat to the ChainGPT Web3 LLM.</p>
          <pre className="mono" style={{ background: "#080812", padding: "20px", border: "1px solid #1a1a2e", overflowX: "auto", fontSize: "13px", color: "#aaa" }}>
{`// Request (Chat Mode)
{ "question": "Is ETH safer in a TEE than cold storage?" }

// Response
{ "answer": "TEE provides hardware-level isolation which..." }`}
          </pre>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #1a1a2e", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="mono" style={{ color: "#555", fontSize: "12px" }}>
            © 2026 OPAQUE Protocol. Built for iExec × ChainGPT Hackathon.
          </div>
          <Link href="/dashboard" className="mono" style={{ color: "#0000FF", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            OPEN DASHBOARD <ArrowLeft style={{ transform: "rotate(180deg)" }} size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
