/**
 * Meridian root router — public landing, login, role-guarded workspace.
 */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/RoleGuard';
import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { PatientsPage } from '@/features/patients/PatientsPage';
import { PatientDetailPage } from '@/features/patients/PatientDetailPage';
import { HistoryPage } from '@/features/history/HistoryPage';
import { ReportsPage } from '@/features/reports/ReportsPage';
import { ConsultationsPage } from '@/features/consultations/ConsultationsPage';
import { NutritionPage } from '@/features/nutrition/NutritionPage';
import { YogaPage } from '@/features/yoga/YogaPage';
import { AccessPage } from '@/features/access/AccessPage';
import { NoAccessPage } from '@/features/system/NoAccessPage';
import { NotFoundPage } from '@/features/system/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/no-access" element={<NoAccessPage />} />
              <Route element={<AppShell />}>
                <Route
                  path="/dashboard"
                  element={
                    <RoleGuard module="dashboard">
                      <DashboardPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/patients"
                  element={
                    <RoleGuard module="patients">
                      <PatientsPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/patients/:id"
                  element={
                    <RoleGuard module="patients">
                      <PatientDetailPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/me"
                  element={
                    <RoleGuard module="myProfile">
                      <PatientDetailPage forceLinked />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <RoleGuard module="history">
                      <HistoryPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <RoleGuard module="reports">
                      <ReportsPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/consultations"
                  element={
                    <RoleGuard module="consultations">
                      <ConsultationsPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/nutrition"
                  element={
                    <RoleGuard module="nutrition">
                      <NutritionPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/yoga"
                  element={
                    <RoleGuard module="yoga">
                      <YogaPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/access"
                  element={
                    <RoleGuard module="access">
                      <AccessPage />
                    </RoleGuard>
                  }
                />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}
