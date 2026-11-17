import type { User } from '@/types';

export const DEMO_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Aisha Rahman',
    email: 'admin@meridian.care',
    role: 'admin',
    avatar: 'AR',
    specialty: 'Platform Operations',
  },
  {
    id: 'u-doctor',
    name: 'Dr. Elias Vance',
    email: 'doctor@meridian.care',
    role: 'doctor',
    avatar: 'EV',
    specialty: 'Internal Medicine',
  },
  {
    id: 'u-patient',
    name: 'Maya Chen',
    email: 'patient@meridian.care',
    role: 'patient',
    avatar: 'MC',
  },
  {
    id: 'u-nutrition',
    name: 'Sofia Alvarez',
    email: 'nutrition@meridian.care',
    role: 'nutritionist',
    avatar: 'SA',
    specialty: 'Clinical Nutrition',
  },
  {
    id: 'u-yoga',
    name: 'Rohan Mehta',
    email: 'yoga@meridian.care',
    role: 'yoga_instructor',
    avatar: 'RM',
    specialty: 'Therapeutic Yoga',
  },
];

export const LINKED_PATIENT_ID = 'p-001';

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  doctor: 'Doctor',
  patient: 'Patient',
  nutritionist: 'Nutritionist',
  yoga_instructor: 'Yoga Instructor',
};
