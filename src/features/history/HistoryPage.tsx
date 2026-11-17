import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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
import type { HistoryType, MedicalHistoryEntry, Severity } from '@/types';

const TYPES: Array<'All' | HistoryType> = ['All', 'Diagnosis', 'Procedure', 'Allergy', 'Immunization', 'Chronic'];

export function HistoryPage() {
  const ready = usePageReady();
  const { user, linkedPatientId } = useAuth();
  const { patients, history, addHistory, patientName } = useData();
  const { query } = useSearch();
  const { toast } = useToast();
  const isPatient = user?.role === 'patient';
  const [type, setType] = useState<(typeof TYPES)[number]>('All');
  const [patientId, setPatientId] = useState(isPatient ? linkedPatientId ?? 'p-001' : 'all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Diagnosis' as HistoryType,
    severity: 'Moderate' as Severity,
    patientId: 'p-001',
    clinician: 'Dr. Elias Vance',
  });

  const entries = useMemo(() => {
    const q = query.toLowerCase();
    return history
      .filter((e) => {
        const matchPatient = isPatient
          ? e.patientId === linkedPatientId
          : patientId === 'all' || e.patientId === patientId;
        const matchType = type === 'All' || e.type === type;
        const matchQuery = !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
        return matchPatient && matchType && matchQuery;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [history, type, patientId, isPatient, linkedPatientId, query]);

  const byYear = useMemo(() => {
    const map = new Map<string, MedicalHistoryEntry[]>();
    entries.forEach((e) => {
      const y = e.date.slice(0, 4);
      map.set(y, [...(map.get(y) ?? []), e]);
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [entries]);

  const typeCounts = TYPES.slice(1).map((t) => ({
    type: t,
    count: history.filter((h) => h.type === t && (!isPatient || h.patientId === linkedPatientId)).length,
  }));

  const criticalAllergies = entries.filter((e) => e.type === 'Allergy' && e.severity === 'High');

  if (!ready) return <PageSkeleton />;

  const submit = () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast('Title and description are required', 'danger');
      return;
    }
    addHistory({
      id: uid('mh'),
      patientId: isPatient ? linkedPatientId ?? 'p-001' : form.patientId,
      date: new Date().toISOString().slice(0, 10),
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      clinician: form.clinician,
      severity: form.severity,
    });
    setOpen(false);
    toast('History entry added', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Medical history management"
        description="Chronological diagnoses, procedures, allergies, and immunizations."
        actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Add entry</Button>}
      />

      {criticalAllergies.length > 0 ? (
        <div className="mb-4 rounded-card border border-[#FBE0DA] bg-[#FBE0DA]/50 px-4 py-3 text-sm text-[#A12A18]">
          <strong>Critical allergy callout:</strong>{' '}
          {criticalAllergies.map((a) => `${patientName(a.patientId)} — ${a.title}`).join('; ')}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-end gap-3">
        {!isPatient ? (
          <PatientSelect patients={patients} value={patientId} onChange={setPatientId} includeAll />
        ) : null}
        <FilterPills
          value={type}
          onChange={(v) => setType(v as (typeof TYPES)[number])}
          options={TYPES.map((t) => ({ value: t, label: t }))}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card>
          <CardBody>
            {byYear.length === 0 ? (
              <p className="text-sm text-muted">No history entries for this filter.</p>
            ) : (
              byYear.map(([year, items]) => (
                <div key={year} className="mb-6 last:mb-0">
                  <h3 className="mb-3 font-display text-xl text-ink">{year}</h3>
                  <div className="relative space-y-4 border-l-2 border-primary-mint/50 pl-5">
                    {items.map((e) => (
                      <div key={e.id} className="relative">
                        <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary-signal ring-4 ring-primary-signal/20" />
                        <div className="text-xs text-muted">
                          {formatDate(e.date)} · {patientName(e.patientId)} · {e.clinician}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold">{e.title}</h4>
                          <StatusBadge status={e.type} />
                          {e.severity ? <StatusBadge status={e.severity} /> : null}
                        </div>
                        <p className="mt-1 text-sm text-muted">{e.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="font-display text-xl">Counts by type</h3>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeCounts}>
                  <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#546B6C' }} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#546B6C' }} width={24} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#14877F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal open={open} onOpenChange={setOpen} title="Add history entry" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Save entry</Button></>}>
        <div className="grid gap-3">
          {!isPatient ? (
            <PatientSelect patients={patients} value={form.patientId} onChange={(id) => setForm((f) => ({ ...f, patientId: id }))} id="hist-add-patient" />
          ) : null}
          <div>
            <label className="label-caps text-muted" htmlFor="hist-title">Title</label>
            <input id="hist-title" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label-caps text-muted" htmlFor="hist-desc">Description</label>
            <textarea id="hist-desc" className="mt-1 min-h-24 w-full rounded-btn border border-line px-3 py-2" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-caps text-muted" htmlFor="hist-type">Type</label>
              <select id="hist-type" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as HistoryType }))}>
                {TYPES.slice(1).map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-caps text-muted" htmlFor="hist-sev">Severity</label>
              <select id="hist-sev" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as Severity }))}>
                <option>Low</option><option>Moderate</option><option>High</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
