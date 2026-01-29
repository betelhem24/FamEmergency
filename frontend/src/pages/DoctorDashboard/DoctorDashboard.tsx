import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { DoctorScanner } from './components/DoctorScanner';
import { PatientAlerts } from './components/PatientAlerts';
import { Crosshair, LogOut, Scan, Radio } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'scanner' | 'alerts'>('scanner');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Doctor Header */}
      <nav className="sticky top-0 z-[100] border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="px-6 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-medical-navy rounded-2xl shadow-xl shadow-medical-navy/20">
              <Crosshair className="text-medical-cyan w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black italic text-medical-navy leading-none tracking-tighter">
                DOCTOR_PORTAL
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 text-nowrap">
                Response Management System
              </span>
            </div>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span>Secure Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 flex items-center justify-center gap-4 py-8 rounded-[2rem] border-2 transition-all duration-300
              ${activeTab === 'scanner'
                ? 'bg-medical-navy text-white border-medical-navy shadow-2xl scale-105'
                : 'bg-white text-slate-400 border-slate-100 hover:border-medical-cyan/30 shadow-lg'}`}
          >
            <Scan size={32} strokeWidth={activeTab === 'scanner' ? 3 : 2} />
            <div className="text-left">
              <div className="text-sm font-black uppercase tracking-widest">Client Identity Scan</div>
              <div className="text-[10px] opacity-60 font-medium italic">Initialize Medical Triage</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 flex items-center justify-center gap-4 py-8 rounded-[2rem] border-2 transition-all duration-300
              ${activeTab === 'alerts'
                ? 'bg-medical-navy text-white border-medical-navy shadow-2xl scale-105'
                : 'bg-white text-slate-400 border-slate-100 hover:border-medical-cyan/30 shadow-lg'}`}
          >
            <Radio size={32} strokeWidth={activeTab === 'alerts' ? 3 : 2} className={activeTab === 'alerts' ? 'animate-pulse' : ''} />
            <div className="text-left">
              <div className="text-sm font-black uppercase tracking-widest">Active Distress Signals</div>
              <div className="text-[10px] opacity-60 font-medium italic">Monitor Regional Status</div>
            </div>
          </button>
        </div>

        <div className="transition-all duration-500">
          {activeTab === 'scanner' ? <DoctorScanner /> : <PatientAlerts />}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;