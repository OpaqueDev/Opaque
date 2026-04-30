/* eslint-disable */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWriteContract, usePublicClient, useWalletClient } from "wagmi";
import { formatUnits, parseUnits, decodeEventLog } from "viem";
import { Loader2, ShieldCheck, Coins, ArrowDownUp, Clock, ExternalLink, Droplets, ShieldOff } from "lucide-react";
import { USDC_ADDRESS, WRAPPED_USDC_ADDRESS, ERC20_ABI, WRAPPED_USDC_ABI } from "@/lib/contracts";
import { createNoxClient, encryptAmount, decryptBalance, publicDecryptHandle } from "@/lib/nox";

const ARBISCAN = "https://sepolia.arbiscan.io";

type TxLog = {
  id: string;
  type: "APPROVE" | "WRAP" | "UNWRAP_INIT" | "UNWRAP_FINAL";
  amount: string;
  txHash: string;
  timestamp: number;
  status: "PENDING" | "CONFIRMED" | "FAILED";
};

export default function ShieldPage() {
  const { address, isConnected } = useAccount();
  const client     = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 0); return () => clearTimeout(t); }, []);

  // ── Balances ─────────────────────────────────────────────────────────────────
  const [publicBal,  setPublicBal]  = useState("—");
  const [shieldedBal, setShieldedBal] = useState<string>("████ ████");
  const [shieldedHandle, setShieldedHandle] = useState<`0x${string}` | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);
  const [loadingBal, setLoadingBal] = useState(false);

  // ── Form state ────────────────────────────────────────────────────────────────
  const [wrapAmount,   setWrapAmount]   = useState("");
  const [unwrapAmount, setUnwrapAmount] = useState("");

  // ── Step state ────────────────────────────────────────────────────────────────
  const [wrapStep,   setWrapStep]   = useState<"idle" | "approving" | "wrapping" | "done">("idle");
  const [unwrapStep, setUnwrapStep] = useState<"idle" | "encrypting" | "unwrapping" | "decrypting" | "finalizing" | "done">("idle");

  // ── Terminal logs ─────────────────────────────────────────────────────────────
  const [wrapLogs,   setWrapLogs]   = useState<string[]>([]);
  const [unwrapLogs, setUnwrapLogs] = useState<string[]>([]);
  const addWL  = (m: string) => setWrapLogs(p => [...p, `> ${m}`]);
  const addUL  = (m: string) => setUnwrapLogs(p => [...p, `> ${m}`]);

  // ── Tx History ────────────────────────────────────────────────────────────────
  const histKey = address ? `opaque_tx_v2_${address.toLowerCase()}` : null;
  const [txHistory, setTxHistory] = useState<TxLog[]>([]);

  useEffect(() => {
    if (!histKey) return;
    try { const s = localStorage.getItem(histKey); if (s) setTxHistory(JSON.parse(s)); } catch {}
  }, [histKey]);

  const addTx = (entry: TxLog) => setTxHistory(prev => {
    const next = [entry, ...prev];
    if (histKey) localStorage.setItem(histKey, JSON.stringify(next));
    return next;
  });

  const updateTx = (hash: string, status: TxLog["status"]) => setTxHistory(prev => {
    const next = prev.map(t => t.txHash === hash ? { ...t, status } : t);
    if (histKey) localStorage.setItem(histKey, JSON.stringify(next));
    return next;
  });

  // ── Gas helper ────────────────────────────────────────────────────────────────
  const gasPrice = useCallback(async () => {
    if (!client) return undefined;
    try { const gp = await client.getGasPrice(); return (gp * 120n) / 100n; } catch { return 100_000_000n; }
  }, [client]);

  // ── Fetch balances ────────────────────────────────────────────────────────────
  const fetchBalances = useCallback(async () => {
    if (!address || !client || !USDC_ADDRESS) return;
    setLoadingBal(true);
    try {
      // Public USDC
      const raw = await client.readContract({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: "balanceOf", args: [address] }) as bigint;
      setPublicBal(parseFloat(formatUnits(raw, 6)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

      // Encrypted balance handle (just store handle, don't auto-decrypt)
      if (WRAPPED_USDC_ADDRESS && WRAPPED_USDC_ADDRESS !== "0x") {
        const handle = await client.readContract({ address: WRAPPED_USDC_ADDRESS, abi: WRAPPED_USDC_ABI, functionName: "confidentialBalanceOf", args: [address] }) as `0x${string}`;
        const isZero = handle === "0x0000000000000000000000000000000000000000000000000000000000000000";
        setShieldedHandle(isZero ? null : handle);
        if (isZero) setShieldedBal("0.00");
        else setShieldedBal("████ ████");
      }
    } catch (e) { console.error("Balance fetch:", e); }
    setLoadingBal(false);
  }, [address, client]);

  useEffect(() => { if (mounted && isConnected) fetchBalances(); }, [mounted, isConnected, fetchBalances]);

  // ── Reveal shielded balance ───────────────────────────────────────────────────
  const handleReveal = async () => {
    if (!walletClient || !shieldedHandle) return;
    setRevealLoading(true);
    try {
      const nox = await createNoxClient(walletClient);
      const value = await decryptBalance(nox, shieldedHandle);
      setShieldedBal(parseFloat(formatUnits(value, 6)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    } catch (e: any) {
      setShieldedBal("Decrypt failed");
    }
    setRevealLoading(false);
  };

  // ── WRAP (Shield) ─────────────────────────────────────────────────────────────
  const handleWrap = async () => {
    if (!wrapAmount || !address || !USDC_ADDRESS || !WRAPPED_USDC_ADDRESS) return;
    setWrapLogs([]);
    setWrapStep("approving");
    const amtWei = parseUnits(wrapAmount, 6);
    const gp = await gasPrice();

    try {
      addWL(`Wrapping ${wrapAmount} USDC → wcUSDC...`);
      addWL("Step 1/2: Approve USDC to WrappedConfidentialUSDC...");
      const approveHash = await writeContractAsync({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: "approve", args: [WRAPPED_USDC_ADDRESS, amtWei], gasPrice: gp });
      addTx({ id: approveHash, type: "APPROVE", amount: wrapAmount, txHash: approveHash, timestamp: Date.now(), status: "PENDING" });
      addWL(`Approve TX: ${approveHash.slice(0, 20)}...`);
      const approveRcpt = await client!.waitForTransactionReceipt({ hash: approveHash });
      if (approveRcpt.status !== "success") throw new Error("Approve failed");
      updateTx(approveHash, "CONFIRMED");
      addWL("[OK] Approval confirmed.");

      setWrapStep("wrapping");
      addWL("Step 2/2: Wrap USDC into iExec Nox confidential token...");
      const wrapHash = await writeContractAsync({ address: WRAPPED_USDC_ADDRESS, abi: WRAPPED_USDC_ABI, functionName: "wrap", args: [address, amtWei], gasPrice: gp });
      addTx({ id: wrapHash, type: "WRAP", amount: wrapAmount, txHash: wrapHash, timestamp: Date.now(), status: "PENDING" });
      addWL(`Wrap TX: ${wrapHash.slice(0, 20)}...`);
      const wrapRcpt = await client!.waitForTransactionReceipt({ hash: wrapHash });
      if (wrapRcpt.status !== "success") throw new Error("Wrap failed");
      updateTx(wrapHash, "CONFIRMED");
      addWL("[SUCCESS] USDC wrapped into confidential wcUSDC!");
      addWL(`→ ${wrapAmount} USDC is now encrypted inside iExec Nox.`);
      setWrapStep("done");
      setWrapAmount("");
      await fetchBalances();
    } catch (e: any) {
      addWL(`[ERROR] ${e.message ?? "Transaction failed."}`);
      setWrapStep("idle");
    }
  };

  // ── UNWRAP (Unshield) — 4 steps ──────────────────────────────────────────────
  const handleUnwrap = async () => {
    if (!unwrapAmount || !address || !walletClient || !WRAPPED_USDC_ADDRESS) return;
    setUnwrapLogs([]);
    const amtWei = parseUnits(unwrapAmount, 6);
    const gp = await gasPrice();

    try {
      // Step 1: Encrypt amount client-side
      setUnwrapStep("encrypting");
      addUL(`Unwrapping ${unwrapAmount} wcUSDC → USDC...`);
      addUL("Step 1/4: Encrypting amount with iExec Nox SDK...");
      const nox = await createNoxClient(walletClient);
      const { handle, handleProof } = await encryptAmount(nox, amtWei, WRAPPED_USDC_ADDRESS);
      addUL(`[OK] Encrypted handle: ${handle.slice(0, 20)}...`);

      // Step 2: Call unwrap on-chain
      setUnwrapStep("unwrapping");
      addUL("Step 2/4: Submitting unwrap request on-chain...");
      const unwrapHash = await writeContractAsync({
        address: WRAPPED_USDC_ADDRESS, abi: WRAPPED_USDC_ABI,
        functionName: "unwrap",
        args: [address, address, handle, handleProof],
        gasPrice: gp,
      });
      addTx({ id: unwrapHash, type: "UNWRAP_INIT", amount: unwrapAmount, txHash: unwrapHash, timestamp: Date.now(), status: "PENDING" });
      addUL(`Unwrap TX: ${unwrapHash.slice(0, 20)}...`);
      const unwrapRcpt = await client!.waitForTransactionReceipt({ hash: unwrapHash });
      if (unwrapRcpt.status !== "success") throw new Error("Unwrap TX failed");
      updateTx(unwrapHash, "CONFIRMED");

      // Parse UnwrapRequested event to get unwrapRequestId
      let unwrapRequestId: `0x${string}` | null = null;
      for (const log of unwrapRcpt.logs) {
        try {
          const decoded = decodeEventLog({ abi: WRAPPED_USDC_ABI, data: log.data, topics: log.topics });
          if (decoded.eventName === "UnwrapRequested") {
            unwrapRequestId = (decoded.args as any).amount as `0x${string}`;
          }
        } catch {}
      }
      if (!unwrapRequestId) throw new Error("Could not find UnwrapRequested event");
      addUL(`[OK] Unwrap requested. ID: ${unwrapRequestId.slice(0, 20)}...`);

      // Step 3: Public decrypt via TEE
      setUnwrapStep("decrypting");
      addUL("Step 3/4: TEE decrypting unwrap amount (may take a moment)...");
      const { decryptionProof } = await publicDecryptHandle(nox, unwrapRequestId);
      addUL("[OK] TEE decryption complete.");

      // Step 4: Finalize unwrap
      setUnwrapStep("finalizing");
      addUL("Step 4/4: Finalizing — releasing USDC to your wallet...");
      const finalHash = await writeContractAsync({
        address: WRAPPED_USDC_ADDRESS, abi: WRAPPED_USDC_ABI,
        functionName: "finalizeUnwrap",
        args: [unwrapRequestId, decryptionProof],
        gasPrice: gp,
      });
      addTx({ id: finalHash, type: "UNWRAP_FINAL", amount: unwrapAmount, txHash: finalHash, timestamp: Date.now(), status: "PENDING" });
      addUL(`Finalize TX: ${finalHash.slice(0, 20)}...`);
      const finalRcpt = await client!.waitForTransactionReceipt({ hash: finalHash });
      if (finalRcpt.status !== "success") throw new Error("FinalizeUnwrap failed");
      updateTx(finalHash, "CONFIRMED");

      addUL(`[SUCCESS] ${unwrapAmount} USDC returned to your wallet!`);
      setUnwrapStep("done");
      setUnwrapAmount("");
      await fetchBalances();
    } catch (e: any) {
      addUL(`[ERROR] ${e.message ?? "Unwrap failed."}`);
      setUnwrapStep("idle");
    }
  };

  const walletReady = mounted && isConnected && address;
  const contractReady = !!WRAPPED_USDC_ADDRESS && WRAPPED_USDC_ADDRESS !== "0x";

  const wrapBusy   = wrapStep === "approving" || wrapStep === "wrapping";
  const unwrapBusy = unwrapStep !== "idle" && unwrapStep !== "done";

  const typeLabel: Record<TxLog["type"], string> = {
    APPROVE: "APPROVE", WRAP: "WRAP", UNWRAP_INIT: "UNWRAP", UNWRAP_FINAL: "FINALIZE",
  };
  const typeColor: Record<TxLog["type"], string> = {
    APPROVE: "#facc15", WRAP: "#0000FF", UNWRAP_INIT: "#a78bfa", UNWRAP_FINAL: "#4ade80",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fade-in 0.3s ease" }}>

      {/* Wallet Status Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: walletReady ? "rgba(0,0,255,0.04)" : "rgba(255,50,50,0.04)", border: `1px solid ${walletReady ? "rgba(0,0,255,0.15)" : "rgba(255,50,50,0.15)"}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: walletReady ? "#4ade80" : "#ff4444", boxShadow: walletReady ? "0 0 8px #4ade80" : "0 0 8px #ff4444" }} />
          <span className="mono" style={{ fontSize: "11px", color: walletReady ? "#4ade80" : "#ff6666", letterSpacing: "1px" }}>
            {walletReady ? `CONNECTED · ${address!.slice(0,6)}...${address!.slice(-4)}` : "WALLET NOT CONNECTED"}
          </span>
          {contractReady && (
            <span className="mono" style={{ fontSize: "9px", color: "var(--text-faint)", marginLeft: "12px" }}>
              wcUSDC: {WRAPPED_USDC_ADDRESS.slice(0,8)}...{WRAPPED_USDC_ADDRESS.slice(-6)}
            </span>
          )}
        </div>
        {walletReady && (
          <button onClick={fetchBalances} disabled={loadingBal} className="mono" style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            {loadingBal ? <Loader2 size={12} className="animate-spin" /> : "↻"} Refresh
          </button>
        )}
      </div>

      {/* Balance Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Public USDC */}
        <div style={{ background: "var(--surface-alt)", border: "1px solid var(--border-strong)", padding: "28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, padding: "20px", color: "rgba(74,222,128,0.06)", fontSize: "80px", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, lineHeight: 1 }}>PUB</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Coins size={18} color="#4ade80" />
            <span className="mono" style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "2px" }}>PUBLIC USDC BALANCE</span>
          </div>
          <div className="mono" style={{ fontSize: "32px", color: "var(--foreground)", marginBottom: "6px" }}>
            {walletReady ? publicBal : "—"}
          </div>
          <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>Circle USDC · Fully visible on-chain</div>
          <a href="https://faucet.circle.com/" target="_blank" rel="noreferrer"
            className="mono" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", padding: "10px 16px", fontSize: "11px", textDecoration: "none" }}>
            <Droplets size={13} /> GET TESTNET USDC · Circle Faucet ↗
          </a>
        </div>

        {/* Shielded (wcUSDC) */}
        <div style={{ background: "var(--surface-alt)", border: "1px solid #0000FF", padding: "28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, padding: "20px", color: "rgba(0,0,255,0.06)", fontSize: "80px", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, lineHeight: 1 }}>NOX</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <ShieldCheck size={18} color="#0000FF" />
            <span className="mono" style={{ fontSize: "11px", color: "#0000FF", letterSpacing: "2px" }}>CONFIDENTIAL wcUSDC</span>
          </div>
          <div className="mono" style={{ fontSize: "32px", color: "var(--foreground)", marginBottom: "6px", letterSpacing: shieldedBal === "████ ████" ? "4px" : "normal" }}>
            {walletReady ? shieldedBal : "—"}
          </div>
          <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>ERC-7984 · iExec Nox Enclave · Balance Private</div>
          {walletReady && shieldedHandle && shieldedBal === "████ ████" && (
            <button onClick={handleReveal} disabled={revealLoading} className="mono"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,0,255,0.1)", border: "1px solid rgba(0,0,255,0.3)", color: "#0000FF", padding: "10px 16px", fontSize: "11px", cursor: "pointer" }}>
              {revealLoading ? <Loader2 size={13} className="animate-spin" /> : "🔓"} REVEAL BALANCE (sign to decrypt)
            </button>
          )}
        </div>
      </div>

      {/* Wrap (Shield) */}
      <div className="dash-grid-2">
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <ArrowDownUp size={20} color="#0000FF" />
            <h2 className="bc" style={{ fontSize: "26px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--foreground)" }}>Wrap USDC → wcUSDC</h2>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "28px", lineHeight: 1.6 }}>
            Convert Circle USDC into confidential ERC-7984 tokens via iExec Nox. Your balance becomes encrypted on-chain.
          </p>

          {!walletReady ? (
            <div style={{ padding: "40px", background: "rgba(0,0,255,0.05)", border: "1px dashed rgba(0,0,255,0.3)", textAlign: "center", color: "#0000FF", fontSize: "12px" }} className="mono">
              [ WALLET CONNECTION REQUIRED ]
            </div>
          ) : !contractReady ? (
            <div style={{ padding: "20px", background: "rgba(255,100,0,0.05)", border: "1px dashed rgba(255,100,0,0.3)", color: "#fa7", fontSize: "11px" }} className="mono">
              NEXT_PUBLIC_WRAPPED_USDC_ADDRESS not configured.
            </div>
          ) : (
            <>
              <label className="bc" style={{ display: "block", fontSize: "12px", color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase" }}>Amount to Wrap (USDC)</label>
              <input
                type="number" placeholder="e.g. 1000" value={wrapAmount}
                onChange={e => setWrapAmount(e.target.value)} disabled={wrapBusy}
                className="mono"
                style={{ width: "100%", background: "var(--surface-alt)", border: "1px solid var(--border)", borderBottom: "2px solid #0000FF", color: "var(--foreground)", padding: "16px", fontSize: "18px", outline: "none", marginBottom: "8px" }}
              />
              <div className="mono" style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "16px" }}>Available: {publicBal} USDC</div>
              <button onClick={handleWrap} disabled={wrapBusy || !wrapAmount} className="bc"
                style={{ width: "100%", padding: "18px", background: (wrapBusy || !wrapAmount) ? "var(--border)" : "linear-gradient(135deg,#0000FF,#3355FF)", color: "#fff", border: "none", fontSize: "16px", cursor: (wrapBusy || !wrapAmount) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", letterSpacing: "1px" }}>
                {wrapBusy ? <><Loader2 size={18} className="animate-spin" />{wrapStep === "approving" ? "APPROVING..." : "WRAPPING..."}</> : "WRAP INTO NOX VAULT →"}
              </button>
            </>
          )}
        </div>

        {/* Wrap Terminal */}
        <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border-strong)", padding: "24px", display: "flex", flexDirection: "column", minHeight: "360px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-strong)", paddingBottom: "16px", marginBottom: "16px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: wrapStep === "done" ? "#4ade80" : wrapBusy ? "#0000FF" : "var(--border-soft)", animation: wrapBusy ? "pulse 2s infinite" : "none" }} />
            <div className="mono" style={{ fontSize: "11px", color: "var(--text-dim)", letterSpacing: "1px" }}>NOX WRAP TERMINAL</div>
          </div>
          <div className="mono" style={{ flex: 1, fontSize: "12px", display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto" }}>
            {wrapLogs.length === 0 && <div style={{ color: "var(--text-faint)" }}>&gt; Awaiting wrap input...</div>}
            {wrapLogs.map((log, i) => (
              <div key={i} style={{ animation: "fade-in 0.3s ease", color: log.includes("[OK]") || log.includes("[SUCCESS]") ? "#4ade80" : log.includes("[ERROR]") ? "#ff4444" : "#0000FF" }}>{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Unwrap (Unshield) */}
      <div style={{ background: "var(--surface-alt)", border: "1px solid rgba(167,139,250,0.3)", padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <ShieldOff size={20} color="#a78bfa" />
          <h3 className="bc" style={{ fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", color: "#a78bfa" }}>Unwrap wcUSDC → USDC</h3>
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "24px", lineHeight: 1.6 }}>
          4-step on-chain process: encrypt → unwrap → TEE decrypt → finalize. USDC is released after iExec Nox attestation.
        </p>

        {!walletReady ? (
          <div style={{ padding: "28px", background: "rgba(167,139,250,0.04)", border: "1px dashed rgba(167,139,250,0.2)", textAlign: "center", color: "#a78bfa", fontSize: "12px" }} className="mono">[ WALLET CONNECTION REQUIRED ]</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label className="bc" style={{ display: "block", fontSize: "12px", color: "var(--text-dim)", marginBottom: "8px", textTransform: "uppercase" }}>Amount to Unwrap (USDC)</label>
              <input
                type="number" placeholder="e.g. 500" value={unwrapAmount}
                onChange={e => setUnwrapAmount(e.target.value)} disabled={unwrapBusy}
                className="mono"
                style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderBottom: "2px solid #a78bfa", color: "var(--foreground)", padding: "14px 16px", fontSize: "18px", outline: "none", marginBottom: "16px" }}
              />

              {/* Progress steps */}
              {unwrapBusy && (
                <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {(["encrypting","unwrapping","decrypting","finalizing"] as const).map((s, i) => {
                    const steps = ["encrypting","unwrapping","decrypting","finalizing"];
                    const idx = steps.indexOf(unwrapStep);
                    const done = i < idx;
                    const active = s === unwrapStep;
                    return (
                      <div key={s} className="mono" style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "8px", color: done ? "#4ade80" : active ? "#a78bfa" : "var(--text-faint)" }}>
                        <span>{done ? "✓" : active ? <Loader2 size={10} className="animate-spin" style={{ display: "inline" }} /> : "○"}</span>
                        {["Encrypt amount","Submit unwrap","TEE decrypt","Finalize release"][i]}
                      </div>
                    );
                  })}
                </div>
              )}

              <button onClick={handleUnwrap} disabled={unwrapBusy || !unwrapAmount} className="bc"
                style={{ width: "100%", padding: "16px", background: (unwrapBusy || !unwrapAmount) ? "var(--border)" : "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff", border: "none", fontSize: "15px", cursor: (unwrapBusy || !unwrapAmount) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", letterSpacing: "1px" }}>
                {unwrapBusy ? <><Loader2 size={16} className="animate-spin" /> {unwrapStep.toUpperCase()}...</> : "REQUEST UNWRAP →"}
              </button>
              <div className="mono" style={{ fontSize: "9px", color: "var(--text-faint)", marginTop: "8px", textAlign: "center" }}>
                Powered by iExec Nox TEE · ERC-7984 finalizeUnwrap
              </div>
            </div>

            {/* Unwrap Terminal */}
            <div style={{ background: "var(--sidebar-bg)", border: "1px solid var(--border-strong)", padding: "16px", display: "flex", flexDirection: "column", minHeight: "200px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: unwrapStep === "done" ? "#4ade80" : unwrapBusy ? "#a78bfa" : "var(--border-soft)", animation: unwrapBusy ? "pulse 2s infinite" : "none" }} />
                <span className="mono" style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px" }}>TEE UNWRAP TERMINAL</span>
              </div>
              <div className="mono" style={{ flex: 1, fontSize: "11px", display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
                {unwrapLogs.length === 0 && <div style={{ color: "var(--text-faint)" }}>&gt; Awaiting unwrap request...</div>}
                {unwrapLogs.map((log, i) => (
                  <div key={i} style={{ animation: "fade-in 0.3s ease", color: log.includes("[OK]") || log.includes("[SUCCESS]") ? "#4ade80" : log.includes("[ERROR]") ? "#ff4444" : "#a78bfa" }}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div style={{ background: "var(--surface-alt)", border: "1px solid var(--border-strong)", padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <Clock size={16} color="var(--text-dim)" />
          <h3 className="bc" style={{ fontSize: "20px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-dim)" }}>Transaction History</h3>
        </div>
        {txHistory.length === 0 ? (
          <div className="mono" style={{ textAlign: "center", padding: "32px", color: "var(--text-faint)", fontSize: "12px", letterSpacing: "1px" }}>
            NO TRANSACTIONS YET — WRAP USDC TO GET STARTED
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "110px 90px 1fr 100px", gap: "12px", padding: "8px 16px" }}>
              {["TYPE","AMOUNT","TX HASH","STATUS"].map(h => (
                <div key={h} className="mono" style={{ fontSize: "9px", color: "var(--text-faint)", letterSpacing: "2px" }}>{h}</div>
              ))}
            </div>
            {txHistory.map(tx => (
              <div key={tx.id} style={{ display: "grid", gridTemplateColumns: "110px 90px 1fr 100px", gap: "12px", padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", alignItems: "center" }}>
                <div className="mono" style={{ fontSize: "11px", color: typeColor[tx.type], letterSpacing: "1px" }}>{typeLabel[tx.type]}</div>
                <div className="mono" style={{ fontSize: "12px", color: "var(--foreground)" }}>{tx.amount}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.txHash.slice(0,22)}...</span>
                  <a href={`${ARBISCAN}/tx/${tx.txHash}`} target="_blank" rel="noreferrer" style={{ color: "#0000FF" }}><ExternalLink size={12} /></a>
                </div>
                <div className="mono" style={{ fontSize: "10px", color: tx.status === "CONFIRMED" ? "#4ade80" : tx.status === "FAILED" ? "#ff4444" : "#facc15", letterSpacing: "1px" }}>
                  {tx.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
