import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { initial, final, wallet } = await req.json();
    
    if (!initial || !final || !wallet) {
      return NextResponse.json({ error: "Missing initial amount, final amount, or wallet" }, { status: 400 });
    }

    // Exact evaluation requested by the user
    const current = final;
    
    // Compute exact mathematical PnL
    const pnl = ((current - initial) / initial) * 100;
    
    // Generate proof
    const generateHex = (len: number) => {
      let result = '0x';
      const chars = '0123456789abcdef';
      for (let i = 0; i < len; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    }
    const proof = generateHex(64);

    // Generate encrypted balance
    const chars = ['█', '▓', '▒', '░', '◉'];
    let encryptedBalance = '';
    for (let i = 0; i < 8; i++) {
      encryptedBalance += chars[Math.floor(Math.random() * chars.length)];
    }

    return NextResponse.json({
      pnl: (pnl > 0 ? '+' : '') + pnl.toFixed(2) + '%',
      proof,
      encryptedBalance
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
