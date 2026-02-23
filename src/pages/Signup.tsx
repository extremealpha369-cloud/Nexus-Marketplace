import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../lib/supabase";

const PURPLE = "linear-gradient(135deg, #7c3aed, #a855f7)";

function Spinner() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
        animation: "spin 0.7s linear infinite"
      }} />
    </div>
  );
}

function IconZap() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function IconKey() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5" /><path d="M21 2l-9.6 9.6" /><path d="M15.5 7.5l3 3L22 7l-3-3" /></svg>;
}
function IconMail() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>;
}
function IconLock() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
function IconUser() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function IconShield() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>;
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
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
}
function IconChrome() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="#4285F4"/><path d="M12 8h8.5M6.5 17.5l4-7M17.5 17.5l-10 0" stroke="#4285F4" strokeWidth="2"/></svg>;
}
function IconDiscord() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>;
}

const s = {
  page: {
    minHeight: "100vh", width: "100%", display: "flex",
    alignItems: "center", justifyContent: "center", padding: 16,
    background: "#0f0a1e", position: "relative", overflow: "hidden",
    fontFamily: "'Segoe UI', sans-serif", color: "#e2e0f0",
  },
  orb1: {
    position: "absolute", top: -150, right: -100,
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)",
    filter: "blur(80px)", pointerEvents: "none",
  },
  orb2: {
    position: "absolute", bottom: -100, left: -100,
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
    borderRadius: 8,
  },
  logoWrap: { display: "flex", justifyContent: "center", marginBottom: 24 },
  logo: {
    width: 52, height: 52, borderRadius: 14, background: PURPLE,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 30px rgba(124,58,237,0.5)",
    animation: "pulse-shadow 3s ease-in-out infinite",
  },
  h1: { fontWeight: 800, fontSize: 26, textAlign: "center", letterSpacing: "-0.5px", marginBottom: 6, marginTop: 0 },
  sub: { color: "rgba(180,160,220,0.7)", fontSize: 14, textAlign: "center", marginBottom: 28 },
  errorBox: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171", fontSize: 12, padding: "10px 14px",
    borderRadius: 10, marginBottom: 16, textAlign: "center",
  },
  socialBtn: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
    gap: 10, padding: "12px 16px", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
    cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#e2e0f0", marginBottom: 10,
  },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "20px 0" },
  divLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.1)" },
  divText: { fontSize: 11, color: "rgba(180,160,220,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" },
  label: { fontSize: 13, fontWeight: 500, color: "rgba(180,160,220,0.8)", display: "block", marginBottom: 6, marginLeft: 2 },
  inputWrap: { position: "relative", marginBottom: 16 },
  iconLeft: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(180,160,220,0.5)", pointerEvents: "none" },
  input: {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
    padding: "12px 44px", fontSize: 14, color: "#e2e0f0",
    outline: "none", boxSizing: "border-box",
  },
  primaryBtn: (success: boolean) => ({
    width: "100%", padding: "14px 0", borderRadius: 12,
    fontWeight: 700, fontSize: 15, letterSpacing: "0.04em",
    border: "none", cursor: "pointer", position: "relative",
    overflow: "hidden", marginTop: 8,
    background: success ? "#16a34a" : PURPLE, color: "#fff",
    boxShadow: success ? "0 4px 20px rgba(22,163,74,0.3)" : "0 4px 20px rgba(124,58,237,0.35)",
  }),
  switchRow: { textAlign: "center", marginTop: 24, fontSize: 13, color: "rgba(180,160,220,0.7)" },
  switchBtn: { background: "none", border: "none", cursor: "pointer", color: "#a855f7", fontWeight: 600, fontSize: 13, padding: 0 },
  strengthBar: (active: boolean, color: string) => ({
    height: 3, flex: 1, borderRadius: 99,
    background: active ? color : "rgba(255,255,255,0.1)", transition: "background 0.3s",
  }),
  codeWrap: { display: "flex", gap: 8, justifyContent: "space-between", marginBottom: 4 },
  codeInput: {
    width: "100%", maxWidth: 52, aspectRatio: "1",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
    textAlign: "center", fontSize: 20, fontWeight: 700,
    color: "#e2e0f0", outline: "none",
  },
  emailHighlight: {
    color: "#a855f7", fontWeight: 600, fontSize: 14,
    textAlign: "center", marginBottom: 28, marginTop: -20,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 16px",
  },
  checkboxRow: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", marginBottom: 4 },
  checkboxLabel: { fontSize: 12, color: "rgba(180,160,220,0.7)", lineHeight: 1.6, cursor: "pointer" },
  link: { color: "#a855f7", textDecoration: "none" },
};

