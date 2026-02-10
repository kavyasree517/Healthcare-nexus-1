import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  FileText, 
  Pill, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  ChevronRight,
  Stethoscope,
  Activity,
  UserCircle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  X,
  Heart,
  Droplet,
  TrendingUp,
  UserPlus,
  Package,
  ShieldCheck,
  Star,
  MapPin,
  Thermometer,
  Zap,
  Check,
  ClipboardCheck,
  UserX,
  UserCheck,
  Coffee,
  CalendarPlus,
  ArrowRight,
  Award,
  Clipboard,
  Sparkles,
  SearchCheck,
  ScanText,
  History,
  PlusCircle,
  Stethoscope as DoctorIcon,
  BriefcaseMedical,
  Menu,
  ChevronLeft,
  Cpu,
  GitBranch,
  Github,
  CloudUpload,
  RefreshCw,
  HardDrive,
  Globe,
  Link,
  Terminal as TerminalIcon,
  Copy,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';

import { UserRole, Appointment, AppointmentStatus, Patient, Doctor, PharmacyItem, StaffAttendance, PatientHistoryEntry } from './types';
import { NAV_ITEMS, STATUS_STYLES } from './constants';

// --- DATASET (20+ RECORDS PER CATEGORY) ---
const INITIAL_PATIENTS: Patient[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: [
    'John Doe', 'Jane Smith', 'Robert Wilson', 'Emily Brown', 'Michael Chen', 
    'Sarah Miller', 'David Garcia', 'Lisa Taylor', 'James Rodriguez', 'Mary Anderson',
    'William Martinez', 'Patricia Jackson', 'Richard Thomas', 'Linda White', 'Joseph Harris',
    'Barbara Martin', 'Thomas Thompson', 'Susan Moore', 'Charles Young', 'Margaret King',
    'Kevin Hart', 'Angela Davis', 'Steven Wright', 'Michelle Lewis', 'Edward Clark'
  ][i % 25],
  email: `patient${i + 1}@nexus.med`,
  phone: `555-010${i + 10}`,
  medicalHistory: [
    'Hypertension, Sleep Apnea', 'Type 2 Diabetes', 'Persistent Asthma', 'Hypothyroidism', 
    'GERD', 'Chronic Migraine', 'Hyperlipidemia', 'Iron Deficiency Anemia', 'Acute Gout', 
    'Atopic Dermatitis', 'Stage 2 COPD', 'Osteoarthritis', 'Insomnia', 'Generalized Anxiety', 
    'Plaque Psoriasis', 'Annual Wellness', 'Metabolic Syndrome', 'Bipolar II', 'Glaucoma', 
    'Osteoporosis', 'Lumbar Strain', 'Rheumatoid Arthritis', 'Multiple Sclerosis', 'Celiac Disease', 'Sleep Apnea'
  ][i % 25],
  bloodGroup: ['O+', 'A-', 'B+', 'O-', 'AB+', 'A+', 'B-', 'AB-'][i % 8],
  lastVisit: `2024-01-${(i % 28) + 1}`.padStart(10, '0'),
  historyEntries: [
    { id: `h${i}a`, date: '2023-11-12', diagnosis: 'Routine Checkup', treatment: 'Maintenance med' },
    { id: `h${i}b`, date: '2023-09-15', diagnosis: 'Minor Viral Infection', treatment: 'Antivirals' }
  ]
}));

const INITIAL_DOCTORS: Doctor[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `d${i + 1}`,
  name: [
    'Dr. Sarah Connor', 'Dr. James Howlett', 'Dr. Emma Frost', 'Dr. Stephen Strange',
    'Dr. John Watson', 'Dr. Dana Scully', 'Dr. Gregory House', 'Dr. Meredith Grey',
    'Dr. Shaun Murphy', 'Dr. Derek Shepherd', 'Dr. Cristina Yang', 'Dr. Leonard McCoy',
    'Dr. Beverly Crusher', 'Dr. Perry Cox', 'Dr. John Dorian', 'Dr. Chris Turk',
    'Dr. Elliot Reid', 'Dr. Carla Espinosa', 'Dr. Robert Chase', 'Dr. Eric Foreman'
  ][i % 20],
  specialization: [
    'Cardiology', 'Orthopedics', 'Neurology', 'Surgery', 'Diagnosis', 'Pathology', 
    'Diagnostics', 'General Surgery', 'Pediatrics', 'Neurosurgery', 'Cardiothoracic',
    'Trauma', 'Gastroenterology', 'Internal Medicine', 'Family Medicine', 'Radiology',
    'Psychiatry', 'Dermatology', 'Oncology', 'Emergency Medicine'
  ][i % 20],
  email: `doctor${i + 1}@nexus.med`,
  licenseNumber: `MED-${10000 + i}`,
  availability: [['Mon', 'Wed', 'Fri'], ['Tue', 'Thu'], ['Mon', 'Tue'], ['Wed', 'Fri'], ['Sat', 'Sun']][i % 5],
  rating: Number((4.5 + Math.random() * 0.5).toFixed(1))
}));

