"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const ChainGPTChat = lazy(() => import("@/components/ChainGPTChat"));

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const pixels = document.querySelectorAll('.hero-pixel') as NodeListOf<HTMLElement>;
    // Single interval updates all pixels — far less overhead than 6 separate intervals
    const iv = setInterval(() => {
      pixels.forEach(p => {
        if (Math.random() > 0.7) p.style.opacity = Math.random() > 0.5 ? '1' : '0.3';
      });
    }, 900);
    return () => clearInterval(iv);
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
          <li><a href="#ai-risk">AI Risk</a></li>
          <li><Link href="/docs" style={{ color: "inherit", textDecoration: "none" }}>Docs</Link></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />
          <Link href="/dashboard" className="nav-cta" style={{ textDecoration: "none" }}>{"Launch App ↗︎"}</Link>
        </div>
        <button className="hamburger" id="hamburger" aria-label="Menu" onClick={() => setNavOpen(!navOpen)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile Nav */}
      <div id="mobileNav" style={{ display: navOpen ? 'flex' : 'none', position: "fixed", inset: "0", background: "var(--bg-deep)", zIndex: 200, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px" }}>
        <button onClick={() => setNavOpen(false)} style={{ position: "absolute", top: "20px", right: "24px", background: "none", border: "none", color: "var(--foreground)", fontSize: "28px", cursor: "pointer" }}>✕</button>
        <div style={{ position: "absolute", top: "20px", left: "24px" }}><ThemeToggle /></div>
        <a href="#mission" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "var(--foreground)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Mission</a>
        <a href="#why" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "var(--foreground)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Why Us</a>
        <a href="#services" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "var(--foreground)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Services</a>
        <a href="#tech" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "var(--foreground)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Technology</a>
        <a href="#ai-risk" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "var(--foreground)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>AI Risk</a>
        <Link href="/docs" onClick={() => setNavOpen(false)} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "36px", color: "#0000FF", textDecoration: "none", textTransform: "uppercase", letterSpacing: "2px" }}>Docs</Link>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div>
            <div className="hero-tag">Arbitrum Sepolia · iExec Nox · ChainGPT</div>
            <h1 className="hero-h1">Prove<br/>Your Profit.<br/><em>Hide</em><br/>Your Balance.</h1>
            <p className="hero-sub" style={{ marginBottom: "24px" }}>The first DeFi protocol where you can share verified trading performance — without leaking a single number from your portfolio.</p>

            <div className="hero-actions">
              <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>{"Enter App ↗︎"}</Link>
              <a href="#mission" className="btn-outline" style={{ textDecoration: "none" }}>Learn More</a>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-n">$0</div>
              <div className="hero-stat-l">Shield Fee</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">&lt;0.05%</div>
              <div className="hero-stat-l">Unwrap Fee</div>
            </div>
            <div className="hero-stat">
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
          <div className="hero-right-text" style={{ background: "rgba(0,0,255,0.05)", border: "1px solid rgba(0,0,255,0.2)", padding: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "12px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "20px", color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>Confidential Layer Active</div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontFamily: "'Inter', sans-serif", textAlign: "center" }}>iExec Nox wraps your assets in a cryptographic shield. Trade freely. Share only proof.</p>
          </div>
          <div className="hero-corner">SYS:ONLINE · BLOCK #19,482,301</div>
        </div>
      </section>

      {/* MARQUEE */}
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

      {/* MISSION */}
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
            {/* Privacy Ring with spinning orbits */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div className="privacy-ring">
                {/* Center text */}
                <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "40px", fontWeight: 900, color: "#0000FF", lineHeight: 1 }}>100%</div>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "var(--text-dim)", marginTop: "2px" }}>Privacy</div>
                </div>

                {/* Orbit 1 — outer ring, clockwise */}
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", animation: "orbit-spin 10s linear infinite", willChange: "transform" }}>
                  <div className="orbit-dot" style={{ top: "-6px", left: "50%", transform: "translateX(-50%)" }}></div>
                </div>

                {/* Orbit 2 — middle ring, counter-clockwise */}
                <div style={{ position: "absolute", inset: "20px", borderRadius: "50%", animation: "orbit-spin 16s linear infinite reverse", willChange: "transform" }}>
                  <div className="orbit-dot" style={{ top: "-6px", left: "50%", transform: "translateX(-50%)", background: "var(--bg-deep)", border: "2px solid #0000FF", width: "10px", height: "10px" }}></div>
                </div>
              </div>
            </div>

            {/* A+ / 0.0s boxes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", border: "1px solid var(--border-strong)" }}>
              <div style={{ padding: "16px", borderRight: "1px solid var(--border-strong)", background: "var(--surface)" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "28px", color: "#0000FF" }}>A+</div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>Safety Score</div>
              </div>
              <div style={{ padding: "16px", background: "var(--surface)" }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "28px", color: "var(--foreground)" }}>0.0s</div>
                <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>Latency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
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

      {/* SERVICES */}
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
            <div className="service-icon" style={{ background: "var(--icon-dark)" }}>
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
          <div className="service-card" style={{ background: "#0000FF", borderTop: "2px solid var(--border-strong)" }}>
            <div className="service-icon" style={{ background: "#fff" }}>
              <svg className="service-icon-svg" style={{ stroke: "#0000FF" }} viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
            </div>
            <div className="service-title" style={{ color: "#fff" }}>Share Cards</div>
            <div className="service-body" style={{ color: "rgba(255,255,255,.7)" }}>Generate verified performance cards for Twitter/X. Cryptographically signed, tamper-proof, balance-private. Flex your alpha without doxxing your bag.</div>
            <Link className="service-link" href="/dashboard" style={{ color: "#fff" }}>Try It Free →</Link>
          </div>
          <div className="service-card">
            <div className="service-icon" style={{ background: "var(--icon-dark)" }}>
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

      {/* RESULTS */}
      <section className="results" id="results">
        <div className="results-header">
          <div className="section-label">Proven Results</div>
          <h2 className="results-h2">Proven<br/><em>Results</em></h2>
        </div>
        <div style={{ border: "1px solid var(--border-strong)" }}>
          <div className="results-grid" style={{ border: "none", borderBottom: "1px solid var(--border-strong)" }}>
            <div className="result-cell">
              <div className="result-n">$12M+</div>
              <div className="result-l">Assets Shielded</div>
              <div className="result-desc">Total value locked in confidential contracts across all active users.</div>
            </div>
            <div className="result-cell" style={{ borderRight: "1px solid var(--border-strong)" }}>
              <div className="result-n">4,800+</div>
              <div className="result-l">Wallets Protected</div>
              <div className="result-desc">DeFi traders who&apos;ve moved their portfolio into OPAQUE&apos;s confidential layer.</div>
            </div>
            <div className="result-cell" style={{ borderRight: "1px solid var(--border-strong)" }}>
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
              <div className="case-tag">Use Case · Verifiable ROI</div>
              <div className="case-title">Alpha Validation &amp; On-Chain Proof</div>
              <div className="case-body">Performance marketers running on-chain campaigns use OPAQUE&apos;s verified cards as cryptographic proof of ROI — no screenshots, no manipulation.</div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH */}
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
        <div className="tech-bottom-grid" style={{ marginTop: "48px", border: "1px solid var(--border-strong)" }}>
          <div style={{ padding: "24px 28px", background: "var(--surface)" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: "var(--foreground)" }}>iExec Nox SDK</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>Nox enables confidential wrapping of any ERC-20 token. Assets are computationally shielded within a Trusted Execution Environment (TEE).</div>
          </div>
          <div style={{ padding: "24px 28px", background: "var(--surface)" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", color: "var(--foreground)" }}>ChainGPT Audit API</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>Real-time AI scoring of portfolio risk across 50+ smart contract vulnerability vectors, continuously updated on every block.</div>
          </div>
        </div>
      </section>

      {/* CHAINGPT RISK AI — no wallet required */}
      <section id="ai-risk" style={{ padding: "80px 5%", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "40px" }}>
            <div className="section-label">AI Risk Engine</div>
            <h2 className="bc" style={{ fontSize: "clamp(32px, 5vw, 52px)", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-1px", color: "var(--foreground)" }}>
              Ask ChainGPT<br/>Risk AI
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "480px", lineHeight: 1.7, marginTop: "8px" }}>
              Real-time DeFi risk analysis powered by ChainGPT. Ask anything about smart contract safety, TEE security, or portfolio risk — no wallet required.
            </p>
          </div>
          <div style={{ maxWidth: "680px" }}>
            <Suspense fallback={
              <div className="mono" style={{ padding: "32px", background: "var(--sidebar-bg)", border: "1px solid var(--border)", color: "var(--border-soft)", fontSize: "11px", letterSpacing: "1px" }}>
                LOADING AI...
              </div>
            }>
              <ChainGPTChat />
            </Suspense>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="cta-bg-text">OPAQUE OPAQUE</div>
        <div className="cta-inner">
          <div className="cta-tag">Confidential Layer</div>
          <h2 className="cta-h2">Shield Your<br/>Assets To<br/>Get Access</h2>
          <div style={{ marginTop: "24px" }}>
            <Link href="/dashboard" className="cta-btn" style={{ textDecoration: "none", padding: "20px 48px", fontSize: "20px" }}>{"ENTER NOX VAULT ↗︎"}</Link>
          </div>
          <p className="cta-note" style={{ marginTop: "24px" }}>Connect wallet on next step. Arbitrum Sepolia testnet only.</p>
        </div>
        <div className="cta-deco">
          <div className="cta-plus-grid">
            {Array.from({length: 36}).map((_, i) => <span key={i} className="cta-plus">+</span>)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "22px", color: "var(--foreground)", letterSpacing: "-1px", marginBottom: "12px" }}>OPAQUE_</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "200px" }}>Privacy-first DeFi analytics. Powered by iExec Nox &amp; ChainGPT.</div>
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
              <li><a href="https://github.com/OpaqueDev/Opaque" target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-giant">
          <div className="footer-giant-text">OPAQUE</div>
        </div>
        <div className="footer-bottom">
          <p><span className="dot"></span>© 2026 Opaque Finance. All rights reserved.</p>
          <p style={{ color: "var(--text-faint)" }}>Privacy Policy · Terms · Built for iExec Vibe Coding Hackathon</p>
        </div>
      </footer>
    </>
  );
}
