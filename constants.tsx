
import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Pill, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  Cpu,
  GitBranch
} from 'lucide-react';

export const COLORS = {
  primary: 'indigo-600',
  secondary: 'teal-500',
  accent: 'rose-400',
  bg: 'slate-50',
  sidebar: 'slate-900'
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'DOCTOR', 'PATIENT', 'NURSE'] },
  { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
  { id: 'patients', label: 'Patients', icon: <Users size={20} />, roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  { id: 'attendance', label: 'Attendance', icon: <UserCheck size={20} />, roles: ['ADMIN'] },
  { id: 'records', label: 'Medical Records', icon: <FileText size={20} />, roles: ['ADMIN', 'DOCTOR', 'PATIENT', 'NURSE'] },
  { id: 'pharmacy', label: 'Pharmacy', icon: <Pill size={20} />, roles: ['ADMIN', 'PATIENT', 'NURSE'] },
  { id: 'system', label: 'System', icon: <Cpu size={20} />, roles: ['ADMIN'] },
];

export const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

export const STATUS_ICONS = {
  Pending: <Clock size={16} />,
  Confirmed: <CheckCircle2 size={16} />,
  Completed: <CheckCircle2 size={16} />,
  Cancelled: <XCircle size={16} />,
};
