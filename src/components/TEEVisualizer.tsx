"use client";
import { useState, useEffect } from "react";

// SVG icons — no emoji
const STEP_ICONS = [
  // Wallet — credit card style
  <svg key="wallet" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
    <circle cx="17" cy="15" r="1.5" fill="currentColor" stroke="none"/>
  </svg>,
  // Lock — encryption
  <svg key="lock" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 018 0v4"/>
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/>
  </svg>,
  // CPU chip — SGX enclave
  <svg key="cpu" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1"/>
    <line x1="9" y1="7" x2="9" y2="4"/><line x1="12" y1="7" x2="12" y2="4"/><line x1="15" y1="7" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="17"/><line x1="12" y1="20" x2="12" y2="17"/><line x1="15" y1="20" x2="15" y2="17"/>
    <line x1="7" y1="9" x2="4" y2="9"/><line x1="7" y1="12" x2="4" y2="12"/><line x1="7" y1="15" x2="4" y2="15"/>
    <line x1="20" y1="9" x2="17" y2="9"/><line x1="20" y1="12" x2="17" y2="12"/><line x1="20" y1="15" x2="17" y2="15"/>
  </svg>,
  // Trash / destroy — container destroyed
  <svg key="trash" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>,
  // Shield check — attestation
  <svg key="attest" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>,
];

const STEPS = [
  { id: 1, label: "Wallet Connected", sub: "EIP-712 auth initiated" },
  { id: 2, label: "Data Encrypted", sub: "AES-256 via iExec Nox public key" },
  { id: 3, label: "Inside TEE Enclave", sub: "Intel SGX isolated execution" },
  { id: 4, label: "Execution Finished", sub: "Confidential container destroyed automatically" },
  { id: 5, label: "TEE Attestation Issued", sub: "SHA-256 deterministic reference" },
];

const chars = ["█", "▓", "▒", "░", "◉", "X", "#", "@", "Ø", "ψ", "Σ", "Δ"];

export default function TEEVisualizer() {
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const [encrypted, setEncrypted] = useState("--------");

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const s = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      setEncrypted(s);
    }, 160);
    return () => clearInterval(iv);
  }, [running]);

  const simulate = async () => {
    setRunning(true);
    setActive(-1);
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 900));
      setActive(i);
    }
    setRunning(false);
    setEncrypted("SECURED_");
  };

  return (
    <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border-strong)", padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <div className="bc" style={{ fontSize: "20px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--foreground)" }}>
            Confidential Compute Visualizer
          </div>
          <div className="mono" style={{ fontSize: "10px", color: "#0000FF", marginTop: "4px", letterSpacing: "2px" }}>
            POWERED BY IEXEC NOX TEE
          </div>
        </div>
        <button
          onClick={simulate}
          disabled={running}
          className="mono"
          style={{
            background: running ? "var(--border)" : "#0000FF",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            fontSize: "11px",
            cursor: running ? "not-allowed" : "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          {running ? (
            <><span style={{ animation: "pulse 1s infinite" }}>◉</span> RUNNING...</>
          ) : "▶ SIMULATE"}
        </button>
      </div>

      {/* Encrypted payload preview */}
      {running && (
        <div className="mono" style={{ background: "var(--surface-alt)", border: "1px solid rgba(0,0,255,0.2)", padding: "12px 16px", marginBottom: "24px", fontSize: "18px", color: "#0000FF", letterSpacing: "4px", textShadow: "0 0 10px rgba(0,0,255,0.8)", textAlign: "center" }}>
          {encrypted}
        </div>
      )}

      {/* Step Flow */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {STEPS.map((step, i) => {
          const isDone = active >= i;
          const isCurrent = active === i;
          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "14px 16px",
                background: isDone ? "rgba(0,0,255,0.08)" : "var(--surface-alt)",
                border: `1px solid ${isCurrent ? "#0000FF" : isDone ? "rgba(0,0,255,0.3)" : "var(--border)"}`,
                transition: "all 0.4s ease",
                animation: isCurrent ? "pulse 0.5s ease" : "none",
              }}
            >
              <div style={{
                width: "36px", height: "36px",
                border: `2px solid ${isDone ? "#0000FF" : "var(--border-soft)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: isDone ? "#0000FF" : "var(--border-soft)",
                background: isDone ? "rgba(0,0,255,0.15)" : "transparent",
                flexShrink: 0,
                transition: "all 0.4s ease",
              }}>
                {STEP_ICONS[i]}
              </div>
              <div>
                <div className="bc" style={{ fontSize: "14px", color: isDone ? "var(--foreground)" : "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {step.label}
                </div>
                <div className="mono" style={{ fontSize: "10px", color: isDone ? "#0000FF" : "var(--border-soft)", marginTop: "2px" }}>
                  {step.sub}
                </div>
              </div>
              {isDone && (
                <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {active === STEPS.length - 1 && (
        <div className="mono" style={{ marginTop: "20px", padding: "12px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", fontSize: "11px", textAlign: "center", letterSpacing: "1px" }}>
          ✓ DETERMINISTIC PROOF GENERATED · ANYONE CAN VERIFY THIS RESULT
        </div>
      )}
    </div>
  );
}
