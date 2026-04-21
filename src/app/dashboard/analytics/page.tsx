"use client";

import { useAsciiBlur } from "@/components/ProofCard";
import { useEffect, useState, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const TEEVisualizer = lazy(() => import("@/components/TEEVisualizer"));
const ChainGPTChat = lazy(() => import("@/components/ChainGPTChat"));
const LiveActivityFeed = lazy(() => import("@/components/LiveActivityFeed"));

export default function AnalyticsPage() {
  const enc1 = useAsciiBlur("12345678", true);
  const enc2 = useAsciiBlur("1234567", true);
  const enc3 = useAsciiBlur("1234567", true);

  const [audit, setAudit] = useState<{
    score: string; trust_score: number; rug_risk: string; exploit: string; volatility: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/chaingpt", { method: "POST" })
      .then(res => res.json())
      .then(data => setAudit(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ animation: "fade-in 0.3s ease", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ROW 1: PnL Overview + ChainGPT Audit */}
      <div className="dash-bento" style={{ padding: 0 }}>
        <div className="db db-pnl">
          <div>
            <div className="pnl-label" style={{ color: "#999" }}>Aggregate Verified PnL</div>
            <div className="pnl-big">
              <span className="pnl-plus">+</span>18.43%
            </div>
            <div className="pnl-bar"><div className="pnl-bar-fill"></div></div>
            <div className="pnl-sub" style={{ color: "#aaa" }}>▲ On-chain verified · Balance private</div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
              <polyline points="0,52 30,44 60,48 90,32 120,36 150,22 180,26 210,18 240,20 300,10" fill="none" stroke="#0000FF" strokeWidth="2" />
              <polygon points="0,52 30,44 60,48 90,32 120,36 150,22 180,26 210,18 240,20 300,10 300,60 0,60" fill="rgba(0,0,255,0.08)" />
            </svg>
          </div>
        </div>

        <div className="db db-safety" style={{ border: "1px solid #0000FF", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {!audit ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#0000FF" }}>
              <Loader2 className="animate-spin" size={24} style={{ marginBottom: "12px" }} />
              <div className="mono" style={{ fontSize: "10px", letterSpacing: "1px" }}>AUDITING CONTRACTS...</div>
            </div>
          ) : (
            <>
              <div>
                <div className="label">ChainGPT Audit</div>
                <div className="score" style={{ marginTop: "8px" }}>{audit.score}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", marginTop: "4px", fontFamily: "'Share Tech Mono',monospace" }}>Trust Score · {audit.trust_score}/100</div>
              </div>
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", display: "flex", justifyContent: "space-between", fontFamily: "'Share Tech Mono',monospace" }}><span>Rug Risk</span><span style={{ color: audit.rug_risk === "HIGH" ? "#ff4444" : "#4ade80" }}>{audit.rug_risk}</span></div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", display: "flex", justifyContent: "space-between", fontFamily: "'Share Tech Mono',monospace" }}><span>Exploit</span><span style={{ color: audit.exploit === "HIGH" ? "#ff4444" : "#4ade80" }}>{audit.exploit}</span></div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", display: "flex", justifyContent: "space-between", fontFamily: "'Share Tech Mono',monospace" }}><span>Volatility</span><span style={{ color: audit.volatility === "HIGH" ? "#ff4444" : audit.volatility === "MED" ? "rgba(255,255,100,.8)" : "#4ade80" }}>{audit.volatility}</span></div>
              </div>
            </>
          )}
        </div>

        <div className="db db-stat">
          <div className="stat-l" style={{ color: "#999" }}>Win Rate</div>
          <div className="stat-n">73%</div>
          <div style={{ height: "3px", background: "#1a1a1a", marginTop: "12px" }}><div style={{ height: "100%", width: "73%", background: "#0000FF" }}></div></div>
        </div>

        <div className="db db-enc">
          <div style={{ fontSize: "10px", color: "#888", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Share Tech Mono',monospace", marginBottom: "10px" }}>Shielded Vault</div>
          <div className="enc-row">
            <span className="enc-sym">USDC</span>
            <span className="enc-val">{enc1}</span>
            <span className="enc-pnl">+12.4%</span>
          </div>
          <div className="enc-row">
            <span className="enc-sym">ETH</span>
            <span className="enc-val">{enc2}</span>
            <span className="enc-pnl">+28.7%</span>
          </div>
          <div className="enc-row">
            <span className="enc-sym">ARB</span>
            <span className="enc-val">{enc3}</span>
            <span className="enc-pnl">+5.2%</span>
          </div>
        </div>

        <div className="db db-stat">
          <div className="stat-l" style={{ color: "#999" }}>NOX Pool Network</div>
          <div className="stat-n" style={{ color: "#0000FF", fontSize: "28px", marginTop: "4px" }}>ACTIVE</div>
          <div style={{ fontSize: "10px", color: "#555", marginTop: "8px", fontFamily: "'Share Tech Mono',monospace" }}>TEE Execution</div>
        </div>
      </div>

      {/* ROW 2: TEE Visualizer + ChainGPT Chat */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="dash-grid-2">
        <Suspense fallback={<div style={{ background: "#05050a", border: "1px solid #111", padding: "32px", color: "#333" }} className="mono">Loading Visualizer...</div>}>
          <TEEVisualizer />
        </Suspense>
        <Suspense fallback={<div style={{ background: "#05050a", border: "1px solid #111", padding: "32px", color: "#333" }} className="mono">Loading AI Chat...</div>}>
          <ChainGPTChat />
        </Suspense>
      </div>

      {/* ROW 3: Live Activity Feed */}
      <Suspense fallback={<div style={{ background: "#05050a", border: "1px solid #111", padding: "24px", color: "#333" }} className="mono">Loading feed...</div>}>
        <LiveActivityFeed />
      </Suspense>
    </div>
  );
}
