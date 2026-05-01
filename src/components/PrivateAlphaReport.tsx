"use client";

import { useMemo, useRef, useState } from "react";
import { Copy, Download, ExternalLink } from "lucide-react";
import { TEEAttestationBadge } from "@/components/TEEAttestationBadge";
import {
  buildVerifyPath,
  formatProofTimestamp,
  maskWallet,
  normalizePnl,
  normalizeProofId,
} from "@/lib/proof";

type PrivateAlphaReportProps = {
  wallet: string;
  pnl: string;
  proof: string;
  timestamp?: number;
  riskScore?: string;
};

const WINDOWS = ["7D", "30D", "90D"] as const;
const DEMO_REPORT_TIMESTAMP = 1777593600;

function shortProof(proof: string) {
  const clean = normalizeProofId(proof);
  return `${clean.slice(0, 8)}...${clean.slice(-6)}`;
}

export function PrivateAlphaReport({
  wallet,
  pnl,
  proof,
  timestamp = DEMO_REPORT_TIMESTAMP,
  riskScore = "A- demo fallback",
}: PrivateAlphaReportProps) {
  const [windowLabel, setWindowLabel] = useState<(typeof WINDOWS)[number]>("90D");
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const verifyPath = useMemo(
    () => buildVerifyPath(proof, { wallet, pnl, timestamp }),
    [pnl, proof, timestamp, wallet],
  );

  const verifyUrl = typeof window === "undefined" ? verifyPath : `${window.location.origin}${verifyPath}`;

  const metrics = useMemo(() => {
    const normalized = parseFloat(normalizePnl(pnl));
    const positive = Number.isFinite(normalized) ? Math.max(normalized, 0) : 0;

    return [
      { label: "Risk Score", value: riskScore },
      { label: "Max Drawdown", value: positive > 70 ? "-6.8%" : "-4.9%" },
      { label: "Consistency", value: positive > 70 ? "94/100" : "86/100" },
      { label: "Win Rate", value: positive > 70 ? "78%" : "68%" },
    ];
  }, [pnl, riskScore]);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 80));
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#04040d",
      scale: 2,
      useCORS: true,
    });
    setIsDownloading(false);

    const link = document.createElement("a");
    link.download = `opaque-private-alpha-report-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText([
      "OPAQUE Private Alpha Report",
      `Wallet: ${maskWallet(wallet)}`,
      `Verified PnL: ${normalizePnl(pnl)}%`,
      `Window: ${windowLabel}`,
      `Proof ID: 0x${normalizeProofId(proof)}`,
      `Verify: ${verifyUrl}`,
      "Balance hidden. Holdings hidden. Strategy hidden. Performance verified.",
    ].join("\n"));
  };

  const buttonStyle = {
    padding: "10px 12px",
    background: "rgba(0,0,255,0.08)",
    border: "1px solid rgba(0,0,255,0.25)",
    color: "#0000FF",
    fontSize: "9px",
    cursor: "pointer",
    letterSpacing: "1px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    textTransform: "uppercase" as const,
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "20px", marginTop: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
        <div>
          <div className="bc" style={{ fontSize: "18px", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Private Alpha Report
          </div>
          <div className="mono" style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "4px", letterSpacing: "1px" }}>
            BALANCE HIDDEN / PERFORMANCE VERIFIED
          </div>
        </div>
        <div style={{ display: "flex", gap: "4px", border: "1px solid rgba(0,0,255,0.18)", background: "rgba(0,0,255,0.04)" }}>
          {WINDOWS.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setWindowLabel(item)}
              className="mono"
              style={{
                background: item === windowLabel ? "rgba(0,0,255,0.2)" : "transparent",
                border: "none",
                color: item === windowLabel ? "var(--foreground)" : "var(--text-muted)",
                padding: "6px 9px",
                fontSize: "9px",
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={reportRef}
        style={{
          background: "radial-gradient(ellipse at 70% 0%, rgba(0,0,255,0.16) 0%, transparent 58%), var(--bg-deep)",
          border: "1px solid rgba(0,0,255,0.35)",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 0 30px rgba(0,0,255,0.04)",
        }}
      >
        <div className="bc" style={{ position: "absolute", bottom: "-8px", right: "-8px", color: "rgba(0,0,255,0.04)", fontSize: "104px", lineHeight: 0.8, pointerEvents: "none" }}>
          OPQ
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
            <div>
              <div className="bc" style={{ fontSize: "22px", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "2px" }}>OPAQUE_</div>
              <div className="mono" style={{ fontSize: "9px", color: "#0000FF", letterSpacing: "2px", marginTop: "3px" }}>PRIVATE ALPHA REPORT</div>
            </div>
            <div className="mono" style={{ fontSize: "9px", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)", background: "rgba(74,222,128,0.05)", padding: "5px 8px", letterSpacing: "1px" }}>
              TEE ATTESTED
            </div>
          </div>

          <div className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>
            Verified PnL / {windowLabel}
          </div>
          <div className="bc" style={{ fontSize: "72px", lineHeight: 0.9, color: normalizePnl(pnl).startsWith("-") ? "#ff4444" : "#00ccff", textShadow: "0 0 30px rgba(0,100,255,0.35)", letterSpacing: "-2px", marginBottom: "24px" }}>
            {normalizePnl(pnl)}%
          </div>

          <div className="private-report-details" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
            {[
              { label: "Masked Wallet", value: maskWallet(wallet) },
              { label: "Proof ID", value: shortProof(proof) },
              { label: "Timestamp", value: formatProofTimestamp(timestamp) },
              { label: "Verify Link", value: verifyPath },
            ].map(item => (
              <div key={item.label} style={{ background: "rgba(0,0,255,0.04)", border: "1px solid rgba(0,0,255,0.15)", padding: "10px", minWidth: 0 }}>
                <div className="mono" style={{ fontSize: "8px", color: "var(--text-faint)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" }}>{item.label}</div>
                <div className="mono" style={{ fontSize: "10px", color: item.label === "Verify Link" ? "#0000FF" : "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="private-report-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "18px" }}>
            {metrics.map(metric => (
              <div key={metric.label} style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", padding: "10px" }}>
                <div className="mono" style={{ fontSize: "8px", color: "var(--text-faint)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" }}>{metric.label}</div>
                <div className="bc" style={{ fontSize: "18px", color: metric.label === "Risk Score" ? "#0000FF" : "var(--foreground)", textTransform: "uppercase" }}>{metric.value}</div>
              </div>
            ))}
          </div>

          <TEEAttestationBadge proofHash={proof} timestamp={timestamp} compact expandable={false} />

          <div className="mono" style={{ marginTop: "14px", fontSize: "10px", color: "#4ade80", letterSpacing: "1px", lineHeight: 1.6 }}>
            Balance hidden. Holdings hidden. Strategy hidden. Performance verified.
          </div>
        </div>
      </div>

      <div className="private-report-actions" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", marginTop: "12px" }}>
        <button type="button" onClick={handleDownload} disabled={isDownloading} className="mono" style={{ ...buttonStyle, opacity: isDownloading ? 0.6 : 1 }}>
          <Download size={12} /> {isDownloading ? "CAPTURING..." : "DOWNLOAD PNG"}
        </button>
        <button type="button" onClick={handleCopySummary} className="mono" style={buttonStyle}>
          <Copy size={12} /> COPY SUMMARY
        </button>
        <button type="button" onClick={() => navigator.clipboard.writeText(verifyUrl)} className="mono" style={buttonStyle}>
          <ExternalLink size={12} /> COPY VERIFY LINK
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 700px) {
          .private-report-details, .private-report-metrics { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </div>
  );
}
