import { Link, useParams } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowLeft, TriangleAlert } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { LINKED_PATIENT_ID } from '@/data/users';
import { bmi, formatDate } from '@/lib/utils';

export function PatientDetailPage({ forceLinked = false }: { forceLinked?: boolean }) {
  const { id } = useParams();
  const { user, linkedPatientId } = useAuth();
  const { patients, history, reports, consultations, nutritionPlans, yogaSessions, wellnessTrend } =
    useData();
  const patientId = forceLinked ? linkedPatientId ?? LINKED_PATIENT_ID : id;
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <Card>
        <CardBody className="text-center">
          Patient not found. <Link to="/patients" className="text-primary-signal">Back</Link>
        </CardBody>
      </Card>
    );
  }

  if (user?.role === 'patient' && patient.id !== LINKED_PATIENT_ID) {
    return <Card><CardBody className="text-center">Access restricted to your own profile.</CardBody></Card>;
  }

  const ph = history.filter((h) => h.patientId === patient.id);
  const pr = reports.filter((r) => r.patientId === patient.id);
  const pc = consultations.filter((c) => c.patientId === patient.id);
  const pn = nutritionPlans.find((n) => n.patientId === patient.id);
  const py = yogaSessions.filter((y) => y.patientId === patient.id);

  return (
    <div>
      {!forceLinked ? (
        <Button asChild variant="secondary" size="sm" className="mb-4">
          <Link to="/patients"><ArrowLeft size={14} /> Directory</Link>
        </Button>
      ) : (
        <PageHeader title="My health profile" description="Your centralized Meridian record." />
      )}

      <div className="relative mb-4 overflow-hidden rounded-card bg-primary-night p-6 text-white">
        <div className="relative z-10 flex flex-wrap items-center gap-5">
          <Avatar initials={patient.avatar} size="lg" />
          <div className="flex-1">
            <h2 className="font-display text-3xl">{patient.name}</h2>
            <p className="text-white/70">
              {patient.age} years · {patient.gender} · Blood {patient.bloodType}
            </p>
            <div className="mt-2"><StatusBadge status={patient.status} /></div>
          </div>
          <div className="text-sm text-white/80">
            <div>Primary: {patient.primaryDoctor}</div>
            <div className="text-white/55">Last visit {formatDate(patient.lastVisit)}</div>
          </div>
        </div>
      </div>

      <Tabs.Root defaultValue="overview">
        <Tabs.List className="mb-4 flex flex-wrap gap-1 rounded-card border border-line bg-card p-1">
          {['overview', 'history', 'reports', 'consultations', 'nutrition', 'wellness'].map((t) => (
            <Tabs.Trigger
              key={t}
              value={t}
              className="min-h-11 rounded-[10px] px-3 text-sm font-semibold capitalize text-muted data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {t}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="overview" className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Height', `${patient.heightCm} cm`],
              ['Weight', `${patient.weightKg} kg`],
              ['BMI', bmi(patient.heightCm, patient.weightKg)],
              ['Blood', patient.bloodType],
            ].map(([k, v]) => (
              <Card key={k}><CardBody><div className="label-caps text-muted">{k}</div><div className="mt-1 text-lg font-semibold">{v}</div></CardBody></Card>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardBody>
                <h3 className="font-display text-xl">Contact</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div><dt className="text-muted">Email</dt><dd className="font-medium">{patient.email}</dd></div>
                  <div><dt className="text-muted">Phone</dt><dd className="font-medium">{patient.phone}</dd></div>
                  <div><dt className="text-muted">Address</dt><dd className="font-medium">{patient.address}</dd></div>
                  <div><dt className="text-muted">Emergency</dt><dd className="font-medium">{patient.emergencyContact}</dd></div>
                </dl>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <h3 className="font-display text-xl">Clinical flags</h3>
                <div className="mt-3">
                  <div className="label-caps text-muted">Conditions</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {patient.conditions.map((c) => (
                      <span key={c} className="rounded-full bg-ground px-2.5 py-1 text-xs font-medium text-primary">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-[12px] border border-[#FBE0DA] bg-[#FBE0DA]/40 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#A12A18]">
                    <TriangleAlert size={16} /> Allergy alert
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {patient.allergies.map((a) => (
                      <StatusBadge key={a} status="Allergy" className="!bg-white" />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[#A12A18]">{patient.allergies.join(', ')}</p>
                </div>
                <div className="mt-4 text-sm text-muted">Care team · {patient.primaryDoctor}</div>
              </CardBody>
            </Card>
          </div>
        </Tabs.Content>

        <Tabs.Content value="history">
          <Card><CardBody className="space-y-4">
            {ph.map((h) => (
              <div key={h.id} className="border-b border-line pb-3 last:border-0">
                <div className="text-xs text-muted">{formatDate(h.date)} · {h.clinician}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <strong>{h.title}</strong>
                  <StatusBadge status={h.type} />
                  {h.severity ? <StatusBadge status={h.severity} /> : null}
                </div>
                <p className="mt-1 text-sm text-muted">{h.description}</p>
              </div>
            ))}
            {ph.length === 0 ? <p className="text-sm text-muted">No history on file.</p> : null}
          </CardBody></Card>
        </Tabs.Content>

        <Tabs.Content value="reports">
          <div className="grid gap-3 sm:grid-cols-2">
            {pr.map((r) => (
              <Card key={r.id}><CardBody>
                <div className="flex justify-between gap-2"><strong>{r.title}</strong><StatusBadge status={r.status} /></div>
                <p className="mt-2 text-sm text-muted">{r.summary}</p>
              </CardBody></Card>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="consultations">
          <div className="space-y-3">
            {pc.map((c) => (
              <Card key={c.id} className={c.status === 'Cancelled' ? 'opacity-60' : ''}><CardBody>
                <div className="flex flex-wrap justify-between gap-2">
                  <strong>{c.reason}</strong>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{formatDate(c.date)} · {c.doctor} · {c.type}</p>
                {c.notes ? <p className="mt-2 text-sm">{c.notes}</p> : null}
              </CardBody></Card>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="nutrition">
          {pn ? (
            <Card><CardBody>
              <h3 className="font-display text-xl">{pn.title}</h3>
              <p className="text-sm text-muted">{pn.goal}</p>
              <div className="mt-4"><div className="mb-1 flex justify-between text-sm"><span>Adherence</span><strong>{pn.adherence}%</strong></div><ProgressBar value={pn.adherence} /></div>
              <div className="mt-4 space-y-2">
                {pn.meals.map((m) => (
                  <div key={m.name} className="flex justify-between gap-3 border-b border-line py-2 text-sm last:border-0">
                    <div><strong>{m.name}</strong><div className="text-muted">{m.items}</div></div>
                    <span className="font-semibold text-primary">{m.calories} kcal</span>
                  </div>
                ))}
              </div>
            </CardBody></Card>
          ) : (
            <Card><CardBody className="text-sm text-muted">No nutrition plan for this patient.</CardBody></Card>
          )}
        </Tabs.Content>

        <Tabs.Content value="wellness">
          <Card><CardBody>
            <h3 className="mb-3 font-display text-xl">Progress</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wellnessTrend}>
                  <CartesianGrid stroke="#E1EAE8" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#546B6C' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#546B6C' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="flexibility" stroke="#14877F" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="mindfulness" stroke="#0F5C5C" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="strength" stroke="#E4694F" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-muted">{py.length} yoga sessions logged.</p>
          </CardBody></Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
