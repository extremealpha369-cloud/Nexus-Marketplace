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
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Change:", event, session?.user?.email);
      setSession(session);
      setLoading(false);
      
      if (event === 'PASSWORD_RECOVERY') {
        setView('update-password');
      } else if (event === 'SIGNED_IN') {
        setView('dashboard');
      } else if (event === 'SIGNED_OUT') {
        setView('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Route protection
  useEffect(() => {
    if (loading) return;

    const protectedRoutes = ['dashboard', 'favourites', 'update-password'];
    const authRoutes = ['login', 'signup'];

    if (!session && protectedRoutes.includes(view)) {
      setView('login');
    }

    if (session && authRoutes.includes(view)) {
      setView('dashboard');
    }
  }, [view, session, loading]);

  return (
    <div className="min-h-screen bg-nexus-bg text-nexus-text selection:bg-nexus-purple/30">
      {view === 'login' ? (
        <Login onSwitch={() => setView('signup')} onBack={() => setView('home')} />
      ) : view === 'signup' ? (
        <Signup onSwitch={() => setView('login')} onBack={() => setView('home')} />
      ) : view === 'dashboard' ? (
        <Dashboard onNavigate={(page) => setView(page as any)} />
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
