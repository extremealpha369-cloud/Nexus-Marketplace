import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "overview", title: "Overview", icon: "🛡" },
  { id: "collection", title: "Data We Collect", icon: "📊" },
  { id: "usage", title: "How We Use Data", icon: "⚙️" },
  { id: "cookies", title: "Cookies & Tracking", icon: "🍪" },
  { id: "sharing", title: "Data Sharing", icon: "🔗" },
  { id: "retention", title: "Data Retention", icon: "🗃" },
  { id: "rights", title: "Your Rights", icon: "⚖️" },
  { id: "security", title: "Security", icon: "🔒" },
  { id: "children", title: "Children's Privacy", icon: "👶" },
  { id: "updates", title: "Policy Updates", icon: "📋" },
  { id: "contact", title: "Contact Us", icon: "✉️" },
];

export default function PrivacyPolicy({ onNavigate }: { onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [scrolled, setScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = () => {
      setScrolled(el.scrollTop > 40);
      const sections = el.querySelectorAll("[data-section]");
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top < 200 && rect.bottom > 100) setActiveSection(s.getAttribute("data-section") || "");
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = contentRef.current?.querySelector(`[data-section="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;background:#08080f;color:#f0eeff;font-family:'Outfit',sans-serif}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111120}::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.4);border-radius:10px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 12px rgba(124,58,237,0.3)}50%{box-shadow:0 0 28px rgba(124,58,237,0.6)}}
        .pp-wrap{display:flex;height:100vh;overflow:hidden;background:#08080f;position:relative}
        .pp-sidebar{width:280px;flex-shrink:0;background:#0d0d18;border-right:1px solid rgba(130,80,255,0.14);display:flex;flex-direction:column;overflow:hidden}
        .pp-sidebar-top{padding:24px 20px 20px;border-bottom:1px solid rgba(130,80,255,0.1)}
        .pp-logo{display:flex;align-items:center;gap:10px;margin-bottom:20px;cursor:pointer}
        .pp-logo-icon{width:34px;height:34px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:10px;display:flex;align-items:center;justify-content:center;animation:pulse 3s ease-in-out infinite;flex-shrink:0}
        .pp-logo-text{font-family:'Playfair Display',serif;font-weight:800;font-size:18px}
        .pp-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:rgba(124,58,237,0.1);border:1px solid rgba(168,85,247,0.25);font-size:11px;color:#c084fc;font-family:'Fira Code',monospace}
        .pp-nav{flex:1;overflow-y:auto;padding:12px 10px}
        .pp-nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:500;color:#7b7a9a;transition:all 0.18s;border:1px solid transparent;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pp-nav-item:hover{background:rgba(124,58,237,0.07);color:#f0eeff;border-color:rgba(130,80,255,0.14)}
        .pp-nav-item.active{background:rgba(124,58,237,0.14);color:#c084fc;border-color:rgba(168,85,247,0.25)}
        .pp-nav-icon{font-size:14px;flex-shrink:0}
        .pp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .pp-topbar{height:60px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:rgba(8,8,15,0.9);border-bottom:1px solid rgba(130,80,255,0.14);backdrop-filter:blur(16px);transition:border-color 0.3s}
        .pp-topbar.scrolled{border-bottom-color:rgba(168,85,247,0.3)}
        .pp-content{flex:1;overflow-y:auto;padding:40px 52px 60px;max-width:860px}
        .pp-hero{margin-bottom:48px;animation:fadeUp 0.6s ease both}
        .pp-hero-label{font-family:'Fira Code',monospace;font-size:11px;color:#c084fc;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px}
        .pp-hero-title{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,48px);font-weight:800;color:#f0eeff;line-height:1.1;margin-bottom:16px}
        .pp-hero-sub{font-size:14px;color:#7b7a9a;line-height:1.8;max-width:560px}
        .pp-meta-row{display:flex;gap:24px;margin-top:20px;flex-wrap:wrap}
        .pp-meta{font-size:12px;color:#4a4a6a;font-family:'Fira Code',monospace}
        .pp-meta span{color:#c084fc}
        .pp-section{margin-bottom:48px;animation:fadeUp 0.5s ease both}
        .pp-section-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(130,80,255,0.1)}
        .pp-section-icon{width:38px;height:38px;border-radius:10px;background:rgba(124,58,237,0.1);border:1px solid rgba(168,85,247,0.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .pp-section-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#f0eeff}
        .pp-text{font-size:14px;color:#7b7a9a;line-height:1.9;margin-bottom:16px}
        .pp-text a{color:#c084fc;text-decoration:none}
        .pp-text a:hover{text-decoration:underline}
        .pp-list{margin:12px 0 16px 0;display:flex;flex-direction:column;gap:8px}
        .pp-list-item{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#7b7a9a;line-height:1.7}
        .pp-list-dot{width:6px;height:6px;border-radius:50%;background:#a855f7;flex-shrink:0;margin-top:8px}
        .pp-card{padding:18px 20px;border-radius:12px;background:rgba(124,58,237,0.05);border:1px solid rgba(168,85,247,0.15);margin:16px 0}
        .pp-card-title{font-family:'Fira Code',monospace;font-size:11px;color:#c084fc;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}
        .pp-highlight{color:#c084fc;font-weight:500}
        .pp-table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
        .pp-table th{text-align:left;padding:10px 14px;background:rgba(124,58,237,0.08);color:#c084fc;font-family:'Fira Code',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid rgba(130,80,255,0.2)}
        .pp-table td{padding:10px 14px;color:#7b7a9a;border-bottom:1px solid rgba(130,80,255,0.07);line-height:1.6}
        .pp-table tr:last-child td{border-bottom:none}
        .pp-back-btn{display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:9px;background:#18182a;border:1px solid rgba(130,80,255,0.2);color:#7b7a9a;font-size:13px;font-weight:500;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.18s}
        .pp-back-btn:hover{border-color:rgba(168,85,247,0.4);color:#f0eeff}
        .pp-contact-box{padding:22px 24px;border-radius:14px;background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(168,85,247,0.04));border:1px solid rgba(168,85,247,0.2);margin-top:16px}
        @media(max-width:768px){
          .pp-sidebar{display:none}
          .pp-content{padding:24px 20px 40px}
          .pp-wrap{display:block;height:auto;overflow:auto}
          .pp-main{height:100vh;overflow-y:auto}
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="pp-wrap" style={{ position: "relative", zIndex: 1 }}>
        {/* Sidebar TOC */}
        <aside className="pp-sidebar">
          <div className="pp-sidebar-top">
            <div className="pp-logo" onClick={() => onNavigate("home")}>
              <div className="pp-logo-icon">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span className="pp-logo-text">Nexus</span>
            </div>
            <div className="pp-badge">🛡 Privacy Policy</div>
          </div>
          <nav className="pp-nav">
            <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code',monospace", letterSpacing: 2, textTransform: "uppercase", padding: "10px 12px 6px" }}>Contents</div>
            {SECTIONS.map(s => (
              <div key={s.id} className={`pp-nav-item ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                <span className="pp-nav-icon">{s.icon}</span>
                {s.title}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="pp-main">
          <header className={`pp-topbar ${scrolled ? "scrolled" : ""}`}>
            <button className="pp-back-btn" onClick={() => onNavigate("home")}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
              Back to Home
            </button>
            <div style={{ fontSize: 12, color: "#4a4a6a", fontFamily: "'Fira Code',monospace" }}>Last updated: February 2026</div>
          </header>

          <div className="pp-content" ref={contentRef}>
            <div className="pp-hero">
              <div className="pp-hero-label">Legal · Privacy</div>
              <h1 className="pp-hero-title">Privacy Policy</h1>
              <p className="pp-hero-sub">At Nexus, we believe your personal data belongs to you. This policy explains exactly what we collect, why we collect it, and how you can control it.</p>
              <div className="pp-meta-row">
                <div className="pp-meta">Effective: <span>January 1, 2026</span></div>
                <div className="pp-meta">Last Updated: <span>February 21, 2026</span></div>
                <div className="pp-meta">Version: <span>3.1</span></div>
              </div>
            </div>

            {/* 1. Overview */}
            <div data-section="overview" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">🛡</div>
                <h2 className="pp-section-title">Overview</h2>
              </div>
              <p className="pp-text">Nexus ("we", "us", "our") operates a peer-to-peer marketplace platform that enables users ("Sellers") to list products and services and enables other users ("Buyers") to discover and purchase them. This Privacy Policy applies to all users of nexus.io and any associated mobile applications or services.</p>
              <p className="pp-text">By accessing or using Nexus, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the platform immediately.</p>
              <div className="pp-card">
                <div className="pp-card-title">Scope of this Policy</div>
                <div className="pp-list">
                  {["This policy covers all data collected through nexus.io and our mobile apps","It applies to all registered users, visitors, sellers, and buyers","Third-party websites linked from our platform have their own privacy policies","This policy does not cover data you voluntarily make public in your listings"].map(t => (
                    <div key={t} className="pp-list-item"><div className="pp-list-dot"/>{t}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Data We Collect */}
            <div data-section="collection" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">📊</div>
                <h2 className="pp-section-title">Data We Collect</h2>
              </div>
              <p className="pp-text">We collect data in three ways: information you provide directly, information generated by your use of the platform, and information from third-party sources.</p>

              <div className="pp-card">
                <div className="pp-card-title">Information You Provide</div>
                <div className="pp-list">
                  {[
                    "Account information: full name, email address, password (hashed), phone number",
                    "Profile data: profile photo, bio, location (city/country level), member since date",
                    "Seller information: business name, bank/payment account details (processed by Stripe), government-issued ID for verification",
                    "Listing data: product titles, descriptions, photos, pricing, category, location, condition",
                    "Communications: messages sent to other users, support tickets, reviews and ratings you write",
                    "Preferences: saved searches, notification settings, display preferences",
                  ].map(t => <div key={t} className="pp-list-item"><div className="pp-list-dot"/>{t}</div>)}
                </div>
              </div>

              <div className="pp-card">
                <div className="pp-card-title">Automatically Collected Data</div>
                <div className="pp-list">
                  {[
                    "Device information: IP address, browser type, operating system, device identifiers",
                    "Usage data: pages visited, time spent, clicks, scrolls, searches performed, products viewed",
                    "Transaction data: purchase history, saved items, items listed, price history",
                    "Location data: approximate geographic location derived from IP address",
                    "Log data: server logs including timestamps, errors, and API calls",
                    "Cookie and tracking data: see our Cookies section for full details",
                  ].map(t => <div key={t} className="pp-list-item"><div className="pp-list-dot"/>{t}</div>)}
                </div>
              </div>

              <div className="pp-card">
                <div className="pp-card-title">Data from Third Parties</div>
                <div className="pp-list">
                  {[
                    "Social login providers (Google, Apple): name, email, profile photo if you use social login",
                    "Payment processors (Stripe): transaction confirmation, fraud signals",
                    "Identity verification providers: verification status only — we do not store raw ID documents",
                    "Analytics partners: aggregated demographic and interest data",
                  ].map(t => <div key={t} className="pp-list-item"><div className="pp-list-dot"/>{t}</div>)}
                </div>
              </div>
            </div>

            {/* 3. How We Use Data */}
            <div data-section="usage" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">⚙️</div>
                <h2 className="pp-section-title">How We Use Your Data</h2>
              </div>
              <table className="pp-table">
                <thead>
                  <tr><th>Purpose</th><th>Legal Basis</th><th>Data Used</th></tr>
                </thead>
                <tbody>
                  {[
                    ["Provide and operate the marketplace", "Contract performance", "Account, listing, transaction data"],
                    ["Personalize product recommendations", "Legitimate interest / Consent", "Browsing history, saved items, searches"],
                    ["Show relevant ads and promoted listings", "Consent", "Browsing behaviour, cookie data"],
                    ["Fraud detection and platform safety", "Legitimate interest", "IP, device, transaction patterns"],
                    ["Seller verification and trust", "Legal obligation", "Identity documents, transaction history"],
                    ["Sending transactional emails", "Contract performance", "Email address, transaction data"],
                    ["Sending marketing communications", "Consent", "Email, preferences, purchase history"],
                    ["Analytics and product improvement", "Legitimate interest", "Anonymised usage data"],
                    ["Compliance with law", "Legal obligation", "Any data required by applicable law"],
                  ].map(([p, l, d]) => (
                    <tr key={p}><td style={{ color: "#c084fc", fontWeight: 500 }}>{p}</td><td>{l}</td><td style={{ fontSize: 12 }}>{d}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="pp-text">We will never sell your personal data to third parties for their own marketing purposes. We do not use your data for automated decision-making that produces significant legal effects without human review.</p>
            </div>

            {/* 4. Cookies */}
            <div data-section="cookies" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">🍪</div>
                <h2 className="pp-section-title">Cookies & Tracking</h2>
              </div>
              <p className="pp-text">We use cookies and similar tracking technologies to personalise your experience, remember your preferences, understand how you use our platform, and show you products we think you'll love. You can manage your cookie preferences at any time via our Cookie Settings panel.</p>

              <table className="pp-table">
                <thead>
                  <tr><th>Cookie Type</th><th>Purpose</th><th>Duration</th><th>Required</th></tr>
                </thead>
                <tbody>
                  {[
                    ["Essential / Session", "Login state, CSRF protection, shopping cart", "Session", "Yes"],
                    ["Functional", "Language, currency, display preferences", "1 year", "No"],
                    ["Analytics (1st party)", "Page views, click paths, feature usage", "2 years", "No"],
                    ["Analytics (3rd party)", "Google Analytics, Mixpanel behaviour tracking", "2 years", "No"],
                    ["Personalisation", "Product recommendations based on browsing", "6 months", "No"],
                    ["Advertising", "Targeted ads, retargeting on partner networks", "90 days", "No"],
                    ["A/B Testing", "Feature experiments and interface tests", "30 days", "No"],
                  ].map(([t, p, d, r]) => (
                    <tr key={t}><td style={{ color: "#c084fc", fontWeight: 500 }}>{t}</td><td>{p}</td><td style={{ fontFamily: "'Fira Code',monospace", fontSize: 12 }}>{d}</td><td style={{ color: r === "Yes" ? "#34d399" : "#7b7a9a" }}>{r}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="pp-text">You may disable non-essential cookies through your browser settings or our Cookie Preferences centre. Note that disabling certain cookies may affect platform functionality such as personalised recommendations and saved preferences.</p>
            </div>

            {/* 5. Data Sharing */}
            <div data-section="sharing" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">🔗</div>
                <h2 className="pp-section-title">Data Sharing</h2>
              </div>
              <p className="pp-text">We do not sell your personal data. We share data only in the limited circumstances described below, and always with appropriate data protection agreements in place.</p>
              <div className="pp-list">
                {[
                  "Between Buyers and Sellers: When a transaction occurs, limited contact information (name, delivery address) is shared with the relevant seller to fulfil the order.",
                  "Payment processors: Stripe processes payment data on our behalf under strict PCI-DSS compliance. We only receive transaction status and a payment token.",
                  "Analytics providers: We share anonymised, aggregated usage data with Google Analytics and Mixpanel. These providers are contractually prohibited from using the data for their own purposes.",
                  "Identity verification: For seller verification, identity documents are passed to our verification partner (Jumio) who returns only a pass/fail result to us.",
                  "Law enforcement: We may disclose information when legally required by court order, subpoena, or applicable law. We will notify you unless legally prohibited from doing so.",
                  "Business transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity subject to equivalent privacy protections.",
                  "Safety and fraud prevention: We may share data with security partners and law enforcement to prevent illegal activities, fraud, or threats to user safety.",
                ].map(t => <div key={t} className="pp-list-item"><div className="pp-list-dot"/>{t}</div>)}
              </div>
            </div>

            {/* 6. Retention */}
            <div data-section="retention" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">🗃</div>
                <h2 className="pp-section-title">Data Retention</h2>
              </div>
              <p className="pp-text">We retain your data for as long as necessary to provide our services and comply with legal obligations.</p>
              <table className="pp-table">
                <thead><tr><th>Data Category</th><th>Retention Period</th></tr></thead>
                <tbody>
                  {[
                    ["Active account data", "Duration of account + 30 days after deletion request"],
                    ["Transaction records", "7 years (legal / tax compliance)"],
                    ["Support communications", "3 years"],
                    ["Review and rating data", "5 years or until account deletion"],
                    ["Marketing preferences", "Until withdrawn consent + 30 days"],
                    ["Server and access logs", "90 days"],
                    ["Fraud detection signals", "5 years"],
                    ["Cookie and analytics data", "Up to 2 years (per cookie type)"],
                  ].map(([c, r]) => <tr key={c}><td style={{ color: "#c084fc" }}>{c}</td><td>{r}</td></tr>)}
                </tbody>
              </table>
              <p className="pp-text">When data is no longer required, it is securely deleted or anonymised. You may request early deletion of your data subject to legal retention requirements.</p>
            </div>

            {/* 7. Your Rights */}
            <div data-section="rights" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">⚖️</div>
                <h2 className="pp-section-title">Your Rights</h2>
              </div>
              <p className="pp-text">Depending on your location, you have various rights under applicable data protection law (GDPR, CCPA, UK GDPR, PIPEDA, and others).</p>
              <div className="pp-list">
                {[
                  "Right to Access — Request a copy of all personal data we hold about you.",
                  "Right to Rectification — Correct any inaccurate or incomplete personal data.",
                  "Right to Erasure ('Right to be Forgotten') — Request deletion of your data where we have no legal obligation to retain it.",
                  "Right to Portability — Receive your data in a structured, machine-readable format.",
                  "Right to Restrict Processing — Ask us to limit how we use your data while a dispute is resolved.",
                  "Right to Object — Object to processing based on legitimate interest or for direct marketing purposes.",
                  "Right to Withdraw Consent — Withdraw consent for any data processing activity at any time without affecting the lawfulness of prior processing.",
                  "Right not to be subject to Automated Decision-Making — Request human review of any significant automated decision.",
                  "California Residents (CCPA) — You have the right to know, delete, opt-out of sale, and non-discrimination.",
                ].map(t => <div key={t} className="pp-list-item"><div className="pp-list-dot"/>{t}</div>)}
              </div>
              <p className="pp-text">To exercise any of these rights, contact our Privacy Team at <a href="mailto:privacy@nexus.io">privacy@nexus.io</a>. We will respond within 30 days (or 45 days where permitted by law).</p>
            </div>

            {/* 8. Security */}
            <div data-section="security" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">🔒</div>
                <h2 className="pp-section-title">Security</h2>
              </div>
              <p className="pp-text">We implement industry-standard security measures to protect your data against unauthorised access, alteration, disclosure, or destruction.</p>
              <div className="pp-list">
                {[
                  "All data in transit is encrypted using TLS 1.3.",
                  "Data at rest is encrypted using AES-256.",
                  "Passwords are hashed using bcrypt with a unique salt.",
                  "Payment data is processed by Stripe and never stored on our servers.",
                  "We conduct regular penetration testing and third-party security audits.",
                  "Access to production systems is restricted to authorised personnel with multi-factor authentication.",
                  "We operate a vulnerability disclosure programme. Report issues to security@nexus.io.",
                ].map(t => <div key={t} className="pp-list-item"><div className="pp-list-dot"/>{t}</div>)}
              </div>
              <p className="pp-text">In the event of a data breach that is likely to result in risk to your rights and freedoms, we will notify you within 72 hours of becoming aware of it, in line with applicable regulations.</p>
            </div>

            {/* 9. Children */}
            <div data-section="children" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">👶</div>
                <h2 className="pp-section-title">Children's Privacy</h2>
              </div>
              <p className="pp-text">Nexus is not directed at children under the age of 16 (or 13 in jurisdictions where COPPA applies). We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us immediately at <a href="mailto:privacy@nexus.io">privacy@nexus.io</a> and we will take steps to delete such information promptly.</p>
            </div>

            {/* 10. Updates */}
            <div data-section="updates" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">📋</div>
                <h2 className="pp-section-title">Policy Updates</h2>
              </div>
              <p className="pp-text">We may update this Privacy Policy periodically to reflect changes in our practices, legal requirements, or platform features. When we make material changes, we will notify you by email (if you have an account) and by displaying a prominent notice on the platform at least 14 days before the changes take effect. Continued use of Nexus after changes take effect constitutes acceptance of the updated policy.</p>
              <p className="pp-text">We maintain a version history of all past policies. To request a copy of a previous version, contact <a href="mailto:privacy@nexus.io">privacy@nexus.io</a>.</p>
            </div>

            {/* 11. Contact */}
            <div data-section="contact" className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">✉️</div>
                <h2 className="pp-section-title">Contact Us</h2>
              </div>
              <p className="pp-text">For privacy-related enquiries, rights requests, or complaints, contact our Data Protection Officer:</p>
              <div className="pp-contact-box">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Privacy Email", value: "privacy@nexus.io" },
                    { label: "DPO Email", value: "dpo@nexus.io" },
                    { label: "General Contact", value: "onemore9414@gmail.com" },
                    { label: "Response Time", value: "Within 30 days" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code',monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 13, color: "#c084fc" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="pp-text" style={{ marginTop: 16 }}>If you are unsatisfied with our response, you have the right to lodge a complaint with your local data protection authority (e.g., ICO in the UK, CNIL in France, or your relevant national authority).</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}