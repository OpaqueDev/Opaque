"use client";
import { useState, useEffect } from "react";

const VERBS = ["SHIELD", "COMPUTE", "PROOF", "UNSHIELD", "AUDIT", "ENCRYPT"];
const TOKENS = ["USDC", "ETH", "ARB", "WBTC"];
const STATUSES = [
  { label: "CONFIRMED", color: "#4ade80" },
  { label: "PENDING", color: "#facc15" },
  { label: "ENCRYPTED", color: "#0000FF" },
];

function randomAddr() {
  const hex = "0123456789abcdef";
  return "0x" + Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join("") + "..." +
    Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join("");
}

function randomActivity() {
  const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const amount = (Math.random() * 50000 + 100).toFixed(2);
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  const addr = randomAddr();
  return { verb, token, amount, status, addr, ts: new Date().toLocaleTimeString() };
}

export default function LiveActivityFeed() {
  const [feed, setFeed] = useState(() => Array.from({ length: 5 }, randomActivity));

  useEffect(() => {
    const iv = setInterval(() => {
      setFeed(prev => [randomActivity(), ...prev.slice(0, 7)]);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ background: "#05050a", border: "1px solid #1a1a2e", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", animation: "pulse 1.5s infinite" }} />
        <div className="bc" style={{ fontSize: "16px", color: "#fff", textTransform: "uppercase", letterSpacing: "1px" }}>Live Network Activity</div>
        <div className="mono" style={{ marginLeft: "auto", fontSize: "9px", color: "#4ade80" }}>STREAMING</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {feed.map((item, i) => (
          <div
            key={i}
            className="mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              background: i === 0 ? "rgba(0,0,255,0.06)" : "transparent",
              border: `1px solid ${i === 0 ? "rgba(0,0,255,0.2)" : "#111"}`,
              fontSize: "11px",
              animation: i === 0 ? "fade-in 0.4s ease" : "none",
              transition: "all 0.3s",
            }}
          >
            <span style={{ color: "#0000FF", minWidth: "72px" }}>{item.verb}</span>
            <span style={{ color: "#fff" }}>{item.amount}</span>
            <span style={{ color: "#888" }}>{item.token}</span>
            <span style={{ color: "#555", flex: 1 }}>{item.addr}</span>
            <span style={{ color: item.status.color, minWidth: "72px", textAlign: "right" }}>{item.status.label}</span>
            <span style={{ color: "#333", minWidth: "56px", textAlign: "right" }}>{item.ts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
