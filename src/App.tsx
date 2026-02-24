import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BuyPage from './pages/Buy';
import FavouritesPage from './pages/favourites';
import PrivacyPolicy from './pages/Privacypolicy';
import TermsOfService from './pages/Termsofservice';
import CookiesPolicy from './pages/Cookiespolicy';
import AboutPage from './pages/Aboutpage';
import ContactPage from './pages/Contactpage';
import UpdatePassword from './pages/UpdatePassword';

export default function App() {
  const [view, setView] = useState<'login' | 'signup' | 'home' | 'dashboard' | 'buy' | 'favourites' | 'privacy' | 'terms' | 'cookies' | 'about' | 'contact' | 'update-password'>('home');
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout to prevent permanent loading screen
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setLoading(false);
      clearTimeout(timeoutId);
      return;
    }

    let subscription: any;
    try {
      const result = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth State Change:", event, session?.user?.email);
        clearTimeout(timeoutId);

        if (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        try {
          if (session) {
            setSession(session);
            if (event === 'SIGNED_IN') {
              setView('dashboard');
            } else if (event === 'PASSWORD_RECOVERY') {
              setView('update-password');
            }
          } else {
            setSession(null);
            if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
              setView('home');
            }
          }
        } catch (err) {
          console.error("Error in onAuthStateChange callback:", err);
        } finally {
          setLoading(false);
        }
      });
      subscription = result.data.subscription;
    } catch (err) {
      console.error("Failed to initialize Supabase auth:", err);
      setLoading(false);
      clearTimeout(timeoutId);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // Route protection & view management
  useEffect(() => {
    if (loading) return; // Wait until auth state is determined

    const protectedRoutes = ['dashboard', 'favourites', 'update-password'];
    const authRoutes = ['login', 'signup'];

    if (session) {
      // User is logged in.
      // If they are on a page for logged-out users, redirect to dashboard.
      if (authRoutes.includes(view)) {
        setView('dashboard');
      }
    } else {
      // User is not logged in.
      // If they are on a protected page, redirect to login.
      if (protectedRoutes.includes(view)) {
        setView('login');
      }
    }
  }, [view, session, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-nexus-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-nexus-text-muted font-dm animate-pulse">Initializing Nexus...</p>
        </div>
      </div>
    );
  }

  const isSupabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="min-h-screen bg-nexus-bg text-nexus-text selection:bg-nexus-purple/30">
      {!isSupabaseConfigured && (
        <div className="bg-red-500/10 border-b border-red-500/20 p-2 text-center text-xs text-red-400">
          Supabase is not configured. Some features may not work. Please check your environment variables.
        </div>
      )}
      {view === 'login' ? (
        <Login onSwitch={() => setView('signup')} onBack={() => setView('home')} />
      ) : view === 'signup' ? (
        <Signup onSwitch={() => setView('login')} onBack={() => setView('home')} />
      ) : view === 'dashboard' ? (
        <Dashboard onNavigate={(page) => setView(page as any)} session={session} />
      ) : view === 'buy' ? (
        <BuyPage onNavigate={(page) => setView(page as any)} />
      ) : view === 'favourites' ? (
        <FavouritesPage onNavigate={(page) => setView(page as any)} />
      ) : view === 'privacy' ? (
        <PrivacyPolicy onNavigate={(page) => setView(page as any)} />
      ) : view === 'terms' ? (
        <TermsOfService onNavigate={(page) => setView(page as any)} />
      ) : view === 'cookies' ? (
        <CookiesPolicy onNavigate={(page) => setView(page as any)} />
      ) : view === 'about' ? (
        <AboutPage onNavigate={(page) => setView(page as any)} />
      ) : view === 'contact' ? (
        <ContactPage onNavigate={(page) => setView(page as any)} />
      ) : view === 'update-password' ? (
        <UpdatePassword onNavigate={(page) => setView(page as any)} />
      ) : (
        <Home onNavigate={(page) => setView(page as any)} session={session} />
      )}
    </div>
  );
}
