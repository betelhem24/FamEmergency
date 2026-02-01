import { useState } from 'react';
import { Search, ChevronRight, PlayCircle, Heart, Thermometer, Zap, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';


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
            color: 'text-red-400',
            bg: 'bg-red-500/20',
            warning: "Call Emergency Services (911) IMMEDIATELY before starting CPR.",
            steps: [
                { title: "Check Responsiveness", desc: "Tap the shoulder and shout 'Are you okay?'. Look for breathing." },
                { title: "Position Hands", desc: "Place heel of one hand on center of chest (sternum). Interlock other hand on top." },
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
            color: 'text-orange-400',
            bg: 'bg-orange-500/20',
            warning: "Protect yourself from blood-borne pathogens. Use gloves if available.",
            steps: [
                { title: "Apply Pressure", desc: "Cover wound with sterile cloth. Apply direct pressure for 5-10 minutes." },
                { title: "Elevate", desc: "Raise the injured limb above heart level to slow blood flow." },
                { title: "Tourniquet (Last Resort)", desc: "If bleeding is life-threatening/arterial, apply tourniquet 2 inches above wound." }
            ]
        },
        {
            id: 3,
            title: 'Choking',
            category: 'Critical',
            duration: '4 min',
            icon: Activity,
            color: 'text-purple-400',
            bg: 'bg-purple-500/20',
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
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/20',
            steps: [
                { title: "Cool the Burn", desc: "Run cool (not cold) water over burn for 10-20 minutes." },
                { title: "Protect", desc: "Cover with sterile, non-stick bandage or cling film." },
                { title: "Avoid", desc: "Do NOT pop blisters. Do NOT apply ice, butter, or ointments." }
            ]
        },
    ];

    const filtered = lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

    if (selectedLesson) {
        return (
            <div className="pt-4 pb-20 px-2 animate-in slide-in-from-right duration-300">
                <button
                    onClick={() => setSelectedLesson(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Library
                </button>

                <div className={`p-6 rounded-3xl ${selectedLesson.bg} border border-white/10 mb-8`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-black/20 ${selectedLesson.color}`}>
                            <selectedLesson.icon size={32} />
                        </div>
                        <div>
                            <span className="text-xs font-black uppercase tracking-widest opacity-70 block mb-1">{selectedLesson.category}</span>
                            <h1 className="text-3xl font-bold text-white leading-none">{selectedLesson.title}</h1>
                        </div>
                    </div>
                </div>

                {selectedLesson.warning && (
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl mb-8 flex gap-3">
                        <AlertTriangle className="text-red-500 shrink-0" />
                        <p className="text-red-200 text-sm font-bold">{selectedLesson.warning}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <h2 className="text-white font-bold uppercase tracking-widest text-sm pl-2">Action Protocol</h2>
                    {selectedLesson.steps.map((step, idx) => (
                        <div key={idx} className="glass-panel p-5 flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-life-cyan flex items-center justify-center font-bold">
                                {idx + 1}
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button onClick={() => setSelectedLesson(null)} className="w-full py-4 bg-life-cyan text-black font-bold rounded-xl shadow-lg shadow-life-cyan/20 active:scale-95 transition-all">
                        Mark Complete
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pt-4 pb-20 px-2 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">First Aid Academy</h1>
                <p className="text-slate-400 text-sm">Life-saving guides at your fingertips.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search lessons (e.g., CPR)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all font-sans"
                />
            </div>

            <div className="space-y-3">
                {filtered.map((lesson) => (
                    <div
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className="glass-card p-4 rounded-xl flex items-center justify-between group hover:bg-white/15 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-life-cyan"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${lesson.bg} ${lesson.color}`}>
                                <lesson.icon size={22} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{lesson.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">{lesson.category}</span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <PlayCircle size={10} /> {lesson.duration}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="text-slate-300" size={16} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-white/20 h-24 w-24 rounded-full blur-2xl"></div>
                <h3 className="font-bold text-lg mb-2 relative z-10">Daily Quiz</h3>
                <p className="text-blue-100 text-sm mb-4 relative z-10">Test your emergency knowledge and earn badges.</p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-50 transition-colors relative z-10">
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

export default FirstAidAcademy;
