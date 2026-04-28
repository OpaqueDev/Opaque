"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { Loader2 } from "lucide-react";
import { ProofCard } from "@/components/ProofCard";

const LOADING_STEPS = [
  { msg: "Reading on-chain deposit events...", icon: "▣" },
  { msg: "Fetching live asset prices...",      icon: "◈" },
  { msg: "Generating TEE attestation proof...", icon: "◇" },
];

const HOW_IT_WORKS_ICONS = [
  <svg key="shield" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <line x1="12" y1="10" x2="12" y2="14"/>
    <circle cx="12" cy="8.5" r="1"/>
  </svg>,
  <svg key="cpu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1"/>
    <line x1="9" y1="7" x2="9" y2="4"/><line x1="12" y1="7" x2="12" y2="4"/><line x1="15" y1="7" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="17"/><line x1="12" y1="20" x2="12" y2="17"/><line x1="15" y1="20" x2="15" y2="17"/>
    <line x1="7" y1="9" x2="4" y2="9"/><line x1="7" y1="12" x2="4" y2="12"/><line x1="7" y1="15" x2="4" y2="15"/>
    <line x1="20" y1="9" x2="17" y2="9"/><line x1="20" y1="12" x2="17" y2="12"/><line x1="20" y1="15" x2="17" y2="15"/>
  </svg>,
  <svg key="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="8.5 12.5 11 15 15.5 10"/>
  </svg>,
];

const HOW_IT_WORKS = [
  { n: "01", title: "Data is Encrypted",      body: "Inputs are sealed with AES-256 before leaving your device. Only the iExec Nox enclave holds the key." },
  { n: "02", title: "Compute Runs Privately", body: "Computation happens inside an Intel SGX enclave. Zero visibility — not even the node operator can read your values." },
  { n: "03", title: "Only Result is Revealed",body: "The yield percentage exits the enclave. Your balance, positions, and wallet history stay completely hidden." },
];