const INITIAL_PHARMACY: PharmacyItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `ph${i + 1}`,
  name: [
    'Amoxicillin', 'Lisinopril', 'Paracetamol', 'Metformin', 'Atorvastatin', 
    'Omeprazole', 'Salbutamol', 'Levothyroxine', 'Amlodipine', 'Gabapentin',
    'Sertraline', 'Albuterol', 'Hydrochlorothiazide', 'Losartan', 'Azithromycin',
    'Simvastatin', 'Metoprolol', 'Pantoprazole', 'Prednisone', 'Warfarin',
    'Ibuprofen', 'Cetirizine', 'Clopidogrel', 'Furosemide', 'Montelukast'
  ][i % 25],
  stock: Math.floor(Math.random() * 500) + 20,
  price: Number((Math.random() * 50 + 5.5).toFixed(2)),
  category: ['Antibiotic', 'Blood Pressure', 'Analgesic', 'Diabetes', 'Cholesterol', 'Antacid', 'Inhaler', 'Thyroid'][i % 8]
}));

const INITIAL_ATTENDANCE: StaffAttendance[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `s${i + 1}`,
  name: [
    ...INITIAL_DOCTORS.map(d => d.name),
    'Nurse Clara Oswald', 'Nurse Martha Jones', 'Nurse Rose Tyler', 'Nurse Donna Noble', 
    'Nurse Amy Pond', 'Nurse Rory Williams', 'Nurse Peggy Carter', 'Staff Tony Stark', 
    'Staff Sam Wilson', 'Staff Peter Parker'
  ][i % 30],
  role: (i < 20 ? 'DOCTOR' : i < 26 ? 'NURSE' : 'STAFF'),
  status: (i % 7 === 0 ? 'ABSENT' : i % 10 === 0 ? 'ON_LEAVE' : 'PRESENT'),
  checkIn: '08:' + (i % 60).toString().padStart(2, '0') + ' AM',
  department: ['Cardiology', 'Orthopedics', 'General Ward', 'Neurology', 'Emergency', 'Diagnosis', 'Pharmacy', 'Surgery'][i % 8]
}));

const INITIAL_APPOINTMENTS: Appointment[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `a${i + 1}`,
  patientId: `p${(i % 25) + 1}`,
  doctorId: `d${(i % 20) + 1}`,
  patientName: INITIAL_PATIENTS[i % 25].name,
  doctorName: INITIAL_DOCTORS[i % 20].name,
  date: `2024-02-${(i % 28) + 1}`.padStart(10, '0'),
  time: `${(i % 12) + 1}:00 ${i % 2 === 0 ? 'AM' : 'PM'}`,
  status: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING, AppointmentStatus.COMPLETED][i % 3],
  reason: ['Routine Checkup', 'Follow-up Visit', 'Consultation', 'Lab Results Review', 'Prescription Refill', 'Post-Op Check'][i % 6]
}));

