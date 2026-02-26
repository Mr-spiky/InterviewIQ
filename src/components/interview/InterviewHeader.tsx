"use client";

import { Brain, Clock, ChevronRight } from "lucide-react";

interface Round {
    id: string;
    label: string;
    done: boolean;
    active: boolean;
}

interface InterviewHeaderProps {
    elapsed: number;
    rounds: Round[];
    role?: string;
    company?: string;
    onEnd?: () => void;
}

function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export default function InterviewHeader({ elapsed, rounds, role = "Frontend Engineer", company = "Google", onEnd }: InterviewHeaderProps) {
    return (
        <div className="bg-dark border-b-3 border-lime px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-lime border-3 border-dark flex items-center justify-center">
                    <Brain className="w-4 h-4 text-dark" />
                </div>
                <div>
                    <div className="font-grotesk font-black text-white text-sm">InterviewIQ — LIVE SESSION</div>
                    <div className="text-white/40 text-xs">{role} @ {company}</div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Timer */}
                <div className="flex items-center gap-2 bg-card border-3 border-dark-300 px-3 py-1">
                    <Clock className="w-3 h-3 text-lime" />
                    <span className="font-grotesk font-bold text-white text-sm">{formatTime(elapsed)}</span>
                </div>

                {/* Round indicators */}
                <div className="hidden sm:flex items-center gap-2">
                    {rounds.map(r => (
                        <div
                            key={r.id}
                            className={`px-3 py-1 text-xs font-grotesk font-bold uppercase border-2 ${r.active ? "bg-lime text-dark border-dark" : "bg-transparent text-white/30 border-dark-300"
                                }`}
                        >
                            {r.label}
                        </div>
                    ))}
                </div>

                <button
                    onClick={onEnd}
                    className="brutal-btn-primary text-xs px-4 py-2 flex items-center gap-1"
                >
                    End & Get Feedback
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
