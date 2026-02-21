import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "intro", title: "Introduction", icon: "📜" },
  { id: "eligibility", title: "Eligibility", icon: "✅" },
  { id: "accounts", title: "Accounts", icon: "👤" },
  { id: "sellers", title: "Seller Rules", icon: "🏪" },
  { id: "buyers", title: "Buyer Rules", icon: "🛒" },
  { id: "prohibited", title: "Prohibited Content", icon: "🚫" },
  { id: "fees", title: "Fees & Payments", icon: "💳" },
  { id: "disputes", title: "Disputes", icon: "⚖️" },
  { id: "ip", title: "Intellectual Property", icon: "©️" },
  { id: "liability", title: "Liability", icon: "🔐" },
  { id: "termination", title: "Termination", icon: "❌" },
  { id: "governing", title: "Governing Law", icon: "🌍" },
  { id: "contact", title: "Contact", icon: "✉️" },
];

export default function TermsOfService({ onNavigate }: { onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void }) {
  const [activeSection, setActiveSection] = useState("intro");
  const [scrolled, setScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = () => {
      setScrolled(el.scrollTop > 40);
      el.querySelectorAll("[data-section]").forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top < 200 && rect.bottom > 80) setActiveSection(s.getAttribute("data-section") || "");
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => contentRef.current?.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;background:#08080f;color:#f0eeff;font-family:'Outfit',sans-serif}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111120}::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.4);border-radius:10px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 12px rgba(124,58,237,0.3)}50%{box-shadow:0 0 28px rgba(124,58,237,0.6)}}
        .tos-wrap{display:flex;height:100vh;overflow:hidden;background:#08080f;position:relative}
        .tos-sidebar{width:260px;flex-shrink:0;background:#0d0d18;border-right:1px solid rgba(130,80,255,0.14);display:flex;flex-direction:column;overflow:hidden}
        .tos-sidebar-top{padding:24px 20px 20px;border-bottom:1px solid rgba(130,80,255,0.1)}
        .tos-logo{display:flex;align-items:center;gap:10px;margin-bottom:20px;cursor:pointer}
        .tos-logo-icon{width:34px;height:34px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:10px;display:flex;align-items:center;justify-content:center;animation:pulse 3s ease-in-out infinite;flex-shrink:0}
        .tos-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);font-size:11px;color:#fbbf24;font-family:'Fira Code',monospace}
        .tos-nav{flex:1;overflow-y:auto;padding:12px 10px}
        .tos-nav-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:500;color:#7b7a9a;transition:all 0.18s;border:1px solid transparent;margin-bottom:2px}
        .tos-nav-item:hover{background:rgba(245,158,11,0.06);color:#f0eeff;border-color:rgba(245,158,11,0.15)}
        .tos-nav-item.active{background:rgba(245,158,11,0.1);color:#fbbf24;border-color:rgba(245,158,11,0.25)}
        .tos-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .tos-topbar{height:60px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:rgba(8,8,15,0.9);border-bottom:1px solid rgba(130,80,255,0.14);backdrop-filter:blur(16px)}
        .tos-content{flex:1;overflow-y:auto;padding:40px 52px 60px;max-width:860px}
        .tos-hero{margin-bottom:48px;animation:fadeUp 0.6s ease both}
        .tos-label{font-family:'Fira Code',monospace;font-size:11px;color:#fbbf24;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px}
        .tos-title{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,48px);font-weight:800;color:#f0eeff;line-height:1.1;margin-bottom:16px}
        .tos-sub{font-size:14px;color:#7b7a9a;line-height:1.8;max-width:560px}
        .tos-section{margin-bottom:48px;animation:fadeUp 0.5s ease both}
        .tos-section-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(245,158,11,0.1)}
        .tos-section-icon{width:38px;height:38px;border-radius:10px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .tos-section-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#f0eeff}
        .tos-text{font-size:14px;color:#7b7a9a;line-height:1.9;margin-bottom:16px}
        .tos-text a{color:#fbbf24;text-decoration:none}
        .tos-list{margin:12px 0 16px;display:flex;flex-direction:column;gap:8px}
        .tos-list-item{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#7b7a9a;line-height:1.7}
        .tos-dot{width:6px;height:6px;border-radius:50%;background:#f59e0b;flex-shrink:0;margin-top:8px}
        .tos-card{padding:18px 20px;border-radius:12px;background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.15);margin:16px 0}
        .tos-card-title{font-family:'Fira Code',monospace;font-size:11px;color:#fbbf24;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}
        .tos-warning{padding:16px 18px;border-radius:12px;background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.2);margin:16px 0;font-size:13px;color:#f87171;line-height:1.7}
        .tos-table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
        .tos-table th{text-align:left;padding:10px 14px;background:rgba(245,158,11,0.07);color:#fbbf24;font-family:'Fira Code',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid rgba(245,158,11,0.15)}
        .tos-table td{padding:10px 14px;color:#7b7a9a;border-bottom:1px solid rgba(130,80,255,0.07);line-height:1.6}
        .tos-back-btn{display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:9px;background:#18182a;border:1px solid rgba(130,80,255,0.2);color:#7b7a9a;font-size:13px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.18s}
        .tos-back-btn:hover{border-color:rgba(168,85,247,0.4);color:#f0eeff}
        .tos-contact-box{padding:22px 24px;border-radius:14px;background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(124,58,237,0.04));border:1px solid rgba(245,158,11,0.18);margin-top:16px}
        @media(max-width:768px){
          .tos-sidebar{display:none}
          .tos-content{padding:24px 20px 40px}
          .tos-wrap{display:block;height:auto}
          .tos-main{height:100vh;overflow-y:auto}
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(245,158,11,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="tos-wrap" style={{ position: "relative", zIndex: 1 }}>
        <aside className="tos-sidebar">
          <div className="tos-sidebar-top">
            <div className="tos-logo" onClick={() => onNavigate("home")}>
              <div className="tos-logo-icon">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 18 }}>Nexus</span>
            </div>
            <div className="tos-badge">📜 Terms of Service</div>
          </div>
          <nav className="tos-nav">
            <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code',monospace", letterSpacing: 2, textTransform: "uppercase", padding: "10px 12px 6px" }}>Contents</div>
            {SECTIONS.map(s => (
              <div key={s.id} className={`tos-nav-item ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                <span style={{ fontSize: 14 }}>{s.icon}</span>{s.title}
              </div>
            ))}
          </nav>
        </aside>

        <div className="tos-main">
          <header className="tos-topbar">
            <button className="tos-back-btn" onClick={() => onNavigate("home")}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
              Back to Home
            </button>
            <div style={{ fontSize: 12, color: "#4a4a6a", fontFamily: "'Fira Code',monospace" }}>Effective: January 1, 2026</div>
          </header>

          <div className="tos-content" ref={contentRef}>
            <div className="tos-hero">
              <div className="tos-label">Legal · Terms</div>
              <h1 className="tos-title">Terms of Service</h1>
              <p className="tos-sub">Please read these Terms carefully before using Nexus. By accessing or using our platform, you agree to be legally bound by these Terms.</p>
              <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
                {[["Version","4.0"],["Effective","Jan 1, 2026"],["Updated","Feb 21, 2026"]].map(([l,v])=>(
                  <div key={l} style={{ fontSize: 12, color: "#4a4a6a", fontFamily: "'Fira Code',monospace" }}>{l}: <span style={{ color: "#fbbf24" }}>{v}</span></div>
                ))}
              </div>
            </div>

            {/* 1. Introduction */}
            <div data-section="intro" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">📜</div><h2 className="tos-section-title">Introduction</h2></div>
              <p className="tos-text">Welcome to Nexus. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and Nexus Technologies Ltd. ("Nexus", "we", "us") governing your access to and use of the Nexus marketplace platform available at nexus.io and our associated mobile applications and services (collectively, the "Platform").</p>
              <p className="tos-text">Nexus operates a peer-to-peer online marketplace that enables registered sellers to list items for sale and registered buyers to purchase them. We are a marketplace operator and are not a party to any transaction between buyers and sellers.</p>
              <div className="tos-warning">⚠️ By creating an account or using the Platform in any capacity, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, do not use the Platform.</div>
            </div>

            {/* 2. Eligibility */}
            <div data-section="eligibility" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">✅</div><h2 className="tos-section-title">Eligibility</h2></div>
              <p className="tos-text">To use Nexus, you must meet the following requirements:</p>
              <div className="tos-list">
                {["Be at least 18 years of age, or the age of legal majority in your jurisdiction, whichever is higher","Have the legal capacity to enter into binding contracts in your jurisdiction","Not be barred from using the Platform under applicable law","Not have a previously terminated Nexus account unless expressly permitted by Nexus","If acting on behalf of a business, have authority to bind that business to these Terms"].map(t=><div key={t} className="tos-list-item"><div className="tos-dot"/>{t}</div>)}
              </div>
              <p className="tos-text">Users under 18 may not register. If we discover a user is under 18, the account will be immediately terminated and any funds held will be refunded according to our standard refund policy.</p>
            </div>

            {/* 3. Accounts */}
            <div data-section="accounts" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">👤</div><h2 className="tos-section-title">Accounts</h2></div>
              <div className="tos-list">
                {[
                  "You must provide accurate, current, and complete information when creating your account.",
                  "You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
                  "You must notify us immediately at security@nexus.io if you suspect unauthorised access to your account.",
                  "You may not share, sell, transfer, or sublicense your account to any third party.",
                  "One natural person or legal entity may maintain only one account. Duplicate accounts may be terminated.",
                  "We reserve the right to require identity verification at any time to maintain platform integrity.",
                  "Account usernames may not impersonate individuals, brands, or organisations.",
                ].map(t=><div key={t} className="tos-list-item"><div className="tos-dot"/>{t}</div>)}
              </div>
            </div>

            {/* 4. Seller Rules */}
            <div data-section="sellers" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">🏪</div><h2 className="tos-section-title">Seller Rules & Obligations</h2></div>
              <p className="tos-text">As a Seller on Nexus, you are directly responsible for the items you list and the transactions you conduct. By listing an item, you represent and warrant that:</p>
              <div className="tos-card">
                <div className="tos-card-title">Listing Standards</div>
                <div className="tos-list">
                  {[
                    "You have legal title to or the right to sell the listed item",
                    "All descriptions, photographs, and details are accurate and not misleading",
                    "The item is as described in terms of condition, specifications, and provenance",
                    "Pricing is clearly stated in the advertised currency with applicable taxes disclosed",
                    "You will honour all confirmed transactions at the listed price",
                    "Listings do not violate the intellectual property rights of any third party",
                    "Digital goods are fully functional and licences are legitimately transferable",
                  ].map(t=><div key={t} className="tos-list-item"><div className="tos-dot"/>{t}</div>)}
                </div>
              </div>
              <div className="tos-card">
                <div className="tos-card-title">Seller Obligations</div>
                <div className="tos-list">
                  {[
                    "Despatch items within the stated handling time after payment confirmation",
                    "Provide tracking information for physical goods where available",
                    "Respond to buyer messages within 48 hours",
                    "Handle returns and refunds in accordance with your stated returns policy and applicable consumer law",
                    "Maintain sufficient stock for listed quantities",
                    "Pay all applicable taxes on sales proceeds — Nexus does not collect or remit taxes on your behalf (except where legally required)",
                    "Maintain a minimum seller rating of 3.5 or higher to keep your listing privileges",
                  ].map(t=><div key={t} className="tos-list-item"><div className="tos-dot"/>{t}</div>)}
                </div>
              </div>
            </div>

            {/* 5. Buyer Rules */}
            <div data-section="buyers" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">🛒</div><h2 className="tos-section-title">Buyer Rules & Obligations</h2></div>
              <div className="tos-list">
                {[
                  "Buyers must complete payment promptly once an order is confirmed.",
                  "Buyers must review all listing details carefully before purchase — all sales are subject to the seller's stated return policy.",
                  "Buyers may not misuse the returns or disputes process. Fraudulent claims will result in account termination.",
                  "Buyers must not attempt to circumvent Nexus's platform fees by conducting off-platform transactions with sellers they discovered through Nexus.",
                  "Buyers are responsible for verifying that items are legal to import or purchase in their jurisdiction.",
                  "Chargebacks initiated without first using Nexus's dispute resolution process may result in account suspension.",
                ].map(t=><div key={t} className="tos-list-item"><div className="tos-dot"/>{t}</div>)}
              </div>
            </div>

            {/* 6. Prohibited */}
            <div data-section="prohibited" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">🚫</div><h2 className="tos-section-title">Prohibited Content & Activities</h2></div>
              <p className="tos-text">The following categories of items and activities are strictly prohibited on Nexus. Violations will result in immediate account termination and may be reported to law enforcement:</p>
              <div className="tos-list">
                {[
                  "Illegal items, controlled substances, prescription drugs, or items that require government licensing to sell",
                  "Weapons, firearms, ammunition, or explosives (or instructions for creating them)",
                  "Counterfeit, replica, or unauthorised reproductions of branded goods",
                  "Stolen goods or goods acquired through fraudulent means",
                  "Content that infringes copyright, trademark, patents, or other intellectual property rights",
                  "Adult content, pornographic material, or sexually explicit content",
                  "Items or services that promote hate speech, discrimination, or violence",
                  "Phishing, malware, or any software designed to damage or gain unauthorised access to systems",
                  "Human trafficking, exploitation, or services of a sexual nature",
                  "Financial instruments, securities, or investment products without appropriate regulatory authorisation",
                  "Pyramid schemes, multi-level marketing schemes, or other fraudulent business models",
                  "Live animals or endangered species products (per CITES regulations)",
                  "Tobacco, alcohol, or age-restricted products where listings would violate applicable laws",
                  "Any attempt to manipulate reviews, ratings, or search rankings through inauthentic means",
                ].map(t=><div key={t} className="tos-list-item"><div className="tos-dot"/>{t}</div>)}
              </div>
            </div>

            {/* 7. Fees */}
            <div data-section="fees" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">💳</div><h2 className="tos-section-title">Fees & Payments</h2></div>
              <table className="tos-table">
                <thead><tr><th>Fee Type</th><th>Amount</th><th>Applies To</th></tr></thead>
                <tbody>
                  {[
                    ["Listing Fee","Free for first 50 listings/month; $0.25 per additional listing","All sellers"],
                    ["Transaction Fee","5% of sale price (excluding shipping)","All completed sales"],
                    ["Payment Processing","2.9% + $0.30 per transaction (via Stripe)","All payments"],
                    ["Promoted Listings","From $1.99/day per listing","Optional seller upgrade"],
                    ["Seller Verification Badge","$9.99 one-time fee","Optional"],
                    ["Dispute Resolution","Free","Buyers and Sellers"],
                    ["Withdrawal Fee","Free (bank transfer); 1.5% (PayPal)","Sellers withdrawing funds"],
                  ].map(([f,a,p])=><tr key={f}><td style={{color:"#fbbf24",fontWeight:500}}>{f}</td><td>{a}</td><td style={{fontSize:12}}>{p}</td></tr>)}
                </tbody>
              </table>
              <p className="tos-text">Fees are subject to change with 30 days notice. Continued use after a fee change constitutes acceptance of the new fee schedule. All fees are non-refundable unless stated otherwise. Nexus reserves the right to withhold funds pending investigation of suspected fraud or policy violations.</p>
            </div>

            {/* 8. Disputes */}
            <div data-section="disputes" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">⚖️</div><h2 className="tos-section-title">Dispute Resolution</h2></div>
              <p className="tos-text">We encourage buyers and sellers to resolve disputes directly in the first instance. If direct resolution fails, Nexus offers a structured dispute resolution process:</p>
              <div className="tos-list">
                {[
                  "Step 1: Open a dispute within 30 days of the expected delivery date via the Order Dashboard.",
                  "Step 2: Both parties have 5 business days to provide evidence (photos, messages, tracking).",
                  "Step 3: Nexus mediators review all evidence and issue a binding decision within 10 business days.",
                  "Step 4: Funds are released to the prevailing party within 3 business days of the decision.",
                  "Nexus decisions on disputes are final for transactions under $2,500. Larger disputes may be escalated to binding arbitration.",
                ].map(t=><div key={t} className="tos-list-item"><div className="tos-dot"/>{t}</div>)}
              </div>
              <p className="tos-text">For disputes exceeding $2,500, or disputes involving platform conduct (not seller/buyer conduct), either party may initiate binding arbitration under the rules of the American Arbitration Association. Class action waivers apply to the maximum extent permitted by law.</p>
            </div>

            {/* 9. IP */}
            <div data-section="ip" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">©️</div><h2 className="tos-section-title">Intellectual Property</h2></div>
              <p className="tos-text">The Nexus platform, including its design, code, trademarks, logos, and proprietary content, is owned by Nexus Technologies Ltd. and protected by applicable IP laws. You are granted a limited, non-exclusive, non-transferable licence to access and use the Platform for its intended purposes only.</p>
              <p className="tos-text">By uploading content (photos, descriptions, reviews) to Nexus, you grant Nexus a worldwide, royalty-free, sub-licensable licence to use, display, reproduce, and distribute that content for the purposes of operating and promoting the Platform. This licence ends when your content is removed, unless it has been shared by others. You retain all ownership of your content.</p>
            </div>

            {/* 10. Liability */}
            <div data-section="liability" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">🔐</div><h2 className="tos-section-title">Limitation of Liability</h2></div>
              <div className="tos-warning">⚠️ Nexus is a marketplace operator. We are not a buyer or seller and are not responsible for the quality, safety, legality, or availability of any item listed on the platform.</div>
              <p className="tos-text">To the maximum extent permitted by applicable law, Nexus shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Platform, even if Nexus has been advised of the possibility of such damages.</p>
              <p className="tos-text">Our aggregate liability to any user for any claims arising from use of the Platform shall not exceed the greater of: (a) the total fees paid by you to Nexus in the 12 months preceding the claim, or (b) $100. Nothing in these Terms excludes liability for fraud, gross negligence, or death/personal injury caused by negligence.</p>
            </div>

            {/* 11. Termination */}
            <div data-section="termination" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">❌</div><h2 className="tos-section-title">Termination</h2></div>
              <p className="tos-text">You may close your account at any time from your Account Settings. Nexus may suspend or terminate your account with immediate effect if you violate these Terms, engage in fraudulent activity, or if required by applicable law. Upon termination:</p>
              <div className="tos-list">
                {[
                  "Your access to the Platform will be revoked immediately.",
                  "Active listings will be removed within 24 hours.",
                  "Funds owed to you (net of applicable fees and chargebacks) will be paid within 14 days.",
                  "Funds held in escrow for open transactions will be handled according to the dispute resolution process.",
                  "Sections of these Terms that by their nature should survive termination (including liability, IP, and dispute resolution) shall continue to apply.",
                ].map(t=><div key={t} className="tos-list-item"><div className="tos-dot"/>{t}</div>)}
              </div>
            </div>

            {/* 12. Governing */}
            <div data-section="governing" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">🌍</div><h2 className="tos-section-title">Governing Law</h2></div>
              <p className="tos-text">These Terms are governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law principles. For users in the European Union, applicable mandatory consumer protection laws of your country of residence also apply. For users in the United States, where arbitration applies, the Federal Arbitration Act governs.</p>
              <p className="tos-text">Subject to the arbitration provisions above, the courts of England and Wales shall have exclusive jurisdiction to resolve any dispute. Notwithstanding this, Nexus reserves the right to seek injunctive or other equitable relief in any jurisdiction.</p>
            </div>

            {/* 13. Contact */}
            <div data-section="contact" className="tos-section">
              <div className="tos-section-header"><div className="tos-section-icon">✉️</div><h2 className="tos-section-title">Contact</h2></div>
              <p className="tos-text">For questions about these Terms, please contact our Legal Team:</p>
              <div className="tos-contact-box">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[["Legal Email","legal@nexus.io"],["General Email","onemore9414@gmail.com"],["Platform","nexus.io"],["Response Time","Within 5 business days"]].map(([l,v])=>(
                    <div key={l}>
                      <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code',monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{l}</div>
                      <div style={{ fontSize: 13, color: "#fbbf24" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}