import type { ModuleKey, NavItem, Role } from '@/types';

/** Canonical RBAC matrix — single source for nav + route guards. */
export const PERMISSIONS: Record<ModuleKey, Role[]> = {
  dashboard: ['admin', 'doctor', 'patient', 'nutritionist', 'yoga_instructor'],
  patients: ['admin', 'doctor', 'nutritionist', 'yoga_instructor'],
  myProfile: ['patient'],
  history: ['admin', 'doctor', 'patient'],
  reports: ['admin', 'doctor', 'patient'],
  consultations: ['admin', 'doctor', 'patient'],
  nutrition: ['admin', 'doctor', 'patient', 'nutritionist'],
  yoga: ['admin', 'doctor', 'patient', 'yoga_instructor'],
  access: ['admin'],
};

export const MODULE_LABELS: Record<ModuleKey, string> = {
  dashboard: 'Dashboard',
  patients: 'Patient Profiles',
  myProfile: 'My Profile',
  history: 'Medical History',
  reports: 'Medical Reports',
  consultations: 'Consultations',
  nutrition: 'Nutrition Plans',
  yoga: 'Yoga & Wellness',
  access: 'Access Control',
};

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'layout', roles: PERMISSIONS.dashboard },
  { path: '/patients', label: 'Patient Profiles', icon: 'users', roles: PERMISSIONS.patients },
  { path: '/me', label: 'My Profile', icon: 'user', roles: PERMISSIONS.myProfile },
  { path: '/history', label: 'Medical History', icon: 'history', roles: PERMISSIONS.history },
  { path: '/reports', label: 'Medical Reports', icon: 'file', roles: PERMISSIONS.reports },
  { path: '/consultations', label: 'Consultations', icon: 'stethoscope', roles: PERMISSIONS.consultations },
  { path: '/nutrition', label: 'Nutrition Plans', icon: 'apple', roles: PERMISSIONS.nutrition },
  { path: '/yoga', label: 'Yoga & Wellness', icon: 'lotus', roles: PERMISSIONS.yoga },
  { path: '/access', label: 'Access Control', icon: 'shield', roles: PERMISSIONS.access },
];
