/**
 * Meridian Care root router — login gate + role-scoped module pages.
 */
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { RoleGuard } from './components/RoleGuard';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { PatientProfile } from './pages/PatientProfile';
import { MedicalHistory } from './pages/MedicalHistory';
import { Reports } from './pages/Reports';
import { Consultations } from './pages/Consultations';
import { Nutrition } from './pages/Nutrition';
import { Yoga } from './pages/Yoga';
import { AccessControl } from './pages/AccessControl';
import { logger } from './utils/logger';

logger.info('Meridian Care application bootstrapping');

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/patients"
              element={
                <RoleGuard roles={['admin', 'doctor', 'nutritionist', 'yoga_instructor']}>
                  <Patients />
                </RoleGuard>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <RoleGuard roles={['admin', 'doctor', 'nutritionist', 'yoga_instructor']}>
                  <PatientProfile />
                </RoleGuard>
              }
            />
            <Route
              path="/my-profile"
              element={
                <RoleGuard roles={['patient']}>
                  <PatientProfile forceLinked />
                </RoleGuard>
              }
            />
            <Route
              path="/history"
              element={
                <RoleGuard roles={['admin', 'doctor', 'patient']}>
                  <MedicalHistory />
                </RoleGuard>
              }
            />
            <Route
              path="/reports"
              element={
                <RoleGuard roles={['admin', 'doctor', 'patient']}>
                  <Reports />
                </RoleGuard>
              }
            />
            <Route
              path="/consultations"
              element={
                <RoleGuard roles={['admin', 'doctor', 'patient']}>
                  <Consultations />
                </RoleGuard>
              }
            />
            <Route
              path="/nutrition"
              element={
                <RoleGuard roles={['admin', 'doctor', 'patient', 'nutritionist']}>
                  <Nutrition />
                </RoleGuard>
              }
            />
            <Route
              path="/yoga"
              element={
                <RoleGuard roles={['admin', 'doctor', 'patient', 'yoga_instructor']}>
                  <Yoga />
                </RoleGuard>
              }
            />
            <Route
              path="/access"
              element={
                <RoleGuard roles={['admin']}>
                  <AccessControl />
                </RoleGuard>
              }
            />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
