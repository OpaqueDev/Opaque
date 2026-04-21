"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ProofCard } from "@/components/ProofCard";
import { Loader2 } from "lucide-react";

export default function ComputeVaultPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [initialValue, setInitialValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{pnl: string, proof: string} | null>(null);
  const [shareMode, setShareMode] = useState(false);

  const handleCompute = async () => {
    if (!initialValue || !address) return;
    setLoading(true);
    try {
      const res = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial: Number(initialValue), final: Number(finalValue), wallet: address })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (shareMode && result) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#080810", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: "500px", animation: "fade-in 0.5s ease" }}>
          <ProofCard 
            pnl={result.pnl} 
            proof={result.proof} 
            wallet={address!} 
          />
          <button className="btn-outline" style={{ borderColor: "#fff", color: "#fff", width: "100%", marginTop: "24px" }} onClick={() => setShareMode(false)}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-grid-2" style={{ marginBottom: "64px", animation: "fade-in 0.3s ease" }}>
      <div style={{ background: "#111", border: "1px solid #222", padding: "40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, padding: "16px", color: "rgba(255,255,255,0.05)", fontSize: "120px", lineHeight: 0.5, pointerEvents: "none" }} className="bc">OPQ</div>
        <h2 className="bc" style={{ fontSize: "28px", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Generate Proof</h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
          iExec Nox automatically masks your portfolio inputs. Calculate an auditable, trustless Proof of Alpha without leaking your balance to the Arbitrum chain.
        </p>

        {!mounted || !isConnected ? (
          <div style={{ padding: "40px", background: "rgba(0,0,255,0.05)", border: "1px dashed rgba(0,0,255,0.3)", textAlign: "center", color: "#0000FF", fontSize: "12px" }} className="mono">
            [ WALLET CONNECTION REQUIRED ]
          </div>
        ) : (
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "10px", color: "#999", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }} className="bc">
                  Initial Shielded Value (USD)
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 10000"
                  value={initialValue}
                  onChange={e => setInitialValue(e.target.value)}
                  style={{ width: "100%", background: "#0a0a14", border: "1px solid #333", color: "#fff", padding: "16px", fontSize: "16px", outline: "none" }}
                  className="mono"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "10px", color: "#999", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }} className="bc">
                  Final Evaluated Value (USD)
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 25000"
                  value={finalValue}
                  onChange={e => setFinalValue(e.target.value)}
                  style={{ width: "100%", background: "#0a0a14", border: "1px solid #333", color: "#fff", padding: "16px", fontSize: "16px", outline: "none" }}
                  className="mono"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                className="btn-primary" 
                onClick={handleCompute}
                disabled={loading || !initialValue || !finalValue}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: (loading || !initialValue || !finalValue) ? "#333" : "#0000FF", padding: "16px", cursor: (loading || !initialValue || !finalValue) ? "not-allowed" : "pointer" }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "PROVE PnL →"}
              </button>
            </div>
            <div style={{ fontSize: "10px", color: "#555", marginTop: "12px" }} className="mono">Data processed off-chain via TEE. 0% data leakage.</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,255,0.02)", border: "1px dashed #1a1a1a" }}>
          {!result ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", border: "2px solid #222", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <div style={{ color: "rgba(0,0,255,0.5)", fontSize: "24px" }}>⬡</div>
              </div>
              <h3 className="bc" style={{ fontSize: "20px", color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>Awaiting Shielding...</h3>
            </div>
          ) : (
            <div style={{ width: "100%", padding: "24px", animation: "fade-in 0.5s ease" }}>
              <ProofCard pnl={result.pnl} proof={result.proof} wallet={address!} />
              <button 
              className="btn-primary bc" 
              onClick={() => setShareMode(true)}
              style={{ width: "100%", marginTop: "16px", background: "#fff", color: "#0000FF", fontSize: "16px" }}
              >
                OPEN SHARE MODE ↗
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
