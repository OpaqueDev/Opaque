"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Cpu, Eye, Lock, ShieldCheck } from "lucide-react";
import {
  buildMockAttestation,
  formatProofTimestamp,
  normalizeProofId,
  type TEEAttestationMetadata,
} from "@/lib/proof";

type TEEAttestationBadgeProps = {
  status?: "verified" | "pending" | "failed";
  metadata?: Partial<TEEAttestationMetadata>;
  proofHash?: string;
  timestamp?: number | string;
  expandable?: boolean;
  compact?: boolean;
};

const STATUS_STYLES = {
  verified: { label: "VERIFIED", color: "#4ade80", bg: "rgba(74,222,128,0.06)", border: "rgba(74,222,128,0.22)" },
  pending: { label: "PENDING", color: "#facc15", bg: "rgba(250,204,21,0.06)", border: "rgba(250,204,21,0.22)" },
  failed: { label: "FAILED", color: "#ff4444", bg: "rgba(255,68,68,0.06)", border: "rgba(255,68,68,0.22)" },
};

const DEMO_COMPUTE_TIMESTAMP = 1777593600;

function shortHash(hash?: string) {
  if (!hash) return "unpublished";
  const clean = normalizeProofId(hash);
  return `${clean.slice(0, 8)}...${clean.slice(-6)}`;
}

export function TEEAttestationBadge({
  status = "verified",
  metadata,
  proofHash = metadata?.proofHash ?? "",
  timestamp = metadata?.computeTimestamp ?? DEMO_COMPUTE_TIMESTAMP,
  expandable = true,
  compact = false,
}: TEEAttestationBadgeProps) {
  const [open, setOpen] = useState(false);
  const resolvedStatus = metadata?.status ?? status;
  const style = STATUS_STYLES[resolvedStatus];
  const resolved = {
    ...buildMockAttestation(proofHash || metadata?.proofHash || "demo", timestamp, resolvedStatus),
    ...metadata,
  };

  const details = [
    ["Enclave / Worker", resolved.workerId],
    ["Compute Time", formatProofTimestamp(resolved.computeTimestamp)],
    ["Input Privacy", resolved.inputPrivacy],
    ["Output Revealed", resolved.outputRevealed],
    ["Network", resolved.network],
    ["Proof Hash", shortHash(resolved.proofHash)],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(0,0,255,0.04)",
        border: "1px solid rgba(0,0,255,0.22)",
        padding: compact ? "12px" : "16px",
        position: "relative",
        overflow: "hidden",
        boxShadow: compact ? "none" : "inset 0 0 20px rgba(0,0,255,0.04)",
      }}
    >
      <div style={{ position: "absolute", top: "-20px", right: "-8px", color: "rgba(0,0,255,0.05)" }}>
        <Cpu size={compact ? 72 : 96} strokeWidth={1.2} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div
              style={{
                width: compact ? "34px" : "40px",
                height: compact ? "34px" : "40px",
                border: "1px solid rgba(0,0,255,0.35)",
                background: "rgba(0,0,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0000FF",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={compact ? 17 : 19} />
            </div>
            <div>
              <div className="bc" style={{ fontSize: compact ? "15px" : "17px", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "1px" }}>
                TEE Attested
              </div>
              <div className="mono" style={{ fontSize: "9px", color: "#0000FF", letterSpacing: "1px", marginTop: "3px", textTransform: "uppercase" }}>
                iExec Nox Verified Compute
              </div>
              {!compact && (
                <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.6, marginTop: "8px" }}>
                  Hardware-backed confidential compute. Demo metadata shown unless a live attestation is connected.
                </div>
              )}
            </div>
          </div>

          <div
            className="mono"
            style={{
              color: style.color,
              background: style.bg,
              border: `1px solid ${style.border}`,
              padding: "4px 8px",
              fontSize: "9px",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: style.color, boxShadow: `0 0 8px ${style.color}` }} />
            {style.label}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
          {[
            { label: "Balance Hidden", icon: <Lock size={12} /> },
            { label: "PnL Revealed", icon: <Eye size={12} /> },
            { label: resolved.isDemo ? "Demo Attestation Metadata" : "Live Attestation Metadata", icon: <Cpu size={12} /> },
          ].map(item => (
            <span
              key={item.label}
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                border: "1px solid rgba(0,0,255,0.18)",
                background: "rgba(0,0,255,0.05)",
                color: item.label.startsWith("Demo") ? "var(--text-muted)" : "var(--text-dim)",
                padding: "5px 8px",
                fontSize: "9px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {item.icon}
              {item.label}
            </span>
          ))}
        </div>

        {expandable && (
          <button
            type="button"
            onClick={() => setOpen(value => !value)}
            className="mono"
            style={{
              marginTop: "12px",
              background: "transparent",
              border: "1px dashed var(--border)",
              color: "var(--text-muted)",
              fontSize: "9px",
              letterSpacing: "1px",
              padding: "7px 10px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textTransform: "uppercase",
            }}
          >
            <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            Attestation Details
          </button>
        )}

        <AnimatePresence initial={false}>
          {expandable && open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
                {details.map(([label, value]) => (
                  <div key={label} style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", padding: "10px" }}>
                    <div className="mono" style={{ fontSize: "8px", color: "var(--text-faint)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" }}>
                      {label}
                    </div>
                    <div className="mono" style={{ fontSize: "10px", color: label === "Proof Hash" ? "#0000FF" : "var(--text-dim)", wordBreak: "break-word" }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
