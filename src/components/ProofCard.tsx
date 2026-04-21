"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function useAsciiBlur(value: string, isPrivate: boolean) {
  const [blurred, setBlurred] = useState(value);
  
  useEffect(() => {
    if (!isPrivate) {
      setBlurred(value);
      return;
    }
    const chars = ['█', '▓', '▒', '░', '◉', 'X', '#', '@', '/', '\\'];
    const interval = setInterval(() => {
      let b = "";
      for (let i = 0; i < value.length; i++) {
        b += chars[Math.floor(Math.random() * chars.length)];
      }
      setBlurred(b);
    }, 80);
    return () => clearInterval(interval);
  }, [value, isPrivate]);
  
  return isPrivate ? blurred : value;
}

interface ProofCardProps {
  pnl: string;
  proof: string;
  wallet: string;
}

export function ProofCard({ pnl, proof, wallet }: ProofCardProps) {
  const encBalance = useAsciiBlur("12345678USD", true);

  const shortenWallet = (w: string) => `${w.slice(0, 6)}...${w.slice(-4)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      style={{
        background: "radial-gradient(circle at top right, rgba(0,0,255,0.15), transparent 60%), #05050a",
        border: "2px solid #0000FF",
        padding: "32px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 30px rgba(0, 0, 255, 0.2), inset 0 0 20px rgba(0, 0, 255, 0.1)"
      }}
    >
      {/* Background Watermark */}
      <div className="bc" style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "140px", color: "rgba(0,0,255,0.05)", lineHeight: 0.8, pointerEvents: "none" }}>
        ALPHA
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <div className="bc" style={{ fontSize: "24px", color: "#fff", textTransform: "uppercase", letterSpacing: "1px" }}>OPAQUE_</div>
            <div className="mono" style={{ fontSize: "10px", color: "#0000FF", letterSpacing: "2px", textTransform: "uppercase" }}>Cryptographic Proof</div>
          </div>
          <div className="mono" style={{ background: "#0000FF", color: "#fff", padding: "4px 8px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
            Nox TEE Secured
          </div>
        </div>

        {/* Main PnL */}
        <div style={{ marginBottom: "40px" }}>
          <div className="mono" style={{ fontSize: "12px", color: "#999", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Audited Net Yield</div>
          <div className="bc" style={{ fontSize: "clamp(64px, 12vw, 96px)", color: "#fff", lineHeight: 0.9, letterSpacing: "-2px", textShadow: "0 0 20px rgba(0,0,255,0.8)" }}>
            {pnl.startsWith("+") ? <span style={{ color: "#0000FF" }}>+</span> : ""}{pnl.replace("+", "")}
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px", borderTop: "1px dashed #1a1a1a", borderBottom: "1px dashed #1a1a1a", padding: "16px 0" }}>
          <div>
            <div className="mono" style={{ fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Prover Identity</div>
            <div className="mono" style={{ fontSize: "14px", color: "#fff" }}>{shortenWallet(wallet)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: "10px", color: "#0000FF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Confidential Asset</div>
            <div className="mono" style={{ fontSize: "14px", color: "#0000FF", textShadow: "0 0 8px rgba(0,0,255,0.6)" }}>{encBalance}</div>
          </div>
        </div>

        {/* Proof Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#4ade80" }}>✓</span> Reproducible Deterministic Proof
            </div>
            <div className="mono" style={{ fontSize: "11px", color: "#888", wordBreak: "break-all", opacity: 0.8 }}>
              ZKP_0x{proof}
            </div>
          </div>
          
          <button className="mono" style={{ padding: "8px 16px", background: "rgba(0,0,255,0.1)", border: "1px solid rgba(0,0,255,0.3)", color: "#0000FF", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 0 10px rgba(0,0,255,0.2)" }}>
            [ DOWNLOAD PNG ]
          </button>
        </div>
      </div>
    </motion.div>
  );
}
