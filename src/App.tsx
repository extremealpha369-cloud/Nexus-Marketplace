import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
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
    // A single, reliable auth state listener.
    // This handles initial load, sign-in, sign-out, and token refreshes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Change:", event, session?.user?.email);

      // Always clear OAuth hash on auth state change to clean up URL
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
          // No session or session is invalid/signed out
          setSession(null);
          if (event === 'SIGNED_OUT') {
            setView('home'); // Or 'login' if you want to always force login page
          } else if (event === 'INITIAL_SESSION') {
            // On initial load, if no session, go to home
            setView('home');
          }
        }
      } catch (err) {
        console.error("Error in onAuthStateChange:", err);
      } finally {
        setLoading(false); // Set loading to false after initial session check
      }
    });

    return () => {
      subscription.unsubscribe();
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

  return (
    <div className="min-h-screen bg-nexus-bg text-nexus-text selection:bg-nexus-purple/30">
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
        <Home onNavigate={(page) => setView(page as any)} />
      )}
    </div>
  );
}
