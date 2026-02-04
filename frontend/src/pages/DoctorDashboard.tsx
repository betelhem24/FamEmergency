import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AlertTriangle, ShieldCheck, QrCode, Search, X, Stethoscope, Phone, MessageCircle } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import type { MedicalProfile } from '../types';

// Fix Leaflet Icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DoctorDashboard: React.FC = () => {
    const { token } = useAuth();
    const [view, setView] = useState<'dashboard' | 'scanner' | 'profile'>('dashboard');
    const [activeScan, setActiveScan] = useState(false);
    const [scannedId, setScannedId] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Patient Profile State
    const [currentPatient, setCurrentPatient] = useState<any>(null);
    const [medicalRecord, setMedicalRecord] = useState<MedicalProfile | null>(null);
    const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

    // Mock Dashboard Data
    const [patients] = useState([
        { id: '1', name: 'John Doe', status: 'CRITICAL', location: [51.505, -0.09], bpm: 145, spo2: 88, condition: 'Cardiac Arrest' },
        { id: '2', name: 'Jane Smith', status: 'STABLE', location: [51.51, -0.1], bpm: 72, spo2: 98, condition: 'Routine Checkup' },
    ]);
    const [alerts, setAlerts] = useState<{ id: number; msg: string; time: string }[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlerts(prev => [{ id: Date.now(), msg: 'CRITICAL ALERT: John Doe - BPM > 140', time: new Date().toLocaleTimeString() }, ...prev]);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const fetchPatientData = async (id: string) => {
        setLoadingProfile(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/medical/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setMedicalRecord(data.data);
                try {
                    const famRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/family/user/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const famData = await famRes.json();
                    if (famData.success) {
                        setEmergencyContacts(famData.family);
                    }
                } catch (e) {
                    console.error("Family fetch error", e);
                }
                setCurrentPatient({ id, name: data.data.name || "Verified Patient", email: data.data.email });
                setView('profile');
            } else {
                alert('Patient record not found');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to fetch record');
        } finally {
            setLoadingProfile(false);
            setActiveScan(false);
        }
    };

    const handleScan = (result: any) => {
        if (result) {
            const raw = result[0]?.rawValue;
            if (!raw) return;
            let id = raw;
            try {
                const parsed = JSON.parse(raw);
                if (parsed.id) id = parsed.id;
            } catch (e) { }
            setScannedId(id);
            fetchPatientData(id);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] p-6 text-slate-200">
            {/* Command Header */}
            <header className="flex justify-between items-center mb-6 glass-nav p-4 rounded-xl border-t-2 border-cyan-neon">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8 text-cyan-neon animate-pulse-slow" />
                    <div>
                        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-white">
                            TRIAGE COMMAND CENTER
                        </h1>
                        <p className="text-xs font-mono text-cyan-neon/60 tracking-[0.2em]">SECTOR: ALPHA-1 // OVERWATCH ACTIVE</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => { setView('dashboard'); setActiveScan(false); }}
                        className={`text-sm py-2 px-4 rounded-lg font-bold transition-all ${view === 'dashboard' ? 'bg-cyan-neon text-black' : 'hover:bg-cyan-500/20'}`}
                    >
                        DASHBOARD
                    </button>
                    <button
                        onClick={() => { setView('scanner'); setActiveScan(true); }}
                        className={`text-sm py-2 px-4 rounded-lg font-bold transition-all border border-cyan-neon/30 flex items-center gap-2 ${view === 'scanner' ? 'bg-cyan-500/10 text-cyan-neon' : 'hover:bg-cyan-500/10'}`}
                    >
                        <QrCode size={16} /> SCAN PATIENT
                    </button>
                </div>
            </header>

            <div className="h-[calc(100vh-140px)] relative">
                {view === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        <div className="lg:col-span-2 glass-panel p-1 rounded-xl overflow-hidden border border-cyan-neon/30 relative">
                            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%', background: '#020617' }}>
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
                                    attribution='&copy; Google Maps'
                                />
                                {patients.map(p => (
                                    <Marker key={p.id} position={p.location as [number, number]}>
                                        <Popup className="glass-popup bg-navy-deep text-white border-none">
                                            <div className="p-2">
                                                <strong className="text-cyan-neon block mb-1">{p.name}</strong>
                                                <span className="text-xs font-mono">{p.status}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="glass-panel p-4 flex-1">
                                <h3 className="text-sm font-bold text-red-500 flex items-center gap-2 mb-4 uppercase tracking-wider">
                                    <AlertTriangle className="w-4 h-4 animate-bounce" /> Critical Feed
                                </h3>
                                <div className="space-y-3">
                                    {alerts.map(alert => (
                                        <div key={alert.id} className="p-3 bg-red-500/10 border-l-4 border-red-500 rounded-r">
                                            <div className="text-xs font-mono text-slate-400">{alert.time}</div>
                                            <div className="text-sm font-bold text-white uppercase tracking-tight italic">{alert.msg}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'scanner' && (
                    <div className="flex flex-col items-center justify-center h-full glass-panel p-10 animate-in zoom-in-95">
                        <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-widest">Identify Patient</h2>
                        <div className="w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden border-2 border-cyan-neon relative shadow-neon-cyan">
                            {activeScan && (
                                <Scanner
                                    onScan={handleScan}
                                    styles={{ container: { width: '100%', height: '100%' } }}
                                />
                            )}
                            <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-neon" />
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-neon" />
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-neon" />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-neon" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-4 w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Manual Patient ID Entry"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-neon outline-none"
                                value={scannedId}
                                onChange={(e) => setScannedId(e.target.value)}
                            />
                            <button
                                onClick={() => fetchPatientData(scannedId)}
                                className="bg-cyan-neon text-black font-bold px-6 rounded-xl hover:bg-cyan-neon/80"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {loadingProfile ? (
                    <div className="flex items-center justify-center h-full text-cyan-neon font-mono animate-pulse">
                        ACCESSING DEEP STORAGE...
                    </div>
                ) : (view === 'profile' && medicalRecord && (
                    <div className="h-full glass-panel p-8 overflow-y-auto animate-in slide-in-from-bottom duration-500">
                        <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                            <div className="flex gap-6">
                                <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center border-2 border-cyan-neon text-cyan-neon">
                                    <Stethoscope size={40} />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{currentPatient?.name}</h2>
                                    <p className="text-cyan-neon font-mono mt-2 tracking-widest text-xs opacity-50">ID: {currentPatient?.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setView('dashboard')} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Core Medical Data</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                            <label className="text-[10px] text-cyan-neon/50 block mb-1 uppercase font-black">Blood Type</label>
                                            <p className="text-xl font-black text-white">{medicalRecord.bloodType}</p>
                                        </div>
                                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                            <label className="text-[10px] text-cyan-neon/50 block mb-1 uppercase font-black">Weight</label>
                                            <p className="text-xl font-black text-white">{medicalRecord.weight} kg</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Known Allergies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {medicalRecord.allergies.map((a, i) => (
                                            <span key={i} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 text-xs font-black uppercase italic">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Emergency Family Contacts</h3>
                                    <div className="space-y-3">
                                        {emergencyContacts.length === 0 ? (
                                            <p className="text-[10px] text-slate-500 uppercase italic">No linked guardians detected</p>
                                        ) : emergencyContacts.map((member: any) => (
                                            <div key={member._id} className="bg-black/40 border border-emerald-500/20 rounded-2xl p-5 flex justify-between items-center shadow-2xl">
                                                <div>
                                                    <p className="text-white font-black text-sm uppercase italic tracking-tighter">{member.familyMemberId.name}</p>
                                                    <p className="text-[9px] text-emerald-500 uppercase font-black tracking-[0.2em] mt-1">{member.relationship}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <a
                                                        href={`tel:${member.familyMemberId.phoneNumber}`}
                                                        className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-black transition-all"
                                                    >
                                                        <Phone size={16} />
                                                    </a>
                                                    <a
                                                        href={`sms:${member.familyMemberId.phoneNumber}`}
                                                        className="p-3 bg-cyan-500/20 text-cyan-neon rounded-xl hover:bg-cyan-neon hover:text-black transition-all"
                                                    >
                                                        <MessageCircle size={16} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorDashboard;
