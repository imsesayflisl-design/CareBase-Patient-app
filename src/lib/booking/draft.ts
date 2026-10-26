import { useSyncExternalStore } from 'react';

export type BookingHospital = {
  id: string;
  name: string;
  address?: string | null;
};

export type BookingDepartment = {
  id: string;
  name: string;
};

export type BookingDoctor = {
  id: string;
  fullName: string;
  specialty: string;
  hospitalName?: string | null;
  consultationFee?: number | null;
  currency?: string | null;
};

export type BookingSlot = {
  id: string;
  startsAt: string;
  endsAt?: string | null;
};

export type BookingDraft = {
  hospital: BookingHospital | null;
  department: BookingDepartment | null;
  doctor: BookingDoctor | null;
  slot: BookingSlot | null;
  visitType: string;
  reason: string;
  notes: string;
};

const EMPTY: BookingDraft = {
  hospital: null,
  department: null,
  doctor: null,
  slot: null,
  visitType: 'in_person',
  reason: '',
  notes: '',
};

let draft: BookingDraft = { ...EMPTY };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(partial: Partial<BookingDraft>) {
  draft = { ...draft, ...partial };
  emit();
}

/**
 * In-memory draft shared across the multi-step appointment booking flow.
 * Secrets and medical results are never stored here — only the selections the
 * patient is actively making.
 */
export const bookingDraftStore = {
  get: () => draft,
  setHospital: (hospital: BookingHospital | null) =>
    update({ hospital, department: null, doctor: null, slot: null }),
  setDepartment: (department: BookingDepartment | null) =>
    update({ department, doctor: null, slot: null }),
  setDoctor: (doctor: BookingDoctor | null) => update({ doctor, slot: null }),
  setSlot: (slot: BookingSlot | null) => update({ slot }),
  setVisitDetails: (details: Pick<BookingDraft, 'visitType' | 'reason' | 'notes'>) =>
    update(details),
  reset: () => {
    draft = { ...EMPTY };
    emit();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useBookingDraft(): BookingDraft {
  return useSyncExternalStore(bookingDraftStore.subscribe, bookingDraftStore.get, () => EMPTY);
}

export const VISIT_TYPES = [
  { value: 'in_person', label: 'In person' },
  { value: 'teleconsultation', label: 'Teleconsultation' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'walk_in', label: 'Walk-in' },
] as const;

export function visitTypeLabel(value: string): string {
  return VISIT_TYPES.find((type) => type.value === value)?.label ?? value;
}
