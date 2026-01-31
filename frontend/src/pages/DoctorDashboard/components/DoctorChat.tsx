import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, Activity, MessageCircle, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

const SOCKET_URL = 'http://localhost:5000';

export const DoctorChat: React.FC = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [patients, setPatients] = useState<any[]>([]); // Real-time health status list
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            auth: { token: localStorage.getItem('token') }
        });
        setSocket(newSocket);

        newSocket.emit('doctor:join');

        newSocket.on('chat:message', (msg: any) => {
            setMessages(prev => [...prev, msg]);
        });

        newSocket.on('health:status', (data: any) => {
            setPatients(prev => {
                const existing = prev.find(p => p.userId === data.userId);
                if (existing) {
                    return prev.map(p => p.userId === data.userId ? { ...p, ...data } : p);
                }
                return [...prev, data];
            });
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !activeChatId || !socket) return;

        const msgData = {
            to: activeChatId,
            message: inputText,
            userName: user?.name
        };

        socket.emit('chat:private', msgData);
        setMessages(prev => [...prev, { from: user?.id, userName: user?.name, message: inputText, timestamp: new Date() }]);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-[70vh] gap-6 animate-in fade-in duration-700">
            <div className="flex gap-6 h-full">
                {/* Left Panel: Patient Status List */}
                <div className="w-1/3 glass-card rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} className="text-medical-cyan" /> Live Monitoring
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {patients.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-8">
                                <Activity size={40} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Active Nodes Detected</p>
                            </div>
                        ) : (
                            patients.map((p) => (
                                <button
                                    key={p.userId}
                                    onClick={() => setActiveChatId(p.userId)}
                                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${activeChatId === p.userId
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-medical-cyan/30'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${p.status === 'emergency' ? 'bg-red-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tight">{p.userName || 'Unknown Identity'}</p>
                                            <p className="text-[8px] font-bold opacity-60 uppercase">{p.status || 'Nominal'}</p>
                                        </div>
                                    </div>
                                    {p.heartRate && (
                                        <div className="flex items-center gap-1 text-red-500">
                                            <Heart size={10} className="animate-pulse fill-red-500" />
                                            <span className="text-[10px] font-black">{p.heartRate}</span>
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Chat Portal */}
                <div className="flex-1 glass-card rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col relative">
                    {!activeChatId ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                            <MessageCircle size={80} strokeWidth={1} />
                            <p className="font-black uppercase tracking-[0.3em] text-xs text-slate-400">Select Identity to Initiate Secure Link</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b border-slate-50 bg-slate-900 text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-xl">
                                        <User size={18} className="text-medical-cyan" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-medical-cyan">Secure Portal</p>
                                        <p className="font-black italic uppercase italic tracking-tighter">
                                            {patients.find(p => p.userId === activeChatId)?.userName || 'Identity Link Active'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                                    <ShieldCheck size={12} className="text-emerald-400" />
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">E2E Encrypted</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col no-scrollbar">
                                {messages.filter(m => m.from === activeChatId || m.to === activeChatId).map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.from === user?.id ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex flex-col ${msg.from === user?.id ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`max-w-[70%] p-4 rounded-[1.5rem] border ${msg.from === user?.id
                                            ? 'bg-slate-900 border-slate-900 text-white rounded-tr-none shadow-lg'
                                            : 'bg-slate-50 border-slate-100 text-slate-900 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm font-medium tracking-tight leading-relaxed">{msg.message}</p>
                                        </div>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <form onSubmit={sendMessage} className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Execute encrypted command..."
                                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black placeholder:text-slate-300 focus:border-medical-cyan/50 outline-none transition-all"
                                />
                                <button type="submit" className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                                    <Send size={20} className="text-medical-cyan" />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
