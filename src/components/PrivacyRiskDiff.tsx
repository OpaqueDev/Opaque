"use client";

import { Check, X } from "lucide-react";

const BEFORE = [
  "Wallet exposed",
  "Balance visible",
  "Positions copyable",
  "Strategy leaked",
  "Screenshots can be faked",
  "Copy-trading / MEV risk high",
];

const AFTER = [
  "Wallet masked",
  "Balance encrypted",
  "Holdings hidden",
  "PnL verifiable",
  "TEE-attested compute",
  "Shareable proof link",
];

type PrivacyRiskDiffProps = {
  compact?: boolean;
};

export function PrivacyRiskDiff({ compact = false }: PrivacyRiskDiffProps) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", padding: compact ? "20px" : "28px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div>
          <div className="section-label" style={{ marginBottom: "8px" }}>Privacy Diff</div>
          <div className="bc" style={{ fontSize: compact ? "22px" : "28px", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Before OPAQUE / After OPAQUE
          </div>
        </div>
        <div className="mono" style={{ fontSize: "10px", color: "#0000FF", letterSpacing: "1px", textTransform: "uppercase" }}>
          Performance public. Balance private.
        </div>
      </div>

      <div className="opaque-risk-diff-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", border: "1px solid var(--border)", background: "var(--border)" }}>
        <div style={{ background: "var(--surface-alt)", padding: compact ? "18px" : "22px" }}>
          <div className="bc" style={{ fontSize: "17px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>
            Before OPAQUE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {BEFORE.map(item => (
              <div key={item} className="mono" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                <span style={{ width: "18px", height: "18px", border: "1px solid rgba(255,68,68,0.28)", color: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <X size={12} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(0,0,255,0.05)", padding: compact ? "18px" : "22px", borderLeft: "1px solid var(--border)" }}>
          <div className="bc" style={{ fontSize: "17px", color: "#0000FF", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>
            After OPAQUE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {AFTER.map(item => (
              <div key={item} className="mono" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "var(--text-dim)", letterSpacing: "0.5px" }}>
                <span style={{ width: "18px", height: "18px", border: "1px solid rgba(74,222,128,0.28)", color: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={12} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 700px) {
          .opaque-risk-diff-grid { grid-template-columns: 1fr !important; }
          .opaque-risk-diff-grid > div:last-child { border-left: none !important; border-top: 1px solid var(--border) !important; }
        }
      ` }} />
    </div>
  );
}
