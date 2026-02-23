import { useState, FormEvent, ReactNode } from "react";
import { supabase } from "../lib/supabase";

const PURPLE = "linear-gradient(135deg, #7c3aed, #a855f7)";

function Spinner() {
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex",
      alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        animation: "spin 0.7s linear infinite"
      }} />
    </div>
  );
}

function IconZap() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function IconKey() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconEye({ off }: { off: boolean }) {
  return off ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function IconChrome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" fill="#4285F4"/>
      <path d="M12 8h8.5M6.5 17.5l4-7M17.5 17.5l-10 0" stroke="#4285F4" strokeWidth="2"/>
    </svg>
  );
}
function IconDiscord() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

const s: any = {
  page: {
    minHeight: "100vh", width: "100%", display: "flex",
    alignItems: "center", justifyContent: "center", padding: 16,
    background: "#0f0a1e", position: "relative", overflow: "hidden",
    fontFamily: "'Segoe UI', sans-serif", color: "#e2e0f0",
  },
  orb1: {
    position: "absolute", top: -150, left: -100,
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)",
    filter: "blur(80px)", pointerEvents: "none",
  },
  orb2: {
    position: "absolute", bottom: -100, right: -100,
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)",
    filter: "blur(80px)", pointerEvents: "none",
  },
  card: {
    position: "relative", zIndex: 10, width: "100%", maxWidth: 440,
    background: "rgba(20,12,40,0.92)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24, padding: "44px 44px", boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    backdropFilter: "blur(20px)",
  },
  backBtn: {
    position: "absolute", top: 20, left: 20, padding: 8,
    background: "none", border: "none", cursor: "pointer",
    color: "rgba(180,160,220,0.7)", display: "flex", alignItems: "center",
    borderRadius: 8, transition: "color 0.2s",
  },
  logoWrap: {
    display: "flex", justifyContent: "center", marginBottom: 28,
  },
  logo: {
    width: 52, height: 52, borderRadius: 14,
    background: PURPLE, display: "flex",
    alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 30px rgba(124,58,237,0.5)",
  },
  h1: {
    fontWeight: 800, fontSize: 26, textAlign: "center",
    letterSpacing: "-0.5px", marginBottom: 6, marginTop: 0,
  },
  sub: {
    color: "rgba(180,160,220,0.7)", fontSize: 14,
    textAlign: "center", marginBottom: 32,
  },
  errorBox: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171", fontSize: 12, padding: "10px 14px",
    borderRadius: 10, marginBottom: 16, textAlign: "center",
  },
  socialBtn: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 10, padding: "12px 16px",
    borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)", cursor: "pointer",
    fontSize: 14, fontWeight: 500, color: "#e2e0f0",
    marginBottom: 10, transition: "all 0.2s",
  },
  divider: {
    display: "flex", alignItems: "center", gap: 12, margin: "20px 0",
  },
  divLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.1)" },
  divText: {
    fontSize: 11, color: "rgba(180,160,220,0.6)",
    textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
  },
  label: {
    fontSize: 13, fontWeight: 500, color: "rgba(180,160,220,0.8)",
    display: "block", marginBottom: 6, marginLeft: 2,
  },
  inputWrap: { position: "relative", marginBottom: 16 },
  iconLeft: {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    color: "rgba(180,160,220,0.5)", pointerEvents: "none",
  },
  input: {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
    padding: "12px 44px", fontSize: 14, color: "#e2e0f0",
    outline: "none", boxSizing: "border-box", transition: "border 0.2s",
  },
  forgotLink: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 12, color: "#a855f7", opacity: 0.85,
    padding: 0, marginTop: 4, float: "right",
    transition: "opacity 0.2s",
  },
  primaryBtn: (success: boolean) => ({
    width: "100%", padding: "14px 0", borderRadius: 12,
    fontWeight: 700, fontSize: 15, letterSpacing: "0.04em",
    border: "none", cursor: "pointer", position: "relative",
    overflow: "hidden", transition: "all 0.2s", marginTop: 8,
    background: success ? "#16a34a" : PURPLE,
    color: "#fff",
    boxShadow: success ? "0 4px 20px rgba(22,163,74,0.3)" : "0 4px 20px rgba(124,58,237,0.35)",
  }),
  switchRow: {
    textAlign: "center", marginTop: 24,
    fontSize: 13, color: "rgba(180,160,220,0.7)",
  },
  switchBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#a855f7", fontWeight: 600, fontSize: 13, padding: 0,
  },
  // Code inputs
  codeWrap: {
    display: "flex", gap: 8, justifyContent: "space-between", marginBottom: 4,
  },
  codeInput: {
    width: "100%", maxWidth: 52, aspectRatio: "1",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
    textAlign: "center", fontSize: 20, fontWeight: 700,
    color: "#e2e0f0", outline: "none", transition: "border 0.2s",
  },
  emailHighlight: {
    color: "#a855f7", fontWeight: 600, fontSize: 14,
    textAlign: "center", marginBottom: 28, marginTop: -20,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    padding: "0 16px",
  },
};

