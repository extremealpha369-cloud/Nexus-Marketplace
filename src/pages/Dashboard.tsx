import React, { useState, useCallback, useRef, useEffect, memo, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { productService } from "../services/productService";
import { storageService } from "../services/storageService";
import { reviewService } from "../services/reviewService";
import { Product, ProductFormData, Review, Category, Condition } from "../types";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// ─────────────────────────────────────────────
// TYPES (Removed, imported from ../types)
// ─────────────────────────────────────────────



const CATEGORIES: Category[] = ["Tech", "Property", "Entertainment", "Fashion", "Automotive"];
const CONDITIONS: Condition[] = ["New", "Like New", "Good", "Used", "Digital"];
const RETURNS_OPTIONS = ["No returns", "7-day returns", "14-day returns", "30-day returns", "60-day returns"];

const CATEGORY_ICONS: Record<Category, string> = {
  Tech: "💻", Property: "🏠", Entertainment: "🎬", Fashion: "👗", Automotive: "🚗",
};
const CATEGORY_COLORS: Record<Category, string> = {
  Tech: "rgba(99,102,241,0.15)", Property: "rgba(16,185,129,0.15)",
  Entertainment: "rgba(245,158,11,0.15)", Fashion: "rgba(236,72,153,0.15)", Automotive: "rgba(59,130,246,0.15)",
};
const CATEGORY_TEXT: Record<Category, string> = {
  Tech: "#818cf8", Property: "#34d399", Entertainment: "#fbbf24", Fashion: "#f472b6", Automotive: "#60a5fa",
};

const EMPTY_FORM: ProductFormData = {
  name: "", description: "", thumbnail: null, referenceImages: [],
  contactNumber: "", email: "", price: "", country: "", state: "", city: "",
  tags: [], category: "", brand: "", condition: "", returns: "30-day returns", visibility: "public",
};

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const genId = () => Math.random().toString(36).slice(2, 10);
const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
const Icon = {
  Plus: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Search: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Edit: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>),
  Share: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>),
  Globe: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
  Lock: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  Upload: () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>),
  X: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Tag: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>),
  Package: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>),
  Check: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>),
  Image: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>),
  Copy: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>),
  LayoutGrid: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
  List: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
  Heart: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>),
  ShoppingBag: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>),
  Home: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Settings: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
  Shield: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  FileText: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
  Mail: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  MessageSquare: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
  LogOut: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
};

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Outfit:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #08080f; --bg2: #0d0d18; --surface: #111120; --surface2: #18182a; --surface3: #1e1e32;
    --border: rgba(130,80,255,0.14); --border-h: rgba(168,85,247,0.4);
    --purple: #7c3aed; --purple-l: #a855f7; --purple-p: #c084fc; --glow: rgba(124,58,237,0.35);
    --text: #f0eeff; --muted: #7b7a9a; --dim: #4a4a6a;
    --red: #f87171; --green: #34d399; --yellow: #fbbf24;
    --sidebar-w: 240px; --sidebar-collapsed: 64px;
  }
  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 10px; }

  .dash-wrap { display: flex; height: 100vh; overflow: hidden; background: var(--bg); }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-collapsed);
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 20px 0;
    position: relative; z-index: 200;
    transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }
  .sidebar:hover, .sidebar.expanded { width: var(--sidebar-w); }
  .sidebar::after {
    content: '';
    position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(168,85,247,0.3), transparent);
  }

  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 0 15px; margin-bottom: 24px; white-space: nowrap; overflow: hidden;
    min-width: var(--sidebar-w);
  }
  .sidebar-logo-icon {
    width: 34px; height: 34px; flex-shrink: 0;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 20px rgba(124,58,237,0.4);
    animation: logoPulse 3s ease-in-out infinite;
  }
  @keyframes logoPulse {
    0%,100% { box-shadow: 0 0 12px rgba(124,58,237,0.4); }
    50% { box-shadow: 0 0 28px rgba(124,58,237,0.7), 0 0 45px rgba(168,85,247,0.25); }
  }
  .sidebar-logo span { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 17px; opacity: 0; transition: opacity 0.15s; white-space: nowrap; }
  .sidebar:hover .sidebar-logo span, .sidebar.expanded .sidebar-logo span { opacity: 1; }

  .sidebar-profile {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 12px 10px 16px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px; overflow: hidden;
  }
  .profile-avatar-large {
    width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-weight: 800; font-size: 16px;
    border: 2px solid rgba(168,85,247,0.4);
    box-shadow: 0 0 16px rgba(124,58,237,0.3);
    transition: all 0.28s;
  }
  .sidebar:hover .profile-avatar-large, .sidebar.expanded .profile-avatar-large {
    width: 64px; height: 64px; font-size: 22px;
  }
  .profile-text { opacity: 0; transition: opacity 0.15s; text-align: center; white-space: nowrap; }
  .sidebar:hover .profile-text, .sidebar.expanded .profile-text { opacity: 1; }
  .profile-name { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px; }
  .profile-role { font-size: 11px; color: var(--purple-p); font-family: 'Fira Code', monospace; margin-top: 2px; }
  .profile-id { font-size: 10px; color: var(--dim); font-family: 'Fira Code', monospace; margin-top: 2px; }
  .profile-stats { display: flex; gap: 16px; margin-top: 8px; }
  .profile-stat { text-align: center; }
  .profile-stat-val { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 15px; color: var(--text); }
  .profile-stat-label { font-size: 10px; color: var(--dim); margin-top: 1px; }

  .sidebar-section {
    font-size: 10px; letter-spacing: 2px; color: var(--dim);
    text-transform: uppercase; font-family: 'Fira Code', monospace;
    padding: 0 14px; margin-bottom: 6px; margin-top: 16px;
    white-space: nowrap; overflow: hidden;
    opacity: 0; transition: opacity 0.15s;
  }
  .sidebar:hover .sidebar-section, .sidebar.expanded .sidebar-section { opacity: 1; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; margin: 1px 8px; border-radius: 10px;
    color: var(--muted); font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.18s ease;
    border: 1px solid transparent;
    text-decoration: none; white-space: nowrap; overflow: hidden;
    min-width: fit-content;
  }
  .nav-item:hover { background: rgba(124,58,237,0.08); color: var(--text); border-color: var(--border); }
  .nav-item.active { background: rgba(124,58,237,0.14); color: var(--purple-p); border-color: rgba(168,85,247,0.25); }
  .nav-item svg { flex-shrink: 0; opacity: 0.7; }
  .nav-item.active svg { opacity: 1; }
  .nav-item span { opacity: 0; transition: opacity 0.15s; }
  .sidebar:hover .nav-item span, .sidebar.expanded .nav-item span { opacity: 1; }

  .sidebar-bottom {
    margin-top: auto; padding-top: 12px;
    border-top: 1px solid var(--border); padding: 12px 8px 0;
  }
  .user-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    overflow: hidden;
  }
  .user-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif; font-weight: 700; font-size: 11px;
  }
  .user-info { opacity: 0; transition: opacity 0.15s; white-space: nowrap; }
  .sidebar:hover .user-info, .sidebar.expanded .user-info { opacity: 1; }
  .user-info span { display: block; font-size: 13px; font-weight: 500; }
  .user-info small { font-size: 11px; color: var(--muted); }

  /* ── MAIN ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
  .topbar {
    height: 60px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px;
    background: rgba(8,8,15,0.8); border-bottom: 1px solid var(--border);
    backdrop-filter: blur(16px);
  }
  .topbar-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .search-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 7px 12px;
    transition: border-color 0.2s; width: 200px;
  }
  .search-wrap:focus-within { border-color: rgba(168,85,247,0.4); }
  .search-wrap input { background: none; border: none; outline: none; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 13px; width: 100%; }
  .search-wrap input::placeholder { color: var(--dim); }
  .btn-add {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border: none; color: white;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(124,58,237,0.3); white-space: nowrap;
  }
  .btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,58,237,0.5); }

  /* ── CONTENT ── */
  .content { flex: 1; overflow-y: auto; padding: 20px; }

  /* ── STATS ── */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px; transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .stat-card:hover { border-color: var(--border-h); transform: translateY(-2px); }
  .stat-label { font-size: 11px; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; font-family: 'Fira Code', monospace; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; }
  .stat-sub { font-size: 11px; color: var(--muted); margin-top: 3px; }
  .stat-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 24px; opacity: 0.1; }

  /* ── FILTER BAR ── */
  .filter-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-btn {
    padding: 5px 12px; border-radius: 7px; border: 1px solid var(--border);
    background: var(--surface); color: var(--muted);
    font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all 0.18s;
  }
  .filter-btn:hover { border-color: var(--border-h); color: var(--text); }
  .filter-btn.active { background: rgba(124,58,237,0.14); border-color: rgba(168,85,247,0.35); color: var(--purple-p); }
  .view-toggle { display: flex; gap: 4px; margin-left: auto; }
  .view-btn {
    width: 32px; height: 32px; border-radius: 7px; border: 1px solid var(--border);
    background: var(--surface); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s;
  }
  .view-btn.active { background: rgba(124,58,237,0.14); border-color: rgba(168,85,247,0.35); color: var(--purple-p); }

  /* ── PRODUCT CARDS ── */
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  .product-list { display: flex; flex-direction: column; gap: 8px; }
  .product-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    animation: cardIn 0.4s ease both;
  }
  @keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .product-card:hover { border-color: var(--border-h); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(124,58,237,0.1); }
  .product-thumb {
    width: 100%; height: 140px; background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    position: relative; border-bottom: 1px solid var(--border);
  }
  .product-thumb-placeholder { display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--dim); }
  .product-thumb-placeholder span { font-size: 10px; }
  .visibility-badge {
    position: absolute; top: 8px; right: 8px;
    display: flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 600;
    backdrop-filter: blur(10px); border: 1px solid;
  }
  .visibility-badge.public { background: rgba(52,211,153,0.15); border-color: rgba(52,211,153,0.3); color: #34d399; }
  .visibility-badge.private { background: rgba(248,113,113,0.12); border-color: rgba(248,113,113,0.25); color: #f87171; }
  .product-body { padding: 14px; }
  .product-cat {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 5px; font-size: 10px; font-weight: 600;
    margin-bottom: 6px; font-family: 'Fira Code', monospace;
  }
  .product-name {
    font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px;
    margin-bottom: 4px; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .product-price { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 16px; color: var(--purple-p); margin-bottom: 3px; }
  .product-location { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: var(--muted); margin-bottom: 6px; }
  .product-desc { font-size: 12px; color: var(--muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px; }
  .product-meta-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .product-meta-chip { font-size: 10px; color: var(--muted); background: var(--surface2); border: 1px solid var(--border); padding: 2px 7px; border-radius: 4px; font-family: 'Fira Code', monospace; }
  .product-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
  .product-tag { padding: 2px 6px; border-radius: 4px; background: var(--surface2); border: 1px solid var(--border); font-size: 10px; color: var(--muted); font-family: 'Fira Code', monospace; }
  .product-info-line { font-size: 11px; color: var(--dim); margin-bottom: 10px; }
  .product-actions { display: flex; gap: 5px; border-top: 1px solid var(--border); padding-top: 10px; }
  .action-btn {
    display: flex; align-items: center; gap: 4px;
    padding: 5px 9px; border-radius: 7px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 11px; font-weight: 500;
    cursor: pointer; transition: all 0.18s; font-family: 'Outfit', sans-serif;
  }
  .action-btn:hover { color: var(--text); border-color: var(--border-h); background: rgba(124,58,237,0.08); }
  .action-btn.edit:hover { color: #60a5fa; border-color: rgba(96,165,250,0.35); }
  .action-btn.delete:hover { color: var(--red); border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.05); }
  .action-btn.share:hover { color: #34d399; border-color: rgba(52,211,153,0.3); }
  .action-btn.visibility:hover { color: var(--purple-p); border-color: rgba(192,132,252,0.35); }

  /* List view */
  .product-card-list {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 14px 18px; display: flex; align-items: center; gap: 14px;
    transition: all 0.2s; animation: cardIn 0.35s ease both;
  }
  .product-card-list:hover { border-color: var(--border-h); }
  .list-thumb {
    width: 48px; height: 48px; border-radius: 9px; background: var(--surface2);
    border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 18px;
  }
  .list-info { flex: 1; min-width: 0; }
  .list-name { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .list-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .list-actions { display: flex; gap: 5px; flex-shrink: 0; }

  /* Empty state */
  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 20px; text-align: center; gap: 14px;
    background: var(--surface); border: 1px dashed var(--border); border-radius: 18px;
  }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: fadeIn 0.2s ease; overflow-y: auto;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--surface); border: 1px solid rgba(168,85,247,0.2);
    border-radius: 22px; width: 100%; max-width: 660px;
    height: 88vh; max-height: 88vh;
    display: flex; flex-direction: column;
    box-shadow: 0 30px 80px rgba(0,0,0,0.7);
    animation: modalIn 0.3s cubic-bezier(0.16,1,0.3,1); flex-shrink: 0;
  }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .modal-header {
    padding: 20px 24px 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; }
  .modal-subtitle { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .modal-close {
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s;
  }
  .modal-close:hover { color: var(--text); border-color: var(--border-h); }
  .modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; min-height: 0; }
  .modal-footer {
    padding: 16px 24px; border-top: 1px solid var(--border);
    display: flex; gap: 10px; justify-content: flex-end; flex-shrink: 0;
  }

  /* ── FORM ── */
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  .form-field { margin-bottom: 16px; }
  .form-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 500; color: var(--muted);
    margin-bottom: 6px; letter-spacing: 0.3px;
  }
  .required-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--red); }
  .optional-tag { font-size: 10px; color: var(--dim); font-family: 'Fira Code', monospace; margin-left: 3px; }
  .char-count { margin-left: auto; font-size: 10px; color: var(--dim); font-family: 'Fira Code', monospace; }
  .char-count.warn { color: var(--yellow); } .char-count.over { color: var(--red); }
  .form-input {
    width: 100%; padding: 10px 12px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text);
    font-family: 'Outfit', sans-serif; font-size: 13px; outline: none;
    transition: all 0.2s;
  }
  .form-input:focus { border-color: rgba(168,85,247,0.5); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .form-input.error { border-color: rgba(248,113,113,0.5); }
  .form-input::placeholder { color: var(--dim); }
  textarea.form-input { resize: vertical; min-height: 80px; line-height: 1.6; }
  .form-error { font-size: 11px; color: var(--red); margin-top: 4px; }
  .form-select {
    width: 100%; padding: 10px 12px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text);
    font-family: 'Outfit', sans-serif; font-size: 13px; outline: none;
    cursor: pointer; transition: all 0.2s;
  }
  .form-select:focus { border-color: rgba(168,85,247,0.5); }
  .form-select option { background: #18182a; }

  /* Upload */
  .upload-zone {
    border: 1.5px dashed rgba(168,85,247,0.3); border-radius: 12px; padding: 24px 16px;
    text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(124,58,237,0.03);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .upload-zone:hover { border-color: var(--purple-l); background: rgba(124,58,237,0.07); }
  .upload-zone.drag { border-color: var(--purple-l); background: rgba(124,58,237,0.1); }
  .upload-text { font-size: 13px; color: var(--muted); }
  .upload-sub { font-size: 11px; color: var(--dim); }
  .upload-preview { width: 100%; height: 140px; border-radius: 9px; overflow: hidden; position: relative; }
  .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
  .upload-remove {
    position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 5px;
    background: rgba(0,0,0,0.6); border: none; color: white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.18s;
  }
  .upload-remove:hover { background: rgba(248,113,113,0.7); }
  .ref-images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .ref-image-item { aspect-ratio: 1; border-radius: 7px; overflow: hidden; position: relative; border: 1px solid var(--border); }
  .ref-image-item img { width: 100%; height: 100%; object-fit: cover; }

  /* Category grid */
  .category-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
  .cat-option {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 10px 6px; border-radius: 10px; border: 1.5px solid var(--border);
    background: var(--surface2); cursor: pointer; transition: all 0.18s; text-align: center;
  }
  .cat-option:hover { border-color: rgba(168,85,247,0.3); }
  .cat-option.selected { border-color: rgba(168,85,247,0.5); background: rgba(124,58,237,0.1); }
  .cat-emoji { font-size: 20px; }
  .cat-name { font-size: 10px; font-weight: 600; color: var(--muted); }
  .cat-option.selected .cat-name { color: var(--purple-p); }

  /* Tags */
  .tags-wrap {
    display: flex; flex-wrap: wrap; gap: 5px; padding: 7px 9px; min-height: 42px;
    background: var(--surface2); border: 1px solid var(--border); border-radius: 9px;
    align-items: center; transition: border-color 0.2s;
  }
  .tags-wrap:focus-within { border-color: rgba(168,85,247,0.5); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .tag-chip {
    display: flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: 5px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(168,85,247,0.25);
    color: var(--purple-p); font-size: 11px; font-family: 'Fira Code', monospace;
  }
  .tag-chip button { background: none; border: none; color: inherit; display: flex; align-items: center; cursor: pointer; padding: 0; opacity: 0.6; }
  .tag-chip button:hover { opacity: 1; }
  .tags-input { border: none; background: none; outline: none; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 12px; flex: 1; min-width: 80px; }
  .tags-input::placeholder { color: var(--dim); }

  /* Visibility toggle */
  .vis-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .vis-option {
    display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 9px;
    border: 1.5px solid var(--border); background: var(--surface2);
    cursor: pointer; transition: all 0.18s; font-size: 13px; font-weight: 500;
  }
  .vis-option.selected-public { border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.07); color: #34d399; }
  .vis-option.selected-private { border-color: rgba(248,113,113,0.35); background: rgba(248,113,113,0.06); color: var(--red); }

  /* Form divider */
  .form-divider {
    display: flex; align-items: center; gap: 10px; margin: 16px 0;
    color: var(--dim); font-size: 11px; font-family: 'Fira Code', monospace; letter-spacing: 1px;
  }
  .form-divider::before, .form-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* Buttons */
  .btn { padding: 9px 18px; border-radius: 9px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; border: none; display: flex; align-items: center; gap: 6px; }
  .btn-secondary { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); }
  .btn-secondary:hover { border-color: var(--border-h); color: var(--text); }
  .btn-primary { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; box-shadow: 0 4px 14px rgba(124,58,237,0.3); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.5); }
  .btn-danger { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.3); color: var(--red); }
  .btn-danger:hover { background: rgba(248,113,113,0.18); }

  /* Share modal */
  .share-link-box { display: flex; gap: 8px; align-items: center; background: var(--surface2); border: 1px solid var(--border); border-radius: 9px; padding: 10px 12px; margin: 14px 0; }
  .share-link-box input { flex: 1; background: none; border: none; outline: none; color: var(--muted); font-family: 'Fira Code', monospace; font-size: 12px; }
  .share-copy { background: none; border: none; color: var(--purple-p); cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500; font-family: 'Outfit', sans-serif; }
  .share-platforms { display: flex; gap: 8px; }
  .share-platform { flex: 1; padding: 10px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted); font-size: 12px; font-weight: 500; font-family: 'Outfit', sans-serif; cursor: pointer; transition: all 0.18s; text-align: center; }
  .share-platform:hover { border-color: var(--border-h); color: var(--text); }

  /* Delete modal */
  .delete-modal { max-width: 400px; }
  .delete-icon { font-size: 42px; text-align: center; margin-bottom: 8px; }
  .delete-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; text-align: center; margin-bottom: 6px; }
  .delete-sub { color: var(--muted); font-size: 13px; text-align: center; line-height: 1.6; }

  /* Toast */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    background: var(--surface); border: 1px solid rgba(52,211,153,0.3);
    border-radius: 11px; padding: 12px 16px;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    animation: toastIn 0.3s cubic-bezier(0.16,1,0.3,1);
    font-size: 13px; font-weight: 500; color: #34d399;
  }
  @keyframes toastIn { from { opacity: 0; transform: translateY(16px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .toast.error { border-color: rgba(248,113,113,0.3); color: var(--red); }

  /* Reviews */
  .reviews-section { margin-top: 28px; }
  .content-divider { display: flex; align-items: center; gap: 10px; margin: 24px 0 16px; color: var(--dim); font-size: 11px; font-family: 'Fira Code', monospace; letter-spacing: 1px; }
  .content-divider::before, .content-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .reviews-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .reviews-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  .reviews-count { font-size: 11px; color: var(--muted); font-family: 'Fira Code', monospace; background: var(--surface2); border: 1px solid var(--border); padding: 2px 7px; border-radius: 20px; }
  .reviews-avg { display: flex; align-items: center; gap: 5px; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 20px; color: var(--yellow); }
  .reviews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .review-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 18px; transition: all 0.2s; animation: cardIn 0.4s ease both; }
  .review-card:hover { border-color: var(--border-h); transform: translateY(-2px); }
  .review-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
  .review-author { display: flex; align-items: center; gap: 9px; }
  .review-avatar { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 12px; border: 1.5px solid rgba(168,85,247,0.25); }
  .review-info h4 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 13px; }
  .review-info small { font-size: 10px; color: var(--dim); }
  .review-stars { display: flex; gap: 2px; }
  .review-product-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; color: var(--muted); padding: 2px 7px; background: var(--surface2); border: 1px solid var(--border); border-radius: 5px; margin-bottom: 7px; font-family: 'Fira Code', monospace; }
  .review-text { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 10px; }
  .review-date { font-size: 10px; color: var(--dim); margin-bottom: 8px; }
  .review-reply-box { background: rgba(124,58,237,0.05); border: 1px solid rgba(168,85,247,0.15); border-radius: 9px; padding: 9px 11px; margin-top: 8px; }
  .review-reply-label { font-size: 10px; color: var(--purple-p); font-weight: 600; margin-bottom: 3px; font-family: 'Fira Code', monospace; }
  .review-reply-text { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .reply-input-wrap { display: flex; gap: 7px; margin-top: 8px; }
  .reply-input { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: 7px; padding: 7px 10px; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 12px; outline: none; transition: border-color 0.18s; }
  .reply-input:focus { border-color: rgba(168,85,247,0.5); }
  .reply-input::placeholder { color: var(--dim); }
  .reply-btn { padding: 7px 12px; border-radius: 7px; background: linear-gradient(135deg, #7c3aed, #a855f7); border: none; color: white; font-size: 11px; font-weight: 600; font-family: 'Outfit', sans-serif; cursor: pointer; white-space: nowrap; transition: all 0.18s; }
  .reply-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,58,237,0.4); }
  .review-actions { display: flex; gap: 5px; margin-top: 6px; }

  /* Canvas bg */
  #bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.3; }
  .dash-wrap { position: relative; z-index: 1; }

  /* Responsive */
  @media (max-width: 768px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .form-row { grid-template-columns: 1fr; }
    .form-row-3 { grid-template-columns: 1fr; }
    .category-grid { grid-template-columns: repeat(3, 1fr); }
    .topbar { padding: 0 14px; }
    .content { padding: 14px; }
    .search-wrap { width: 150px; }
    .modal { max-width: 100%; height: 95vh; border-radius: 16px; }
    .reviews-grid { grid-template-columns: 1fr; }
    .product-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
    .btn-add span { display: none; }
    .topbar-title { font-size: 15px; }
  }
`;

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────
const Toast = memo(({ message, type = "success" }: { message: string; type?: "success" | "error" }) => (
  <div className={`toast ${type === "error" ? "error" : ""}`}>
    <span>{type === "success" ? "✓" : "✕"}</span>{message}
  </div>
));

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropper = memo(({ file, aspect, onCrop, onCancel }: { file: File, aspect: number, onCrop: (file: File) => void, onCancel: () => void }) => {
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(file);
  }, [file]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  function handleSave() {
    if (completedCrop && imgRef.current) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      // Enforce fixed width (800px) while maintaining aspect ratio
      const targetWidth = 800;
      const targetHeight = targetWidth / aspect;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        targetWidth,
        targetHeight
      );

      canvas.toBlob(blob => {
        if (!blob) return;
        const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
        onCrop(croppedFile);
      }, 'image/jpeg', 0.95);
    }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Crop Image</h3>
          <button type="button" className="modal-close" onClick={onCancel} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Icon.X /></button>
        </div>
        <div style={{ maxHeight: '60vh', overflow: 'auto', display: 'flex', justifyContent: 'center', background: '#000', borderRadius: '8px' }}>
          {imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img ref={imgRef} src={imgSrc} alt="Crop me" onLoad={onImageLoad} style={{ maxWidth: '100%', maxHeight: '50vh' }} />
            </ReactCrop>
          )}
        </div>
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn-purple" onClick={handleSave} disabled={!completedCrop}>Apply Crop</button>
        </div>
      </div>
    </div>
  );
});

const FileUpload = memo(({ value, onChange, label, required }: { value: string | null; onChange: (v: string | null) => void; label: string; required?: boolean }) => {
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCropFile(file);
  }, []);

  const handleCrop = async (croppedFile: File) => {
    setCropFile(null);
    setUploading(true);
    try {
      const url = await storageService.uploadImage(croppedFile);
      if (url) onChange(url);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-field">
      <label className="form-label">{label}{required && <span className="required-dot" />}</label>
      {value ? (
        <div className="upload-preview">
          <img src={value} alt="preview" loading="lazy" />
          <button type="button" className="upload-remove" onClick={() => onChange(null)}><Icon.X /></button>
        </div>
      ) : (
        <div className={`upload-zone ${drag ? "drag" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => inputRef.current?.click()}>
          <div style={{ color: "var(--muted)" }}>{uploading ? "⏳" : <Icon.Upload />}</div>
          <span className="upload-text">{uploading ? "Uploading..." : "Click or drag to upload"}</span>
          <span className="upload-sub">PNG, JPG, WEBP — max 5MB</span>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        </div>
      )}
      {cropFile && (
        <ImageCropper
          file={cropFile}
          aspect={4 / 3}
          onCrop={handleCrop}
          onCancel={() => setCropFile(null)}
        />
      )}
    </div>
  );
});

