import { NextResponse } from "next/server";
import { fetchAndComputePnL } from "@/lib/enclave-pnl";

export async function POST(req: Request) {
  try {
    const { initial, final, wallet } = await req.json();

    if (!wallet) {
      return NextResponse.json({ error: "Missing wallet" }, { status: 400 });
    }

    // Run inside TEE boundary — only result exits, no raw balances
    const result = await fetchAndComputePnL(
      wallet as `0x${string}`,
      initial !== undefined ? Number(initial) : undefined,
      final   !== undefined ? Number(final)   : undefined
    );

    return NextResponse.json({
      pnl:                    result.pnl_display,
      proof:                  result.proof_hash,
      pnl_percentage:         result.pnl_percentage,
      verification_timestamp: result.verification_timestamp,
      deposits_analysed:      result.deposits_analysed,
    });
  } catch (e: any) {
    console.error("Compute error:", e);
    return NextResponse.json({ error: "Computation failed" }, { status: 500 });
  }
}
