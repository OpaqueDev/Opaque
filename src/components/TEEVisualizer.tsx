"use client";
import { useState, useEffect } from "react";

const STEPS = [
  { id: 1, label: "Wallet Connected", sub: "EIP-712 auth initiated", icon: "◈" },
  { id: 2, label: "Data Encrypted", sub: "AES-256 via iExec Nox public key", icon: "🔒" },
  { id: 3, label: "Inside TEE Enclave", sub: "Intel SGX isolated execution", icon: "⬡" },
  { id: 4, label: "Computation Complete", sub: "PnL calculated privately", icon: "✦" },
  { id: 5, label: "ZKP Proof Issued", sub: "SHA-256 deterministic reference", icon: "✓" },
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
    }, 80);
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
    <div style={{ background: "#05050a", border: "1px solid #1a1a2e", padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <div className="bc" style={{ fontSize: "20px", textTransform: "uppercase", letterSpacing: "1px", color: "#fff" }}>
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
            background: running ? "#1a1a1a" : "#0000FF",
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
        <div className="mono" style={{ background: "#0a0a14", border: "1px solid rgba(0,0,255,0.2)", padding: "12px 16px", marginBottom: "24px", fontSize: "18px", color: "#0000FF", letterSpacing: "4px", textShadow: "0 0 10px rgba(0,0,255,0.8)", textAlign: "center" }}>
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
                background: isDone ? "rgba(0,0,255,0.08)" : "#0a0a0a",
                border: `1px solid ${isCurrent ? "#0000FF" : isDone ? "rgba(0,0,255,0.3)" : "#1a1a1a"}`,
                transition: "all 0.4s ease",
                animation: isCurrent ? "pulse 0.5s ease" : "none",
              }}
            >
              <div style={{
                width: "36px", height: "36px",
                border: `2px solid ${isDone ? "#0000FF" : "#222"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px",
                background: isDone ? "rgba(0,0,255,0.2)" : "transparent",
                flexShrink: 0,
                transition: "all 0.4s ease",
              }}>
                {step.icon}
              </div>
              <div>
                <div className="bc" style={{ fontSize: "14px", color: isDone ? "#fff" : "#444", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {step.label}
                </div>
                <div className="mono" style={{ fontSize: "10px", color: isDone ? "#0000FF" : "#333", marginTop: "2px" }}>
                  {step.sub}
                </div>
              </div>
              {isDone && (
                <div style={{ marginLeft: "auto", color: "#4ade80", fontSize: "16px" }}>✓</div>
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
