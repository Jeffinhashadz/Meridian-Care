/**
 * Authenticated chrome: sidebar + top bar + routed content area.
 */
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logger } from '../../utils/logger';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Command Center', subtitle: 'Live snapshot across care modules' },
  '/patients': { title: 'Patient Profiles', subtitle: 'Centralized demographic & clinical cards' },
  '/my-profile': { title: 'My Profile', subtitle: 'Your personal health record' },
  '/history': { title: 'Medical History', subtitle: 'Longitudinal clinical timeline' },
  '/reports': { title: 'Medical Reports', subtitle: 'Labs, imaging, and diagnostic files' },
  '/consultations': { title: 'Consultations', subtitle: 'Visit notes and upcoming sessions' },
  '/nutrition': { title: 'Nutrition Plans', subtitle: 'Personalized meal protocols' },
  '/yoga': { title: 'Yoga & Wellness', subtitle: 'Progress, sessions, and mood trends' },
  '/access': { title: 'Access Control', subtitle: 'Role-based permissions matrix' },
};

export function AppShell() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    logger.http('Route view', { path: location.pathname });
    setNavOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const meta = TITLES[location.pathname] ?? { title: 'Meridian' };

  return (
    <div className="shell">
      <div
        className={`mobile-overlay ${navOpen ? 'show' : ''}`}
        onClick={() => setNavOpen(false)}
        aria-hidden={!navOpen}
      />
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      <div className="shell-main">
        <TopBar title={meta.title} subtitle={meta.subtitle} onMenu={() => setNavOpen(true)} />
        <main className="shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
