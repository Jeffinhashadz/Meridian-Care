import type { ReactNode } from 'react';
import {
  Activity,
  Apple,
  FileText,
  Flower2,
  History,
  LayoutDashboard,
  LogOut,
  Shield,
  Stethoscope,
  User,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/data/permissions';
import { ROLE_LABELS } from '@/data/users';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { ModuleKey } from '@/types';

const ICONS: Record<string, ReactNode> = {
  layout: <LayoutDashboard size={18} />,
  users: <Users size={18} />,
  user: <User size={18} />,
  history: <History size={18} />,
  file: <FileText size={18} />,
  stethoscope: <Stethoscope size={18} />,
  apple: <Apple size={18} />,
  lotus: <Flower2 size={18} />,
  shield: <Shield size={18} />,
};

const PATH_TO_MODULE: Record<string, ModuleKey> = {
  '/dashboard': 'dashboard',
  '/patients': 'patients',
  '/me': 'myProfile',
  '/history': 'history',
  '/reports': 'reports',
  '/consultations': 'consultations',
  '/nutrition': 'nutrition',
  '/yoga': 'yoga',
  '/access': 'access',
};

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { user, logout } = useAuth();
  const { effectivePermissions } = useData();
  if (!user) return null;

  const items = NAV_ITEMS.filter((item) => {
    const key = PATH_TO_MODULE[item.path];
    const roles = key ? effectivePermissions(key) : item.roles;
    return roles.includes(user.role);
  });

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-sidebar flex-col bg-primary-night text-[#E7F5F6] transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
      aria-label="Primary"
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-mint to-primary-signal font-display text-sm font-bold text-primary-night">
          M
        </div>
        <div>
          <div className="font-display text-lg font-semibold leading-none">Meridian</div>
          <div className="mt-1 text-[11px] text-white/55">Care Platform</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-h-11 items-center gap-3 rounded-[12px] px-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white',
                    isActive && 'bg-white/10 text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-primary-mint" />
                    ) : null}
                    {ICONS[item.icon] ?? <Activity size={18} />}
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar initials={user.avatar} size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user.name}</div>
            <div className="text-xs text-white/55">{ROLE_LABELS[user.role]}</div>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
          onClick={logout}
        >
          <LogOut size={14} /> Sign out
        </Button>
      </div>
    </aside>
  );
}
