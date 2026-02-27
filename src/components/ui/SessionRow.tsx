"use client";

import { motion } from "framer-motion";
import { Target, ChevronRight } from "lucide-react";

function scoreColor(score: number) {
    if (score >= 80) return "text-lime";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
}

interface SessionRowProps {
    index: number;
    role: string;
    company: string;
    date: string;
    score: number;
    rounds: string[];
    status?: string;
}

export default function SessionRow({ role, company, date, score, rounds, index }: SessionRowProps) {
    return (
        <motion.div
            custom={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-between p-4 border-3 border-dark-200 hover:border-lime transition-colors duration-200 cursor-pointer group"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-lime/10 border-3 border-lime flex items-center justify-center">
                    <Target className="w-5 h-5 text-lime" />
                </div>
                <div>
                    <div className="font-grotesk font-bold text-white text-sm">{role}</div>
                    <div className="text-white/40 text-xs">{company} · {date}</div>
                    <div className="flex gap-1 mt-1">
                        {rounds.map(r => (
                            <span key={r} className="text-[10px] bg-dark-200 text-white/60 px-2 py-0.5 border border-dark-300 font-grotesk">
                                {r}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className={`text-2xl font-grotesk font-black ${scoreColor(score)}`}>{score}</div>
                    <div className="text-white/30 text-xs">/ 100</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-lime transition-colors" />
            </div>
        </motion.div>
    );
}
