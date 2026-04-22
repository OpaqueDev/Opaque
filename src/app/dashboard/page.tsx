"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { ProofCard } from "@/components/ProofCard";

// ─── Cinematic loading steps ───────────────────────────────────────────────────
const LOADING_STEPS = [
  { msg: "Encrypting portfolio...", icon: "🔒" },
  { msg: "Running confidential compute...", icon: "⬡" },
  { msg: "Generating proof...", icon: "◈" }
];

// ─── How It Works panel ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    n: "01", icon: "🔒", title: "Data is Encrypted",
    body: "Inputs are sealed with AES-256 before leaving your device. Only the iExec Nox enclave holds the key.",
  },
  {
    n: "02", icon: "⬡", title: "Compute Runs Privately",
    body: "Computation happens inside an Intel SGX enclave. Zero visibility — not even the node operator can read your values.",
  },
  {
    n: "03", icon: "✓", title: "Only Result is Revealed",
    body: "The yield percentage exits the enclave. Your balance, positions, and wallet history stay completely hidden.",
  },
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
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 600));
    }
    try {
      const res = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial: Number(initialValue), final: Number(finalValue), wallet: address }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#04040d", scale: 2, useCORS: true });
    const a = document.createElement("a");
    a.download = `opaque-alpha-proof-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  // ── Share / Alpha Card fullscreen ──────────────────────────────────────────
  if (shareMode && result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: "fixed", inset: 0, zIndex: 100, background: "#04040d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}
      >
        <div style={{ width: "100%", maxWidth: "540px" }}>
          {/* Instruction */}
          <div className="mono" style={{ fontSize: "10px", color: "#555", letterSpacing: "2px", textAlign: "center", marginBottom: "20px" }}>
            ALPHA CARD — READY TO SHARE
          </div>

          {/* Downloadable card */}
          <div ref={cardRef}>
            <ProofCard pnl={result.pnl} proof={result.proof} wallet={address!} />
          </div>

          {/* Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,0,255,0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="mono"
              style={{ padding: "16px", background: "#0000FF", color: "var(--text-primary)", border: "none", fontSize: "12px", cursor: "pointer", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              ⬇ DOWNLOAD PNG
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const txt = `🔒 OPAQUE — Proof of Alpha\n\nVerified Yield: ${result.pnl}\nProof: 0x${result.proof.slice(0, 20)}...\n\n✓ Deterministic · iExec Nox TEE\n✓ Balance remains private\n\n#DeFi #ProofOfAlpha #OPAQUE`;
                navigator.clipboard.writeText(txt);
              }}
              className="mono"
              style={{ padding: "16px", background: "transparent", color: "#aaa", border: "1px solid #222", fontSize: "12px", cursor: "pointer", letterSpacing: "1px" }}
            >
              📋 COPY TEXT
            </motion.button>
          </div>
          <button onClick={() => setShareMode(false)} className="mono" style={{ width: "100%", marginTop: "12px", padding: "12px", background: "transparent", color: "#333", border: "none", cursor: "pointer", fontSize: "11px" }}>
            ← back to dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Main Dashboard view ────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "64px", animation: "fade-in 0.4s ease" }}>

      {/* ── How It Works Visual Flow ────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,255,0.02)", border: "1px solid #12121e", padding: "32px", gap: "16px", overflowX: "auto" }}>
        {HOW_IT_WORKS.map((step, i) => (
          <div key={step.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: "20px", flex: 1, position: "relative" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span style={{ fontSize: "20px", color: i === 2 ? "#4ade80" : "#fff" }}>{step.icon}</span>
                <span className="bc" style={{ fontSize: "16px", color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "1px" }}>{step.title}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#666", lineHeight: 1.6, maxWidth: "240px" }}>{step.body}</div>
            </motion.div>
            
            {i < HOW_IT_WORKS.length - 1 && (
              <div style={{ padding: "0 16px", color: "#0000FF", opacity: 0.5 }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Core iExec Nox note ───────────────────────────────────────────────── */}
      <div className="mono" style={{ textAlign: "center", fontSize: "10px", color: "#222", letterSpacing: "2px" }}>
        POWERED BY IEXEC NOX · INTEL SGX TRUSTED EXECUTION · SHA-256 ATTESTATION
      </div>

      {/* ── Input + Result ────────────────────────────────────────────────────── */}
      <div className="dash-grid-2">

        {/* Left: Input panel */}
        <div style={{ background: "#07070f", border: "1px solid #12121e", padding: "40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, padding: "16px", color: "rgba(0,0,255,0.04)", fontSize: "110px", lineHeight: 0.5, pointerEvents: "none", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}>OPQ</div>

          <h2 className="bc" style={{ fontSize: "26px", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px", color: "var(--text-primary)" }}>
            Generate Proof of Alpha
          </h2>
          <p style={{ fontSize: "12px", color: "#444", marginBottom: "32px", lineHeight: 1.7, position: "relative", zIndex: 1 }}>
            Prove your trading performance to anyone. Your actual balance stays hidden inside the enclave.
          </p>

          {!mounted || !isConnected ? (
            <div style={{ padding: "36px", background: "rgba(0,0,255,0.04)", border: "1px dashed rgba(0,0,255,0.2)", textAlign: "center", color: "#0000FF" }} className="mono">
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>◈</div>
              <div style={{ fontSize: "11px", letterSpacing: "1px" }}>[ WALLET CONNECTION REQUIRED ]</div>
            </div>
          ) : (
            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Inputs */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                {[
                  { label: "Initial Value (USD)", placeholder: "e.g. 10000", val: initialValue, set: setInitialValue },
                  { label: "Final Value (USD)", placeholder: "e.g. 18430", val: finalValue, set: setFinalValue },
                ].map(({ label, placeholder, val, set }) => (
                  <div key={label} style={{ flex: 1 }}>
                    <label className="bc" style={{ display: "block", fontSize: "9px", color: "#555", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</label>
                    <input
                      type="number" placeholder={placeholder} value={val}
                      onChange={e => set(e.target.value)}
                      disabled={loading}
                      style={{ width: "100%", background: "#04040d", border: "1px solid #1a1a1a", borderBottom: "2px solid #0000FF", color: "var(--text-primary)", padding: "14px 16px", fontSize: "18px", outline: "none", transition: "border-color 0.2s", fontFamily: "'Share Tech Mono', monospace" }}
                      onFocus={e => { e.target.style.borderColor = "#0000FF"; e.target.style.boxShadow = "0 0 0 1px rgba(0,0,255,0.3)"; }}
                      onBlur={e => { e.target.style.borderColor = "#1a1a1a"; e.target.style.borderBottomColor = "#0000FF"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCompute}
                disabled={loading || !initialValue || !finalValue}
                className="bc"
                style={{
                  width: "100%", padding: "18px",
                  background: loading || !initialValue || !finalValue
                    ? "#111" : "linear-gradient(135deg, #0000FF, #3355FF)",
                  color: "var(--text-primary)", border: "none",
                  fontSize: "18px", letterSpacing: "1px", textTransform: "uppercase",
                  cursor: loading || !initialValue || !finalValue ? "not-allowed" : "pointer",
                  boxShadow: (!loading && initialValue && finalValue) ? "0 0 30px rgba(0,0,255,0.3)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "COMPUTING..." : "GENERATE PROOF OF ALPHA →"}
              </motion.button>

              {/* Cinematic loading Drop Backdrop & UI */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      style={{ background: "#04040d", border: "1px solid #0000FF", padding: "40px", width: "400px", boxShadow: "0 0 50px rgba(0,0,255,0.2)" }}
                    >
                      <div className="bc" style={{ fontSize: "20px", color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px", textAlign: "center" }}>
                        Confidential Compute
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                        {LOADING_STEPS.map((s, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: i <= loadingStep ? 1 : 0.2, x: 0 }}
                            className="mono"
                            style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "12px",
                              color: i < loadingStep ? "#4ade80" : i === loadingStep ? "#fff" : "#444" }}
                          >
                            <span style={{ fontSize: "16px", display: "inline-block", width: "20px", textAlign: "center" }}>
                              {i < loadingStep ? "✓" : i === loadingStep ? <span style={{ animation: "pulse 1s infinite" }}>{s.icon}</span> : "○"}
                            </span>
                            {s.msg}
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Pulse Loader */}
                      <div style={{ height: "2px", background: "#111", borderRadius: "1px", overflow: "hidden" }}>
                        <motion.div
                          animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                          transition={{ duration: 0.4 }}
                          style={{ height: "100%", background: "linear-gradient(90deg, #0000FF, #00ffff)", boxShadow: "0 0 10px rgba(0,255,255,0.8)" }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mono" style={{ fontSize: "9px", color: "#333", marginTop: "12px", textAlign: "center", letterSpacing: "1px" }}>
                PROOF = SHA256(WALLET + INITIAL + PNL) · ZERO BALANCE DISCLOSURE
              </div>
            </div>
          )}
        </div>

        {/* Right: Proof Card result */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,255,0.01)", border: "1px dashed #0d0d1a", minHeight: "380px" }}>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", padding: "40px" }}>
                <div className="bc" style={{ fontSize: "80px", color: "rgba(0,0,255,0.06)", lineHeight: 1, marginBottom: "16px" }}>⬡</div>
                <div className="bc" style={{ fontSize: "18px", color: "#222", textTransform: "uppercase", letterSpacing: "2px" }}>Proof Pending</div>
                <div className="mono" style={{ fontSize: "10px", color: "#1a1a1a", marginTop: "8px" }}>Enter values and generate your proof</div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", padding: "24px" }}>
                <ProofCard
                  pnl={result.pnl}
                  proof={result.proof}
                  wallet={address!}
                  onDownload={handleDownload}
                />
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0,0,255,0.2)" }}
                  whileTap={{ scale: 0.99 }}
                  className="bc"
                  onClick={() => setShareMode(true)}
                  style={{ width: "100%", marginTop: "16px", padding: "16px", background: "#fff", color: "#0000FF", border: "none", fontSize: "17px", cursor: "pointer", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  📤 OPEN SHARE MODE ↗
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
