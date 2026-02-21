import { useState, useEffect, useRef } from "react";

const SKILLS = [
  { name: "React / Next.js", level: 96 },
  { name: "TypeScript", level: 92 },
  { name: "UI/UX Design", level: 94 },
  { name: "Node.js / APIs", level: 88 },
  { name: "Database Design", level: 85 },
  { name: "Mobile-First CSS", level: 96 },
];

const PROJECTS = [
  { title: "Nexus Marketplace", desc: "A full-stack peer-to-peer marketplace platform with real-time messaging, seller dashboards, and AI-powered product recommendations.", tags: ["React", "TypeScript", "Node.js", "Stripe"], gradient: "linear-gradient(135deg,#1a1035,#4c1d95)" },
  { title: "E-Commerce Platform", desc: "Scalable e-commerce solution with multi-vendor support, analytics dashboard, and automated inventory management.", tags: ["Next.js", "PostgreSQL", "Redis", "AWS"], gradient: "linear-gradient(135deg,#0c0a1e,#312e81)" },
  { title: "SaaS Dashboard", desc: "Enterprise-grade SaaS analytics platform serving 50K+ monthly users with real-time data visualisation and custom reporting.", tags: ["React", "D3.js", "GraphQL", "TypeScript"], gradient: "linear-gradient(135deg,#0f172a,#164e63)" },
];

const VALUES = [
  { icon: "⚡", title: "Speed", desc: "I deliver without cutting corners. Most projects ship in 2–4 weeks with full testing." },
  { icon: "🎨", title: "Aesthetics", desc: "Every pixel is intentional. I build interfaces that impress clients before they even click." },
  { icon: "📱", title: "Responsive", desc: "Mobile-first by default. Every site I build works flawlessly on every screen size." },
  { icon: "🔒", title: "Secure", desc: "Production-grade security baked in from day one — not added as an afterthought." },
];

