import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

const EmergencyOverlay: React.FC = () => {
    const { sosTriggered, isMinimized, setMinimized, cancelSOS } = useEmergency();

    return (
        <AnimatePresence>
            {sosTriggered && !isMinimized && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                >
                    <div className="absolute top-6 right-6">
                        <button
                            onClick={() => setMinimized(true)}
                            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Minimize</span>
                            <X size={20} />
                        </button>
                    </div>

                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                                "0 0 20px rgba(239, 68, 68, 0.2)",
                                "0 0 60px rgba(239, 68, 68, 0.6)",
                                "0 0 20px rgba(239, 68, 68, 0.2)"
                            ]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-red-500/20 p-8 rounded-full mb-8 border border-red-500/50"
                    >
                        <ShieldAlert size={64} className="text-red-500" />
                    </motion.div>

                    <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4 animate-pulse">
                        SOS Active
                    </h2>

                    <div className="space-y-2 mb-12">
                        <p className="text-red-500 font-black text-xs uppercase tracking-[0.4em]">Signal Broadcasting</p>
                        <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest max-w-xs mx-auto">
                            Emergency responders and your family network have been alerted with your live biometric data and GPS.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={cancelSOS}
                        className="w-full max-w-xs py-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm shadow-[0_20px_60px_rgba(220,38,38,0.5)] border-2 border-red-400/30 transition-all flex flex-col items-center justify-center gap-4 group active:brightness-125"
                    >
                        <ShieldAlert size={32} className="group-hover:animate-bounce transition-transform" />
                        <span>Terminate SOS</span>
                    </motion.button>

                    <p className="mt-8 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] animate-pulse">
                        Click to end emergency & notify network
                    </p>

                    <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Live GPS Uplink Active</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {sosTriggered && isMinimized && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-24 left-4 right-4 z-[1000]"
                >
                    <button
                        onClick={() => setMinimized(false)}
                        className="w-full bg-red-600/90 backdrop-blur-md border border-red-400/30 p-4 rounded-2xl flex items-center justify-between shadow-2xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-lg">
                                <ShieldAlert size={14} className="text-red-600 animate-pulse" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Emergency Active • Click to Expand</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-white animate-ping"></div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EmergencyOverlay;
