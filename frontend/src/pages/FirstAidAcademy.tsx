import { useState } from 'react';
import { Search, ChevronRight, PlayCircle, Heart, Thermometer, Zap, Activity, AlertTriangle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
    id: number;
    title: string;
    category: string;
    duration: string;
    icon: any;
    color: string;
    bg: string;
    steps: { title: string; desc: string }[];
    warning?: string;
}

const FirstAidAcademy = () => {
    const [search, setSearch] = useState('');
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const lessons: Lesson[] = [
        {
            id: 1,
            title: 'CPR Basics',
            category: 'Critical',
            duration: '5 min',
            icon: Heart,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            warning: "Call Emergency Services (911) IMMEDIATELY before starting CPR.",
            steps: [
                { title: "Check Responsiveness", desc: "Tap the shoulder and shout 'Are you okay?'. Look for breathing." },
                { title: "Position Hands", desc: "Place heel of one hand on center of chest. Interlock other hand on top." },
                { title: "Compressions", desc: "Push hard and fast (100-120 bpm). Allow chest to recoil completely." },
                { title: "Rescue Breaths", desc: "Tilt head back, lift chin. Give 2 breaths after every 30 compressions." }
            ]
        },
        {
            id: 2,
            title: 'Severe Bleeding',
            category: 'Trauma',
            duration: '3 min',
            icon: Zap,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            warning: "Protect yourself from blood-borne pathogens. Use gloves if available.",
            steps: [
                { title: "Apply Pressure", desc: "Cover wound with sterile cloth. Apply direct pressure for 5-10 minutes." },
                { title: "Elevate", desc: "Raise the injured limb above heart level to slow blood flow." },
                { title: "Tourniquet", desc: "If bleeding is life-threatening, apply tourniquet 2 inches ABOVE the wound." }
            ]
        },
        {
            id: 3,
            title: 'Choking (Heimlich)',
            category: 'Critical',
            duration: '4 min',
            icon: Activity,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            steps: [
                { title: "Encourage Coughing", desc: "If they can cough, speak, or breathe, encourage coughing." },
                { title: "Back Blows", desc: "Lean them forward. Give 5 firm blows between shoulder blades." },
                { title: "Abdominal Thrusts", desc: "Stand behind. Wrap arms around waist. Pull inward and upward." }
            ]
        },
        {
            id: 4,
            title: 'Burn Treatment',
            category: 'Thermal',
            duration: '6 min',
            icon: Thermometer,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            steps: [
                { title: "Cool the Burn", desc: "Run cool (not cold) water over burn for 10-20 minutes." },
                { title: "Protect", desc: "Cover with sterile, non-stick bandage or cling film." },
                { title: "Caution", desc: "Do NOT pop blisters. Do NOT apply ice, butter, or ointments." }
            ]
        },
    ];

    const filtered = lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 pt-4 pb-24 px-4 h-full overflow-y-auto no-scrollbar bg-[var(--bg-primary)]">
            <AnimatePresence mode="wait">
                {selectedLesson ? (
                    <motion.div
                        key="lesson-view"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="space-y-6"
                    >
                        <button
                            onClick={() => setSelectedLesson(null)}
                            className="flex items-center gap-2 text-[var(--accent-primary)]/60 hover:text-[var(--accent-primary)] transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} /> Back to Academy Library
                        </button>

                        <div className={`p-8 rounded-[3rem] ${selectedLesson.bg} border border-white/5 shadow-2xl relative overflow-hidden`}>
                            <div className="flex items-center gap-6">
                                <div className={`p-5 rounded-[2rem] bg-white/10 shadow-xl ${selectedLesson.color}`}>
                                    <selectedLesson.icon size={40} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] block mb-2">{selectedLesson.category} Protocol</span>
                                    <h1 className="text-4xl font-black text-[var(--text-primary)] leading-none italic uppercase tracking-tighter">{selectedLesson.title}</h1>
                                </div>
                            </div>
                        </div>

                        {selectedLesson.warning && (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-red-500/10 border border-red-500/30 p-6 rounded-[2rem] flex gap-4"
                            >
                                <AlertTriangle className="text-red-500 shrink-0" size={24} />
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">{selectedLesson.warning}</p>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <h2 className="text-[var(--text-primary)] font-black uppercase tracking-[0.4em] text-[10px] px-2 italic">Standard Action Logic</h2>
                            {selectedLesson.steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card p-6 rounded-3xl flex gap-5 border border-white/5"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center font-black italic">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-[var(--text-primary)] font-black uppercase text-xs tracking-widest mb-2">{step.title}</h3>
                                        <p className="text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-wider leading-relaxed">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedLesson(null)}
                            className="w-full py-5 bg-[var(--accent-primary)] text-black font-black uppercase tracking-[0.4em] text-[10px] rounded-3xl shadow-[0_20px_40px_rgba(6,182,212,0.2)] active:scale-95 transition-all mt-4"
                        >
                            Mark Academy Credit Complete
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="library-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter italic uppercase underline decoration-[var(--accent-primary)] decoration-4 underline-offset-8">Academy</h1>
                            <p className="text-[var(--accent-primary)]/60 text-[9px] font-black uppercase tracking-[0.4em] mt-3 italic">Interactive Life-Saving Schema</p>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--accent-primary)]/60 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="IDENTIFY PROTOCOL (E.G., CPR)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-6 text-[10px] text-white placeholder-[var(--text-secondary)] outline-none focus:border-[var(--accent-primary)]/30 focus:bg-white/10 transition-all font-black uppercase tracking-widest"
                            />
                        </div>

                        <div className="space-y-4">
                            {filtered.map((lesson) => (
                                <motion.div
                                    key={lesson.id}
                                    whileHover={{ scale: 1.01 }}
                                    onClick={() => setSelectedLesson(lesson)}
                                    className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between group cursor-pointer border border-white/5 hover:border-[var(--accent-primary)]/20 transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl ${lesson.bg} ${lesson.color} shadow-lg`}>
                                            <lesson.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase italic tracking-widest mb-1">{lesson.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-black text-[var(--accent-primary)]/60 bg-[var(--accent-primary)]/5 px-3 py-1 rounded-lg uppercase tracking-widest">{lesson.category}</span>
                                                <span className="text-[8px] font-black text-slate-500 flex items-center gap-1 uppercase tracking-widest">
                                                    <PlayCircle size={10} /> {lesson.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/5 text-slate-500 group-hover:text-[var(--accent-primary)] transition-all">
                                        <ChevronRight size={16} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-10 -mt-10 bg-[var(--accent-primary)]/10 h-40 w-40 rounded-full blur-[60px] group-hover:blur-[80px] transition-all"></div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 relative z-10">Academy Quiz</h3>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 relative z-10">Test protocol knowledge & unlock badges.</p>
                            <button className="bg-white text-black px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-100 transition-all relative z-10 active:scale-95">
                                Begin Evaluation
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FirstAidAcademy;
