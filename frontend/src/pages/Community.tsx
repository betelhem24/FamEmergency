import React, { useState, useEffect } from 'react';
import { Users, Send, MessageSquare, Heart, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Community: React.FC = () => {
    const { user } = useAuth();
    const [activeGroup, setActiveGroup] = useState('General Support');
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);

    const groups = [
        { name: 'General Support', icon: MessageSquare, color: 'text-life-cyan' },
        { name: 'Heart Health', icon: Heart, color: 'text-red-500' },
        { name: 'Diabetes Care', icon: Activity, color: 'text-emerald-500' },
        { name: 'Trauma recovery', icon: ShieldAlert, color: 'text-amber-500' }
    ];

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('COMMUNITY: Connected to chat server');
            newSocket.emit('join-room', activeGroup);
        });

        newSocket.on('new-message', (msg: any) => {
            setMessages(prev => [...prev, msg].slice(-20));
        });

        return () => {
            newSocket.disconnect();
        };
    }, [activeGroup]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !socket) return;

        const msgData = {
            text: inputText,
            user: user?.name || 'Anonymous',
            timestamp: new Date().toISOString(),
            room: activeGroup,
            userId: user?.id
        };

        socket.emit('send-message', msgData);
        setMessages(prev => [...prev, msgData]);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-full space-y-4 pt-4 pb-20 px-2 overflow-hidden">
            <div className="px-2">
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Medical Community</h1>
                <p className="text-life-cyan/80 text-[10px] font-black tracking-[0.4em] uppercase font-bold">Safe Space for Shared Recovery</p>
            </div>

            {/* Group Switcher */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-2">
                {groups.map(group => (
                    <button
                        key={group.name}
                        onClick={() => { setActiveGroup(group.name); setMessages([]); }}
                        className={`flex-shrink-0 px-6 py-3 rounded-2xl border transition-all flex items-center gap-3 backdrop-blur-md ${activeGroup === group.name
                            ? 'bg-life-cyan/20 border-life-cyan text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                            : 'bg-white/5 border-white/10 text-slate-400 opacity-60'
                            }`}
                    >
                        <group.icon size={16} className={group.color} />
                        <span className="text-xs font-black uppercase tracking-widest leading-none whitespace-nowrap">{group.name}</span>
                    </button>
                ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-card rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col mx-2 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-life-cyan/40 to-transparent"></div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                            <Users size={60} />
                            <div>
                                <p className="font-black uppercase tracking-widest text-sm">Welcome to {activeGroup}</p>
                                <p className="text-[10px] font-bold">Start an instant, secure conversation.</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.userId === user?.id ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i}
                                className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}
                            >
                                <div className={`max-w-[80%] p-4 rounded-[1.5rem] border ${msg.userId === user?.id
                                    ? 'bg-life-cyan/10 border-life-cyan/30 rounded-tr-none'
                                    : 'bg-white/5 border-white/10 rounded-tl-none'
                                    }`}>
                                    <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                                </div>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 px-1">
                                    {msg.userId === user?.id ? 'You' : msg.user} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        placeholder="Say something to the group..."
                        className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-life-cyan/50 transition-all font-bold"
                    />
                    <button
                        type="submit"
                        className="bg-life-cyan p-4 rounded-2xl text-white shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Community;
