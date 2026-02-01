import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AlertTriangle, ShieldCheck, QrCode, Search, Save, X, Stethoscope } from 'lucide-react';
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
    const [currentPatient, setCurrentPatient] = useState<any>(null); // Details of user
    const [medicalRecord, setMedicalRecord] = useState<MedicalProfile | null>(null);

    // Mock Dashboard Data
    const [patients] = useState([
        { id: '1', name: 'John Doe', status: 'CRITICAL', location: [51.505, -0.09], bpm: 145, spo2: 88, condition: 'Cardiac Arrest' },
        { id: '2', name: 'Jane Smith', status: 'STABLE', location: [51.51, -0.1], bpm: 72, spo2: 98, condition: 'Routine Checkup' },
    ]);
    const [alerts, setAlerts] = useState<{ id: number; msg: string; time: string }[]>([]);

    useEffect(() => {
        // Simulate incoming alerts
        const timer = setTimeout(() => {
            setAlerts(prev => [{ id: Date.now(), msg: 'CRITICAL ALERT: John Doe - BPM > 140', time: new Date().toLocaleTimeString() }, ...prev]);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Fetch Patient Logic
    const fetchPatientData = async (id: string) => {
        setLoadingProfile(true);
        try {
            // In a real app, you'd likely fetch User profile AND Medical Record
            // For now, let's assume the QR code gives us the ID
            const res = await fetch(`/api/medical/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setMedicalRecord(data.data);
                // Mock user details since medical record might not have name if separate
                setCurrentPatient({ id, name: "Verified Patient", email: "patient@example.com" });
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
            try {
                // Expecting JSON from our QR code: { id, name ... }
                // or just a raw ID string
                const raw = result[0]?.rawValue;
                if (!raw) return;

                let id = raw;
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed.id) id = parsed.id;
                } catch (e) { /* Not JSON, treat as ID string */ }

                setScannedId(id);
                fetchPatientData(id);
            } catch (e) {
                console.error("Scan Error", e);
            }
        }
    };

    const handleSaveRecord = async () => {
        // Logic to save updated record
        alert("Record Update Simulation: Success. Changes synced to Medical Vault.");
    };

    return (
        <div className="min-h-screen bg-navy-deep bg-neural-grid p-6 text-slate-200">

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

            {/* MAIN CONTENT AREA */}
            <div className="h-[calc(100vh-140px)] relative">

                {/* VIEW: DASHBOARD */}
                {view === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {/* Map */}
                        <div className="lg:col-span-2 glass-panel p-1 rounded-xl overflow-hidden border border-cyan-neon/30 relative">
                            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%', background: '#020617' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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

                        {/* Feed */}
                        <div className="flex flex-col gap-6">
                            <div className="glass-panel p-4 flex-1">
                                <h3 className="text-sm font-bold text-alert-red flex items-center gap-2 mb-4 uppercase tracking-wider">
                                    <AlertTriangle className="w-4 h-4 animate-bounce" /> Critical Feed
                                </h3>
                                <div className="space-y-3">
                                    {alerts.map(alert => (
                                        <div key={alert.id} className="p-3 bg-alert-red/10 border-l-4 border-alert-red rounded-r">
                                            <div className="text-xs font-mono text-slate-400">{alert.time}</div>
                                            <div className="text-sm font-bold text-white">{alert.msg}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW: SCANNER */}
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
                                className="flex-1 bg-navy-light border border-glass-border rounded-xl px-4 py-3 text-white focus:border-cyan-neon outline-none"
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

                {/* VIEW: PATIENT PROFILE */}
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
                                    <h2 className="text-4xl font-black text-white uppercase italic">{currentPatient?.name || 'Unknown Patient'}</h2>
                                    <p className="text-cyan-neon font-mono mt-1">ID: {currentPatient?.id}</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="px-3 py-1 bg-alert-red/20 text-alert-red rounded text-xs font-bold uppercase border border-alert-red/30">Cardiac Risk: High</span>
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold uppercase border border-blue-500/30">Diabetic</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleSaveRecord} className="bg-success-green text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-success-green/80">
                                <Save size={18} /> Update Record
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-navy-light/50 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Core Vitals</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 block mb-1">Blood Type</label>
                                            <select
                                                className="w-full bg-navy-deep border border-glass-border rounded-lg p-3 text-white font-bold"
                                                defaultValue={medicalRecord.bloodType}
                                            >
                                                <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 block mb-1">Weight (kg)</label>
                                            <input type="text" defaultValue={medicalRecord.weight} className="w-full bg-navy-deep border border-glass-border rounded-lg p-3 text-white font-bold" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-navy-light/50 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Allergies</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {medicalRecord.allergies.map((a, i) => (
                                            <span key={i} className="bg-warning-amber/10 text-warning-amber px-3 py-1 rounded-lg border border-warning-amber/20 flex items-center gap-2">
                                                {a} <button className="hover:text-white"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                    <input type="text" placeholder="+ Add Allergy" className="w-full bg-navy-deep border border-glass-border rounded-lg p-3 text-white text-sm" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-navy-light/50 p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Current Medications</h3>
                                    <div className="space-y-3">
                                        {medicalRecord.medications.map((m, i) => (
                                            <div key={i} className="flex gap-3">
                                                <input type="text" defaultValue={m.name} className="flex-1 bg-navy-deep border border-glass-border rounded-lg p-3 text-white text-sm font-bold" />
                                                <input type="text" defaultValue={m.dosage} className="w-24 bg-navy-deep border border-glass-border rounded-lg p-3 text-white text-sm" />
                                            </div>
                                        ))}
                                        <button className="w-full py-3 border border-dashed border-white/20 text-slate-400 rounded-lg hover:border-cyan-neon hover:text-cyan-neon transition-colors text-sm font-bold">
                                            + Add Medication
                                        </button>
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
