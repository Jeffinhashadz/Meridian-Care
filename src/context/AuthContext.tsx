/**
 * Client-side role simulation for the static Meridian Care demo.
 * Persists the selected demo user in sessionStorage so refreshes keep the persona.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEMO_USERS, LINKED_PATIENT_ID } from '../data/dummy';
import type { Role, User } from '../types';
import { logger } from '../utils/logger';

interface AuthContextValue {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  /** Patient id scoped to the logged-in patient role, else null. */
  linkedPatientId: string | null;
  canAccess: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'meridian_demo_user';

function readStoredUser(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const id = JSON.parse(raw) as string;
    return DEMO_USERS.find((u) => u.id === id) ?? null;
  } catch {
    logger.warn('Failed to restore demo session from storage');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const login = useCallback((userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (!found) {
      logger.error('Login attempted with unknown demo user', { userId });
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found.id));
    setUser(found);
    logger.info('Demo user signed in', { role: found.role, name: found.name });
  }, []);

  const logout = useCallback(() => {
    logger.info('Demo user signed out', { name: user?.name });
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, [user?.name]);

  const canAccess = useCallback(
    (roles: Role[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
      linkedPatientId: user?.role === 'patient' ? LINKED_PATIENT_ID : null,
      canAccess,
    }),
    [user, login, logout, canAccess],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
