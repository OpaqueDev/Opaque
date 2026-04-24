"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t); }, []);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ animation: "fade-in 0.3s ease" }}>
      <div className="dash-grid-2fr">

        {/* Main Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          <section style={{ background: "var(--db-bg)", border: "1px solid var(--border-soft)", padding: "32px" }}>
            <h3 className="bc" style={{ fontSize: "20px", textTransform: "uppercase", marginBottom: "20px", color: "var(--foreground)", letterSpacing: "1px", borderBottom: "1px solid var(--border-soft)", paddingBottom: "16px" }}>Network RPC Configuration</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="mono" style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>Primary Node URL (Arbitrum Sepolia)</label>
                <input type="text" defaultValue="https://sepolia-rollup.arbitrum.io/rpc" style={{ width: "100%", background: "var(--surface-alt)", border: "1px solid var(--border-soft)", color: "var(--foreground)", padding: "12px", fontSize: "14px", fontFamily: "'Share Tech Mono', monospace", outline: "none" }} />
              </div>
              <div>
                <label className="mono" style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>Fallback Node URL (Optional)</label>
                <input type="text" placeholder="https://..." style={{ width: "100%", background: "var(--surface-alt)", border: "1px solid var(--border)", color: "var(--foreground)", padding: "12px", fontSize: "14px", fontFamily: "'Share Tech Mono', monospace", outline: "none" }} />
              </div>
            </div>
          </section>

          <section style={{ background: "var(--db-bg)", border: "1px solid var(--border-soft)", padding: "32px" }}>
            <h3 className="bc" style={{ fontSize: "20px", textTransform: "uppercase", marginBottom: "20px", color: "var(--foreground)", letterSpacing: "1px", borderBottom: "1px solid var(--border-soft)", paddingBottom: "16px" }}>iExec TEE Enclave Overrides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="mono" style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>Nox Worker Pool Address</label>
                <input type="text" defaultValue="0x8b301eb5b2bd9f3fb4ec03649cd97813ba5aa198" disabled style={{ width: "100%", background: "transparent", border: "1px dashed var(--border-soft)", color: "#0000FF", padding: "12px", fontSize: "14px", fontFamily: "'Share Tech Mono', monospace", outline: "none", opacity: 0.8 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                 <input type="checkbox" id="strict" defaultChecked style={{ width: "16px", height: "16px", accentColor: "#0000FF" }} />
                 <label htmlFor="strict" className="mono" style={{ fontSize: "12px", color: "var(--text-dim)" }}>Enforce Strict enclave verification before encryption</label>
              </div>
            </div>
          </section>

          <button className="btn-primary" onClick={handleSave} style={{ alignSelf: "flex-start", opacity: saved ? 0.5 : 1 }}>
            {saved ? "✔ SETTINGS SECURED" : "SAVE PROTOCOL SETTINGS"}
          </button>
        </div>

        {/* Side Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          <div style={{ background: "#0000FF", padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
             <h3 className="bc" style={{ fontSize: "24px", color: "#fff", textTransform: "uppercase", margin: "16px 0 8px" }}>Alpha Groups</h3>
             <p className="mono" style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "24px", lineHeight: 1.6 }}>White-label this dashboard for your private Discord/Telegram community.</p>
             <button className="btn-outline" style={{ borderColor: "#fff", color: "#0000FF", background: "#fff", padding: "12px 24px", fontSize: "14px", width: "100%" }}>
                UPGRADE TO PRO
             </button>
          </div>

          <div style={{ border: "1px solid var(--border)", padding: "24px", background: "var(--sidebar-bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h4 className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Session Status</h4>
              <span className="mono" style={{ background: "rgba(255,200,0,0.1)", color: "#facc15", padding: "4px 8px", fontSize: "9px", border: "1px solid rgba(255,200,0,0.3)" }}>SIMULATION MODE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>Wallet Bind</span>
                <span className="mono" style={{ fontSize: "12px", color: (mounted && isConnected) ? "#4ade80" : "#ff4444" }}>{(mounted && isConnected) ? "SECURED" : "DETACHED"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>Nox Node</span>
                <span className="mono" style={{ fontSize: "12px", color: "#0000FF" }}>ACTIVE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>ChainGPT API</span>
                <span className="mono" style={{ fontSize: "12px", color: "#4ade80" }}>ONLINE</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
