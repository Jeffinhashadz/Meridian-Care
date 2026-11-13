/**
 * Demo gate — pick a healthcare role persona; no real credentials required.
 */
import { Navigate } from 'react-router-dom';
import { DEMO_USERS, ROLE_LABELS } from '../data/dummy';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { logger } from '../utils/logger';

export function Login() {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-page">
      <section className="login-hero" aria-label="Brand">
        <div>
          <div className="brand" style={{ border: 0, padding: 0, marginBottom: '2rem' }}>
            <div className="brand-mark">M</div>
            <div className="brand-text">
              <strong>Meridian</strong>
              <span>Centralized Healthcare</span>
            </div>
          </div>
          <div className="eyebrow">Care, unified</div>
          <h1>One patient story. Every specialty.</h1>
          <p>
            Profiles, history, reports, consults, nutrition, and wellness — orchestrated in a
            single clinical workspace built for modern care teams.
          </p>
          <div className="hero-metrics">
            <div>
              <strong>6</strong>
              <span>Care modules</span>
            </div>
            <div>
              <strong>5</strong>
              <span>Role personas</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Static demo</span>
            </div>
          </div>
        </div>
        <p style={{ opacity: 0.65, fontSize: '0.85rem' }}>
          Designed for clinicians, patients, and wellness partners.
        </p>
      </section>

      <section className="login-panel">
        <div className="login-card panel panel-pad">
          <h2>Enter the workspace</h2>
          <p className="lead">
            Choose a role to explore Meridian with curated dummy data. No password needed for this
            demo.
          </p>
          <div className="role-grid">
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                className="role-card"
                onClick={() => {
                  logger.info('Role card selected on login', { role: u.role });
                  login(u.id);
                }}
              >
                <Avatar initials={u.avatar} />
                <div className="info">
                  <strong>{u.name}</strong>
                  <span>
                    {ROLE_LABELS[u.role]}
                    {u.specialty ? ` · ${u.specialty}` : ''}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="login-note">
            Tip: sign in as Administrator to unlock Access Control, or as Patient to see the
            member-facing profile view.
          </p>
        </div>
      </section>
    </div>
  );
}
