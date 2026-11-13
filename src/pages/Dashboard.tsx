/**
 * Role-aware command center summarizing every care module at a glance.
 */
import {
  Activity,
  Apple,
  CalendarDays,
  FileText,
  Flower2,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  CONSULTATIONS,
  MEDICAL_REPORTS,
  NUTRITION_PLANS,
  PATIENTS,
  ROLE_LABELS,
  WELLNESS_TREND,
  YOGA_SESSIONS,
} from '../data/dummy';
import { formatDate, patientName } from '../utils/helpers';

export function Dashboard() {
  const { user, linkedPatientId } = useAuth();
  const isPatient = user?.role === 'patient';

  const patientsInView = isPatient
    ? PATIENTS.filter((p) => p.id === linkedPatientId)
    : PATIENTS;

  const upcoming = CONSULTATIONS.filter((c) =>
    c.status === 'Scheduled' && (!isPatient || c.patientId === linkedPatientId),
  ).slice(0, 4);

  const recentReports = MEDICAL_REPORTS.filter(
    (r) => !isPatient || r.patientId === linkedPatientId,
  ).slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0]}`}
        description={`You're viewing Meridian as ${ROLE_LABELS[user?.role ?? 'admin']}. Explore modules from the sidebar — data is static for this demo.`}
      />

      <div className="grid grid-4" style={{ marginBottom: '1rem' }}>
        <StatCard
          label={isPatient ? 'Care team focus' : 'Active patients'}
          value={isPatient ? patientsInView[0]?.primaryDoctor.split(' ').slice(-1)[0] ?? '—' : patientsInView.filter((p) => p.status === 'Active').length}
          delta={isPatient ? 'Primary physician' : '+3 this month'}
          icon={<Users size={16} color="#146878" />}
        />
        <StatCard
          label="Open reports"
          value={MEDICAL_REPORTS.filter((r) => (!isPatient || r.patientId === linkedPatientId) && r.status !== 'Reviewed').length}
          delta="Awaiting review"
          icon={<FileText size={16} color="#146878" />}
        />
        <StatCard
          label="Nutrition plans"
          value={NUTRITION_PLANS.filter((n) => (!isPatient || n.patientId === linkedPatientId) && n.status === 'Active').length}
          delta="Personalized protocols"
          icon={<Apple size={16} color="#146878" />}
        />
        <StatCard
          label="Yoga sessions"
          value={YOGA_SESSIONS.filter((y) => !isPatient || y.patientId === linkedPatientId).length}
          delta="Logged this cycle"
          icon={<Flower2 size={16} color="#146878" />}
        />
      </div>

      <div className="split-2">
        <div className="panel panel-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Wellness trajectory</h3>
            <span className="badge badge-aqua">6-week trend</span>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WELLNESS_TREND}>
                <defs>
                  <linearGradient id="mind" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2ec4b6" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#2ec4b6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(15,60,72,0.08)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#6b858e', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b858e', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(15,60,72,0.1)',
                    boxShadow: '0 8px 24px rgba(8,50,60,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="mindfulness" stroke="#146878" fill="url(#mind)" strokeWidth={2.5} name="Mindfulness" />
                <Area type="monotone" dataKey="flexibility" stroke="#2ec4b6" fill="transparent" strokeWidth={2} name="Flexibility" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel panel-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1rem' }}>Upcoming consultations</h3>
            <Link to="/consultations" className="badge badge-muted">View all</Link>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {upcoming.length === 0 ? (
              <div className="empty">No scheduled visits.</div>
            ) : (
              upcoming.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    padding: '0.75rem',
                    borderRadius: 12,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: 'rgba(31,168,160,0.12)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--teal)',
                    }}
                  >
                    <CalendarDays size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: '0.92rem' }}>{patientName(c.patientId)}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                      {c.doctor} · {formatDate(c.date)} · {c.time}
                    </span>
                  </div>
                  <Badge status={c.type} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="panel panel-pad" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem' }}>Recent medical reports</h3>
          <Activity size={16} color="#146878" />
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Report</th>
                <th>Patient</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.title}</strong></td>
                  <td>{patientName(r.patientId)}</td>
                  <td><span className="badge badge-aqua">{r.category}</span></td>
                  <td>{formatDate(r.date)}</td>
                  <td><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
