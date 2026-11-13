/**
 * Admin-only RBAC matrix explaining which roles can reach each module.
 */
import { PageHeader } from '../components/ui/PageHeader';
import { DEMO_USERS, NAV_ITEMS, ROLE_LABELS } from '../data/dummy';
import { Avatar } from '../components/ui/Avatar';
import type { Role } from '../types';

const ROLES: Role[] = ['admin', 'doctor', 'patient', 'nutritionist', 'yoga_instructor'];

export function AccessControl() {
  return (
    <div>
      <PageHeader
        title="Secure role-based access"
        description="Meridian scopes navigation and records by professional role. This matrix mirrors the live demo gates."
      />

      <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
        {DEMO_USERS.map((u) => (
          <div key={u.id} className="panel panel-pad" style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <Avatar initials={u.avatar} />
            <div>
              <strong>{u.name}</strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                {ROLE_LABELS[u.role]}
                {u.specialty ? ` · ${u.specialty}` : ''}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>{u.email}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel panel-pad">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Module permissions</h3>
        <div className="access-matrix">
          <div className="access-row head">
            <span>Module</span>
            {ROLES.map((r) => (
              <span key={r} style={{ textAlign: 'center' }}>{ROLE_LABELS[r].split(' ')[0]}</span>
            ))}
          </div>
          {NAV_ITEMS.map((item) => (
            <div key={item.path} className="access-row">
              <strong>{item.label}</strong>
              {ROLES.map((r) => (
                <div key={r}>
                  <div className={item.roles.includes(r) ? 'dot-yes' : 'dot-no'} title={item.roles.includes(r) ? 'Allowed' : 'Denied'} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Shown only on narrow screens via CSS; matrix rows hide below 640px */}
        <div className="access-stack" style={{ marginTop: '1rem' }}>
          {NAV_ITEMS.map((item) => (
            <div key={`m-${item.path}`} className="kv">
              <div className="k">{item.label}</div>
              <div className="v" style={{ fontSize: '0.82rem' }}>
                {item.roles.map((r) => ROLE_LABELS[r]).join(' · ')}
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          Demo note: authentication is simulated in the browser via sessionStorage. There is no
          backend — switch roles from the login screen to experience each persona.
        </p>
      </div>
    </div>
  );
}
