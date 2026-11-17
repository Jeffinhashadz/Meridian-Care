import { cn } from '@/lib/utils';

export function Avatar({
  initials,
  size = 'md',
  className,
}: {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-[12px] bg-gradient-to-br from-primary-signal to-primary font-semibold text-white',
        size === 'sm' && 'h-8 w-8 text-[11px]',
        size === 'md' && 'h-10 w-10 text-xs',
        size === 'lg' && 'h-[72px] w-[72px] rounded-[18px] text-xl',
        className,
      )}
    >
      {initials}
    </div>
  );
}
