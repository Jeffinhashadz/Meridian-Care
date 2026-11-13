/**
 * Yoga & wellness progress — sessions log plus multi-metric trends.
 */
import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { useAuth } from '../context/AuthContext';
import { PATIENTS, WELLNESS_TREND, YOGA_SESSIONS } from '../data/dummy';
import { formatDate, patientName } from '../utils/helpers';

export function Yoga() {
  const { user, linkedPatientId } = useAuth();
  const isPatient = user?.role === 'patient';
  const [patientId, setPatientId] = useState(
    isPatient ? linkedPatientId ?? 'p-001' : 'p-001',
  );

  const sessions = useMemo(() => {
    return YOGA_SESSIONS.filter((s) =>
      isPatient ? s.patientId === linkedPatientId : s.patientId === patientId,
    ).sort((a, b) => b.date.localeCompare(a.date));
  }, [patientId, isPatient, linkedPatientId]);

  const avgMoodLift =
    sessions.length === 0
      ? 0
      : sessions.reduce((sum, s) => sum + (s.moodAfter - s.moodBefore), 0) / sessions.length;

  const totalMins = sessions.reduce((sum, s) => sum + s.durationMin, 0);

  return (
    <div>
      <PageHeader
        title="Yoga & wellness progress"
        description="Session history, intensity, and mind-body trendlines for therapeutic yoga."
      />

      {!isPatient ? (
        <div className="toolbar">
          <div className="field" style={{ minWidth: 220 }}>
            <label htmlFor="yoga-patient">Patient</label>
            <select id="yoga-patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              {PATIENTS.filter((p) => YOGA_SESSIONS.some((y) => y.patientId === p.id)).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="grid grid-3" style={{ marginBottom: '1rem' }}>
        <StatCard label="Sessions logged" value={sessions.length} delta={`For ${patientName(isPatient ? linkedPatientId ?? 'p-001' : patientId)}`} />
        <StatCard label="Minutes practiced" value={totalMins} delta="Across recent cycle" />
        <StatCard label="Avg mood lift" value={`+${avgMoodLift.toFixed(1)}`} delta="Before → after session" />
      </div>

      <div className="panel panel-pad" style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.65rem' }}>Progress tracking</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WELLNESS_TREND}>
              <CartesianGrid stroke="rgba(15,60,72,0.08)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#6b858e', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b858e', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(15,60,72,0.1)',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="flexibility" stroke="#2ec4b6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="strength" stroke="#146878" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="mindfulness" stroke="#e07a5f" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel panel-pad">
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Session log</h3>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Date</th>
                <th>Style</th>
                <th>Focus</th>
                <th>Intensity</th>
                <th>Duration</th>
                <th>Mood</th>
                <th>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>{formatDate(s.date)}</td>
                  <td><strong>{s.style}</strong></td>
                  <td>{s.focus}</td>
                  <td><span className="badge badge-aqua">{s.intensity}</span></td>
                  <td>{s.durationMin} min</td>
                  <td>{s.moodBefore} → {s.moodAfter}</td>
                  <td>{s.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sessions.length === 0 ? <div className="empty">No sessions logged for this patient.</div> : null}
      </div>
    </div>
  );
}