interface LoginProps {
  onSwitch: () => void;
  onBack: () => void;
}

export default function Login({ onSwitch, onBack }: LoginProps) {
  const [view, setView] = useState("login"); // login | forgot-email | forgot-code

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Forgot state
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // ── Handlers ──
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!email || !password) { setLoginError("Please fill in all fields."); return; }
    setLoginLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Login successful, session should update");
      setLoginSuccess(true);
      // App.tsx handles navigation via onAuthStateChange
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.message && err.message.includes("Email not confirmed")) {
        setLoginError("Please verify your email address before signing in.");
      } else {
        setLoginError(err.message || "Failed to sign in.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'discord') => {
    try {
      // Use a stable app URL env, not implicit origin only.
      const APP_URL = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, "");
      // Redirect to root to avoid 404s on Vercel if rewrites fail
      const OAUTH_CALLBACK_URL = `${APP_URL}`;
        
      console.log(`Attempting ${provider} login with redirect: ${OAUTH_CALLBACK_URL}`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: OAUTH_CALLBACK_URL,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Social Login Error:", err);
      setLoginError(err.message || `Failed to sign in with ${provider}`);
    }
  };

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (!resetEmail) { setResetError("Please enter your email address."); return; }
    setResetLoading(true);
    
    try {
      const APP_URL = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, "");
      // Redirect to root to avoid 404s. App.tsx handles PASSWORD_RECOVERY event.
      const RESET_PASSWORD_URL = `${APP_URL}`;
      console.log(`Sending reset email to ${resetEmail} with redirect: ${RESET_PASSWORD_URL}`);

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: RESET_PASSWORD_URL,
      });
      if (error) throw error;

      setResetSuccess(true);
      setTimeout(() => { 
        setResetSuccess(false); 
        // We skip the 'forgot-code' view because Supabase sends a link, not a code.
        // Instead, we show a success message or return to login.
        setView("login");
        setLoginError("Password reset link sent to your email.");
      }, 2000);
    } catch (err: any) {
      setResetError(err.message || "Failed to send reset email.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setResetEmail(email);
    setResetError("");
    setView("forgot-email");
  };

  const goBackToLogin = () => {
    setResetError(""); setView("login");
  };

  // ── Shared sub-components ──
  const LogoBox = ({ icon }: { icon: ReactNode }) => (
    <div style={s.logoWrap}>
      <div style={{ ...s.logo, animation: "pulse-shadow 3s ease-in-out infinite" }}>
        {icon}
      </div>
    </div>
  );

  const ErrorBanner = ({ msg }: { msg: string }) => msg ? <div style={s.errorBox}>{msg}</div> : null;

  const PrimaryBtn = ({ label, loading, success, successLabel, onClick, type = "submit" }: any) => (
    <button type={type} onClick={onClick} disabled={loading || success} style={s.primaryBtn(success)}>
      <span style={{ opacity: loading ? 0 : 1 }}>
        {success ? `✓ ${successLabel}` : label}
      </span>
      {loading && <Spinner />}
    </button>
  );

  // ── VIEWS ──
  const views: any = {

    login: (
      <div key="login" style={{ animation: "fadeUp 0.4s ease both" }}>
        <button style={s.backBtn} onClick={onBack}>
          <IconArrow />
        </button>
        <LogoBox icon={<IconZap />} />
        <h1 style={s.h1}>Welcome back</h1>
        <p style={s.sub}>Sign in to your Nexus account</p>
        <ErrorBanner msg={loginError} />

        <div style={{ marginBottom: 20 }}>
          <button style={s.socialBtn} onClick={() => handleSocialLogin('google')}><IconChrome /> Continue with Google</button>
          <button style={s.socialBtn} onClick={() => handleSocialLogin('discord')}><IconDiscord /> Continue with Discord</button>
        </div>

        <div style={s.divider}>
          <div style={s.divLine} />
          <span style={s.divText}>or sign in with email</span>
          <div style={s.divLine} />
        </div>

        <form onSubmit={handleLogin}>
          <label style={s.label}>Email</label>
          <div style={s.inputWrap}>
            <span style={s.iconLeft}><IconMail /></span>
            <input
              type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              style={{ ...s.input, paddingLeft: 44 }}
            />
          </div>

          <label style={s.label}>Password</label>
          <div style={s.inputWrap}>
            <span style={s.iconLeft}><IconLock /></span>
            <input
              type={showPw ? "text" : "password"} placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ ...s.input, paddingLeft: 44, paddingRight: 44 }}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(180,160,220,0.6)", padding: 4,
            }}>
              <IconEye off={showPw} />
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -10, marginBottom: 16 }}>
            <button
              type="button"
              style={s.forgotLink}
              onClick={handleForgotPasswordClick}
            >
              Forgot password?
            </button>
          </div>

          <PrimaryBtn label="Sign In" loading={loginLoading} success={loginSuccess} successLabel="Success" />
        </form>

        <div style={s.switchRow}>
          Don't have an account?{" "}
          <button style={s.switchBtn} onClick={onSwitch}>Create one</button>
        </div>
      </div>
    ),

    "forgot-email": (
      <div key="forgot-email" style={{ animation: "fadeUp 0.4s ease both" }}>
        <button style={s.backBtn} onClick={goBackToLogin}><IconArrow /></button>
        <LogoBox icon={<IconSend />} />
        <h1 style={s.h1}>Reset password</h1>
        <p style={s.sub}>Enter your email and we'll send you a reset link.</p>
        <ErrorBanner msg={resetError} />

        <form onSubmit={handleSendCode}>
          <label style={s.label}>Email address</label>
          <div style={s.inputWrap}>
            <span style={s.iconLeft}><IconMail /></span>
            <input
              type="email" placeholder="you@example.com" autoFocus
              value={resetEmail} onChange={e => setResetEmail(e.target.value)}
              style={{ ...s.input, paddingLeft: 44 }}
            />
          </div>
          <PrimaryBtn label="Send Link" loading={resetLoading} success={resetSuccess} successLabel="Link Sent!" />
        </form>

        <div style={s.switchRow}>
          Remember it?{" "}
          <button style={s.switchBtn} onClick={goBackToLogin}>Back to sign in</button>
        </div>
      </div>
    ),
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes pulse-shadow {
          0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 45px rgba(124,58,237,0.7); }
        }
        input::placeholder { color: rgba(180,160,220,0.35); }
        input:focus { border-color: #a855f7 !important; box-shadow: 0 0 0 4px rgba(124,58,237,0.12); }
        button:not([type="submit"]):hover { opacity: 0.85; }
      `}</style>

      <div style={s.orb1} />
      <div style={s.orb2} />

      <div style={s.card}>
        {views[view]}
      </div>
    </div>
  );
}