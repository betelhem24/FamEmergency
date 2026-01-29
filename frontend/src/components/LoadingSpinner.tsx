import { motion } from 'framer-motion';

const GlassSpinner = () => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-4 border-white/10 border-t-life-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                />

                {/* Inner Pulse */}
                <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 m-auto w-4 h-4 bg-life-cyan rounded-full blur-[2px]"
                />

                {/* Decorative Particles */}
                <div className="absolute -inset-2 pointer-events-none">
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default GlassSpinner;
