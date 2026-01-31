import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { DoctorScanner } from './components/DoctorScanner';
import { PatientAlerts } from './components/PatientAlerts';
import { DoctorChat } from './components/DoctorChat';
import { Crosshair, LogOut, Scan, Radio, ClipboardList, ArrowRight, QrCode, MessageSquare } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'scanner' | 'alerts' | 'history' | 'chat'>('scanner');
  const [scanHistory, setScanHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('doctor_scan_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleNewScan = (patientData: any) => {
    const updatedHistory = [patientData, ...scanHistory.filter(p => p.id !== patientData.id)].slice(0, 10);
    setScanHistory(updatedHistory);
    localStorage.setItem('doctor_scan_history', JSON.stringify(updatedHistory));
  };

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
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105'
                : 'bg-white text-slate-400 border-slate-100 hover:border-life-cyan/30 shadow-lg'}`}
          >
            <Scan size={32} strokeWidth={activeTab === 'scanner' ? 3 : 2} />
            <div className="text-left">
              <div className="text-sm font-black uppercase tracking-widest">Client Identity Scan</div>
              <div className="text-[10px] opacity-60 font-medium italic">Initialize Medical Triage</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-4 py-8 rounded-[2rem] border-2 transition-all duration-300
              ${activeTab === 'history'
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105'
                : 'bg-white text-slate-400 border-slate-100 hover:border-life-cyan/30 shadow-lg'}`}
          >
            <ClipboardList size={32} strokeWidth={activeTab === 'history' ? 3 : 2} />
            <div className="text-left">
              <div className="text-sm font-black uppercase tracking-widest">Scan History</div>
              <div className="text-[10px] opacity-60 font-medium italic">Last 10 Patient Records</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 flex items-center justify-center gap-4 py-8 rounded-[2rem] border-2 transition-all duration-300
              ${activeTab === 'alerts'
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105'
                : 'bg-white text-slate-400 border-slate-100 hover:border-life-cyan/30 shadow-lg'}`}
          >
            <Radio size={32} strokeWidth={activeTab === 'alerts' ? 3 : 2} className={activeTab === 'alerts' ? 'animate-pulse' : ''} />
            <div className="text-left">
              <div className="text-sm font-black uppercase tracking-widest">Active SOS</div>
              <div className="text-[10px] opacity-60 font-medium italic">Monitor Regional Status</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-4 py-8 rounded-[2rem] border-2 transition-all duration-300
              ${activeTab === 'chat'
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105'
                : 'bg-white text-slate-400 border-slate-100 hover:border-life-cyan/30 shadow-lg'}`}
          >
            <MessageSquare size={32} strokeWidth={activeTab === 'chat' ? 3 : 2} />
            <div className="text-left">
              <div className="text-sm font-black uppercase tracking-widest">Chat & Status</div>
              <div className="text-[10px] opacity-60 font-medium italic">Private Patient Portal</div>
            </div>
          </button>
        </div>

        <div className="transition-all duration-500">
          {activeTab === 'scanner' && <DoctorScanner onScan={handleNewScan} />}
          {activeTab === 'alerts' && <PatientAlerts />}
          {activeTab === 'chat' && <DoctorChat />}
          {activeTab === 'history' && (
            <div className="glass-card p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl animate-in zoom-in duration-500">
              <h2 className="text-2xl font-black text-slate-900 italic mb-8 uppercase tracking-tighter">Historical Triage Feed</h2>
              <div className="space-y-4">
                {scanHistory.length === 0 ? (
                  <div className="py-20 text-center opacity-20">
                    <QrCode size={60} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">No Recent Scans Detected</p>
                  </div>
                ) : (
                  scanHistory.map((patient, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 border-l-4 border-l-life-cyan">
                      <div>
                        <h4 className="font-black text-slate-900 uppercase italic tracking-tight">{patient.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Scanned • UID: {patient.id?.slice(-6)}</p>
                      </div>
                      <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-life-cyan hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;