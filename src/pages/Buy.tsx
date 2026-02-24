import { useState, useEffect, useRef, useCallback, memo } from "react";
import { supabase } from "../lib/supabase";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Seller {
  id: string; name: string; avatar: string; initials: string; verified: boolean;
  rating: number; sales: number; location: string; memberSince: string; bio: string; avatarGradient: string;
}
interface UserReview {
  id: string; productId: string; rating: number; comment: string; date: Date;
}
interface Product {
  id: string; title: string; description: string; price: number; originalPrice?: number;
  currency: string; category: string; subcategory: string; condition: string; brand: string;
  tags: string[]; thumbnail: string; images: string[]; thumbnailGradient: string;
  seller: Seller; rating: number; reviewCount: number; stock: number; shipping: string;
  shippingPrice: number; returns: string; postedAt: string; views: number; saves: number; featured: boolean; badge?: string;
}

// ── MOCK DATA ───────────────────────────────────────────────────────────────
const SELLERS: Seller[] = [
  { id: "s1", name: "Aria Voss", avatar: "", initials: "AV", verified: true, rating: 4.9, sales: 1240, location: "New York, US", memberSince: "2021", bio: "Curating premium tech & lifestyle products for discerning buyers.", avatarGradient: "linear-gradient(135deg,#7c3aed,#a855f7)" },
  { id: "s2", name: "Kai Tanaka", avatar: "", initials: "KT", verified: true, rating: 4.8, sales: 876, location: "Tokyo, JP", memberSince: "2022", bio: "Exclusive Japanese imports and limited edition collectibles.", avatarGradient: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
  { id: "s3", name: "Mira Osei", avatar: "", initials: "MO", verified: false, rating: 4.7, sales: 432, location: "London, UK", memberSince: "2023", bio: "Artisan crafts and bespoke design pieces.", avatarGradient: "linear-gradient(135deg,#ec4899,#8b5cf6)" },
  { id: "s4", name: "Luca Ferri", avatar: "", initials: "LF", verified: true, rating: 5.0, sales: 2100, location: "Milan, IT", memberSince: "2020", bio: "Italian luxury goods and vintage fashion specialist.", avatarGradient: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { id: "s5", name: "Zoe Chen", avatar: "", initials: "ZC", verified: true, rating: 4.6, sales: 658, location: "Singapore", memberSince: "2022", bio: "Digital assets, software licenses, and tech accessories.", avatarGradient: "linear-gradient(135deg,#34d399,#059669)" },
];

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", title: "Arc Flow Pro Mechanical Keyboard", description: "A precision-engineered 75% mechanical keyboard with POM plate, gasket mount, and lubed Gateron Oil King switches. Crafted for those who demand perfection in every keystroke.", price: 349, originalPrice: 420, currency: "USD", category: "Electronics", subcategory: "Keyboards", condition: "New", brand: "ArcStudio", tags: ["keyboard", "mechanical", "premium", "75%", "aluminum"], thumbnail: "", images: ["", "", "", ""], thumbnailGradient: "linear-gradient(135deg,#1a1035 0%,#2d1b69 50%,#4c1d95 100%)", seller: SELLERS[0], rating: 4.9, reviewCount: 128, stock: 7, shipping: "Express (2-3 days)", shippingPrice: 0, returns: "30-day returns", postedAt: "2 days ago", views: 3420, saves: 241, featured: true, badge: "Best Seller" },
  { id: "p2", title: "Shiro Ceramic Pour-Over Set", description: "Handcrafted in Kyoto by master ceramicist Hiroshi Yamada. Each piece is unique with subtle celadon glazing and a matte exterior. The set includes the dripper, carafe, and two tasting cups.", price: 195, currency: "USD", category: "Home & Kitchen", subcategory: "Coffee", condition: "New", brand: "Yamada Ceramics", tags: ["coffee", "ceramic", "handcrafted", "kyoto", "pour-over"], thumbnail: "", images: ["", "", ""], thumbnailGradient: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#164e63 100%)", seller: SELLERS[1], rating: 5.0, reviewCount: 64, stock: 3, shipping: "Standard (5-7 days)", shippingPrice: 12, returns: "14-day returns", postedAt: "1 week ago", views: 1870, saves: 189, featured: true, badge: "Rare Find" },
  { id: "p3", title: "Obsidian Leather Folio Wallet", description: "Full-grain vegetable-tanned leather with a hand-stitched obsidian finish. Features 8 card slots, 2 hidden compartments, and a magnetic money clip. Made in Florence.", price: 128, currency: "USD", category: "Fashion", subcategory: "Accessories", condition: "New", brand: "Ferri Milano", tags: ["wallet", "leather", "italian", "handmade", "luxury"], thumbnail: "", images: ["", "", ""], thumbnailGradient: "linear-gradient(135deg,#1c1917 0%,#292524 50%,#44403c 100%)", seller: SELLERS[3], rating: 5.0, reviewCount: 312, stock: 14, shipping: "Express (1-2 days)", shippingPrice: 0, returns: "60-day returns", postedAt: "3 days ago", views: 5620, saves: 892, featured: false, badge: "Editor's Pick" },
  { id: "p4", title: "Lumina Desk Light — Matte Black", description: "Architectural task lighting inspired by Bauhaus principles. 4000K CRI-95 LED with stepless dimming and a 360° articulating arm. Zero flicker technology.", price: 285, originalPrice: 310, currency: "USD", category: "Home & Kitchen", subcategory: "Lighting", condition: "New", brand: "Lumina Studio", tags: ["desk lamp", "bauhaus", "LED", "dimming", "minimal"], thumbnail: "", images: ["", "", ""], thumbnailGradient: "linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 50%,#16213e 100%)", seller: SELLERS[4], rating: 4.8, reviewCount: 97, stock: 22, shipping: "Standard (3-5 days)", shippingPrice: 0, returns: "30-day returns", postedAt: "5 days ago", views: 2130, saves: 304, featured: false },
  { id: "p5", title: "Voss Silk Scarf — Midnight Garden", description: "100% mulberry silk twill, hand-rolled edges, 140×140cm. Printed with original botanical illustration, individually numbered, comes with silk-lined gift box.", price: 220, currency: "USD", category: "Fashion", subcategory: "Scarves", condition: "New", brand: "Aria Atelier", tags: ["silk", "scarf", "art", "limited", "botanical"], thumbnail: "", images: ["", ""], thumbnailGradient: "linear-gradient(135deg,#1a0533 0%,#3b0764 50%,#581c87 100%)", seller: SELLERS[0], rating: 4.9, reviewCount: 45, stock: 5, shipping: "Express (2-3 days)", shippingPrice: 8, returns: "14-day returns", postedAt: "1 day ago", views: 1240, saves: 167, featured: true, badge: "Limited" },
  { id: "p6", title: "Mono Wireless Earbuds — Titanium", description: "Machined from aerospace-grade titanium. Hybrid ANC with 42dB attenuation, 32-hour playtime, custom-tuned 10mm beryllium-coated driver.", price: 599, originalPrice: 699, currency: "USD", category: "Electronics", subcategory: "Audio", condition: "New", brand: "Mono Labs", tags: ["earbuds", "titanium", "ANC", "wireless", "premium"], thumbnail: "", images: ["", "", "", ""], thumbnailGradient: "linear-gradient(135deg,#0c0a1e 0%,#1e1b4b 50%,#312e81 100%)", seller: SELLERS[4], rating: 4.7, reviewCount: 203, stock: 11, shipping: "Express (1-2 days)", shippingPrice: 0, returns: "30-day returns", postedAt: "4 days ago", views: 7840, saves: 1023, featured: true, badge: "Top Rated" },
  { id: "p7", title: "Wabi-Sabi Bud Vase Collection", description: "A trio of hand-thrown stoneware vases celebrating imperfection. Glazed with wood-ash and iron oxide at 1300°C in an anagama kiln.", price: 145, currency: "USD", category: "Home & Kitchen", subcategory: "Decor", condition: "New", brand: "Osei Studio", tags: ["vase", "ceramic", "wabi-sabi", "handmade", "stoneware"], thumbnail: "", images: ["", ""], thumbnailGradient: "linear-gradient(135deg,#1c1410 0%,#3d2b1f 50%,#5c4033 100%)", seller: SELLERS[2], rating: 4.7, reviewCount: 38, stock: 6, shipping: "Standard (5-7 days)", shippingPrice: 15, returns: "No returns (handmade)", postedAt: "2 weeks ago", views: 920, saves: 112, featured: false },
  { id: "p8", title: "Nexus Dev Stack License — Pro", description: "Lifetime license for the complete Nexus developer toolkit. Includes CLI, API access (5M requests/mo), priority support, and all future updates.", price: 399, currency: "USD", category: "Software", subcategory: "Developer Tools", condition: "Digital", brand: "Nexus", tags: ["software", "license", "developer", "API", "lifetime"], thumbnail: "", images: [""], thumbnailGradient: "linear-gradient(135deg,#0d0520 0%,#1a0938 50%,#3b0764 100%)", seller: SELLERS[4], rating: 4.9, reviewCount: 567, stock: 999, shipping: "Instant Download", shippingPrice: 0, returns: "7-day refund", postedAt: "6 months ago", views: 24300, saves: 3410, featured: true, badge: "Digital" },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home & Kitchen", "Software", "Art & Collectibles", "Sports", "Books"];
const CONDITIONS = ["Any", "New", "Like New", "Good", "Digital"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Most Popular", "Newest", "Best Rated", "Most Saved"];
const BRANDS = ["All Brands", "ArcStudio", "Yamada Ceramics", "Ferri Milano", "Lumina Studio", "Aria Atelier", "Mono Labs", "Osei Studio", "Nexus"];

// ── HELPERS ─────────────────────────────────────────────────────────────────
function ThumbnailSVG({ gradient, title, badge }: { gradient: string; title: string; badge?: string }) {
  const words = title.split(" ").slice(0, 2).join(" ");
  return (
    <div style={{ width: "100%", height: "100%", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", bottom: 16, right: 16, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "0 12px" }}>{words}</span>
      {badge && <div style={{ position: "absolute", top: 12, left: 12, padding: "3px 10px", borderRadius: 6, background: "rgba(124,58,237,0.6)", border: "1px solid rgba(168,85,247,0.5)", fontSize: 10, fontWeight: 700, color: "#e9d5ff", fontFamily: "'Fira Code', monospace", letterSpacing: 1 }}>{badge}</div>}
    </div>
  );
}

function ImageSVG({ gradient, index }: { gradient: string; index: number }) {
  return (
    <div style={{ width: "100%", height: "100%", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at ${20 + index * 20}% ${30 + index * 15}%, rgba(255,255,255,0.07) 0%, transparent 55%)` }} />
      <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 2 }}>IMG {index + 1}</span>
    </div>
  );
}

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
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

// ── SIDEBAR (identical to dashboard, hover to expand) ─────────────────────

// ── REVIEW MODAL ─────────────────────────────────────────────────────────────
function ReviewModal({ product, userReviews, onSubmit, onEdit, onDelete, onClose }: {
  product: Product; userReviews: UserReview[];
  onSubmit: (productId: string, rating: number, comment: string) => void;
  onEdit: (id: string, rating: number, comment: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const existing = userReviews.find(r => r.productId === product.id);
  const [rating, setRating] = useState(existing?.rating || 5);
  const [comment, setComment] = useState(existing?.comment || "");
  const [hoverStar, setHoverStar] = useState(0);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    if (existing && !editMode) return;
    if (existing && editMode) { onEdit(existing.id, rating, comment.trim()); }
    else { onSubmit(product.id, rating, comment.trim()); }
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 500, background: "#0d0d18", border: "1px solid rgba(130,80,255,0.25)", borderRadius: 22, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", animation: "menuIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding: "22px 26px 18px", borderBottom: "1px solid rgba(130,80,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#f0eeff" }}>{existing && !editMode ? "Your Review" : existing && editMode ? "Edit Review" : "Write a Review"}</div>
            <div style={{ fontSize: 12, color: "#7b7a9a", marginTop: 2 }}>{product.title}</div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0eeff" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
          </button>
        </div>

        <div style={{ padding: "22px 26px" }}>
          {/* Show existing review */}
          {existing && !editMode ? (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Your rating</div>
                <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width={20} height={20} viewBox="0 0 24 24" fill={s <= existing.rating ? "#f59e0b" : "rgba(245,158,11,0.2)"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                </div>
                <div style={{ fontSize: 13, color: "#7b7a9a", lineHeight: 1.7, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(130,80,255,0.1)", borderRadius: 10, padding: "12px 14px" }}>"{existing.comment}"</div>
                <div style={{ fontSize: 11, color: "#4a4a6a", marginTop: 8, fontFamily: "'Fira Code', monospace" }}>Posted on {existing.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setRating(existing.rating); setComment(existing.comment); setEditMode(true); }} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>✏ Edit Review</button>
                <button onClick={() => { onDelete(existing.id); onClose(); }} style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>🗑 Remove</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Your rating</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)} onClick={() => setRating(s)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    <svg width={28} height={28} viewBox="0 0 24 24" fill={(hoverStar || rating) >= s ? "#f59e0b" : "rgba(245,158,11,0.15)"} style={{ transition: "fill 0.1s" }}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
                <span style={{ marginLeft: 8, alignSelf: "center", fontSize: 13, color: "#c084fc", fontFamily: "'Fira Code', monospace" }}>{hoverStar || rating}.0</span>
              </div>

              <div style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Your review</div>
              <textarea value={comment} onChange={e => setComment(e.target.value.slice(0, 500))} placeholder="Share your experience with this product..." rows={4}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
              <div style={{ fontSize: 11, color: "#4a4a6a", textAlign: "right", marginTop: 4, fontFamily: "'Fira Code', monospace" }}>{comment.length}/500</div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {editMode && <button onClick={() => setEditMode(false)} style={{ padding: "11px 16px", borderRadius: 10, background: "transparent", border: "1px solid rgba(130,80,255,0.2)", color: "#7b7a9a", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Cancel</button>}
                <button onClick={handleSubmit} disabled={!comment.trim()}
                  style={{ flex: 1, padding: "12px", borderRadius: 10, background: comment.trim() ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(124,58,237,0.2)", border: "none", color: comment.trim() ? "white" : "#7b7a9a", fontSize: 14, fontWeight: 700, cursor: comment.trim() ? "pointer" : "default", fontFamily: "'Playfair Display', serif", boxShadow: comment.trim() ? "0 4px 20px rgba(124,58,237,0.4)" : "none", transition: "all 0.2s" }}>
                  {editMode ? "Save Changes" : "Submit Review"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ALL REVIEWS MODAL ─────────────────────────────────────────────────────────
function AllReviewsModal({ product, userReviews, onClose, onOpenReview }: {
  product: Product; userReviews: UserReview[]; onClose: () => void; onOpenReview: () => void;
}) {
  const mockReviews = [
    { id: "mr1", reviewer: "Alex Morgan", initials: "AM", color: "linear-gradient(135deg,#0ea5e9,#6366f1)", rating: 5, comment: "Absolutely perfect condition, exactly as described. Fast response and smooth transaction.", date: new Date("2025-01-18") },
    { id: "mr2", reviewer: "Sofia Patel", initials: "SP", color: "linear-gradient(135deg,#ec4899,#8b5cf6)", rating: 4, comment: "Great product, works perfectly. Minor cosmetic issue I wasn't told about but overall excellent.", date: new Date("2025-01-12") },
    { id: "mr3", reviewer: "James Wu", initials: "JW", color: "linear-gradient(135deg,#f59e0b,#ef4444)", rating: 5, comment: "Outstanding quality and incredibly fast shipping. Would highly recommend this seller.", date: new Date("2025-01-08") },
  ];
  const myReview = userReviews.find(r => r.productId === product.id);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 640, maxHeight: "85vh", background: "#0d0d18", border: "1px solid rgba(130,80,255,0.25)", borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", animation: "menuIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(130,80,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#f0eeff" }}>All Reviews</div>
            <div style={{ fontSize: 12, color: "#7b7a9a", marginTop: 2 }}>{product.title} · ⭐ {product.rating} avg · {product.reviewCount} reviews</div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0eeff" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* My review */}
          {myReview && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Your Review</div>
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(168,85,247,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <Stars rating={myReview.rating} size={13} />
                  <button onClick={() => { onClose(); setTimeout(onOpenReview, 100); }} style={{ background: "none", border: "none", color: "#c084fc", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Edit</button>
                </div>
                <p style={{ fontSize: 13, color: "#7b7a9a", lineHeight: 1.6 }}>"{myReview.comment}"</p>
                <div style={{ fontSize: 10, color: "#4a4a6a", marginTop: 6, fontFamily: "'Fira Code', monospace" }}>{myReview.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              </div>
            </div>
          )}

          <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Buyer Reviews</div>
          {mockReviews.map(r => (
            <div key={r.id} style={{ padding: "16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(130,80,255,0.1)", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", fontFamily: "'Playfair Display', serif" }}>{r.initials}</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#f0eeff" }}>{r.reviewer}</div>
                    <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code', monospace" }}>{r.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  </div>
                </div>
                <Stars rating={r.rating} size={12} />
              </div>
              <p style={{ fontSize: 13, color: "#7b7a9a", lineHeight: 1.6 }}>"{r.comment}"</p>
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(130,80,255,0.12)", flexShrink: 0 }}>
          <button onClick={() => { onClose(); setTimeout(onOpenReview, 100); }}
            style={{ width: "100%", padding: "12px", borderRadius: 12, background: myReview ? "rgba(124,58,237,0.1)" : "linear-gradient(135deg,#7c3aed,#a855f7)", border: myReview ? "1px solid rgba(168,85,247,0.3)" : "none", color: myReview ? "#c084fc" : "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", boxShadow: myReview ? "none" : "0 4px 20px rgba(124,58,237,0.4)", transition: "all 0.2s" }}>
            {myReview ? "✏ Edit Your Review" : "✍ Write a Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onClick, saved, onSave, userReview }: { product: Product; onClick: () => void; saved: boolean; onSave: (id: string) => void; userReview?: UserReview }) {
  const [hovered, setHovered] = useState(false);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer", border: `1px solid ${hovered ? "rgba(168,85,247,0.4)" : "rgba(130,80,255,0.14)"}`, background: "#111120", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", transform: hovered ? "translateY(-6px)" : "translateY(0)", boxShadow: hovered ? "0 24px 60px rgba(124,58,237,0.18)" : "0 2px 20px rgba(0,0,0,0.3)", position: "relative" }}>
      {/* Thumbnail */}
      <div onClick={onClick} style={{ height: 220, position: "relative", overflow: "hidden" }}>
        <ThumbnailSVG gradient={product.thumbnailGradient} title={product.title} badge={product.badge} />
        {discount > 0 && <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", borderRadius: 6, background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)", fontSize: 11, fontWeight: 700, color: "#34d399", fontFamily: "'Fira Code', monospace" }}>-{discount}%</div>}
        <button onClick={e => { e.stopPropagation(); onSave(product.id); }}
          style={{ position: "absolute", bottom: 12, right: 12, width: 34, height: 34, borderRadius: "50%", border: `1px solid ${saved ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.15)"}`, background: saved ? "rgba(124,58,237,0.4)" : "rgba(0,0,0,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", transition: "all 0.2s" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill={saved ? "#c084fc" : "none"} stroke={saved ? "#c084fc" : "rgba(255,255,255,0.6)"} strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </button>
        {userReview && <div style={{ position: "absolute", bottom: 12, left: 12, padding: "3px 9px", borderRadius: 6, background: "rgba(124,58,237,0.3)", border: "1px solid rgba(168,85,247,0.4)", fontSize: 10, color: "#c084fc", fontFamily: "'Fira Code', monospace", fontWeight: 600 }}>⭐ Reviewed</div>}
      </div>

      {/* Info */}
      <div onClick={onClick} style={{ padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(192,132,252,0.8)", fontFamily: "'Fira Code', monospace", letterSpacing: 1, background: "rgba(124,58,237,0.1)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(124,58,237,0.2)" }}>{product.category}</span>
          <span style={{ fontSize: 10, color: "#7b7a9a", fontFamily: "'Fira Code', monospace", letterSpacing: 1, background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 4 }}>{product.condition}</span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#f0eeff", marginBottom: 5, lineHeight: 1.3 }}>{product.title}</h3>
        <p style={{ fontSize: 12, color: "#7b7a9a", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <Stars rating={product.rating} size={11} />
          <span style={{ fontSize: 11, color: "#7b7a9a", fontFamily: "'Fira Code', monospace" }}>{product.rating} ({product.reviewCount})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid rgba(130,80,255,0.1)" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: product.seller.avatarGradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "white", fontFamily: "'Playfair Display', serif", flexShrink: 0 }}>{product.seller.initials}</div>
          <span style={{ fontSize: 11, color: "#7b7a9a" }}>{product.seller.name}</span>
          {product.seller.verified && <svg width={12} height={12} viewBox="0 0 24 24" fill="#a855f7"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>}
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code', monospace" }}>{product.postedAt}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: "#f0eeff" }}>${product.price}</span>
              {product.originalPrice && <span style={{ fontSize: 12, color: "#4a4a6a", textDecoration: "line-through" }}>${product.originalPrice}</span>}
            </div>
            <div style={{ fontSize: 10, color: "#7b7a9a", fontFamily: "'Fira Code', monospace", marginTop: 2 }}>{product.shippingPrice === 0 ? "Free shipping" : `+$${product.shippingPrice} shipping`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#4a4a6a", fontSize: 10 }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/></svg>
            {product.views.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Order {
  id: string;
  product: Product;
  date: Date;
  status: "Processing" | "Shipped" | "Delivered";
}

// ── ORDERS MODAL ─────────────────────────────────────────────────────────────
function OrdersModal({ orders, onClose }: { orders: Order[]; onClose: () => void }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 600, maxHeight: "80vh", background: "#0d0d18", border: "1px solid rgba(130,80,255,0.25)", borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", animation: "menuIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(130,80,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#f0eeff" }}>Your Orders</div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0eeff" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#7b7a9a" }}>No orders yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orders.map(order => (
                <div key={order.id} style={{ display: "flex", gap: 16, padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(130,80,255,0.1)" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <ThumbnailSVG gradient={order.product.thumbnailGradient} title="" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#f0eeff" }}>{order.product.title}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#c084fc" }}>${order.product.price}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#7b7a9a", marginBottom: 8 }}>Order ID: #{order.id} · {order.date.toLocaleDateString()}</div>
                    <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: 11, fontWeight: 600, fontFamily: "'Fira Code', monospace" }}>{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT MODAL ─────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, saved, onSave, userReviews, onOpenReview, onOpenAllReviews, onBuy }: {
  product: Product; onClose: () => void; saved: boolean; onSave: (id: string) => void;
  userReviews: UserReview[]; onOpenReview: () => void; onOpenAllReviews: () => void; onBuy: (product: Product) => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const allImgs = [0, ...product.images.map((_, i) => i + 1)];
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const myReview = userReviews.find(r => r.productId === product.id);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1100, maxHeight: "90vh", background: "#0d0d18", border: "1px solid rgba(130,80,255,0.2)", borderRadius: 28, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 18, right: 18, zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f0eeff" }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
        </button>

        <div style={{ display: "flex", overflow: "auto", height: "100%", maxHeight: "90vh", flexDirection: window.innerWidth < 700 ? "column" : "row" }}>
          {/* Images */}
          <div style={{ width: window.innerWidth < 700 ? "100%" : "45%", minWidth: window.innerWidth < 700 ? "auto" : 280, flexShrink: 0, display: "flex", flexDirection: "column", background: "#08080f", borderRight: window.innerWidth < 700 ? "none" : "1px solid rgba(130,80,255,0.12)", borderBottom: window.innerWidth < 700 ? "1px solid rgba(130,80,255,0.12)" : "none" }}>
            <div style={{ flex: 1, minHeight: window.innerWidth < 700 ? 200 : 320, position: "relative" }}>
              {activeImg === 0 ? <ThumbnailSVG gradient={product.thumbnailGradient} title={product.title} badge={product.badge} /> : <ImageSVG gradient={product.thumbnailGradient} index={activeImg - 1} />}
            </div>
            <div style={{ display: "flex", gap: 6, padding: "10px 14px", overflowX: "auto" }}>
              {allImgs.map(imgIdx => (
                <button key={imgIdx} onClick={() => setActiveImg(imgIdx)}
                  style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 8, overflow: "hidden", border: `2px solid ${activeImg === imgIdx ? "#a855f7" : "rgba(130,80,255,0.2)"}`, cursor: "pointer", background: "none", padding: 0 }}>
                  {imgIdx === 0 ? <ThumbnailSVG gradient={product.thumbnailGradient} title="" /> : <ImageSVG gradient={product.thumbnailGradient} index={imgIdx - 1} />}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, background: "rgba(124,58,237,0.12)", padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(124,58,237,0.25)", textTransform: "uppercase" }}>{product.category} · {product.subcategory}</span>
              {product.badge && <span style={{ fontSize: 11, color: "#f0eeff", fontFamily: "'Fira Code', monospace", background: "rgba(124,58,237,0.25)", padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(168,85,247,0.4)" }}>{product.badge}</span>}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#f0eeff", lineHeight: 1.2, marginBottom: 12 }}>{product.title}</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
              <Stars rating={product.rating} size={13} />
              <span style={{ fontSize: 13, color: "#c084fc", fontWeight: 600 }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: "#7b7a9a" }}>({product.reviewCount} reviews)</span>
              <button onClick={onOpenAllReviews} style={{ fontSize: 12, color: "#7b7a9a", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(130,80,255,0.2)", padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>View all</button>
              <span style={{ fontSize: 13, color: "#7b7a9a" }}>{product.views.toLocaleString()} views</span>
            </div>

            {/* Price */}
            <div style={{ padding: "16px 20px", borderRadius: 14, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: "#f0eeff" }}>${product.price}</span>
                {product.originalPrice && <>
                  <span style={{ fontSize: 16, color: "#4a4a6a", textDecoration: "line-through" }}>${product.originalPrice}</span>
                  <span style={{ fontSize: 12, color: "#34d399", fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>Save ${product.originalPrice - product.price} ({discount}%)</span>
                </>}
              </div>
              <div style={{ fontSize: 12, color: "#7b7a9a" }}>{product.shippingPrice === 0 ? "✓ Free shipping" : `+ $${product.shippingPrice} shipping`} · {product.returns}</div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <button onClick={() => onBuy(product)} style={{ flex: 2, padding: "12px 16px", borderRadius: 12, background: "linear-gradient(135deg,#10b981,#34d399)", border: "none", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", boxShadow: "0 4px 20px rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Buy Now
              </button>
              <button onClick={() => onSave(product.id)} style={{ flex: "0 0 auto", padding: "12px 16px", borderRadius: 12, background: saved ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${saved ? "rgba(168,85,247,0.5)" : "rgba(130,80,255,0.2)"}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: saved ? "#c084fc" : "#7b7a9a", fontSize: 13, fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill={saved ? "#c084fc" : "none"} stroke={saved ? "#c084fc" : "#7b7a9a"} strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                {saved ? "Saved" : "Save"}
              </button>
              <button onClick={onOpenReview} style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: myReview ? "rgba(124,58,237,0.1)" : "rgba(245,158,11,0.08)", border: `1px solid ${myReview ? "rgba(168,85,247,0.35)" : "rgba(245,158,11,0.25)"}`, color: myReview ? "#c084fc" : "#f59e0b", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {myReview ? `✏ Edit Review (${myReview.rating}⭐)` : "✍ Write a Review"}
              </button>
              <button onClick={onOpenAllReviews} style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(130,80,255,0.2)", color: "#7b7a9a", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                👥 See All Reviews
              </button>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#f0eeff", marginBottom: 8 }}>About this product</h4>
              <p style={{ fontSize: 13, color: "#7b7a9a", lineHeight: 1.8 }}>{product.description}</p>
            </div>

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {[{ label: "Brand", value: product.brand }, { label: "Condition", value: product.condition }, { label: "Shipping", value: product.shipping }, { label: "Returns", value: product.returns }, { label: "Category", value: product.subcategory }, { label: "Listed", value: product.postedAt }].map(({ label, value }) => (
                <div key={label} style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(130,80,255,0.1)" }}>
                  <div style={{ fontSize: 9, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "#c084fc", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
              {product.tags.map(tag => <span key={tag} style={{ padding: "3px 10px", borderRadius: 100, border: "1px solid rgba(130,80,255,0.2)", fontSize: 11, color: "#7b7a9a", fontFamily: "'Fira Code', monospace" }}>#{tag}</span>)}
            </div>

            {/* Seller */}
            <div style={{ padding: "18px 20px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(130,80,255,0.15)" }}>
              <div style={{ fontSize: 9, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Sold by</div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: product.seller.avatarGradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", fontFamily: "'Playfair Display', serif", border: "2px solid rgba(168,85,247,0.3)", flexShrink: 0 }}>{product.seller.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#f0eeff" }}>{product.seller.name}</span>
                    {product.seller.verified && <svg width={13} height={13} viewBox="0 0 24 24" fill="#a855f7"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>}
                  </div>
                  <p style={{ fontSize: 12, color: "#7b7a9a", lineHeight: 1.6, marginBottom: 8 }}>{product.seller.bio}</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[{ icon: "⭐", label: `${product.seller.rating}` }, { icon: "📦", label: `${product.seller.sales.toLocaleString()} sales` }, { icon: "📍", label: product.seller.location }].map(({ icon, label }) => <span key={label} style={{ fontSize: 11, color: "#7b7a9a" }}>{icon} {label}</span>)}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button style={{ flex: 1, padding: "9px", borderRadius: 9, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#c084fc", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>View Profile</button>
                <button style={{ flex: 1, padding: "9px", borderRadius: 9, background: "transparent", border: "1px solid rgba(130,80,255,0.2)", color: "#7b7a9a", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Message Seller</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FILTER PANEL ──────────────────────────────────────────────────────────────
function FilterPanel({ filters, setFilters, onClose }: { filters: any; setFilters: (f: any) => void; onClose: () => void }) {
  const [local, setLocal] = useState(filters);
  const update = (key: string, value: any) => setLocal((prev: any) => ({ ...prev, [key]: value }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", marginLeft: "auto", width: "min(420px, 100%)", height: "100%", background: "#0d0d18", borderLeft: "1px solid rgba(130,80,255,0.2)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(130,80,255,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0d0d18", zIndex: 1 }}>
          <div><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: "#f0eeff" }}>Advanced Filters</div></div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "#f0eeff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
          </button>
        </div>

        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Price */}
          <div>
            <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Price Range</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input type="number" placeholder="Min $" value={local.minPrice} onChange={e => update("minPrice", e.target.value)} style={{ flex: 1, padding: "9px 12px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none" }} />
              <input type="number" placeholder="Max $" value={local.maxPrice} onChange={e => update("maxPrice", e.target.value)} style={{ flex: 1, padding: "9px 12px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none" }} />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Location</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Country</div>
                <input type="text" placeholder="e.g. United States, Japan..." value={local.country} onChange={e => update("country", e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>State / Province</div>
                <input type="text" placeholder="e.g. California, Tokyo..." value={local.state} onChange={e => update("state", e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>City</div>
                <input type="text" placeholder="e.g. Los Angeles, Kyoto..." value={local.city} onChange={e => update("city", e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Category</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => update("category", cat)} style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${local.category === cat ? "rgba(168,85,247,0.5)" : "rgba(130,80,255,0.2)"}`, background: local.category === cat ? "rgba(124,58,237,0.2)" : "transparent", color: local.category === cat ? "#c084fc" : "#7b7a9a", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{cat}</button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Condition</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CONDITIONS.map(cond => (
                <button key={cond} onClick={() => update("condition", cond)} style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${local.condition === cond ? "rgba(168,85,247,0.5)" : "rgba(130,80,255,0.2)"}`, background: local.condition === cond ? "rgba(124,58,237,0.2)" : "transparent", color: local.condition === cond ? "#c084fc" : "#7b7a9a", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>{cond}</button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Brand</div>
            <select value={local.brand} onChange={e => update("brand", e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, background: "#111120", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", cursor: "pointer" }}>
              {BRANDS.map(b => <option key={b} value={b} style={{ background: "#111120" }}>{b}</option>)}
            </select>
          </div>

          {/* Rating */}
          <div>
            <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Min Rating</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[0, 3, 3.5, 4, 4.5, 5].map(r => (
                <button key={r} onClick={() => update("minRating", r)} style={{ flex: 1, padding: "7px 4px", borderRadius: 7, border: `1px solid ${local.minRating === r ? "rgba(168,85,247,0.5)" : "rgba(130,80,255,0.2)"}`, background: local.minRating === r ? "rgba(124,58,237,0.2)" : "transparent", color: local.minRating === r ? "#c084fc" : "#7b7a9a", fontSize: 11, cursor: "pointer", fontFamily: "'Fira Code', monospace" }}>{r === 0 ? "Any" : `${r}+`}</button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div>
            <div style={{ fontSize: 11, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Options</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ key: "freeShipping", label: "Free shipping only" }, { key: "featured", label: "Featured items only" }, { key: "inStock", label: "In stock only" }, { key: "verified", label: "Verified sellers only" }].map(({ key, label }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div onClick={() => update(key, !local[key])} style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${local[key] ? "#a855f7" : "rgba(130,80,255,0.3)"}`, background: local[key] ? "rgba(124,58,237,0.4)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
                    {local[key] && <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: "#7b7a9a", fontFamily: "'Outfit', sans-serif" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(130,80,255,0.12)", display: "flex", gap: 10, position: "sticky", bottom: 0, background: "#0d0d18" }}>
          <button onClick={() => setLocal({ category: "All", condition: "Any", brand: "All Brands", minPrice: "", maxPrice: "", minRating: 0, freeShipping: false, featured: false, inStock: false, verified: false, country: "", state: "", city: "" })} style={{ flex: 1, padding: "11px", borderRadius: 10, background: "transparent", border: "1px solid rgba(130,80,255,0.2)", color: "#7b7a9a", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Reset</button>
          <button onClick={() => { setFilters(local); onClose(); }} style={{ flex: 2, padding: "11px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Playfair Display', serif", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN BUY PAGE ─────────────────────────────────────────────────────────────
export default function BuyPage({ onNavigate }: { onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState("All");
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [allReviewsProduct, setAllReviewsProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    category: "All", condition: "Any", brand: "All Brands",
    minPrice: "", maxPrice: "", minRating: 0,
    freeShipping: false, featured: false, inStock: false, verified: false,
    country: "", state: "", city: "",
  });

  useEffect(() => {
    fetchPublicProducts();
  }, []);

  const handleBuy = (product: Product) => {
    const newOrder: Order = {
      id: Math.random().toString(36).slice(2, 8).toUpperCase(),
      product,
      date: new Date(),
      status: "Processing"
    };
    setOrders(prev => [newOrder, ...prev]);
    alert(`Order #${newOrder.id} placed successfully!`);
    setSelectedProduct(null); // Close product modal
  };

  const fetchPublicProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map((p: any) => {
        // Mock seller data based on user_id
        const sellerIndex = Math.abs(p.user_id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % SELLERS.length;
        const seller = SELLERS[sellerIndex];

        return {
          id: p.id,
          title: p.name,
          description: p.description,
          price: parseFloat(p.price),
          currency: "USD",
          category: p.category,
          subcategory: p.tags && p.tags.length > 0 ? p.tags[0] : "General",
          condition: p.condition,
          brand: p.brand || "Unknown",
          tags: p.tags || [],
          thumbnail: p.thumbnail || "",
          images: p.reference_images || [],
          thumbnailGradient: "linear-gradient(135deg,#1a1035 0%,#2d1b69 50%,#4c1d95 100%)", // Default gradient
          seller: {
            ...seller,
            location: p.city && p.country ? `${p.city}, ${p.country}` : seller.location
          },
          rating: 0, // Mock
          reviewCount: 0, // Mock
          stock: 1, // Mock
          shipping: "Standard",
          shippingPrice: 0,
          returns: p.returns || "No returns",
          postedAt: new Date(p.created_at).toLocaleDateString(),
          views: 0,
          saves: p.share_count || 0,
          featured: false
        };
      });

      setProducts([...formattedProducts, ...MOCK_PRODUCTS]);
    } catch (error) {
      console.error('Error fetching public products:', error);
    }
  };

  const toggleSave = (id: string) => setSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleSubmitReview = useCallback((productId: string, rating: number, comment: string) => {
    const review: UserReview = { id: Math.random().toString(36).slice(2), productId, rating, comment, date: new Date() };
    setUserReviews(prev => [...prev, review]);
  }, []);

  const handleEditReview = useCallback((id: string, rating: number, comment: string) => {
    setUserReviews(prev => prev.map(r => r.id === id ? { ...r, rating, comment } : r));
  }, []);

  const handleDeleteReview = useCallback((id: string) => {
    setUserReviews(prev => prev.filter(r => r.id !== id));
  }, []);

  const activeFilterCount = [
    filters.category !== "All", filters.condition !== "Any", filters.brand !== "All Brands",
    filters.minPrice !== "", filters.maxPrice !== "", filters.minRating > 0,
    filters.freeShipping, filters.featured, filters.inStock, filters.verified,
    filters.country !== "", filters.state !== "", filters.city !== "",
  ].filter(Boolean).length;

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)) || p.seller.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const cat = activeCategory === "All" || p.category === activeCategory;
    const fCat = filters.category === "All" || p.category === filters.category;
    const fCond = filters.condition === "Any" || p.condition === filters.condition;
    const fBrand = filters.brand === "All Brands" || p.brand === filters.brand;
    const fMin = !filters.minPrice || p.price >= Number(filters.minPrice);
    const fMax = !filters.maxPrice || p.price <= Number(filters.maxPrice);
    const fRating = p.rating >= filters.minRating;
    const fFreeShip = !filters.freeShipping || p.shippingPrice === 0;
    const fFeatured = !filters.featured || p.featured;
    const fStock = !filters.inStock || p.stock > 0;
    const fVerified = !filters.verified || p.seller.verified;
    // Location filters (case-insensitive partial match against seller location)
    const sellerLoc = p.seller.location.toLowerCase();
    const fCountry = !filters.country || sellerLoc.includes(filters.country.toLowerCase());
    const fState = !filters.state || sellerLoc.includes(filters.state.toLowerCase());
    const fCity = !filters.city || sellerLoc.includes(filters.city.toLowerCase());
    return matchSearch && cat && fCat && fCond && fBrand && fMin && fMax && fRating && fFreeShip && fFeatured && fStock && fVerified && fCountry && fState && fCity;
  }).sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High": return a.price - b.price;
      case "Price: High to Low": return b.price - a.price;
      case "Most Popular": return b.views - a.views;
      case "Best Rated": return b.rating - a.rating;
      case "Most Saved": return b.saves - a.saves;
      default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; background: #08080f; color: #f0eeff; font-family: 'Outfit', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #111120; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 10px; }
        input::placeholder { color: #4a4a6a; } select option { background: #111120; } textarea::placeholder { color: #4a4a6a; }
        @keyframes slideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes menuIn { from{opacity:0;transform:scale(0.96) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes logoPulse { 0%,100%{box-shadow:0 0 12px rgba(124,58,237,0.4)} 50%{box-shadow:0 0 28px rgba(124,58,237,0.7),0 0 45px rgba(168,85,247,0.25)} }

        /* ── LAYOUT ── */
        .buy-wrap { display: flex; height: 100vh; overflow: hidden; position: relative; z-index: 1; }

        /* ── SIDEBAR ── */
        .buy-sidebar {
          width: 64px; flex-shrink: 0;
          background: #111120; border-right: 1px solid rgba(130,80,255,0.14);
          display: flex; flex-direction: column;
          padding: 20px 0;
          position: relative; z-index: 200;
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
        }
        .buy-sidebar:hover { width: 240px; }
        .buy-sidebar::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(168,85,247,0.3), transparent); }

        .sb-logo { display: flex; align-items: center; gap: 10px; padding: 0 15px; margin-bottom: 24px; white-space: nowrap; overflow: hidden; min-width: 240px; }
        .sb-logo-icon { width: 34px; height: 34px; flex-shrink: 0; background: linear-gradient(135deg,#7c3aed,#a855f7); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(124,58,237,0.4); animation: logoPulse 3s ease-in-out infinite; }
        .sb-logo span { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 17px; opacity: 0; transition: opacity 0.15s; white-space: nowrap; }
        .buy-sidebar:hover .sb-logo span { opacity: 1; }

        .sb-profile { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px 16px; border-bottom: 1px solid rgba(130,80,255,0.14); margin-bottom: 8px; overflow: hidden; }
        .sb-avatar { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg,#7c3aed,#a855f7); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-weight: 800; font-size: 16px; color: white; border: 2px solid rgba(168,85,247,0.4); box-shadow: 0 0 16px rgba(124,58,237,0.3); transition: all 0.28s; }
        .buy-sidebar:hover .sb-avatar { width: 64px; height: 64px; font-size: 22px; }
        .sb-profile-text { opacity: 0; transition: opacity 0.15s; text-align: center; white-space: nowrap; }
        .buy-sidebar:hover .sb-profile-text { opacity: 1; }
        .sb-name { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px; }
        .sb-role { font-size: 11px; color: #c084fc; font-family: 'Fira Code', monospace; margin-top: 2px; }

        .sb-section { font-size: 10px; letter-spacing: 2px; color: #4a4a6a; text-transform: uppercase; font-family: 'Fira Code', monospace; padding: 0 14px; margin-bottom: 6px; margin-top: 16px; white-space: nowrap; overflow: hidden; opacity: 0; transition: opacity 0.15s; }
        .buy-sidebar:hover .sb-section { opacity: 1; }

        .sb-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; margin: 1px 8px; border-radius: 10px; color: #7b7a9a; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.18s; border: 1px solid transparent; text-decoration: none; white-space: nowrap; overflow: hidden; }
        .sb-nav-item:hover { background: rgba(124,58,237,0.08); color: #f0eeff; border-color: rgba(130,80,255,0.14); }
        .sb-nav-item.active { background: rgba(124,58,237,0.14); color: #c084fc; border-color: rgba(168,85,247,0.25); }
        .sb-nav-item svg { flex-shrink: 0; opacity: 0.7; }
        .sb-nav-item.active svg { opacity: 1; }
        .sb-nav-item span { opacity: 0; transition: opacity 0.15s; }
        .buy-sidebar:hover .sb-nav-item span { opacity: 1; }

        .sb-bottom { margin-top: auto; border-top: 1px solid rgba(130,80,255,0.14); padding: 12px 8px 0; }
        .sb-user-pill { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px; background: #18182a; border: 1px solid rgba(130,80,255,0.14); overflow: hidden; }
        .sb-user-avatar { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg,#7c3aed,#a855f7); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 11px; color: white; }
        .sb-user-info { opacity: 0; transition: opacity 0.15s; white-space: nowrap; }
        .buy-sidebar:hover .sb-user-info { opacity: 1; }
        .sb-user-info span { display: block; font-size: 13px; font-weight: 500; color: #f0eeff; }
        .sb-user-info small { font-size: 11px; color: #7b7a9a; }

        /* ── MAIN ── */
        .buy-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .buy-topbar { height: 60px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; background: rgba(8,8,15,0.85); border-bottom: 1px solid rgba(130,80,255,0.14); backdrop-filter: blur(16px); }
        .buy-topbar-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; }
        .buy-topbar-right { display: flex; align-items: center; gap: 10px; }
        .buy-search-wrap { display: flex; align-items: center; gap: 8px; background: #18182a; border: 1px solid rgba(130,80,255,0.14); border-radius: 10px; padding: 7px 12px; transition: border-color 0.2s; width: 220px; }
        .buy-search-wrap:focus-within { border-color: rgba(168,85,247,0.4); }
        .buy-search-wrap input { background: none; border: none; outline: none; color: #f0eeff; font-family: 'Outfit', sans-serif; font-size: 13px; width: 100%; }
        .buy-content { flex: 1; overflow-y: auto; padding: 20px; }

        @media (max-width: 768px) {
          .products-grid { grid-template-columns: 1fr 1fr !important; }
          .buy-topbar { padding: 0 14px; }
          .buy-content { padding: 14px; }
          .buy-search-wrap { width: 160px; }
          .stats-bar { flex-wrap: wrap !important; gap: 16px !important; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* background grid */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <div className="buy-wrap">

        {/* ── SIDEBAR ── */}
        <aside className="buy-sidebar">
          {/* Logo */}
          <div className="sb-logo">
            <div className="sb-logo-icon">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span>Nexus</span>
          </div>

          {/* Profile */}
          <div className="sb-profile">
            <div className="sb-avatar">NC</div>
            <div className="sb-profile-text">
              <div className="sb-name">Noah Carter</div>
              <div className="sb-role">Buyer · Member</div>
            </div>
          </div>

          {/* Nav */}
          <div className="sb-section">MAIN</div>
          <a href="#" className="sb-nav-item" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
          </a>
          <a href="#" className="sb-nav-item" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span>Dashboard</span>
          </a>
          <div className="sb-nav-item active">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Buy</span>
          </div>
          <a href="#" className="sb-nav-item" onClick={(e) => { e.preventDefault(); setShowOrders(true); }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Orders {orders.length > 0 ? `(${orders.length})` : ""}</span>
          </a>
          <a href="#" className="sb-nav-item" onClick={(e) => { e.preventDefault(); onNavigate('favourites'); }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill={savedIds.size > 0 ? "#c084fc" : "none"} stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>Favourites {savedIds.size > 0 ? `(${savedIds.size})` : ""}</span>
          </a>
          <a href="#" className="sb-nav-item">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Settings</span>
          </a>

          {/* Bottom user pill */}
          <div className="sb-section">LEGAL</div>
          <a href="#" className="sb-nav-item" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Privacy</span>
          </a>
          <a href="#" className="sb-nav-item" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Terms</span>
          </a>
          <a href="#" className="sb-nav-item" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>Contact</span>
          </a>

          <div className="sb-bottom">
            <div className="sb-user-pill">
              <div className="sb-user-avatar">NC</div>
              <div className="sb-user-info">
                <span>Noah Carter</span>
                <small>Buyer</small>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="buy-main">
          {/* Topbar */}
          <header className="buy-topbar">
            <div className="buy-topbar-title">Browse Products</div>
            <div className="buy-topbar-right">
              <div className="buy-search-wrap">
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#4a4a6a" strokeWidth={2}><circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." />
                {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#7b7a9a", cursor: "pointer", padding: 0, display: "flex" }}>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
                </button>}
              </div>
              {/* Favourites + Filter in topbar */}
              <button onClick={() => setShowFilters(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 9, background: activeFilterCount > 0 ? "rgba(124,58,237,0.14)" : "#18182a", border: `1px solid ${activeFilterCount > 0 ? "rgba(168,85,247,0.45)" : "rgba(130,80,255,0.14)"}`, color: activeFilterCount > 0 ? "#c084fc" : "#7b7a9a", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 9, background: savedIds.size > 0 ? "rgba(124,58,237,0.12)" : "#18182a", border: `1px solid ${savedIds.size > 0 ? "rgba(168,85,247,0.35)" : "rgba(130,80,255,0.14)"}`, color: savedIds.size > 0 ? "#c084fc" : "#7b7a9a", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap" }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill={savedIds.size > 0 ? "#c084fc" : "none"} stroke={savedIds.size > 0 ? "#c084fc" : "currentColor"} strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {savedIds.size > 0 ? `Saved (${savedIds.size})` : "Favourites"}
              </button>
            </div>
          </header>

          {/* Scrollable content */}
          <div className="buy-content">
            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(168,85,247,0.04))", border: "1px solid rgba(130,80,255,0.1)", borderRadius: 18, padding: "28px 32px", marginBottom: 20 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 800, color: "#f0eeff", letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 10 }}>
                Discover &amp; Buy<br />
                <span style={{ background: "linear-gradient(135deg,#c084fc,#a855f7,#e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Premium Products.</span>
              </h1>
              <p style={{ fontSize: 14, color: "#7b7a9a", maxWidth: 420, lineHeight: 1.7 }}>Curated marketplace for those who demand quality. From artisan crafts to bleeding-edge tech.</p>
            </div>

            {/* Sort + Category pills row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "7px 10px", borderRadius: 8, background: "#18182a", border: "1px solid rgba(130,80,255,0.2)", color: "#f0eeff", fontSize: 12, fontFamily: "'Outfit', sans-serif", outline: "none", cursor: "pointer" }}>
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 100, border: `1px solid ${activeCategory === cat ? "rgba(168,85,247,0.5)" : "rgba(130,80,255,0.15)"}`, background: activeCategory === cat ? "rgba(124,58,237,0.18)" : "transparent", color: activeCategory === cat ? "#c084fc" : "#7b7a9a", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap" }}>{cat}</button>
                ))}
              </div>
              <span style={{ fontSize: 11, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", whiteSpace: "nowrap" }}>{filtered.length} results</span>
            </div>

            {/* Featured strip */}
            {activeCategory === "All" && !search && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 10, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", width: 16, height: 1, background: "#a855f7" }} />Featured
                </div>
                <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
                  {products.filter(p => p.featured).slice(0, 3).map((product, i) => (
                    <div key={product.id} style={{ animation: `slideIn 0.5s ease ${i * 0.08}s both` }}>
                      <ProductCard product={product} onClick={() => setSelectedProduct(product)} saved={savedIds.has(product.id)} onSave={toggleSave} userReview={userReviews.find(r => r.productId === product.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All products */}
            <div style={{ fontSize: 10, color: "#c084fc", fontFamily: "'Fira Code', monospace", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-block", width: 16, height: 1, background: "#a855f7" }} />
              {search ? `Results for "${search}"` : activeCategory === "All" ? "All Products" : activeCategory}
              <span style={{ flex: 1, height: 1, background: "rgba(130,80,255,0.08)" }} />
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#111120", border: "1px dashed rgba(130,80,255,0.14)", borderRadius: 16 }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f0eeff", marginBottom: 6 }}>No products found</h3>
                <p style={{ fontSize: 13, color: "#7b7a9a" }}>Try adjusting your search or filters</p>
                <button onClick={() => { setSearch(""); setActiveCategory("All"); setFilters({ category: "All", condition: "Any", brand: "All Brands", minPrice: "", maxPrice: "", minRating: 0, freeShipping: false, featured: false, inStock: false, verified: false, country: "", state: "", city: "" }); }}
                  style={{ marginTop: 16, padding: "8px 20px", borderRadius: 9, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
                {filtered.map((product, i) => (
                  <div key={product.id} style={{ animation: `slideIn 0.4s ease ${Math.min(i, 6) * 0.06}s both` }}>
                    <ProductCard product={product} onClick={() => setSelectedProduct(product)} saved={savedIds.has(product.id)} onSave={toggleSave} userReview={userReviews.find(r => r.productId === product.id)} />
                  </div>
                ))}
              </div>
            )}

            {/* Stats bar */}
            <div className="stats-bar" style={{ marginTop: 40, padding: "22px 28px", borderRadius: 16, background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(168,85,247,0.04))", border: "1px solid rgba(130,80,255,0.12)", display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
              {[{ num: "40K+", label: "Active buyers" }, { num: "12K+", label: "Products listed" }, { num: "99.2%", label: "Satisfaction" }, { num: "180+", label: "Countries" }, { num: "$2.4M+", label: "Transactions" }].map(({ num, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#c084fc" }}>{num}</div>
                  <div style={{ fontSize: 10, color: "#4a4a6a", fontFamily: "'Fira Code', monospace", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {showOrders && <OrdersModal orders={orders} onClose={() => setShowOrders(false)} />}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          saved={savedIds.has(selectedProduct.id)}
          onSave={toggleSave}
          userReviews={userReviews}
          onOpenReview={() => { setReviewProduct(selectedProduct); }}
          onOpenAllReviews={() => { setAllReviewsProduct(selectedProduct); }}
          onBuy={handleBuy}
        />
      )}

      {reviewProduct && (
        <ReviewModal
          product={reviewProduct}
          userReviews={userReviews}
          onSubmit={handleSubmitReview}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
          onClose={() => setReviewProduct(null)}
        />
      )}

      {allReviewsProduct && (
        <AllReviewsModal
          product={allReviewsProduct}
          userReviews={userReviews}
          onClose={() => setAllReviewsProduct(null)}
          onOpenReview={() => { setReviewProduct(allReviewsProduct); setAllReviewsProduct(null); }}
        />
      )}

      {showFilters && (
        <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
      )}
    </>
  );
}