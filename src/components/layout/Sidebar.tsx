/**
 * Role-filtered primary navigation for the authenticated shell.
 */
import type { ReactNode } from 'react';
import {
  Activity,
  Apple,
  FileText,
  Flower2,
  LayoutDashboard,
  LogOut,
  Shield,
  Stethoscope,
  User,
  Users,
  History,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS, ROLE_LABELS } from '../../data/dummy';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import type { Role } from '../../types';
import { logger } from '../../utils/logger';

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

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { user, logout, canAccess } = useAuth();
  if (!user) return null;

  const items = NAV_ITEMS.filter((item) => canAccess(item.roles as Role[]));

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary">
      <div className="brand">
        <div className="brand-mark">M</div>
        <div className="brand-text">
          <strong>Meridian</strong>
          <span>Care Platform</span>
        </div>
      </div>

      <ul className="nav-list">
        {items.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                logger.debug('Navigated via sidebar', { path: item.path, role: user.role });
                onNavigate();
              }}
            >
              {ICONS[item.icon] ?? <Activity size={18} />}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-user">
        <div className="meta">
          <Avatar initials={user.avatar} size="sm" />
          <div>
            <div className="name">{user.name}</div>
            <div className="role">{ROLE_LABELS[user.role]}</div>
          </div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" style={{ width: '100%', color: '#dff' }} onClick={logout}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}
