import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FilterPills } from '@/components/ui/FilterPills';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useData } from '@/context/DataContext';
import { useSearch } from '@/context/SearchContext';
import { useToast } from '@/components/ui/Toast';
import { usePageReady } from '@/hooks/usePageReady';
import { formatDate, uid } from '@/lib/utils';
import type { Patient, PatientStatus } from '@/types';

export function PatientsPage() {
  const ready = usePageReady();
  const { patients, addPatient } = useData();
  const { query } = useSearch();
  const { toast } = useToast();
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Female' as Patient['gender'],
    bloodType: 'O+',
    email: '',
    phone: '',
    primaryDoctor: 'Dr. Elias Vance',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const counts = useMemo(
    () => ({
      All: patients.length,
      Active: patients.filter((p) => p.status === 'Active').length,
      Critical: patients.filter((p) => p.status === 'Critical').length,
      Inactive: patients.filter((p) => p.status === 'Inactive').length,
    }),
    [patients],
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      const matchStatus = filter === 'All' || p.status === filter;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.conditions.some((c) => c.toLowerCase().includes(q)) ||
        p.primaryDoctor.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [patients, filter, query]);

  if (!ready) return <PageSkeleton />;

  const submit = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.age || Number(form.age) < 1) next.age = 'Valid age required';
    if (!form.email.includes('@')) next.email = 'Valid email required';
    setErrors(next);
    if (Object.keys(next).length) return;

    const patient: Patient = {
      id: uid('p'),
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      bloodType: form.bloodType,
      email: form.email.trim(),
      phone: form.phone || '—',
      address: 'Address pending',
      emergencyContact: 'Pending',
      avatar: form.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      status: 'Active',
      primaryDoctor: form.primaryDoctor,
      lastVisit: new Date().toISOString().slice(0, 10),
      conditions: [],
      allergies: ['None known'],
      heightCm: 170,
      weightKg: 70,
    };
    addPatient(patient);
    setOpen(false);
    setForm({ name: '', age: '', gender: 'Female', bloodType: 'O+', email: '', phone: '', primaryDoctor: 'Dr. Elias Vance' });
    toast('Patient added to local demo data', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Centralized patient profiles"
        description="Unified demographic, clinical flags, and care ownership."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} /> Add patient
          </Button>
        }
      />

      <div className="mb-4">
        <FilterPills
          value={filter}
          onChange={setFilter}
          options={(['All', 'Active', 'Critical', 'Inactive'] as const).map((s) => ({
            value: s,
            label: s,
            count: counts[s],
          }))}
        />
      </div>

      {list.length === 0 ? (
        <Card>
          <EmptyState title="No patients match" description="Try another filter or clear search." />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <Link key={p.id} to={`/patients/${p.id}`} className="block transition hover:-translate-y-0.5">
              <Card className="h-full">
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={p.avatar} />
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted">
                          {p.age} yrs · {p.gender} · {p.bloodType}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={p.status as PatientStatus} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.conditions.slice(0, 2).map((c) => (
                      <span key={c} className="rounded-full bg-ground px-2.5 py-1 text-xs font-medium text-primary">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-muted">
                    <span>{p.primaryDoctor}</span>
                    <span>Last visit {formatDate(p.lastVisit)}</span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Add patient"
        description="Creates a local-only record for this demo session."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Save patient</Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['name', 'Full name', 'text'],
            ['age', 'Age', 'number'],
            ['email', 'Email', 'email'],
            ['phone', 'Phone', 'tel'],
          ].map(([key, label, type]) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="label-caps text-muted" htmlFor={key}>{label}</label>
              <input
                id={key}
                type={type}
                className="min-h-11 rounded-btn border border-line px-3"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
              {errors[key] ? <span className="text-xs text-[#A12A18]">{errors[key]}</span> : null}
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="label-caps text-muted" htmlFor="gender">Gender</label>
            <select id="gender" className="min-h-11 rounded-btn border border-line px-3" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Patient['gender'] }))}>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="label-caps text-muted" htmlFor="blood">Blood type</label>
            <input id="blood" className="min-h-11 rounded-btn border border-line px-3" value={form.bloodType} onChange={(e) => setForm((f) => ({ ...f, bloodType: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
