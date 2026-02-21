import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "what", title: "What Are Cookies", icon: "🍪" },
  { id: "why", title: "Why We Use Cookies", icon: "🎯" },
  { id: "types", title: "Types We Use", icon: "📊" },
  { id: "third", title: "Third-Party Cookies", icon: "🔗" },
  { id: "manage", title: "Managing Cookies", icon: "⚙️" },
  { id: "impact", title: "Impact of Disabling", icon: "⚠️" },
  { id: "updates", title: "Policy Updates", icon: "📋" },
  { id: "contact", title: "Contact", icon: "✉️" },
];

export default function CookiesPolicy({ onNavigate }: { onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void }) {
  const [activeSection, setActiveSection] = useState("what");
  const contentRef = useRef<HTMLDivElement>(null);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({ functional: true, analytics: false, personalisation: false, advertising: false });

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = () => {
      el.querySelectorAll("[data-section]").forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top < 200 && rect.bottom > 80) setActiveSection(s.getAttribute("data-section") || "");
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => contentRef.current?.querySelector(`[data-section="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const toggle = (key: string) => setAccepted(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Outfit:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;background:#08080f;color:#f0eeff;font-family:'Outfit',sans-serif}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111120}::-webkit-scrollbar-thumb{background:rgba(52,211,153,0.4);border-radius:10px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 12px rgba(52,211,153,0.3)}50%{box-shadow:0 0 28px rgba(52,211,153,0.6)}}
        .ck-wrap{display:flex;height:100vh;overflow:hidden;background:#08080f}
        .ck-sidebar{width:260px;flex-shrink:0;background:#0d0d18;border-right:1px solid rgba(52,211,153,0.1);display:flex;flex-direction:column}
        .ck-sidebar-top{padding:24px 20px 20px;border-bottom:1px solid rgba(52,211,153,0.1)}
        .ck-logo{display:flex;align-items:center;gap:10px;margin-bottom:20px;cursor:pointer}
        .ck-logo-icon{width:34px;height:34px;background:linear-gradient(135deg,#059669,#34d399);border-radius:10px;display:flex;align-items:center;justify-content:center;animation:pulse 3s ease-in-out infinite;flex-shrink:0}
        .ck-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);font-size:11px;color:#34d399;font-family:'Fira Code',monospace}
        .ck-nav{flex:1;overflow-y:auto;padding:12px 10px}
        .ck-nav-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:9px;cursor:pointer;font-size:13px;color:#7b7a9a;transition:all 0.18s;border:1px solid transparent;margin-bottom:2px}
        .ck-nav-item:hover{background:rgba(52,211,153,0.06);color:#f0eeff;border-color:rgba(52,211,153,0.15)}
        .ck-nav-item.active{background:rgba(52,211,153,0.1);color:#34d399;border-color:rgba(52,211,153,0.25)}
        .ck-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .ck-topbar{height:60px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:rgba(8,8,15,0.9);border-bottom:1px solid rgba(52,211,153,0.1);backdrop-filter:blur(16px)}
        .ck-content{flex:1;overflow-y:auto;padding:40px 52px 60px;max-width:860px}
        .ck-hero{margin-bottom:48px;animation:fadeUp 0.6s ease both}
        .ck-label{font-family:'Fira Code',monospace;font-size:11px;color:#34d399;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px}
        .ck-title{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,48px);font-weight:800;color:#f0eeff;line-height:1.1;margin-bottom:16px}
        .ck-section{margin-bottom:48px;animation:fadeUp 0.5s ease both}
        .ck-section-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(52,211,153,0.1)}
        .ck-section-icon{width:38px;height:38px;border-radius:10px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
        .ck-section-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#f0eeff}
        .ck-text{font-size:14px;color:#7b7a9a;line-height:1.9;margin-bottom:16px}
        .ck-list{margin:12px 0 16px;display:flex;flex-direction:column;gap:8px}
        .ck-list-item{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#7b7a9a;line-height:1.7}
        .ck-dot{width:6px;height:6px;border-radius:50%;background:#34d399;flex-shrink:0;margin-top:8px}
        .ck-table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}
        .ck-table th{text-align:left;padding:10px 14px;background:rgba(52,211,153,0.06);color:#34d399;font-family:'Fira Code',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid rgba(52,211,153,0.15)}
        .ck-table td{padding:10px 14px;color:#7b7a9a;border-bottom:1px solid rgba(130,80,255,0.07);line-height:1.6}
        .ck-back-btn{display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:9px;background:#18182a;border:1px solid rgba(130,80,255,0.2);color:#7b7a9a;font-size:13px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.18s}
        .ck-back-btn:hover{border-color:rgba(52,211,153,0.35);color:#f0eeff}

        /* Preference toggles */
        .ck-pref-card{padding:18px 20px;border-radius:14px;background:#111120;border:1px solid rgba(52,211,153,0.1);margin-bottom:10px;transition:border-color 0.2s}
        .ck-pref-card.active{border-color:rgba(52,211,153,0.3);background:rgba(52,211,153,0.03)}
        .ck-pref-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
        .ck-pref-name{font-family:'Playfair Display',serif;font-weight:700;font-size:14px;color:#f0eeff}
        .ck-pref-desc{font-size:12px;color:#7b7a9a;line-height:1.6}
        .ck-toggle{position:relative;width:42px;height:24px;flex-shrink:0}
        .ck-toggle input{opacity:0;width:0;height:0}
        .ck-toggle-slider{position:absolute;cursor:pointer;inset:0;background:#2a2a3e;border-radius:24px;transition:0.3s;border:1px solid rgba(130,80,255,0.2)}
        .ck-toggle-slider:before{content:'';position:absolute;width:18px;height:18px;left:2px;bottom:2px;background:#7b7a9a;border-radius:50%;transition:0.3s}
        .ck-toggle input:checked+.ck-toggle-slider{background:rgba(52,211,153,0.2);border-color:rgba(52,211,153,0.4)}
        .ck-toggle input:checked+.ck-toggle-slider:before{transform:translateX(18px);background:#34d399}
        .ck-toggle input:disabled+.ck-toggle-slider{opacity:0.6;cursor:not-allowed}
        .ck-save-btn{padding:11px 28px;border-radius:10px;background:linear-gradient(135deg,#059669,#34d399);border:none;color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:'Playfair Display',serif;box-shadow:0 4px 16px rgba(52,211,153,0.3);transition:all 0.2s;margin-top:16px}
        .ck-save-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(52,211,153,0.4)}
        .ck-browser-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0}
        .ck-browser-card{padding:14px 16px;border-radius:10px;background:#111120;border:1px solid rgba(130,80,255,0.14);font-size:13px}
        .ck-browser-name{font-weight:600;color:#f0eeff;margin-bottom:4px}
        .ck-browser-link{font-size:11px;color:#34d399;font-family:'Fira Code',monospace}
        @media(max-width:768px){
          .ck-sidebar{display:none}.ck-content{padding:24px 20px 40px}
          .ck-wrap{display:block;height:auto}.ck-main{height:100vh;overflow-y:auto}
          .ck-browser-grid{grid-template-columns:1fr}
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(52,211,153,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="ck-wrap" style={{ position: "relative", zIndex: 1 }}>
        <aside className="ck-sidebar">
          <div className="ck-sidebar-top">
            <div className="ck-logo" onClick={() => onNavigate("home")}>
              <div className="ck-logo-icon">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 18 }}>Nexus</span>
            </div>
            <div className="ck-badge">🍪 Cookie Policy</div>
          </div>
          <nav className="ck-nav">
            <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code',monospace", letterSpacing: 2, textTransform: "uppercase", padding: "10px 12px 6px" }}>Contents</div>
            {SECTIONS.map(s => (
              <div key={s.id} className={`ck-nav-item ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                <span style={{ fontSize: 14 }}>{s.icon}</span>{s.title}
              </div>
            ))}
          </nav>
        </aside>

        <div className="ck-main">
          <header className="ck-topbar">
            <button className="ck-back-btn" onClick={() => onNavigate("home")}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
              Back to Home
            </button>
            <div style={{ fontSize: 12, color: "#4a4a6a", fontFamily: "'Fira Code',monospace" }}>Last updated: February 2026</div>
          </header>

          <div className="ck-content" ref={contentRef}>
            <div className="ck-hero">
              <div className="ck-label">Legal · Cookies</div>
              <h1 className="ck-title">Cookie Policy</h1>
              <p style={{ fontSize: 14, color: "#7b7a9a", lineHeight: 1.8, maxWidth: 560, marginBottom: 20 }}>We use cookies to make Nexus faster, smarter, and more personalised. Here's everything you need to know about what we use and why — and how to control it.</p>
            </div>

            {/* 1. What Are Cookies */}
            <div data-section="what" className="ck-section">
              <div className="ck-section-header"><div className="ck-section-icon">🍪</div><h2 className="ck-section-title">What Are Cookies?</h2></div>
              <p className="ck-text">Cookies are small text files placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website operators. Cookies cannot access other files on your device and cannot carry viruses or malware.</p>
              <p className="ck-text">We also use similar technologies including pixel tags (web beacons), local storage, and session storage, which function similarly to cookies. When we say "cookies" in this policy, we include all of these technologies.</p>
              <div className="ck-list">
                {["Session cookies expire when you close your browser and are used to maintain your login state during a visit.","Persistent cookies remain on your device for a set period and are used for preferences and analytics.","First-party cookies are set by Nexus. Third-party cookies are set by external services we use.","Flash cookies (Local Shared Objects) may be used for certain media features and are managed through Flash settings."].map(t=><div key={t} className="ck-list-item"><div className="ck-dot"/>{t}</div>)}
              </div>
            </div>

            {/* 2. Why We Use Cookies */}
            <div data-section="why" className="ck-section">
              <div className="ck-section-header"><div className="ck-section-icon">🎯</div><h2 className="ck-section-title">Why We Use Cookies</h2></div>
              <p className="ck-text">We use cookies for the following core purposes on the Nexus marketplace:</p>
              <div className="ck-list">
                {["Authentication & Security — To verify your identity, keep you logged in securely, and protect against cross-site request forgery (CSRF).","Preferences & Personalisation — To remember your settings such as language, currency, display theme, and notification preferences.","Shopping Experience — To maintain your saved items, recently viewed products, and search history within a session.","Product Recommendations — To understand which categories and products you interact with most, enabling us to surface relevant listings you're likely to love.","Analytics & Improvement — To understand how users navigate the platform, which features are most used, and where friction exists, allowing us to continuously improve.","Advertising — To deliver relevant sponsored listings and retargeted ads on partner networks based on your activity on Nexus.","A/B Testing — To run controlled experiments to test new features, layouts, and content before rolling them out broadly.","Fraud Prevention — To detect suspicious activity patterns that may indicate account takeover or fraudulent listings."].map(t=><div key={t} className="ck-list-item"><div className="ck-dot"/>{t}</div>)}
              </div>
            </div>

            {/* 3. Types We Use */}
            <div data-section="types" className="ck-section">
              <div className="ck-section-header"><div className="ck-section-icon">📊</div><h2 className="ck-section-title">Types of Cookies We Use</h2></div>
              <table className="ck-table">
                <thead><tr><th>Category</th><th>Name Examples</th><th>Purpose</th><th>Duration</th><th>Essential</th></tr></thead>
                <tbody>
                  {[
                    ["Strictly Necessary","nexus_session, csrf_token, auth_state","Login, security, cart","Session","Yes"],
                    ["Functional","nexus_lang, nexus_currency, nexus_theme","Language, display, preferences","1 Year","No"],
                    ["Analytics (1st)","_nx_page, _nx_click, _nx_session","Internal usage metrics","2 Years","No"],
                    ["Analytics (3rd)","_ga, _gid, mp_session","Google Analytics, Mixpanel","2 Years","No"],
                    ["Personalisation","_nx_browse, _nx_cats, _nx_rec","Product recommendations","6 Months","No"],
                    ["Advertising","_fbp, _gcl_au, _nx_adid","Retargeting, ad measurement","90 Days","No"],
                    ["A/B Testing","_nx_exp, optimizely_id","Feature experiments","30 Days","No"],
                    ["Fraud Detection","_nx_fp, _nx_risk","Device fingerprinting, anomaly detection","90 Days","No"],
                  ].map(([c,n,p,d,e])=><tr key={c}><td style={{color:"#34d399",fontWeight:500}}>{c}</td><td style={{fontFamily:"'Fira Code',monospace",fontSize:11}}>{n}</td><td>{p}</td><td style={{fontFamily:"'Fira Code',monospace",fontSize:12}}>{d}</td><td style={{color:e==="Yes"?"#34d399":"#7b7a9a"}}>{e}</td></tr>)}
                </tbody>
              </table>
            </div>

            {/* 4. Third-Party */}
            <div data-section="third" className="ck-section">
              <div className="ck-section-header"><div className="ck-section-icon">🔗</div><h2 className="ck-section-title">Third-Party Cookies</h2></div>
              <p className="ck-text">When you use Nexus, certain third-party services may also set cookies on your device. These are governed by the respective third party's privacy and cookie policies, not this one. We have data processing agreements in place with all third-party providers.</p>
              <table className="ck-table">
                <thead><tr><th>Provider</th><th>Purpose</th><th>Privacy Policy</th></tr></thead>
                <tbody>
                  {[
                    ["Google Analytics","Usage analytics and audience insights","policies.google.com"],
                    ["Google Ads","Conversion tracking and remarketing","policies.google.com/privacy"],
                    ["Mixpanel","Product analytics and event tracking","mixpanel.com/legal/privacy-policy"],
                    ["Stripe","Fraud detection for payment processing","stripe.com/privacy"],
                    ["Facebook Pixel","Social ad conversion tracking","facebook.com/policy.php"],
                    ["Hotjar","Session recording and heatmaps (anonymised)","hotjar.com/legal/privacy"],
                    ["Intercom","Customer support chat widget","intercom.com/legal/privacy"],
                    ["Sentry","Error monitoring and performance tracking","sentry.io/privacy"],
                  ].map(([p,pu,l])=><tr key={p}><td style={{color:"#34d399",fontWeight:500}}>{p}</td><td>{pu}</td><td style={{fontFamily:"'Fira Code',monospace",fontSize:11}}>{l}</td></tr>)}
                </tbody>
              </table>
            </div>

            {/* 5. Managing */}
            <div data-section="manage" className="ck-section">
              <div className="ck-section-header"><div className="ck-section-icon">⚙️</div><h2 className="ck-section-title">Managing Your Cookie Preferences</h2></div>
              <p className="ck-text">You can manage your cookie preferences below. Strictly necessary cookies cannot be disabled as they are essential for the platform to function. Your preferences will be saved for 12 months.</p>

              <div style={{ marginBottom: 24 }}>
                {[
                  { key: "essential", label: "Strictly Necessary", desc: "Essential for login, security, and platform functionality. Cannot be disabled.", required: true },
                  { key: "functional", label: "Functional", desc: "Remembers your language, currency, and display preferences across visits." },
                  { key: "analytics", label: "Analytics & Performance", desc: "Helps us understand how users use the platform so we can improve it." },
                  { key: "personalisation", label: "Personalisation", desc: "Powers our product recommendation engine to show you items you'll love." },
                  { key: "advertising", label: "Advertising & Retargeting", desc: "Enables relevant ads on Nexus and partner networks based on your interests." },
                ].map(({ key, label, desc, required }) => (
                  <div key={key} className={`ck-pref-card ${accepted[key] || required ? "active" : ""}`}>
                    <div className="ck-pref-header">
                      <span className="ck-pref-name">{label}</span>
                      <label className="ck-toggle">
                        <input type="checkbox" checked={required || !!accepted[key]} disabled={required} onChange={() => !required && toggle(key)} />
                        <span className="ck-toggle-slider" />
                      </label>
                    </div>
                    <p className="ck-pref-desc">{desc}{required && <span style={{ color: "#34d399", marginLeft: 4 }}>Always active.</span>}</p>
                  </div>
                ))}
                <button className="ck-save-btn" onClick={() => alert("Preferences saved!")}>Save Cookie Preferences</button>
              </div>

              <p className="ck-text">You can also manage cookies directly through your browser settings. Here's how to do it in the most common browsers:</p>
              <div className="ck-browser-grid">
                {[["Chrome","settings/cookies","chrome://settings/cookies"],["Firefox","privacy-preferences","about:preferences#privacy"],["Safari","Preferences → Privacy","In Safari Menu"],["Edge","settings/privacy","edge://settings/privacy"],["Opera","Settings → Privacy","opera://settings/privacy"],["Brave","Settings → Shields","brave://settings/shields"]].map(([b,p,l])=>(
                  <div key={b} className="ck-browser-card">
                    <div className="ck-browser-name">{b}</div>
                    <div className="ck-browser-link">{l}</div>
                  </div>
                ))}
              </div>
              <p className="ck-text" style={{ marginTop: 12 }}>To opt out of Google Analytics specifically, install the <span style={{ color: "#34d399" }}>Google Analytics Opt-out Browser Add-on</span>. To opt out of interest-based advertising, visit <span style={{ color: "#34d399" }}>aboutads.info</span> (US) or <span style={{ color: "#34d399" }}>youronlinechoices.com</span> (EU).</p>
            </div>

            {/* 6. Impact */}
            <div data-section="impact" className="ck-section">
              <div className="ck-section-header"><div className="ck-section-icon">⚠️</div><h2 className="ck-section-title">Impact of Disabling Cookies</h2></div>
              <p className="ck-text">While you are free to disable any non-essential cookies, doing so may affect your experience on Nexus in the following ways:</p>
              <div className="ck-list">
                {["Disabling functional cookies: You will need to re-enter language, currency, and display preferences every visit. Your theme settings will reset.","Disabling analytics cookies: The platform will not receive usage data from your sessions, which means your behaviour won't contribute to improvements that benefit all users.","Disabling personalisation cookies: Product recommendations will be generic rather than tailored to your interests. You may see less relevant items on your homepage and search results.","Disabling advertising cookies: You will still see ads, but they will be random rather than relevant to your interests. You may see the same ad repeated frequently.","Blocking all cookies (via browser): You may not be able to log in, and many core features of the platform will not work correctly. We recommend using the preference centre above instead."].map(t=><div key={t} className="ck-list-item"><div className="ck-dot"/>{t}</div>)}
              </div>
            </div>

            {/* 7. Updates */}
            <div data-section="updates" className="ck-section">
              <div className="ck-section-header"><div className="ck-section-icon">📋</div><h2 className="ck-section-title">Policy Updates</h2></div>
              <p className="ck-text">We may update this Cookie Policy when we add new features, change our technology partners, or as required by applicable law. When we do, we will update the "last updated" date at the top of this page and notify registered users by email of any material changes. We recommend reviewing this page periodically.</p>
            </div>

            {/* 8. Contact */}
            <div data-section="contact" className="ck-section">
              <div className="ck-section-header"><div className="ck-section-icon">✉️</div><h2 className="ck-section-title">Contact</h2></div>
              <p className="ck-text">For questions about our use of cookies, contact our Privacy Team:</p>
              <div style={{ padding: "22px 24px", borderRadius: 14, background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.18)", marginTop: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[["Privacy Email","privacy@nexus.io"],["General Email","onemore9414@gmail.com"],["Platform","nexus.io"],["Response Time","Within 30 days"]].map(([l,v])=>(
                    <div key={l}>
                      <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code',monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{l}</div>
                      <div style={{ fontSize: 13, color: "#34d399" }}>{v}</div>
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