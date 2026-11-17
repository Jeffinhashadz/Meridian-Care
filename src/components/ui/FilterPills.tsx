import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export function FilterPills({
  options,
  value,
  onChange,
}: {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filters">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'min-h-11 rounded-full border px-3.5 text-sm font-semibold transition',
              active
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-white text-muted hover:border-primary-signal/40 hover:text-ink',
            )}
          >
            {opt.label}
            {typeof opt.count === 'number' ? (
              <span className={cn('ml-1.5 tabular-nums', active ? 'text-primary-mint' : 'text-muted')}>
                {opt.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
