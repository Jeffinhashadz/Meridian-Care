/**
 * Demo auth — persists selected persona in localStorage (try/catch for private mode).
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEMO_USERS, LINKED_PATIENT_ID } from '@/data/users';
import type { Role, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  linkedPatientId: string | null;
  canAccess: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'meridian_demo_user';

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const id = JSON.parse(raw) as string;
    return DEMO_USERS.find((u) => u.id === id) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const login = useCallback((userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (!found) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found.id));
    } catch {
      /* private browsing */
    }
    setUser(found);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const canAccess = useCallback(
    (roles: Role[]) => (user ? roles.includes(user.role) : false),
    [user],
  );

  const value = useMemo(
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
