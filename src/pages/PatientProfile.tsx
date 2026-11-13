/**
 * Deep patient card: demographics, vitals, allergies, and care links.
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { PATIENTS, LINKED_PATIENT_ID } from '../data/dummy';
import { bmi, formatDate } from '../utils/helpers';

export function PatientProfile({ forceLinked = false }: { forceLinked?: boolean }) {
  const { id } = useParams();
  const { linkedPatientId, user } = useAuth();
  const patientId = forceLinked ? linkedPatientId ?? LINKED_PATIENT_ID : id;
  const patient = PATIENTS.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <div className="panel panel-pad empty">
        Patient not found. <Link to="/patients">Back to directory</Link>
      </div>
    );
  }

  // Patients may only view their linked record in this demo.
  if (user?.role === 'patient' && patient.id !== LINKED_PATIENT_ID) {
    return (
      <div className="panel panel-pad empty">
        Access restricted to your own profile.
      </div>
    );
  }

  return (
    <div>
      {!forceLinked ? (
        <div style={{ marginBottom: '0.85rem' }}>
          <Link to="/patients" className="btn btn-ghost btn-sm">
            <ArrowLeft size={14} /> Directory
          </Link>
        </div>
      ) : (
        <PageHeader
          title="My health profile"
          description="Your centralized Meridian record shared with your care team."
        />
      )}

      <div className="profile-hero">
        <Avatar initials={patient.avatar} size="lg" />
        <div>
          <h2>{patient.name}</h2>
          <div className="muted">
            {patient.age} years · {patient.gender} · Blood {patient.bloodType}
          </div>
          <div style={{ marginTop: '0.65rem' }}>
            <Badge status={patient.status} />
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.88rem' }}>
          <div>Primary: {patient.primaryDoctor}</div>
          <div className="muted" style={{ marginTop: 4 }}>Last visit {formatDate(patient.lastVisit)}</div>
        </div>
      </div>

      <div className="split-2">
        <div className="panel panel-pad">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Contact & identity</h3>
          <div className="kv-grid">
            <div className="kv">
              <div className="k"><Mail size={12} style={{ display: 'inline', marginRight: 4 }} />Email</div>
              <div className="v">{patient.email}</div>
            </div>
            <div className="kv">
              <div className="k"><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />Phone</div>
              <div className="v">{patient.phone}</div>
            </div>
            <div className="kv">
              <div className="k"><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />Address</div>
              <div className="v">{patient.address}</div>
            </div>
            <div className="kv">
              <div className="k">Emergency contact</div>
              <div className="v">{patient.emergencyContact}</div>
            </div>
          </div>
        </div>

        <div className="panel panel-pad">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Vitals snapshot</h3>
          <div className="kv-grid">
            <div className="kv">
              <div className="k">Height</div>
              <div className="v">{patient.heightCm} cm</div>
            </div>
            <div className="kv">
              <div className="k">Weight</div>
              <div className="v">{patient.weightKg} kg</div>
            </div>
            <div className="kv">
              <div className="k">BMI</div>
              <div className="v">{bmi(patient.heightCm, patient.weightKg)}</div>
            </div>
            <div className="kv">
              <div className="k">Blood type</div>
              <div className="v">{patient.bloodType}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '1rem' }}>
        <div className="panel panel-pad">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.65rem' }}>Active conditions</h3>
          <div className="tag-list">
            {patient.conditions.map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>
        </div>
        <div className="panel panel-pad">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.65rem' }}>Allergies</h3>
          <div className="tag-list">
            {patient.allergies.map((a) => (
              <span key={a} className="tag" style={{ background: 'rgba(196,69,54,0.1)', color: 'var(--danger)' }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
