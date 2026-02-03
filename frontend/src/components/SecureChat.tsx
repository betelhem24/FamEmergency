import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, X, Shield, Image as ImageIcon, CheckCheck } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

interface Message {
    id: string;
    text: string;
    senderId: string;
    senderRole: string;
    time: string;
    image?: string;
}

const SecureChat: React.FC<{ isOpen: boolean; onClose: () => void; recipientId: string; recipientName: string }> = ({ isOpen, onClose, recipientId, recipientName }) => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg: Message) => {
            if (msg.senderId === recipientId || msg.senderId === user?.id) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on('chat:message', handleMessage);
        return () => {
            socket.off('chat:message', handleMessage);
        };
    }, [socket, recipientId, user?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !user) return;

        const msg: Message = {
            id: Math.random().toString(36).substring(7),
            text: newMessage,
            senderId: user.id,
            senderRole: user.role,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit('chat:send', { to: recipientId, message: msg });
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const msg: Message = {
                    id: Math.random().toString(36).substring(7),
                    text: '',
                    image: base64String,
                    senderId: user.id,
                    senderRole: user.role,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                socket?.emit('chat:send', { to: recipientId, message: msg });
                setMessages(prev => [...prev, msg]);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    className="fixed bottom-24 right-4 left-4 md:left-auto md:w-96 h-[500px] glass-card flex flex-col z-[100] border border-white/10 shadow-2xl overflow-hidden rounded-[2.5rem]"
                >
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*,.pdf"
                        className="hidden"
                    />

                    {/* Header */}
                    <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="p-3 bg-[var(--accent-primary)]/10 rounded-2xl text-[var(--accent-primary)]">
                                    <Shield size={20} />
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--bg-primary)] animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-black text-white text-[10px] uppercase tracking-widest italic">{recipientName}</h3>
                                <p className="text-[8px] font-black text-[var(--accent-primary)] flex items-center gap-1 uppercase tracking-widest opacity-60">
                                    <Lock size={10} /> Quantum Encrypted
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center mt-12 opacity-20 flex flex-col items-center">
                                <Lock className="w-12 h-12 mb-4 text-[var(--accent-primary)]" />
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Channel Secured</p>
                                <p className="text-[8px] font-black text-[var(--accent-primary)] mt-2 uppercase">Ready for Clinical Handshake</p>
                            </div>
                        )}
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-3xl ${msg.senderId === user?.id
                                    ? 'bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30 text-white rounded-tr-none'
                                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                    }`}>
                                    {msg.text && <p className="text-[11px] font-medium leading-relaxed">{msg.text}</p>}
                                    {msg.image && (
                                        <div className="space-y-2">
                                            <img src={msg.image} alt="Encrypted medical data" className="rounded-2xl max-w-full border border-white/10 shadow-lg" />
                                            <p className="text-[7px] font-black text-[var(--accent-primary)] uppercase tracking-widest text-center">Encapsulated Medical Object</p>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-end gap-1 mt-2 opacity-40">
                                        <span className="text-[8px] font-black uppercase tracking-tighter">{msg.time}</span>
                                        {msg.senderId === user?.id && <CheckCheck size={10} className="text-[var(--accent-primary)]" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-6 bg-white/5 border-t border-white/5 flex gap-3 items-center">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 bg-white/5 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all"
                        >
                            <ImageIcon size={18} />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type secure message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[var(--accent-primary)]/30 transition-all placeholder-slate-500"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-[var(--accent-primary)] text-black p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SecureChat;
