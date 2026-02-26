"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
    score: number;
}

/**
 * ScoreRing — animated SVG circular progress ring.
 * Used on the Feedback page to display the overall score.
 */
export default function ScoreRing({ score }: ScoreRingProps) {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#1A1A1A" strokeWidth="12" />
                <motion.circle
                    cx="60" cy="60" r="54" fill="none" stroke="#C8F135" strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    strokeLinecap="butt"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl font-grotesk font-black text-lime"
                >
                    {score}
                </motion.span>
                <span className="text-white/40 text-xs font-grotesk">/ 100</span>
            </div>
        </div>
    );
}