const strengthColors = ["#ef4444", "#ef4444", "#f59e0b", "#f59e0b", "#10b981"];
const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];

interface SignupProps {
  onSwitch: () => void;
  onBack: () => void;
}

export default function Signup({ onSwitch, onBack }: SignupProps) {
  const [view, setView] = useState("signup"); // signup | verify

  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [strength, setStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Verify fields
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);

  useEffect(() => {
    if (!password) { setStrength(0); return; }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!termsAccepted) { setError("You must accept the Terms of Service."); return; }
    setIsLoading(true);
    
    try {
      const APP_URL = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, "");
      // Redirect to root to avoid 404s
      const OAUTH_CALLBACK_URL = `${APP_URL}`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: OAUTH_CALLBACK_URL,
        },
      });

      if (error) throw error;

      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setError("User already exists. Please sign in or reset password.");
        return;
      }

      // On success → go to verify view (which we'll use as a "Check Email" success screen)
      setView("verify");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'discord') => {
    try {
      // Use a stable app URL env, not implicit origin only.
      const APP_URL = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, "");
      // Redirect to root to avoid 404s on Vercel if rewrites fail
      const OAUTH_CALLBACK_URL = `${APP_URL}`;

      console.log(`Attempting ${provider} signup with redirect: ${OAUTH_CALLBACK_URL}`);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: OAUTH_CALLBACK_URL,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Social Signup Error:", err);
      setError(err.message || `Failed to sign up with ${provider}`);
    }
  };

  const handleCodeInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...code];
    updated[i] = val.slice(-1);
    setCode(updated);
    if (val && i < 5) document.getElementById(`vc${i + 1}`)?.focus();
  };

  const handleCodeKeyDown = (i: number, e: KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) document.getElementById(`vc${i - 1}`)?.focus();
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setVerifyError("");
    if (code.join("").length < 6) { setVerifyError("Please enter the full 6-digit code."); return; }
    setVerifyLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code.join(""),
        type: 'signup'
      });

      if (error) throw error;

      setVerifySuccess(true);
      // Auth state change in App.tsx will handle redirection to dashboard
    } catch (err: any) {
      setVerifyError(err.message || "Invalid code.");
    } finally {
      setVerifyLoading(false);
    }
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
      `}</style>

      <div style={s.orb1} />
      <div style={s.orb2} />

      <div style={s.card}>

        {/* ── SIGNUP VIEW ── */}
        {view === "signup" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <button style={s.backBtn} onClick={onBack}><IconArrow /></button>

            <div style={s.logoWrap}>
              <div style={s.logo}><IconZap /></div>
            </div>

            <h1 style={s.h1}>Create account</h1>
            <p style={s.sub}>Join Nexus — it's free forever</p>

            {error && <div style={s.errorBox}>{error}</div>}

            <div style={{ marginBottom: 20 }}>
              <button style={s.socialBtn} onClick={() => handleSocialLogin('google')}><IconChrome /> Continue with Google</button>
              <button style={s.socialBtn} onClick={() => handleSocialLogin('discord')}><IconDiscord /> Continue with Discord</button>
            </div>

            <div style={s.divider}>
              <div style={s.divLine} />
              <span style={s.divText}>or sign up with email</span>
              <div style={s.divLine} />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <label style={s.label}>Full Name</label>
              <div style={s.inputWrap}>
                <span style={s.iconLeft}><IconUser /></span>
                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} style={{ ...s.input, paddingLeft: 44 }} />
              </div>

              {/* Email */}
              <label style={s.label}>Email</label>
              <div style={s.inputWrap}>
                <span style={s.iconLeft}><IconMail /></span>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={{ ...s.input, paddingLeft: 44 }} />
              </div>

              {/* Password */}
              <label style={s.label}>Password</label>
              <div style={s.inputWrap}>
                <span style={s.iconLeft}><IconLock /></span>
                <input
                  type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...s.input, paddingLeft: 44, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(180,160,220,0.6)", padding: 4 }}>
                  <IconEye off={showPw} />
                </button>
              </div>

              {/* Strength bar */}
              {password && (
                <div style={{ marginTop: -10, marginBottom: 16, paddingLeft: 2, paddingRight: 2 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                    {[1,2,3,4].map(i => <div key={i} style={s.strengthBar(i <= strength, strengthColors[strength])} />)}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 600, margin: 0, color: strength <= 1 ? "#f87171" : strength <= 3 ? "#fbbf24" : "#34d399" }}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}

              {/* Confirm Password */}
              <label style={s.label}>Confirm Password</label>
              <div style={s.inputWrap}>
                <span style={s.iconLeft}><IconShield /></span>
                <input
                  type={showConfirm ? "text" : "password"} placeholder="Re-enter password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  style={{ ...s.input, paddingLeft: 44, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(180,160,220,0.6)", padding: 4 }}>
                  <IconEye off={showConfirm} />
                </button>
              </div>

              {/* Terms */}
              <div style={s.checkboxRow}>
                <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                  style={{ marginTop: 3, width: 16, height: 16, accentColor: "#7c3aed", cursor: "pointer" }} />
                <label htmlFor="terms" style={s.checkboxLabel}>
                  I agree to the <a href="#" style={s.link}>Terms of Service</a> and <a href="#" style={s.link}>Privacy Policy</a>
                </label>
              </div>

              <button type="submit" disabled={isLoading} style={s.primaryBtn(false)}>
                <span style={{ opacity: isLoading ? 0 : 1 }}>Create Account</span>
                {isLoading && <Spinner />}
              </button>
            </form>

            <div style={s.switchRow}>
              Already have an account?{" "}
              <button style={s.switchBtn} onClick={onSwitch}>Sign in</button>
            </div>
          </div>
        )}

        {/* ── VERIFY VIEW ── */}
        {view === "verify" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            <button style={s.backBtn} onClick={() => { setVerifyError(""); setCode(["","","","","",""]); setView("signup"); }}>
            <button style={s.backBtn} onClick={() => { setView("signup"); }}>
              <IconArrow />
            </button>

            <div style={s.logoWrap}>
              <div style={s.logo}><IconKey /></div>
            </div>

            <h1 style={s.h1}>Check your email</h1>
            <p style={{ ...s.sub, marginBottom: 8 }}>We sent a confirmation link to</p>
            <div style={s.emailHighlight}>{email}</div>

            {verifyError && <div style={s.errorBox}>{verifyError}</div>}

            <div style={{ textAlign: "center", marginBottom: 20, fontSize: 13, color: "rgba(180,160,220,0.7)" }}>
              Please click the link in your email to verify your account.
            </div>

            <button onClick={() => onSwitch()} style={s.primaryBtn(false)}>
              Go to Sign In
            </button>

            <div style={s.switchRow}>
              Didn't receive it?{" "}
              <button style={s.switchBtn} onClick={async () => { 
                // Resend confirmation email logic
                const APP_URL = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, "");
                const OAUTH_CALLBACK_URL = `${APP_URL}`;
                
                await supabase.auth.resend({
                  type: 'signup',
                  email: email,
                  options: {
                    emailRedirectTo: OAUTH_CALLBACK_URL,
                  }
                });
              }}>
                Resend email
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}