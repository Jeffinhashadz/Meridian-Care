/**
 * Personalized nutrition plans with macros, meals, and adherence.
 */
import { useMemo, useState } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { NUTRITION_PLANS, PATIENTS } from '../data/dummy';
import { formatDate, patientName } from '../utils/helpers';

const COLORS = ['#146878', '#2ec4b6', '#e07a5f'];

export function Nutrition() {
  const { user, linkedPatientId } = useAuth();
  const isPatient = user?.role === 'patient';
  const [patientId, setPatientId] = useState(
    isPatient ? linkedPatientId ?? 'p-001' : NUTRITION_PLANS[0]?.patientId ?? 'p-001',
  );

  const plans = useMemo(() => {
    return NUTRITION_PLANS.filter((p) =>
      isPatient ? p.patientId === linkedPatientId : p.patientId === patientId,
    );
  }, [patientId, isPatient, linkedPatientId]);

  const active = plans[0];

  const macroData = active
    ? [
        { name: 'Protein', value: active.macros.protein },
        { name: 'Carbs', value: active.macros.carbs },
        { name: 'Fats', value: active.macros.fats },
      ]
    : [];

  return (
    <div>
      <PageHeader
        title="Personalized nutrition plans"
        description="Calorie targets, macro splits, meal timing, and adherence tracking."
      />

      {!isPatient ? (
        <div className="toolbar">
          <div className="field" style={{ minWidth: 220 }}>
            <label htmlFor="nut-patient">Patient</label>
            <select id="nut-patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              {PATIENTS.filter((p) => NUTRITION_PLANS.some((n) => n.patientId === p.id)).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {!active ? (
        <div className="panel panel-pad empty">No nutrition plan for this patient yet.</div>
      ) : (
        <>
          <div className="split-2">
            <div className="panel panel-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>{active.title}</h3>
                  <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: '0.88rem' }}>
                    {patientName(active.patientId)} · Coach {active.nutritionist} · Started{' '}
                    {formatDate(active.startDate)}
                  </p>
                </div>
                <Badge status={active.status} />
              </div>
              <p style={{ margin: '1rem 0', lineHeight: 1.5 }}>{active.goal}</p>
              <div className="kv-grid">
                <div className="kv">
                  <div className="k">Daily calories</div>
                  <div className="v">{active.calories} kcal</div>
                </div>
                <div className="kv">
                  <div className="k">Adherence</div>
                  <div className="v">{active.adherence}%</div>
                </div>
              </div>
              <div style={{ marginTop: '0.85rem' }}>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${active.adherence}%` }} />
                </div>
              </div>
              <div className="tag-list" style={{ marginTop: '1rem' }}>
                {active.restrictions.map((r) => (
                  <span key={r} className="tag">{r}</span>
                ))}
              </div>
            </div>

            <div className="panel panel-pad">
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Macro split</h3>
              <div className="chart-box" style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={macroData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                      {macroData.map((_, i) => (
                        <Cell key={COLORS[i]} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="macro-bars">
                {macroData.map((m, i) => (
                  <div key={m.name} className="macro-row">
                    <span>{m.name}</span>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${m.value}%`, background: COLORS[i] }}
                      />
                    </div>
                    <strong>{m.value}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel panel-pad" style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Daily meal plan</h3>
            {active.meals.map((meal) => (
              <div key={meal.name} className="meal-row">
                <div>
                  <strong>{meal.name}</strong>
                  <div className="time">{meal.time}</div>
                </div>
                <div style={{ color: 'var(--ink-soft)', fontSize: '0.92rem' }}>{meal.items}</div>
                <div style={{ fontWeight: 650, color: 'var(--teal)' }}>{meal.calories} kcal</div>
              </div>
            ))}
          </div>

          {plans.length > 1 ? (
            <div className="panel panel-pad" style={{ marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.65rem' }}>Other plans on file</h3>
              <div className="grid grid-2">
                {plans.slice(1).map((p) => (
                  <div key={p.id} className="kv">
                    <div className="k">{p.title}</div>
                    <div className="v">{p.calories} kcal · {p.status}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
