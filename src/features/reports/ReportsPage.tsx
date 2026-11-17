import { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Download, FileText, Upload, X } from 'lucide-react';
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
import type { MedicalReport, ReportCategory } from '@/types';

const CATS: Array<'All' | ReportCategory> = ['All', 'Lab', 'Imaging', 'Pathology', 'Cardiology', 'Other'];

export function ReportsPage() {
  const ready = usePageReady();
  const { user, linkedPatientId } = useAuth();
  const { patients, reports, addReport, patientName } = useData();
  const { query } = useSearch();
  const { toast } = useToast();
  const isPatient = user?.role === 'patient';
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const [patientId, setPatientId] = useState(isPatient ? linkedPatientId ?? 'p-001' : 'all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detail, setDetail] = useState<MedicalReport | null>(null);
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Lab');
  const [uploadPatient, setUploadPatient] = useState('p-001');

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return reports
      .filter((r) => {
        const matchPatient = isPatient
          ? r.patientId === linkedPatientId
          : patientId === 'all' || r.patientId === patientId;
        const matchCat = cat === 'All' || r.category === cat;
        const matchQuery = !q || r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q);
        return matchPatient && matchCat && matchQuery;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [reports, cat, patientId, isPatient, linkedPatientId, query]);

  const counts = {
    Reviewed: reports.filter((r) => r.status === 'Reviewed' && (!isPatient || r.patientId === linkedPatientId)).length,
    Ready: reports.filter((r) => r.status === 'Ready' && (!isPatient || r.patientId === linkedPatientId)).length,
    Pending: reports.filter((r) => r.status === 'Pending' && (!isPatient || r.patientId === linkedPatientId)).length,
  };

  if (!ready) return <PageSkeleton />;

  const upload = () => {
    if (!title.trim() || !fileName) {
      toast('Title and file are required', 'danger');
      return;
    }
    addReport({
      id: uid('rp'),
      patientId: isPatient ? linkedPatientId ?? 'p-001' : uploadPatient,
      title: title.trim(),
      category,
      date: new Date().toISOString().slice(0, 10),
      orderedBy: user?.name ?? 'Clinician',
      status: 'Pending',
      summary: 'Uploaded in demo — awaiting review.',
      findings: 'Pending interpretation.',
      fileLabel: fileName,
    });
    setUploadOpen(false);
    setTitle('');
    setFileName('');
    toast('Report uploaded as Pending', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Medical report management"
        description="Browse labs, imaging, and specialty diagnostics."
        actions={<Button onClick={() => setUploadOpen(true)}><Upload size={16} /> Upload report</Button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {Object.entries(counts).map(([k, v]) => (
          <Card key={k}><CardBody className="flex items-center justify-between"><span className="label-caps text-muted">{k}</span><span className="font-display text-2xl">{v}</span></CardBody></Card>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        {!isPatient ? <PatientSelect patients={patients} value={patientId} onChange={setPatientId} includeAll /> : null}
        <FilterPills value={cat} onChange={(v) => setCat(v as (typeof CATS)[number])} options={CATS.map((c) => ({ value: c, label: c }))} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((r) => (
          <Card key={r.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-ground text-primary"><FileText size={18} /></div>
                  <div>
                    <button type="button" className="text-left font-semibold hover:text-primary-signal" onClick={() => setDetail(r)}>{r.title}</button>
                    <div className="text-xs text-muted">{patientName(r.patientId)} · {r.orderedBy}</div>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-3 text-sm text-muted">{r.summary}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2"><StatusBadge status={r.category} /><span className="text-xs text-muted">{formatDate(r.date)}</span></div>
                <Button variant="secondary" size="sm" onClick={() => toast(`Download started: ${r.fileLabel}`)}>
                  <Download size={14} /> {r.fileLabel}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal open={uploadOpen} onOpenChange={setUploadOpen} title="Upload report" description="Demo upload adds a Pending card locally." footer={<><Button variant="secondary" onClick={() => setUploadOpen(false)}>Cancel</Button><Button onClick={upload}>Upload</Button></>}>
        <div className="space-y-3">
          {!isPatient ? <PatientSelect patients={patients} value={uploadPatient} onChange={setUploadPatient} id="upload-patient" /> : null}
          <div>
            <label className="label-caps text-muted" htmlFor="rep-title">Title</label>
            <input id="rep-title" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label-caps text-muted" htmlFor="rep-cat">Category</label>
            <select id="rep-cat" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={category} onChange={(e) => setCategory(e.target.value as ReportCategory)}>
              {CATS.slice(1).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <label
            className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-card border border-dashed border-line bg-ground px-4 text-center text-sm text-muted"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) setFileName(f.name);
            }}
          >
            <Upload className="mb-2 text-primary" size={20} />
            Drag & drop a file, or browse
            <input
              type="file"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
            />
            {fileName ? <span className="mt-2 font-semibold text-ink">{fileName}</span> : null}
          </label>
        </div>
      </Modal>

      <Dialog.Root open={Boolean(detail)} onOpenChange={(o) => !o && setDetail(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
          <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-[min(420px,100vw)] flex-col border-l border-line bg-card p-6 shadow-soft focus:outline-none">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Dialog.Title className="font-display text-2xl">{detail?.title}</Dialog.Title>
                <Dialog.Description className="text-sm text-muted">{detail ? patientName(detail.patientId) : ''}</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close"><X size={18} /></Button>
              </Dialog.Close>
            </div>
            {detail ? (
              <>
                <div className="mb-4 flex gap-2">
                  {(['Pending', 'Ready', 'Reviewed'] as const).map((s, i) => (
                    <div key={s} className={`flex-1 rounded-btn border px-2 py-2 text-center text-xs font-semibold ${detail.status === s || ['Pending', 'Ready', 'Reviewed'].indexOf(detail.status) >= i ? 'border-primary bg-ground text-primary' : 'border-line text-muted'}`}>
                      {s}
                    </div>
                  ))}
                </div>
                <p className="text-sm">{detail.summary}</p>
                <div className="mt-4 rounded-[12px] bg-ground p-3 text-sm">
                  <div className="label-caps text-muted">Findings</div>
                  <p className="mt-1">{detail.findings ?? '—'}</p>
                </div>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
