import { useMemo, useState } from 'react';
import { Building2, CalendarPlus, RefreshCw, Video } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterPills } from '@/components/ui/FilterPills';
import { PatientSelect } from '@/components/ui/PatientSelect';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useSearch } from '@/context/SearchContext';
import { useToast } from '@/components/ui/Toast';
import { usePageReady } from '@/hooks/usePageReady';
import { formatDate, uid } from '@/lib/utils';
import type { ConsultStatus, ConsultType } from '@/types';

const STATUSES: Array<'All' | ConsultStatus> = ['All', 'Scheduled', 'Completed', 'Cancelled'];
const COLORS = ['#0F5C5C', '#14877F', '#E4694F'];

export function ConsultationsPage() {
  const ready = usePageReady();
  const { user, linkedPatientId } = useAuth();
  const { patients, consultations, addConsultation, patientName } = useData();
  const { query } = useSearch();
  const { toast } = useToast();
  const isPatient = user?.role === 'patient';
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('All');
  const [patientId, setPatientId] = useState(isPatient ? linkedPatientId ?? 'p-001' : 'all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patientId: 'p-001',
    doctor: 'Dr. Elias Vance',
    date: '',
    time: '10:00 AM',
    type: 'In-Person' as ConsultType,
    reason: '',
    department: 'Internal Medicine',
  });

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return consultations
      .filter((c) => {
        const matchPatient = isPatient
          ? c.patientId === linkedPatientId
          : patientId === 'all' || c.patientId === patientId;
        const matchStatus = status === 'All' || c.status === status;
        const matchQuery = !q || c.reason.toLowerCase().includes(q) || c.doctor.toLowerCase().includes(q);
        return matchPatient && matchStatus && matchQuery;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [consultations, status, patientId, isPatient, linkedPatientId, query]);

  const nextUp = consultations
    .filter((c) => c.status === 'Scheduled' && (!isPatient || c.patientId === linkedPatientId))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const modality = ['In-Person', 'Telehealth', 'Follow-up'].map((t) => ({
    name: t,
    value: consultations.filter((c) => c.type === t && (!isPatient || c.patientId === linkedPatientId)).length,
  }));

  if (!ready) return <PageSkeleton />;

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === 'Telehealth') return <Video size={16} />;
    if (type === 'Follow-up') return <RefreshCw size={16} />;
    return <Building2 size={16} />;
  };

  const submit = () => {
    if (!form.date || !form.reason.trim()) {
      toast('Date and reason are required', 'danger');
      return;
    }
    addConsultation({
      id: uid('c'),
      patientId: isPatient ? linkedPatientId ?? 'p-001' : form.patientId,
      doctor: form.doctor,
      date: form.date,
      time: form.time,
      type: form.type,
      department: form.department,
      reason: form.reason.trim(),
      notes: '',
      status: 'Scheduled',
      durationMin: 25,
    });
    setOpen(false);
    toast('Visit scheduled', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Consultation records"
        description="Upcoming and historical visits with clinician notes."
        actions={<Button onClick={() => setOpen(true)}><CalendarPlus size={16} /> Schedule visit</Button>}
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_280px]">
        {nextUp ? (
          <Card className="border-primary-signal/30 bg-gradient-to-r from-white to-[#E8F6F4]">
            <CardBody>
              <div className="label-caps text-primary-signal">Next up</div>
              <h3 className="mt-1 font-display text-2xl">{nextUp.reason}</h3>
              <p className="mt-1 text-sm text-muted">
                {patientName(nextUp.patientId)} with {nextUp.doctor} · {formatDate(nextUp.date)} · {nextUp.time}
              </p>
            </CardBody>
          </Card>
        ) : (
          <Card><CardBody className="text-sm text-muted">No upcoming visits.</CardBody></Card>
        )}
        <Card>
          <CardBody>
            <h3 className="font-display text-lg">Modality mix</h3>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={modality} dataKey="value" nameKey="name" innerRadius={36} outerRadius={56}>
                    {modality.map((_, i) => <Cell key={COLORS[i]} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        {!isPatient ? <PatientSelect patients={patients} value={patientId} onChange={setPatientId} includeAll /> : null}
        <FilterPills value={status} onChange={(v) => setStatus(v as (typeof STATUSES)[number])} options={STATUSES.map((s) => ({ value: s, label: s }))} />
      </div>

      <div className="space-y-3">
        {list.map((c) => (
          <Card key={c.id} className={c.status === 'Cancelled' ? 'opacity-55' : ''}>
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-[58px] w-14 flex-col items-center justify-center rounded-[12px] bg-ground text-center">
                    <span className="text-[10px] font-semibold uppercase text-muted">
                      {new Date(c.date).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="font-display text-xl leading-none">{new Date(c.date).getDate()}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary"><TypeIcon type={c.type} /></span>
                      <strong>{c.reason}</strong>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {patientName(c.patientId)} with {c.doctor} · {c.department} · {c.time} · {c.durationMin} min
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={c.type} />
                  <StatusBadge status={c.status} />
                </div>
              </div>
              {c.notes ? (
                <p className="mt-3 rounded-[12px] bg-ground px-3 py-2 text-sm">{c.notes}</p>
              ) : (
                <p className="mt-3 text-xs text-muted">Notes appear after the visit is completed.</p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal open={open} onOpenChange={setOpen} title="Schedule visit" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Schedule</Button></>}>
        <div className="grid gap-3 sm:grid-cols-2">
          {!isPatient ? <div className="sm:col-span-2"><PatientSelect patients={patients} value={form.patientId} onChange={(id) => setForm((f) => ({ ...f, patientId: id }))} id="sched-patient" /></div> : null}
          <div>
            <label className="label-caps text-muted" htmlFor="sched-date">Date</label>
            <input id="sched-date" type="date" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label className="label-caps text-muted" htmlFor="sched-time">Time</label>
            <input id="sched-time" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
          </div>
          <div>
            <label className="label-caps text-muted" htmlFor="sched-doc">Doctor</label>
            <select id="sched-doc" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}>
              <option>Dr. Elias Vance</option>
              <option>Dr. Lena Okonkwo</option>
              <option>Dr. Hiro Tanaka</option>
            </select>
          </div>
          <div>
            <label className="label-caps text-muted" htmlFor="sched-type">Modality</label>
            <select id="sched-type" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ConsultType }))}>
              <option>In-Person</option>
              <option>Telehealth</option>
              <option>Follow-up</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label-caps text-muted" htmlFor="sched-reason">Reason</label>
            <input id="sched-reason" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
