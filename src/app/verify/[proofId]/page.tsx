"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, Clock, Copy, ExternalLink, ShieldCheck, XCircle } from "lucide-react";
import { TEEAttestationBadge } from "@/components/TEEAttestationBadge";
import { PrivacyRiskDiff } from "@/components/PrivacyRiskDiff";
import {
  formatProofTimestamp,
  maskWallet,
  normalizePnl,
  normalizeProofId,
  PROOF_COMPUTE_LAYER,
  PROOF_NETWORK,
  PROOF_RISK_LAYER,
  verifyAlphaProof,
  type AlphaProofStatus,
  type VerificationResult,
} from "@/lib/proof";

const STATUS_STYLE: Record<AlphaProofStatus, { color: string; bg: string; border: string; icon: ReactNode }> = {
  VALID: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.06)",
    border: "rgba(74,222,128,0.25)",
    icon: <CheckCircle size={18} />,
  },
  INVALID: {
    color: "#ff4444",
    bg: "rgba(255,68,68,0.06)",
    border: "rgba(255,68,68,0.25)",
    icon: <XCircle size={18} />,
  },
  EXPIRED: {
    color: "#facc15",
    bg: "rgba(250,204,21,0.06)",
    border: "rgba(250,204,21,0.25)",
    icon: <Clock size={18} />,
  },
  PENDING: {
    color: "#0000FF",
    bg: "rgba(0,0,255,0.08)",
    border: "rgba(0,0,255,0.28)",
    icon: <ShieldCheck size={18} />,
  },
};

function displayProof(proofId: string) {
  const clean = normalizeProofId(proofId);
  if (clean.length <= 16) return `0x${clean}`;
  return `0x${clean.slice(0, 10)}...${clean.slice(-8)}`;
}

