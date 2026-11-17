import type { Patient } from '@/types';

export function PatientSelect({
  patients,
  value,
  onChange,
  includeAll = false,
  id = 'patient-select',
}: {
  patients: Patient[];
  value: string;
  onChange: (id: string) => void;
  includeAll?: boolean;
  id?: string;
}) {
  return (
    <div className="flex min-w-[200px] flex-col gap-1.5">
      <label htmlFor={id} className="label-caps text-muted">
        Patient
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 rounded-btn border border-line bg-white px-3 text-sm text-ink focus:border-primary-signal"
      >
        {includeAll ? <option value="all">All patients</option> : null}
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
