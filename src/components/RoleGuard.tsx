import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import type { ModuleKey, Role } from '@/types';

export function RoleGuard({
  module,
  roles,
  children,
}: {
  module?: ModuleKey;
  roles?: Role[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  const { effectivePermissions } = useData();
  if (!user) return <Navigate to="/login" replace />;
  const allowed = module ? effectivePermissions(module) : roles ?? [];
  if (!allowed.includes(user.role)) {
    return <Navigate to="/no-access" replace />;
  }
  return children;
}
