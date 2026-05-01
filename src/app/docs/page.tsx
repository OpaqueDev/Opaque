"use client";

import Link from "next/link";
import { BookOpen, Shield, Cpu, Lock, Zap, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  // Simple scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "architecture", "smart-contract", "api", "yield-optimizer", "roadmap"];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    }
  };

  const NavItem = ({ id, label }: { id: string, label: string }) => (
    <button 
      onClick={() => scrollTo(id)}
      className="mono"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "10px 16px",
        background: activeSection === id ? "rgba(0,0,255,0.1)" : "transparent",
        color: activeSection === id ? "#fff" : "#888",
        borderLeft: activeSection === id ? "2px solid #0000FF" : "2px solid transparent",
        borderTop: "none",
        borderRight: "none",
        borderBottom: "none",
        cursor: "pointer",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        transition: "all 0.2s"
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#04040d", color: "#fff" }}>
      {/* Navbar */}
      <nav style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(4,4,13,0.8)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="bc" style={{ fontSize: "24px", color: "#fff", display: "flex", alignItems: "center", gap: "10px", letterSpacing: "1px" }}>
            <div style={{ width: "12px", height: "12px", background: "#0000FF" }}></div>
            OPAQUE_
          </div>
        </Link>
        <Link href="/dashboard" className="mono" style={{ textDecoration: "none", color: "#fff", background: "#0000FF", padding: "10px 20px", fontSize: "14px", textTransform: "uppercase", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#3355FF"} onMouseOut={e => e.currentTarget.style.background = "#0000FF"}>
          LAUNCH APP
        </Link>
      </nav>

      <div style={{ display: "flex", maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Sidebar */}
        <aside style={{ width: "260px", position: "sticky", top: "73px", height: "calc(100vh - 73px)", overflowY: "auto", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "40px 0" }}>
          <div style={{ marginBottom: "30px", padding: "0 16px" }}>
            <div className="bc" style={{ fontSize: "14px", color: "#fff", letterSpacing: "1px", marginBottom: "16px" }}>DOCUMENTATION</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <NavItem id="overview" label="Overview" />
            <NavItem id="architecture" label="Architecture" />
            <NavItem id="smart-contract" label="Smart Contract" />
            <NavItem id="api" label="API Reference" />
            <NavItem id="yield-optimizer" label="Yield Optimizer" />
            <NavItem id="roadmap" label="Roadmap" />
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "60px 80px 120px", maxWidth: "900px" }}>
          
          {/* Overview */}
          <section id="overview" style={{ marginBottom: "80px" }}>
            <div className="mono" style={{ color: "#0000FF", marginBottom: "16px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <BookOpen size={16} /> PROTOCOL V0.1
            </div>
            <h1 className="bc" style={{ fontSize: "48px", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "2px" }}>
              Proof of Alpha Protocol
            </h1>
            <p style={{ color: "#aaa", fontSize: "18px", lineHeight: 1.6, marginBottom: "40px" }}>
              The first confidential DeFi intelligence layer on Arbitrum. Prove your portfolio performance to anyone — without revealing your balance, holdings, or strategy.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "24px" }}>
                <Shield color="#0000FF" size={24} style={{ marginBottom: "16px" }} />
                <h3 className="bc" style={{ fontSize: "20px", marginBottom: "12px" }}>ERC-7984 Shielding</h3>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.6 }}>
                  Wrap USDC into wcUSDC. Balances are encrypted on-chain using homomorphic encryption, hidden from everyone including the contract.
                </p>
              </div>
              <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "24px" }}>
                <Cpu color="#0000FF" size={24} style={{ marginBottom: "16px" }} />
                <h3 className="bc" style={{ fontSize: "20px", marginBottom: "12px" }}>iExec Nox TEE</h3>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.6 }}>
                  Computations run inside Intel SGX hardware enclaves. The output carries a hardware-backed cryptographic attestation.
                </p>
              </div>
              <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "24px" }}>
                <Lock color="#0000FF" size={24} style={{ marginBottom: "16px" }} />
                <h3 className="bc" style={{ fontSize: "20px", marginBottom: "12px" }}>SHA-256 Proofs</h3>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.6 }}>
                  Deterministic hashing: <code>sha256(wallet + pnl + timestamp)</code>. Publicly verifiable, but reversing balance is impossible.
                </p>
              </div>
              <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "24px" }}>
                <Zap color="#0000FF" size={24} style={{ marginBottom: "16px" }} />
                <h3 className="bc" style={{ fontSize: "20px", marginBottom: "12px" }}>ChainGPT AI</h3>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.6 }}>
                  Real-time portfolio risk scoring and interactive DeFi risk assistant powered by ChainGPT API.
                </p>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" style={{ marginBottom: "80px" }}>
            <h2 className="bc" style={{ fontSize: "32px", marginBottom: "30px", borderBottom: "1px solid #1a1a2e", paddingBottom: "16px" }}>Architecture Flow</h2>
            
            <div style={{ background: "#0a0a14", border: "1px solid #1a1a2e", padding: "30px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
                {[
                  { title: "SHIELD", desc: "Wrap Circle USDC into wcUSDC via WrappedConfidentialUSDC.wrap(). Your balance is encrypted on-chain." },
                  { title: "COMPUTE", desc: "iExec Nox enclave reads on-chain deposit events, calculates net yield inside SGX." },
                  { title: "ATTEST", desc: "SHA-256 Alpha Proof is generated: sha256(wallet + pnl + timestamp)." },
                  { title: "SHARE", desc: "Proof is distributed — Twitter, Discord, DAOs, anywhere." },
                  { title: "VERIFY", desc: "Anyone recomputes the hash and checks match." },
                  { title: "UNSHIELD", desc: "Encrypt unwrap amount → unwrap() → TEE decrypts → finalizeUnwrap() to get USDC back." }
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "20px" }}>
                    <div className="mono" style={{ background: "#0000FF", color: "#fff", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>0{i+1}</div>
                    <div>
                      <h4 className="mono" style={{ color: "#0000FF", marginBottom: "6px", fontSize: "14px", letterSpacing: "1px" }}>{step.title}</h4>
                      <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Smart Contract */}
          <section id="smart-contract" style={{ marginBottom: "80px" }}>
            <h2 className="bc" style={{ fontSize: "32px", marginBottom: "30px", borderBottom: "1px solid #1a1a2e", paddingBottom: "16px" }}>Smart Contract</h2>
            <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "30px" }}>
              <div style={{ display: "flex", gap: "40px", marginBottom: "24px", flexWrap: "wrap" }}>
                <div>
                  <div className="mono" style={{ color: "#888", fontSize: "11px", marginBottom: "6px", letterSpacing: "1px" }}>CONTRACT</div>
                  <div className="bc" style={{ fontSize: "16px", color: "#fff", letterSpacing: "1px" }}>WrappedConfidentialUSDC</div>
                </div>
                <div>
                  <div className="mono" style={{ color: "#888", fontSize: "11px", marginBottom: "6px", letterSpacing: "1px" }}>STANDARD</div>
                  <div className="bc" style={{ fontSize: "16px", color: "#fff", letterSpacing: "1px" }}>ERC-7984</div>
                </div>
                <div>
                  <div className="mono" style={{ color: "#888", fontSize: "11px", marginBottom: "6px", letterSpacing: "1px" }}>NETWORK</div>
                  <div className="bc" style={{ fontSize: "16px", color: "#0000FF" }}>Arbitrum Sepolia</div>
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>
                  <div className="mono" style={{ color: "#888", fontSize: "11px", marginBottom: "6px", letterSpacing: "1px" }}>ADDRESS</div>
                  <a href="https://sepolia.arbiscan.io/address/0xF8d68DA9C2e95e4E636Bd3737534d59Aad66703F" target="_blank" rel="noreferrer" className="mono" style={{ fontSize: "14px", color: "#aaa", textDecoration: "underline", wordBreak: "break-all" }}>
                    0xF8d68DA9C2e95e4E636Bd3737534d59Aad66703F
                  </a>
              </div>
              
              <pre className="mono" style={{ background: "#04040d", padding: "20px", border: "1px solid #222", overflowX: "auto", fontSize: "13px", color: "#4ade80", lineHeight: 1.6, margin: 0 }}>
{`// Wrap ERC-20 USDC → confidential wcUSDC
function wrap(address to, uint256 amount) external returns (bytes32);

// Initiate unwrap — encrypted amount burned, TEE decryption requested
function unwrap(
    address from,
    address to,
    bytes32 encryptedAmount,
    bytes calldata inputProof
) external returns (bytes32 unwrapRequestId);

// Finalize unwrap after TEE decryption
function finalizeUnwrap(
    bytes32 unwrapRequestId,
    bytes calldata decryptedAmountAndProof
) external;`}
              </pre>
            </div>
          </section>

          {/* API Reference */}
          <section id="api" style={{ marginBottom: "80px" }}>
            <h2 className="bc" style={{ fontSize: "32px", marginBottom: "30px", borderBottom: "1px solid #1a1a2e", paddingBottom: "16px" }}>API Reference</h2>
            
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span className="mono" style={{ background: "#0000FF", padding: "4px 8px", fontSize: "12px", color: "#fff", letterSpacing: "1px" }}>POST</span>
                <span className="mono" style={{ fontSize: "18px", color: "#fff" }}>/api/compute</span>
              </div>
              <p style={{ color: "#aaa", marginBottom: "16px", fontSize: "15px" }}>Generate an Alpha Proof from on-chain deposit history.</p>
              <pre className="mono" style={{ background: "#080812", padding: "20px", border: "1px solid #1a1a2e", overflowX: "auto", fontSize: "13px", color: "#aaa", lineHeight: 1.5, margin: 0 }}>
{`// Request
{
  "wallet": "0xYourWalletAddress"
}

// Response
{
  "pnl": "+43.50%",
  "proof": "a3f9...9c21",
  "pnl_percentage": 43.5,
  "verification_timestamp": 1714000000000,
  "deposits_analysed": 3
}`}
              </pre>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span className="mono" style={{ background: "#0000FF", padding: "4px 8px", fontSize: "12px", color: "#fff", letterSpacing: "1px" }}>POST</span>
                <span className="mono" style={{ fontSize: "18px", color: "#fff" }}>/api/chaingpt</span>
              </div>
              <p style={{ color: "#aaa", marginBottom: "16px", fontSize: "15px" }}>Interactive ChainGPT DeFi risk assistant.</p>
              <pre className="mono" style={{ background: "#080812", padding: "20px", border: "1px solid #1a1a2e", overflowX: "auto", fontSize: "13px", color: "#aaa", lineHeight: 1.5, margin: 0 }}>
{`// Request
{ "question": "Is wcUSDC in a TEE safer than cold storage?" }

// Response
{ "answer": "TEE provides hardware-level isolation which..." }`}
              </pre>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span className="mono" style={{ background: "#4ade80", color: "#000", padding: "4px 8px", fontSize: "12px", letterSpacing: "1px", fontWeight: "bold" }}>GET</span>
                <span className="mono" style={{ fontSize: "18px", color: "#fff" }}>/verify/[proofId]</span>
              </div>
              <p style={{ color: "#aaa", margin: 0, fontSize: "15px" }}>Public Alpha Proof verification route. Recomputes hash from query params to verify authenticity.</p>
            </div>
          </section>

          {/* Confidential Yield Optimizer */}
          <section id="yield-optimizer" style={{ marginBottom: "80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <h2 className="bc" style={{ fontSize: "32px", textTransform: "uppercase", letterSpacing: "2px", margin: 0 }}>Confidential Yield Optimizer</h2>
              <span className="mono" style={{ background: "rgba(0,0,255,0.1)", color: "#0000FF", border: "1px solid #0000FF", padding: "4px 8px", fontSize: "10px", letterSpacing: "1px" }}>VISION</span>
            </div>
            <div style={{ borderBottom: "1px solid #1a1a2e", marginBottom: "30px" }}></div>
            
            <p style={{ color: "#aaa", fontSize: "16px", lineHeight: 1.6, marginBottom: "24px" }}>
              OPAQUE is evolving from a private proof vault into a <strong>confidential yield intelligence layer</strong>. 
              Using iExec Nox and confidential tokens, OPAQUE privately evaluates yield opportunities without ever exposing a user's balance, allocation size, or strategy.
            </p>
            <div style={{ background: "rgba(0,0,255,0.05)", borderLeft: "3px solid #0000FF", padding: "16px 20px", marginBottom: "30px" }}>
              <p style={{ color: "#fff", fontStyle: "italic", margin: 0 }}>"Before: Prove alpha without revealing balance.<br/>After: Generate alpha privately, then prove it publicly."</p>
            </div>

            <h3 className="bc" style={{ fontSize: "20px", marginBottom: "16px" }}>Two Modes</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 className="bc" style={{ fontSize: "18px", margin: 0, color: "#fff" }}>Signal Mode</h4>
                  <span className="mono" style={{ fontSize: "10px", color: "#4ade80", letterSpacing: "1px" }}>PLANNED MVP</span>
                </div>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>
                  AI recommends a yield route. User reviews the gas-adjusted APY and executes manually.
                </p>
              </div>
              <div style={{ background: "#080812", border: "1px solid #1a1a2e", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 className="bc" style={{ fontSize: "18px", margin: 0, color: "#fff" }}>Stealth Auto Mode</h4>
                  <span className="mono" style={{ fontSize: "10px", color: "#0000FF", letterSpacing: "1px" }}>COMING SOON</span>
                </div>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>
                  User grants permissioned strategy access. OPAQUE rebalances automatically when expected gain {`>`} gas + risk.
                </p>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section id="roadmap" style={{ marginBottom: "40px" }}>
            <h2 className="bc" style={{ fontSize: "32px", marginBottom: "30px", borderBottom: "1px solid #1a1a2e", paddingBottom: "16px" }}>Roadmap</h2>
            
            <div style={{ position: "relative", paddingLeft: "30px" }}>
              <div style={{ position: "absolute", left: "6px", top: 0, bottom: 0, width: "2px", background: "#1a1a2e" }}></div>
              
              <div style={{ position: "relative", marginBottom: "40px" }}>
                <div style={{ position: "absolute", left: "-31px", top: "4px", width: "14px", height: "14px", borderRadius: "50%", background: "#0000FF", boxShadow: "0 0 10px #0000FF" }}></div>
                <div className="mono" style={{ color: "#0000FF", fontSize: "12px", letterSpacing: "1px", marginBottom: "8px" }}>Q2 2026 — CURRENT</div>
                <h3 className="bc" style={{ fontSize: "22px", marginBottom: "12px" }}>v0.1 Launch</h3>
                <ul style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.6, paddingLeft: "20px", margin: 0 }}>
                  <li style={{ marginBottom: "6px" }}>WrappedConfidentialUSDC (ERC-7984) deployed on Arbitrum Sepolia</li>
                  <li style={{ marginBottom: "6px" }}>Confidential wrap/unwrap flow via iExec Nox TEE</li>
                  <li style={{ marginBottom: "6px" }}>SHA-256 Alpha Proof generation from on-chain deposit events</li>
                  <li style={{ marginBottom: "6px" }}>ChainGPT AI risk audit + interactive chat</li>
                  <li>Public Proof Verify Page & Alpha Arena demo leaderboard</li>
                </ul>
              </div>

              <div style={{ position: "relative", marginBottom: "40px" }}>
                <div style={{ position: "absolute", left: "-31px", top: "4px", width: "14px", height: "14px", borderRadius: "50%", background: "#1a1a2e", border: "2px solid #555" }}></div>
                <div className="mono" style={{ color: "#888", fontSize: "12px", letterSpacing: "1px", marginBottom: "8px" }}>Q3 2026</div>
                <h3 className="bc" style={{ fontSize: "22px", marginBottom: "12px", color: "#ccc" }}>v0.2</h3>
                <ul style={{ color: "#888", fontSize: "15px", lineHeight: 1.6, paddingLeft: "20px", margin: 0 }}>
                  <li style={{ marginBottom: "6px" }}>Real iExec SGX task dispatch (full on-chain TEE)</li>
                  <li style={{ marginBottom: "6px" }}>Stealth deposit addresses</li>
                  <li style={{ marginBottom: "6px" }}>Mainnet deploy (Arbitrum One)</li>
                  <li>Confidential Yield Optimizer — Signal Mode MVP</li>
                </ul>
              </div>

              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-31px", top: "4px", width: "14px", height: "14px", borderRadius: "50%", background: "#1a1a2e", border: "2px solid #555" }}></div>
                <div className="mono" style={{ color: "#888", fontSize: "12px", letterSpacing: "1px", marginBottom: "8px" }}>Q4 2026</div>
                <h3 className="bc" style={{ fontSize: "22px", marginBottom: "12px", color: "#ccc" }}>v1.0</h3>
                <ul style={{ color: "#888", fontSize: "15px", lineHeight: 1.6, paddingLeft: "20px", margin: 0 }}>
                  <li style={{ marginBottom: "6px" }}>ZK-SNARK proofs — Groth16 circuits</li>
                  <li style={{ marginBottom: "6px" }}>$OPQ governance token launch</li>
                  <li style={{ marginBottom: "6px" }}>Institutional API access tier</li>
                  <li>Confidential Yield Optimizer — Stealth Auto Mode</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #1a1a2e", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "80px" }}>
            <div className="mono" style={{ color: "#555", fontSize: "12px" }}>
              © 2026 OPAQUE Protocol.
            </div>
            <Link href="https://github.com/OpaqueDev/Opaque" target="_blank" className="mono" style={{ color: "#0000FF", textDecoration: "none", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
              VIEW ON GITHUB <ChevronRight size={14} />
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
