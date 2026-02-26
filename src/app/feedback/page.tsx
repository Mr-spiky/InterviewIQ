"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/ui/AuthGuard";
import ScoreRing from "@/components/ui/ScoreRing";
import ScoreBar from "@/components/ui/ScoreBar";
import TranscriptItem from "@/components/ui/TranscriptItem";
import Tabs from "@/components/ui/Tabs";
import { feedbackApi, type FeedbackReport } from "@/lib/api";
import {
    Download, RotateCcw, ArrowRight, CheckCircle, XCircle, Brain,
    Star, Target, Zap, TrendingUp, TrendingDown, Loader2,
} from "lucide-react";

const feedbackTabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "transcript", label: "📝 Transcript" },
];

function FeedbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session");
    const [report, setReport] = useState<FeedbackReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [openQ, setOpenQ] = useState<number | null>(null);

    useEffect(() => {
        if (!sessionId) { router.push("/dashboard"); return; }
        // First try to generate, fallback to get if already generated
        feedbackApi.generate(sessionId)
            .then(setReport)
            .catch(() => feedbackApi.get(sessionId).then(setReport))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="flex flex-col items-center gap-5 text-center">
                    <div className="w-16 h-16 bg-lime border-3 border-dark flex items-center justify-center animate-pulse">
                        <Brain className="w-8 h-8 text-dark" />
                    </div>
                    <p className="text-white font-grotesk font-bold text-lg">Generating your feedback report...</p>
                    <p className="text-white/40 text-sm">Analyzing your full interview transcript with AI</p>
                    <Loader2 className="w-6 h-6 text-lime animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 font-grotesk mb-4">{error || "Failed to load report"}</p>
                    <Link href="/dashboard" className="brutal-btn-primary px-6 py-3">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    const categoryScores = Object.entries(report.category_scores || {}).map(([label, score]) => ({ label, score }));

    return (
        <div className="min-h-screen bg-dark">
            {/* Top Bar */}
            <div className="bg-dark border-b-3 border-lime px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-lime border-3 border-dark flex items-center justify-center">
                        <Brain className="w-4 h-4 text-dark" />
                    </div>
                    <span className="font-grotesk font-black text-white text-sm">
                        Interview<span className="text-lime">IQ</span> — FEEDBACK REPORT
                    </span>
                </div>
                <div className="flex gap-3">
                    <button className="brutal-btn-outline text-xs px-4 py-2 flex items-center gap-1">
                        <Download className="w-3 h-3" /> Export PDF
                    </button>
                    <Link href="/setup" className="brutal-btn-primary text-xs px-4 py-2 flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> New Session
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Hero Score */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-card border-3 border-lime shadow-brutal p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <ScoreRing score={report.overall_score} />
                    <div className="flex-1 text-center md:text-left">
                        <div className="brutal-tag inline-block mb-3">Session Complete</div>
                        <h1 className="text-3xl md:text-5xl font-grotesk font-black text-white mb-2">
                            {report.overall_score >= 85 ? "EXCELLENT PERFORMANCE" : report.overall_score >= 70 ? "GOOD EFFORT" : "NEEDS IMPROVEMENT"}
                        </h1>
                        <p className="text-white/50 text-sm mb-4">{report.role} · {report.level} · {report.rounds.join(", ")}</p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="flex items-center gap-1 text-lime text-sm font-grotesk font-bold border-2 border-lime px-3 py-1">
                                <Star className="w-3 h-3 fill-lime" /> {report.recommendation}
                            </span>
                            <span className="flex items-center gap-1 text-white/60 text-sm font-grotesk border-2 border-dark-300 px-3 py-1">
                                <Target className="w-3 h-3" /> {report.transcript.filter(m => m.role === "user").length} Answers
                            </span>
                        </div>
                    </div>
                    {/* Score pills */}
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                        {categoryScores.map(cat => (
                            <div key={cat.label} className="bg-dark border-3 border-dark-200 p-3 text-center min-w-[90px]">
                                <div className={`text-2xl font-grotesk font-black ${cat.score >= 80 ? "text-lime" : cat.score >= 70 ? "text-yellow-400" : "text-red-400"}`}>
                                    {cat.score}
                                </div>
                                <div className="text-white/40 text-[10px] font-grotesk leading-tight mt-1">{cat.label.split(" ")[0]}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tabs */}
                <Tabs tabs={feedbackTabs} activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === "overview" && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Score Breakdown */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="font-grotesk font-black text-white text-xl mb-5">SCORE BREAKDOWN</h2>
                            {categoryScores.map((cat, i) => (
                                <motion.div key={cat.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                    <ScoreBar label={cat.label} score={cat.score} />
                                </motion.div>
                            ))}
                            {/* AI Summary */}
                            <div className="bg-card border-3 border-dark-200 p-5 mt-4">
                                <p className="text-white/60 text-sm leading-relaxed italic">&ldquo;{report.summary}&rdquo;</p>
                            </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="space-y-5">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="bg-card border-3 border-lime shadow-brutal p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-lime" />
                                    <h3 className="font-grotesk font-black text-white text-lg">STRENGTHS</h3>
                                </div>
                                <ul className="space-y-3">
                                    {report.strengths.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-white/70 leading-relaxed">
                                            <CheckCircle className="w-4 h-4 text-lime shrink-0 mt-0.5" />{s}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                className="bg-card border-3 border-white shadow-brutal-white p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingDown className="w-5 h-5 text-red-400" />
                                    <h3 className="font-grotesk font-black text-white text-lg">IMPROVE</h3>
                                </div>
                                <ul className="space-y-3">
                                    {report.improvements.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-white/70 leading-relaxed">
                                            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{s}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="bg-lime border-3 border-dark shadow-brutal-dark p-6 text-center">
                                <Zap className="w-8 h-8 text-dark mx-auto mb-3" />
                                <h3 className="font-grotesk font-black text-dark text-lg mb-2">READY FOR ROUND 2?</h3>
                                <Link href="/setup" className="bg-dark text-lime font-grotesk font-black border-3 border-dark px-5 py-3 flex items-center justify-center gap-2 text-sm hover:bg-dark/80 transition-colors mt-4">
                                    Practice Again <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                )}

                {activeTab === "transcript" && (
                    <div className="space-y-4">
                        <h2 className="font-grotesk font-black text-white text-xl mb-5">INTERVIEW TRANSCRIPT</h2>
                        {report.transcript
                            .filter(m => m.role === "user")
                            .map((item, i) => {
                                // Find the corresponding AI question before this answer
                                const aiMsg = report.transcript.filter(m => m.role === "ai")[i];
                                return (
                                    <TranscriptItem
                                        key={i}
                                        question={aiMsg?.content || `Question ${i + 1}`}
                                        answer={item.content}
                                        score={item.score || 0}
                                        index={i}
                                        isOpen={openQ === i}
                                        onToggle={() => setOpenQ(openQ === i ? null : i)}
                                    />
                                );
                            })}
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                    <Link href="/dashboard" className="brutal-btn-outline px-8 py-4 flex items-center gap-2 justify-center">
                        ← Back to Dashboard
                    </Link>
                    <Link href="/setup" className="brutal-btn-primary px-8 py-4 flex items-center gap-2 justify-center">
                        <Zap className="w-5 h-5" /> New Interview
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function FeedbackPage() {
    return (
        <AuthGuard>
            <Suspense>
                <FeedbackContent />
            </Suspense>
        </AuthGuard>
    );
}
