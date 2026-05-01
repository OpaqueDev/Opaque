"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, ExternalLink, ShieldCheck, Trophy } from "lucide-react";
import { PrivacyRiskDiff } from "@/components/PrivacyRiskDiff";
import {
  buildVerifyPath,
  DEMO_ALPHA_PROOFS,
  formatProofTimestamp,
  maskWallet,
  normalizePnl,
} from "@/lib/proof";

type SortMode = "pnl" | "risk" | "drawdown" | "recent";

const SORTS: { id: SortMode; label: string }[] = [
  { id: "pnl", label: "Top PnL" },
  { id: "risk", label: "Best Risk-Adjusted" },
  { id: "drawdown", label: "Lowest Drawdown" },
  { id: "recent", label: "Most Recent Proofs" },
];

function numericPnl(pnl: string | number) {
  return Number(normalizePnl(pnl));
}

function drawdownValue(drawdown?: string) {
  return Math.abs(Number((drawdown ?? "0").replace("%", "")));
}

export default function LeaderboardPage() {
  const [sortMode, setSortMode] = useState<SortMode>("pnl");

  const rows = useMemo(() => {
    return [...DEMO_ALPHA_PROOFS].sort((a, b) => {
      if (sortMode === "risk") return (b.riskAdjustedAlpha ?? 0) - (a.riskAdjustedAlpha ?? 0);
      if (sortMode === "drawdown") return drawdownValue(a.maxDrawdown) - drawdownValue(b.maxDrawdown);
      if (sortMode === "recent") return Number(b.timestamp) - Number(a.timestamp);
      return numericPnl(b.pnl) - numericPnl(a.pnl);
    });
  }, [sortMode]);

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo" style={{ textDecoration: "none" }}>OPAQUE_</Link>
        <ul className="nav-links">
          <li><Link href="/verify/demo" style={{ color: "inherit", textDecoration: "none" }}>Verify</Link></li>
          <li><Link href="/docs" style={{ color: "inherit", textDecoration: "none" }}>Docs</Link></li>
        </ul>
        <Link href="/dashboard" className="nav-cta" style={{ textDecoration: "none" }}>Launch App</Link>
      </nav>

      <main style={{ minHeight: "calc(100vh - 60px)", background: "var(--bg-deep)", padding: "48px 40px 72px" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", animation: "fade-in 0.4s ease" }}>
          <section style={{ background: "radial-gradient(ellipse at 70% 0%, rgba(0,0,255,0.16) 0%, transparent 56%), var(--surface)", border: "1px solid rgba(0,0,255,0.32)", padding: "40px", position: "relative", overflow: "hidden" }}>
            <div className="bc" style={{ position: "absolute", bottom: "-12px", right: "-8px", color: "rgba(0,0,255,0.04)", fontSize: "150px", lineHeight: 0.8, pointerEvents: "none" }}>ARENA</div>
            <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.35fr 0.65fr", gap: "32px", alignItems: "end" }} className="arena-hero-grid">
              <div>
                <div className="section-label">Demo Leaderboard</div>
                <h1 className="bc" style={{ fontSize: "clamp(52px, 8vw, 92px)", lineHeight: 0.88, letterSpacing: "-2px", color: "var(--foreground)", textTransform: "uppercase", marginBottom: "18px" }}>
                  Alpha Arena
                </h1>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "620px" }}>
                  A sample private leaderboard where traders rank by verified alpha without exposing wallet balance, holdings, or strategy.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", border: "1px solid var(--border)", background: "var(--border)" }}>
                {[
                  ["Proofs", `${rows.length}`],
                  ["Network", "Arbitrum Sepolia"],
                  ["Privacy", "Balance Hidden"],
                  ["Mode", "Demo Data"],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: "var(--surface-alt)", padding: "16px" }}>
                    <div className="mono" style={{ fontSize: "8px", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{label}</div>
                    <div className="bc" style={{ fontSize: "20px", color: label === "Privacy" ? "#0000FF" : "var(--foreground)", textTransform: "uppercase" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div style={{ background: "rgba(0,0,255,0.04)", border: "1px solid rgba(0,0,255,0.18)", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <ShieldCheck size={16} color="#0000FF" />
            <div className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", lineHeight: 1.6 }}>
              SAMPLE LEADERBOARD / DEMO PROOF REGISTRY. NO ABSOLUTE BALANCES OR HOLDINGS ARE DISPLAYED.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {SORTS.map(sort => (
                <button
                  key={sort.id}
                  type="button"
                  onClick={() => setSortMode(sort.id)}
                  className="mono"
                  style={{
                    background: sortMode === sort.id ? "rgba(0,0,255,0.18)" : "transparent",
                    border: `1px solid ${sortMode === sort.id ? "rgba(0,0,255,0.42)" : "var(--border-soft)"}`,
                    color: sortMode === sort.id ? "var(--foreground)" : "var(--text-muted)",
                    padding: "10px 12px",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    textTransform: "uppercase",
                  }}
                >
                  <ArrowDownUp size={12} />
                  {sort.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none", padding: "12px 18px", fontSize: "14px" }}>Generate My Proof</Link>
              <Link href="/verify/demo" className="btn-outline" style={{ textDecoration: "none", padding: "11px 16px", fontSize: "14px" }}>Verify a Proof</Link>
              <Link href="/dashboard" className="btn-outline" style={{ textDecoration: "none", padding: "11px 16px", fontSize: "14px" }}>Share Alpha Card</Link>
            </div>
          </div>

          <section style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "24px" }}>
            <div className="arena-table-header" style={{ display: "grid", gridTemplateColumns: "64px 1.1fr 120px 140px 130px 120px 120px 110px", gap: "12px", padding: "0 12px 12px", borderBottom: "1px solid var(--border)", color: "var(--text-faint)" }}>
              {["Rank", "Trader", "Verified PnL", "Risk Alpha", "Consistency", "Max DD", "Status", "Proof"].map(label => (
                <div key={label} className="mono" style={{ fontSize: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
              {rows.map((row, index) => {
                const verifyPath = buildVerifyPath(row.proofId, {
                  wallet: row.wallet,
                  pnl: row.pnl,
                  timestamp: row.timestamp,
                });

                return (
                  <div
                    key={row.proofId}
                    className="arena-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "64px 1.1fr 120px 140px 130px 120px 120px 110px",
                      gap: "12px",
                      alignItems: "center",
                      padding: "14px 12px",
                      background: index === 0 ? "rgba(0,0,255,0.07)" : "var(--surface-alt)",
                      border: `1px solid ${index === 0 ? "rgba(0,0,255,0.25)" : "var(--border)"}`,
                    }}
                  >
                    <div className="bc" style={{ fontSize: "24px", color: index === 0 ? "#0000FF" : "var(--text-dim)", display: "flex", alignItems: "center", gap: "8px" }}>
                      {index === 0 && <Trophy size={16} />}
                      #{index + 1}
                    </div>
                    <div>
                      <div className="bc" style={{ fontSize: "16px", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{row.alias}</div>
                      <div className="mono" style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {maskWallet(row.wallet)} / {formatProofTimestamp(row.timestamp)}
                      </div>
                    </div>
                    <div className="bc" style={{ fontSize: "22px", color: numericPnl(row.pnl) >= 0 ? "#00ccff" : "#ff4444" }}>{normalizePnl(row.pnl)}%</div>
                    <div className="mono" style={{ fontSize: "12px", color: "#0000FF" }}>{row.riskAdjustedAlpha}/100</div>
                    <div className="mono" style={{ fontSize: "12px", color: "var(--text-dim)" }}>{row.consistencyScore}/100</div>
                    <div className="mono" style={{ fontSize: "12px", color: "#facc15" }}>{row.maxDrawdown}</div>
                    <div className="mono" style={{ fontSize: "10px", color: "#4ade80", letterSpacing: "1px" }}>
                      VALID / Balance Hidden
                    </div>
                    <Link href={verifyPath} className="mono" style={{ color: "#0000FF", fontSize: "10px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      VERIFY <ExternalLink size={12} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          <PrivacyRiskDiff compact />
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1050px) {
          .arena-table-header { display: none !important; }
          .arena-row {
            grid-template-columns: 56px 1fr 110px !important;
            grid-auto-rows: auto !important;
          }
          .arena-row > div:nth-child(n+4),
          .arena-row > a {
            grid-column: 2 / 4;
          }
        }
        @media (max-width: 900px) {
          .arena-hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          main { padding: 32px 20px 56px !important; }
          .arena-row { grid-template-columns: 1fr !important; gap: 8px !important; }
          .arena-row > div, .arena-row > a { grid-column: auto !important; }
        }
      ` }} />
    </>
  );
}
