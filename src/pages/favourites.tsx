import { useState, useCallback, useMemo, useRef, useEffect, memo } from "react";
import { supabase } from "../lib/supabase";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Seller {
  id: string; name: string; initials: string; verified: boolean;
  rating: number; sales: number; location: string; avatarGradient: string;
}
interface SavedProduct {
  id: string; title: string; description: string; price: number; originalPrice?: number;
  currency: string; category: string; subcategory: string; condition: string; brand: string;
  tags: string[]; thumbnailGradient: string; seller: Seller; rating: number;
  reviewCount: number; stock: number; shipping: string; shippingPrice: number;
  returns: string; postedAt: string; views: number; saves: number;
  featured: boolean; badge?: string; savedAt: Date; notes: string;
  priority: "high" | "medium" | "low"; notifyOnDrop: boolean;
}

type SortMode = "Date Saved" | "Price: Low" | "Price: High" | "Rating" | "Most Viewed" | "Priority";
type ViewMode = "grid" | "list" | "mood";
type PriorityFilter = "all" | "high" | "medium" | "low";

// ── MOCK DATA ──────────────────────────────────────────────────────────────
const SELLERS: Seller[] = [
  { id: "s1", name: "Aria Voss", initials: "AV", verified: true, rating: 4.9, sales: 1240, location: "New York, US", avatarGradient: "linear-gradient(135deg,#7c3aed,#a855f7)" },
  { id: "s2", name: "Kai Tanaka", initials: "KT", verified: true, rating: 4.8, sales: 876, location: "Tokyo, JP", avatarGradient: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
  { id: "s3", name: "Mira Osei", initials: "MO", verified: false, rating: 4.7, sales: 432, location: "London, UK", avatarGradient: "linear-gradient(135deg,#ec4899,#8b5cf6)" },
  { id: "s4", name: "Luca Ferri", initials: "LF", verified: true, rating: 5.0, sales: 2100, location: "Milan, IT", avatarGradient: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { id: "s5", name: "Zoe Chen", initials: "ZC", verified: true, rating: 4.6, sales: 658, location: "Singapore", avatarGradient: "linear-gradient(135deg,#34d399,#059669)" },
];

const MOCK_FAVOURITES: SavedProduct[] = [
  { id: "p1", title: "Arc Flow Pro Mechanical Keyboard", description: "A precision-engineered 75% mechanical keyboard with POM plate, gasket mount, and lubed Gateron Oil King switches.", price: 349, originalPrice: 420, currency: "USD", category: "Electronics", subcategory: "Keyboards", condition: "New", brand: "ArcStudio", tags: ["keyboard", "mechanical", "premium", "75%"], thumbnailGradient: "linear-gradient(135deg,#1a1035 0%,#2d1b69 50%,#4c1d95 100%)", seller: SELLERS[0], rating: 4.9, reviewCount: 128, stock: 7, shipping: "Express (2-3 days)", shippingPrice: 0, returns: "30-day returns", postedAt: "2 days ago", views: 3420, saves: 241, featured: true, badge: "Best Seller", savedAt: new Date("2025-02-01"), notes: "Perfect for my home office setup", priority: "high", notifyOnDrop: true },
  { id: "p6", title: "Mono Wireless Earbuds — Titanium", description: "Machined from aerospace-grade titanium. Hybrid ANC with 42dB attenuation, 32-hour playtime, custom-tuned 10mm beryllium-coated driver.", price: 599, originalPrice: 699, currency: "USD", category: "Electronics", subcategory: "Audio", condition: "New", brand: "Mono Labs", tags: ["earbuds", "titanium", "ANC", "wireless"], thumbnailGradient: "linear-gradient(135deg,#0c0a1e 0%,#1e1b4b 50%,#312e81 100%)", seller: SELLERS[4], rating: 4.7, reviewCount: 203, stock: 11, shipping: "Express (1-2 days)", shippingPrice: 0, returns: "30-day returns", postedAt: "4 days ago", views: 7840, saves: 1023, featured: true, badge: "Top Rated", savedAt: new Date("2025-02-05"), notes: "", priority: "high", notifyOnDrop: true },
  { id: "p2", title: "Shiro Ceramic Pour-Over Set", description: "Handcrafted in Kyoto by master ceramicist Hiroshi Yamada. Each piece is unique with subtle celadon glazing.", price: 195, currency: "USD", category: "Home & Kitchen", subcategory: "Coffee", condition: "New", brand: "Yamada Ceramics", tags: ["coffee", "ceramic", "handcrafted", "kyoto"], thumbnailGradient: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#164e63 100%)", seller: SELLERS[1], rating: 5.0, reviewCount: 64, stock: 3, shipping: "Standard (5-7 days)", shippingPrice: 12, returns: "14-day returns", postedAt: "1 week ago", views: 1870, saves: 189, featured: true, badge: "Rare Find", savedAt: new Date("2025-01-28"), notes: "Gift idea for mum's birthday", priority: "medium", notifyOnDrop: false },
  { id: "p3", title: "Obsidian Leather Folio Wallet", description: "Full-grain vegetable-tanned leather with a hand-stitched obsidian finish. Features 8 card slots, 2 hidden compartments.", price: 128, currency: "USD", category: "Fashion", subcategory: "Accessories", condition: "New", brand: "Ferri Milano", tags: ["wallet", "leather", "italian", "luxury"], thumbnailGradient: "linear-gradient(135deg,#1c1917 0%,#292524 50%,#44403c 100%)", seller: SELLERS[3], rating: 5.0, reviewCount: 312, stock: 14, shipping: "Express (1-2 days)", shippingPrice: 0, returns: "60-day returns", postedAt: "3 days ago", views: 5620, saves: 892, featured: false, badge: "Editor's Pick", savedAt: new Date("2025-01-20"), notes: "Replace current wallet", priority: "medium", notifyOnDrop: false },
  { id: "p8", title: "Nexus Dev Stack License — Pro", description: "Lifetime license for the complete Nexus developer toolkit. Includes CLI, API access (5M requests/mo), priority support, and all future updates.", price: 399, currency: "USD", category: "Software", subcategory: "Developer Tools", condition: "Digital", brand: "Nexus", tags: ["software", "license", "developer", "API"], thumbnailGradient: "linear-gradient(135deg,#0d0520 0%,#1a0938 50%,#3b0764 100%)", seller: SELLERS[4], rating: 4.9, reviewCount: 567, stock: 999, shipping: "Instant Download", shippingPrice: 0, returns: "7-day refund", postedAt: "6 months ago", views: 24300, saves: 3410, featured: true, badge: "Digital", savedAt: new Date("2025-01-15"), notes: "Check team budget first", priority: "low", notifyOnDrop: false },
  { id: "p4", title: "Lumina Desk Light — Matte Black", description: "Architectural task lighting inspired by Bauhaus principles. 4000K CRI-95 LED with stepless dimming and a 360° articulating arm.", price: 285, originalPrice: 310, currency: "USD", category: "Home & Kitchen", subcategory: "Lighting", condition: "New", brand: "Lumina Studio", tags: ["desk lamp", "bauhaus", "LED", "minimal"], thumbnailGradient: "linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 50%,#16213e 100%)", seller: SELLERS[4], rating: 4.8, reviewCount: 97, stock: 22, shipping: "Standard (3-5 days)", shippingPrice: 0, returns: "30-day returns", postedAt: "5 days ago", views: 2130, saves: 304, featured: false, savedAt: new Date("2025-01-10"), notes: "", priority: "low", notifyOnDrop: true },
  { id: "p5", title: "Voss Silk Scarf — Midnight Garden", description: "100% mulberry silk twill, hand-rolled edges, 140×140cm. Printed with original botanical illustration, individually numbered.", price: 220, currency: "USD", category: "Fashion", subcategory: "Scarves", condition: "New", brand: "Aria Atelier", tags: ["silk", "scarf", "art", "limited"], thumbnailGradient: "linear-gradient(135deg,#1a0533 0%,#3b0764 50%,#581c87 100%)", seller: SELLERS[0], rating: 4.9, reviewCount: 45, stock: 5, shipping: "Express (2-3 days)", shippingPrice: 8, returns: "14-day returns", postedAt: "1 day ago", views: 1240, saves: 167, featured: true, badge: "Limited", savedAt: new Date("2025-02-10"), notes: "", priority: "high", notifyOnDrop: true },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home & Kitchen", "Software"];
const SORT_OPTIONS: SortMode[] = ["Date Saved", "Price: Low", "Price: High", "Rating", "Most Viewed", "Priority"];
const PRIORITY_MAP = { high: { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", label: "High Priority" }, medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.28)", label: "Medium" }, low: { color: "#7b7a9a", bg: "rgba(124,80,255,0.06)", border: "rgba(130,80,255,0.18)", label: "Low" } };

// ── HELPERS ────────────────────────────────────────────────────────────────
function ThumbnailSVG({ gradient, title, badge }: { gradient: string; title: string; badge?: string }) {
  const words = title.split(" ").slice(0, 2).join(" ");
  return (
    <div style={{ width: "100%", height: "100%", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", bottom: 16, right: 16, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "0 12px" }}>{words}</span>
      {badge && <div style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 6, background: "rgba(124,58,237,0.6)", border: "1px solid rgba(168,85,247,0.5)", fontSize: 10, fontWeight: 700, color: "#e9d5ff", fontFamily: "'Fira Code', monospace", letterSpacing: 1 }}>{badge}</div>}
    </div>
  );
}

function Stars({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#f59e0b" : "rgba(245,158,11,0.2)"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ── NOTE EDITOR MODAL ──────────────────────────────────────────────────────
const NoteModal = memo(({ product, onSave, onClose }: { product: SavedProduct; onSave: (id: string, note: string) => void; onClose: () => void }) => {
  const [text, setText] = useState(product.notes);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460, background: "#0d0d18", border: "1px solid rgba(130,80,255,0.25)", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", animation: "favModalIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(130,80,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#f0eeff" }}>Edit Note</div>
            <div style={{ fontSize: 11, color: "#7b7a9a", marginTop: 2 }}>{product.title}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0eeff" }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
          </button>
        </div>
        <div style={{ padding: "18px 24px" }}>
          <textarea value={text} onChange={e => setText(e.target.value.slice(0, 300))} placeholder="Add a personal note about this product..." rows={4}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box" }} />
          <div style={{ fontSize: 10, color: "#4a4a6a", textAlign: "right", marginTop: 4, fontFamily: "'Fira Code', monospace" }}>{text.length}/300</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 9, background: "transparent", border: "1px solid rgba(130,80,255,0.2)", color: "#7b7a9a", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Cancel</button>
            <button onClick={() => { onSave(product.id, text.trim()); onClose(); }}
              style={{ flex: 2, padding: "10px", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}>
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── PRIORITY PICKER MODAL ──────────────────────────────────────────────────
const PriorityModal = memo(({ product, onSave, onClose }: { product: SavedProduct; onSave: (id: string, p: "high" | "medium" | "low") => void; onClose: () => void }) => {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360, background: "#0d0d18", border: "1px solid rgba(130,80,255,0.25)", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", animation: "favModalIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid rgba(130,80,255,0.12)" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#f0eeff" }}>Set Priority</div>
          <div style={{ fontSize: 11, color: "#7b7a9a", marginTop: 2 }}>{product.title}</div>
        </div>
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          {(["high", "medium", "low"] as const).map(p => (
            <button key={p} onClick={() => { onSave(product.id, p); onClose(); }}
              style={{ padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${PRIORITY_MAP[p].border}`, background: product.priority === p ? PRIORITY_MAP[p].bg : "rgba(255,255,255,0.02)", color: PRIORITY_MAP[p].color, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", gap: 10, transition: "all 0.18s" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: PRIORITY_MAP[p].color, flexShrink: 0 }} />
              {PRIORITY_MAP[p].label}
              {product.priority === p && <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.6 }}>Current</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

// ── REMOVE CONFIRM MODAL ───────────────────────────────────────────────────
const RemoveModal = memo(({ product, onConfirm, onClose }: { product: SavedProduct; onConfirm: () => void; onClose: () => void }) => {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 380, background: "#0d0d18", border: "1px solid rgba(130,80,255,0.25)", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", animation: "favModalIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding: "28px 28px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💔</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#f0eeff", marginBottom: 8 }}>Remove from Favourites?</div>
          <div style={{ fontSize: 13, color: "#7b7a9a", lineHeight: 1.6 }}>
            <strong style={{ color: "#c084fc" }}>"{product.title}"</strong> will be removed from your saved list.
          </div>
        </div>
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, background: "transparent", border: "1px solid rgba(130,80,255,0.2)", color: "#7b7a9a", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            style={{ flex: 1, padding: "11px", borderRadius: 10, background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
});

// ── TOAST ──────────────────────────────────────────────────────────────────
const Toast = memo(({ message, type = "success" }: { message: string; type?: "success" | "error" | "info" }) => {
  const colors = { success: { border: "rgba(52,211,153,0.3)", color: "#34d399" }, error: { border: "rgba(248,113,113,0.3)", color: "#f87171" }, info: { border: "rgba(168,85,247,0.3)", color: "#c084fc" } };
  const c = colors[type];
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, background: "#0d0d18", border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", animation: "favToastIn 0.3s cubic-bezier(0.16,1,0.3,1)", fontSize: 13, fontWeight: 500, color: c.color, fontFamily: "'Outfit', sans-serif" }}>
      <span>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>{message}
    </div>
  );
});

// ── GRID CARD ──────────────────────────────────────────────────────────────
const FavCard = memo(({ item, onRemove, onNote, onPriority, onToggleNotify, onShare }: { item: SavedProduct; onRemove: () => void; onNote: () => void; onPriority: () => void; onToggleNotify: () => void; onShare: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
  const pr = PRIORITY_MAP[item.priority];
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${hovered ? "rgba(168,85,247,0.4)" : "rgba(130,80,255,0.14)"}`, background: "#111120", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", transform: hovered ? "translateY(-5px)" : "translateY(0)", boxShadow: hovered ? "0 20px 50px rgba(124,58,237,0.16)" : "0 2px 16px rgba(0,0,0,0.3)", position: "relative", animation: "favCardIn 0.4s ease both" }}>
      {/* Thumbnail */}
      <div style={{ height: 200, position: "relative", overflow: "hidden" }}>
        <ThumbnailSVG gradient={item.thumbnailGradient} title={item.title} badge={item.badge} />
        {discount > 0 && <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 9px", borderRadius: 6, background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)", fontSize: 10, fontWeight: 700, color: "#34d399", fontFamily: "'Fira Code', monospace" }}>-{discount}%</div>}
        {/* Priority badge */}
        <div style={{ position: "absolute", bottom: 10, left: 10, padding: "3px 9px", borderRadius: 6, background: pr.bg, border: `1px solid ${pr.border}`, fontSize: 10, color: pr.color, fontFamily: "'Fira Code', monospace", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: pr.color }} />
          {pr.label}
        </div>
        {item.notifyOnDrop && <div style={{ position: "absolute", bottom: 10, right: 10, width: 26, height: 26, borderRadius: "50%", background: "rgba(124,58,237,0.35)", border: "1px solid rgba(168,85,247,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }} title="Price drop alert on">🔔</div>}
      </div>

      {/* Info */}
      <div style={{ padding: "15px 17px 17px" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 7 }}>
          <span style={{ fontSize: 10, color: "rgba(192,132,252,0.8)", fontFamily: "'Fira Code', monospace", letterSpacing: 1, background: "rgba(124,58,237,0.1)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(124,58,237,0.2)" }}>{item.category}</span>
          <span style={{ fontSize: 10, color: "#7b7a9a", fontFamily: "'Fira Code', monospace", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 4 }}>{item.condition}</span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#f0eeff", marginBottom: 4, lineHeight: 1.3 }}>{item.title}</h3>
        <p style={{ fontSize: 12, color: "#7b7a9a", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>

        {/* Note */}
        {item.notes && (
          <div style={{ padding: "7px 10px", borderRadius: 8, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(168,85,247,0.14)", marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: "#c084fc", fontFamily: "'Fira Code', monospace", marginBottom: 2 }}>📌 Note</div>
            <div style={{ fontSize: 11, color: "#7b7a9a", lineHeight: 1.5 }}>{item.notes}</div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Stars rating={item.rating} />
          <span style={{ fontSize: 11, color: "#7b7a9a", fontFamily: "'Fira Code', monospace" }}>{item.rating} ({item.reviewCount})</span>
        </div>

        {/* Seller */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, paddingBottom: 11, borderBottom: "1px solid rgba(130,80,255,0.1)" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: item.seller.avatarGradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, color: "white", fontFamily: "'Playfair Display', serif", flexShrink: 0 }}>{item.seller.initials}</div>
          <span style={{ fontSize: 11, color: "#7b7a9a" }}>{item.seller.name}</span>
          {item.seller.verified && <svg width={11} height={11} viewBox="0 0 24 24" fill="#a855f7"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code', monospace" }}>Saved {new Date(item.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>

        {/* Price + stock */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 800, color: "#f0eeff" }}>${item.price}</span>
              {item.originalPrice && <span style={{ fontSize: 12, color: "#4a4a6a", textDecoration: "line-through" }}>${item.originalPrice}</span>}
            </div>
            <div style={{ fontSize: 10, color: "#7b7a9a", fontFamily: "'Fira Code', monospace", marginTop: 1 }}>{item.shippingPrice === 0 ? "Free shipping" : `+$${item.shippingPrice} shipping`}</div>
          </div>
          {item.stock <= 5 && item.stock > 0 && <div style={{ fontSize: 10, color: "#f59e0b", fontFamily: "'Fira Code', monospace", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "3px 8px", borderRadius: 5 }}>⚡ {item.stock} left</div>}
        </div>

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button onClick={onNote} style={{ padding: "7px", borderRadius: 8, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(130,80,255,0.18)", color: "#c084fc", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.18s" }}>
            ✏ {item.notes ? "Edit Note" : "Add Note"}
          </button>
          <button onClick={onPriority} style={{ padding: "7px", borderRadius: 8, background: `${PRIORITY_MAP[item.priority].bg}`, border: `1px solid ${PRIORITY_MAP[item.priority].border}`, color: PRIORITY_MAP[item.priority].color, fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.18s" }}>
            🎯 Priority
          </button>
          <button onClick={onToggleNotify} style={{ padding: "7px", borderRadius: 8, background: item.notifyOnDrop ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${item.notifyOnDrop ? "rgba(52,211,153,0.25)" : "rgba(130,80,255,0.14)"}`, color: item.notifyOnDrop ? "#34d399" : "#7b7a9a", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.18s" }}>
            {item.notifyOnDrop ? "🔔 Alert On" : "🔕 Alert Off"}
          </button>
          <button onClick={onRemove} style={{ padding: "7px", borderRadius: 8, background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.18)", color: "#f87171", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.18s" }}>
            💔 Remove
          </button>
        </div>
      </div>
    </div>
  );
});

// ── LIST ROW ───────────────────────────────────────────────────────────────
const FavListRow = memo(({ item, onRemove, onNote, onPriority, onToggleNotify }: { item: SavedProduct; onRemove: () => void; onNote: () => void; onPriority: () => void; onToggleNotify: () => void }) => {
  const pr = PRIORITY_MAP[item.priority];
  const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, background: "#111120", border: "1px solid rgba(130,80,255,0.14)", transition: "border-color 0.2s", animation: "favCardIn 0.35s ease both" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(130,80,255,0.14)")}>
      {/* Thumb */}
      <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(130,80,255,0.2)", flexShrink: 0 }}>
        <ThumbnailSVG gradient={item.thumbnailGradient} title="" />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#f0eeff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
          {item.badge && <span style={{ fontSize: 9, color: "#c084fc", fontFamily: "'Fira Code', monospace", background: "rgba(124,58,237,0.15)", padding: "1px 6px", borderRadius: 4, flexShrink: 0 }}>{item.badge}</span>}
        </div>
        <div style={{ fontSize: 11, color: "#7b7a9a", fontFamily: "'Fira Code', monospace" }}>
          {item.category} · {item.brand} · {item.condition}
          {item.stock <= 5 && item.stock > 0 && <span style={{ color: "#f59e0b", marginLeft: 8 }}>⚡ {item.stock} left</span>}
        </div>
        {item.notes && <div style={{ fontSize: 11, color: "#c084fc", marginTop: 3 }}>📌 {item.notes}</div>}
      </div>

      {/* Priority dot */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, background: pr.bg, border: `1px solid ${pr.border}`, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: pr.color }} />
        <span style={{ fontSize: 10, color: pr.color, fontFamily: "'Fira Code', monospace" }}>{item.priority}</span>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#f0eeff" }}>${item.price}</div>
        {discount > 0 && <div style={{ fontSize: 10, color: "#34d399", fontFamily: "'Fira Code', monospace" }}>-{discount}%</div>}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
        {[{ icon: "✏", fn: onNote, color: "#c084fc" }, { icon: "🎯", fn: onPriority, color: "#a78bfa" }, { icon: item.notifyOnDrop ? "🔔" : "🔕", fn: onToggleNotify, color: item.notifyOnDrop ? "#34d399" : "#7b7a9a" }, { icon: "💔", fn: onRemove, color: "#f87171" }].map(({ icon, fn, color }, i) => (
          <button key={i} onClick={fn} style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(130,80,255,0.14)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, transition: "all 0.18s", color }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(130,80,255,0.14)"; }}>
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
});

// ── MOOD BOARD CARD ────────────────────────────────────────────────────────
const MoodCard = memo(({ item, onRemove }: { item: SavedProduct; onRemove: () => void }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer", border: "1px solid rgba(130,80,255,0.14)", transition: "all 0.3s", transform: hovered ? "scale(1.02)" : "scale(1)", animation: "favCardIn 0.4s ease both", aspectRatio: Math.random() > 0.5 ? "1" : "4/3" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <ThumbnailSVG gradient={item.thumbnailGradient} title={item.title} badge={item.badge} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,15,0.92) 0%, rgba(8,8,15,0.3) 50%, transparent 100%)", opacity: hovered ? 1 : 0.7, transition: "opacity 0.3s" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: "#f0eeff", marginBottom: 2, lineHeight: 1.3 }}>{item.title}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 800, color: "#c084fc" }}>${item.price}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: PRIORITY_MAP[item.priority].color }} />
          </div>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onRemove(); }} style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.2s", fontSize: 12 }}>💔</button>
    </div>
  );
});

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function FavouritesPage({ onNavigate }: { onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void }) {
  const [items, setItems] = useState<SavedProduct[]>(MOCK_FAVOURITES);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortMode>("Date Saved");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [notifyOnly, setNotifyOnly] = useState(false);
  const [noteTarget, setNoteTarget] = useState<SavedProduct | null>(null);
  const [priorityTarget, setPriorityTarget] = useState<SavedProduct | null>(null);
  const [removeTarget, setRemoveTarget] = useState<SavedProduct | null>(null);
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" | "info" } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
    showToast("Removed from favourites");
  }, [showToast]);

  const handleNote = useCallback((id: string, note: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, notes: note } : p));
    showToast("Note saved!");
  }, [showToast]);

  const handlePriority = useCallback((id: string, priority: "high" | "medium" | "low") => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, priority } : p));
    showToast("Priority updated!");
  }, [showToast]);

  const handleToggleNotify = useCallback((id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, notifyOnDrop: !p.notifyOnDrop } : p));
    showToast("Price alert updated", "info");
  }, [showToast]);

  const handleBulkRemove = useCallback(() => {
    setItems(prev => prev.filter(p => !selected.has(p.id)));
    showToast(`Removed ${selected.size} items`);
    setSelected(new Set());
    setBulkMode(false);
  }, [selected, showToast]);

  const handleBulkPriority = useCallback((priority: "high" | "medium" | "low") => {
    setItems(prev => prev.map(p => selected.has(p.id) ? { ...p, priority } : p));
    showToast(`Priority updated for ${selected.size} items`);
    setSelected(new Set());
    setBulkMode(false);
  }, [selected, showToast]);

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const filtered = useMemo(() => {
    return items.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)) || p.brand.toLowerCase().includes(q);
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchPriority = priorityFilter === "all" || p.priority === priorityFilter;
      const matchNotify = !notifyOnly || p.notifyOnDrop;
      return matchSearch && matchCat && matchPriority && matchNotify;
    }).sort((a, b) => {
      switch (sortBy) {
        case "Price: Low": return a.price - b.price;
        case "Price: High": return b.price - a.price;
        case "Rating": return b.rating - a.rating;
        case "Most Viewed": return b.views - a.views;
        case "Priority": { const order = { high: 0, medium: 1, low: 2 }; return order[a.priority] - order[b.priority]; }
        default: return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      }
    });
  }, [items, search, activeCategory, priorityFilter, notifyOnly, sortBy]);

  const stats = useMemo(() => ({
    total: items.length,
    totalValue: items.reduce((a, p) => a + p.price, 0),
    highPriority: items.filter(p => p.priority === "high").length,
    notifyCount: items.filter(p => p.notifyOnDrop).length,
    lowStock: items.filter(p => p.stock <= 5).length,
    savings: items.reduce((a, p) => a + (p.originalPrice ? p.originalPrice - p.price : 0), 0),
  }), [items]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; background: #08080f; color: #f0eeff; font-family: 'Outfit', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #111120; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 10px; }
        input::placeholder, textarea::placeholder { color: #4a4a6a; }

        @keyframes favCardIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes favModalIn { from{opacity:0;transform:scale(0.95) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes favToastIn { from{opacity:0;transform:translateY(14px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes logoPulse { 0%,100%{box-shadow:0 0 12px rgba(124,58,237,0.4)} 50%{box-shadow:0 0 28px rgba(124,58,237,0.7),0 0 45px rgba(168,85,247,0.25)} }
        @keyframes heartBeat { 0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1)} }

        .fav-wrap { display: flex; height: 100vh; overflow: hidden; position: relative; z-index: 1; }

        /* SIDEBAR */
        .fav-sidebar { width: 64px; flex-shrink: 0; background: #111120; border-right: 1px solid rgba(130,80,255,0.14); display: flex; flex-direction: column; padding: 20px 0; position: relative; z-index: 200; transition: width 0.28s cubic-bezier(0.4,0,0.2,1); overflow: hidden; }
        .fav-sidebar:hover { width: 240px; }
        .fav-sidebar::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(168,85,247,0.3), transparent); }
        .sb-logo { display: flex; align-items: center; gap: 10px; padding: 0 15px; margin-bottom: 24px; white-space: nowrap; overflow: hidden; min-width: 240px; }
        .sb-logo-icon { width: 34px; height: 34px; flex-shrink: 0; background: linear-gradient(135deg,#7c3aed,#a855f7); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(124,58,237,0.4); animation: logoPulse 3s ease-in-out infinite; }
        .sb-logo-text { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 17px; opacity: 0; transition: opacity 0.15s; white-space: nowrap; }
        .fav-sidebar:hover .sb-logo-text { opacity: 1; }
        .sb-profile { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px 16px; border-bottom: 1px solid rgba(130,80,255,0.14); margin-bottom: 8px; overflow: hidden; }
        .sb-avatar { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg,#7c3aed,#a855f7); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-weight: 800; font-size: 16px; color: white; border: 2px solid rgba(168,85,247,0.4); box-shadow: 0 0 16px rgba(124,58,237,0.3); transition: all 0.28s; }
        .fav-sidebar:hover .sb-avatar { width: 64px; height: 64px; font-size: 22px; }
        .sb-profile-text { opacity: 0; transition: opacity 0.15s; text-align: center; white-space: nowrap; }
        .fav-sidebar:hover .sb-profile-text { opacity: 1; }
        .sb-section { font-size: 10px; letter-spacing: 2px; color: #4a4a6a; text-transform: uppercase; font-family: 'Fira Code', monospace; padding: 0 14px; margin-bottom: 6px; margin-top: 16px; white-space: nowrap; overflow: hidden; opacity: 0; transition: opacity 0.15s; }
        .fav-sidebar:hover .sb-section { opacity: 1; }
        .sb-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; margin: 1px 8px; border-radius: 10px; color: #7b7a9a; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.18s; border: 1px solid transparent; text-decoration: none; white-space: nowrap; overflow: hidden; }
        .sb-nav-item:hover { background: rgba(124,58,237,0.08); color: #f0eeff; border-color: rgba(130,80,255,0.14); }
        .sb-nav-item.active { background: rgba(124,58,237,0.14); color: #c084fc; border-color: rgba(168,85,247,0.25); }
        .sb-nav-item svg, .sb-nav-item .nav-icon { flex-shrink: 0; opacity: 0.7; }
        .sb-nav-item.active svg, .sb-nav-item.active .nav-icon { opacity: 1; }
        .sb-nav-item .nav-label { opacity: 0; transition: opacity 0.15s; }
        .fav-sidebar:hover .sb-nav-item .nav-label { opacity: 1; }
        .sb-bottom { margin-top: auto; border-top: 1px solid rgba(130,80,255,0.14); padding: 12px 8px 0; }
        .sb-user-pill { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px; background: #18182a; border: 1px solid rgba(130,80,255,0.14); overflow: hidden; }
        .sb-user-avatar { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg,#7c3aed,#a855f7); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 11px; color: white; }
        .sb-user-info { opacity: 0; transition: opacity 0.15s; white-space: nowrap; }
        .fav-sidebar:hover .sb-user-info { opacity: 1; }

        /* MAIN */
        .fav-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .fav-topbar { height: 60px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; background: rgba(8,8,15,0.85); border-bottom: 1px solid rgba(130,80,255,0.14); backdrop-filter: blur(16px); }
        .fav-topbar-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .fav-topbar-right { display: flex; align-items: center; gap: 8px; }
        .fav-search { display: flex; align-items: center; gap: 8px; background: #18182a; border: 1px solid rgba(130,80,255,0.14); border-radius: 10px; padding: 7px 12px; transition: border-color 0.2s; width: 200px; }
        .fav-search:focus-within { border-color: rgba(168,85,247,0.4); }
        .fav-search input { background: none; border: none; outline: none; color: #f0eeff; font-family: 'Outfit', sans-serif; font-size: 13px; width: 100%; }
        .fav-content { flex: 1; overflow-y: auto; padding: 20px; }

        .stat-card-fav { background: #111120; border: 1px solid rgba(130,80,255,0.14); border-radius: 14px; padding: 16px; transition: all 0.2s; position: relative; overflow: hidden; }
        .stat-card-fav:hover { border-color: rgba(168,85,247,0.4); transform: translateY(-2px); }
        .stat-icon-fav { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 26px; opacity: 0.08; }

        .filter-pill { padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(130,80,255,0.14); background: transparent; color: #7b7a9a; font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
        .filter-pill:hover { border-color: rgba(168,85,247,0.4); color: #f0eeff; }
        .filter-pill.active { background: rgba(124,58,237,0.18); border-color: rgba(168,85,247,0.5); color: #c084fc; }

        .view-btn-fav { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(130,80,255,0.14); background: transparent; color: #7b7a9a; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; font-size: 14px; }
        .view-btn-fav.active { background: rgba(124,58,237,0.14); border-color: rgba(168,85,247,0.35); color: #c084fc; }

        .bulk-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: rgba(124,58,237,0.08); border: 1px solid rgba(168,85,247,0.2); border-radius: 12px; margin-bottom: 16px; animation: favCardIn 0.25s ease both; flex-wrap: wrap; }
        .bulk-action { padding: 6px 12px; border-radius: 8px; border: 1px solid; font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.18s; }

        .mood-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; grid-auto-rows: minmax(160px, auto); }

        .empty-fav { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; gap: 16px; background: #111120; border: 1px dashed rgba(130,80,255,0.14); border-radius: 20px; }

        @media (max-width: 768px) {
          .stats-grid-fav { grid-template-columns: repeat(2, 1fr) !important; }
          .fav-topbar { padding: 0 14px; }
          .fav-content { padding: 14px; }
          .fav-search { width: 140px; }
          .products-grid-fav { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .products-grid-fav { grid-template-columns: 1fr !important; }
          .stats-grid-fav { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "20%", left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="fav-wrap">

        {/* ── SIDEBAR ── */}
        <aside className="fav-sidebar">
          <div className="sb-logo">
            <div className="sb-logo-icon">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span className="sb-logo-text">Nexus</span>
          </div>

          <div className="sb-profile">
            <div className="sb-avatar">NC</div>
            <div className="sb-profile-text">
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14 }}>Noah Carter</div>
              <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", marginTop: 2 }}>Buyer · Member</div>
            </div>
          </div>

          <div className="sb-section">MAIN</div>
          {[
            { label: "Home", icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, page: "home" },
            { label: "Dashboard", icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, page: "dashboard" },
            { label: "Buy", icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>, page: "buy" },
          ].map(({ label, icon, page }) => (
            <a key={label} href="#" className="sb-nav-item" onClick={e => { e.preventDefault(); onNavigate(page as any); }}>
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </a>
          ))}
          <div className="sb-nav-item active">
            <span className="nav-icon" style={{ animation: "heartBeat 2s ease-in-out infinite" }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="#c084fc" stroke="#c084fc" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </span>
            <span className="nav-label">Favourites ({items.length})</span>
          </div>
          <div className="sb-nav-item">
            <span className="nav-icon"><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={3}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
            <span className="nav-label">Settings</span>
          </div>

          <div className="sb-nav-item" onClick={() => supabase.auth.signOut()}>
            <span className="nav-icon"><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
            <span className="nav-label">Log Out</span>
          </div>

          <div className="sb-bottom">
            <div className="sb-user-pill">
              <div className="sb-user-avatar">NC</div>
              <div className="sb-user-info">
                <span style={{ display: "block", fontSize: 13, fontWeight: 500 }}>Noah Carter</span>
                <small style={{ fontSize: 11, color: "#7b7a9a" }}>Buyer</small>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="fav-main">
          {/* Topbar */}
          <header className="fav-topbar">
            <div className="fav-topbar-title">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="#c084fc" stroke="#c084fc" strokeWidth={2} style={{ animation: "heartBeat 2s ease-in-out infinite" }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              My Favourites
              <span style={{ fontSize: 12, color: "#c084fc", fontFamily: "'Fira Code', monospace", background: "rgba(124,58,237,0.15)", padding: "2px 9px", borderRadius: 20, fontWeight: 500 }}>{items.length}</span>
            </div>
            <div className="fav-topbar-right">
              <div className="fav-search">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#4a4a6a" strokeWidth={2}><circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search saved..." />
                {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#7b7a9a", cursor: "pointer", padding: 0 }}>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
                </button>}
              </div>
              <button onClick={() => { setBulkMode(v => !v); setSelected(new Set()); }}
                style={{ padding: "7px 12px", borderRadius: 9, background: bulkMode ? "rgba(124,58,237,0.2)" : "#18182a", border: `1px solid ${bulkMode ? "rgba(168,85,247,0.45)" : "rgba(130,80,255,0.14)"}`, color: bulkMode ? "#c084fc" : "#7b7a9a", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" }}>
                ☑ Bulk Edit
              </button>
              {/* View toggles */}
              <div style={{ display: "flex", gap: 4 }}>
                {(["grid", "list", "mood"] as ViewMode[]).map(v => (
                  <button key={v} className={`view-btn-fav ${viewMode === v ? "active" : ""}`} onClick={() => setViewMode(v)} title={`${v} view`}>
                    {v === "grid" ? "⊞" : v === "list" ? "≡" : "✦"}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="fav-content">

            {/* Hero stats */}
            <div className="stats-grid-fav" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Saved Items", value: stats.total, icon: "❤️", color: "#f87171" },
                { label: "Total Value", value: `$${stats.totalValue.toLocaleString()}`, icon: "💰", color: "#c084fc" },
                { label: "Potential Savings", value: `$${stats.savings}`, icon: "🎯", color: "#34d399" },
                { label: "High Priority", value: stats.highPriority, icon: "🔥", color: "#f87171" },
                { label: "Price Alerts", value: stats.notifyCount, icon: "🔔", color: "#fbbf24" },
                { label: "Low Stock", value: stats.lowStock, icon: "⚡", color: "#f59e0b" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="stat-card-fav">
                  <div style={{ fontSize: 10, color: "#7b7a9a", fontFamily: "'Fira Code', monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color }}>{value}</div>
                  <div className="stat-icon-fav">{icon}</div>
                </div>
              ))}
            </div>

            {/* Filters row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortMode)}
                style={{ padding: "7px 10px", borderRadius: 8, background: "#18182a", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 12, fontFamily: "'Outfit', sans-serif", outline: "none", cursor: "pointer" }}>
                {SORT_OPTIONS.map(o => <option key={o} style={{ background: "#111120" }}>{o}</option>)}
              </select>

              {/* Category */}
              <div style={{ display: "flex", gap: 5, overflowX: "auto" }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`filter-pill ${activeCategory === cat ? "active" : ""}`}>{cat}</button>
                ))}
              </div>

              {/* Priority filter */}
              <div style={{ display: "flex", gap: 5 }}>
                {(["all", "high", "medium", "low"] as PriorityFilter[]).map(p => (
                  <button key={p} onClick={() => setPriorityFilter(p)} className={`filter-pill ${priorityFilter === p ? "active" : ""}`}
                    style={{ color: priorityFilter === p ? PRIORITY_MAP[p === "all" ? "low" : p].color : "#7b7a9a" }}>
                    {p === "all" ? "All Priority" : `${PRIORITY_MAP[p].label}`}
                  </button>
                ))}
              </div>

              {/* Notify filter */}
              <button onClick={() => setNotifyOnly(v => !v)} className={`filter-pill ${notifyOnly ? "active" : ""}`}>
                🔔 Price Alerts Only
              </button>

              <span style={{ marginLeft: "auto", fontSize: 11, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", whiteSpace: "nowrap" }}>{filtered.length} results</span>
            </div>

            {/* Bulk action bar */}
            {bulkMode && selected.size > 0 && (
              <div className="bulk-bar">
                <span style={{ fontSize: 12, color: "#c084fc", fontFamily: "'Fira Code', monospace" }}>{selected.size} selected</span>
                <button className="bulk-action" onClick={() => handleBulkPriority("high")} style={{ background: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.3)", color: "#f87171" }}>🔥 Set High</button>
                <button className="bulk-action" onClick={() => handleBulkPriority("medium")} style={{ background: "rgba(251,191,36,0.08)", borderColor: "rgba(251,191,36,0.25)", color: "#fbbf24" }}>⚡ Set Medium</button>
                <button className="bulk-action" onClick={() => handleBulkPriority("low")} style={{ background: "rgba(130,80,255,0.08)", borderColor: "rgba(130,80,255,0.2)", color: "#7b7a9a" }}>• Set Low</button>
                <button className="bulk-action" onClick={handleBulkRemove} style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.25)", color: "#f87171", marginLeft: "auto" }}>💔 Remove All</button>
                <button onClick={() => { setBulkMode(false); setSelected(new Set()); }} style={{ background: "none", border: "none", color: "#7b7a9a", cursor: "pointer", fontSize: 13 }}>✕</button>
              </div>
            )}

            {/* Empty state */}
            {filtered.length === 0 ? (
              <div className="empty-fav">
                <div style={{ fontSize: 52, animation: "heartBeat 2s ease-in-out infinite" }}>💔</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#f0eeff" }}>
                  {items.length === 0 ? "No favourites yet" : "No results found"}
                </h3>
                <p style={{ fontSize: 13, color: "#7b7a9a", maxWidth: 340, lineHeight: 1.7 }}>
                  {items.length === 0 ? "Browse the marketplace and save products you love to build your wishlist." : "Try adjusting your filters or search query."}
                </p>
                <button onClick={() => onNavigate("buy")}
                  style={{ padding: "11px 24px", borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
                  Browse Marketplace
                </button>
              </div>
            ) : viewMode === "mood" ? (
              // Mood board
              <div className="mood-grid">
                {filtered.map((item, i) => (
                  <div key={item.id} style={{ animationDelay: `${Math.min(i, 8) * 0.05}s`, gridRow: item.price > 300 ? "span 2" : "span 1" }}>
                    <MoodCard item={item} onRemove={() => setRemoveTarget(item)} />
                  </div>
                ))}
              </div>
            ) : viewMode === "list" ? (
              // List view
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map((item, i) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, animationDelay: `${Math.min(i, 8) * 0.04}s` }}>
                    {bulkMode && (
                      <div onClick={() => toggleSelect(item.id)}
                        style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${selected.has(item.id) ? "#a855f7" : "rgba(130,80,255,0.3)"}`, background: selected.has(item.id) ? "rgba(124,58,237,0.4)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.18s" }}>
                        {selected.has(item.id) && <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <FavListRow item={item} onRemove={() => setRemoveTarget(item)} onNote={() => setNoteTarget(item)} onPriority={() => setPriorityTarget(item)} onToggleNotify={() => handleToggleNotify(item.id)} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Grid view
              <div className="products-grid-fav" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
                {filtered.map((item, i) => (
                  <div key={item.id} style={{ position: "relative", animationDelay: `${Math.min(i, 8) * 0.06}s` }}>
                    {bulkMode && (
                      <div onClick={() => toggleSelect(item.id)}
                        style={{ position: "absolute", top: 14, left: 14, zIndex: 10, width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected.has(item.id) ? "#a855f7" : "rgba(255,255,255,0.3)"}`, background: selected.has(item.id) ? "rgba(124,58,237,0.6)" : "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.18s" }}>
                        {selected.has(item.id) && <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    )}
                    <FavCard item={item} onRemove={() => setRemoveTarget(item)} onNote={() => setNoteTarget(item)} onPriority={() => setPriorityTarget(item)} onToggleNotify={() => handleToggleNotify(item.id)} onShare={() => { navigator.clipboard.writeText(`https://nexus.io/product/${item.id}`).catch(() => {}); showToast("Link copied!", "info"); }} />
                  </div>
                ))}
              </div>
            )}

            {/* Bottom insight bar */}
            {filtered.length > 0 && (
              <div style={{ marginTop: 32, padding: "20px 26px", borderRadius: 16, background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(168,85,247,0.03))", border: "1px solid rgba(130,80,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#f0eeff", marginBottom: 4 }}>Your Wishlist Summary</div>
                  <div style={{ fontSize: 12, color: "#7b7a9a" }}>
                    {stats.highPriority} high priority · {stats.notifyCount} price alerts active · {stats.lowStock} running low on stock
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => onNavigate("buy")} style={{ padding: "9px 18px", borderRadius: 10, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                    Browse More
                  </button>
                  <button onClick={() => { setItems([]); showToast("All items cleared", "info"); }} style={{ padding: "9px 18px", borderRadius: 10, background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {noteTarget && <NoteModal product={noteTarget} onSave={handleNote} onClose={() => setNoteTarget(null)} />}
      {priorityTarget && <PriorityModal product={priorityTarget} onSave={handlePriority} onClose={() => setPriorityTarget(null)} />}
      {removeTarget && <RemoveModal product={removeTarget} onConfirm={() => handleRemove(removeTarget.id)} onClose={() => setRemoveTarget(null)} />}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </>
  );
}