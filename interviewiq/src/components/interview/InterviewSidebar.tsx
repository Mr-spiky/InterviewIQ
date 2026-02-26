"use client";

import Link from "next/link";

interface Signal {
    label: string;
    score: number;
}

const liveSignals: Signal[] = [
    { label: "Clarity", score: 78 },
    { label: "Depth", score: 65 },
    { label: "Pace", score: 82 },
];

interface InterviewSidebarProps {
    role?: string;
    level?: string;
    questionsAsked?: number;
    currentRound?: string;
    questionsTotal?: number;
}

export default function InterviewSidebar({
    role = "Frontend Eng.",
    level = "Senior",
    questionsAsked = 3,
    currentRound = "BEHAVIORAL",
    questionsTotal = 4,
}: InterviewSidebarProps) {
    return (
        <div className="hidden lg:flex flex-col w-64 border-l-3 border-dark-200 bg-card p-5 gap-6">
            {/* Current Round */}
            <div>
                <div className="brutal-tag text-xs mb-4">Current Round</div>
                <div className="bg-lime border-3 border-dark p-4">
                    <div className="font-grotesk font-black text-dark text-lg">{currentRound}</div>
                    <div className="text-dark/60 text-xs mt-1">Questions 1 of {questionsTotal}</div>
                </div>
            </div>

            {/* Session Info */}
            <div>
                <div className="text-white/40 text-xs font-grotesk uppercase tracking-wide mb-3">Session Info</div>
                <div className="space-y-2 text-sm">
                    {[
                        { label: "Role", value: role },
                        { label: "Level", value: level },
                        { label: "Q Count", value: `${questionsAsked} asked`, highlight: true },
                    ].map(item => (
                        <div key={item.label} className="flex justify-between">
                            <span className="text-white/40 font-grotesk">{item.label}</span>
                            <span className={`font-grotesk font-bold text-xs ${item.highlight ? "text-lime" : "text-white"}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Signals */}
            <div>
                <div className="text-white/40 text-xs font-grotesk uppercase tracking-wide mb-3">Live Signals</div>
                <div className="space-y-3">
                    {liveSignals.map(s => (
                        <div key={s.label}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-white/50 font-grotesk">{s.label}</span>
                                <span className="text-lime font-grotesk font-bold">{s.score}%</span>
                            </div>
                            <div className="h-1.5 bg-dark-300 border border-dark-200">
                                <div className="h-full bg-lime" style={{ width: `${s.score}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Link href="/feedback" className="brutal-btn-primary text-xs py-3 text-center mt-auto">
                End Session →
            </Link>
        </div>
    );
}