export default function AboutPage({ onNavigate }: { onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void }) {
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setSkillsVisible(true);
    }, { threshold: 0.3 });
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

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
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 16px rgba(124,58,237,0.4)}50%{box-shadow:0 0 32px rgba(124,58,237,0.7),0 0 60px rgba(168,85,247,0.2)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes barGrow{from{width:0}to{width:var(--bar-w)}}
        .about-page{background:#08080f;min-height:100vh;position:relative;overflow-x:hidden}
        /* Nav */
        .about-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;background:rgba(8,8,15,0.85);border-bottom:1px solid rgba(130,80,255,0.12);backdrop-filter:blur(20px)}
        .about-nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer}
        .about-nav-logo-icon{width:34px;height:34px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:10px;display:flex;align-items:center;justify-content:center;animation:pulse 3s ease-in-out infinite}
        .about-nav-links{display:flex;align-items:center;gap:8px}
        .about-nav-link{padding:7px 14px;border-radius:9px;font-size:13px;font-weight:500;color:#7b7a9a;cursor:pointer;border:1px solid transparent;transition:all 0.18s;text-decoration:none}
        .about-nav-link:hover{background:rgba(124,58,237,0.08);color:#f0eeff;border-color:rgba(130,80,255,0.18)}
        .about-nav-cta{padding:8px 18px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:white;font-size:13px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;box-shadow:0 4px 14px rgba(124,58,237,0.3);transition:all 0.2s}
        .about-nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(124,58,237,0.5)}
        /* Hero */
        .about-hero{padding:140px 40px 100px;max-width:1100px;margin:0 auto;position:relative}
        .about-hero-eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:20px;animation:fadeUp 0.6s ease both}
        .about-hero-dot{width:8px;height:8px;border-radius:50%;background:#a855f7;animation:pulse 2s ease-in-out infinite}
        .about-hero-label{font-family:'Fira Code',monospace;font-size:12px;color:#c084fc;letter-spacing:2px;text-transform:uppercase}
        .about-hero-title{font-family:'Playfair Display',serif;font-size:clamp(42px,6vw,80px);font-weight:900;color:#f0eeff;line-height:1.0;letter-spacing:-2px;margin-bottom:28px;animation:fadeUp 0.7s ease 0.1s both}
        .about-hero-title em{font-style:italic;background:linear-gradient(135deg,#c084fc,#a855f7,#e879f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .about-hero-sub{font-size:17px;color:#7b7a9a;line-height:1.8;max-width:540px;margin-bottom:36px;animation:fadeUp 0.7s ease 0.2s both}
        .about-hero-actions{display:flex;gap:12px;flex-wrap:wrap;animation:fadeUp 0.7s ease 0.3s both}
        .about-hero-avatar{position:absolute;right:40px;top:50%;transform:translateY(-50%);animation:float 5s ease-in-out infinite}
        .about-avatar-ring{width:280px;height:280px;border-radius:50%;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1));border:1px solid rgba(168,85,247,0.2);display:flex;align-items:center;justify-content:center;position:relative}
        .about-avatar-ring::before{content:'';position:absolute;inset:-1px;border-radius:50%;background:linear-gradient(135deg,rgba(168,85,247,0.4),transparent,rgba(124,58,237,0.4));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1px}
        .about-avatar-inner{width:220px;height:220px;border-radius:50%;background:linear-gradient(135deg,#2d1b69,#4c1d95,#1e1b4b);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:72px;font-weight:900;color:rgba(192,132,252,0.5);border:2px solid rgba(168,85,247,0.2)}
        .about-status-badge{position:absolute;bottom:16px;right:16px;padding:6px 12px;border-radius:20px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);font-size:11px;color:#34d399;font-weight:600;display:flex;align-items:center;gap:6px;font-family:'Fira Code',monospace}
        .about-status-dot{width:6px;height:6px;border-radius:50%;background:#34d399;animation:pulse 2s ease-in-out infinite}
        /* Sections */
        .about-section{padding:80px 40px;max-width:1100px;margin:0 auto}
        .about-section-label{font-family:'Fira Code',monospace;font-size:11px;color:#c084fc;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:10px}
        .about-section-label::before{content:'';display:inline-block;width:20px;height:1px;background:#a855f7}
        .about-section-title{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,42px);font-weight:800;color:#f0eeff;line-height:1.15;margin-bottom:20px}
        /* Cards */
        .about-values-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;margin-top:40px}
        .about-value-card{padding:24px;border-radius:16px;background:#111120;border:1px solid rgba(130,80,255,0.14);transition:all 0.25s;animation:fadeUp 0.5s ease both}
        .about-value-card:hover{border-color:rgba(168,85,247,0.4);transform:translateY(-4px);box-shadow:0 16px 40px rgba(124,58,237,0.12)}
        .about-value-icon{font-size:28px;margin-bottom:14px}
        .about-value-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#f0eeff;margin-bottom:8px}
        .about-value-desc{font-size:13px;color:#7b7a9a;line-height:1.7}
        /* Skills */
        .about-skill-item{margin-bottom:18px}
        .about-skill-meta{display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;font-weight:500}
        .about-skill-bar-track{height:5px;border-radius:99px;background:rgba(130,80,255,0.12);overflow:hidden}
        .about-skill-bar{height:100%;border-radius:99px;background:linear-gradient(90deg,#7c3aed,#a855f7,#e879f9);transition:width 1.2s cubic-bezier(0.16,1,0.3,1)}
        /* Projects */
        .about-projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:40px}
        .about-project-card{border-radius:18px;overflow:hidden;border:1px solid rgba(130,80,255,0.14);transition:all 0.25s;animation:fadeUp 0.5s ease both}
        .about-project-card:hover{border-color:rgba(168,85,247,0.4);transform:translateY(-4px);box-shadow:0 20px 50px rgba(124,58,237,0.15)}
        .about-project-thumb{height:140px;position:relative}
        .about-project-body{padding:18px 20px;background:#111120}
        .about-project-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#f0eeff;margin-bottom:8px}
        .about-project-desc{font-size:13px;color:#7b7a9a;line-height:1.7;margin-bottom:12px}
        .about-project-tags{display:flex;flex-wrap:wrap;gap:5px}
        .about-project-tag{padding:3px 9px;border-radius:4px;background:rgba(124,58,237,0.1);border:1px solid rgba(168,85,247,0.2);font-size:10px;color:#c084fc;font-family:'Fira Code',monospace}
        /* CTA */
        .about-cta{padding:80px 40px;text-align:center;position:relative;overflow:hidden}
        .about-cta-inner{max-width:600px;margin:0 auto;position:relative;z-index:1}
        .about-cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 70%);pointer-events:none}
        /* Buttons */
        .btn-primary-about{padding:12px 28px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;color:white;font-size:14px;font-weight:700;cursor:pointer;font-family:'Playfair Display',serif;box-shadow:0 4px 20px rgba(124,58,237,0.4);transition:all 0.2s}
        .btn-primary-about:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.55)}
        .btn-secondary-about{padding:12px 24px;border-radius:12px;background:transparent;border:1px solid rgba(130,80,255,0.3);color:#c084fc;font-size:14px;font-weight:500;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.2s}
        .btn-secondary-about:hover{border-color:rgba(168,85,247,0.6);background:rgba(124,58,237,0.08)}
        .about-divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(168,85,247,0.2),transparent);margin:0 auto}
        @media(max-width:900px){
          .about-hero-avatar{display:none}
          .about-hero{padding:120px 24px 60px}
          .about-section{padding:60px 24px}
          .about-nav{padding:0 20px}
          .about-cta{padding:60px 24px}
        }
        @media(max-width:480px){
          .about-hero-title{letter-spacing:-1px}
          .about-values-grid{grid-template-columns:1fr 1fr}
          .about-projects-grid{grid-template-columns:1fr}
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="about-page">
        {/* Nav */}
        <nav className="about-nav">
          <div className="about-nav-logo" onClick={() => onNavigate("home")}>
            <div className="about-nav-logo-icon">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 18 }}>Nexus</span>
          </div>
          <div className="about-nav-links">
            <span className="about-nav-link" onClick={() => onNavigate("home")}>Home</span>
            <span className="about-nav-link" onClick={() => onNavigate("buy")}>Marketplace</span>
            <span className="about-nav-link" onClick={() => onNavigate("contact")}>Contact</span>
            <button className="about-nav-cta" onClick={() => onNavigate("contact")}>Hire Me</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="about-hero">
          <div className="about-hero-eyebrow">
            <div className="about-hero-dot" />
            <span className="about-hero-label">Solo Developer · Designer · Builder</span>
          </div>
          <h1 className="about-hero-title">
            Crafting Digital<br />
            Experiences that<br />
            <em>Actually Convert.</em>
          </h1>
          <p className="about-hero-sub">
            I'm a solo full-stack developer specialising in building fast, modern, and polished web platforms — from concept to launch. Nexus is one of my flagship demos built to show exactly what I create for clients.
          </p>
          <div className="about-hero-actions">
            <button className="btn-primary-about" onClick={() => onNavigate("contact")}>Work With Me</button>
            <button className="btn-secondary-about" onClick={() => window.open("mailto:onemore9414@gmail.com")}>onemore9414@gmail.com</button>
          </div>

          <div className="about-hero-avatar">
            <div className="about-avatar-ring">
              <div className="about-avatar-inner">{"</>"}</div>
              <div className="about-status-badge">
                <div className="about-status-dot" />
                Available for projects
              </div>
            </div>
          </div>
        </section>

        <div className="about-divider" />

        {/* What I Do */}
        <section className="about-section">
          <div className="about-section-label">What I Do</div>
          <h2 className="about-section-title">One Developer.<br />Full-Stack Results.</h2>
          <p style={{ fontSize: 15, color: "#7b7a9a", lineHeight: 1.8, maxWidth: 580, marginBottom: 0 }}>
            I build complete web products end-to-end — design, front-end, back-end, deployment. No agency mark-ups, no miscommunication between teams. You work directly with me, and I take full ownership of the outcome. The sites I build are fast, scalable, and built to impress.
          </p>
          <div className="about-values-grid">
            {VALUES.map((v, i) => (
              <div key={v.title} className="about-value-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="about-value-icon">{v.icon}</div>
                <div className="about-value-title">{v.title}</div>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="about-divider" />

        {/* Skills */}
        <section className="about-section">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            <div>
              <div className="about-section-label">My Stack</div>
              <h2 className="about-section-title" style={{ fontSize: "clamp(24px,3vw,36px)" }}>Built with the tools that matter.</h2>
              <p style={{ fontSize: 14, color: "#7b7a9a", lineHeight: 1.8 }}>I work primarily in the modern React ecosystem, building production-grade applications that are fast to load, easy to maintain, and beautiful to use. Every project gets the full-stack treatment — from pixel-perfect UI to secure server-side logic.</p>
            </div>
            <div ref={skillsRef}>
              {SKILLS.map((s, i) => (
                <div key={s.name} className="about-skill-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="about-skill-meta">
                    <span style={{ color: "#f0eeff" }}>{s.name}</span>
                    <span style={{ color: "#c084fc", fontFamily: "'Fira Code',monospace", fontSize: 12 }}>{s.level}%</span>
                  </div>
                  <div className="about-skill-bar-track">
                    <div className="about-skill-bar" style={{ width: skillsVisible ? `${s.level}%` : "0%", transitionDelay: `${i * 0.12}s` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="about-divider" />

        {/* Projects */}
        <section className="about-section">
          <div className="about-section-label">Portfolio</div>
          <h2 className="about-section-title">Projects that speak<br />for themselves.</h2>
          <div className="about-projects-grid">
            {PROJECTS.map((p, i) => (
              <div key={p.title} className="about-project-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="about-project-thumb" style={{ background: p.gradient, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: 16, left: 16, fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.25)" }}>{p.title}</div>
                </div>
                <div className="about-project-body">
                  <div className="about-project-title">{p.title}</div>
                  <p className="about-project-desc">{p.desc}</p>
                  <div className="about-project-tags">{p.tags.map(t => <span key={t} className="about-project-tag">{t}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="about-divider" />

        {/* Testimonial */}
        <section className="about-section" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div style={{ padding: "36px 40px", borderRadius: 20, background: "linear-gradient(135deg,rgba(124,58,237,0.07),rgba(168,85,247,0.03))", border: "1px solid rgba(168,85,247,0.18)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: "linear-gradient(to bottom,#7c3aed,#a855f7)" }} />
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,2.5vw,26px)", fontStyle: "italic", color: "#f0eeff", lineHeight: 1.6, marginBottom: 20, paddingLeft: 20 }}>
              "I'm not from a big agency. I'm a solo developer who cares obsessively about craft. When you work with me, you get someone who treats your project like it's their own — because to me, it is."
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 16, color: "white" }}>N</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 14, color: "#f0eeff" }}>The Developer</div>
                <div style={{ fontSize: 12, color: "#c084fc", fontFamily: "'Fira Code',monospace" }}>Founder, Nexus · Solo Dev</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="about-cta-glow" />
          <div className="about-cta-inner">
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, color: "#c084fc", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Ready to Build?</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 900, color: "#f0eeff", lineHeight: 1.1, marginBottom: 18, letterSpacing: -1 }}>
              Need a website that actually<br />
              <span style={{ fontStyle: "italic", background: "linear-gradient(135deg,#c084fc,#a855f7,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>gets results?</span>
            </h2>
            <p style={{ fontSize: 15, color: "#7b7a9a", lineHeight: 1.8, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
              I'm currently accepting new projects. Whether you need a marketplace, a SaaS platform, or a stunning landing page — reach out and let's build something remarkable.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary-about" onClick={() => onNavigate("contact")}>Start a Project</button>
              <button className="btn-secondary-about" onClick={copy}>{copied ? "✓ Copied!" : "📧 onemore9414@gmail.com"}</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(130,80,255,0.1)", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#4a4a6a", fontFamily: "'Fira Code',monospace" }}>© 2026 Nexus · Built by a solo developer</div>
          <div style={{ display: "flex", gap: 16 }}>
            {[["Privacy","privacy"],["Terms","terms"],["Cookies","cookies"]].map(([l,p])=>(
              <span key={l} onClick={() => onNavigate(p as any)} style={{ fontSize: 12, color: "#4a4a6a", cursor: "pointer", fontFamily: "'Fira Code',monospace", transition: "color 0.18s" }}
                onMouseEnter={e=>(e.currentTarget.style.color="#c084fc")} onMouseLeave={e=>(e.currentTarget.style.color="#4a4a6a")}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}