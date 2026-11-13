/**
 * Medical report library with category filters and file metadata.
 */
import { useMemo, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { MEDICAL_REPORTS, PATIENTS } from '../data/dummy';
import { formatDate, patientName } from '../utils/helpers';
import { logger } from '../utils/logger';

const CATS = ['All', 'Lab', 'Imaging', 'Pathology', 'Cardiology', 'Other'] as const;

export function Reports() {
  const { user, linkedPatientId } = useAuth();
  const isPatient = user?.role === 'patient';
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const [patientId, setPatientId] = useState(isPatient ? linkedPatientId ?? 'p-001' : 'all');

  const reports = useMemo(() => {
    return MEDICAL_REPORTS.filter((r) => {
      const matchPatient =
        isPatient
          ? r.patientId === linkedPatientId
          : patientId === 'all' || r.patientId === patientId;
      const matchCat = cat === 'All' || r.category === cat;
      return matchPatient && matchCat;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [cat, patientId, isPatient, linkedPatientId]);

  return (
    <div>
      <PageHeader
        title="Medical report management"
        description="Browse labs, imaging, and specialty diagnostics with review status."
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => logger.info('Demo upload clicked')}>
            Upload report
          </button>
        }
      />

      <div className="toolbar">
        {!isPatient ? (
          <div className="field" style={{ minWidth: 200 }}>
            <label htmlFor="rep-patient">Patient</label>
            <select id="rep-patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="all">All patients</option>
              {PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="chip-group">
          {CATS.map((c) => (
            <button key={c} type="button" className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-2">
        {reports.map((r) => (
          <article key={r.id} className="panel panel-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(20,104,120,0.1)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--teal)',
                  }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <strong>{r.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                    {patientName(r.patientId)} · Ordered by {r.orderedBy}
                  </div>
                </div>
              </div>
              <Badge status={r.status} />
            </div>
            <p style={{ margin: '0.85rem 0', color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.45 }}>
              {r.summary}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span className="badge badge-aqua">{r.category}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{formatDate(r.date)}</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => logger.info('Demo download', { file: r.fileLabel })}
              >
                <Download size={14} /> {r.fileLabel}
              </button>
            </div>
          </article>
        ))}
      </div>

      {reports.length === 0 ? <div className="panel panel-pad empty">No reports match.</div> : null}
    </div>
  );
}
