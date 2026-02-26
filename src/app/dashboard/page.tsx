"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import StatCard from "@/components/ui/StatCard";
import SessionRow from "@/components/ui/SessionRow";
import SkillBar from "@/components/ui/SkillBar";
import AuthGuard from "@/components/ui/AuthGuard";
import { Brain, TrendingUp, Clock, Zap, Flame, BarChart3, Loader2 } from "lucide-react";
import { sessionsApi, type Session } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { skills, upcomingTips } from "@/lib/constants";

export default function DashboardPage() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        sessionsApi.list()
            .then(setSessions)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Compute real stats from sessions
    const completed = sessions.filter(s => s.status === "completed");
    const avgScore = completed.length
        ? Math.round(completed.reduce((a, s) => a + (s.overall_score || 0), 0) / completed.length)
        : 0;
    const totalQuestions = sessions.reduce((a, s) => a + s.question_count, 0);

    const keyStats = [
        { label: "Total Sessions", val: String(sessions.length), icon: Brain, delta: "All time" },
        { label: "Avg Score", val: avgScore ? `${avgScore}%` : "—", icon: BarChart3, delta: completed.length ? `${completed.length} completed` : "No completed sessions" },
        { label: "Questions Answered", val: String(totalQuestions), icon: Flame, delta: "Across all rounds" },
        { label: "Completed", val: String(completed.length), icon: Clock, delta: "Sessions" },
    ];

    // Shape sessions for SessionRow (map backend -> component props)
    const sessionRows = sessions.map(s => ({
        role: s.role,
        company: s.level,
        date: new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        score: s.overall_score || 0,
        rounds: s.rounds,
    }));

    return (
        <AuthGuard>
            <div className="min-h-screen bg-dark">
                <Navbar />
                <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                        <div className="brutal-tag inline-block mb-3">Dashboard</div>
                        <h1 className="text-4xl md:text-5xl font-grotesk font-black text-white">
                            WELCOME BACK, <span className="text-lime">{user?.name?.split(" ")[0].toUpperCase() || "..."}</span> 👋
                        </h1>
                        <p className="text-white/50 mt-2">
                            {sessions.length === 0 ? "Start your first interview session below!" : `You have ${sessions.length} session${sessions.length !== 1 ? "s" : ""} total.`}
                        </p>
                    </motion.div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {keyStats.map((stat, i) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                                <StatCard label={stat.label} value={stat.val} icon={stat.icon} delta={stat.delta} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* Recent Sessions */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="lg:col-span-2 bg-card border-3 border-white shadow-brutal-white p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-grotesk font-black text-xl text-white">RECENT SESSIONS</h2>
                                <Link href="/setup" className="brutal-tag hover:bg-dark hover:text-lime transition-colors cursor-pointer">+ New</Link>
                            </div>

                            {loading && (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 text-lime animate-spin" />
                                </div>
                            )}
                            {error && <p className="text-red-400 text-sm font-grotesk">{error}</p>}
                            {!loading && sessions.length === 0 && (
                                <div className="text-center py-12">
                                    <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40 font-grotesk">No sessions yet. Start your first interview!</p>
                                    <Link href="/setup" className="brutal-btn-primary inline-flex mt-4 text-sm px-5 py-2 gap-2">
                                        <Zap className="w-4 h-4" /> Start Now
                                    </Link>
                                </div>
                            )}
                            {!loading && sessionRows.length > 0 && (
                                <div className="space-y-3">
                                    {sessionRows.map((s, i) => <SessionRow key={i} {...s} index={i} />)}
                                </div>
                            )}
                        </motion.div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Quick Start */}
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="bg-lime border-3 border-dark shadow-[4px_4px_0px_#000] p-6">
                                <h3 className="font-grotesk font-black text-dark text-lg mb-2">START NEW SESSION</h3>
                                <p className="text-dark/60 text-sm mb-5">Upload your resume + JD and practice with an AI interviewer.</p>
                                <Link href="/setup" className="bg-dark text-lime font-grotesk font-black border-3 border-dark px-5 py-3 flex items-center justify-center gap-2 hover:bg-dark/80 transition-colors text-sm uppercase">
                                    <Zap className="w-4 h-4" /> Start Now
                                </Link>
                            </motion.div>

                            {/* Skill Breakdown */}
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="bg-card border-3 border-white shadow-brutal-white p-6">
                                <h3 className="font-grotesk font-black text-white text-lg mb-5">SKILL BREAKDOWN</h3>
                                <div className="space-y-4">
                                    {skills.map(skill => <SkillBar key={skill.name} name={skill.name} score={skill.score} color={skill.color} />)}
                                </div>
                            </motion.div>

                            {/* AI Tips */}
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="bg-card border-3 border-lime shadow-brutal p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-lime" />
                                    <h3 className="font-grotesk font-black text-white text-lg">AI TIPS</h3>
                                </div>
                                <ul className="space-y-3">
                                    {upcomingTips.map((tip, i) => (
                                        <li key={i} className="flex gap-2 text-xs text-white/60 leading-relaxed">
                                            <span className="text-lime font-black mt-0.5">→</span>{tip}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
