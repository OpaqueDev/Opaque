"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Animated encrypted balance hook ──────────────────────────────────────────
const ENC_CHARS = ["█", "▓", "▒", "░", "◉", "Ø", "#", "ψ", "Σ", "X"];

export function useAsciiBlur(value: string, isPrivate: boolean) {
  const [blurred, setBlurred] = useState(value);
  useEffect(() => {
    if (!isPrivate) { setBlurred(value); return; }
    const iv = setInterval(() => {
      setBlurred(Array.from({ length: value.length }, () =>
        ENC_CHARS[Math.floor(Math.random() * ENC_CHARS.length)]
      ).join(""));
    }, 75);
    return () => clearInterval(iv);
  }, [value, isPrivate]);
  return isPrivate ? blurred : value;
}

// ─── Proof Tooltip ─────────────────────────────────────────────────────────────
function ProofTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          background: "none", border: "1px solid #222", color: "#555",
          fontSize: "9px", padding: "2px 7px", cursor: "pointer",
          fontFamily: "'Share Tech Mono', monospace", letterSpacing: "1px",
        }}
      >
        HOW?
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            style={{
              position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
              transform: "translateX(-50%)",
              background: "#0a0a14", border: "1px solid rgba(0,0,255,0.4)",
              padding: "10px 14px", width: "220px", zIndex: 99,
              boxShadow: "0 0 20px rgba(0,0,255,0.2)",
            }}
          >
            <div style={{ fontSize: "9px", color: "#888", fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.8 }}>
              <div style={{ color: "#0000FF", marginBottom: "4px", fontSize: "10px" }}>Proof Algorithm</div>
              <code style={{ color: "#fff", fontSize: "10px" }}>sha256(wallet + initial + pnl)</code>
              <div style={{ marginTop: "8px", color: "#666" }}>Deterministic — same inputs always produce the same proof. Anyone can verify.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ProofCard ────────────────────────────────────────────────────────────
interface ProofCardProps {
  pnl: string;
  proof: string;
  wallet: string;
  onDownload?: () => void;
}

export function ProofCard({ pnl, proof, wallet, onDownload }: ProofCardProps) {
  const encBalance = useAsciiBlur("████████", true);
  const isProfit = pnl.startsWith("+");
  const shortenWallet = (w: string) => `${w.slice(0, 6)}...${w.slice(-4)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "radial-gradient(ellipse at 70% 0%, rgba(0,0,255,0.2) 0%, transparent 55%), #04040d",
        border: "1px solid rgba(0,0,255,0.5)",
        padding: "36px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 60px rgba(0,0,255,0.15), 0 0 120px rgba(0,0,255,0.06), inset 0 0 30px rgba(0,0,255,0.05)",
      }}
    >
      {/* Scanning line animation */}
      <motion.div
        initial={{ top: "-2px" }}
        animate={{ top: "110%" }}
        transition={{ duration: 2.5, ease: "linear", delay: 0.3 }}
        style={{
          position: "absolute", left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(0,0,255,0.6), transparent)",
          boxShadow: "0 0 8px rgba(0,0,255,0.4)", zIndex: 2, pointerEvents: "none",
        }}
      />

      {/* Watermark */}
      <div className="bc" style={{ position: "absolute", bottom: "-10px", right: "-10px", fontSize: "130px", color: "rgba(0,0,255,0.04)", lineHeight: 0.8, pointerEvents: "none", userSelect: "none" }}>
        OPQ
      </div>

      <div style={{ position: "relative", zIndex: 3 }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
          <div>
            <div className="bc" style={{ fontSize: "22px", color: "#fff", textTransform: "uppercase", letterSpacing: "2px" }}>OPAQUE_</div>
            <div className="mono" style={{ fontSize: "9px", color: "rgba(0,0,255,0.8)", letterSpacing: "3px", textTransform: "uppercase", marginTop: "2px" }}>
              Proof of Alpha Protocol
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <div className="mono" style={{ background: "rgba(0,0,255,0.15)", border: "1px solid rgba(0,0,255,0.4)", color: "#0000FF", padding: "4px 10px", fontSize: "9px", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "5px", height: "5px", background: "#0000FF", borderRadius: "50%", animation: "pulse 1.5s infinite", boxShadow: "0 0 6px #0000FF" }} />
              NOX TEE SECURED
            </div>
            <div className="mono" style={{ fontSize: "8px", color: "#333", letterSpacing: "1px" }}>Arbitrum Sepolia · Chain 421614</div>
          </div>
        </div>

        {/* PnL HERO — The BOOM element */}
        <div style={{ marginBottom: "32px" }}>
          <div className="mono" style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "12px" }}>
            Verified Net Yield
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bc"
            style={{
              fontSize: "clamp(72px, 14vw, 108px)",
              lineHeight: 0.85,
              letterSpacing: "-3px",
              background: isProfit
                ? "linear-gradient(135deg, #fff 30%, #6699FF 70%)"
                : "linear-gradient(135deg, #fff 30%, #ff4444 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: isProfit
                ? "drop-shadow(0 0 20px rgba(0,100,255,0.8)) drop-shadow(0 0 40px rgba(0,0,255,0.4))"
                : "drop-shadow(0 0 20px rgba(255,60,60,0.8))",
              userSelect: "none",
            }}
          >
            {pnl}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}
          >
            {[
              { icon: "✓", text: "Deterministic Proof", color: "#4ade80" },
              { icon: "✓", text: "Reproducible Result", color: "#4ade80" },
              { icon: "✓", text: "iExec Nox Attested", color: "#0000FF" },
            ].map((b) => (
              <div key={b.text} className="mono" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "9px", color: "#555", letterSpacing: "0.5px" }}>
                <span style={{ color: b.color, fontSize: "11px" }}>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,0,255,0.3), transparent)", marginBottom: "20px" }} />

        {/* Details Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div>
            <div className="mono" style={{ fontSize: "9px", color: "#444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Prover Identity</div>
            <div className="mono" style={{ fontSize: "13px", color: "#aaa" }}>{shortenWallet(wallet)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: "9px", color: "#0000FF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Shielded Balance</div>
            <div className="mono" style={{ fontSize: "15px", color: "rgba(0,0,255,0.7)", letterSpacing: "2px", textShadow: "0 0 10px rgba(0,0,255,0.4)" }}>
              {encBalance}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,0,255,0.3), transparent)", marginBottom: "20px" }} />

        {/* Proof Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div className="mono" style={{ fontSize: "9px", color: "#444", textTransform: "uppercase", letterSpacing: "1px" }}>
                Proof ID
              </div>
              <ProofTooltip />
            </div>
            <div className="mono" style={{ fontSize: "10px", color: "#555", wordBreak: "break-all", lineHeight: 1.5 }}>
              0x{proof.slice(0, 32)}...
            </div>
          </div>
          {onDownload && (
            <button
              onClick={onDownload}
              className="mono"
              style={{
                padding: "8px 14px", flexShrink: 0,
                background: "rgba(0,0,255,0.08)",
                border: "1px solid rgba(0,0,255,0.25)",
                color: "#0000FF", fontSize: "9px", cursor: "pointer",
                letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,255,0.2)"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0,0,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              ⬇ PNG
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
