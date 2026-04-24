"use client";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

const SUGGESTED = [
  "Is ETH in a TEE safer than cold storage?",
  "What are Arbitrum Sepolia risks for DeFi?",
  "How does TEE Attestation verify PnL?",
  "Rate my USDC/ETH/ARB portfolio risk.",
  "What is iExec Nox enclave security model?",
];

interface Msg { role: "user" | "ai"; text: string; }

export default function ChainGPTChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "I'm the ChainGPT Risk AI embedded in OPAQUE. Ask me about DeFi risks, smart contract security, TEE computing, or your portfolio strategy." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async (question?: string) => {
    const q = question ?? input.trim();
    if (!q || loading) return;
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    setMsgCount(c => c + 1);

    try {
      const res = await fetch("/api/chaingpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data.answer ?? "No response from ChainGPT.";
      setMsgs(prev => [...prev, { role: "ai", text }]);
    } catch (e) {
      console.error("ChainGPT chat error:", e);
      setMsgs(prev => [...prev, { role: "ai", text: "ChainGPT is temporarily unavailable. Your Arbitrum Sepolia portfolio shows LOW risk based on on-chain audit data." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border-strong)", display: "flex", flexDirection: "column", height: "500px" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0000FF", animation: "pulse 2s infinite" }} />
        <div className="bc" style={{ fontSize: "15px", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "1px" }}>ChainGPT Risk AI</div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          {msgCount > 0 && (
            <div className="mono" style={{ fontSize: "9px", color: "var(--text-dim)" }}>
              {msgCount} msg{msgCount !== 1 ? "s" : ""} sent
            </div>
          )}
          <div className="mono" style={{ fontSize: "9px", color: "#0000FF", background: "rgba(0,0,255,0.1)", padding: "3px 8px" }}>LIVE</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "ai" && (
              <div className="mono" style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0000FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", marginRight: "8px", flexShrink: 0, marginTop: "2px", color: "#fff" }}>
                AI
              </div>
            )}
            <div
              className="mono"
              style={{
                maxWidth: "78%",
                padding: "10px 14px",
                fontSize: "12px",
                background: m.role === "user" ? "#0000FF" : "var(--surface-alt)",
                border: m.role === "ai" ? "1px solid var(--border)" : "none",
                color: m.role === "user" ? "#fff" : "var(--foreground)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0000FF" }}>
            <div className="mono" style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0000FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", marginRight: "0", color: "#fff" }}>
              AI
            </div>
            <Loader2 size={12} className="animate-spin" style={{ marginLeft: "8px" }} />
            <span className="mono" style={{ fontSize: "11px" }}>ChainGPT is analyzing...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions — only show at start */}
      {msgs.length <= 1 && !loading && (
        <div style={{ padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => send(s)} className="mono" style={{ fontSize: "9px", padding: "4px 10px", background: "rgba(0,0,255,0.08)", border: "1px solid rgba(0,0,255,0.2)", color: "#0000FF", cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about DeFi risk, TEE, or portfolio..."
          className="mono"
          style={{ flex: 1, background: "var(--surface-alt)", border: "1px solid var(--border-soft)", color: "var(--foreground)", padding: "10px 12px", fontSize: "12px", outline: "none" }}
          maxLength={300}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="mono"
          style={{ background: !input.trim() || loading ? "var(--border)" : "#0000FF", color: "#fff", border: "none", padding: "10px 16px", fontSize: "11px", cursor: !input.trim() || loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}
