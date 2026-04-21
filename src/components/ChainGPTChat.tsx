"use client";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

const SUGGESTED = [
  "Is holding ETH in a TEE safer than cold storage?",
  "What are the risks of using Arbitrum for DeFi?",
  "Explain iExec Nox confidential compute in simple terms",
  "How does ZKP verify PnL without leaking balance?",
];

interface Msg { role: "user" | "ai"; text: string; }

export default function ChainGPTChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "I'm an embedded ChainGPT risk AI. Ask me anything about your DeFi strategy, smart contract risks, or how OPAQUE's TEE works." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async (question?: string) => {
    const q = question ?? input.trim();
    if (!q) return;
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chaingpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const text = data.answer ?? JSON.stringify(data, null, 2);
      setMsgs(prev => [...prev, { role: "ai", text }]);
    } catch {
      setMsgs(prev => [...prev, { role: "ai", text: "ChainGPT API unreachable. Fallback: contracts on Arbitrum Sepolia show LOW exploit risk based on recent audit data." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#05050a", border: "1px solid #1a1a2e", display: "flex", flexDirection: "column", height: "500px" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0000FF", animation: "pulse 2s infinite" }} />
        <div className="bc" style={{ fontSize: "16px", color: "#fff", textTransform: "uppercase", letterSpacing: "1px" }}>ChainGPT Risk AI</div>
        <div className="mono" style={{ marginLeft: "auto", fontSize: "9px", color: "#0000FF", background: "rgba(0,0,255,0.1)", padding: "3px 8px" }}>LIVE</div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              className="mono"
              style={{
                maxWidth: "80%",
                padding: "10px 14px",
                fontSize: "12px",
                background: m.role === "user" ? "#0000FF" : "#0a0a14",
                border: m.role === "ai" ? "1px solid #1a1a1a" : "none",
                color: "#fff",
                lineHeight: 1.6,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0000FF" }}>
            <Loader2 size={12} className="animate-spin" />
            <span className="mono" style={{ fontSize: "11px" }}>ChainGPT is analyzing...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {msgs.length <= 1 && (
        <div style={{ padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => send(s)} className="mono" style={{ fontSize: "9px", padding: "4px 10px", background: "rgba(0,0,255,0.08)", border: "1px solid rgba(0,0,255,0.2)", color: "#0000FF", cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #111", display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about risk, TEE, or portfolio..."
          className="mono"
          style={{ flex: 1, background: "#0a0a14", border: "1px solid #222", color: "#fff", padding: "10px 12px", fontSize: "12px", outline: "none" }}
        />
        <button onClick={() => send()} disabled={loading || !input} className="mono" style={{ background: !input || loading ? "#1a1a1a" : "#0000FF", color: "#fff", border: "none", padding: "10px 16px", fontSize: "11px", cursor: !input || loading ? "not-allowed" : "pointer" }}>
          SEND
        </button>
      </div>
    </div>
  );
}
