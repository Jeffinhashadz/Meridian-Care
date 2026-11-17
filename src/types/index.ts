/**
 * Domain types for Meridian — shared across data modules and features.
 */

export type Role =
  | 'admin'
  | 'doctor'
  | 'patient'
  | 'nutritionist'
  | 'yoga_instructor';

export type PatientStatus = 'Active' | 'Inactive' | 'Critical';
export type HistoryType = 'Diagnosis' | 'Procedure' | 'Allergy' | 'Immunization' | 'Chronic';
export type Severity = 'Low' | 'Moderate' | 'High';
export type ReportCategory = 'Lab' | 'Imaging' | 'Pathology' | 'Cardiology' | 'Other';
export type ReportStatus = 'Ready' | 'Pending' | 'Reviewed';
export type ConsultType = 'In-Person' | 'Telehealth' | 'Follow-up';
export type ConsultStatus = 'Completed' | 'Scheduled' | 'Cancelled';
export type PlanStatus = 'Active' | 'Completed' | 'Draft';
export type YogaIntensity = 'Gentle' | 'Moderate' | 'Advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  specialty?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  avatar: string;
  status: PatientStatus;
  primaryDoctor: string;
  lastVisit: string;
  conditions: string[];
  allergies: string[];
  heightCm: number;
  weightKg: number;
}

export interface MedicalHistoryEntry {
  id: string;
  patientId: string;
  date: string;
  type: HistoryType;
  title: string;
  description: string;
  clinician: string;
  severity?: Severity;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  category: ReportCategory;
  date: string;
  orderedBy: string;
  status: ReportStatus;
  summary: string;
  findings?: string;
  fileLabel: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctor: string;
  date: string;
  time: string;
  type: ConsultType;
  department: string;
  reason: string;
  notes: string;
  status: ConsultStatus;
  durationMin: number;
}

export interface NutritionPlan {
  id: string;
  patientId: string;
  title: string;
  nutritionist: string;
  startDate: string;
  goal: string;
  calories: number;
  macros: { protein: number; carbs: number; fats: number };
  meals: { name: string; time: string; items: string; calories: number }[];
  restrictions: string[];
  adherence: number;
  weeklyAdherence: number[];
  status: PlanStatus;
}

export interface YogaSession {
  id: string;
  patientId: string;
  date: string;
  style: string;
  instructor: string;
  durationMin: number;
  intensity: YogaIntensity;
  focus: string;
  moodBefore: number;
  moodAfter: number;
  notes: string;
}

export interface WellnessMetric {
  week: string;
  flexibility: number;
  strength: number;
  mindfulness: number;
  attendance: number;
}

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles: Role[];
}

export type ModuleKey =
  | 'dashboard'
  | 'patients'
  | 'myProfile'
  | 'history'
  | 'reports'
  | 'consultations'
  | 'nutrition'
  | 'yoga'
  | 'access';
