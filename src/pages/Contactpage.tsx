import React, { useState, useRef } from "react";

const SERVICES = [
  { icon: "🛍", label: "Marketplace / E-Commerce" },
  { icon: "📊", label: "SaaS Dashboard" },
  { icon: "🌐", label: "Landing Page / Marketing Site" },
  { icon: "📱", label: "Mobile-First Web App" },
  { icon: "🔧", label: "Existing Site Redesign" },
  { icon: "💡", label: "Something Else" },
];

const BUDGETS = ["< $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000+", "Let's discuss"];
const TIMELINES = ["ASAP", "1–2 weeks", "1 month", "Flexible"];

const INFO_CARDS = [
  { icon: "📧", title: "Email", value: "onemore9414@gmail.com", sub: "Best way to reach me", action: "mailto:onemore9414@gmail.com" },
  { icon: "⚡", title: "Response Time", value: "Within 24 hours", sub: "Usually much faster", action: null },
  { icon: "🌍", title: "Availability", value: "Worldwide Remote", sub: "All time zones welcome", action: null },
  { icon: "📅", title: "Booking", value: "Open for Projects", sub: "Currently taking on work", action: null },
];

export default function ContactPage({ onNavigate }: { onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", budget: "", timeline: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim() || form.message.length < 20) e.message = "Please describe your project (min 20 chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
  };

  const copy = () => {
    navigator.clipboard.writeText("onemore9414@gmail.com").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,800&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{background:#08080f;color:#f0eeff;font-family:'Outfit',sans-serif;scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111120}::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.4);border-radius:10px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 14px rgba(124,58,237,0.4)}50%{box-shadow:0 0 30px rgba(124,58,237,0.7),0 0 55px rgba(168,85,247,0.2)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes successPop{0%{transform:scale(0.8);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .ct-page{background:#08080f;min-height:100vh;position:relative;overflow-x:hidden}
        /* Nav */
        .ct-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;background:rgba(8,8,15,0.88);border-bottom:1px solid rgba(130,80,255,0.12);backdrop-filter:blur(20px)}
        .ct-logo{display:flex;align-items:center;gap:10px;cursor:pointer}
        .ct-logo-icon{width:34px;height:34px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:10px;display:flex;align-items:center;justify-content:center;animation:pulse 3s ease-in-out infinite}
        .ct-nav-links{display:flex;align-items:center;gap:6px}
        .ct-nav-link{padding:7px 13px;border-radius:9px;font-size:13px;font-weight:500;color:#7b7a9a;cursor:pointer;border:1px solid transparent;transition:all 0.18s}
        .ct-nav-link:hover{background:rgba(124,58,237,0.08);color:#f0eeff;border-color:rgba(130,80,255,0.18)}
        /* Layout */
        .ct-wrap{display:grid;grid-template-columns:1fr 1fr;gap:0;min-height:100vh;padding-top:60px}
        /* Left panel */
        .ct-left{padding:80px 60px 60px;border-right:1px solid rgba(130,80,255,0.1);position:sticky;top:60px;height:calc(100vh - 60px);overflow-y:auto;display:flex;flex-direction:column;justify-content:space-between}
        .ct-eyebrow{font-family:'Fira Code',monospace;font-size:11px;color:#c084fc;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:10px;animation:fadeUp 0.6s ease both}
        .ct-eyebrow::before{content:'';display:inline-block;width:20px;height:1px;background:#a855f7}
        .ct-title{font-family:'Playfair Display',serif;font-size:clamp(34px,4vw,54px);font-weight:900;color:#f0eeff;line-height:1.05;letter-spacing:-1.5px;margin-bottom:22px;animation:fadeUp 0.7s ease 0.1s both}
        .ct-title em{font-style:italic;background:linear-gradient(135deg,#c084fc,#a855f7,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ct-subtitle{font-size:15px;color:#7b7a9a;line-height:1.8;max-width:400px;margin-bottom:40px;animation:fadeUp 0.7s ease 0.2s both}
        .ct-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;animation:fadeUp 0.7s ease 0.3s both}
        .ct-info-card{padding:16px 18px;border-radius:12px;background:#111120;border:1px solid rgba(130,80,255,0.14);transition:all 0.2s;cursor:default}
        .ct-info-card:hover{border-color:rgba(168,85,247,0.35);transform:translateY(-2px)}
        .ct-info-icon{font-size:20px;margin-bottom:8px}
        .ct-info-title{font-size:10px;color:#4a4a6a;font-family:'Fira Code',monospace;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px}
        .ct-info-value{font-size:13px;font-weight:600;color:#f0eeff;margin-bottom:2px}
        .ct-info-sub{font-size:11px;color:#7b7a9a}
        .ct-copy-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:10px;background:rgba(124,58,237,0.1);border:1px solid rgba(168,85,247,0.25);color:#c084fc;font-size:13px;font-weight:500;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.2s;margin-top:20px}
        .ct-copy-btn:hover{background:rgba(124,58,237,0.18);border-color:rgba(168,85,247,0.45)}
        /* Right panel — form */
        .ct-right{padding:80px 60px 60px;overflow-y:auto}
        .ct-form-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#f0eeff;margin-bottom:6px}
        .ct-form-sub{font-size:13px;color:#7b7a9a;margin-bottom:32px}
        /* Form fields */
        .ct-field{margin-bottom:18px}
        .ct-label{display:block;font-size:12px;font-weight:500;color:#7b7a9a;margin-bottom:7px;letter-spacing:0.3px}
        .ct-input{width:100%;padding:11px 14px;background:#111120;border:1px solid rgba(130,80,255,0.18);border-radius:10px;color:#f0eeff;font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:all 0.2s}
        .ct-input:focus{border-color:rgba(168,85,247,0.5);box-shadow:0 0 0 3px rgba(124,58,237,0.1)}
        .ct-input.err{border-color:rgba(248,113,113,0.5)}
        .ct-input::placeholder{color:#4a4a6a}
        .ct-error{font-size:11px;color:#f87171;margin-top:4px}
        .ct-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .ct-textarea{width:100%;padding:12px 14px;background:#111120;border:1px solid rgba(130,80,255,0.18);border-radius:10px;color:#f0eeff;font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:all 0.2s;resize:vertical;min-height:120px;line-height:1.6}
        .ct-textarea:focus{border-color:rgba(168,85,247,0.5);box-shadow:0 0 0 3px rgba(124,58,237,0.1)}
        .ct-textarea::placeholder{color:#4a4a6a}
        /* Service grid */
        .ct-service-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px}
        .ct-service-chip{padding:9px 10px;border-radius:9px;border:1px solid rgba(130,80,255,0.18);background:rgba(130,80,255,0.04);color:#7b7a9a;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s;text-align:center;line-height:1.4}
        .ct-service-chip:hover{border-color:rgba(168,85,247,0.35);color:#f0eeff}
        .ct-service-chip.sel{background:rgba(124,58,237,0.18);border-color:rgba(168,85,247,0.5);color:#c084fc}
        /* Budget / timeline pills */
        .ct-pill-row{display:flex;flex-wrap:wrap;gap:7px}
        .ct-pill{padding:7px 14px;border-radius:20px;border:1px solid rgba(130,80,255,0.18);background:transparent;color:#7b7a9a;font-size:12px;cursor:pointer;transition:all 0.18s;font-family:'Outfit',sans-serif}
        .ct-pill:hover{border-color:rgba(168,85,247,0.35);color:#f0eeff}
        .ct-pill.sel{background:rgba(124,58,237,0.18);border-color:rgba(168,85,247,0.5);color:#c084fc}
        /* Submit */
        .ct-submit{width:100%;padding:14px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:white;font-size:15px;font-weight:700;cursor:pointer;font-family:'Playfair Display',serif;box-shadow:0 4px 20px rgba(124,58,237,0.4);transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:8px}
        .ct-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.55)}
        .ct-submit:disabled{opacity:0.7;cursor:not-allowed;transform:none}
        .ct-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite}
        /* Success */
        .ct-success{text-align:center;padding:60px 40px;animation:successPop 0.6s cubic-bezier(0.16,1,0.3,1) both}
        .ct-success-icon{font-size:64px;margin-bottom:20px;animation:float 3s ease-in-out infinite}
        .ct-success-title{font-family:'Playfair Display',serif;font-size:28px;font-weight:800;color:#f0eeff;margin-bottom:12px}
        .ct-success-sub{font-size:15px;color:#7b7a9a;line-height:1.8;max-width:400px;margin:0 auto 28px}
        .ct-section-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(168,85,247,0.15),transparent);margin:24px 0}
        @media(max-width:900px){
          .ct-wrap{grid-template-columns:1fr;padding-top:60px}
          .ct-left{position:relative;height:auto;padding:60px 28px 40px;border-right:none;border-bottom:1px solid rgba(130,80,255,0.1)}
          .ct-right{padding:40px 28px 60px}
          .ct-nav{padding:0 20px}
          .ct-service-grid{grid-template-columns:1fr 1fr}
        }
        @media(max-width:480px){
          .ct-row{grid-template-columns:1fr}
          .ct-info-grid{grid-template-columns:1fr}
          .ct-service-grid{grid-template-columns:1fr 1fr}
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "fixed", top: "40%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="ct-page" style={{ position: "relative", zIndex: 1 }}>
        {/* Nav */}
        <nav className="ct-nav">
          <div className="ct-logo" onClick={() => onNavigate("home")}>
            <div className="ct-logo-icon">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 18 }}>Nexus</span>
          </div>
          <div className="ct-nav-links">
            {[["Home","home"],["Marketplace","buy"],["About","about"]].map(([l,p])=>(
              <span key={l} className="ct-nav-link" onClick={() => onNavigate(p as any)}>{l}</span>
            ))}
          </div>
        </nav>

        <div className="ct-wrap">
          {/* Left — Info */}
          <div className="ct-left">
            <div>
              <div className="ct-eyebrow">Get in Touch</div>
              <h1 className="ct-title">Let's build<br />something<br /><em>remarkable.</em></h1>
              <p className="ct-subtitle">
                I'm a solo full-stack developer with a track record of delivering polished, high-performance web platforms. Whether you have a brief or just an idea — reach out. I respond personally to every message.
              </p>
              <div className="ct-info-grid">
                {INFO_CARDS.map(c => (
                  <div key={c.title} className="ct-info-card" onClick={() => c.action && window.open(c.action)}>
                    <div className="ct-info-icon">{c.icon}</div>
                    <div className="ct-info-title">{c.title}</div>
                    <div className="ct-info-value">{c.value}</div>
                    <div className="ct-info-sub">{c.sub}</div>
                  </div>
                ))}
              </div>
              <button className="ct-copy-btn" onClick={copy}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                {copied ? "✓ Email copied!" : "Copy email address"}
              </button>
            </div>

            {/* Bottom trust signals */}
            <div>
              <div className="ct-section-divider" />
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[["🚀","Fast Delivery"],["💯","Quality Guaranteed"],["🔒","NDA Available"],["🌍","100% Remote"]].map(([icon,label])=>(
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#7b7a9a" }}>
                    <span>{icon}</span>{label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="ct-right">
            {submitted ? (
              <div className="ct-success">
                <div className="ct-success-icon">🎉</div>
                <h2 className="ct-success-title">Message Received!</h2>
                <p className="ct-success-sub">Thank you for reaching out. I review every message personally and will get back to you within 24 hours — usually much sooner.</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", service: "", budget: "", timeline: "", message: "" }); }}
                    style={{ padding: "11px 22px", borderRadius: 10, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                    Send Another
                  </button>
                  <button onClick={() => onNavigate("home")}
                    style={{ padding: "11px 22px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="ct-form-title">Tell me about your project</div>
                <p className="ct-form-sub">Fill in as much or as little as you like. No commitment — just a conversation.</p>

                {/* Name + Email */}
                <div className="ct-row">
                  <div className="ct-field">
                    <label className="ct-label">Your Name *</label>
                    <input className={`ct-input ${errors.name ? "err" : ""}`} value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Smith" />
                    {errors.name && <div className="ct-error">{errors.name}</div>}
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Email Address *</label>
                    <input className={`ct-input ${errors.email ? "err" : ""}`} value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com" type="email" />
                    {errors.email && <div className="ct-error">{errors.email}</div>}
                  </div>
                </div>

                {/* Company */}
                <div className="ct-field">
                  <label className="ct-label">Company / Organisation <span style={{ fontSize: 10, color: "#4a4a6a" }}>optional</span></label>
                  <input className="ct-input" value={form.company} onChange={e => set("company", e.target.value)} placeholder="Your company name" />
                </div>

                <div className="ct-section-divider" />

                {/* Service */}
                <div className="ct-field">
                  <label className="ct-label">What do you need?</label>
                  <div className="ct-service-grid">
                    {SERVICES.map(s => (
                      <div key={s.label} className={`ct-service-chip ${form.service === s.label ? "sel" : ""}`} onClick={() => set("service", form.service === s.label ? "" : s.label)}>
                        <div>{s.icon}</div>
                        <div style={{ marginTop: 4, fontSize: 11 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="ct-field">
                  <label className="ct-label">Budget range <span style={{ fontSize: 10, color: "#4a4a6a" }}>optional</span></label>
                  <div className="ct-pill-row">
                    {BUDGETS.map(b => (
                      <button key={b} type="button" className={`ct-pill ${form.budget === b ? "sel" : ""}`} onClick={() => set("budget", form.budget === b ? "" : b)}>{b}</button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="ct-field">
                  <label className="ct-label">Preferred timeline <span style={{ fontSize: 10, color: "#4a4a6a" }}>optional</span></label>
                  <div className="ct-pill-row">
                    {TIMELINES.map(t => (
                      <button key={t} type="button" className={`ct-pill ${form.timeline === t ? "sel" : ""}`} onClick={() => set("timeline", form.timeline === t ? "" : t)}>{t}</button>
                    ))}
                  </div>
                </div>

                <div className="ct-section-divider" />

                {/* Message */}
                <div className="ct-field">
                  <label className="ct-label">Tell me more about your project *</label>
                  <textarea className={`ct-textarea ${errors.message ? "err" : ""}`} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Describe what you're building, the problem it solves, who your users are, and any technical requirements you have in mind. The more detail you share, the better I can assess fit and give you an accurate estimate." />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                    {errors.message ? <div className="ct-error">{errors.message}</div> : <div />}
                    <div style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "'Fira Code',monospace" }}>{form.message.length} chars</div>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="ct-submit" disabled={loading}>
                  {loading ? <><div className="ct-spinner" />Sending your message...</> : <>Send Message →</>}
                </button>

                <p style={{ fontSize: 11, color: "#4a4a6a", textAlign: "center", marginTop: 14, lineHeight: 1.6, fontFamily: "'Fira Code',monospace" }}>
                  By submitting, you agree to our <span style={{ color: "#c084fc", cursor: "pointer" }} onClick={() => onNavigate("privacy")}>Privacy Policy</span>. I never share your details with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}