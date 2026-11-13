/**
 * Small presentation helpers shared across module pages.
 */
import { PATIENTS } from '../data/dummy';
import type { Patient } from '../types';

export function getPatient(id: string): Patient | undefined {
  return PATIENTS.find((p) => p.id === id);
}

export function patientName(id: string): string {
  return getPatient(id)?.name ?? 'Unknown patient';
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function bmi(heightCm: number, weightKg: number): string {
  const m = heightCm / 100;
  return (weightKg / (m * m)).toFixed(1);
}

export function statusTone(status: string): 'ok' | 'warn' | 'danger' | 'muted' {
  const s = status.toLowerCase();
  if (['active', 'ready', 'reviewed', 'completed', 'ok'].includes(s)) return 'ok';
  if (['pending', 'scheduled', 'draft', 'moderate'].includes(s)) return 'warn';
  if (['critical', 'cancelled', 'high', 'inactive'].includes(s)) return 'danger';
  return 'muted';
}
