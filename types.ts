
export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'NURSE' | 'STAFF';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'ON_LEAVE';

export interface StaffAttendance {
  id: string;
  name: string;
  role: 'DOCTOR' | 'NURSE' | 'STAFF';
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  department: string;
  avatar?: string;
}

export interface PatientHistoryEntry {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  medicalHistory: string; // Summary of chronic conditions
  bloodGroup: string;
  lastVisit: string;
  diagnoses?: string;
  treatments?: string;
  allergies?: string;
  historyEntries?: PatientHistoryEntry[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  licenseNumber: string;
  availability: string[]; // ['Monday', 'Wednesday']
  rating: number;
}

export enum AppointmentStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescriptions: Prescription[];
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PharmacyItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  category: string;
}
