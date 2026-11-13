/** KPI tile for dashboards and module summaries. */
import type { ReactNode } from 'react';

export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="panel panel-pad stat">
      <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        {icon}
      </div>
      <div className="value">{value}</div>
      {delta ? <div className="delta">{delta}</div> : null}
    </div>
  );
}
