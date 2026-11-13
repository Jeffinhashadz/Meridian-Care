/** Initials avatar used across patient and staff surfaces. */
export function Avatar({
  initials,
  size = 'md',
}: {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const cls = size === 'lg' ? 'avatar avatar-lg' : size === 'sm' ? 'avatar avatar-sm' : 'avatar';
  return <div className={cls} aria-hidden>{initials}</div>;
}
