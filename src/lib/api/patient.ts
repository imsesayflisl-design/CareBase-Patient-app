import { apiRequest } from '@/lib/api/client';
import type {
  Appointment,
  BedAvailability,
  BedRequest,
  Doctor,
  HealthReading,
  Hospital,
  HospitalNotice,
  MedicineAvailability,
  MedicalRecordSummary,
  NotificationItem,
  PatientProfile,
  PaymentTransaction,
  Pharmacy,
  Prescription,
  ScanBooking,
  ScanService,
} from '@/types';

export type CompleteProfileInput = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  country: string;
  city: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
};

export const patientApi = {
  me: (token: string) => apiRequest<PatientProfile>('/v1/patients/me', { token }),

  completeProfile: (token: string, body: CompleteProfileInput) =>
    apiRequest<PatientProfile>('/v1/patients/me', { method: 'PUT', token, body }),

  updateProfile: (token: string, body: Partial<CompleteProfileInput>) =>
    apiRequest<PatientProfile>('/v1/patients/me', { method: 'PATCH', token, body }),

  search: (token: string, q: string) =>
    apiRequest<{
      hospitals: Hospital[];
      doctors: Doctor[];
      pharmacies: Pharmacy[];
      medicines: MedicineAvailability[];
      scans: ScanService[];
    }>(`/v1/search?q=${encodeURIComponent(q)}`, { token }),

  hospitals: (token: string, params?: { q?: string; lat?: number; lng?: number }) => {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.lat != null) query.set('lat', String(params.lat));
    if (params?.lng != null) query.set('lng', String(params.lng));
    const qs = query.toString();
    return apiRequest<Hospital[]>(`/v1/hospitals${qs ? `?${qs}` : ''}`, { token });
  },

  hospital: (token: string, id: string) =>
    apiRequest<Hospital & { departments: { id: string; name: string }[]; notices: HospitalNotice[] }>(
      `/v1/hospitals/${id}`,
      { token },
    ),

  doctors: (token: string, params?: { q?: string; hospitalId?: string; specialty?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.hospitalId) query.set('hospitalId', params.hospitalId);
    if (params?.specialty) query.set('specialty', params.specialty);
    const qs = query.toString();
    return apiRequest<Doctor[]>(`/v1/doctors${qs ? `?${qs}` : ''}`, { token });
  },

  doctor: (token: string, id: string) => apiRequest<Doctor>(`/v1/doctors/${id}`, { token }),

  doctorSlots: (token: string, doctorId: string, date: string) =>
    apiRequest<{ id: string; startsAt: string; endsAt: string; available: boolean }[]>(
      `/v1/doctors/${doctorId}/slots?date=${encodeURIComponent(date)}`,
      { token },
    ),

  appointments: (token: string) => apiRequest<Appointment[]>('/v1/appointments', { token }),

  appointment: (token: string, id: string) =>
    apiRequest<Appointment>(`/v1/appointments/${id}`, { token }),

  createAppointment: (
    token: string,
    body: {
      hospitalId: string;
      doctorId: string;
      slotId: string;
      visitType: string;
      reason?: string;
      notes?: string;
    },
  ) => apiRequest<Appointment>('/v1/appointments', { method: 'POST', token, body }),

  cancelAppointment: (token: string, id: string) =>
    apiRequest<Appointment>(`/v1/appointments/${id}/cancel`, { method: 'POST', token }),

  rescheduleAppointment: (token: string, id: string, slotId: string) =>
    apiRequest<Appointment>(`/v1/appointments/${id}/reschedule`, {
      method: 'POST',
      token,
      body: { slotId },
    }),

  pharmacies: (
    token: string,
    params?: { lat?: number; lng?: number; radiusKm?: number; q?: string; openNow?: boolean },
  ) => {
    const query = new URLSearchParams();
    if (params?.lat != null) query.set('lat', String(params.lat));
    if (params?.lng != null) query.set('lng', String(params.lng));
    if (params?.radiusKm != null) query.set('radiusKm', String(params.radiusKm));
    if (params?.q) query.set('q', params.q);
    if (params?.openNow) query.set('openNow', 'true');
    const qs = query.toString();
    return apiRequest<Pharmacy[]>(`/v1/pharmacies${qs ? `?${qs}` : ''}`, { token });
  },

  pharmacy: (token: string, id: string) => apiRequest<Pharmacy>(`/v1/pharmacies/${id}`, { token }),

  medicines: (token: string, q: string, params?: { lat?: number; lng?: number }) => {
    const query = new URLSearchParams({ q });
    if (params?.lat != null) query.set('lat', String(params.lat));
    if (params?.lng != null) query.set('lng', String(params.lng));
    return apiRequest<MedicineAvailability[]>(`/v1/medicines/search?${query}`, { token });
  },

  scans: (token: string, params?: { q?: string; hospitalId?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.hospitalId) query.set('hospitalId', params.hospitalId);
    const qs = query.toString();
    return apiRequest<ScanService[]>(`/v1/scans${qs ? `?${qs}` : ''}`, { token });
  },

  scanBookings: (token: string) => apiRequest<ScanBooking[]>('/v1/scan-bookings', { token }),

  createScanBooking: (
    token: string,
    body: {
      scanServiceId: string;
      scheduledAt: string;
      homeService?: boolean;
    },
  ) => apiRequest<ScanBooking>('/v1/scan-bookings', { method: 'POST', token, body }),

  beds: (token: string, params?: { lat?: number; lng?: number }) => {
    const query = new URLSearchParams();
    if (params?.lat != null) query.set('lat', String(params.lat));
    if (params?.lng != null) query.set('lng', String(params.lng));
    const qs = query.toString();
    return apiRequest<BedAvailability[]>(`/v1/beds${qs ? `?${qs}` : ''}`, { token });
  },

  bedRequests: (token: string) => apiRequest<BedRequest[]>('/v1/bed-requests', { token }),

  createBedRequest: (
    token: string,
    body: {
      hospitalId: string;
      bedType: string;
      ward?: string;
      requestedArrival: string;
      notes?: string;
    },
  ) => apiRequest<BedRequest>('/v1/bed-requests', { method: 'POST', token, body }),

  records: (token: string) => apiRequest<MedicalRecordSummary[]>('/v1/records', { token }),

  prescriptions: (token: string) => apiRequest<Prescription[]>('/v1/prescriptions', { token }),

  healthReadings: (token: string) => apiRequest<HealthReading[]>('/v1/health-readings', { token }),

  createHealthReading: (
    token: string,
    body: {
      type: HealthReading['type'];
      value: string;
      unit: string;
      recordedAt: string;
      notes?: string;
    },
  ) => apiRequest<HealthReading>('/v1/health-readings', { method: 'POST', token, body }),

  notifications: (token: string) => apiRequest<NotificationItem[]>('/v1/notifications', { token }),

  markNotificationRead: (token: string, id: string) =>
    apiRequest<NotificationItem>(`/v1/notifications/${id}/read`, { method: 'POST', token }),

  payments: (token: string) => apiRequest<PaymentTransaction[]>('/v1/payments', { token }),

  notices: (token: string) => apiRequest<HospitalNotice[]>('/v1/notices', { token }),
};