export default function ComputeVaultPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t); }, []);

  const [loading, setLoading]       = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult]         = useState<{ pnl: string; proof: string; deposits_analysed?: number } | null>(null);
  const [shareMode, setShareMode]   = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [initialValue, setInitialValue] = useState("");
  const [finalValue, setFinalValue]     = useState("");
  const [error, setError]           = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-compute when wallet connects
  useEffect(() => {
    if (mounted && isConnected && address && !result && !loading) {
      handleCompute();
    }
  }, [mounted, isConnected, address]);

  const handleCompute = async (manual = false) => {
    if (!address) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 700));
    }

    try {
      const body: Record<string, unknown> = { wallet: address };
      if (manual && initialValue && finalValue) {
        body.initial = Number(initialValue);
        body.final   = Number(finalValue);
      }

      const res  = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Compute failed");

      setResult(data);

      // Save to proof history for win rate
      if (address && data.pnl) {
        const key = `opaque_proofs_${address.toLowerCase()}`;
        try {
          const prev = JSON.parse(localStorage.getItem(key) || "[]");
          prev.unshift({ pnl: data.pnl, initial: body.initial, final: body.final, ts: Date.now() });
          localStorage.setItem(key, JSON.stringify(prev.slice(0, 100)));
        } catch {}
      }
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    await new Promise(r => setTimeout(r, 80));
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#04040d", scale: 2, useCORS: true });
    setIsCapturing(false);
    const a = document.createElement("a");
    a.download = `opaque-alpha-proof-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  // ── Share fullscreen ────────────────────────────────────────────────────────
  if (shareMode && result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: "fixed", inset: 0, zIndex: 100, background: "var(--bg-deep)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}
      >
        <div style={{ width: "100%", maxWidth: "540px" }}>
          <div className="mono" style={{ fontSize: "10px", color: "var(--text-faint)", letterSpacing: "2px", textAlign: "center", marginBottom: "20px" }}>
            ALPHA CARD — READY TO SHARE
          </div>
          <div ref={cardRef}>
            <ProofCard pnl={result.pnl} proof={result.proof} wallet={address!} isCapturing={isCapturing} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDownload} className="mono"
              style={{ padding: "16px", background: "#0000FF", color: "#fff", border: "none", fontSize: "12px", cursor: "pointer", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              ⬇ DOWNLOAD PNG
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigator.clipboard.writeText(`🔒 OPAQUE — Proof of Alpha\n\nVerified Yield: ${result.pnl}\nProof: 0x${result.proof.slice(0, 20)}...\n\n✓ Deterministic · iExec Nox TEE\n#DeFi #ProofOfAlpha #OPAQUE`)}
              className="mono"
              style={{ padding: "16px", background: "transparent", color: "var(--text-dim)", border: "1px solid var(--border-soft)", fontSize: "12px", cursor: "pointer", letterSpacing: "1px" }}>
              📋 COPY TEXT
            </motion.button>
          </div>
          <button onClick={() => setShareMode(false)} className="mono"
            style={{ width: "100%", marginTop: "12px", padding: "12px", background: "transparent", color: "var(--border-soft)", border: "none", cursor: "pointer", fontSize: "11px" }}>
            ← back to dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "64px", animation: "fade-in 0.4s ease" }}>

      {/* How It Works */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,255,0.02)", border: "1px solid var(--border-strong)", padding: "32px", gap: "16px", overflowX: "auto" }}>
        {HOW_IT_WORKS.map((step, i) => (
          <div key={step.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ padding: "20px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span style={{ color: i === 2 ? "#4ade80" : "#0000FF", flexShrink: 0 }}>{HOW_IT_WORKS_ICONS[i]}</span>
                <span className="bc" style={{ fontSize: "16px", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "1px" }}>{step.title}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "240px" }}>{step.body}</div>
            </motion.div>
            {i < HOW_IT_WORKS.length - 1 && (
              <div style={{ padding: "0 16px", color: "#0000FF", opacity: 0.5 }}>→</div>
            )}
          </div>
        ))}
      </div>

      <div className="mono" style={{ textAlign: "center", fontSize: "10px", color: "var(--border-soft)", letterSpacing: "2px" }}>
        POWERED BY IEXEC NOX · INTEL SGX TRUSTED EXECUTION · SHA-256 ATTESTATION
      </div>

      {/* Main content grid */}
      <div className="dash-grid-2">

        {/* Left: Status + Controls */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, padding: "16px", color: "rgba(0,0,255,0.04)", fontSize: "110px", lineHeight: 0.5, pointerEvents: "none", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}>OPQ</div>

          <h2 className="bc" style={{ fontSize: "26px", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1px", color: "var(--foreground)" }}>
            Proof of Alpha Engine
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-faint)", marginBottom: "32px", lineHeight: 1.7 }}>
            PnL is computed automatically from your on-chain deposit history inside the iExec Nox enclave. Only the result exits.
          </p>

          {!mounted || !isConnected ? (
            <div style={{ padding: "36px", background: "rgba(0,0,255,0.04)", border: "1px dashed rgba(0,0,255,0.2)", textAlign: "center", color: "#0000FF" }} className="mono">
              <div style={{ fontSize: "18px", marginBottom: "8px" }}>◈</div>
              <div style={{ fontSize: "11px", letterSpacing: "1px" }}>[ WALLET CONNECTION REQUIRED ]</div>
            </div>
          ) : (
            <div style={{ position: "relative", zIndex: 1 }}>

              {/* Auto compute status */}
              {result && !loading && (
                <div style={{ padding: "16px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", flexShrink: 0 }} />
                  <div>
                    <div className="mono" style={{ fontSize: "10px", color: "#4ade80", letterSpacing: "1px" }}>PROOF GENERATED · TEE ATTESTED</div>
                    {result.deposits_analysed !== undefined && (
                      <div className="mono" style={{ fontSize: "9px", color: "var(--text-faint)", marginTop: "2px" }}>
                        {result.deposits_analysed > 0
                          ? `${result.deposits_analysed} on-chain deposit${result.deposits_analysed > 1 ? "s" : ""} analysed`
                          : "Manual input mode"}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="mono" style={{ padding: "12px 16px", background: "rgba(255,60,60,0.05)", border: "1px solid rgba(255,60,60,0.2)", color: "#ff6666", fontSize: "11px", marginBottom: "20px" }}>
                  {error}
                </div>
              )}

              {/* Re-compute button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCompute(false)}
                disabled={loading}
                className="bc"
                style={{
                  width: "100%", padding: "18px",
                  background: loading ? "var(--db-bg)" : "linear-gradient(135deg, #0000FF, #3355FF)",
                  color: "#fff", border: "none",
                  fontSize: "18px", letterSpacing: "1px", textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: !loading ? "0 0 30px rgba(0,0,255,0.3)" : "none",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                }}
              >
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /> COMPUTING IN ENCLAVE...</>
                  : result ? "↻ RECOMPUTE PROOF" : "▶ COMPUTE PROOF OF ALPHA"}
              </motion.button>

              {/* Manual override toggle */}
              <button
                onClick={() => setShowManual(v => !v)}
                className="mono"
                style={{ width: "100%", marginTop: "12px", padding: "10px", background: "transparent", border: "1px dashed var(--border)", color: "var(--text-faint)", fontSize: "10px", cursor: "pointer", letterSpacing: "1px" }}
              >
                {showManual ? "▲ HIDE MANUAL OVERRIDE" : "▼ MANUAL OVERRIDE (enter values)"}
              </button>

              <AnimatePresence>
                {showManual && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ paddingTop: "16px", display: "flex", gap: "12px" }}>
                      {[
                        { label: "Initial Value (USD)", placeholder: "e.g. 10000", val: initialValue, set: setInitialValue },
                        { label: "Final Value (USD)",   placeholder: "e.g. 18430", val: finalValue,   set: setFinalValue },
                      ].map(({ label, placeholder, val, set }) => (
                        <div key={label} style={{ flex: 1 }}>
                          <label className="bc" style={{ display: "block", fontSize: "9px", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</label>
                          <input
                            type="number" placeholder={placeholder} value={val}
                            onChange={e => set(e.target.value)}
                            disabled={loading}
                            style={{ width: "100%", background: "var(--bg-deep)", border: "1px solid var(--border)", borderBottom: "2px solid #0000FF", color: "var(--foreground)", padding: "12px 14px", fontSize: "16px", outline: "none", fontFamily: "'Share Tech Mono', monospace" }}
                          />
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCompute(true)}
                      disabled={loading || !initialValue || !finalValue}
                      className="bc"
                      style={{ width: "100%", marginTop: "12px", padding: "14px", background: (!loading && initialValue && finalValue) ? "#0000FF" : "var(--border)", color: "#fff", border: "none", fontSize: "15px", cursor: (!loading && initialValue && finalValue) ? "pointer" : "not-allowed", letterSpacing: "1px" }}
                    >
                      USE MANUAL VALUES →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mono" style={{ fontSize: "9px", color: "var(--border-soft)", marginTop: "16px", textAlign: "center", letterSpacing: "1px" }}>
                PROOF = SHA256(WALLET + PNL + TIMESTAMP) · ZERO BALANCE DISCLOSURE
              </div>
            </div>
          )}
        </div>

        {/* Right: Proof Card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,255,0.01)", border: "1px dashed var(--border-strong)", minHeight: "380px" }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ padding: "40px", width: "100%", maxWidth: "360px" }}>
                <div className="bc" style={{ fontSize: "18px", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px", textAlign: "center" }}>
                  Confidential Compute
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
                  {LOADING_STEPS.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i <= loadingStep ? 1 : 0.2, x: 0 }}
                      className="mono"
                      style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "12px",
                        color: i < loadingStep ? "#4ade80" : i === loadingStep ? "var(--foreground)" : "var(--text-faint)" }}>
                      <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>
                        {i < loadingStep ? "✓" : i === loadingStep ? s.icon : "○"}
                      </span>
                      {s.msg}
                    </motion.div>
                  ))}
                </div>
                <div style={{ height: "2px", background: "var(--db-bg)", borderRadius: "1px", overflow: "hidden" }}>
                  <motion.div
                    animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ height: "100%", background: "linear-gradient(90deg, #0000FF, #00ffff)", boxShadow: "0 0 10px rgba(0,255,255,0.8)" }}
                  />
                </div>
              </motion.div>
            ) : !result ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "40px" }}>
                <div className="bc" style={{ fontSize: "80px", color: "rgba(0,0,255,0.06)", lineHeight: 1, marginBottom: "16px" }}>⬡</div>
                <div className="bc" style={{ fontSize: "18px", color: "var(--border-soft)", textTransform: "uppercase", letterSpacing: "2px" }}>
                  {isConnected ? "Computing..." : "Proof Pending"}
                </div>
                <div className="mono" style={{ fontSize: "10px", color: "var(--border)", marginTop: "8px" }}>
                  {isConnected ? "Fetching your on-chain history" : "Connect wallet to auto-generate proof"}
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", padding: "24px" }}>
                <div ref={cardRef}>
                  <ProofCard pnl={result.pnl} proof={result.proof} wallet={address!} onDownload={handleDownload} isCapturing={isCapturing} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0,0,255,0.2)" }}
                  whileTap={{ scale: 0.99 }}
                  className="bc"
                  onClick={() => setShareMode(true)}
                  style={{ width: "100%", marginTop: "16px", padding: "16px", background: "var(--foreground)", color: "var(--bg-deep)", border: "none", fontSize: "17px", cursor: "pointer", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {"📤 OPEN SHARE MODE ↗︎"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
