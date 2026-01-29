import { Activity, Droplet, AlertTriangle, FileText, Truck, ArrowLeft, Pill, HeartPulse, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientProfile: React.FC = () => {
    const navigate = useNavigate();

    // Static mock for the user being viewed by the doctor
    const patientData = {
        name: "Leo Brooks",
        role: "Patient",
        bloodType: "O-",
        allergies: ["Peanuts", "Penicillin"],
        medications: ["Metformin 500mg", "Lisinopril 10mg"],
        lastVitals: { heartRate: "78 bpm", spO2: "98%" }
    };

    return (
        <div className="space-y-6 pt-4 pb-24 px-2 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center gap-4 px-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">{patientData.name}</h1>
                    <p className="text-emerald-400 text-[9px] font-black tracking-[0.3em] uppercase">Emergency Scan Verified</p>
                </div>
            </div>

            {/* Vital Stats Grid */}
            <div className="grid grid-cols-2 gap-3 px-2">
                <div className="glass-card p-5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center">
                    <HeartPulse className="text-red-500 mb-2" size={24} />
                    <span className="text-xl font-black text-white">{patientData.lastVitals.heartRate}</span>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Heart Rate</p>
                </div>
                <div className="glass-card p-5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center">
                    <Activity className="text-life-cyan mb-2" size={24} />
                    <span className="text-xl font-black text-white">{patientData.lastVitals.spO2}</span>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">SPO2 Level</p>
                </div>
            </div>

            {/* Main Medical List */}
            <div className="px-2 space-y-4">
                <div className="glass-panel p-6 rounded-[3rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <FileText size={80} />
                    </div>

                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <ShieldCheckIcon size={14} className="text-emerald-500" /> Patient Medical File
                    </h3>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="bg-red-500/10 p-3 rounded-2xl h-fit">
                                <Droplet className="text-red-500" size={20} />
                            </div>
                            <div>
                                <p className="text-white font-black text-lg">{patientData.bloodType}</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Blood Type</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-amber-500/10 p-3 rounded-2xl h-fit">
                                <AlertTriangle className="text-amber-500" size={20} />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm uppercase italic">{patientData.allergies.join(', ')}</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Current Allergies</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-blue-500/10 p-3 rounded-2xl h-fit">
                                <Pill className="text-blue-500" size={20} />
                            </div>
                            <div>
                                <ul className="text-white/80 font-medium text-xs space-y-1">
                                    {patientData.medications.map((med, i) => (
                                        <li key={i}>{med}</li>
                                    ))}
                                </ul>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">Active Medications</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Emergency Directions Button */}
            <div className="px-2">
                <button className="w-full relative group py-6">
                    <div className="absolute inset-0 bg-life-cyan rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative bg-life-cyan rounded-[2.5rem] p-6 flex items-center justify-between border border-white/20 shadow-xl active:scale-95 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <Truck className="text-white" size={24} />
                            </div>
                            <div className="text-left text-white">
                                <h4 className="font-black text-lg uppercase italic leading-none">Directions to Emergency</h4>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-1">Route Optimized for Speed</p>
                            </div>
                        </div>
                        <ArrowRight className="text-white/60 group-hover:text-white transition-colors" />
                    </div>
                </button>
            </div>
        </div>
    );
};

function ShieldCheckIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
    )
}

export default PatientProfile;
