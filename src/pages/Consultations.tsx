/**
 * Consultation schedule and completed visit notes.
 */
import { useMemo, useState } from 'react';
import { Video, Building2, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { CONSULTATIONS, PATIENTS } from '../data/dummy';
import { formatDate, patientName } from '../utils/helpers';

const STATUSES = ['All', 'Scheduled', 'Completed', 'Cancelled'] as const;

export function Consultations() {
  const { user, linkedPatientId } = useAuth();
  const isPatient = user?.role === 'patient';
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('All');
  const [patientId, setPatientId] = useState(isPatient ? linkedPatientId ?? 'p-001' : 'all');

  const list = useMemo(() => {
    return CONSULTATIONS.filter((c) => {
      const matchPatient =
        isPatient
          ? c.patientId === linkedPatientId
          : patientId === 'all' || c.patientId === patientId;
      const matchStatus = status === 'All' || c.status === status;
      return matchPatient && matchStatus;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [status, patientId, isPatient, linkedPatientId]);

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === 'Telehealth') return <Video size={16} />;
    if (type === 'Follow-up') return <RefreshCw size={16} />;
    return <Building2 size={16} />;
  };

  return (
    <div>
      <PageHeader
        title="Consultation records"
        description="Upcoming and historical visits with clinician notes and modality."
      />

      <div className="toolbar">
        {!isPatient ? (
          <div className="field" style={{ minWidth: 200 }}>
            <label htmlFor="con-patient">Patient</label>
            <select id="con-patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="all">All patients</option>
              {PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="chip-group">
          {STATUSES.map((s) => (
            <button key={s} type="button" className={`chip ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid" style={{ gap: '0.85rem' }}>
        {list.map((c) => (
          <article key={c.id} className="panel panel-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(46,196,182,0.2), rgba(20,104,120,0.15))',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--teal-deep)',
                  }}
                >
                  <TypeIcon type={c.type} />
                </div>
                <div>
                  <strong style={{ fontSize: '1rem' }}>{c.reason}</strong>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 2 }}>
                    {patientName(c.patientId)} with {c.doctor} · {c.department}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span className="badge badge-aqua">{c.type}</span>
                <Badge status={c.status} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                marginTop: '0.85rem',
                fontSize: '0.85rem',
                color: 'var(--ink-soft)',
                flexWrap: 'wrap',
              }}
            >
              <span>{formatDate(c.date)} · {c.time}</span>
              <span>{c.durationMin} min</span>
            </div>
            {c.notes ? (
              <p
                style={{
                  marginTop: '0.85rem',
                  padding: '0.75rem 0.9rem',
                  background: 'var(--surface-2)',
                  borderRadius: 12,
                  border: '1px solid var(--line)',
                  fontSize: '0.9rem',
                  lineHeight: 1.45,
                }}
              >
                {c.notes}
              </p>
            ) : (
              <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
                Notes will appear after the visit is completed.
              </p>
            )}
          </article>
        ))}
      </div>

      {list.length === 0 ? <div className="panel panel-pad empty">No consultations found.</div> : null}
    </div>
  );
}