// --- HELPER COMPONENTS ---
const TypewriterText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 70);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return <span className={className}>{displayedText}</span>;
};

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className={`relative bg-white rounded-[40px] shadow-2xl w-full ${maxWidth} overflow-hidden flex flex-col`}>
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-500"><X size={20} /></button>
          </div>
          <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const StatCard = ({ title, value, change, icon: Icon, color, delay = 0 }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -5 }} className="glass p-8 rounded-[48px] relative group border border-white">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-5 rounded-[24px] ${color} bg-opacity-10`}><Icon size={24} className={color.replace('bg-', 'text-')} /></div>
      {change && <span className="text-[10px] font-black px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1"><TrendingUp size={12} /> {change}</span>}
    </div>
    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mb-1">{title}</h3>
    <p className="text-5xl font-black text-slate-900 tracking-tighter">{value}</p>
  </motion.div>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all border border-slate-200">
      {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Git Simulation States
  const [isGitSyncing, setIsGitSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [repoUrl, setRepoUrl] = useState('https://github.com/nexus-admin/healthcare-nexus.git');
  const [isRepoLinked, setIsRepoLinked] = useState(true);

  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [attendance, setAttendance] = useState<StaffAttendance[]>(INITIAL_ATTENDANCE);
  const [pharmacy, setPharmacy] = useState<PharmacyItem[]>(INITIAL_PHARMACY);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);
  
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [modalHistoryEntries, setModalHistoryEntries] = useState<PatientHistoryEntry[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (editingPatient) {
      setModalHistoryEntries(editingPatient.historyEntries || []);
    } else {
      setModalHistoryEntries([]);
    }
  }, [editingPatient, isPatientModalOpen]);

  const attendanceStats = useMemo(() => ({
    present: attendance.filter(s => s.status === 'PRESENT').length,
    absent: attendance.filter(s => s.status === 'ABSENT').length,
    leave: attendance.filter(s => s.status === 'ON_LEAVE').length,
  }), [attendance]);

  const allRecords = useMemo(() => {
    return patients.flatMap(p => (p.historyEntries || []).map(h => ({ ...h, patientName: p.name, patientId: p.id })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [patients]);

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase()));

  // CRUD Handlers
  const handleSavePatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newP: Patient = {
      id: editingPatient?.id || `p${Date.now()}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      bloodGroup: formData.get('blood') as string,
      medicalHistory: formData.get('history_summary') as string,
      lastVisit: new Date().toISOString().split('T')[0],
      historyEntries: modalHistoryEntries,
    };
    if (editingPatient) setPatients(patients.map(p => p.id === newP.id ? newP : p));
    else setPatients([newP, ...patients]);
    setIsPatientModalOpen(false);
    setEditingPatient(null);
  };

  const handleSaveAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pId = formData.get('patientId') as string;
    const dId = formData.get('doctorId') as string;
    const patient = patients.find(p => p.id === pId);
    const doctor = doctors.find(d => d.id === dId);
    
    const newApt: Appointment = {
      id: `a${Date.now()}`,
      patientId: pId,
      doctorId: dId,
      patientName: patient?.name || 'Unknown',
      doctorName: doctor?.name || 'Unknown',
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      status: formData.get('status') as AppointmentStatus,
      reason: formData.get('reason') as string,
    };
    setAppointments([newApt, ...appointments]);
    setIsAppointmentModalOpen(false);
  };

  const handleSavePharmacy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: PharmacyItem = {
      id: `ph${Date.now()}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      stock: parseInt(formData.get('stock') as string),
      price: parseFloat(formData.get('price') as string),
    };
    setPharmacy([newItem, ...pharmacy]);
    setIsPharmacyModalOpen(false);
  };

  const handleGitSync = () => {
    if (!isRepoLinked) return;
    setIsGitSyncing(true);
    setSyncStep(0);
    const intervals = [1000, 2000, 3500, 5000];
    intervals.forEach((time, i) => {
      setTimeout(() => {
        setSyncStep(i + 1);
        if (i === intervals.length - 1) {
          setTimeout(() => setIsGitSyncing(false), 2000);
        }
      }, time);
    });
  };

  const addHistoryEntry = () => {
    const newEntry: PatientHistoryEntry = {
      id: `h${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      treatment: ''
    };
    setModalHistoryEntries([newEntry, ...modalHistoryEntries]);
  };

  const updateHistoryEntry = (id: string, field: keyof PatientHistoryEntry, value: string) => {
    setModalHistoryEntries(modalHistoryEntries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const removeHistoryEntry = (id: string) => {
    setModalHistoryEntries(modalHistoryEntries.filter(entry => entry.id !== id));
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white flex-col gap-10 text-center p-10">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360], boxShadow: ["0 0 0px rgba(20,184,166,0)", "0 0 50px rgba(20,184,166,0.5)", "0 0 0px rgba(20,184,166,0)"] }} 
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} 
          className="p-8 bg-teal-500 rounded-[32px] shadow-2xl"
        >
          <Stethoscope size={72} />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-6xl font-black tracking-tighter"><TypewriterText text="Healthcare Nexus" /></h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[11px] animate-pulse">Establishing Secure Clinical Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-medical relative overflow-hidden">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-80 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-[100] shadow-2xl"
      >
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-900 text-slate-400 flex items-center justify-center rounded-r-2xl border-l border-white/10 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="p-10 flex flex-col flex-1">
          <div className="flex items-center gap-4 mb-10 group cursor-pointer">
            <motion.div whileHover={{ rotate: 180, scale: 1.1 }} className="p-4 bg-teal-500 rounded-[22px] shadow-xl shadow-teal-500/20"><Activity size={28} /></motion.div>
            <h1 className="text-3xl font-black tracking-tighter">Nexus</h1>
          </div>
          
          <div className="mb-10 p-1.5 bg-white/5 rounded-2xl grid grid-cols-2 gap-1.5 border border-white/10">
            {(['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'] as UserRole[]).map((r) => (
              <button 
                key={r} 
                onClick={() => { setRole(r); setActiveTab('dashboard'); }} 
                className={`py-2 rounded-xl text-[9px] font-black tracking-widest transition-all ${role === r ? 'bg-white text-slate-900 shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <nav className="space-y-3">
            {NAV_ITEMS.filter(item => item.roles.includes(role)).map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[28px] transition-all group ${activeTab === item.id ? 'bg-teal-500 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                <span className={`${activeTab === item.id ? 'text-white' : 'text-teal-500'}`}>{item.icon}</span>
                <span className="font-bold tracking-tight text-sm">{item.label}</span>
                {activeTab === item.id && <motion.div layoutId="active" className="ml-auto w-2 h-2 bg-white rounded-full" />}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-12 space-y-10">
          <div className="flex items-center gap-5 p-6 bg-white/5 rounded-[32px] border border-white/10">
            <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-black text-lg">{role[0]}</div>
            <div className="overflow-hidden"><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status: Active</p><p className="text-sm font-black truncate">{role}</p></div>
          </div>
          <button className="flex items-center gap-4 text-slate-500 hover:text-rose-400 transition-all font-black uppercase tracking-[0.3em] text-[10px] w-full px-2 group active:scale-95">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Exit System
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main 
        animate={{ marginLeft: isSidebarOpen ? 320 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 p-16 max-w-[1700px] mx-auto w-full min-h-screen"
      >
        <header className="flex justify-between items-end mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-end gap-8">
            <AnimatePresence>
              {!isSidebarOpen && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-5 bg-slate-900 text-white rounded-3xl shadow-xl hover:bg-teal-500 transition-all mb-1"
                >
                  <Menu size={24} />
                </motion.button>
              )}
            </AnimatePresence>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <p className="text-teal-600 font-black uppercase tracking-[0.5em] text-[10px]">Medical Cloud Interface</p>
              </div>
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <span className="text-slate-300 font-light">/ {role}</span>
              </h2>
            </div>
          </motion.div>

          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={24} />
              <input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                type="text" 
                placeholder="Global Scan..." 
                className="pl-16 pr-10 py-5 bg-white border border-slate-100 rounded-[32px] focus:outline-none focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 transition-all w-[400px] shadow-sm font-bold placeholder:text-slate-300" 
              />
            </div>
            <button className="p-5 bg-white rounded-full text-slate-400 hover:text-teal-500 shadow-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <StatCard title="Patient Registry" value={patients.length} change="+4.2%" icon={Users} color="bg-indigo-600" delay={0.1} />
                <StatCard title="Active Responders" value={attendanceStats.present} change="+12.0%" icon={UserCheck} color="bg-teal-500" delay={0.2} />
                <StatCard title="Open Slots" value={appointments.filter(a => a.status === AppointmentStatus.PENDING).length} icon={Calendar} color="bg-amber-500" delay={0.3} />
                <StatCard title="Secure Vaults" value={allRecords.length} change="Healthy" icon={FileText} color="bg-rose-500" delay={0.4} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="glass p-12 rounded-[64px] border border-white shadow-lg">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Intake Analytics</h3>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[{n:'Mon',c:45},{n:'Tue',c:52},{n:'Wed',c:48},{n:'Thu',c:70},{n:'Fri',c:42},{n:'Sat',c:22},{n:'Sun',c:15}]}>
                        <defs><linearGradient id="color" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/><stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:11, fontWeight:800}} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:11, fontWeight:800}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="c" stroke="#14b8a6" fillOpacity={1} fill="url(#color)" strokeWidth={6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-12 rounded-[64px] border border-white shadow-lg">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10">Urgent Pipeline</h3>
                  <div className="space-y-6 max-h-[350px] overflow-y-auto custom-scrollbar pr-4">
                    {appointments.slice(0, 10).map((apt, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.05 }}
                        key={apt.id} 
                        className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-white font-black shadow-lg">
                            <span className="text-[9px] opacity-60 uppercase">{apt.time.split(' ')[1]}</span>
                            <span className="text-xl leading-none">{apt.time.split(':')[0]}</span>
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg tracking-tight">{apt.patientName}</p>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{apt.reason}</p>
                          </div>
                        </div>
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-sm ${STATUS_STYLES[apt.status]}`}>{apt.status}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'system' && role === 'ADMIN' && (
            <motion.div key="system" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">System Infrastructure</h3>
                  <p className="text-sm font-bold text-slate-400">Environment Management & External Hub Configuration</p>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                    <HardDrive size={16} /> Nodes Operational
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Git Control Center */}
                <div className="lg:col-span-2 glass p-12 rounded-[64px] border border-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 group-hover:scale-110 transition-transform duration-700">
                    <Github size={200} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-12">
                      <div className="p-6 bg-slate-950 text-white rounded-[32px] shadow-2xl">
                        <GitBranch size={32} />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tight">Git Protocol Sync</h4>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Link: {isRepoLinked ? repoUrl.split('/').pop() : 'None'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                      <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 relative overflow-hidden">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Remote Hash</p>
                         <div className="flex items-center gap-3">
                            <ShieldCheck size={18} className="text-teal-500" />
                            <span className="text-md font-mono font-bold text-slate-700">7f2a8c1e4b9...</span>
                         </div>
                      </div>
                      <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deployment Stream</p>
                         <div className="flex items-center gap-3">
                            <Activity size={18} className="text-indigo-500" />
                            <span className="text-md font-bold text-slate-700">Main:Production</span>
                         </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isGitSyncing && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-12 space-y-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                             <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                <RefreshCw size={14} className="animate-spin" /> 
                                {['Verifying Integrity', 'Compiling Assets', 'Encrypting Payload', 'Broadcasting to Remote', 'Nexus Online'][syncStep]}
                             </p>
                             <p className="text-xs font-black text-slate-400">{syncStep * 25}%</p>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${syncStep * 25}%` }} className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      onClick={handleGitSync}
                      disabled={isGitSyncing || !isRepoLinked}
                      className="w-full py-10 bg-slate-950 text-white rounded-[48px] font-black uppercase tracking-[0.4em] shadow-4xl hover:bg-teal-600 transition-all flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30"
                    >
                      {isGitSyncing ? <RefreshCw size={24} className="animate-spin" /> : <CloudUpload size={24} />}
                      {isGitSyncing ? 'Synchronizing Cluster...' : 'Initiate Push Sequence'}
                    </button>
                  </div>
                </div>

                {/* Local Setup Instructions (Terminal Help) */}
                <div className="space-y-12">
                   <div className="glass p-10 rounded-[48px] border border-white shadow-lg bg-white group ring-4 ring-indigo-500/5 hover:ring-indigo-500/10 transition-all">
                      <div className="flex justify-between items-start mb-10">
                        <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                          <TerminalIcon size={18} className="text-indigo-600" /> CLI Setup Guide
                        </h5>
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 animate-pulse">
                           <Award size={18} />
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-900 mb-8 leading-tight">Run these commands in your <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4 decoration-2">Local Terminal</span> to link this code to your real repository.</p>
                      
                      <div className="space-y-4">
                         <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-[11px] text-slate-500 relative group/cmd hover:bg-white hover:border-indigo-100 transition-all">
                            <code>git init</code>
                            <CopyButton text="git init" />
                         </div>
                         <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-[11px] text-slate-500 relative group/cmd hover:bg-white hover:border-indigo-100 transition-all">
                            <code className="truncate block pr-12">git remote add origin {repoUrl}</code>
                            <CopyButton text={`git remote add origin ${repoUrl}`} />
                         </div>
                         <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-[11px] text-slate-500 relative group/cmd hover:bg-white hover:border-indigo-100 transition-all">
                            <code>git push -u origin main</code>
                            <CopyButton text="git push -u origin main" />
                         </div>
                      </div>
                      
                      <div className="mt-8 p-6 bg-amber-50 rounded-[32px] border border-amber-100">
                         <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-2 mb-2">
                           <Zap size={14} /> Quick Tip
                         </p>
                         <p className="text-[10px] font-bold text-amber-800 leading-relaxed">Ensure you have <span className="font-black">Git</span> installed and your SSH keys or Auth tokens configured on your machine before running these.</p>
                      </div>
                   </div>

                   <div className="glass p-10 rounded-[48px] border border-white shadow-lg">
                      <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] mb-8 flex items-center gap-3">
                        <Link size={18} className="text-teal-600" /> Remote Configuration
                      </h5>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-4">GitHub URL</label>
                          <input 
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/user/repo.git"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none"
                          />
                        </div>
                        <button 
                          onClick={() => setIsRepoLinked(!isRepoLinked)}
                          className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${isRepoLinked ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-teal-500 text-white hover:bg-teal-600 shadow-xl shadow-teal-500/10'}`}
                        >
                          {isRepoLinked ? 'Disconnect Current Hub' : 'Connect to Repository'}
                        </button>
                      </div>
                   </div>
                </div>
              </div>

              {/* Server Terminal (Nexus Logs) */}
              <div className="glass p-12 rounded-[64px] border border-white shadow-xl overflow-hidden relative">
                 <div className="absolute top-8 right-12 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-10 flex items-center gap-4">
                    <TerminalIcon size={24} className="text-slate-400" /> Nexus Operations Console
                 </h3>
                 <div className="bg-slate-950 p-10 rounded-[40px] font-mono text-sm space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar shadow-inner border border-white/5">
                    <p className="text-emerald-400/80">$ nexus-system --init --force</p>
                    <p className="text-slate-500">[SYSTEM] Core kernel synchronized successfully.</p>
                    {isRepoLinked ? (
                      <p className="text-indigo-400">[GIT] Remote verified: {repoUrl}</p>
                    ) : (
                      <p className="text-rose-400/80">[ERROR] Local environment is detached. Link a repository to continue.</p>
                    )}
                    <p className="text-slate-400">[NODE] Health metrics: 18 pods active, 0 failures.</p>
                    <p className="text-teal-400/80">[CRYPTO] RSA-4096 Keys updated for cluster 'nexus-01'.</p>
                    <p className="text-slate-500">[DB] Replication lag: 12ms. Status: Optimized.</p>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-black">nexus@admin:~$</span>
                      <div className="w-2.5 h-5 bg-teal-500 animate-pulse" />
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'patients' && (
            <motion.div key="pat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Registry</h3>
                  <p className="text-sm font-bold text-slate-400">Validated Subject Profiles: {patients.length}</p>
                </div>
                <button onClick={() => { setEditingPatient(null); setIsPatientModalOpen(true); }} className="px-10 py-5 bg-teal-500 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 shadow-2xl shadow-teal-500/20 hover:bg-teal-600 hover:-translate-y-1 transition-all active:scale-95">
                  <UserPlus size={20} /> New Registry Enrollment
                </button>
              </div>
              <div className="glass rounded-[56px] overflow-hidden border border-white shadow-xl">
                <div className="max-h-[700px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Identity</th>
                        <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Diagnostic Brief</th>
                        <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Class</th>
                        <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Governance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredPatients.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-12 py-10 flex items-center gap-8">
                            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-lg">{p.name[0]}</div>
                            <div><p className="font-black text-slate-900 text-lg tracking-tight">{p.name}</p><p className="text-xs font-bold text-slate-400 mt-1">{p.email}</p></div>
                          </td>
                          <td className="px-12 py-10"><p className="text-md font-black text-slate-700 leading-snug">{p.medicalHistory}</p><p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest flex items-center gap-2"><MapPin size={12} /> Contact Node: {p.phone}</p></td>
                          <td className="px-12 py-10"><span className="px-6 py-2.5 bg-rose-50 text-rose-600 rounded-[18px] font-black text-[11px] uppercase border border-rose-100 shadow-sm flex items-center gap-2 w-fit"><Droplet size={14} /> {p.bloodGroup}</span></td>
                          <td className="px-12 py-10">
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => { setEditingPatient(p); setIsPatientModalOpen(true); }} className="p-4 bg-white text-indigo-600 rounded-2xl shadow-md border border-slate-100 hover:bg-indigo-50 active:scale-90 transition-all"><Edit2 size={18}/></button>
                              <button className="p-4 bg-white text-rose-600 rounded-2xl shadow-md border border-slate-100 hover:bg-rose-50 active:scale-90 transition-all"><Trash2 size={18}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pharmacy' && (
            <motion.div key="pharma" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Pharmacy Assets</h3>
                  <p className="text-sm font-bold text-slate-400">Validated Inventory SKUs: {pharmacy.length}</p>
                </div>
                <button onClick={() => setIsPharmacyModalOpen(true)} className="px-10 py-5 bg-slate-950 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-teal-600 transition-all active:scale-95">
                  <PlusCircle size={20} className="mr-2" /> New Asset Entry
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {pharmacy.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: i * 0.05 }}
                    key={item.id} 
                    whileHover={{ y: -8 }} 
                    className="glass p-12 rounded-[56px] border border-white group relative shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-10">
                      <div className="p-6 bg-teal-50 text-teal-600 rounded-[32px] group-hover:scale-110 transition-transform"><Pill size={36}/></div>
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-sm ${item.stock < 100 ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>{item.stock < 100 ? 'Refill Critical' : 'Tier Optimal'}</span>
                    </div>
                    <h4 className="text-3xl font-black text-slate-950 mb-1 tracking-tight">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-12">{item.category}</p>
                    <div className="pt-10 border-t border-slate-50 flex justify-between items-end">
                      <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Stock</p><p className="text-4xl font-black text-slate-900 tracking-tighter">{item.stock}</p></div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Value</p>
                        <p className="text-3xl font-black text-teal-600 tracking-tighter">${item.price}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div key="apts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
               <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Diagnostic Pipeline</h3>
                  <p className="text-sm font-bold text-slate-400">Total Authorized Slots: {appointments.length}</p>
                </div>
                <button onClick={() => setIsAppointmentModalOpen(true)} className="px-10 py-5 bg-teal-500 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 shadow-2xl shadow-teal-500/20 hover:bg-teal-600 transition-all active:scale-95">
                  <CalendarPlus size={20} /> Schedule New Procedure
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8 max-h-[800px] overflow-y-auto custom-scrollbar pr-6">
                {appointments.map((apt, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    key={apt.id} 
                    className="glass p-10 rounded-[56px] flex items-center gap-12 border border-white hover:shadow-2xl transition-all group"
                  >
                    <div className="w-24 h-24 rounded-[36px] bg-slate-950 flex flex-col items-center justify-center text-white shadow-2xl group-hover:bg-teal-500 transition-all duration-500">
                      <span className="text-[11px] font-black uppercase opacity-60 tracking-[0.3em]">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-4xl font-black mt-1 leading-none">{apt.date.split('-')[2]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-6 mb-4">
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{apt.patientName}</h4>
                        <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-sm ${STATUS_STYLES[apt.status]}`}>{apt.status}</span>
                      </div>
                      <div className="flex items-center gap-10 text-slate-500 font-black text-sm">
                        <span className="flex items-center gap-3 bg-white/50 px-5 py-2.5 rounded-full border border-slate-100 shadow-sm"><UserCircle size={20} className="text-teal-500" /> Lead: {apt.doctorName}</span>
                        <span className="flex items-center gap-3 bg-white/50 px-5 py-2.5 rounded-full border border-slate-100 shadow-sm"><Clock size={20} className="text-indigo-500" /> Slot: {apt.time}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-400 mt-6 flex items-center gap-3 tracking-tight"><ScanText size={18} /> Objective: {apt.reason}</p>
                    </div>
                    <button className="p-6 bg-slate-50 rounded-[32px] text-slate-400 hover:text-teal-500 hover:bg-white hover:shadow-xl transition-all active:scale-90"><ChevronRight size={32} /></button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'records' && (
            <motion.div key="recs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
               <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Repository</h3>
                  <p className="text-sm font-bold text-slate-400">Authorized Historical Assets: {allRecords.length}</p>
                </div>
                <div className="px-8 py-4 bg-white rounded-full shadow-sm border border-slate-100 font-black text-[11px] uppercase tracking-widest text-teal-600 flex items-center gap-3">
                   <ClipboardCheck size={20} /> Archive Sync: Active
                </div>
              </div>
              <div className="grid grid-cols-1 gap-10 max-h-[800px] overflow-y-auto custom-scrollbar pr-6">
                {allRecords.map((rec, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: i * 0.04 }}
                    key={rec.id} 
                    className="glass p-12 rounded-[64px] flex items-center gap-12 border border-white hover:shadow-2xl transition-all group"
                  >
                    <div className="w-24 h-24 rounded-[36px] bg-indigo-600 flex flex-col items-center justify-center text-white shadow-2xl group-hover:bg-teal-500 transition-all duration-700">
                      <span className="text-[11px] font-black uppercase opacity-60 tracking-widest">{new Date(rec.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-4xl font-black mt-2 leading-none">{rec.date.split('-')[2]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-teal-600 uppercase tracking-[0.4em] mb-3">Diagnostic Entry / {rec.patientName}</p>
                      <h4 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{rec.diagnosis}</h4>
                      <div className="flex items-center gap-6 bg-slate-50/50 w-fit px-8 py-3 rounded-full border border-slate-100">
                         <Activity size={18} className="text-indigo-400" />
                         <span className="text-md font-black text-slate-600">Protocol: {rec.treatment}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                       <button className="p-6 bg-slate-950 text-white rounded-[28px] shadow-2xl hover:bg-teal-500 transition-all active:scale-90"><FileText size={28}/></button>
                       <button className="p-6 bg-rose-50 text-rose-600 rounded-[28px] shadow-lg hover:bg-rose-500 hover:text-white transition-all active:scale-90"><Trash2 size={28}/></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODALS --- */}
        {/* Patient Modal */}
        <Modal 
          isOpen={isPatientModalOpen} 
          onClose={() => setIsPatientModalOpen(false)} 
          title={editingPatient ? "Modify Profile Registry" : "New Patient Registry Enrollment"}
          maxWidth="max-w-5xl"
        >
           <form onSubmit={handleSavePatient} className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-teal-600 flex items-center gap-4">
                    <UserCircle size={20} /> Demographic Identification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Full Legal Identity</label>
                        <input defaultValue={editingPatient?.name || ''} name="name" placeholder="Johnathan Doe" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500/30 focus:bg-white transition-all outline-none placeholder:text-slate-300" required />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Comm Node (Email)</label>
                        <input defaultValue={editingPatient?.email || ''} name="email" type="email" placeholder="patient@example.med" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500/30 focus:bg-white transition-all outline-none placeholder:text-slate-300" required />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Contact Node</label>
                        <input defaultValue={editingPatient?.phone || ''} name="phone" placeholder="+1 (555) 000-0000" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500/30 focus:bg-white transition-all outline-none placeholder:text-slate-300" required />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Genetic Class</label>
                        <select defaultValue={editingPatient?.bloodGroup || 'O+'} name="blood" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-black border-2 border-transparent focus:border-teal-500/30 focus:bg-white transition-all outline-none appearance-none cursor-pointer">{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}</select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-8 tracking-widest">Chronic Diagnostics Archive</label>
                    <textarea defaultValue={editingPatient?.medicalHistory || ''} name="history_summary" placeholder="Summarize lifelong conditions, allergies, or systemic risks..." className="w-full px-8 py-6 bg-slate-50 rounded-[32px] font-bold border-2 border-transparent focus:border-teal-500/30 focus:bg-white transition-all outline-none resize-none min-h-[140px] placeholder:text-slate-300" required />
                  </div>
                </div>

                <div className="space-y-10">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-indigo-600 flex items-center gap-4">
                        <History size={20} /> Chronological Clinical Ledger
                      </h4>
                      <button type="button" onClick={addHistoryEntry} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                        <PlusCircle size={16} /> Add Encounter
                      </button>
                   </div>
                   
                   <div className="space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar pr-4">
                      {modalHistoryEntries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-300 border-2 border-dashed border-slate-100 rounded-[40px]">
                           <History size={40} strokeWidth={1} className="mb-4 opacity-30" />
                           <p className="font-black uppercase tracking-widest text-[10px]">No Archives Linked</p>
                        </div>
                      ) : (
                        modalHistoryEntries.map((entry) => (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={entry.id} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 relative group/entry">
                            <button type="button" onClick={() => removeHistoryEntry(entry.id)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors active:scale-90"><Trash2 size={18}/></button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">Encounter Date</label>
                                  <input type="date" value={entry.date} onChange={(e) => updateHistoryEntry(entry.id, 'date', e.target.value)} className="w-full px-5 py-3 bg-white rounded-2xl font-bold border border-slate-100 focus:border-indigo-500 outline-none" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">Diagnosis Tag</label>
                                  <input placeholder="e.g. Chronic Bronchitis" value={entry.diagnosis} onChange={(e) => updateHistoryEntry(entry.id, 'diagnosis', e.target.value)} className="w-full px-5 py-3 bg-white rounded-2xl font-bold border border-slate-100 focus:border-indigo-500 outline-none" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-slate-400 ml-4 tracking-widest">Intervention Protocol</label>
                               <textarea placeholder="Prescribed pharmaceutical or behavioral treatment..." value={entry.treatment} onChange={(e) => updateHistoryEntry(entry.id, 'treatment', e.target.value)} className="w-full px-5 py-3 bg-white rounded-2xl font-bold border border-slate-100 focus:border-indigo-500 outline-none resize-none min-h-[80px]" />
                            </div>
                          </motion.div>
                        ))
                      )}
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex gap-6">
                 <button type="submit" className="flex-1 py-8 bg-teal-500 text-white rounded-[40px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-teal-500/20 hover:bg-teal-600 transition-all text-xs flex items-center justify-center gap-6 active:scale-95">
                    <ScanText size={24} /> Commit Profile Archive
                 </button>
                 <button type="button" onClick={() => setIsPatientModalOpen(false)} className="px-10 py-8 bg-slate-100 text-slate-500 rounded-[40px] font-black uppercase tracking-[0.4em] hover:bg-slate-200 transition-all text-xs active:scale-95">
                    Cancel
                 </button>
              </div>
           </form>
        </Modal>

        {/* Appointment Modal */}
        <Modal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} title="Schedule New Clinical Encounter">
          <form onSubmit={handleSaveAppointment} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Link Patient Profile</label>
                <select name="patientId" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none appearance-none cursor-pointer" required>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Assign Practitioner</label>
                <select name="doctorId" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none appearance-none cursor-pointer" required>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Target Date</label>
                <input type="date" name="date" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none" required />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Time Slot</label>
                <input type="time" name="time" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none" required />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Encounter Objective</label>
              <textarea name="reason" placeholder="Detail symptoms or purpose..." className="w-full px-8 py-6 bg-slate-50 rounded-[32px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none resize-none min-h-[120px]" required />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Priority Status</label>
                <select name="status" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none appearance-none cursor-pointer">
                  {Object.values(AppointmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <button type="submit" className="w-full py-8 bg-teal-500 text-white rounded-[40px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-teal-600 transition-all active:scale-95">
              Confirm Pipeline Schedule
            </button>
          </form>
        </Modal>

        {/* Pharmacy Modal */}
        <Modal isOpen={isPharmacyModalOpen} onClose={() => setIsPharmacyModalOpen(false)} title="Register New Pharmaceutical Asset">
          <form onSubmit={handleSavePharmacy} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Medication Identifier</label>
                <input name="name" placeholder="Asset Name" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none" required />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Asset Category</label>
                <select name="category" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none cursor-pointer">
                  {['Antibiotic', 'Analgesic', 'Cardiac', 'Diabetes', 'Dermatology', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Reserve Level</label>
                <input type="number" name="stock" placeholder="e.g. 500" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none" required />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Unit Value ($)</label>
                <input type="number" step="0.01" name="price" placeholder="e.g. 19.99" className="w-full px-8 py-5 bg-slate-50 rounded-[24px] font-bold border-2 border-transparent focus:border-teal-500 focus:bg-white outline-none" required />
              </div>
            </div>
            <button type="submit" className="w-full py-8 bg-slate-900 text-white rounded-[40px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-teal-600 transition-all active:scale-95">
              Confirm Inventory Integration
            </button>
          </form>
        </Modal>

      </motion.main>
    </div>
  );
}
