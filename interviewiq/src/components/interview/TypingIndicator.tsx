"use client";

import { motion } from "framer-motion";
import { Brain, Volume2 } from "lucide-react";

export default function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3"
        >
            <div className="w-8 h-8 bg-lime border-3 border-dark flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-dark" />
            </div>
            <div className="bg-card border-3 border-lime shadow-brutal px-5 py-4 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-lime animate-pulse" />
                <span className="text-white/60 text-xs font-grotesk">AI is thinking...</span>
                <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 bg-lime rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