export default function VerifyProofPage() {
  const params = useParams<{ proofId: string }>();
  const searchParams = useSearchParams();
  const proofId = Array.isArray(params.proofId) ? params.proofId[0] : params.proofId;

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [checking, setChecking] = useState(false);

  const proofInput = useMemo(() => {
    const wallet = searchParams.get("wallet") ?? undefined;
    const pnl = searchParams.get("pnl") ?? undefined;
    const timestamp = searchParams.get("ts") ?? searchParams.get("timestamp") ?? undefined;

    if (!wallet || pnl === undefined || timestamp === undefined) return undefined;

    return { wallet, pnl, timestamp };
  }, [searchParams]);

  const runVerification = async () => {
    setChecking(true);
    const nextResult = await verifyAlphaProof(proofId, proofInput);
    await new Promise(resolve => setTimeout(resolve, 300));
    setResult(nextResult);
    setChecking(false);
  };

  useEffect(() => {
    runVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proofId, proofInput?.wallet, proofInput?.pnl, proofInput?.timestamp]);

  const status = result?.status ?? "PENDING";
  const statusStyle = STATUS_STYLE[status];
  const record = result?.record;
  const publishedProof = result?.expectedProofId ?? proofId;
  const shareUrl = typeof window === "undefined" ? `/verify/${proofId}` : window.location.href;

  const details = [
    ["Proof ID", displayProof(publishedProof)],
    ["Masked Wallet", record?.wallet ? maskWallet(record.wallet) : "Metadata hidden"],
    ["PnL Percentage", record?.pnl !== undefined ? `${normalizePnl(record.pnl)}%` : "Not published"],
    ["Timestamp", record?.timestamp ? formatProofTimestamp(record.timestamp) : "Not published"],
    ["Network", PROOF_NETWORK],
    ["Compute Layer", PROOF_COMPUTE_LAYER],
    ["Risk Layer", PROOF_RISK_LAYER],
    ["Privacy", "Balance hidden"],
  ];

  const copyText = async (text: string) => navigator.clipboard.writeText(text);

  const shareVerifiedAlpha = async () => {
    const text = `OPAQUE Alpha Proof ${displayProof(publishedProof)} is ${status}. Performance is visible; balance, holdings, and strategy remain hidden.`;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      await navigator.share({ title: "OPAQUE Alpha Proof", text, url: shareUrl });
      return;
    }
    await copyText(`${text}\n${shareUrl}`);
  };

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo" style={{ textDecoration: "none" }}>OPAQUE_</Link>
        <ul className="nav-links">
          <li><Link href="/leaderboard" style={{ color: "inherit", textDecoration: "none" }}>Alpha Arena</Link></li>
          <li><Link href="/docs" style={{ color: "inherit", textDecoration: "none" }}>Docs</Link></li>
        </ul>
        <Link href="/dashboard" className="nav-cta" style={{ textDecoration: "none" }}>Launch App</Link>
      </nav>

      <main style={{ minHeight: "calc(100vh - 60px)", background: "var(--bg-deep)", padding: "48px 40px 72px" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", animation: "fade-in 0.4s ease" }}>
          <section
            style={{
              background: "radial-gradient(ellipse at 70% 0%, rgba(0,0,255,0.18) 0%, transparent 55%), var(--surface)",
              border: "1px solid rgba(0,0,255,0.35)",
              padding: "40px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(0,0,255,0.08), inset 0 0 30px rgba(0,0,255,0.04)",
            }}
          >
            <div className="bc" style={{ position: "absolute", bottom: "-14px", right: "-8px", color: "rgba(0,0,255,0.04)", fontSize: "160px", lineHeight: 0.8, pointerEvents: "none" }}>
              OPQ
            </div>

            <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.35fr 0.65fr", gap: "32px", alignItems: "start" }} className="verify-hero-grid">
              <div>
                <div className="section-label">Public Verification</div>
                <h1 className="bc" style={{ fontSize: "clamp(48px, 7vw, 82px)", lineHeight: 0.9, letterSpacing: "-2px", textTransform: "uppercase", color: "var(--foreground)", marginBottom: "18px" }}>
                  Verify Alpha Proof
                </h1>
                <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "24px", wordBreak: "break-word" }}>
                  PUBLISHED PROOF ID: <span style={{ color: "#0000FF" }}>{displayProof(proofId)}</span>
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "620px", marginBottom: "24px" }}>
                  This proof reveals performance only. Balance, holdings, strategy, and shielded amount remain hidden.
                </p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button type="button" onClick={runVerification} disabled={checking} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    {checking ? "Verifying..." : "Verify Proof"}
                  </button>
                  <button type="button" onClick={() => copyText(shareUrl)} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <Copy size={14} /> Copy Verification Link
                  </button>
                  <button type="button" onClick={shareVerifiedAlpha} className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <ExternalLink size={14} /> Share Verified Alpha
                  </button>
                </div>
              </div>

              <div style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, padding: "24px", minHeight: "190px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div className="mono" style={{ fontSize: "10px", color: "var(--text-faint)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>
                    Verification Status
                  </div>
                  <div className="bc" style={{ display: "flex", alignItems: "center", gap: "10px", color: statusStyle.color, fontSize: "46px", lineHeight: 1, textTransform: "uppercase", letterSpacing: "-1px", textShadow: `0 0 22px ${statusStyle.color}33` }}>
                    {statusStyle.icon}
                    {status}
                  </div>
                </div>
                <div className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.7, marginTop: "18px" }}>
                  {result?.message ?? "Waiting for proof metadata..."}
                </div>
              </div>
            </div>
          </section>

          <div className="dash-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <section style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "28px" }}>
              <div className="bc" style={{ fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--foreground)", marginBottom: "18px" }}>
                Proof Details
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {details.map(([label, value]) => (
                  <div key={label} style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", padding: "12px", minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: "8px", color: "var(--text-faint)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                      {label}
                    </div>
                    <div className="mono" style={{ fontSize: "11px", color: label === "Proof ID" ? "#0000FF" : "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <TEEAttestationBadge
              status={status === "VALID" ? "verified" : status === "INVALID" ? "failed" : "pending"}
              metadata={record?.attestation}
              proofHash={publishedProof}
              timestamp={record?.timestamp}
            />
          </div>

          <section style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "28px" }}>
            <div className="bc" style={{ fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--foreground)", marginBottom: "18px" }}>
              Verification Path
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", border: "1px solid var(--border)", background: "var(--border)" }} className="verify-steps-grid">
              {[
                "Recompute deterministic SHA-256 proof",
                "Compare with published Proof ID",
                "Confirm TEE-attested compute metadata",
                "Reveal only PnL, never absolute balance",
              ].map((item, index) => (
                <div key={item} style={{ background: "var(--surface-alt)", padding: "18px" }}>
                  <div className="bc" style={{ fontSize: "30px", color: "rgba(0,0,255,0.35)", lineHeight: 1, marginBottom: "10px" }}>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <PrivacyRiskDiff compact />

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", borderTop: "1px solid var(--border-strong)", paddingTop: "24px" }}>
            <Link href="/leaderboard" className="service-link" style={{ textDecoration: "none" }}>View Alpha Arena</Link>
            <Link href="/dashboard" className="service-link" style={{ textDecoration: "none" }}>Generate My Proof</Link>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .verify-hero-grid, .dash-grid-2 { grid-template-columns: 1fr !important; }
          .verify-steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          main { padding: 32px 20px 56px !important; }
          .verify-steps-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </>
  );
}
