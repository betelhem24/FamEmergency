import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, ShieldCheck, MessageCircle, Heart, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

const SOCKET_URL = 'http://localhost:5000';

export const PatientChat: React.FC<{ targetDoctorId?: string }> = ({ targetDoctorId }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            auth: { token: localStorage.getItem('token') }
        });
        setSocket(newSocket);

        newSocket.on('chat:message', (msg: any) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !socket) return;

        const msgData = {
            to: targetDoctorId || 'doctor_room', // Fallback to a general room if no specific doctor
            message: inputText,
            userName: user?.name
        };

        socket.emit('chat:private', msgData);
        setMessages(prev => [...prev, { from: user?.id, userName: user?.name, message: inputText, timestamp: new Date() }]);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-[60vh] glass-card rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in duration-500">
            <div className="p-5 bg-slate-900 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-life-cyan/20 rounded-xl">
                        <MessageCircle size={18} className="text-life-cyan" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-life-cyan uppercase tracking-widest">Responder Link</p>
                        <p className="text-sm font-black text-white italic tracking-tighter uppercase">Secure Chat Channel</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">ENCRYPTED</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar flex flex-col">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-4 grayscale">
                        <Activity size={60} />
                        <p className="font-black uppercase tracking-[0.3em] text-[10px] text-white">Awaiting Link Establishment...</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${msg.from === user?.id ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-[1.5rem] border ${msg.from === user?.id
                                    ? 'bg-life-cyan border-life-cyan text-white rounded-tr-none'
                                    : 'bg-white/10 border-white/10 text-white rounded-tl-none'
                                }`}>
                                <p className="text-sm font-medium tracking-tight leading-relaxed">{msg.message}</p>
                            </div>
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1.5 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </motion.div>
                    ))
                )}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/5 flex gap-3">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type secured message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-life-cyan/50 transition-all font-bold"
                />
                <button type="submit" className="bg-life-cyan p-3.5 rounded-xl text-white shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};
