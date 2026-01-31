import React, { useState, useEffect } from 'react';
import { Users, Send, MessageSquare, Heart, Activity, Share2, MoreHorizontal, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = 'http://localhost:5000';

const Community: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/posts');
                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        fetchPosts();

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('post:new', (newPost: any) => {
            setPosts(prev => [newPost, ...prev]);
        });

        newSocket.on('post:updated', (updatedPost: any) => {
            setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        try {
            await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        try {
            await fetch(`http://localhost:5000/api/posts/${postId}/support`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        <div className="flex flex-col h-full space-y-4 pt-4 pb-24 px-4 overflow-y-auto bg-slate-950 no-scrollbar">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Medical Feed</h1>
                    <p className="text-life-cyan/60 text-[9px] font-black tracking-[0.4em] uppercase">Community Support System</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-life-cyan">
                    <Users size={20} />
                </div>
            </div>

            {/* Post Creator */}
            <form onSubmit={handleCreatePost} className="glass-card p-6 rounded-[2.5rem] border border-white/10 space-y-4">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Share a health update..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-life-cyan/30 transition-all resize-none h-24 font-medium"
                />
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Post to Community</span>
                    <button type="submit" className="bg-life-cyan px-6 py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2">
                        <Send size={14} /> Send Update
                    </button>
                </div>
            </form>

            {/* Feed */}
            <div className="space-y-6">
                {loading ? (
                    <div className="py-20 text-center opacity-20 animate-pulse">
                        <Activity size={48} className="mx-auto mb-4" />
                        <p className="font-black uppercase tracking-[0.3em] text-xs">Syncing Feed...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="py-20 text-center opacity-20">
                        <MessageSquare size={48} className="mx-auto mb-4" />
                        <p className="font-black uppercase tracking-[0.3em] text-xs">No updates yet</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-life-cyan/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                                            <span className="text-white font-black text-xs uppercase">{post.userName?.[0] || '?'}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">{post.userName}</p>
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                                {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-slate-600 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <p className="text-sm text-slate-200 leading-relaxed font-medium bg-white/5 p-4 rounded-2xl border border-white/5">
                                    {post.content}
                                </p>

                                <div className="flex items-center gap-6 pt-2">
                                    <button
                                        onClick={() => handleSupport(post._id)}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${post.supports?.includes(user?.id) ? 'text-red-500 scale-110' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        <Heart size={18} fill={post.supports?.includes(user?.id) ? "currentColor" : "none"} />
                                        {post.supports?.length || 0} Support
                                    </button>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <MessageCircle size={18} />
                                        {post.comments?.length || 0} Comments
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-auto transition-colors hover:text-white">
                                        <Share2 size={18} />
                                    </button>
                                </div>

                                {/* Comments Section */}
                                <div className="pt-4 border-t border-white/5 space-y-4">
                                    {post.comments?.map((comment: any, idx: number) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40 border border-white/5 shrink-0">
                                                {comment.userName?.[0]}
                                            </div>
                                            <div className="bg-white/5 rounded-2xl p-3 flex-1 border border-white/5">
                                                <p className="text-[9px] font-black text-life-cyan uppercase tracking-tighter mb-1">{comment.userName}</p>
                                                <p className="text-[11px] text-slate-300 font-medium">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={commentTexts[post._id] || ''}
                                            onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))}
                                            placeholder="Write a supportive comment..."
                                            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-life-cyan/30 transition-all font-medium"
                                        />
                                        <button
                                            onClick={() => handleAddComment(post._id)}
                                            className="bg-white/5 border border-white/5 p-2.5 rounded-xl text-life-cyan hover:bg-life-cyan/10 transition-all"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Community;
