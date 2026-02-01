import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, X, Shield } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
    time: string;
}

const SecureChat: React.FC<{ isOpen: boolean; onClose: () => void; recipientName: string }> = ({ isOpen, onClose, recipientName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setMessages([...messages, {
            id: Date.now(),
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setNewMessage('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 right-4 w-96 h-[500px] glass-panel flex flex-col z-[1000] border-2 border-cyan-neon shadow-neon-cyan"
                >
                    {/* Header */}
                    <div className="p-4 bg-navy-light/80 border-b border-cyan-neon/30 flex justify-between items-center rounded-t-xl">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Shield className="w-5 h-5 text-cyan-neon" />
                                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-success-green rounded-full animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{recipientName}</h3>
                                <p className="text-[10px] font-mono text-cyan-neon flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> END-TO-END ENCRYPTED
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-navy-deep/50">
                        {messages.length === 0 && (
                            <div className="text-center mt-10 opacity-50">
                                <Lock className="w-12 h-12 mx-auto mb-2 text-cyan-neon" />
                                <p className="text-xs text-white">Secure channel established.</p>
                                <p className="text-xs font-mono text-cyan-neon">SESSION ID: {Date.now().toString().slice(-6)}</p>
                            </div>
                        )}
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'me'
                                    ? 'bg-cyan-neon/20 border border-cyan-neon/50 text-white rounded-br-none'
                                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                                    }`}>
                                    <p>{msg.text}</p>
                                    <span className="text-[10px] opacity-50 mt-1 block text-right">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 bg-navy-light/80 border-t border-cyan-neon/30 rounded-b-xl flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type secure message..."
                            className="flex-1 bg-navy-deep border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-neon transition-colors"
                        />
                        <button
                            type="submit"
                            className="bg-cyan-neon text-navy-deep p-2 rounded hover:bg-cyan-glow transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SecureChat;
