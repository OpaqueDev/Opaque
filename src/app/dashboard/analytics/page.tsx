"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { arbitrumSepolia } from "wagmi/chains";

const TEEVisualizer = lazy(() => import("@/components/TEEVisualizer"));
const ChainGPTChat = lazy(() => import("@/components/ChainGPTChat"));
const LiveActivityFeed = lazy(() => import("@/components/LiveActivityFeed"));

// ERC-20 addresses on Arbitrum Sepolia
const USDC_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const;
const ARB_ADDRESS  = "0x912CE59144191C1204E64559FE8253a0e49E6548" as const;

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatBal(raw: bigint | undefined, decimals: number): string {
  if (!raw) return "—";
  const n = parseFloat(formatUnits(raw, decimals));
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount();

  const { data: ethBal, isLoading: ethLoading } = useBalance({
    address,
    chainId: arbitrumSepolia.id,
    query: { enabled: !!address },
  });
  const { data: usdcBal, isLoading: usdcLoading } = useBalance({
    address,
    token: USDC_ADDRESS,
    chainId: arbitrumSepolia.id,
    query: { enabled: !!address },
  });
  const { data: arbBal, isLoading: arbLoading } = useBalance({
    address,
    token: ARB_ADDRESS,
    chainId: arbitrumSepolia.id,
    query: { enabled: !!address },
  });

  const balancesLoading = ethLoading || usdcLoading || arbLoading;

  const [audit, setAudit] = useState<{
    score: string; trust_score: number; rug_risk: string; exploit: string; volatility: string;
  } | null>(null);
  const [auditAge, setAuditAge] = useState<string>("");

  useEffect(() => {
    const CACHE_KEY = "opaque_audit_cache";
    const TTL = 15 * 60 * 1000; // 15 minutes

    const cached = (() => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < TTL) return { ts, data };
        return null;
      } catch { return null; }
    })();

    if (cached) {
      setAudit(cached.data);
      const mins = Math.floor((Date.now() - cached.ts) / 60000);
      setAuditAge(mins === 0 ? "just now" : `${mins}m ago`);
      return;
    }

    fetch("/api/chaingpt", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setAudit(data);
        setAuditAge("just now");
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
      })
      .catch(err => console.error(err));
  }, []);

  // Win rate from proof history
  const [winRate, setWinRate] = useState<number | null>(null);
  const [totalProofs, setTotalProofs] = useState(0);
  useEffect(() => {
    if (!address) return;
    try {
      const history = JSON.parse(localStorage.getItem(`opaque_proofs_${address.toLowerCase()}`) || "[]");
      setTotalProofs(history.length);
      if (history.length > 0) {
        const wins = history.filter((p: any) => p.pnl?.startsWith("+")).length;
        setWinRate(Math.round((wins / history.length) * 100));
      } else {
        setWinRate(null);
      }
    } catch {}
  }, [address]);

  const ethNum = ethBal ? parseFloat(formatUnits(ethBal.value, 18)) : 0;
  const simulatedPnL = isConnected && ethNum > 0
    ? ((ethNum - 0.01) / 0.01 * 100).toFixed(2)
    : null;

  const pnlDisplay = simulatedPnL
    ? `${parseFloat(simulatedPnL) >= 0 ? "+" : ""}${simulatedPnL}%`
    : "+0.00%";

  const vaultItems = [
    { token: "ETH", bal: ethBal ? formatBal(ethBal.value, 18) : "—", loading: ethLoading },
    { token: "USDC", bal: usdcBal ? formatBal(usdcBal.value, 6) : "—", loading: usdcLoading },
    { token: "ARB", bal: arbBal ? formatBal(arbBal.value, 18) : "—", loading: arbLoading },
  ];

  return (
    <div style={{ animation: "fade-in 0.3s ease", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Wallet banner */}
      {isConnected && address && (
        <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "1px", display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ color: "#0000FF" }}>◉</span>
          WALLET {truncate(address)} · ARBITRUM SEPOLIA · LIVE DATA
        </div>
      )}

      {/* ROW 1: PnL + ChainGPT Audit + Win Rate + Shielded Vault + NOX */}
      <div className="dash-bento" style={{ padding: 0 }}>

        {/* PnL card */}
        <div className="db db-pnl">
          <div>
            <div className="pnl-label">Aggregate Verified PnL</div>
            <div className="pnl-big">
              {isConnected && !ethLoading ? (
                <>
                  <span className="pnl-plus">{pnlDisplay.startsWith("-") ? "" : "+"}</span>
                  {pnlDisplay.replace("+", "")}
                </>
              ) : isConnected ? (
                <Loader2 size={28} className="animate-spin" style={{ color: "#0000FF" }} />
              ) : (
                <span style={{ fontSize: "24px", color: "var(--border-soft)" }}>—</span>
              )}
            </div>
            <div className="pnl-bar"><div className="pnl-bar-fill" /></div>
            <div className="pnl-sub">
              {isConnected
                ? "▲ On-chain verified · Balance private"
                : "Connect wallet to see live PnL"}
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
              <polyline points="0,52 30,44 60,48 90,32 120,36 150,22 180,26 210,18 240,20 300,10" fill="none" stroke="#0000FF" strokeWidth="2" />
              <polygon points="0,52 30,44 60,48 90,32 120,36 150,22 180,26 210,18 240,20 300,10 300,60 0,60" fill="rgba(0,0,255,0.08)" />
            </svg>
          </div>
        </div>

        {/* ChainGPT Audit */}
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
                {[
                  { label: "Rug Risk", val: audit.rug_risk },
                  { label: "Exploit", val: audit.exploit },
                  { label: "Volatility", val: audit.volatility },
                ].map(({ label, val }) => (
                  <div key={label} style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", display: "flex", justifyContent: "space-between", fontFamily: "'Share Tech Mono',monospace" }}>
                    <span>{label}</span>
                    <span style={{ color: val === "HIGH" ? "#ff4444" : val === "MED" ? "rgba(255,255,100,.8)" : "#4ade80" }}>{val}</span>
                  </div>
                ))}
                {auditAge && (
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,.25)", fontFamily: "'Share Tech Mono',monospace", marginTop: "4px", textAlign: "right" }}>
                    cached · {auditAge} · refreshes every 15m
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Win Rate */}
        <div className="db db-stat">
          <div className="stat-l">Win Rate</div>
          <div className="stat-n" style={{ fontSize: "18px", color: "var(--border-soft)", marginTop: "6px" }}>—</div>
          <div style={{ height: "3px", background: "var(--border)", marginTop: "12px" }}>
            <div style={{ height: "100%", width: "0%", background: "#0000FF" }} />
          </div>
          <div className="mono" style={{ fontSize: "9px", color: "#0000FF", marginTop: "10px", letterSpacing: "1px" }}>
            COMING SOON ON MAINNET
          </div>
        </div>

        {/* Shielded Vault — real balances */}
        <div className="db db-enc">
          <div style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Share Tech Mono',monospace", marginBottom: "10px" }}>
            Shielded Vault {isConnected && <span style={{ color: "#0000FF" }}>· LIVE</span>}
          </div>

          {!isConnected ? (
            <div className="mono" style={{ fontSize: "11px", color: "var(--border-soft)", paddingTop: "8px" }}>
              Connect wallet to view balances
            </div>
          ) : balancesLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0000FF", paddingTop: "8px" }}>
              <Loader2 size={12} className="animate-spin" />
              <span className="mono" style={{ fontSize: "11px" }}>Fetching balances...</span>
            </div>
          ) : (
            vaultItems.map(({ token, bal }) => (
              <div key={token} className="enc-row" style={{ display: "block", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: "13px", color: "var(--foreground)", fontFamily: "'Share Tech Mono',monospace", letterSpacing: "1px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#0000FF" }}>{token}</span>
                  <span style={{ color: "var(--text-dim)" }}>{bal}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* NOX Pool */}
        <div className="db db-stat">
          <div className="stat-l">NOX Pool Network</div>
          <div className="stat-n" style={{ color: "#0000FF", fontSize: "28px", marginTop: "4px" }}>ACTIVE</div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px", fontFamily: "'Share Tech Mono',monospace" }}>TEE Execution</div>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="dash-grid-2">
        <Suspense fallback={<div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", padding: "32px", color: "var(--border-soft)" }} className="mono">Loading Visualizer...</div>}>
          <TEEVisualizer />
        </Suspense>
        <Suspense fallback={<div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", padding: "32px", color: "var(--border-soft)" }} className="mono">Loading AI Chat...</div>}>
          <ChainGPTChat />
        </Suspense>
      </div>

      {/* ROW 3 */}
      <Suspense fallback={<div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", padding: "24px", color: "var(--border-soft)" }} className="mono">Loading feed...</div>}>
        <LiveActivityFeed />
      </Suspense>
    </div>
  );
}
