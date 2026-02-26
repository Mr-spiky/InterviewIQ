"use client";

import { motion } from "framer-motion";

interface ScoreBarProps {
    label: string;
    score: number;
    max?: number;
    description?: string;
    /** Animate bar width on mount */
    animate?: boolean;
}

/** Score colour based on value */
function scoreColor(score: number) {
    if (score >= 80) return "text-lime";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
}

function barColor(score: number) {
    if (score >= 80) return "bg-lime";
    if (score >= 70) return "bg-yellow-400";
    return "bg-red-400";
}

/**
 * ScoreBar — horizontal progress bar showing a score out of `max`.
 * Optionally animates with Framer Motion.
 * Used on the Feedback page score breakdown section.
 */
export default function ScoreBar({
    label,
    score,
    max = 100,
    description,
    animate = true,
}: ScoreBarProps) {
    const pct = `${(score / max) * 100}%`;

    return (
        <div className="bg-card border-3 border-dark-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-grotesk font-bold text-white text-sm">{label}</h3>
                <span className={`font-grotesk font-black text-2xl ${scoreColor(score)}`}>
                    {score}
                </span>
            </div>

            <div className="h-2 bg-dark-300 border border-dark-200 mb-3">
                {animate ? (
                    <motion.div
                        className={`h-full ${barColor(score)}`}
                        initial={{ width: 0 }}
                        animate={{ width: pct }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                ) : (
                    <div className={`h-full ${barColor(score)}`} style={{ width: pct }} />
                )}
            </div>

            {description && (
                <p className="text-white/50 text-xs leading-relaxed">{description}</p>
            )}
        </div>
    );
}
