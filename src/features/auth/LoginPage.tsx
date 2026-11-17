import { Navigate } from 'react-router-dom';
import { DEMO_USERS, ROLE_LABELS } from '@/data/users';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardBody } from '@/components/ui/Card';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary-night p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" aria-hidden>
          <path d="M0 420 C 180 280, 320 560, 520 360 S 860 200, 1100 340" fill="none" stroke="#5EEAD4" strokeWidth="1.5" />
          <path d="M0 480 C 220 340, 360 600, 560 420 S 900 280, 1100 400" fill="none" stroke="#14877F" strokeWidth="1" />
        </svg>
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-mint font-display font-bold text-primary-night">M</div>
            <div>
              <div className="font-display text-xl">Meridian</div>
              <div className="text-xs text-white/55">Centralized Healthcare</div>
            </div>
          </div>
          <h1 className="mt-16 max-w-[12ch] font-display text-5xl leading-tight">One patient story. Every specialty.</h1>
          <p className="mt-4 max-w-md text-white/70">
            Choose a demo persona to explore role-scoped modules with curated clinical data.
          </p>
        </div>
        <div className="relative grid grid-cols-3 gap-6">
          {[
            ['6', 'Care modules'],
            ['5', 'Role personas'],
            ['100%', 'Static demo'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="font-display text-2xl">{v}</div>
              <div className="text-xs text-white/55">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid place-items-center bg-ground p-6">
        <Card className="w-full max-w-md">
          <CardBody>
            <h2 className="font-display text-[28px]">Enter the workspace</h2>
            <p className="mt-1 text-sm text-muted">No password — select a persona to continue.</p>
            <div className="mt-6 space-y-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => login(u.id)}
                  className="flex w-full min-h-14 items-center gap-3 rounded-card border border-line bg-white px-3 text-left transition hover:-translate-y-0.5 hover:border-primary-signal/40 hover:shadow-soft"
                >
                  <Avatar initials={u.avatar} />
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-muted">
                      {ROLE_LABELS[u.role]}
                      {u.specialty ? ` · ${u.specialty}` : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
