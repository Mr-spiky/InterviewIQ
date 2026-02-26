"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

function scoreColor(score: number) {
    if (score >= 80) return "text-lime";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
}

interface TranscriptItemProps {
    question: string;
    answer: string;
    score: number;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}

/**
 * TranscriptItem — collapsible Q&A row used in the Feedback transcript tab.
 */
export default function TranscriptItem({ question, answer, score, index, isOpen, onToggle }: TranscriptItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border-3 border-dark-200 overflow-hidden"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-200/30 transition-colors"
            >
                <div className="flex items-start gap-4">
                    <div className="w-7 h-7 bg-lime border-2 border-dark flex items-center justify-center shrink-0">
                        <span className="text-dark text-xs font-black">Q{index + 1}</span>
                    </div>
                    <span className="font-grotesk font-bold text-white text-sm pr-4">{question}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-grotesk font-black text-xl ${scoreColor(score)}`}>{score}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
            </button>

            {isOpen && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="border-t-3 border-dark-200 p-5"
                >
                    <div className="text-xs font-grotesk font-bold text-lime uppercase tracking-wide mb-2">Your Answer</div>
                    <p className="text-white/70 text-sm leading-relaxed">{answer}</p>
                </motion.div>
            )}
        </motion.div>
    );
}
