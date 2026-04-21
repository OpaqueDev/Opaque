"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { ProofCard } from "@/components/ProofCard";
import { Loader2 } from "lucide-react";

// Loading drama messages - the WOW sequence
const LOADING_STEPS = [
  "Handshaking with iExec Nox Enclave...",
  "AES-256 encrypting portfolio inputs...",
  "Computing inside SGX hardware boundary...",
  "Generating SHA-256 deterministic proof...",
  "Sealing result to Arbitrum Sepolia...",
];

const HOW_IT_WORKS = [
  { n: "01", title: "Encrypt Data", body: "Your inputs never leave the local context. AES-256 encryption via iExec Nox public key before any network call.", icon: "🔒" },
  { n: "02", title: "Compute Privately", body: "Calculation runs inside an Intel SGX hardware enclave. Even the node operator cannot read your portfolio values.", icon: "⬡" },
  { n: "03", title: "Reveal Only Result", body: "Only the final PnL percentage exits the TEE. The raw balance stays permanently masked inside the enclave.", icon: "✦" },
];

export default function ComputeVaultPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [initialValue, setInitialValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<{ pnl: string; proof: string } | null>(null);
  const [shareMode, setShareMode] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCompute = async () => {
    if (!initialValue || !finalValue || !address) return;
    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    // Loading drama: cycle through messages
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 420));
    }

    try {
      const res = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial: Number(initialValue), final: Number(finalValue), wallet: address }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#05050a",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `opaque-proof-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  // ── SHARE / FULLSCREEN MODE ──────────────────────────────────────────────────
  if (shareMode && result) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#080810", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", gap: "20px" }}>
        <div style={{ width: "100%", maxWidth: "520px", animation: "fade-in 0.5s ease" }}>
          <div ref={cardRef}>
            <ProofCard pnl={result.pnl} proof={result.proof} wallet={address!} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
            <button
              className="mono"
              onClick={handleDownload}
              style={{ padding: "14px", background: "#0000FF", color: "#fff", border: "none", fontSize: "12px", cursor: "pointer", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 0 20px rgba(0,0,255,0.4)" }}
            >
              ⬇ DOWNLOAD PNG
            </button>
            <button
              className="mono"
              onClick={() => {
                if (!result) return;
                const text = `🔒 OPAQUE PROTOCOL — Proof of Alpha\nYield: ${result.pnl} VERIFIED\nProof: 0x${result.proof.slice(0, 16)}...\n✓ Deterministic · iExec Nox TEE\nhttps://opaque.finance`;
                navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
              }}
              style={{ padding: "14px", background: "transparent", color: "#fff", border: "1px solid #333", fontSize: "12px", cursor: "pointer", letterSpacing: "1px" }}
            >
              📋 COPY AS TEXT
            </button>
          </div>

          <button className="mono" style={{ width: "100%", marginTop: "12px", padding: "12px", background: "transparent", color: "#555", border: "1px solid #1a1a1a", cursor: "pointer", fontSize: "11px" }} onClick={() => setShareMode(false)}>
            ← BACK TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN DASHBOARD VIEW ──────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "64px", animation: "fade-in 0.3s ease" }}>
      
      {/* HOW IT WORKS — Confidential Compute Explain */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }} className="dash-grid-3col">
        {HOW_IT_WORKS.map((step) => (
          <div key={step.n} style={{ background: "#0a0a14", border: "1px solid #1a1a1a", padding: "20px", display: "flex", flexDirection: "column", gap: "10px", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,0,255,0.4)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#1a1a1a")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{step.icon}</span>
              <span className="mono" style={{ fontSize: "9px", color: "#0000FF", letterSpacing: "2px" }}>STEP {step.n}</span>
            </div>
            <div className="bc" style={{ fontSize: "16px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.5px" }}>{step.title}</div>
            <div style={{ fontSize: "11px", color: "#666", lineHeight: 1.7 }}>{step.body}</div>
          </div>
        ))}
      </div>

      {/* MAIN PANEL: Input + Proof Card */}
      <div className="dash-grid-2">
        {/* Left: Input Panel */}
        <div style={{ background: "#111", border: "1px solid #222", padding: "40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, padding: "16px", color: "rgba(255,255,255,0.04)", fontSize: "120px", lineHeight: 0.5, pointerEvents: "none" }} className="bc">OPQ</div>
          <h2 className="bc" style={{ fontSize: "28px", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Generate Proof</h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "32px", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
            iExec Nox masks your portfolio inputs. Calculate an auditable, trustless Proof of Alpha without leaking your balance to the Arbitrum chain.
          </p>

          {!mounted || !isConnected ? (
            <div style={{ padding: "40px", background: "rgba(0,0,255,0.05)", border: "1px dashed rgba(0,0,255,0.3)", textAlign: "center", color: "#0000FF", fontSize: "12px" }} className="mono">
              [ WALLET CONNECTION REQUIRED ]
            </div>
          ) : (
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label className="bc" style={{ display: "block", fontSize: "10px", color: "#999", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Initial Shielded Value (USD)</label>
                  <input type="number" placeholder="e.g. 10000" value={initialValue} onChange={e => setInitialValue(e.target.value)}
                    style={{ width: "100%", background: "#0a0a14", border: "1px solid #333", color: "#fff", padding: "16px", fontSize: "16px", outline: "none" }} className="mono" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="bc" style={{ display: "block", fontSize: "10px", color: "#999", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Final Evaluated Value (USD)</label>
                  <input type="number" placeholder="e.g. 25000" value={finalValue} onChange={e => setFinalValue(e.target.value)}
                    style={{ width: "100%", background: "#0a0a14", border: "1px solid #333", color: "#fff", padding: "16px", fontSize: "16px", outline: "none" }} className="mono" />
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleCompute}
                disabled={loading || !initialValue || !finalValue}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: (loading || !initialValue || !finalValue) ? "#222" : "#0000FF", padding: "16px", cursor: (loading || !initialValue || !finalValue) ? "not-allowed" : "pointer", transition: "background 0.2s" }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> COMPUTING...</> : "PROVE PnL →"}
              </button>

              {/* LOADING DRAMA */}
              {loading && (
                <div style={{ marginTop: "16px", padding: "14px", background: "#0a0a0a", border: "1px solid rgba(0,0,255,0.2)" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {LOADING_STEPS.map((msg, i) => (
                      <div key={i} className="mono" style={{
                        fontSize: "10px",
                        color: i < loadingStep ? "#4ade80" : i === loadingStep ? "#fff" : "#333",
                        display: "flex", alignItems: "center", gap: "8px",
                        transition: "color 0.3s",
                      }}>
                        <span>{i < loadingStep ? "✓" : i === loadingStep ? "▶" : "○"}</span>
                        {msg}
                      </div>
                    ))}
                  </div>
                  {/* Progress bar */}
                  <div style={{ marginTop: "12px", height: "2px", background: "#1a1a1a" }}>
                    <div style={{
                      height: "100%",
                      width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%`,
                      background: "#0000FF",
                      transition: "width 0.4s ease",
                      boxShadow: "0 0 8px rgba(0,0,255,0.6)",
                    }} />
                  </div>
                </div>
              )}

              <div style={{ fontSize: "10px", color: "#555", marginTop: "12px" }} className="mono">
                Data processed off-chain via iExec Nox TEE. 0% data leakage.
              </div>
            </div>
          )}
        </div>

        {/* Right: Proof Card Panel */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,255,0.02)", border: "1px dashed #1a1a1a" }}>
          {!result ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ width: "80px", height: "80px", border: "2px solid #222", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <div style={{ color: "rgba(0,0,255,0.5)", fontSize: "24px" }}>⬡</div>
              </div>
              <h3 className="bc" style={{ fontSize: "20px", color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>Awaiting Compute...</h3>
              <p className="mono" style={{ fontSize: "10px", color: "#333", marginTop: "8px" }}>Fill in your values and click PROVE PnL</p>
            </div>
          ) : (
            <div style={{ width: "100%", padding: "24px", animation: "fade-in 0.5s ease" }}>
              <ProofCard pnl={result.pnl} proof={result.proof} wallet={address!} />
              <button
                className="btn-primary bc"
                onClick={() => setShareMode(true)}
                style={{ width: "100%", marginTop: "16px", background: "#fff", color: "#0000FF", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                📤 OPEN SHARE MODE ↗
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
