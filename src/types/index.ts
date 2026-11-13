/**
 * Shared domain types for Meridian Care.
 * Static-only demo — shapes mirror a real healthcare SaaS data model.
 */

export type Role =
  | 'admin'
  | 'doctor'
  | 'patient'
  | 'nutritionist'
  | 'yoga_instructor';

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
  status: 'Active' | 'Inactive' | 'Critical';
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
  type: 'Diagnosis' | 'Procedure' | 'Allergy' | 'Immunization' | 'Chronic';
  title: string;
  description: string;
  clinician: string;
  severity?: 'Low' | 'Moderate' | 'High';
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  category: 'Lab' | 'Imaging' | 'Pathology' | 'Cardiology' | 'Other';
  date: string;
  orderedBy: string;
  status: 'Ready' | 'Pending' | 'Reviewed';
  summary: string;
  fileLabel: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctor: string;
  date: string;
  time: string;
  type: 'In-Person' | 'Telehealth' | 'Follow-up';
  department: string;
  reason: string;
  notes: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
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
  status: 'Active' | 'Completed' | 'Draft';
}

export interface YogaSession {
  id: string;
  patientId: string;
  date: string;
  style: string;
  instructor: string;
  durationMin: number;
  intensity: 'Gentle' | 'Moderate' | 'Advanced';
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
