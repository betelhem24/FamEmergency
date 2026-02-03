import React, { useState, useEffect } from 'react';
import { Users, Send, MessageSquare, Heart, Activity, Share2, MoreHorizontal, MessageCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const SOCKET_URL = 'http://localhost:5000';

const DoctorCommunity: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
    const [searchQuery, setSearchQuery] = useState('');

    const { socket } = useSocket();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        fetchPosts();

        if (socket) {
            socket.on('post:new', (newPost: any) => {
                setPosts(prev => [newPost, ...prev]);
            });

            socket.on('post:updated', (updatedPost: any) => {
                setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
            });
        }

        return () => {
            if (socket) {
                socket.off('post:new');
                socket.off('post:updated');
            }
        };
    }, [socket]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    userId: user?.id,
                    userName: user?.name,
                    content: inputText
                }),
            });
            setInputText('');
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handleSupport = async (postId: string) => {
        setPosts(prev => prev.map(p => {
            if (p._id !== postId) return p;
            const isSupported = p.supports?.includes(user?.id);
            const newSupports = isSupported
                ? p.supports.filter((id: string) => id !== user?.id)
                : [...(p.supports || []), user?.id];
            return { ...p, supports: newSupports };
        }));

        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/${postId}/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId: user?.id }),
            });
        } catch (error) {
            console.error("Error supporting post:", error);
        }
    };

    const handleAddComment = async (postId: string) => {
        const text = commentTexts[postId];
        if (!text || !text.trim()) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    userId: user?.id,
                    userName: user?.name,
                    text
                }),
            });
            setCommentTexts(prev => ({ ...prev, [postId]: '' }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4 pt-4 pb-24 px-4 overflow-y-auto bg-[#020617] no-scrollbar relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[70vw] h-[70vw] bg-cyan-500/5 blur-[150px] rounded-full" />
                <div className="absolute inset-0 backdrop-blur-[12px] bg-black/40" />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Medical Network</h1>
                        <p className="text-cyan-500/60 text-[10px] font-black tracking-[0.4em] uppercase mt-2">Professional Community Hub</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 text-cyan-500 shadow-xl">
                        <Users size={24} />
                    </div>
                </div>

                {/* Post Creator */}
                <form onSubmit={handleCreatePost} className="bg-white/[0.03] p-8 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Share medical insights with the community..."
                        className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-white text-sm outline-none focus:border-cyan-500/30 transition-all resize-none h-32 font-semibold placeholder:text-slate-600"
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 opacity-30">
                            <Activity size={12} className="text-cyan-500 animate-pulse" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Channel</span>
                        </div>
                        <button type="submit" className="bg-cyan-500 px-8 py-4 rounded-2xl text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(6,182,212,0.2)] active:scale-95 transition-all flex items-center gap-3">
                            <Send size={16} /> Share Update
                        </button>
                    </div>
                </form>

                {/* SEARCH BAR */}
                <div className="glass-card p-4 rounded-[2rem] border-white/5 flex items-center gap-4">
                    <Search className="text-[var(--text-secondary)] ml-2" size={20} />
                    <input
                        type="search"
                        placeholder="Search network..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none text-white text-sm w-full focus:ring-0 outline-none font-bold placeholder:text-slate-600 uppercase tracking-wider"
                    />
                </div>

                {/* Feed */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="py-24 text-center opacity-30 animate-pulse">
                            <Activity size={56} className="mx-auto mb-6 text-cyan-500" />
                            <p className="font-black uppercase tracking-[0.4em] text-xs">Syncing Network Feed...</p>
                        </div>
                    ) : posts
                        .filter(post =>
                            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.userName?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .length === 0 ? (
                        <div className="py-24 text-center opacity-20">
                            <MessageSquare size={56} className="mx-auto mb-6" />
                            <p className="font-black uppercase tracking-[0.4em] text-xs">No matching updates</p>
                        </div>
                    ) : (
                        posts
                            .filter(post =>
                                post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                post.userName?.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((post) => (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/[0.03] rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl"
                                >
                                    <div className="p-10 space-y-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center border border-white/10 shadow-2xl">
                                                    <span className="text-white font-black text-2xl uppercase">{post.userName?.[0] || '?'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-white uppercase tracking-tighter leading-none">{post.userName}</p>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 bg-white/[0.05] w-fit px-2 py-1 rounded-lg">
                                                        {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-slate-700 hover:text-white transition-colors p-2">
                                                <MoreHorizontal size={28} />
                                            </button>
                                        </div>

                                        <div className="text-[15px] text-slate-100 leading-relaxed font-bold bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/[0.03] shadow-inner italic">
                                            "{post.content}"
                                        </div>

                                        <div className="flex items-center gap-10 pt-2 px-2">
                                            <button
                                                onClick={() => handleSupport(post._id)}
                                                className={`flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${post.supports?.includes(user?.id) ? 'text-red-500 scale-105' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                <Heart size={22} fill={post.supports?.includes(user?.id) ? "currentColor" : "none"} />
                                                {post.supports?.length || 0}
                                            </button>
                                            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                <MessageCircle size={22} />
                                                {post.comments?.length || 0}
                                            </div>
                                            <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-auto transition-colors hover:text-white">
                                                <Share2 size={22} />
                                            </button>
                                        </div>

                                        {post.comments?.length > 0 && (
                                            <div className="pt-10 border-t border-white/5 space-y-6">
                                                {post.comments?.map((comment: any, idx: number) => (
                                                    <div key={idx} className="flex gap-5">
                                                        <div className="w-10 h-10 rounded-2xl bg-white/[0.05] flex items-center justify-center text-[12px] font-black text-white/40 border border-white/5 shrink-0">
                                                            {comment.userName?.[0]}
                                                        </div>
                                                        <div className="bg-white/[0.02] rounded-[1.8rem] px-8 py-5 flex-1 border border-white/[0.03]">
                                                            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2">{comment.userName}</p>
                                                            <p className="text-xs text-slate-300 font-bold leading-relaxed">{comment.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-6">
                                            <input
                                                type="text"
                                                value={commentTexts[post._id] || ''}
                                                onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))}
                                                placeholder="Add professional insight..."
                                                className="flex-1 bg-white/[0.03] border border-white/5 rounded-[2rem] px-8 py-5 text-sm text-white outline-none focus:border-cyan-500/30 focus:bg-white/[0.05] transition-all font-bold placeholder:text-slate-600"
                                            />
                                            <button
                                                onClick={() => handleAddComment(post._id)}
                                                className="bg-cyan-500 text-white px-8 rounded-[1.5rem] hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center justify-center"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorCommunity;
