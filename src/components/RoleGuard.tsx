/**
 * Blocks routes the current demo role is not allowed to open.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { logger } from '../utils/logger';
import type { ReactNode } from 'react';

export function RoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { canAccess, user } = useAuth();
  if (!canAccess(roles)) {
    logger.warn('Role blocked from route', { role: user?.role, allowed: roles });
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
