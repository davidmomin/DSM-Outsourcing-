import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function Loader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-dark-900 flex flex-col items-center justify-center p-4"
        >
            {/* Background Glow */}
            <div className="absolute w-64 h-64 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" />

            <div className="relative">
                {/* Revolving Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-t-2 border-r-2 border-gold-500/20 absolute -inset-4"
                />

                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-b-2 border-l-2 border-gold-400 absolute -inset-4 opacity-30"
                />

                {/* Central Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: 1
                    }}
                    transition={{
                        scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                        opacity: { duration: 0.5 }
                    }}
                    className="w-24 h-24 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold relative z-10"
                >
                    <GraduationCap className="w-12 h-12 text-dark-900" />
                </motion.div>
            </div>

            {/* Branding */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
            >
                <h2 className="text-2xl font-display font-bold gold-text tracking-widest mb-2 uppercase">
                    DSM Outsourcing
                </h2>
                <div className="flex items-center justify-center gap-1.5">
                    <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-gold-500"
                    />
                    <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-gold-500"
                    />
                    <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 rounded-full bg-gold-500"
                    />
                </div>
            </motion.div>

            {/* Progress Text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 text-xs text-gray-400 tracking-[0.2em] uppercase"
            >
                Ultimate Edition 2026
            </motion.p>
        </motion.div>
    );
}
