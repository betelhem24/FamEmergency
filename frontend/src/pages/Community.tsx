import React, { useState, useEffect } from 'react';
import { Users, Send, MessageSquare, Heart, ShieldAlert, Activity, Search, BookOpen, Wind, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Community: React.FC = () => {
    const { user } = useAuth();
    const [activeGroup, setActiveGroup] = useState('General Support');
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [showLibrary, setShowLibrary] = useState(false);

    const groups = [
        { name: 'General Support', icon: MessageSquare, color: 'text-life-cyan' },
        { name: 'Heart Health', icon: Heart, color: 'text-red-500' },
        { name: 'Diabetes Care', icon: Activity, color: 'text-emerald-500' },
        { name: 'Trauma recovery', icon: ShieldAlert, color: 'text-amber-500' }
    ];

    const libraryArticles = [
        { id: 'cpr', title: 'CPR Protocol', icon: Heart, color: 'text-red-500', content: '1. Check the scene. 2. Call 911. 3. 30 chest compressions (2 inches deep) at 100-120 BPM. 4. 2 rescue breaths. Repeat.' },
        { id: 'choking', title: 'Choking / Heimlich', icon: Wind, color: 'text-life-cyan', content: '1. Stand behind. 2. Wrap arms around waist. 3. Make a fist. 4. Perform 5 quick upward thrusts above navel.' },
        { id: 'wound', title: 'Wound Care', icon: Droplet, color: 'text-emerald-500', content: '1. Apply direct pressure. 2. Clean with soap and water. 3. Apply antibiotic ointment. 4. Bandage securely.' }
    ];

    useEffect(() => {
        // One-time Service Worker registration
        if ('serviceWorker' in navigator && !window.__sw_registered) {
            navigator.serviceWorker.register('/sw.js').then(() => {
                console.log('COMMUNITY: Service Worker Active (Offline Library Enabled)');
                window.__sw_registered = true;
            });
        }

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join-room', activeGroup);
        });

        newSocket.on('new-message', (msg: any) => {
            setMessages(prev => [...prev, msg].slice(-20));
        });

        return () => {
            newSocket.disconnect();
        };
    }, [activeGroup]);

    const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !socket) return;
        const msgData = { text: inputText, user: user?.name || 'Anonymous', timestamp: new Date().toISOString(), room: activeGroup, userId: user?.id };
        socket.emit('send-message', msgData);
        setMessages(prev => [...prev, msgData]);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-full space-y-4 pt-4 pb-20 px-4 overflow-hidden bg-slate-950">
            <div className="flex items-center justify-between mb-2 px-1">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Medical Hub</h1>
                    <p className="text-life-cyan/60 text-[9px] font-black tracking-[0.4em] uppercase">Emergency Social Library</p>
                </div>
                <button
                    onClick={() => setShowLibrary(!showLibrary)}
                    className={`p-3 rounded-2xl border transition-all ${showLibrary ? 'bg-life-cyan border-life-cyan text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400'}`}
                >
                    <BookOpen size={20} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative group px-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-life-cyan transition-colors" size={16} />
                <input
                    type="text"
                    placeholder="Search rooms or files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white text-xs font-black uppercase tracking-widest outline-none focus:border-life-cyan/40 transition-all"
                />
            </div>

            <AnimatePresence mode="wait">
                {showLibrary ? (
                    <motion.div
                        key="library"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar"
                    >
                        <div className="bg-life-cyan/10 border border-life-cyan/20 p-6 rounded-[2rem] mb-6">
                            <div className="flex items-center gap-3 text-life-cyan mb-2">
                                <ShieldAlert size={18} />
                                <span className="font-black text-[10px] uppercase tracking-[0.3em]">Offline Protocol Enabled</span>
                            </div>
                            <p className="text-[10px] text-white/50 font-bold uppercase leading-relaxed">These articles are cached locally and work without internet connection.</p>
                        </div>

                        {libraryArticles.map(article => (
                            <div key={article.id} className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-xl bg-white/5 ${article.color}`}>
                                        <article.icon size={20} />
                                    </div>
                                    <h3 className="font-black text-white uppercase tracking-widest text-sm">{article.title}</h3>
                                </div>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">{article.content}</p>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col space-y-4 overflow-hidden"
                    >
                        {/* Group Switcher */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
                            {filteredGroups.map(group => (
                                <button
                                    key={group.name}
                                    onClick={() => { setActiveGroup(group.name); setMessages([]); }}
                                    className={`flex-shrink-0 px-6 py-3 rounded-2xl border transition-all flex items-center gap-3 backdrop-blur-md ${activeGroup === group.name
                                        ? 'bg-life-cyan/20 border-life-cyan text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                        : 'bg-white/5 border-white/10 text-slate-400 opacity-60'
                                        }`}
                                >
                                    <group.icon size={16} className={group.color} />
                                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{group.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 glass-card rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col relative">
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                                        <Users size={60} />
                                        <p className="font-black uppercase tracking-widest text-xs">Awaiting Secure Link...</p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: msg.userId === user?.id ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i}
                                            className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className={`max-w-[85%] p-4 rounded-[1.5rem] border ${msg.userId === user?.id
                                                ? 'bg-life-cyan/20 border-life-cyan/40 text-white rounded-tr-none'
                                                : 'bg-white/5 border-white/10 text-white rounded-tl-none'
                                                }`}>
                                                <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1.5 px-1">
                                                {msg.userId === user?.id ? 'System User' : msg.user} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-3">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Enter encrypted message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs placeholder:text-slate-600 focus:border-life-cyan/50 outline-none transition-all font-bold"
                                />
                                <button type="submit" className="bg-life-cyan p-4 rounded-2xl text-white shadow-lg shadow-cyan-500/30 active:scale-95 transition-all">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Community;
