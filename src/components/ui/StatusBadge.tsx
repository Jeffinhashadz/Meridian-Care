/** Status chip — always pairs label text with semantic color (WCAG). */
import { cn } from '@/lib/utils';

const MAP: Record<string, string> = {
  Active: 'bg-[#DDF3EA] text-[#0A6847]',
  Reviewed: 'bg-[#DDF3EA] text-[#0A6847]',
  Completed: 'bg-[#DDF3EA] text-[#0A6847]',
  Ready: 'bg-[#DCEBFA] text-[#1B4F8A]',
  Telehealth: 'bg-[#DCEBFA] text-[#1B4F8A]',
  Pending: 'bg-[#FBEBCB] text-[#805200]',
  Scheduled: 'bg-[#FBEBCB] text-[#805200]',
  Draft: 'bg-[#FBEBCB] text-[#805200]',
  Moderate: 'bg-[#FBEBCB] text-[#805200]',
  Critical: 'bg-[#FBE0DA] text-[#A12A18]',
  High: 'bg-[#FBE0DA] text-[#A12A18]',
  Cancelled: 'bg-[#FBE0DA] text-[#A12A18]',
  Inactive: 'bg-[#E9EEED] text-[#4A5F60]',
  Low: 'bg-[#E9EEED] text-[#4A5F60]',
  Chronic: 'bg-[#F3E8FA] text-[#6B2C8F]',
  Diagnosis: 'bg-[#DCEBFA] text-[#1B4F8A]',
  Procedure: 'bg-[#E9EEED] text-[#4A5F60]',
  Allergy: 'bg-[#FBE0DA] text-[#A12A18]',
  Immunization: 'bg-[#DDF3EA] text-[#0A6847]',
  Gentle: 'bg-[#DDF3EA] text-[#0A6847]',
  Advanced: 'bg-[#FBE0DA] text-[#A12A18]',
  'In-Person': 'bg-[#E9EEED] text-[#4A5F60]',
  'Follow-up': 'bg-[#DCEBFA] text-[#1B4F8A]',
  Lab: 'bg-[#DCEBFA] text-[#1B4F8A]',
  Imaging: 'bg-[#F3E8FA] text-[#6B2C8F]',
  Pathology: 'bg-[#E9EEED] text-[#4A5F60]',
  Cardiology: 'bg-[#FBE0DA] text-[#A12A18]',
  Other: 'bg-[#E9EEED] text-[#4A5F60]',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        MAP[status] ?? 'bg-[#E9EEED] text-[#4A5F60]',
        className,
      )}
    >
      {status}
    </span>
  );
}
