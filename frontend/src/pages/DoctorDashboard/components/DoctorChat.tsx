import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, Activity, MessageCircle, Heart, ShieldCheck, MoreVertical, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const DoctorChat: React.FC = () => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            auth: { token: localStorage.getItem('token') }
        });
        setSocket(newSocket);

        newSocket.emit('doctor:join');

        newSocket.on('chat:message', (msg: any) => {
            // Only add if it's from the active patient or if we want to store all
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

    // Fetch History when active patient changes
    useEffect(() => {
        const fetchHistory = async () => {
            if (!token || !user || !activeChatId) return;

            try {
                const res = await fetch(`${SOCKET_URL}/api/chat/history?participant1=${user.id}&participant2=${activeChatId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setMessages(data.map(m => ({
                        from: m.senderId,
                        userName: m.senderName,
                        message: m.text,
                        timestamp: m.timestamp
                    })));
                } else {
                    setMessages([]);
                }
            } catch (err) {
                console.error('Failed to fetch history', err);
            }
        };

        fetchHistory();
    }, [activeChatId, token, user]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !activeChatId || !token) return;

        const msgData = {
            senderId: user?.id,
            senderName: user?.name,
            recipientId: activeChatId,
            text: inputText
        };

        // 1. Optimistic UI Update
        const newMsg = {
            from: user?.id,
            userName: user?.name,
            message: inputText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        try {
            // 2. Persist via HTTP API (Guaranteed Save)
            const res = await fetch(`${SOCKET_URL}/api/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(msgData)
            });

            if (!res.ok) {
                console.error('Failed to send message via API');
                // Optional: Show error state for the message
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const activePatient = patients.find(p => p.userId === activeChatId);

    return (
        <div className="flex flex-col h-[75vh] bg-[#05080f] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl animate-in fade-in duration-700 font-['Inter']">
            <div className="flex h-full">
                {/* Left Panel: Patient List */}
                <div className="w-1/3 border-r border-white/5 flex flex-col bg-[#0a0f18]/50">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Activity size={14} className="text-cyan-500" /> Active Nodes
                        </h3>
                        <Search size={16} className="text-slate-600" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                        {patients.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 text-center p-8">
                                <Activity size={40} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Scanning Network...</p>
                            </div>
                        ) : (
                            patients.map((p) => (
                                <button
                                    key={p.userId}
                                    onClick={() => setActiveChatId(p.userId)}
                                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${activeChatId === p.userId
                                        ? 'bg-cyan-500/10 border-cyan-500/30'
                                        : 'bg-white/5 border-transparent hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-white text-xs border border-white/10">
                                                {p.userName?.[0] || 'U'}
                                            </div>
                                            <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0f18] ${p.status === 'emergency' ? 'bg-red-500 animate-ping' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                                        </div>
                                        <div>
                                            <p className={`text-xs font-black uppercase tracking-tight ${activeChatId === p.userId ? 'text-cyan-500' : 'text-white'}`}>{p.userName || 'Unknown'}</p>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{p.status || 'Active'}</p>
                                        </div>
                                    </div>
                                    {p.heartRate && (
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1 text-red-500">
                                                <Heart size={10} className="animate-pulse fill-red-500" />
                                                <span className="text-[10px] font-black">{p.heartRate}</span>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Chat */}
                <div className="flex-1 flex flex-col bg-[#0a0f18]/30 relative">
                    {!activeChatId ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-4">
                            <MessageCircle size={100} strokeWidth={1} className="text-cyan-500" />
                            <p className="font-black uppercase tracking-[0.4em] text-xs text-white">Select Node to Establish Link</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/40 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 text-cyan-500">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500 leading-none">Identity Link Active</p>
                                        <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mt-1">
                                            {activePatient?.userName || 'Secure Identity'}
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Quantum Safe</span>
                                    </div>
                                    <button className="text-slate-500 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col no-scrollbar">
                                <div className="text-center">
                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Protocol Initiated {new Date().toLocaleDateString()}</span>
                                </div>

                                {messages.filter(m => m.from === activeChatId || m.from === user?.id).map((msg, idx) => {
                                    const isMe = msg.from === user?.id;
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className={`max-w-[75%] px-5 py-3.5 rounded-[2rem] shadow-2xl ${isMe
                                                ? 'bg-cyan-600/90 text-white rounded-tr-none border border-cyan-400/30'
                                                : 'bg-white/5 text-white rounded-tl-none border border-white/10 backdrop-blur-md'
                                                }`}>
                                                <p className="text-sm font-medium tracking-tight leading-relaxed">{msg.message}</p>
                                            </div>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2 px-2">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={sendMessage} className="p-6 bg-slate-900/50 border-t border-white/5 flex gap-4">
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4 flex items-center group focus-within:border-cyan-500/50 transition-all">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type encrypted message..."
                                        className="flex-1 bg-transparent border-none text-white text-sm font-medium outline-none placeholder:text-slate-700"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-8 rounded-[1.5rem] shadow-xl shadow-cyan-500/10 active:scale-95 transition-all flex items-center justify-center"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
