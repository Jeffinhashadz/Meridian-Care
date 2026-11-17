import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SearchProvider, useSearch } from '@/context/SearchContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Command Center', subtitle: 'Live snapshot across care modules' },
  '/patients': { title: 'Patient Profiles', subtitle: 'Centralized demographic & clinical cards' },
  '/me': { title: 'My Profile', subtitle: 'Your personal health record' },
  '/history': { title: 'Medical History', subtitle: 'Longitudinal clinical timeline' },
  '/reports': { title: 'Medical Reports', subtitle: 'Labs, imaging, and diagnostic files' },
  '/consultations': { title: 'Consultations', subtitle: 'Visit notes and upcoming sessions' },
  '/nutrition': { title: 'Nutrition Plans', subtitle: 'Personalized meal protocols' },
  '/yoga': { title: 'Yoga & Wellness', subtitle: 'Progress, sessions, and mood trends' },
  '/access': { title: 'Access Control', subtitle: 'Role-based permissions matrix' },
};

function ShellInner() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { setQuery } = useSearch();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
    setQuery('');
  }, [location.pathname, setQuery]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const meta =
    TITLES[location.pathname] ??
    (location.pathname.startsWith('/patients/')
      ? { title: 'Patient record', subtitle: 'Unified clinical view' }
      : { title: 'Meridian' });

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div
        className={`fixed inset-0 z-30 bg-ink/40 transition lg:hidden ${navOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setNavOpen(false)}
        aria-hidden={!navOpen}
      />
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      <div className="lg:pl-sidebar">
        <TopBar title={meta.title} subtitle={meta.subtitle} onMenu={() => setNavOpen(true)} />
        <main id="main" className="animate-fade-up px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppShell() {
  return (
    <SearchProvider>
      <ShellInner />
    </SearchProvider>
  );
}
