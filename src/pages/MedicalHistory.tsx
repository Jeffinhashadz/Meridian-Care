/**
 * Longitudinal medical history timeline with type filters.
 */
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { MEDICAL_HISTORY, PATIENTS } from '../data/dummy';
import { formatDate, patientName } from '../utils/helpers';

const TYPES = ['All', 'Diagnosis', 'Procedure', 'Allergy', 'Immunization', 'Chronic'] as const;

export function MedicalHistory() {
  const { user, linkedPatientId } = useAuth();
  const isPatient = user?.role === 'patient';
  const [type, setType] = useState<(typeof TYPES)[number]>('All');
  const [patientId, setPatientId] = useState(isPatient ? linkedPatientId ?? 'p-001' : 'all');

  const entries = useMemo(() => {
    return MEDICAL_HISTORY.filter((e) => {
      const matchPatient =
        isPatient
          ? e.patientId === linkedPatientId
          : patientId === 'all' || e.patientId === patientId;
      const matchType = type === 'All' || e.type === type;
      return matchPatient && matchType;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [type, patientId, isPatient, linkedPatientId]);

  return (
    <div>
      <PageHeader
        title="Medical history management"
        description="Chronological diagnoses, procedures, allergies, and immunizations."
      />

      <div className="toolbar">
        {!isPatient ? (
          <div className="field" style={{ minWidth: 200 }}>
            <label htmlFor="hist-patient">Patient</label>
            <select
              id="hist-patient"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="all">All patients</option>
              {PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="chip-group">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${type === t ? 'active' : ''}`}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="panel panel-pad">
        {entries.length === 0 ? (
          <div className="empty">No history entries for this filter.</div>
        ) : (
          <div className="timeline">
            {entries.map((e) => (
              <div key={e.id} className="timeline-item">
                <div className="when">
                  {formatDate(e.date)} · {patientName(e.patientId)} · {e.clinician}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h4>{e.title}</h4>
                  <span className="badge badge-aqua">{e.type}</span>
                  {e.severity ? <Badge status={e.severity} /> : null}
                </div>
                <p>{e.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
