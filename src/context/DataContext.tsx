/**
 * Mutable demo store — modules append/update locally; nothing persists to a server.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { INITIAL_CONSULTATIONS } from '@/data/consultations';
import { INITIAL_HISTORY } from '@/data/history';
import { INITIAL_NUTRITION } from '@/data/nutritionPlans';
import { INITIAL_PATIENTS } from '@/data/patients';
import { INITIAL_REPORTS } from '@/data/reports';
import { INITIAL_YOGA, WELLNESS_TREND } from '@/data/yogaSessions';
import type {
  Consultation,
  MedicalHistoryEntry,
  MedicalReport,
  ModuleKey,
  NutritionPlan,
  Patient,
  Role,
  YogaSession,
} from '@/types';
import { PERMISSIONS } from '@/data/permissions';

interface DataContextValue {
  patients: Patient[];
  history: MedicalHistoryEntry[];
  reports: MedicalReport[];
  consultations: Consultation[];
  nutritionPlans: NutritionPlan[];
  yogaSessions: YogaSession[];
  wellnessTrend: typeof WELLNESS_TREND;
  permissionOverrides: Partial<Record<ModuleKey, Role[]>>;
  addPatient: (p: Patient) => void;
  addHistory: (e: MedicalHistoryEntry) => void;
  addReport: (r: MedicalReport) => void;
  addConsultation: (c: Consultation) => void;
  updateNutrition: (id: string, patch: Partial<NutritionPlan>) => void;
  addYogaSession: (s: YogaSession) => void;
  togglePermission: (module: ModuleKey, role: Role) => void;
  effectivePermissions: (module: ModuleKey) => Role[];
  patientName: (id: string) => string;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [consultations, setConsultations] = useState(INITIAL_CONSULTATIONS);
  const [nutritionPlans, setNutritionPlans] = useState(INITIAL_NUTRITION);
  const [yogaSessions, setYogaSessions] = useState(INITIAL_YOGA);
  const [permissionOverrides, setOverrides] = useState<Partial<Record<ModuleKey, Role[]>>>({});

  const addPatient = useCallback((p: Patient) => setPatients((prev) => [p, ...prev]), []);
  const addHistory = useCallback((e: MedicalHistoryEntry) => setHistory((prev) => [e, ...prev]), []);
  const addReport = useCallback((r: MedicalReport) => setReports((prev) => [r, ...prev]), []);
  const addConsultation = useCallback(
    (c: Consultation) => setConsultations((prev) => [c, ...prev]),
    [],
  );
  const updateNutrition = useCallback((id: string, patch: Partial<NutritionPlan>) => {
    setNutritionPlans((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);
  const addYogaSession = useCallback(
    (s: YogaSession) => setYogaSessions((prev) => [s, ...prev]),
    [],
  );

  const effectivePermissions = useCallback(
    (module: ModuleKey) => permissionOverrides[module] ?? PERMISSIONS[module],
    [permissionOverrides],
  );

  const togglePermission = useCallback((module: ModuleKey, role: Role) => {
    setOverrides((prev) => {
      const base = prev[module] ?? [...PERMISSIONS[module]];
      const next = base.includes(role) ? base.filter((r) => r !== role) : [...base, role];
      return { ...prev, [module]: next };
    });
  }, []);

  const patientName = useCallback(
    (id: string) => patients.find((p) => p.id === id)?.name ?? 'Unknown patient',
    [patients],
  );

  const value = useMemo(
    () => ({
      patients,
      history,
      reports,
      consultations,
      nutritionPlans,
      yogaSessions,
      wellnessTrend: WELLNESS_TREND,
      permissionOverrides,
      addPatient,
      addHistory,
      addReport,
      addConsultation,
      updateNutrition,
      addYogaSession,
      togglePermission,
      effectivePermissions,
      patientName,
    }),
    [
      patients,
      history,
      reports,
      consultations,
      nutritionPlans,
      yogaSessions,
      permissionOverrides,
      addPatient,
      addHistory,
      addReport,
      addConsultation,
      updateNutrition,
      addYogaSession,
      togglePermission,
      effectivePermissions,
      patientName,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
