import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { useEffect, useState } from 'react';
import { ROLE_LABELS } from '@/data/users';
import { NOTIFICATIONS } from '@/data/notifications';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/context/SearchContext';
import { Button } from '@/components/ui/Button';

export function TopBar({
  title,
  subtitle,
  onMenu,
}: {
  title: string;
  subtitle?: string;
  onMenu: () => void;
}) {
  const { user, logout } = useAuth();
  const { query, setQuery } = useSearch();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-4 py-3 backdrop-blur-md lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="secondary" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
          <Menu size={18} />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl text-ink lg:text-[22px]">{title}</h1>
          <p className="truncate text-xs text-muted">
            {subtitle ?? (user ? `Signed in as ${ROLE_LABELS[user.role]}` : '')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="hidden min-h-11 items-center gap-2 rounded-full border border-line bg-white px-3 sm:flex">
          <Search size={16} className="text-muted" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this page…"
            aria-label="Search this page"
            className="w-40 bg-transparent text-sm outline-none md:w-56"
          />
        </label>

        <Button
          variant="ghost"
          size="icon"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setDark((d) => !d)}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell size={16} />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content
              align="end"
              className="z-50 w-80 rounded-card border border-line bg-card p-2 shadow-soft"
            >
              <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Notifications
              </div>
              {NOTIFICATIONS.map((n) => (
                <Dropdown.Item
                  key={n.id}
                  className="cursor-default rounded-btn px-3 py-2 outline-none hover:bg-ground"
                >
                  <div className="text-sm font-semibold text-ink">{n.title}</div>
                  <div className="text-xs text-muted">{n.body}</div>
                  <div className="mt-1 text-[11px] text-muted">{n.time}</div>
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>

        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="secondary" size="sm" aria-label="User menu">
              {user?.avatar}
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content align="end" className="z-50 w-48 rounded-card border border-line bg-card p-1 shadow-soft">
              <Dropdown.Item
                className="cursor-pointer rounded-btn px-3 py-2 text-sm outline-none hover:bg-ground"
                onSelect={logout}
              >
                Sign out
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      </div>
    </header>
  );
}
