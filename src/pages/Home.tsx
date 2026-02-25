import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

interface HomeProps {
  onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void;
  session?: any;
}

export default function Home({ onNavigate, session }: HomeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W: number, H: number;
    let animId: number;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      x: number = 0; y: number = 0;
      vx: number = 0; vy: number = 0;
      r: number = 0; alpha: number = 0;
      color: string = "";
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.r = Math.random() * 1.5 + 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? "124,58,237" : "168,85,247";
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) particles.push(new Particle());

    const orbs = [
      { x: W * 0.2, y: H * 0.3, r: 200, vx: 0.15, vy: 0.1, color: "124,58,237", alpha: 0.12 },
      { x: W * 0.8, y: H * 0.7, r: 160, vx: -0.12, vy: -0.08, color: "168,85,247", alpha: 0.1 },
      { x: W * 0.5, y: H * 0.2, r: 120, vx: 0.08, vy: 0.15, color: "232,121,249", alpha: 0.07 },
    ];

    function animCanvas() {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach((o) => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r || o.x > W + o.r) o.vx *= -1;
        if (o.y < -o.r || o.y > H + o.r) o.vy *= -1;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `rgba(${o.color},${o.alpha})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
      });
      particles.forEach((p) => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 90) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animCanvas);
    }
    animCanvas();

    // Scroll reveal
    const revealEls = document.querySelectorAll(".reveal");
    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObs.observe(el));

    // Navbar scroll
    const handleScroll = () => {
      document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = (a as HTMLAnchorElement).getAttribute("href");
        if (!href || href === "#") return;
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
          }
        } catch (err) {
          console.warn("Invalid selector:", href);
        }
      });
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      revealObs.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #08080f;
          --bg2: #0d0d18;
          --surface: #111120;
          --surface2: #18182a;
          --border: rgba(130, 80, 255, 0.14);
          --border-hover: rgba(168, 85, 247, 0.4);
          --purple: #7c3aed;
          --purple-mid: #9333ea;
          --purple-light: #a855f7;
          --purple-pale: #c084fc;
          --glow: rgba(124, 58, 237, 0.35);
          --text: #f0eeff;
          --text-muted: #7b7a9a;
          --text-dim: #4a4a6a;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Outfit', sans-serif;
          overflow-x: hidden;
          cursor: auto;
        }

        #bg-canvas {
          position: fixed; inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.6;
        }

        body::after {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.4;
        }

        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none; z-index: 1;
        }

        .page { position: relative; z-index: 2; }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 40px;
          height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(8,8,15,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          transition: background 0.3s;
        }
        nav.scrolled { background: rgba(8,8,15,0.95); }

        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: var(--text);
        }
        .nav-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, var(--purple), var(--purple-light));
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          animation: logoPulse 3s ease-in-out infinite;
        }
        @keyframes logoPulse {
          0%,100% { box-shadow: 0 0 15px rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 30px rgba(124,58,237,0.7), 0 0 50px rgba(168,85,247,0.3); }
        }
        .nav-logo-icon svg { width: 18px; height: 18px; }
        .nav-logo span { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 18px; letter-spacing: -0.3px; }

        .nav-links {
          display: flex; align-items: center; gap: 6px;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 14px; font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .nav-link svg { width: 15px; height: 15px; }
        .nav-link:hover {
          color: var(--text);
          background: rgba(124,58,237,0.12);
          border-color: var(--border-hover);
        }
        .nav-link.active {
          color: var(--purple-pale);
          background: rgba(124,58,237,0.1);
          border-color: var(--border);
        }

        .nav-right { display: flex; align-items: center; gap: 10px; }
        .btn-ghost {
          padding: 8px 18px; border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent; color: var(--text);
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: inline-block;
        }
        .btn-ghost:hover { border-color: var(--border-hover); background: rgba(124,58,237,0.08); }
        .btn-purple {
          padding: 8px 20px; border-radius: 10px;
          background: linear-gradient(135deg, var(--purple), var(--purple-light));
          border: none; color: white;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          text-decoration: none; display: inline-block;
          box-shadow: 0 4px 15px rgba(124,58,237,0.3);
        }
        .btn-purple:hover { transform: translateY(-1px); box-shadow: 0 6px 25px rgba(124,58,237,0.5); }

        .nav-user { display: flex; align-items: center; gap: 10px; }
        .nav-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--purple), var(--purple-light));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-weight: 700; font-size: 13px;
          border: 2px solid rgba(168,85,247,0.4);
          cursor: pointer;
        }
        .nav-username { font-size: 14px; font-weight: 500; color: var(--text-muted); }
        .btn-logout {
          padding: 6px 14px; border-radius: 8px;
          border: 1px solid rgba(248,113,113,0.3);
          background: transparent; color: #f87171;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.2s; font-family: 'Outfit', sans-serif;
        }
        .btn-logout:hover { background: rgba(248,113,113,0.08); }

        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 120px 40px 80px;
          position: relative;
        }

        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 24px;
          animation: fadeDown 0.8s 0.1s ease both;
        }
        .hero h1 .gradient-text {
          background: linear-gradient(135deg, var(--purple-pale), var(--purple-light), #e879f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: clamp(16px, 2vw, 20px);
          color: var(--text-muted);
          max-width: 560px;
          line-height: 1.65;
          margin-bottom: 40px;
          animation: fadeDown 0.8s 0.2s ease both;
        }

        .hero-cta {
          display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
          animation: fadeDown 0.8s 0.3s ease both;
        }
        .btn-hero {
          padding: 16px 36px; border-radius: 14px;
          background: linear-gradient(135deg, var(--purple), var(--purple-light));
          border: none; color: white;
          font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          box-shadow: 0 6px 30px rgba(124,58,237,0.4);
          text-decoration: none; display: inline-block;
          position: relative; overflow: hidden;
        }
        .btn-hero::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .btn-hero:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(124,58,237,0.6); }
        .btn-hero:hover::before { opacity: 1; }

        .btn-hero-ghost {
          padding: 16px 36px; border-radius: 14px;
          border: 1px solid var(--border-hover);
          background: rgba(124,58,237,0.06); color: var(--text);
          font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          text-decoration: none; display: inline-block;
        }
        .btn-hero-ghost:hover { background: rgba(124,58,237,0.14); transform: translateY(-2px); }

        .hero-glow {
          position: absolute;
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(124,58,237,0.18), transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .scroll-indicator {
          position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          animation: fadeDown 1s 0.6s ease both;
        }
        .scroll-indicator span { font-size: 11px; color: var(--text-dim); letter-spacing: 2px; text-transform: uppercase; font-family: 'Fira Code', monospace; }
        .scroll-arrow {
          width: 20px; height: 20px; border-right: 2px solid var(--text-dim); border-bottom: 2px solid var(--text-dim);
          transform: rotate(45deg);
          animation: scrollBounce 1.5s ease-in-out infinite;
        }
        @keyframes scrollBounce { 0%,100% { transform: rotate(45deg) translateY(0); } 50% { transform: rotate(45deg) translateY(5px); } }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

        .trust-bar {
          padding: 50px 40px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          text-align: center;
          background: rgba(17,17,32,0.6);
        }
        .trust-bar p {
          font-size: 12px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--text-dim); font-family: 'Fira Code', monospace;
          margin-bottom: 32px;
        }
        .logos-track {
          display: flex; gap: 60px; justify-content: center;
          flex-wrap: wrap; align-items: center;
        }
        .logo-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 24px; border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-muted);
          font-family: 'Playfair Display', serif; font-weight: 700; font-size: 16px;
          transition: all 0.3s;
          opacity: 0.6;
        }
        .logo-pill svg { width: 22px; height: 22px; }
        .logo-pill:hover { opacity: 1; border-color: var(--border-hover); color: var(--text); transform: translateY(-2px); }

        section { padding: 100px 40px; }
        .section-tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Fira Code', monospace; font-size: 12px;
          color: var(--purple-pale); letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 16px;
        }
        .section-tag::before {
          content: ''; display: inline-block;
          width: 20px; height: 1px; background: var(--purple-light);
        }
        h2.section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 800; letter-spacing: -1px;
          line-height: 1.1; margin-bottom: 16px;
        }
        .section-sub {
          color: var(--text-muted); font-size: 17px; line-height: 1.7;
          max-width: 560px;
        }

        .problem-section { background: linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%); }
        .problem-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
          align-items: center; max-width: 1100px; margin: 60px auto 0;
        }
        .pain-list { list-style: none; margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }
        .pain-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 18px 20px; border-radius: 14px;
          border: 1px solid rgba(248,113,113,0.12);
          background: rgba(248,113,113,0.04);
          transition: all 0.3s;
        }
        .pain-item:hover { border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.07); transform: translateX(4px); }
        .pain-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(248,113,113,0.12);
          display: flex; align-items: center; justify-content: center;
        }
        .pain-icon svg { width: 18px; height: 18px; stroke: #f87171; }
        .pain-text h4 { font-family: 'Playfair Display', serif; font-weight: 700; margin-bottom: 4px; }
        .pain-text p { font-size: 14px; color: var(--text-muted); line-height: 1.5; }

        .solution-list { list-style: none; margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }
        .solution-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 18px 20px; border-radius: 14px;
          border: 1px solid rgba(52,211,153,0.12);
          background: rgba(52,211,153,0.04);
          transition: all 0.3s;
        }
        .solution-item:hover { border-color: rgba(52,211,153,0.35); transform: translateX(4px); }
        .sol-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(52,211,153,0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .sol-icon svg { width: 18px; height: 18px; stroke: #34d399; }

        .vs-divider {
          width: 2px; background: linear-gradient(to bottom, transparent, var(--border), var(--purple-light), var(--border), transparent);
          align-self: stretch;
        }

        .features-section { background: var(--bg2); }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
          max-width: 1100px; margin: 60px auto 0;
        }
        .feature-card {
          padding: 32px 28px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--surface);
          position: relative; overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
          cursor: default;
        }
        .feature-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--purple-light), transparent);
          opacity: 0; transition: opacity 0.35s;
        }
        .feature-card:hover { transform: translateY(-8px); border-color: var(--border-hover); box-shadow: 0 20px 60px rgba(124,58,237,0.15); }
        .feature-card:hover::before { opacity: 1; }
        .feature-card:hover .feature-img-wrap { transform: scale(1.03); }

        .feature-img-wrap {
          width: 100%; height: 160px; border-radius: 12px;
          margin-bottom: 22px; overflow: hidden;
          background: var(--surface2);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.35s ease;
          border: 1px solid var(--border);
          position: relative;
        }
        .feat-illus { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

        .feature-icon-badge {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, var(--purple), var(--purple-light));
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px var(--glow);
        }
        .feature-icon-badge svg { width: 22px; height: 22px; stroke: white; }
        .feature-card h3 { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .feature-card p { font-size: 14px; color: var(--text-muted); line-height: 1.65; }

        .testimonials-section { background: var(--bg); }
        .testi-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
          max-width: 1100px; margin: 60px auto 0;
        }
        .testi-card {
          padding: 30px 26px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--surface);
          transition: all 0.3s;
          position: relative;
        }
        .testi-card::before {
          content: '"';
          position: absolute; top: 20px; right: 24px;
          font-family: 'Playfair Display', serif; font-size: 72px;
          color: rgba(124,58,237,0.12); line-height: 1;
          font-weight: 800;
        }
        .testi-card:hover { transform: translateY(-6px); border-color: var(--border-hover); box-shadow: 0 16px 50px rgba(124,58,237,0.1); }
        .stars { display: flex; gap: 4px; margin-bottom: 14px; }
        .star { width: 14px; height: 14px; fill: #f59e0b; }
        .testi-text { font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 22px; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, var(--purple), var(--purple-light));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px;
          border: 2px solid rgba(168,85,247,0.3);
        }
        .testi-info h4 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px; }
        .testi-info span { font-size: 12px; color: var(--text-dim); }

        .about-section {
          background: linear-gradient(135deg, var(--bg2), var(--bg));
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .about-inner {
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px;
          align-items: center; max-width: 1100px; margin: 0 auto;
        }
        .about-visual { position: relative; }
        .about-card {
          padding: 40px; border-radius: 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .about-card::before {
          content: '';
          position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%);
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
        }
        .founder-avatar {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, var(--purple), #e879f9);
          margin: 0 auto 16px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-weight: 800; font-size: 28px;
          border: 3px solid rgba(168,85,247,0.4);
          box-shadow: 0 0 30px rgba(124,58,237,0.3);
        }
        .founder-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; }
        .founder-role { color: var(--purple-pale); font-size: 13px; margin-bottom: 16px; }
        .founder-bio { color: var(--text-muted); font-size: 14px; line-height: 1.7; }
        .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; }
        .stat-box {
          padding: 18px; border-radius: 14px;
          background: var(--surface2); border: 1px solid var(--border);
          text-align: center;
        }
        .stat-box .stat-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800; color: var(--purple-pale); }
        .stat-box .stat-label { font-size: 12px; color: var(--text-dim); margin-top: 4px; }
        .about-content h2 { margin-bottom: 20px; }
        .about-content p { color: var(--text-muted); font-size: 16px; line-height: 1.75; margin-bottom: 16px; }

        .social-section { background: var(--bg); text-align: center; }
        .social-cards { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 48px; }
        .social-card {
          padding: 32px 40px; border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--surface);
          text-decoration: none; color: var(--text);
          transition: all 0.3s;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          min-width: 160px;
        }
        .social-card:hover { transform: translateY(-8px); border-color: var(--border-hover); box-shadow: 0 20px 50px rgba(124,58,237,0.15); }
        .social-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .social-icon.yt { background: rgba(255,0,0,0.12); }
        .social-icon.ig { background: linear-gradient(135deg, rgba(240,148,51,0.12), rgba(193,53,132,0.12)); }
        .social-icon.tw { background: rgba(29,161,242,0.12); }
        .social-icon svg { width: 26px; height: 26px; }
        .social-card span { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px; }
        .social-card small { font-size: 12px; color: var(--text-dim); }

        .cta-section {
          padding: 120px 40px;
          background: linear-gradient(135deg, rgba(124,58,237,0.1), var(--bg2), rgba(168,85,247,0.08));
          border-top: 1px solid var(--border);
          text-align: center; position: relative; overflow: hidden;
        }
        .cta-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(124,58,237,0.2), transparent 70%);
          pointer-events: none;
        }
        .cta-section h2 { margin-bottom: 16px; max-width: 700px; margin-left: auto; margin-right: auto; }
        .cta-section p { color: var(--text-muted); max-width: 480px; margin: 0 auto 40px; font-size: 17px; line-height: 1.7; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 60px 40px 30px;
        }
        .footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr; gap: 40px;
          padding-bottom: 48px;
          border-bottom: 1px solid var(--border);
        }
        .footer-brand p { color: var(--text-muted); font-size: 14px; line-height: 1.7; margin-top: 14px; max-width: 260px; }
        .footer-social { display: flex; gap: 10px; margin-top: 20px; }
        .footer-social a {
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); transition: all 0.2s; text-decoration: none;
        }
        .footer-social a:hover { border-color: var(--border-hover); color: var(--text); background: rgba(124,58,237,0.08); }
        .footer-social a svg { width: 16px; height: 16px; }
        .footer-col h4 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px; margin-bottom: 16px; }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-col ul li a { color: var(--text-muted); text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .footer-col ul li a:hover { color: var(--purple-pale); }
        .footer-bottom {
          max-width: 1100px; margin: 28px auto 0;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 12px;
        }
        .footer-bottom p { font-size: 13px; color: var(--text-dim); }
        .footer-bottom-links { display: flex; gap: 20px; }
        .footer-bottom-links a { font-size: 13px; color: var(--text-dim); text-decoration: none; transition: color 0.2s; }
        .footer-bottom-links a:hover { color: var(--purple-pale); }

        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        .container { max-width: 1100px; margin: 0 auto; }
        .text-center { text-align: center; }
        .text-center .section-sub { margin: 0 auto; }

        .feat-bar { animation: barGrow 2s ease-in-out infinite alternate; transform-origin: bottom; }
        .feat-bar:nth-child(1) { animation-delay: 0s; }
        .feat-bar:nth-child(2) { animation-delay: 0.2s; }
        .feat-bar:nth-child(3) { animation-delay: 0.4s; }
        .feat-bar:nth-child(4) { animation-delay: 0.6s; }
        @keyframes barGrow { from { transform: scaleY(0.5); } to { transform: scaleY(1); } }

        .feat-orbit { animation: orbit 6s linear infinite; transform-origin: 80px 80px; }
        .feat-orbit-2 { animation: orbit 9s linear infinite reverse; transform-origin: 80px 80px; }
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .feat-typing-cursor { animation: blink 1s step-end infinite; }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        .nav-link[data-active="true"] {
          color: var(--purple-pale);
          background: rgba(124,58,237,0.1);
          border-color: var(--border);
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />

      <canvas id="bg-canvas" ref={canvasRef}></canvas>

      <div className="page">

        {/* ══ NAVBAR ══ */}
        <nav id="navbar">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="nav-logo">
            <div className="nav-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span>Nexus</span>
          </a>

          {/* Guest nav */}
          {!session ? (
            <>
              <div className="nav-links">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="nav-link" data-page="home">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                  Home
                </a>
                <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} data-page="dashboard">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  Dashboard
                </a>
                <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('buy'); }} data-page="buy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  Buy
                </a>
                <a href="#contact" className="nav-link" data-page="contact">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  Contact
                </a>
              </div>

              <div className="nav-right">
                <button onClick={() => onNavigate('login')} className="btn-ghost">Log In</button>
                <button onClick={() => onNavigate('signup')} className="btn-purple">Sign Up</button>
              </div>
            </>
          ) : (
            <>
              <div className="nav-links">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="nav-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                  Home
                </a>
                <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                  Dashboard
                </a>
                <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onNavigate('buy'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  Buy
                </a>
                <a href="#contact" className="nav-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  Contact
                </a>
              </div>

              <div className="nav-right nav-user">
                <span className="nav-username">@{session.user?.email?.split('@')?.[0] || 'user'}</span>
                <div className="nav-avatar">{session.user?.email?.[0]?.toUpperCase() || 'U'}</div>
                <button className="btn-logout" onClick={() => supabase.auth.signOut()}>Log out</button>
              </div>
            </>
          )}
        </nav>


        {/* ══ HERO ══ */}
        <section className="hero">
          <div className="hero-glow"></div>
          <h1>Build the future<br /><span className="gradient-text">without limits.</span></h1>
          <p className="hero-sub">Nexus gives your team the tools, speed, and confidence to ship products that actually matter. No noise. No bloat. Just power.</p>

          <div className="hero-cta">
            {!session ? (
              <>
                <button onClick={() => onNavigate('signup')} className="btn-hero">Start for free →</button>
                <a href="#features" className="btn-hero-ghost">See how it works</a>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('dashboard')} className="btn-hero">Go to Dashboard →</button>
                <a href="#features" className="btn-hero-ghost">See how it works</a>
              </>
            )}
          </div>
          <div className="scroll-indicator">
            <span>scroll</span>
            <div className="scroll-arrow"></div>
          </div>
        </section>


        {/* ══ TRUST BAR ══ */}
        <div className="trust-bar reveal">
          <p>Trusted & featured by world-class teams</p>
          <div className="logos-track">
            <div className="logo-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              ProductHunt
            </div>
            <div className="logo-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              TechCrunch
            </div>
            <div className="logo-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              Forbes
            </div>
            <div className="logo-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              Wired
            </div>
            <div className="logo-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              YCombinator
            </div>
          </div>
        </div>


        {/* ══ PROBLEM / SOLUTION ══ */}
        <section className="problem-section" id="problem">
          <div className="container">
            <div className="reveal text-center">
              <div className="section-tag">The Problem</div>
              <h2 className="section-title">Why teams keep<br /><span style={{ color: "var(--purple-pale)" }}>struggling to ship</span></h2>
              <p className="section-sub">Sound familiar? Most teams waste 60% of their time fighting tools instead of building products.</p>
            </div>
            <div className="problem-grid">
              <div className="problem-left reveal">
                <p className="section-tag">Pain points</p>
                <ul className="pain-list">
                  <li className="pain-item">
                    <div className="pain-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg></div>
                    <div className="pain-text"><h4>Too many disconnected tools</h4><p>Your stack is a graveyard of apps that don't talk to each other — Slack, Notion, Jira, Figma, and 12 more tabs.</p></div>
                  </li>
                  <li className="pain-item">
                    <div className="pain-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                    <div className="pain-text"><h4>Slow feedback loops</h4><p>Weeks pass before users give feedback. By then, you've built in the wrong direction.</p></div>
                  </li>
                  <li className="pain-item">
                    <div className="pain-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></div>
                    <div className="pain-text"><h4>Insight buried in chaos</h4><p>You can't act on data you can't read. Reports take a week to compile and are outdated on arrival.</p></div>
                  </li>
                </ul>
              </div>
              <div className="reveal" style={{ display: "flex", alignItems: "stretch", gap: "24px" }}>
                <div className="vs-divider"></div>
                <div style={{ flex: 1 }}>
                  <p className="section-tag">Nexus fixes it</p>
                  <ul className="solution-list">
                    <li className="solution-item">
                      <div className="sol-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                      <div className="pain-text"><h4>One unified workspace</h4><p>Everything your team needs lives in one place. No switching tabs. No context loss. Just flow.</p></div>
                    </li>
                    <li className="solution-item">
                      <div className="sol-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                      <div className="pain-text"><h4>Real-time feedback engine</h4><p>Ship faster with instant user signals baked directly into your workflow. No extra setup.</p></div>
                    </li>
                    <li className="solution-item">
                      <div className="sol-icon"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                      <div className="pain-text"><h4>Live analytics dashboard</h4><p>Decisions backed by real data, refreshed in real time. Know what's working before it's too late.</p></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ══ FEATURES ══ */}
        <section className="features-section" id="features">
          <div className="container">
            <div className="reveal text-center">
              <div className="section-tag">Features</div>
              <h2 className="section-title">Everything you need.<br /><span style={{ color: "var(--purple-pale)" }}>Nothing you don't.</span></h2>
              <p className="section-sub">Six core capabilities, designed for builders who refuse to compromise.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card reveal">
                <div className="feature-img-wrap">
                  <svg viewBox="0 0 160 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect width="160" height="120" fill="#13132a" />
                    <rect className="feat-bar" x="20" y="40" width="18" height="60" rx="4" fill="rgba(124,58,237,0.7)" />
                    <rect className="feat-bar" x="44" y="25" width="18" height="75" rx="4" fill="rgba(168,85,247,0.8)" />
                    <rect className="feat-bar" x="68" y="55" width="18" height="45" rx="4" fill="rgba(124,58,237,0.6)" />
                    <rect className="feat-bar" x="92" y="35" width="18" height="65" rx="4" fill="rgba(192,132,252,0.85)" />
                    <rect className="feat-bar" x="116" y="20" width="18" height="80" rx="4" fill="rgba(168,85,247,0.9)" />
                    <line x1="14" y1="100" x2="146" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="14" y1="75" x2="146" y2="75" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="14" y1="50" x2="146" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <polyline points="29,65 53,45 77,70 101,50 125,30" fill="none" stroke="rgba(192,132,252,0.5)" strokeWidth="2" />
                  </svg>
                </div>
                <div className="feature-icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div>
                <h3>Live Analytics</h3>
                <p>Track every metric that matters in real-time. Beautiful dashboards that refresh automatically so you're never flying blind.</p>
              </div>

              <div className="feature-card reveal" style={{ transitionDelay: "0.1s" }}>
                <div className="feature-img-wrap">
                  <svg viewBox="0 0 160 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect width="160" height="120" fill="#13132a" />
                    <circle cx="80" cy="60" r="35" fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="1" />
                    <circle cx="80" cy="60" r="22" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
                    <circle cx="80" cy="60" r="10" fill="rgba(124,58,237,0.5)" />
                    <g className="feat-orbit"><circle cx="80" cy="25" r="5" fill="rgba(192,132,252,0.9)" /></g>
                    <g className="feat-orbit-2"><circle cx="45" cy="60" r="4" fill="rgba(168,85,247,0.8)" /></g>
                    <g style={{ animation: "orbit 4s linear infinite", transformOrigin: "80px 60px" }}><circle cx="115" cy="60" r="3" fill="rgba(232,121,249,0.9)" /></g>
                    <line x1="80" y1="60" x2="80" y2="25" stroke="rgba(124,58,237,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="80" y1="60" x2="45" y2="60" stroke="rgba(124,58,237,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="80" y1="60" x2="115" y2="60" stroke="rgba(124,58,237,0.2)" strokeWidth="1" strokeDasharray="3,3" />
                  </svg>
                </div>
                <div className="feature-icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg></div>
                <h3>Global Integrations</h3>
                <p>Connect with 200+ tools your team already uses. Zapier, Slack, GitHub, Stripe — synced seamlessly in minutes.</p>
              </div>

              <div className="feature-card reveal" style={{ transitionDelay: "0.2s" }}>
                <div className="feature-img-wrap">
                  <svg viewBox="0 0 160 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect width="160" height="120" fill="#13132a" />
                    <rect x="14" y="20" width="132" height="80" rx="8" fill="rgba(124,58,237,0.06)" stroke="rgba(124,58,237,0.2)" strokeWidth="1" />
                    <text x="24" y="44" fontFamily="monospace" fontSize="9" fill="rgba(192,132,252,0.8)">const nexus = await</text>
                    <text x="24" y="58" fontFamily="monospace" fontSize="9" fill="rgba(168,85,247,0.7)">  connect(workspace)</text>
                    <text x="24" y="72" fontFamily="monospace" fontSize="9" fill="rgba(52,211,153,0.8)">// ready in 3 lines</text>
                    <rect className="feat-typing-cursor" x="24" y="82" width="6" height="10" rx="1" fill="rgba(192,132,252,0.7)" />
                  </svg>
                </div>
                <div className="feature-icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg></div>
                <h3>Developer API</h3>
                <p>A clean, RESTful API and SDKs for every major language. Build custom workflows your team actually loves using.</p>
              </div>

              <div className="feature-card reveal" style={{ transitionDelay: "0.1s" }}>
                <div className="feature-img-wrap">
                  <svg viewBox="0 0 160 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect width="160" height="120" fill="#13132a" />
                    <path d="M80 18 L110 32 L110 70 Q110 95 80 105 Q50 95 50 70 L50 32 Z" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" />
                    <path d="M80 30 L100 40 L100 68 Q100 85 80 93 Q60 85 60 68 L60 40 Z" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
                    <polyline points="70,62 77,69 93,53" fill="none" stroke="rgba(52,211,153,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="feature-icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
                <h3>Enterprise Security</h3>
                <p>SOC 2 Type II certified. End-to-end encryption, SSO, and granular role-based access controls baked in from day one.</p>
              </div>

              <div className="feature-card reveal" style={{ transitionDelay: "0.2s" }}>
                <div className="feature-img-wrap">
                  <svg viewBox="0 0 160 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect width="160" height="120" fill="#13132a" />
                    <circle cx="55" cy="55" r="22" fill="rgba(124,58,237,0.3)" stroke="rgba(124,58,237,0.6)" strokeWidth="2" />
                    <circle cx="85" cy="55" r="22" fill="rgba(168,85,247,0.3)" stroke="rgba(168,85,247,0.6)" strokeWidth="2" />
                    <circle cx="115" cy="55" r="22" fill="rgba(232,121,249,0.25)" stroke="rgba(232,121,249,0.6)" strokeWidth="2" />
                    <text x="47" y="60" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="white">A</text>
                    <text x="77" y="60" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="white">B</text>
                    <text x="107" y="60" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill="white">C</text>
                    <text x="65" y="95" fontFamily="sans-serif" fontSize="9" fill="rgba(192,132,252,0.7)">3 collaborating live</text>
                  </svg>
                </div>
                <div className="feature-icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                <h3>Team Collaboration</h3>
                <p>Real-time co-editing, threaded comments, and live presence indicators. Your whole team, finally in sync.</p>
              </div>

              <div className="feature-card reveal" style={{ transitionDelay: "0.3s" }}>
                <div className="feature-img-wrap">
                  <svg viewBox="0 0 160 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect width="160" height="120" fill="#13132a" />
                    <rect x="18" y="46" width="36" height="28" rx="6" fill="rgba(124,58,237,0.3)" stroke="rgba(124,58,237,0.6)" strokeWidth="1.5" />
                    <text x="29" y="64" fontFamily="monospace" fontSize="9" fill="white">⚡ On</text>
                    <line x1="54" y1="60" x2="70" y2="60" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" strokeDasharray="4,2" />
                    <polygon points="70,55 82,60 70,65" fill="rgba(168,85,247,0.8)" />
                    <rect x="82" y="46" width="36" height="28" rx="6" fill="rgba(168,85,247,0.25)" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" />
                    <text x="88" y="64" fontFamily="monospace" fontSize="9" fill="white">Filter</text>
                    <line x1="118" y1="60" x2="130" y2="60" stroke="rgba(192,132,252,0.6)" strokeWidth="1.5" strokeDasharray="4,2" />
                    <polygon points="130,55 142,60 130,65" fill="rgba(192,132,252,0.8)" />
                    <text x="130" y="72" fontFamily="monospace" fontSize="7" fill="rgba(192,132,252,0.7)">...</text>
                  </svg>
                </div>
                <div className="feature-icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></div>
                <h3>Smart Automation</h3>
                <p>Build no-code automation flows in minutes. Let Nexus handle the repetitive tasks while your team stays in their creative zone.</p>
              </div>
            </div>
          </div>
        </section>


        {/* ══ TESTIMONIALS ══ */}
        <section className="testimonials-section">
          <div className="container">
            <div className="reveal text-center">
              <div className="section-tag">Testimonials</div>
              <h2 className="section-title">Teams that <span style={{ color: "var(--purple-pale)" }}>love Nexus</span></h2>
              <p className="section-sub">Don't take our word for it — here's what real builders say.</p>
            </div>
            <div className="testi-grid">
              <div className="testi-card reveal">
                <div className="stars">
                  {[...Array(5)].map((_, i) => <svg key={i} className="star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                </div>
                <p className="testi-text">Nexus cut our sprint planning time in half. I didn't believe it until I saw it myself. The analytics alone paid for the subscription in week one.</p>
                <div className="testi-author">
                  <div className="testi-avatar">SR</div>
                  <div className="testi-info"><h4>Sarah Richardson</h4><span>Head of Product, Velocity Labs</span></div>
                </div>
              </div>
              <div className="testi-card reveal" style={{ transitionDelay: "0.1s" }}>
                <div className="stars">
                  {[...Array(5)].map((_, i) => <svg key={i} className="star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                </div>
                <p className="testi-text">As a solo developer, Nexus is like having a full team behind you. The automation flows saved me 15 hours last month alone. Genuinely life-changing.</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>JM</div>
                  <div className="testi-info"><h4>James Mehta</h4><span>Indie Maker & Founder, Stackr.io</span></div>
                </div>
              </div>
              <div className="testi-card reveal" style={{ transitionDelay: "0.2s" }}>
                <div className="stars">
                  {[...Array(5)].map((_, i) => <svg key={i} className="star" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                </div>
                <p className="testi-text">We evaluated 6 platforms. Nexus was the only one that felt like it was designed by people who actually build software. Switched in 24 hours. Never looked back.</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)" }}>AL</div>
                  <div className="testi-info"><h4>Aisha Li</h4><span>CTO, NovaMesh Technologies</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ══ ABOUT ══ */}
        <section className="about-section" id="about">
          <div className="about-inner">
            <div className="about-visual reveal">
              <div className="about-card">
                <div className="founder-avatar">N</div>
                <div className="founder-name">Noah Carter</div>
                <div className="founder-role">Founder & CEO of Nexus</div>
                <p className="founder-bio">Former engineering lead at two unicorns. Spent 8 years watching great teams get crushed by bad tooling. Built Nexus to fix exactly that.</p>
                <div className="about-stats">
                  <div className="stat-box"><div className="stat-num">40K+</div><div className="stat-label">Active users</div></div>
                  <div className="stat-box"><div className="stat-num">98%</div><div className="stat-label">Retention rate</div></div>
                  <div className="stat-box"><div className="stat-num">4.9★</div><div className="stat-label">Avg rating</div></div>
                  <div className="stat-box"><div className="stat-num">2021</div><div className="stat-label">Founded</div></div>
                </div>
              </div>
            </div>
            <div className="about-content reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="section-tag">About Nexus</div>
              <h2 className="section-title">We're builders<br /><span style={{ color: "var(--purple-pale)" }}>who got tired</span> of bad tools.</h2>
              <p>Nexus started from a simple frustration: why does shipping software feel so unnecessarily hard? Too many meetings about meetings. Too many tools talking to none of the others. Too many brilliant teams moving slow.</p>
              <p>So we built the platform we always wanted — one that gets out of your way and lets you do your best work. We're remote-first, founder-led, and obsessed with the experience of building software.</p>
              <p>Today, over 40,000 teams across 80 countries trust Nexus to run their most critical workflows. We're just getting started.</p>
              <div style={{ marginTop: "28px" }}>
                <button onClick={() => onNavigate('signup')} className="btn-hero" style={{ display: "inline-block" }}>Join us — it's free</button>
              </div>
            </div>
          </div>
        </section>


        {/* ══ SOCIAL MEDIA ══ */}
        <section className="social-section">
          <div className="container">
            <div className="reveal text-center">
              <div className="section-tag">Community</div>
              <h2 className="section-title">Follow along<br /><span style={{ color: "var(--purple-pale)" }}>as we build</span></h2>
              <p className="section-sub">Behind the scenes, tutorials, and product updates — across all platforms.</p>
            </div>
            <div className="social-cards reveal">
              <a href="#" className="social-card">
                <div className="social-icon yt">
                  <svg viewBox="0 0 24 24" fill="#ff0000"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>
                </div>
                <span>YouTube</span>
                <small>Weekly build logs</small>
              </a>
              <a href="#" className="social-card">
                <div className="social-icon ig">
                  <svg viewBox="0 0 24 24" fill="none">
                    <defs><linearGradient id="igGrad" x1="0" y1="24" x2="24" y2="0"><stop offset="0%" stopColor="#f09433" /><stop offset="25%" stopColor="#e6683c" /><stop offset="50%" stopColor="#dc2743" /><stop offset="75%" stopColor="#cc2366" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#igGrad)" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" stroke="url(#igGrad)" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1" fill="#cc2366" />
                  </svg>
                </div>
                <span>Instagram</span>
                <small>Design & culture</small>
              </a>
              <a href="#" className="social-card">
                <div className="social-icon tw">
                  <svg viewBox="0 0 24 24" fill="#1d9bf0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </div>
                <span>Twitter / X</span>
                <small>Hot takes & updates</small>
              </a>
            </div>
          </div>
        </section>


        {/* ══ FINAL CTA ══ */}
        <section className="cta-section">
          <div className="cta-glow"></div>
          <div className="reveal">
            <div className="section-tag" style={{ justifyContent: "center" }}>Limited early access</div>
            <h2 className="section-title">Ready to ship<br /><span style={{ color: "var(--purple-pale)" }}>10x faster?</span></h2>
            <p>Join 40,000+ teams who stopped fighting their tools and started building the things that actually matter. Your first workspace is always free.</p>
            <div className="cta-btns">
              {!session ? (
                <>
                  <button onClick={() => onNavigate('signup')} className="btn-hero">Create free account →</button>
                  <button onClick={() => onNavigate('login')} className="btn-hero-ghost">I have an account</button>
                </>
              ) : (
                <button onClick={() => onNavigate('dashboard')} className="btn-hero">Go to Dashboard →</button>
              )}
            </div>
          </div>
        </section>


        {/* ══ FOOTER ══ */}
        <footer id="contact">
          <div className="footer-inner">
            <div className="footer-brand">
              <a href="home.html" className="nav-logo" style={{ display: "inline-flex" }}>
                <div className="nav-logo-icon"><svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
                <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: "18px" }}>Nexus</span>
              </a>
              <p>The all-in-one workspace for modern teams who build software that matters.</p>
              <div className="footer-social">
                <a href="#">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="#">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
                </a>
                <a href="#">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#08080f" /></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Pages</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>About</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>Contact Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}>Join Us</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>Dashboard</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal & Contact</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}>Terms of Service</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('cookies'); }}>Cookie Policy</a></li>
                <li><a href="mailto:hello@nexus.io">hello@nexus.io</a></li>
                <li><a href="#">Support Center</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Nexus Inc. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}>Privacy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}>Terms</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('cookies'); }}>Cookies</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}