const RefImagesUpload = memo(({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cropFiles, setCropFiles] = useState<File[]>([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [pendingUrls, setPendingUrls] = useState<string[]>([]);

  const addImages = useCallback((files: FileList) => {
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image/")) newFiles.push(files[i]);
    }
    if (newFiles.length > 0) {
      setCropFiles(newFiles);
      setCurrentCropIndex(0);
      setPendingUrls([]);
    }
  }, []);

  const handleCrop = async (croppedFile: File) => {
    setUploading(true);
    try {
      const url = await storageService.uploadImage(croppedFile);
      if (url) {
        const newPending = [...pendingUrls, url];
        setPendingUrls(newPending);
        
        if (currentCropIndex < cropFiles.length - 1) {
          setCurrentCropIndex(currentCropIndex + 1);
        } else {
          onChange([...images, ...newPending]);
          setCropFiles([]);
          setPendingUrls([]);
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
      if (currentCropIndex < cropFiles.length - 1) {
        setCurrentCropIndex(currentCropIndex + 1);
      } else {
        onChange([...images, ...pendingUrls]);
        setCropFiles([]);
        setPendingUrls([]);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCancelCrop = () => {
    if (currentCropIndex < cropFiles.length - 1) {
      setCurrentCropIndex(currentCropIndex + 1);
    } else {
      if (pendingUrls.length > 0) {
        onChange([...images, ...pendingUrls]);
      }
      setCropFiles([]);
      setPendingUrls([]);
    }
  };

  return (
    <div className="form-field">
      <label className="form-label">Reference Images<span className="optional-tag">optional</span></label>
      <div className="ref-images-grid">
        {images.map((img, i) => (
          <div key={i} className="ref-image-item">
            <img src={img} alt="" loading="lazy" />
            <button type="button" className="upload-remove" onClick={() => onChange(images.filter((_, j) => j !== i))} style={{ top: 4, right: 4 }}><Icon.X /></button>
          </div>
        ))}
        {images.length < 8 && (
          <div className="upload-zone" style={{ aspectRatio: "1", padding: 0, justifyContent: "center" }} onClick={() => inputRef.current?.click()}>
            {uploading ? "⏳" : <Icon.Image />}
            <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) addImages(e.target.files); e.target.value = ""; }} />
          </div>
        )}
      </div>
      {cropFiles.length > 0 && (
        <ImageCropper
          key={currentCropIndex}
          file={cropFiles[currentCropIndex]}
          aspect={4 / 3}
          onCrop={handleCrop}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  );
});

const TagsInput = memo(({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) => {
  const [input, setInput] = useState("");
  const add = useCallback((raw: string) => {
    const val = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (val && !tags.includes(val) && tags.length < 15) onChange([...tags, val]);
    setInput("");
  }, [tags, onChange]);
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", " "].includes(e.key)) { e.preventDefault(); add(input); }
    if (e.key === "Backspace" && !input && tags.length) onChange(tags.slice(0, -1));
  }, [input, tags, add, onChange]);
  return (
    <div className="tags-wrap">
      {tags.map((t) => (
        <span key={t} className="tag-chip">
          <Icon.Tag />{t}
          <button onClick={() => onChange(tags.filter((x) => x !== t))}><Icon.X /></button>
        </span>
      ))}
      <input className="tags-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} onBlur={() => { if (input.trim()) add(input); }} placeholder={tags.length === 0 ? "Type and press Enter..." : ""} />
    </div>
  );
});

// ─────────────────────────────────────────────
// PRODUCT FORM
// ─────────────────────────────────────────────
const ProductForm = memo(({ initial, onSubmit, onCancel, mode }: { initial: ProductFormData; onSubmit: (data: ProductFormData) => void; onCancel: () => void; mode: "add" | "edit" }) => {
  const [form, setForm] = useState<ProductFormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const set = useCallback(<K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.thumbnail) errs.thumbnail = "Thumbnail is required";
    if (!form.name.trim()) errs.name = "Product name is required";
    else if (form.name.length > 40) errs.name = "Max 40 characters";
    if (!form.price.trim()) errs.price = "Price is required";
    else if (!/^\d+(\.\d{1,2})?$/.test(form.price.trim())) errs.price = "Numbers only";
    if (!form.country.trim()) errs.country = "Country is required";
    else if (form.country.length > 50) errs.country = "Max 50 characters";
    if (!form.state.trim()) errs.state = "State is required";
    else if (form.state.length > 50) errs.state = "Max 50 characters";
    if (form.city.length > 50) errs.city = "Max 50 characters";
    if (!form.contactNumber.trim()) errs.contactNumber = "Contact number is required";
    if (!form.category) errs.category = "Please select a category";
    if (!form.brand.trim()) errs.brand = "Brand is required";
    if (!form.condition) errs.condition = "Condition is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (form.description.length > 1000) errs.description = "Max 1000 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e: React.FormEvent) => { e.preventDefault(); if (validate()) onSubmit(form); };

  return (
    <form onSubmit={submit}>
      <div className="modal-body">
        <FileUpload label="Product Thumbnail" required value={form.thumbnail} onChange={(v) => set("thumbnail", v)} />
        {errors.thumbnail && <div className="form-error">⚠ {errors.thumbnail}</div>}

        <RefImagesUpload images={form.referenceImages} onChange={(v) => set("referenceImages", v)} />

        <div className="form-divider">Product Details</div>

        <div className="form-field">
          <label className="form-label">
            Product Name <span className="required-dot" />
            <span className={`char-count ${form.name.length > 36 ? "warn" : ""}`}>{form.name.length}/40</span>
          </label>
          <input className={`form-input ${errors.name ? "error" : ""}`} value={form.name} onChange={(e) => set("name", e.target.value.slice(0, 40))} placeholder="Enter product name" maxLength={40} />
          {errors.name && <div className="form-error">⚠ {errors.name}</div>}
        </div>

        <div className="form-field">
          <label className="form-label">
            Description <span className="optional-tag">optional</span>
            <span className={`char-count ${form.description.length > 900 ? "warn" : ""}`}>{form.description.length}/1000</span>
          </label>
          <textarea className="form-input" value={form.description} onChange={(e) => set("description", e.target.value.slice(0, 1000))} placeholder="Describe your product..." rows={3} />
        </div>

        <div className="form-divider">Pricing</div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Price (USD) <span className="required-dot" /></label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontFamily: "'Fira Code',monospace", fontSize: 13, pointerEvents: "none" }}>$</span>
              <input className={`form-input ${errors.price ? "error" : ""}`} value={form.price} onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); set("price", v); }} placeholder="299" style={{ paddingLeft: 22 }} />
            </div>
            {errors.price && <div className="form-error">⚠ {errors.price}</div>}
          </div>
          <div className="form-field">
            <label className="form-label">Returns</label>
            <select className="form-select" value={form.returns} onChange={(e) => set("returns", e.target.value)}>
              {RETURNS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="form-divider">Location</div>

        <div className="form-field">
          <label className="form-label">
            Country <span className="required-dot" />
            <span className={`char-count ${form.country.length > 45 ? "warn" : ""}`}>{form.country.length}/50</span>
          </label>
          <input className={`form-input ${errors.country ? "error" : ""}`} value={form.country} onChange={(e) => set("country", e.target.value.slice(0, 50))} placeholder="e.g. United States" maxLength={50} />
          {errors.country && <div className="form-error">⚠ {errors.country}</div>}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">
              State / Province <span className="required-dot" />
              <span className={`char-count ${form.state.length > 45 ? "warn" : ""}`}>{form.state.length}/50</span>
            </label>
            <input className={`form-input ${errors.state ? "error" : ""}`} value={form.state} onChange={(e) => set("state", e.target.value.slice(0, 50))} placeholder="e.g. California" maxLength={50} />
            {errors.state && <div className="form-error">⚠ {errors.state}</div>}
          </div>
          <div className="form-field">
            <label className="form-label">
              City <span className="optional-tag">optional</span>
              <span className={`char-count ${form.city.length > 45 ? "warn" : ""}`}>{form.city.length}/50</span>
            </label>
            <input className="form-input" value={form.city} onChange={(e) => set("city", e.target.value.slice(0, 50))} placeholder="e.g. Los Angeles" maxLength={50} />
          </div>
        </div>

        <div className="form-divider">Contact & Details</div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Contact Number <span className="required-dot" /></label>
            <input className={`form-input ${errors.contactNumber ? "error" : ""}`} value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} placeholder="+1 555 0100" type="tel" />
            {errors.contactNumber && <div className="form-error">⚠ {errors.contactNumber}</div>}
          </div>
          <div className="form-field">
            <label className="form-label">Email <span className="optional-tag">optional</span></label>
            <input className={`form-input ${errors.email ? "error" : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="contact@email.com" type="email" />
            {errors.email && <div className="form-error">⚠ {errors.email}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Brand <span className="required-dot" /></label>
            <input className={`form-input ${errors.brand ? "error" : ""}`} value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Apple, Samsung..." />
            {errors.brand && <div className="form-error">⚠ {errors.brand}</div>}
          </div>
          <div className="form-field">
            <label className="form-label">Condition <span className="required-dot" /></label>
            <select className={`form-select ${errors.condition ? "error" : ""}`} value={form.condition} onChange={(e) => set("condition", e.target.value as Condition)}>
              <option value="">Select condition</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.condition && <div className="form-error">⚠ {errors.condition}</div>}
          </div>
        </div>

        <div className="form-divider">Category</div>

        <div className="form-field">
          <label className="form-label">Category <span className="required-dot" /></label>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <div key={cat} className={`cat-option ${form.category === cat ? "selected" : ""}`} onClick={() => set("category", cat)}>
                <span className="cat-emoji">{CATEGORY_ICONS[cat]}</span>
                <span className="cat-name">{cat}</span>
              </div>
            ))}
          </div>
          {errors.category && <div className="form-error" style={{ marginTop: 6 }}>⚠ {errors.category}</div>}
        </div>

        <div className="form-divider">Tags & Visibility</div>

        <div className="form-field">
          <label className="form-label">Tags <span className="optional-tag">press Enter to add</span></label>
          <TagsInput tags={form.tags} onChange={(v) => set("tags", v)} />
        </div>

        <div className="form-field">
          <label className="form-label">Visibility</label>
          <div className="vis-toggle">
            <div className={`vis-option ${form.visibility === "public" ? "selected-public" : ""}`} onClick={() => set("visibility", "public")}><Icon.Globe /> Public</div>
            <div className={`vis-option ${form.visibility === "private" ? "selected-private" : ""}`} onClick={() => set("visibility", "private")}><Icon.Lock /> Private</div>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary"><Icon.Check />{mode === "add" ? "List Product" : "Save Changes"}</button>
      </div>
    </form>
  );
});

// ─────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────
const ProductCard = memo(({ product, onEdit, onDelete, onShare, onToggleVis, delay = 0 }: { product: Product; onEdit: () => void; onDelete: () => void; onShare: () => void; onToggleVis: () => void; delay?: number }) => (
  <div className="product-card" style={{ animationDelay: `${delay * 60}ms` }}>
    <div className="product-thumb">
      {product.thumbnail ? <img src={product.thumbnail} alt={product.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div className="product-thumb-placeholder"><Icon.Image /><span>No image</span></div>}
      <div className={`visibility-badge ${product.visibility}`}>{product.visibility === "public" ? <Icon.Globe /> : <Icon.Lock />}{product.visibility}</div>
    </div>
    <div className="product-body">
      <div className="product-cat" style={{ background: CATEGORY_COLORS[product.category as Category], color: CATEGORY_TEXT[product.category as Category] }}>{CATEGORY_ICONS[product.category as Category]} {product.category}</div>
      <div className="product-name">{product.name}</div>
      <div className="product-price">${Number(product.price).toLocaleString()}</div>
      <div className="product-location">📍 {[product.city, product.state, product.country].filter(Boolean).join(", ")}</div>
      <div className="product-meta-row">
        <span className="product-meta-chip">🏷 {product.brand}</span>
        <span className="product-meta-chip">📦 {product.condition}</span>
        <span className="product-meta-chip">↩ {product.returns}</span>
      </div>
      {product.description && <div className="product-desc">{product.description}</div>}
      {(product.tags || []).length > 0 && <div className="product-tags">{(product.tags || []).slice(0, 3).map((t) => <span key={t} className="product-tag">#{t}</span>)}{(product.tags || []).length > 3 && <span className="product-tag">+{(product.tags || []).length - 3}</span>}</div>}
      <div className="product-info-line">{formatDate(new Date(product.created_at))} · {product.shares} shares</div>
      <div className="product-actions">
        <button className="action-btn edit" onClick={onEdit}><Icon.Edit /> Edit</button>
        <button className="action-btn share" onClick={onShare}><Icon.Share /> Share</button>
        <button className="action-btn visibility" onClick={onToggleVis}>{product.visibility === "public" ? <Icon.Lock /> : <Icon.Globe />}</button>
        <button className="action-btn delete" onClick={onDelete}><Icon.Trash /></button>
      </div>
    </div>
  </div>
));

const ProductCardList = memo(({ product, onEdit, onDelete, onShare, onToggleVis, delay = 0 }: { product: Product; onEdit: () => void; onDelete: () => void; onShare: () => void; onToggleVis: () => void; delay?: number }) => (
  <div className="product-card-list" style={{ animationDelay: `${delay * 40}ms` }}>
    <div className="list-thumb">{product.thumbnail ? <img src={product.thumbnail} alt={product.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 9 }} /> : CATEGORY_ICONS[product.category]}</div>
    <div className="list-info">
      <div className="list-name">{product.name}</div>
      <div className="list-meta">{CATEGORY_ICONS[product.category as Category]} {product.category} · <span style={{ color: product.visibility === "public" ? "var(--green)" : "var(--red)" }}>{product.visibility}</span> · <span style={{ color: "var(--purple-p)", fontWeight: 600 }}>${Number(product.price).toLocaleString()}</span> · {[product.city, product.state].filter(Boolean).join(", ")} · {product.brand} · {product.condition} · {formatDate(new Date(product.created_at))}</div>
    </div>
    <div className="list-actions">
      <button className="action-btn edit" onClick={onEdit}><Icon.Edit /></button>
      <button className="action-btn share" onClick={onShare}><Icon.Share /></button>
      <button className="action-btn visibility" onClick={onToggleVis}>{product.visibility === "public" ? <Icon.Lock /> : <Icon.Globe />}</button>
      <button className="action-btn delete" onClick={onDelete}><Icon.Trash /></button>
    </div>
  </div>
));

// ─────────────────────────────────────────────
// REVIEW CARD — with reply/edit reply
// ─────────────────────────────────────────────
const ReviewCard = memo(({ review, onReply, onEditReply }: { review: Review; onReply: (id: string, text: string) => void; onEditReply: (id: string, text: string) => void }) => {
  const [replyInput, setReplyInput] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [editingReply, setEditingReply] = useState(false);
  const [editReplyText, setEditReplyText] = useState(review.reply_text || "");

  const reviewerName = review.user?.name || "Unknown User";
  const initials = reviewerName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const productName = review.product?.name || "Unknown Product";
  const replied = !!review.reply_text;

  const submitReply = useCallback(() => {
    if (!replyInput.trim()) return;
    onReply(review.id, replyInput.trim());
    setReplyInput(""); setShowReplyBox(false);
  }, [replyInput, review.id, onReply]);

  const submitEditReply = useCallback(() => {
    if (!editReplyText.trim()) return;
    onEditReply(review.id, editReplyText.trim());
    setEditingReply(false);
  }, [editReplyText, review.id, onEditReply]);

  return (
    <div className="review-card">
      <div className="review-top">
        <div className="review-author">
          <div className="review-avatar" style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>{initials}</div>
          <div className="review-info">
            <h4>{reviewerName}</h4>
            <small>{formatDate(new Date(review.created_at))}</small>
          </div>
        </div>
        <div className="review-stars">{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 11 }}>{s <= review.rating ? "⭐" : "☆"}</span>)}</div>
      </div>
      <div className="review-product-tag">📦 {productName}</div>
      <div className="review-text">"{review.text}"</div>

      {replied && review.reply_text && !editingReply && (
        <div className="review-reply-box">
          <div className="review-reply-label">↩ Your reply</div>
          <div className="review-reply-text">{review.reply_text}</div>
          <div style={{ marginTop: 8 }}>
            <button className="action-btn edit" style={{ fontSize: 11 }} onClick={() => { setEditReplyText(review.reply_text || ""); setEditingReply(true); }}><Icon.Edit /> Edit reply</button>
          </div>
        </div>
      )}

      {editingReply && (
        <div className="review-reply-box">
          <div className="review-reply-label">✏ Editing reply</div>
          <div className="reply-input-wrap">
            <input className="reply-input" value={editReplyText} onChange={(e) => setEditReplyText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitEditReply()} autoFocus />
            <button className="reply-btn" onClick={submitEditReply}>Save</button>
            <button className="action-btn" onClick={() => setEditingReply(false)} style={{ padding: "5px 8px" }}>Cancel</button>
          </div>
        </div>
      )}

      {!replied && (
        <div className="review-actions">
          {showReplyBox ? (
            <div className="reply-input-wrap" style={{ width: "100%" }}>
              <input className="reply-input" value={replyInput} onChange={(e) => setReplyInput(e.target.value)} placeholder="Write a reply..." onKeyDown={(e) => e.key === "Enter" && submitReply()} autoFocus />
              <button className="reply-btn" onClick={submitReply}>Reply</button>
              <button className="action-btn" onClick={() => setShowReplyBox(false)} style={{ padding: "5px 8px" }}>Cancel</button>
            </div>
          ) : (
            <button className="action-btn edit" onClick={() => setShowReplyBox(true)}>↩ Reply</button>
          )}
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
// const USER_ID = "USR-" + Math.random().toString(36).slice(2, 8).toUpperCase();

export default function Dashboard({ onNavigate, session }: { onNavigate: (page: 'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact') => void, session: any }) {
  const user = session?.user;



  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<Category | "All">("All");
  const [visFilter, setVisFilter] = useState<"all" | "public" | "private">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [shareTarget, setShareTarget] = useState<Product | null>(null);

  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [copied, setCopied] = useState(false);

  // User Info from Session
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')?.[0] || "User";
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const userId = user?.id?.slice(0, 8)?.toUpperCase() || "UNKNOWN";
  const userRole = "Seller · Verified"; // Mock role for now

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const data = await productService.getProducts(user.id);
      setProducts(data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      showToast(error.message || "Failed to load products", "error");
    }
  };

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const filtered = useMemo(() => products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (p.name || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q) || (p.tags || []).some((t) => t.includes(q)) || (p.category || "").toLowerCase().includes(q);
    const matchCat = catFilter === "All" || p.category === catFilter;
    const matchVis = visFilter === "all" || p.visibility === visFilter;
    return matchSearch && matchCat && matchVis;
  }), [products, search, catFilter, visFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    public: products.filter((p) => p.visibility === "public").length,
    private: products.filter((p) => p.visibility === "private").length,
    totalShares: products.reduce((a, p) => a + p.shares, 0),
  }), [products]);

  const handleAdd = async (data: ProductFormData) => {
    if (!user) {
      showToast("You must be logged in to list a product.", "error");
      return;
    }
    try {
      const newProduct = {
        user_id: user.id,
        name: data.name,
        description: data.description,
        thumbnail: data.thumbnail,
        reference_images: data.referenceImages,
        contact_number: data.contactNumber,
        email: data.email,
        price: parseFloat(data.price),
        country: data.country,
        state: data.state,
        city: data.city,
        tags: data.tags,
        category: data.category,
        brand: data.brand,
        condition: data.condition,
        returns: data.returns,
        visibility: data.visibility,
        shares: 0,
        views: 0,
        shipping_price: 0
      };

      await productService.createProduct(newProduct);

      setShowAdd(false);
      showToast("Product listed successfully!");
      fetchProducts(); // Refresh list
    } catch (error: any) {
      console.error('Error adding product:', error);
      showToast(error.message || "Failed to add product", "error");
    }
  };

  const handleEdit = async (data: ProductFormData) => {
    if (!editTarget || !user) return;
    
    try {
      const updates = {
        name: data.name,
        description: data.description,
        thumbnail: data.thumbnail,
        reference_images: data.referenceImages,
        contact_number: data.contactNumber,
        email: data.email,
        price: parseFloat(data.price),
        country: data.country,
        state: data.state,
        city: data.city,
        tags: data.tags,
        category: data.category,
        brand: data.brand,
        condition: data.condition,
        returns: data.returns,
        visibility: data.visibility,
      };

      await productService.updateProduct(editTarget.id, updates);

      setEditTarget(null);
      showToast("Product updated!");
      fetchProducts(); // Refresh list
    } catch (error: any) {
      console.error('Error updating product:', error);
      showToast(error.message || "Failed to update product", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;
    
    try {
      await productService.deleteProduct(deleteTarget.id);

      setDeleteTarget(null);
      showToast("Product deleted.");
      fetchProducts(); // Refresh list
    } catch (error: any) {
      console.error('Error deleting product:', error);
      showToast(error.message || "Failed to delete product", "error");
    }
  };

  const handleToggleVis = async (id: string) => {
    if (!user) return;
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newVisibility = product.visibility === "public" ? "private" : "public";
    
    try {
      await productService.updateProduct(id, { visibility: newVisibility });

      showToast("Visibility updated!");
      fetchProducts(); // Refresh list
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      showToast(error.message || "Failed to update visibility", "error");
    }
  };

  const handleReply = useCallback(async (reviewId: string, text: string) => {
    try {
      await reviewService.replyToReview(reviewId, text);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply_text: text, replied_at: new Date().toISOString() } : r));
      showToast("Reply posted!");
    } catch (error: any) {
      console.error("Error replying:", error);
      showToast(error.message || "Failed to reply", "error");
    }
  }, [showToast]);

  const handleEditReply = useCallback(async (reviewId: string, text: string) => {
    try {
      await reviewService.replyToReview(reviewId, text);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply_text: text, replied_at: new Date().toISOString() } : r));
      showToast("Reply updated!");
    } catch (error: any) {
      console.error("Error updating reply:", error);
      showToast(error.message || "Failed to update reply", "error");
    }
  }, [showToast]);

  const copyLink = useCallback((id: string) => {
    navigator.clipboard.writeText(`https://nexus.io/product/${id}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Link copied!");
  }, [showToast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setShowAdd(false); setEditTarget(null); setDeleteTarget(null); setShareTarget(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
    const pts = Array.from({ length: 50 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.35 + 0.1, c: Math.random() > 0.5 ? "124,58,237" : "168,85,247" }));
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    let raf: number;
    const draw = () => { ctx.clearRect(0, 0, W, H); pts.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.c},${p.a})`; ctx.fill(); }); raf = requestAnimationFrame(draw); };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  const editFormInitial = useMemo<ProductFormData>(() =>
    editTarget ? { name: editTarget.name, description: editTarget.description, thumbnail: editTarget.thumbnail, referenceImages: editTarget.reference_images, contactNumber: editTarget.contact_number, email: editTarget.email, price: editTarget.price.toString(), country: editTarget.country, state: editTarget.state, city: editTarget.city, tags: editTarget.tags, category: editTarget.category, brand: editTarget.brand, condition: editTarget.condition, returns: editTarget.returns, visibility: editTarget.visibility } : EMPTY_FORM,
    [editTarget]
  );

  if (!user) {
    return <div className="w-full h-screen flex items-center justify-center bg-nexus-bg text-nexus-text">Redirecting...</div>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      <canvas id="bg-canvas" />

      <div className="dash-wrap">
        {/* ── SIDEBAR (hover to expand) ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span>Nexus</span>
          </div>

          <div className="sidebar-profile">
            <div className="profile-avatar-large">{userInitials}</div>
            <div className="profile-text">
              <div className="profile-name">{userName}</div>
              <div className="profile-role">{userRole}</div>
              <div className="profile-id">ID: {userId}</div>
              <div className="profile-stats">
                <div className="profile-stat"><div className="profile-stat-val">{products.length}</div><div className="profile-stat-label">Listed</div></div>
                <div className="profile-stat"><div className="profile-stat-val">{products.filter(p=>p.visibility==="public").length}</div><div className="profile-stat-label">Public</div></div>
                <div className="profile-stat"><div className="profile-stat-val">{products.reduce((a,p)=>a+p.shares,0)}</div><div className="profile-stat-label">Shares</div></div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">MAIN</div>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}><Icon.Home /><span>Home</span></a>
          <div className="nav-item active"><Icon.Package /><span>Dashboard</span></div>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavigate('buy'); }}><Icon.ShoppingBag /><span>Buy</span></a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavigate('favourites'); }}><Icon.Heart /><span>Favourites</span></a>
          <div className="nav-item"><Icon.Settings /><span>Settings</span></div>

          <div className="sidebar-section">LEGAL</div>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}><Icon.Shield /><span>Privacy</span></a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}><Icon.FileText /><span>Terms</span></a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}><Icon.Mail /><span>Contact</span></a>
          
          <div style={{ marginTop: 'auto', marginBottom: 10 }}>
            <button className="nav-item" onClick={() => supabase.auth.signOut()} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}>
              <Icon.LogOut /><span>Log Out</span>
            </button>
          </div>

          <div className="sidebar-bottom">
            <div className="user-pill">
              <div className="user-avatar">{userInitials}</div>
              <div className="user-info">
                <span>{userName}</span>
                <small>Seller</small>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">
          <header className="topbar">
            <div className="topbar-title">My Products</div>
            <div className="topbar-right">
              <div className="search-wrap">
                <Icon.Search />
                <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn-add" onClick={() => setShowAdd(true)}>
                <Icon.Plus /><span>List Product</span>
              </button>
            </div>
          </header>

          <div className="content">
            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card"><div className="stat-label">Total Products</div><div className="stat-value">{stats.total}</div><div className="stat-sub">All listings</div><div className="stat-icon">📦</div></div>
              <div className="stat-card"><div className="stat-label">Public</div><div className="stat-value" style={{ color: "var(--green)" }}>{stats.public}</div><div className="stat-sub">Visible to buyers</div><div className="stat-icon">🌐</div></div>
              <div className="stat-card"><div className="stat-label">Private</div><div className="stat-value" style={{ color: "var(--red)" }}>{stats.private}</div><div className="stat-sub">Hidden listings</div><div className="stat-icon">🔒</div></div>
              <div className="stat-card"><div className="stat-label">Total Shares</div><div className="stat-value" style={{ color: "var(--purple-p)" }}>{stats.totalShares}</div><div className="stat-sub">Across all products</div><div className="stat-icon">🔗</div></div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
              {(["All", ...CATEGORIES] as (Category | "All")[]).map((cat) => (
                <button key={cat} className={`filter-btn ${catFilter === cat ? "active" : ""}`} onClick={() => setCatFilter(cat)}>
                  {cat !== "All" && CATEGORY_ICONS[cat as Category]} {cat}
                </button>
              ))}
              <button className={`filter-btn ${visFilter === "public" ? "active" : ""}`} onClick={() => setVisFilter((v) => v === "public" ? "all" : "public")}><Icon.Globe /> Public</button>
              <button className={`filter-btn ${visFilter === "private" ? "active" : ""}`} onClick={() => setVisFilter((v) => v === "private" ? "all" : "private")}><Icon.Lock /> Private</button>
              <div className="view-toggle">
                <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}><Icon.LayoutGrid /></button>
                <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}><Icon.List /></button>
              </div>
            </div>

            {/* Products */}
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 42, opacity: 0.4 }}>📦</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>{search ? `No results for "${search}"` : "No products yet"}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>{search ? "Try a different search term." : "Click \"List Product\" to start."}</div>
                {!search && <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon.Plus /> List Product</button>}
              </div>
            ) : viewMode === "grid" ? (
              <div className="product-grid">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} delay={i} onEdit={() => setEditTarget(p)} onDelete={() => setDeleteTarget(p)} onShare={() => setShareTarget(p)} onToggleVis={() => handleToggleVis(p.id)} />)}
              </div>
            ) : (
              <div className="product-list">
                {filtered.map((p, i) => <ProductCardList key={p.id} product={p} delay={i} onEdit={() => setEditTarget(p)} onDelete={() => setDeleteTarget(p)} onShare={() => setShareTarget(p)} onToggleVis={() => handleToggleVis(p.id)} />)}
              </div>
            )}

            {/* Reviews */}
            <div className="reviews-section">
              <div className="content-divider">REVIEWS FROM BUYERS</div>
              <div className="reviews-header">
                <div className="reviews-title">Customer Reviews <span className="reviews-count">{reviews.length} total</span></div>
                <div className="reviews-avg">⭐ {(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)} <small style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Outfit',sans-serif", fontWeight: 400 }}>/ 5.0</small></div>
              </div>
              <div className="reviews-grid">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} onReply={handleReply} onEditReply={handleEditReply} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADD MODAL ── */}
      {showAdd && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-header">
              <div><div className="modal-title">List a Product</div><div className="modal-subtitle">Fill in details to publish your listing</div></div>
              <button className="modal-close" onClick={() => setShowAdd(false)}><Icon.X /></button>
            </div>
            <ProductForm mode="add" initial={EMPTY_FORM} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditTarget(null)}>
          <div className="modal">
            <div className="modal-header">
              <div><div className="modal-title">Edit Product</div><div className="modal-subtitle">Update your listing</div></div>
              <button className="modal-close" onClick={() => setEditTarget(null)}><Icon.X /></button>
            </div>
            <ProductForm mode="edit" initial={editFormInitial} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="modal delete-modal" style={{ maxWidth: 400, height: "auto" }}>
            <div className="modal-header">
              <div><div className="modal-title">Delete Product</div><div className="modal-subtitle">This cannot be undone</div></div>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}><Icon.X /></button>
            </div>
            <div className="modal-body">
              <div className="delete-icon">🗑️</div>
              <div className="delete-title">Are you sure?</div>
              <div className="delete-sub">You're about to permanently delete <strong style={{ color: "var(--text)" }}>"{deleteTarget.name}"</strong>.</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}><Icon.Trash /> Delete permanently</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SHARE MODAL ── */}
      {shareTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShareTarget(null)}>
          <div className="modal" style={{ maxWidth: 440, height: "auto" }}>
            <div className="modal-header">
              <div><div className="modal-title">Share Product</div><div className="modal-subtitle">{shareTarget.name}</div></div>
              <button className="modal-close" onClick={() => setShareTarget(null)}><Icon.X /></button>
            </div>
            <div className="modal-body">
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Product link</div>
              <div className="share-link-box">
                <input readOnly value={`https://nexus.io/product/${shareTarget.id}`} />
                <button className="share-copy" onClick={() => copyLink(shareTarget.id)}><Icon.Copy />{copied ? "Copied!" : "Copy"}</button>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Share via</div>
              <div className="share-platforms">
                <button className="share-platform" onClick={() => { copyLink(shareTarget.id); showToast("Opening WhatsApp..."); }}>📱 WhatsApp</button>
                <button className="share-platform" onClick={() => { copyLink(shareTarget.id); showToast("Opening Twitter..."); }}>🐦 Twitter</button>
                <button className="share-platform" onClick={() => { copyLink(shareTarget.id); showToast("Opening Email..."); }}>📧 Email</button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShareTarget(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </>
  );
}