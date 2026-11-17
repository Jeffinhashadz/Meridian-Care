/**
 * KPI tile with optional sparkline — used on dashboard and wellness.
 */
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { Card, CardBody } from './Card';

export function StatCard({
  label,
  value,
  delta,
  spark,
  accent = '#14877F',
}: {
  label: string;
  value: number | string;
  delta?: string;
  spark?: number[];
  accent?: string;
}) {
  const numeric = typeof value === 'number';
  const [display, setDisplay] = useState(numeric ? 0 : value);

  useEffect(() => {
    if (!numeric) {
      setDisplay(value);
      return;
    }
    const target = value as number;
    const start = performance.now();
    const duration = 600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, numeric]);

  const chartData = (spark ?? []).map((v, i) => ({ i, v }));

  return (
    <Card>
      <CardBody className="relative overflow-hidden">
        <p className="label-caps text-muted">{label}</p>
        <p className="mt-2 font-display text-3xl text-ink tabular-nums">{display}</p>
        {delta ? <p className="mt-1 text-xs font-medium text-primary-signal">{delta}</p> : null}
        {chartData.length > 1 ? (
          <div className="pointer-events-none absolute bottom-0 right-0 h-14 w-28 opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area type="monotone" dataKey="v" stroke={accent} fill={accent} fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
