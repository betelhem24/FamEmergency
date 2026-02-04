import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, ShieldCheck, MessageCircle, Activity, User, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PatientChat: React.FC<{ targetDoctorId?: string }> = ({ targetDoctorId }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch History
    useEffect(() => {
        const fetchHistory = async () => {
            if (!token || !user) return;

            // If targetDoctorId is missing, we might need to fetch the 'current' doctor
            // For now, if missing, we'll wait or skip history
            if (!targetDoctorId) return;

            try {
                const res = await fetch(`${SOCKET_URL}/api/chat/history?participant1=${user.id}&participant2=${targetDoctorId}`, {
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
                }
            } catch (err) {
                console.error('Failed to fetch chat history', err);
            }
        };

        fetchHistory();
    }, [targetDoctorId, token, user]);

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

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !socket || !targetDoctorId || !token) return;

        const msgData = {
            senderId: user?.id,
            senderName: user?.name,
            recipientId: targetDoctorId,
            text: inputText
        };

        // 1. Optimistic UI Update
        const newLocalMsg = {
            from: user?.id,
            userName: user?.name,
            message: inputText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newLocalMsg]);
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
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    return (
        <div className="flex flex-col h-[70vh] w-full max-w-md mx-auto glass-card rounded-[2.5rem] border border-white/10 bg-[#0a0f18]/90 backdrop-blur-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-10 duration-700">
            {/* Header */}
            <div className="p-6 bg-slate-900/50 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <User size={24} />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a0f18] shadow-[0_0_10px_#10b981]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white italic tracking-tighter uppercase">Support Specialist</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Enclave Encrypted</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 text-slate-400">
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors"><MoreVertical size={20} /></button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar flex flex-col">
                <div className="text-center py-4">
                    <span className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border border-white/5">
                        Security link established {new Date().toLocaleDateString()}
                    </span>
                </div>

                <AnimatePresence>
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                            <div className="p-8 bg-cyan-500/10 rounded-full">
                                <MessageCircle size={60} className="text-cyan-500" />
                            </div>
                            <p className="font-black uppercase tracking-[0.3em] text-[10px] text-white">No previous logs found</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.from === user?.id;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`max-w-[85%] px-5 py-3.5 rounded-[2rem] shadow-xl ${isMe
                                        ? 'bg-cyan-600/90 text-white rounded-tr-none border border-cyan-400/30'
                                        : 'bg-white/10 text-white rounded-tl-none border border-white/10 backdrop-blur-md'
                                        }`}>
                                        <p className="text-sm font-medium tracking-tight leading-relaxed">{msg.message}</p>
                                    </div>
                                    <div className={`flex items-center gap-2 mt-1.5 px-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && <ShieldCheck size={10} className="text-cyan-500" />}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-900/30 border-t border-white/5">
                <form onSubmit={sendMessage} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-[2rem] px-5 py-2 group focus-within:border-cyan-500/50 transition-all">
                        <button type="button" className="text-slate-500 hover:text-cyan-500 transition-colors"><Paperclip size={20} /></button>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Message responder..."
                            className="flex-1 bg-transparent border-none py-3 text-sm text-white placeholder:text-slate-600 outline-none font-medium"
                        />
                        <button type="button" className="text-slate-500 hover:text-cyan-500 transition-colors"><Smile size={20} /></button>
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                            <Activity size={12} className="text-cyan-500" />
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">System Online</span>
                        </div>
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-[#0a0f18] px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            Transmit <Send size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
