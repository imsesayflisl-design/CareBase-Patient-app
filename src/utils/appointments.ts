import type { Appointment, AppointmentStatus } from '@/types';

export type AppointmentGroup = 'upcoming' | 'pending' | 'past' | 'cancelled';

export const APPOINTMENT_GROUPS: { key: AppointmentGroup; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'pending', label: 'Pending' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

/**
 * Groups an appointment from backend-authoritative status.
 * A request is never treated as confirmed here — it stays "pending" until the
 * hospital confirms it.
 */
export function groupAppointment(
  appointment: Pick<Appointment, 'status' | 'startsAt'>,
  now: Date = new Date(),
): AppointmentGroup {
  switch (appointment.status) {
    case 'pending':
    case 'reschedule_requested':
      return 'pending';
    case 'cancelled':
    case 'rejected':
      return 'cancelled';
    case 'completed':
      return 'past';
    case 'confirmed':
    default: {
      const startsAt = new Date(appointment.startsAt).getTime();
      return startsAt < now.getTime() ? 'past' : 'upcoming';
    }
  }
}

export function groupAppointments(
  appointments: Appointment[],
  now: Date = new Date(),
): Record<AppointmentGroup, Appointment[]> {
  const grouped: Record<AppointmentGroup, Appointment[]> = {
    upcoming: [],
    pending: [],
    past: [],
    cancelled: [],
  };

  for (const appointment of appointments) {
    grouped[groupAppointment(appointment, now)].push(appointment);
  }

  const ascending = (a: Appointment, b: Appointment) =>
    new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  const descending = (a: Appointment, b: Appointment) =>
    new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();

  grouped.upcoming.sort(ascending);
  grouped.pending.sort(ascending);
  grouped.past.sort(descending);
  grouped.cancelled.sort(descending);

  return grouped;
}

export function nextUpcomingAppointment(
  appointments: Appointment[],
  now: Date = new Date(),
): Appointment | null {
  return groupAppointments(appointments, now).upcoming[0] ?? null;
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'primary';

export function statusTone(status: AppointmentStatus): BadgeTone {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
    case 'reschedule_requested':
      return 'warning';
    case 'cancelled':
    case 'rejected':
      return 'error';
    case 'completed':
      return 'info';
    default:
      return 'neutral';
  }
}

export function paymentTone(
  status: Appointment['paymentStatus'],
): BadgeTone {
  switch (status) {
    case 'succeeded':
      return 'success';
    case 'pending':
    case 'processing':
      return 'warning';
    case 'failed':
      return 'error';
    case 'refunded':
      return 'info';
    default:
      return 'neutral';
  }
}

export function appointmentFeeLabel(appointment: Appointment): string | null {
  if (appointment.fee == null) return null;
  const currency = appointment.currency ? `${appointment.currency} ` : '';
  return `${currency}${appointment.fee.toFixed(2)}`;
}
