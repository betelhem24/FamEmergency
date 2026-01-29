import { useState } from 'react';
import { Search, ChevronRight, PlayCircle, Heart, Thermometer, Zap } from 'lucide-react';

const FirstAidAcademy = () => {
    const [search, setSearch] = useState('');

    const lessons = [
        { id: 1, title: 'CPR Basics', category: 'Critical', duration: '5 min', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20' },
        { id: 2, title: 'Severe Bleeding', category: 'Trauma', duration: '3 min', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/20' },
        { id: 3, title: 'Choking', category: 'Critical', duration: '4 min', icon: ActivityIcon, color: 'text-purple-400', bg: 'bg-purple-500/20' },
        { id: 4, title: 'Burn Treatment', category: 'Thermal', duration: '6 min', icon: Thermometer, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    ];

    function ActivityIcon(props: any) {
        return (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
        )
    }

    const filtered = lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 pt-4">
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-life-cyan/50 focus:bg-white/10 transition-all"
                />
            </div>

            <div className="space-y-3">
                {filtered.map((lesson) => (
                    <div key={lesson.id} className="glass-card p-4 rounded-xl flex items-center justify-between group hover:bg-white/15 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-life-cyan">
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
