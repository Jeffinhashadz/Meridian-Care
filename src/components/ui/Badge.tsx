/**
 * Status chip with tone mapping for clinical statuses.
 */
import { statusTone } from '../../utils/helpers';

const TONE_CLASS = {
  ok: 'badge-ok',
  warn: 'badge-warn',
  danger: 'badge-danger',
  muted: 'badge-muted',
} as const;

export function Badge({ status, className = '' }: { status: string; className?: string }) {
  const tone = statusTone(status);
  return <span className={`badge ${TONE_CLASS[tone]} ${className}`.trim()}>{status}</span>;
}
