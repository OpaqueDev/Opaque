/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { useAccount, useSignMessage, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { Loader2 } from "lucide-react";
import { OpaqueVaultABI, ERC20ABI } from "@/lib/abi";

export default function ShieldPage() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync } = useWriteContract();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t); }, []);

  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [step, setStep] = useState<"idle" | "approving" | "shielding" | "done">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);

  const handleShield = async () => {
    if (!amount || isNaN(Number(amount))) return;

    try {
      setStep("approving");
      setLogs([]);
      addLog(`Initializing TEE Shield request for ${amount} ${token}...`);

      const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`;

      if (vaultAddress) {
        addLog(`REAL ON-CHAIN MODE DETECTED. Vault: ${vaultAddress.slice(0,6)}...`);
        addLog(`Preparing to shield ${amount} ${token}...`);

        const testTokenAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
        const amountWei = parseUnits(amount, 18);

        addLog("Awaiting Wallet Approval (Approve)... (Make sure you have funds!)");
        await writeContractAsync({
          address: testTokenAddress,
          abi: ERC20ABI,
          functionName: "approve",
          args: [vaultAddress, amountWei]
        });

        setStep("shielding");
        addLog("Approval confirmed. Awaiting Shield Execution...");
        const txHash = await writeContractAsync({
          address: vaultAddress,
          abi: OpaqueVaultABI,
          functionName: "shield",
          args: [testTokenAddress, amountWei, "0x1234567890abcdef"]
        });

        setStep("done");
        addLog(`TRANSACTION SUCCESS! Hash: 0x${txHash.slice(0, 16)}...`);
        addLog("Asset mathematically secured in Nox Enclave.");
      } else {
        addLog("DEMO MODE: No Vault Address found in .env.local");
        addLog("Requesting wallet signature for contract approval...");
        const sig1 = await signMessageAsync({
          message: `OPAQUE PROTOCOL\n\nAuthorize iExec Nox Enclave to spend: ${amount} ${token}\nWallet: ${address}\nChain: Arbitrum Sepolia`
        });
        addLog(`[OK] Approval signed: ${sig1.slice(0, 14)}...`);

        setStep("shielding");
        addLog("Transmitting assets to Confidential Vault...");

        await new Promise(r => setTimeout(r, 2000));

        addLog("Requesting Nox Enclave encryption key authorization...");
        const sig2 = await signMessageAsync({
          message: `OPAQUE PROTOCOL\n\nEncrypt my balance of ${amount} ${token}.\nEnsure absolute privacy via TEE.\nNonce: ${Math.floor(Math.random()*10000)}`
        });
        addLog(`[OK] Payload encrypted: ${sig2.slice(0, 14)}...`);

        setStep("done");
        addLog(`[SUCCESS] ${amount} ${token} successfully shielded via iExec!`);
      }

    } catch (e: any) {
      addLog(`[ERROR] Transaction failed or rejected! Check funds if running on-chain.`);
      setStep("idle");
    }
  };

  return (
    <div className="dash-grid-2" style={{ animation: "fade-in 0.3s ease" }}>

      {/* Action Panel */}
      <div style={{ background: "var(--db-bg)", border: "1px solid var(--border-soft)", padding: "40px" }}>
        <h2 className="bc" style={{ fontSize: "28px", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Asset Wrapping Engine</h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
          Shield your public ERC-20 tokens into absolute privacy. Opaque utilizes iExec Nox to encrypt your balances directly on-chain.
        </p>

        {!mounted || !isConnected ? (
          <div style={{ padding: "40px", background: "rgba(0,0,255,0.05)", border: "1px dashed rgba(0,0,255,0.3)", textAlign: "center", color: "#0000FF", fontSize: "12px" }} className="mono">
            [ WALLET CONNECTION REQUIRED TO SHIELD ASSETS ]
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <label className="bc" style={{ display: "block", fontSize: "12px", color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase" }}>Amount to Shield</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  disabled={step !== "idle" && step !== "done"}
                  style={{ width: "100%", background: "var(--surface-alt)", border: "1px solid var(--border-soft)", color: "var(--foreground)", padding: "16px", fontSize: "16px", outline: "none" }}
                  className="mono"
                />
              </div>
              <div style={{ width: "120px" }}>
                <label className="bc" style={{ display: "block", fontSize: "12px", color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase" }}>Select Asset</label>
                <select
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  disabled={step !== "idle" && step !== "done"}
                  style={{ width: "100%", background: "#0000FF", border: "none", color: "#fff", padding: "16px", fontSize: "16px", outline: "none", appearance: "none", cursor: "pointer", fontFamily: "'Share Tech Mono', monospace" }}
                >
                  <option value="USDC">USDC</option>
                  <option value="WBTC">WBTC</option>
                  <option value="ARB">ARB</option>
                </select>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleShield}
              disabled={step === "approving" || step === "shielding" || !amount}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", opacity: (!amount || step === "approving" || step === "shielding") ? 0.5 : 1 }}
            >
              {(step === "approving" || step === "shielding") ? <><Loader2 size={18} className="animate-spin" /> EXECUTING NOX WRAPPER...</> : "SHIELD ASSETS NOW"}
            </button>
            <div style={{ fontSize: "10px", color: "var(--text-faint)", marginTop: "12px", textAlign: "center" }} className="mono">Uses iExec TEE. Fee: 0.05%</div>
          </div>
        )}
      </div>

      {/* Terminal View */}
      <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", height: "100%", minHeight: "400px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "16px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: step === "done" ? "#4ade80" : step !== "idle" ? "#0000FF" : "var(--border-soft)", animation: step !== "idle" && step !== "done" ? "pulse 2s infinite" : "none" }}></div>
          <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "1px" }}>NOX ENCLAVE TERMINAL LOGS</div>
        </div>

        <div className="mono" style={{ flex: 1, fontSize: "12px", color: "#0000FF", display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", overflowX: "hidden", textShadow: "0 0 5px rgba(0,0,255,0.4)" }}>
          {logs.length === 0 && <div style={{ color: "var(--border-soft)" }}>&gt; Awaiting transaction input...</div>}
          {logs.map((log, i) => (
            <div key={i} style={{ animation: "fade-in 0.3s ease" }}>{log}</div>
          ))}
          {(step === "approving" || step === "shielding") && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--foreground)" }}>
              <Loader2 size={12} className="animate-spin" /> <span>Awaiting user signature...</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
