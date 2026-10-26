export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'reschedule_requested';

export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';

export type BedRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'reserved'
  | 'cancelled'
  | 'completed';

export type ScanBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'report_ready';

export type EmergencyRequestStatus =
  | 'requested'
  | 'received'
  | 'accepted'
  | 'responding'
  | 'completed'
  | 'cancelled';

export type Gender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say' | 'other';

export interface PatientProfile {
  id: string;
  patientId: string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  avatarUrl?: string | null;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  phone?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  distanceKm?: number | null;
  services: string[];
  openingHours?: string | null;
  hasEmergency: boolean;
  bedAvailabilitySummary?: string | null;
  isOpen?: boolean | null;
}

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  description?: string | null;
}

export interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  subSpecialty?: string | null;
  hospitalId: string;
  hospitalName?: string;
  departmentId?: string | null;
  departmentName?: string | null;
  photoUrl?: string | null;
  yearsExperience?: number | null;
  qualifications?: string | null;
  languages: string[];
  biography?: string | null;
  consultationFee?: number | null;
  currency?: string | null;
  available?: boolean | null;
}

export interface AppointmentSlot {
  id: string;
  doctorId?: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  reference: string;
  patientId: string;
  hospitalId: string;
  hospitalName: string;
  doctorId: string;
  doctorName: string;
  departmentName?: string | null;
  startsAt: string;
  endsAt?: string | null;
  visitType: string;
  reason?: string | null;
  notes?: string | null;
  status: AppointmentStatus;
  paymentStatus?: PaymentStatus | null;
  fee?: number | null;
  currency?: string | null;
  hospitalAddress?: string | null;
  hospitalPhone?: string | null;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  distanceKm?: number | null;
  isOpen?: boolean | null;
  openingHours?: string | null;
  deliveryAvailable?: boolean | null;
  services: string[];
}

export interface MedicineAvailability {
  id: string;
  medicineName: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  available: boolean;
  quantity?: number | null;
  price?: number | null;
  currency?: string | null;
  distanceKm?: number | null;
  updatedAt: string;
}

export interface ScanService {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  hospitalId: string;
  hospitalName: string;
  price?: number | null;
  currency?: string | null;
  preparationInstructions?: string | null;
  homeServiceAvailable: boolean;
}

export interface ScanBooking {
  id: string;
  reference: string;
  scanServiceId: string;
  scanName: string;
  hospitalId: string;
  hospitalName: string;
  scheduledAt: string;
  homeService: boolean;
  status: ScanBookingStatus;
  reportUrl?: string | null;
  fee?: number | null;
  currency?: string | null;
}

export interface BedAvailability {
  id: string;
  hospitalId: string;
  hospitalName: string;
  ward: string;
  bedType: string;
  availableCount: number;
  city: string;
}

export interface BedRequest {
  id: string;
  reference: string;
  hospitalId: string;
  hospitalName: string;
  bedType: string;
  ward?: string | null;
  requestedArrival: string;
  notes?: string | null;
  status: BedRequestStatus;
}

export interface MedicalRecordSummary {
  id: string;
  category:
    | 'history'
    | 'visit'
    | 'diagnosis'
    | 'test'
    | 'scan'
    | 'prescription'
    | 'document'
    | 'allergy';
  title: string;
  subtitle?: string | null;
  date: string;
  hospitalName?: string | null;
  status?: string | null;
}

export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  clinicianName: string;
  hospitalName: string;
  prescribedAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface HealthReading {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'weight' | 'temperature' | 'blood_glucose';
  value: string;
  unit: string;
  recordedAt: string;
  notes?: string | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category:
    | 'appointment'
    | 'scan'
    | 'bed'
    | 'payment'
    | 'prescription'
    | 'hospital'
    | 'emergency'
    | 'system';
  read: boolean;
  createdAt: string;
  resourceType?: string | null;
  resourceId?: string | null;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  reference: string;
  service: string;
  provider: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface HospitalNotice {
  id: string;
  hospitalId: string;
  hospitalName: string;
  title: string;
  body: string;
  publishedAt: string;
}

export interface ApiErrorBody {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export type IntegrationStatus = 'ready' | 'needs_config' | 'unavailable';

export interface FeatureFlags {
  clerk: IntegrationStatus;
  backend: IntegrationStatus;
  maps: IntegrationStatus;
  payments: IntegrationStatus;
  pushNotifications: IntegrationStatus;
  emergencyNumbers: IntegrationStatus;
}
