import { useState } from "react";
import { supabase } from "../lib/supabase";

const PURPLE = "linear-gradient(135deg, #7c3aed, #a855f7)";

export default function UpdatePassword({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => onNavigate('dashboard'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0a1e", color: "#e2e0f0", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 40, background: "rgba(20,12,40,0.92)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)" }}>
        <h1 style={{ textAlign: "center", marginBottom: 20, fontSize: 24, fontWeight: 700 }}>Update Password</h1>
        {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 13, textAlign: "center" }}>{error}</div>}
        
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(180,160,220,0.8)" }}>New Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || success}
            style={{ width: "100%", padding: "14px", borderRadius: 12, background: success ? "#16a34a" : PURPLE, border: "none", color: "white", fontWeight: 700, cursor: "pointer" }}
          >
            {loading ? "Updating..." : success ? "Password Updated!" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
