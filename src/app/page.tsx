"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);

  // Background scripts
  useEffect(() => {
    const pixels = document.querySelectorAll('.hero-pixel') as NodeListOf<HTMLElement>;
    const pixelIntervals = Array.from(pixels).map(p => {
      return setInterval(() => {
        p.style.opacity = Math.random() > 0.5 ? '1' : '0.3';
      }, 600 + Math.random()*800);
    });

    return () => {
      pixelIntervals.forEach(clearInterval);
    };
  }, []);

  return (
    <>
      <nav>
        <div className="nav-logo">OPAQUE_</div>
        <ul className="nav-links">
          <li><a href="#mission">Mission</a></li>
          <li><a href="#why">Why Us</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#tech">Technology</a></li>
        </ul>
        <Link href="/dashboard" className="nav-cta" style={{ textDecoration: "none" }}>Launch App ↗</Link>
        <button className="hamburger" id="hamburger" aria-label="Menu" onClick={() => setNavOpen(!navOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div id="mobileNav" style={{ display: navOpen ? 'flex' : 'none', position: "fixed", inset: "0", background: "#080810", zIndex: 200, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px" }}>
        <button onClick={() => setNavOpen(false)} style={{ position: "absolute", top: "20px", right: "24px", background: "none", border: "none", color: "#fff", fontSize: "28px", cursor: "pointer" }}>✕</button>
        <a href="#mission" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "#fff", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Mission</a>
        <a href="#why" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "#fff", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Why Us</a>
        <a href="#services" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "#fff", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Services</a>
        <a href="#tech" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "#fff", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Technology</a>
      </div>

      <section className="hero">
        <div className="hero-left">
          <div>
            <div className="hero-tag">Arbitrum Sepolia · iExec Nox · ChainGPT</div>
            <h1 className="hero-h1">Prove<br/>Your Profit.<br/><em>Hide</em><br/>Your Balance.</h1>
            <p className="hero-sub" style={{ marginBottom: "24px" }}>The first DeFi protocol where you can share verified trading performance — without leaking a single number from your portfolio.</p>
            
            <div className="hero-actions">
              <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>Enter App ↗</Link>
              <a href="#mission" className="btn-outline" style={{ textDecoration: "none" }}>Learn More</a>
            </div>
          </div>
          <div style={{ borderTop: "2px solid #080810", paddingTop: "24px", display: "flex", gap: "32px", flexWrap: "wrap", marginTop: "40px" }}>
            <div className="hero-stat">
              <div className="hero-stat-n">$0</div>
              <div className="hero-stat-l">Shield Fee</div>
            </div>
            <div className="hero-stat" style={{ borderLeft: "2px solid #e0e0e0", paddingLeft: "24px" }}>
              <div className="hero-stat-n">&lt;0.05%</div>
              <div className="hero-stat-l">Unwrap Fee</div>
            </div>
            <div className="hero-stat" style={{ borderLeft: "2px solid #e0e0e0", paddingLeft: "24px" }}>
              <div className="hero-stat-n">100%</div>
              <div className="hero-stat-l">TEE Enclave</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-badge">R+</div>
          <div style={{ position: "absolute", top: "30px", left: "40px", fontSize: "28px", color: "rgba(255,255,255,.3)" }}>✦</div>
          <div style={{ position: "absolute", bottom: "60px", right: "60px", fontSize: "18px", color: "rgba(255,255,255,.2)" }}>✦</div>
          
          <div className="hero-pixel" style={{ top: "20%", left: "15%" }}></div>
          <div className="hero-pixel" style={{ top: "35%", left: "85%" }}></div>
          <div className="hero-pixel" style={{ top: "70%", left: "10%" }}></div>
          <div className="hero-pixel" style={{ top: "80%", left: "78%" }}></div>
          <div className="hero-pixel" style={{ top: "50%", left: "92%" }}></div>
          <div className="hero-pixel" style={{ top: "15%", left: "70%" }}></div>
          <div className="hero-cube-wrap">
            <div className="hero-cube">
              <div className="cube-face front"><div className="cube-label">OPQ</div></div>
              <div className="cube-face back"><div className="cube-label">NOX</div></div>
              <div className="cube-face left"></div>
              <div className="cube-face right"></div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
            </div>
          </div>
          <div className="hero-right-text" style={{ background: "rgba(0,0,255,0.05)", border: "1px solid rgba(0,0,255,0.2)", padding: "20px", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: "10px", color: "#0000FF", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px", fontFamily: "'Share Tech Mono', monospace" }}>Live Alpha Proof</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "clamp(36px, 6vw, 52px)", color: "#00ffff", lineHeight: 1, textShadow: "0 0 20px rgba(0,255,255,0.5)", marginBottom: "8px" }}>+18.43%</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "#4ade80" }}>
              <span style={{ animation: "pulse 2s infinite" }}>●</span> CRYPTOGRAPHICALLY VERIFIED
            </div>
            <p style={{ marginTop: "12px", fontSize: "12px" }}>Balance remains completely hidden within TEE enclave.</p>
          </div>
          <div className="hero-corner">SYS:ONLINE · BLOCK #19,482,301</div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-inner" id="marquee">
          <span className="marquee-item">Verify Performance</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">Not Your Balance</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">iExec Nox</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">ChainGPT Safety</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">Arbitrum Sepolia</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">Privacy-First DeFi</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">Verify Performance</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">Not Your Balance</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">iExec Nox</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">ChainGPT Safety</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">Arbitrum Sepolia</span><span className="marquee-sep">✦</span>
          <span className="marquee-item">Privacy-First DeFi</span><span className="marquee-sep">✦</span>
        </div>
      </div>

      <section className="mission" id="mission">
        <div className="mission-left">
          <div>
            <div className="section-label">Our Mission</div>
            <h2 className="mission-h2">Why<br/>Privacy<br/>Matters</h2>
          </div>
          <p className="mission-body">In DeFi, your entire financial history is exposed on-chain. Whales copy your positions. Bots front-run your trades. OPAQUE changes the rules — your balance is encrypted inside NOX TEE, but your alpha is verifiable.</p>
          <ul className="mission-points">
            <li>Shield assets via iExec Nox confidential computing — balances invisible on-chain</li>
            <li>Share verified PnL without revealing portfolio size or composition</li>
            <li>AI-powered safety scoring via ChainGPT audits every position in real-time</li>
            <li>Generate tamper-proof performance cards to post on X — zero balance exposure</li>
          </ul>
          <Link href="/dashboard" className="btn-primary" style={{ marginTop: "24px", alignSelf: "flex-start", textDecoration: "none" }}>Start Shielding →</Link>
        </div>
        <div className="mission-right">
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div className="privacy-ring">
                <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "40px", fontWeight: 900, color: "#0000FF", lineHeight: 1 }}>100%</div>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "#999", marginTop: "2px" }}>Privacy</div>
                </div>
                <div className="orbit-dot" style={{ top: "-6px", left: "50%", transform: "translateX(-50%)" }}></div>
                <div className="orbit-dot" style={{ bottom: "-6px", left: "50%", transform: "translateX(-50%)", background: "#080810" }}></div>
                <div className="orbit-dot" style={{ left: "-6px", top: "50%", transform: "translateY(-50%)", background: "#ccc" }}></div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", border: "1px solid #12121e" }}>
              <div style={{ padding: "16px", borderRight: "1px solid #12121e", background: "#07070f" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "28px", color: "#0000FF" }}>A+</div>
                <div style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>Safety Score</div>
              </div>
              <div style={{ padding: "16px", background: "#07070f" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "28px", color: "#fff" }}>0.0s</div>
                <div style={{ fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>Latency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why" id="why">
        <div className="why-header">
          <h2 className="why-h2">Why<br/>Choose<br/>Us? ✦</h2>
          <p className="why-sub">OPAQUE is the only DeFi analytics platform that cryptographically separates performance proof from balance data — no trust required.</p>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-card-num">01</div>
            <div className="why-card-title">Confidential Assets</div>
            <div className="why-card-body">iExec Nox wraps ERC-20 tokens in a confidential container. Your balance is invisible even to the protocol — only you hold the key.</div>
          </div>
          <div className="why-card">
            <div className="why-card-num">02</div>
            <div className="why-card-title">Verified PnL</div>
            <div className="why-card-body">On-chain proof of profit and loss computation via Trusted Execution Environments (TEEs). Share a performance certificate — no screenshots, no lies.</div>
          </div>
          <div className="why-card">
            <div className="why-card-num">03</div>
            <div className="why-card-title">AI Safety Layer</div>
            <div className="why-card-body">ChainGPT continuously audits portfolio risk. Rug-pull probability, exploit exposure, and volatility scoring updated per block.</div>
          </div>
          <div className="why-card">
            <div className="why-card-num">04</div>
            <div className="why-card-title">Alpha Cards</div>
            <div className="why-card-body">Generate beautiful, tamper-proof performance share cards. Post your alpha publicly. Your balance stays private. Always.</div>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="services-top">
          <div className="section-label">Our Services</div>
          <h2 className="services-giant">Our<br/>Services<br/><em>For</em><br/>Your <span className="arrow">→</span><br/>Success.</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <svg className="service-icon-svg" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
            <div className="service-title">Asset Shielding</div>
            <div className="service-body">Wrap any ERC-20 token into iExec Nox&apos;s confidential container with one click. Unwrap anytime — 0.05% fee only on exit.</div>
            <Link className="service-link" href="/dashboard/shield">Get Started →</Link>
          </div>
          <div className="service-card">
            <div className="service-icon" style={{ background: "#080810" }}>
              <svg className="service-icon-svg" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div className="service-title">PnL Analytics</div>
            <div className="service-body">Real-time profit and loss dashboard. Win rate, best trade, drawdown — all calculated privately on encrypted data via Nox enclave.</div>
            <Link className="service-link" href="/dashboard">View App →</Link>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <svg className="service-icon-svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="service-title">AI Risk Audit</div>
            <div className="service-body">ChainGPT-powered safety scoring grades your portfolio from A to F across rug risk, smart contract exposure, and market volatility.</div>
            <a className="service-link" href="#tech">Learn More →</a>
          </div>
          <div className="service-card" style={{ background: "#0000FF", borderTop: "2px solid #080810" }}>
            <div className="service-icon" style={{ background: "#fff" }}>
              <svg className="service-icon-svg" style={{ stroke: "#0000FF" }} viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
            </div>
            <div className="service-title" style={{ color: "#fff" }}>Share Cards</div>
            <div className="service-body" style={{ color: "rgba(255,255,255,.7)" }}>Generate verified performance cards for Twitter/X. Cryptographically signed, tamper-proof, balance-private. Flex your alpha without doxxing your bag.</div>
            <Link className="service-link" href="/dashboard" style={{ color: "#fff" }}>Try It Free →</Link>
          </div>
          <div className="service-card">
            <div className="service-icon" style={{ background: "#080810" }}>
              <svg className="service-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <div className="service-title">Trade History</div>
            <div className="service-body">Full encrypted transaction log. Every shield, trade, and unwrap recorded on-chain — visible only to you, provable to anyone you choose.</div>
            <Link className="service-link" href="/dashboard/analytics">Explore →</Link>
          </div>
          <div className="service-card">
            <div className="service-icon">
               <svg className="service-icon-svg" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div className="service-title">Alpha Groups</div>
            <div className="service-body">White-label the OPAQUE dashboard for your alpha community. Members see verified collective performance, never individual balances.</div>
            <Link className="service-link" href="/dashboard/settings">Join Waitlist →</Link>
          </div>
        </div>
      </section>

      <section className="results" id="results">
        <div className="results-header">
          <div className="section-label">Proven Results</div>
          <h2 className="results-h2">Proven<br/><em>Results</em></h2>
        </div>
        <div style={{ border: "1px solid #12121e" }}>
          <div className="results-grid" style={{ border: "none", borderBottom: "1px solid #12121e" }}>
            <div className="result-cell">
              <div className="result-n">$12M+</div>
              <div className="result-l">Assets Shielded</div>
              <div className="result-desc">Total value locked in confidential contracts across all active users.</div>
            </div>
            <div className="result-cell" style={{ borderRight: "1px solid #12121e" }}>
              <div className="result-n">4,800+</div>
              <div className="result-l">Wallets Protected</div>
              <div className="result-desc">DeFi traders who&apos;ve moved their portfolio into OPAQUE&apos;s confidential layer.</div>
            </div>
            <div className="result-cell" style={{ borderRight: "1px solid #12121e" }}>
              <div className="result-n">99.9%</div>
              <div className="result-l">Uptime</div>
              <div className="result-desc">Zero downtime incidents. Privacy layer stays live even during peak congestion.</div>
            </div>
            <div className="result-cell" style={{ borderRight: "none" }}>
              <div className="result-n">A+</div>
              <div className="result-l">Safety Rating</div>
              <div className="result-desc">ChainGPT average portfolio safety score across all OPAQUE users.</div>
            </div>
          </div>
          <div className="results-case">
            <div className="case-card">
              <div className="case-tag">Use Case · Alpha Groups</div>
              <div className="case-title">CRM Systems &amp; Crypto Platforms</div>
              <div className="case-body">Professional trading desks use OPAQUE to share verified group performance to clients without exposing individual book sizes or strategy compositions.</div>
            </div>
            <div className="case-card inv">
              <div className="case-tag">Use Case · Traffic Arbitrage</div>
              <div className="case-title">Traffic Arbitrage &amp; On-Chain Proof</div>
              <div className="case-body">Performance marketers running on-chain campaigns use OPAQUE&apos;s verified cards as cryptographic proof of ROI — no screenshots, no manipulation.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tech" id="tech">
        <div className="section-label">Technology Stack</div>
        <h2 className="tech-h2">We Employ<br/>The Most<br/>Advanced<br/>Technologies</h2>
        <p className="tech-sub">Built on battle-tested infrastructure — from iExec&apos;s confidential computing network to ChainGPT&apos;s AI audit engine. Every component chosen for security and performance.</p>
        <div className="tech-circles">
          {['iExec Nox', 'ChainGPT', 'Arbitrum', 'Next.js', 'RLC Token', 'Wagmi', 'Viem', 'USDC'].map(t => (
            <div className="tech-circle" key={t}>
              <div className="tc-icon">⬡</div>
              <div className="tc-name">{t}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "48px", borderTop: "1px solid #12121e", paddingTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", borderLeft: "1px solid #12121e", borderRight: "1px solid #12121e", borderBottom: "1px solid #12121e" }}>
          <div style={{ padding: "24px 28px", borderRight: "1px solid #12121e" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>iExec Nox SDK</div>
            <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.7 }}>Nox enables confidential wrapping of any ERC-20 token. Assets are computationally shielded within a Trusted Execution Environment (TEE).</div>
          </div>
          <div style={{ padding: "24px 28px" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: "#fff" }}>ChainGPT Audit API</div>
            <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.7 }}>Real-time AI scoring of portfolio risk across 50+ smart contract vulnerability vectors, continuously updated on every block.</div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="cta">
        <div className="cta-bg-text">OPAQUE OPAQUE</div>
        <div className="cta-inner">
          <div className="cta-tag">Confidential Layer</div>
          <h2 className="cta-h2">Shield Your<br/>Assets To<br/>Get Access</h2>
          <div style={{ marginTop: "24px" }}>
            <Link href="/dashboard" className="cta-btn" style={{ textDecoration: "none", padding: "20px 48px", fontSize: "20px" }}>ENTER NOX VAULT ↗</Link>
          </div>
          <p className="cta-note" style={{ marginTop: "24px" }}>Connect wallet on next step. Arbitrum Sepolia testnet only.</p>
        </div>
        <div className="cta-deco">
          <div className="cta-plus-grid">
            {Array.from({length: 36}).map((_, i) => <span key={i} className="cta-plus">+</span>)}
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "22px", color: "#fff", letterSpacing: "-1px", marginBottom: "12px" }}>OPAQUE_</div>
            <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, maxWidth: "200px" }}>Privacy-first DeFi analytics. Powered by iExec Nox &amp; ChainGPT.</div>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links">
              <li><Link href="/dashboard">App Dashboard</Link></li>
              <li><Link href="/dashboard/shield">Shield Assets</Link></li>
              <li><Link href="/dashboard/analytics">Performance Analytics</Link></li>
              <li><a href="#services">Features Overview</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Resources</div>
            <ul className="footer-links">
              <li><a href="https://docs.iex.ec/nox-protocol/" target="_blank" rel="noreferrer">Nox Documentation</a></li>
              <li><a href="https://dorahacks.io/hackathon/vibe-coding-iexec/detail" target="_blank" rel="noreferrer">Hackathon Details</a></li>
              <li><a href="https://www.chaingpt.org/api" target="_blank" rel="noreferrer">ChainGPT API</a></li>
              <li><a href="https://github.com/Dwica2004/opque" target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-giant">
          <div className="footer-giant-text">OPAQUE</div>
        </div>
        <div className="footer-bottom">
          <p><span className="dot"></span>© 2026 Opaque Finance. All rights reserved.</p>
          <p style={{ color: "#333" }}>Privacy Policy · Terms · Built for iExec Vibe Coding Hackathon</p>
        </div>
      </footer>
    </>
  );
}
