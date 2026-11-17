import { useMemo, useState } from 'react';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader } from '@/components/ui/PageHeader';
import { PatientSelect } from '@/components/ui/PatientSelect';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import { usePageReady } from '@/hooks/usePageReady';
import { formatDate } from '@/lib/utils';

const COLORS = ['#0F5C5C', '#14877F', '#E4694F'];

export function NutritionPage() {
  const ready = usePageReady();
  const { user, linkedPatientId } = useAuth();
  const { patients, nutritionPlans, updateNutrition, patientName } = useData();
  const { toast } = useToast();
  const isPatient = user?.role === 'patient';
  const canEdit = user?.role === 'nutritionist' || user?.role === 'admin';
  const [patientId, setPatientId] = useState(
    isPatient ? linkedPatientId ?? 'p-001' : nutritionPlans[0]?.patientId ?? 'p-001',
  );
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState('');
  const [calories, setCalories] = useState('');

  const plan = useMemo(
    () =>
      nutritionPlans.find((p) =>
        isPatient ? p.patientId === linkedPatientId : p.patientId === patientId,
      ),
    [nutritionPlans, patientId, isPatient, linkedPatientId],
  );

  if (!ready) return <PageSkeleton />;

  const macros = plan
    ? [
        { name: 'Protein', value: plan.macros.protein },
        { name: 'Carbs', value: plan.macros.carbs },
        { name: 'Fats', value: plan.macros.fats },
      ]
    : [];

  const mealTotal = plan?.meals.reduce((s, m) => s + m.calories, 0) ?? 0;

  const save = () => {
    if (!plan) return;
    updateNutrition(plan.id, {
      goal: goal || plan.goal,
      calories: Number(calories) || plan.calories,
    });
    setOpen(false);
    toast('Plan updated locally (demo only)', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Personalized nutrition plans"
        description="Calorie targets, macro splits, meal timing, and adherence."
        actions={
          canEdit && plan ? (
            <Button
              onClick={() => {
                setGoal(plan.goal);
                setCalories(String(plan.calories));
                setOpen(true);
              }}
            >
              Edit plan
            </Button>
          ) : null
        }
      />

      {!isPatient ? (
        <div className="mb-4">
          <PatientSelect
            patients={patients.filter((p) => nutritionPlans.some((n) => n.patientId === p.id))}
            value={patientId}
            onChange={setPatientId}
          />
        </div>
      ) : null}

      {!plan ? (
        <Card><CardBody className="text-sm text-muted">No nutrition plan for this patient yet.</CardBody></Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl">{plan.title}</h2>
                    <p className="mt-1 text-sm text-muted">
                      {patientName(plan.patientId)} · Coach {plan.nutritionist} · Started {formatDate(plan.startDate)}
                    </p>
                  </div>
                  <StatusBadge status={plan.status} />
                </div>
                <p className="mt-4">{plan.goal}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[12px] bg-ground p-3">
                    <div className="label-caps text-muted">Daily calories</div>
                    <div className="font-display text-2xl">{plan.calories} kcal</div>
                    <div className="text-xs text-muted">Meal sum {mealTotal} kcal</div>
                  </div>
                  <div className="rounded-[12px] bg-ground p-3">
                    <div className="mb-2 flex justify-between text-sm"><span>Adherence</span><strong>{plan.adherence}%</strong></div>
                    <ProgressBar value={plan.adherence} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {plan.restrictions.map((r) => (
                    <span key={r} className="rounded-full bg-ground px-2.5 py-1 text-xs font-medium text-primary">{r}</span>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-display text-xl">Macro split</h3>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={macros} dataKey="value" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={3}>
                        {macros.map((_, i) => <Cell key={COLORS[i]} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {macros.map((m, i) => (
                    <div key={m.name} className="grid grid-cols-[70px_1fr_40px] items-center gap-2 text-sm">
                      <span>{m.name}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-line">
                        <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: COLORS[i] }} />
                      </div>
                      <strong>{m.value}%</strong>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardBody>
                <h3 className="font-display text-xl">Daily meal plan</h3>
                {plan.meals.map((meal) => (
                  <div key={meal.name} className="border-b border-line py-3 last:border-0">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <strong>{meal.name}</strong>
                        <div className="text-xs text-muted">{meal.time}</div>
                      </div>
                      <span className="font-semibold text-primary">{meal.calories} kcal</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{meal.items}</p>
                    <div className="mt-2">
                      <ProgressBar value={(meal.calories / plan.calories) * 100} />
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <h3 className="font-display text-xl">Weekly adherence</h3>
                <div className="mt-3 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={plan.weeklyAdherence.map((v, i) => ({ week: `W${i + 1}`, v }))}>
                      <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#546B6C' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#546B6C' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="v" stroke="#14877F" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      <Modal open={open} onOpenChange={setOpen} title="Edit nutrition plan" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        <div className="space-y-3">
          <div>
            <label className="label-caps text-muted" htmlFor="goal">Goal</label>
            <textarea id="goal" className="mt-1 min-h-24 w-full rounded-btn border border-line px-3 py-2" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div>
            <label className="label-caps text-muted" htmlFor="kcal">Daily calories</label>
            <input id="kcal" type="number" className="mt-1 min-h-11 w-full rounded-btn border border-line px-3" value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
