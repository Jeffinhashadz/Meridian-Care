import { Link } from 'react-router-dom';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, CalendarDays } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { usePageReady } from '@/hooks/usePageReady';
import { ROLE_LABELS } from '@/data/users';
import { formatDate } from '@/lib/utils';

export function DashboardPage() {
  const ready = usePageReady();
  const { user, linkedPatientId } = useAuth();
  const { patients, reports, consultations, nutritionPlans, yogaSessions, wellnessTrend, patientName } =
    useData();
  const isPatient = user?.role === 'patient';
  const isNutrition = user?.role === 'nutritionist';
  const isYoga = user?.role === 'yoga_instructor';

  if (!ready) return <PageSkeleton />;

  const scopedPatients = isPatient ? patients.filter((p) => p.id === linkedPatientId) : patients;
  const scopedReports = reports.filter((r) => !isPatient || r.patientId === linkedPatientId);
  const upcoming = consultations
    .filter((c) => c.status === 'Scheduled' && (!isPatient || c.patientId === linkedPatientId))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const recentReports = scopedReports.slice(0, 4);

  const activePatients = scopedPatients.filter((p) => p.status === 'Active').length;
  const openReports = scopedReports.filter((r) => r.status !== 'Reviewed').length;
  const activePlans = nutritionPlans.filter(
    (n) => n.status === 'Active' && (!isPatient || n.patientId === linkedPatientId),
  );
  const yogaScoped = yogaSessions.filter((y) => !isPatient || y.patientId === linkedPatientId);

  const attention = [
    patients.find((p) => p.status === 'Critical'),
    reports.find((r) => r.status === 'Pending'),
    patients.find((p) => p.status === 'Inactive'),
  ].filter(Boolean);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0]}`}
        description={`Viewing Meridian as ${ROLE_LABELS[user?.role ?? 'admin']}. Data is static for this demo.`}
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isNutrition ? (
          <>
            <StatCard label="Active plans" value={activePlans.length} delta="Coach portfolio" spark={[3, 3, 4, 4, 4, 4]} />
            <StatCard
              label="Avg adherence"
              value={Math.round(activePlans.reduce((s, p) => s + p.adherence, 0) / Math.max(1, activePlans.length))}
              delta="Across caseload"
              spark={activePlans[0]?.weeklyAdherence}
            />
            <StatCard label="Patients coached" value={new Set(activePlans.map((p) => p.patientId)).size} spark={[2, 3, 3, 4, 4, 4]} />
            <StatCard label="Top adherence" value={`${Math.max(...activePlans.map((p) => p.adherence), 0)}%`} spark={[70, 78, 82, 86, 90, 91]} />
          </>
        ) : isYoga ? (
          <>
            <StatCard label="Sessions logged" value={yogaScoped.length} spark={[2, 3, 3, 4, 5, 6]} />
            <StatCard label="Minutes" value={yogaScoped.reduce((s, y) => s + y.durationMin, 0)} spark={[40, 70, 90, 120, 150, 180]} />
            <StatCard
              label="Avg mood lift"
              value={Number(
                (
                  yogaScoped.reduce((s, y) => s + (y.moodAfter - y.moodBefore), 0) /
                  Math.max(1, yogaScoped.length)
                ).toFixed(1),
              )}
              spark={[2, 2.5, 3, 3.2, 3.5, 3.8]}
            />
            <StatCard label="Active patients" value={new Set(yogaScoped.map((y) => y.patientId)).size} spark={[2, 2, 3, 3, 4, 4]} />
          </>
        ) : (
          <>
            <StatCard label="Active patients" value={activePatients} delta="+3 this month" spark={[3, 3, 4, 4, 5, 5]} />
            <StatCard label="Open reports" value={openReports} delta="Awaiting review" spark={[5, 4, 4, 3, 3, openReports]} />
            <StatCard label="Nutrition plans" value={activePlans.length} delta="Active protocols" spark={[2, 3, 3, 4, 4, 4]} />
            <StatCard label="Yoga sessions" value={yogaScoped.length} delta="Logged this cycle" spark={[2, 3, 4, 4, 5, 6]} />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardBody>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl">Wellness trajectory</h2>
              <span className="rounded-full bg-ground px-2.5 py-1 text-xs font-semibold text-primary">6-week trend</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={wellnessTrend}>
                  <CartesianGrid stroke="#E1EAE8" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: '#546B6C', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#546B6C', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E1EAE8' }} />
                  <Area type="monotone" dataKey="mindfulness" name="Mindfulness" stroke="#0F5C5C" fill="#14877F" fillOpacity={0.12} strokeWidth={2.5} />
                  <Line type="monotone" dataKey="flexibility" name="Flexibility" stroke="#14877F" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl">Upcoming consultations</h2>
              <Link to="/consultations" className="text-xs font-semibold text-primary-signal">View all</Link>
            </div>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted">No scheduled visits.</p>
              ) : (
                upcoming.map((c) => (
                  <div key={c.id} className="flex gap-3 rounded-[12px] border border-line bg-ground/60 p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary">
                      <CalendarDays size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{patientName(c.patientId)}</div>
                      <div className="text-xs text-muted">
                        {c.doctor} · {formatDate(c.date)} · {c.time}
                      </div>
                    </div>
                    <StatusBadge status={c.type} />
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardBody>
            <h2 className="mb-3 font-display text-xl">Recent medical reports</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="label-caps text-left text-muted">
                    <th className="pb-2 pr-3 font-semibold">Report</th>
                    <th className="pb-2 pr-3 font-semibold">Patient</th>
                    <th className="pb-2 pr-3 font-semibold">Category</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((r) => (
                    <tr key={r.id} className="border-t border-line">
                      <td className="py-3 pr-3 font-medium">{r.title}</td>
                      <td className="py-3 pr-3 text-muted">{patientName(r.patientId)}</td>
                      <td className="py-3 pr-3"><StatusBadge status={r.category} /></td>
                      <td className="py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-risk" />
              <h2 className="font-display text-xl">Needs attention</h2>
            </div>
            <ul className="space-y-3">
              {attention.map((item) => {
                if (!item) return null;
                if ('status' in item && 'bloodType' in item) {
                  return (
                    <li key={item.id} className="rounded-[12px] border border-line p-3 text-sm">
                      <div className="font-semibold">{item.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-muted">
                        Patient flag <StatusBadge status={item.status} />
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={item.id} className="rounded-[12px] border border-line p-3 text-sm">
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-muted">
                      {patientName(item.patientId)} <StatusBadge status={item.status} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
