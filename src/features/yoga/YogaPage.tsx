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
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { PatientSelect } from '@/components/ui/PatientSelect';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import { usePageReady } from '@/hooks/usePageReady';
import { formatDate, uid } from '@/lib/utils';
import type { YogaIntensity } from '@/types';

export function YogaPage() {
  const ready = usePageReady();
  const { user, linkedPatientId } = useAuth();
  const { patients, yogaSessions, wellnessTrend, addYogaSession, patientName } = useData();
  const { toast } = useToast();
  const isPatient = user?.role === 'patient';
  const [patientId, setPatientId] = useState(isPatient ? linkedPatientId ?? 'p-001' : 'p-001');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    style: 'Hatha',
    focus: '',
    durationMin: '45',
    intensity: 'Gentle' as YogaIntensity,
    moodBefore: '5',
    moodAfter: '7',
  });

  const sessions = useMemo(
    () =>
      yogaSessions
        .filter((s) => (isPatient ? s.patientId === linkedPatientId : s.patientId === patientId))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [yogaSessions, patientId, isPatient, linkedPatientId],
  );

  const totalMins = sessions.reduce((s, y) => s + y.durationMin, 0);
  const avgLift =
    sessions.length === 0
      ? 0
      : sessions.reduce((s, y) => s + (y.moodAfter - y.moodBefore), 0) / sessions.length;

  if (!ready) return <PageSkeleton />;

  const submit = () => {
    if (!form.focus.trim()) {
      toast('Focus is required', 'danger');
      return;
    }
    addYogaSession({
      id: uid('y'),
      patientId: isPatient ? linkedPatientId ?? 'p-001' : patientId,
      date: new Date().toISOString().slice(0, 10),
      style: form.style,
      instructor: 'Rohan Mehta',
      durationMin: Number(form.durationMin) || 45,
      intensity: form.intensity,
      focus: form.focus.trim(),
      moodBefore: Number(form.moodBefore) || 5,
      moodAfter: Number(form.moodAfter) || 7,
      notes: 'Logged in demo session.',
    });
    setOpen(false);
    toast('Session logged', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Yoga & wellness progress"
        description="Session history, intensity, and mind-body trendlines."
        actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Log session</Button>}
      />

      {!isPatient ? (
        <div className="mb-4">
          <PatientSelect
            patients={patients.filter((p) => yogaSessions.some((y) => y.patientId === p.id) || p.id === patientId)}
            value={patientId}
            onChange={setPatientId}
          />
        </div>
      ) : null}

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Sessions logged" value={sessions.length} delta={`For ${patientName(isPatient ? linkedPatientId ?? 'p-001' : patientId)}`} spark={[1, 2, 2, 3, 4, sessions.length]} />
        <StatCard label="Minutes practiced" value={totalMins} spark={[40, 80, 120, 150, 180, totalMins]} />
        <StatCard label="Avg mood lift" value={Number(avgLift.toFixed(1))} delta="Before → after" spark={[2, 2.5, 3, 3.2, 3.5, avgLift]} />
      </div>

      <Card className="mb-4">
        <CardBody>
          <h3 className="mb-3 font-display text-xl">Progress tracking</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wellnessTrend}>
                <CartesianGrid stroke="#E1EAE8" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#546B6C', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#546B6C', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="flexibility" stroke="#14877F" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="strength" stroke="#0F5C5C" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="mindfulness" stroke="#E4694F" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="mb-3 font-display text-xl">Session log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="label-caps text-left text-muted">
                  <th className="pb-2 pr-3">Date</th>
                  <th className="pb-2 pr-3">Style</th>
                  <th className="pb-2 pr-3">Focus</th>
                  <th className="pb-2 pr-3">Intensity</th>
                  <th className="pb-2 pr-3">Duration</th>
                  <th className="pb-2">Mood</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-t border-line">
                    <td className="py-3 pr-3">{formatDate(s.date)}</td>
                    <td className="py-3 pr-3 font-medium">{s.style}</td>
                    <td className="py-3 pr-3 text-muted">{s.focus}</td>
                    <td className="py-3 pr-3"><StatusBadge status={s.intensity} /></td>
                    <td className="py-3 pr-3">{s.durationMin} min</td>
                    <td className="py-3">{s.moodBefore} → {s.moodAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Modal open={open} onOpenChange={setOpen} title="Log yoga session" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Save session</Button></>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label-caps text-muted" htmlFor="style">Style</label>
            <input id="style" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.style} onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))} />
          </div>
          <div>
            <label className="label-caps text-muted" htmlFor="intensity">Intensity</label>
            <select id="intensity" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.intensity} onChange={(e) => setForm((f) => ({ ...f, intensity: e.target.value as YogaIntensity }))}>
              <option>Gentle</option><option>Moderate</option><option>Advanced</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label-caps text-muted" htmlFor="focus">Focus</label>
            <input id="focus" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.focus} onChange={(e) => setForm((f) => ({ ...f, focus: e.target.value }))} />
          </div>
          <div>
            <label className="label-caps text-muted" htmlFor="dur">Duration (min)</label>
            <input id="dur" type="number" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.durationMin} onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label-caps text-muted" htmlFor="mb">Mood before</label>
              <input id="mb" type="number" min={1} max={10} className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.moodBefore} onChange={(e) => setForm((f) => ({ ...f, moodBefore: e.target.value }))} />
            </div>
            <div>
              <label className="label-caps text-muted" htmlFor="ma">Mood after</label>
              <input id="ma" type="number" min={1} max={10} className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.moodAfter} onChange={(e) => setForm((f) => ({ ...f, moodAfter: e.target.value }))} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
