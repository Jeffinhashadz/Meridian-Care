import { Check, Minus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { DEMO_USERS, ROLE_LABELS } from '@/data/users';
import { MODULE_LABELS, NAV_ITEMS } from '@/data/permissions';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { usePageReady } from '@/hooks/usePageReady';
import type { ModuleKey, Role } from '@/types';

const ROLES: Role[] = ['admin', 'doctor', 'patient', 'nutritionist', 'yoga_instructor'];
const MODULES = Object.keys(MODULE_LABELS) as ModuleKey[];

export function AccessPage() {
  const ready = usePageReady();
  const { effectivePermissions, togglePermission } = useData();
  const { toast } = useToast();

  if (!ready) return <PageSkeleton />;

  return (
    <div>
      <PageHeader
        title="Secure role-based access"
        description="Toggle cells to demo permissions — changes stay in local state only."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {DEMO_USERS.map((u) => {
          const count = NAV_ITEMS.filter((n) => {
            const key = Object.entries(MODULE_LABELS).find(([, label]) => label === n.label)?.[0] as ModuleKey | undefined;
            return key ? effectivePermissions(key).includes(u.role) : n.roles.includes(u.role);
          }).length;
          return (
            <Card key={u.id}>
              <CardBody className="flex items-center gap-3">
                <Avatar initials={u.avatar} />
                <div>
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-xs text-muted">{ROLE_LABELS[u.role]}</div>
                  <div className="mt-1 text-xs text-primary-signal">{count} modules</div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardBody>
          <h3 className="mb-4 font-display text-xl">Permission matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="label-caps text-muted">
                  <th className="pb-3 text-left">Module</th>
                  {ROLES.map((r) => (
                    <th key={r} className="pb-3 text-center">{ROLE_LABELS[r].split(' ')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((mod) => (
                  <tr key={mod} className="border-t border-line">
                    <td className="py-3 font-medium">{MODULE_LABELS[mod]}</td>
                    {ROLES.map((role) => {
                      const allowed = effectivePermissions(mod).includes(role);
                      return (
                        <td key={role} className="py-3 text-center">
                          <button
                            type="button"
                            aria-label={`Toggle ${ROLE_LABELS[role]} on ${MODULE_LABELS[mod]}`}
                            className="inline-grid h-11 w-11 place-items-center rounded-btn border border-line hover:bg-ground"
                            onClick={() => {
                              togglePermission(mod, role);
                              toast('Demo only, not saved');
                            }}
                          >
                            {allowed ? <Check size={16} className="text-[#0A6847]" /> : <Minus size={16} className="text-muted" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
