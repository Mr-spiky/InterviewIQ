"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface AIAvatarProps {
    isSpeaking: boolean;
}

export default function AIAvatar({ isSpeaking }: AIAvatarProps) {
    return (
        <div className="relative w-full h-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden border-3 border-dark-200">

            {/* Background ripples when speaking */}
            {isSpeaking && (
                <>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute w-40 h-40 bg-lime/20 rounded-full"
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                        className="absolute w-40 h-40 bg-lime/10 rounded-full"
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1, ease: "easeOut" }}
                        className="absolute w-40 h-40 bg-lime/5 rounded-full"
                    />
                </>
            )}

            {/* Main Avatar */}
            <motion.div
                animate={isSpeaking ? { scale: [1, 1.05, 1], y: [0, -5, 0] } : { scale: 1, y: 0 }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className={`relative z-10 w-48 h-48 rounded-full border-4 flex items-center justify-center shadow-2xl transition-colors duration-500 ${isSpeaking ? "bg-lime border-white" : "bg-dark-200 border-dark-300"
                    }`}
            >
                <Brain className={`w-24 h-24 transition-colors duration-500 ${isSpeaking ? "text-dark" : "text-white/20"}`} />

                {/* 'Voice' equalizer lines inside avatar */}
                {isSpeaking && (
                    <div className="absolute bottom-6 flex gap-1 items-end justify-center w-full h-8 px-8">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 bg-dark rounded-t-sm"
                                animate={{ height: ["4px", "24px", "8px", "16px", "4px"] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.8 + Math.random() * 0.4,
                                    ease: "easeInOut",
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Name tag */}
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 border border-dark-300 backdrop-blur-sm">
                <span className="text-white text-xs font-grotesk font-bold flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-lime animate-pulse" : "bg-dark-300"}`} />
                    AI Interviewer
                </span>
            </div>
        </div>
    );
}
