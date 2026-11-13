/**
 * Sticky workspace header with search affordance and mobile menu trigger.
 */
import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../data/dummy';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenu: () => void;
}

export function TopBar({ title, subtitle, onMenu }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="menu-btn" onClick={onMenu} aria-label="Open menu">
          <Menu size={18} />
        </button>
        <div>
          <h1>{title}</h1>
          <div className="subtitle">
            {subtitle ?? (user ? `Signed in as ${ROLE_LABELS[user.role]}` : '')}
          </div>
        </div>
      </div>
      <div className="topbar-actions">
        <label className="search">
          <Search size={16} color="#6b858e" />
          <input type="search" placeholder="Search records…" aria-label="Search" />
        </label>
        <button type="button" className="btn btn-ghost btn-sm" aria-label="Notifications">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
