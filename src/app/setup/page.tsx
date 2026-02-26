"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import SetupCard from "@/components/setup/SetupCard";
import ResumeUpload from "@/components/setup/ResumeUpload";
import LevelPicker from "@/components/setup/LevelPicker";
import RoundTypePicker from "@/components/setup/RoundTypePicker";
import AuthGuard from "@/components/ui/AuthGuard";
import { Brain, Zap, ChevronDown, Loader2 } from "lucide-react";
import { roles, levels, roundTypes } from "@/lib/constants";
import { sessionsApi } from "@/lib/api";

export default function SetupPage() {
    const router = useRouter();
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jd, setJd] = useState("");
    const [role, setRole] = useState("");
    const [level, setLevel] = useState("");
    const [rounds, setRounds] = useState<string[]>(["technical", "behavioral"]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const toggleRound = (id: string) => {
        setRounds(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const canProceed = jd.trim() && role && level && rounds.length > 0;

    const handleStart = async () => {
        if (!canProceed) return;
        setError("");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("role", role);
            formData.append("level", level);
            formData.append("rounds", rounds.join(","));
            formData.append("job_description", jd);
            if (resumeFile) formData.append("resume", resumeFile);

            const session = await sessionsApi.start(formData);
            router.push(`/interview?session=${session.id}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to start session");
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-dark">
                <Navbar />
                <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                        <div className="brutal-tag inline-block mb-3">Setup</div>
                        <h1 className="text-4xl md:text-5xl font-grotesk font-black text-white">
                            PERSONALIZE YOUR <br /><span className="text-lime">INTERVIEW</span>
                        </h1>
                        <p className="text-white/50 mt-3">Fill in the details — the AI will tailor every question to your profile.</p>
                    </motion.div>

                    {error && (
                        <div className="bg-red-500/10 border-3 border-red-500 text-red-400 text-sm font-grotesk p-3 mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Resume Upload */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <SetupCard step={1} title="UPLOAD RESUME (OPTIONAL)">
                                <ResumeUpload file={resumeFile} onFileChange={setResumeFile} />
                            </SetupCard>
                        </motion.div>

                        {/* Job Description */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <SetupCard step={2} title="JOB DESCRIPTION">
                                <textarea
                                    value={jd}
                                    onChange={e => setJd(e.target.value)}
                                    placeholder="Paste the full job description here — role requirements, responsibilities, skills needed..."
                                    rows={6}
                                    className="w-full bg-dark border-3 border-dark-300 focus:border-lime text-white/80 text-sm p-4 resize-none outline-none transition-colors duration-200 font-inter placeholder:text-white/30"
                                />
                                <div className="text-right text-white/30 text-xs mt-1">{jd.length} chars</div>
                            </SetupCard>
                        </motion.div>

                        {/* Role & Level */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <SetupCard step={3} title="ROLE & EXPERIENCE">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="text-white/50 text-xs font-grotesk uppercase tracking-wide block mb-2">Target Role</label>
                                        <div className="relative">
                                            <select
                                                value={role}
                                                onChange={e => setRole(e.target.value)}
                                                className="w-full bg-dark border-3 border-dark-300 focus:border-lime text-white p-3 pr-10 outline-none appearance-none font-grotesk text-sm"
                                            >
                                                <option value="">Select a role...</option>
                                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-xs font-grotesk uppercase tracking-wide block mb-2">Experience Level</label>
                                        <LevelPicker levels={levels} selected={level} onChange={setLevel} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs font-grotesk uppercase tracking-wide block mb-3">
                                        Round Types <span className="text-lime">(select all that apply)</span>
                                    </label>
                                    <RoundTypePicker roundTypes={roundTypes} selected={rounds} onToggle={toggleRound} />
                                </div>
                            </SetupCard>
                        </motion.div>

                        {/* Start Button */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <button
                                onClick={handleStart}
                                disabled={!canProceed || loading}
                                className={`w-full flex items-center justify-center gap-3 font-grotesk font-black text-lg py-5 uppercase tracking-wide transition-all duration-150 border-3 ${canProceed && !loading
                                        ? "bg-lime text-dark border-dark shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer"
                                        : "bg-dark-200 text-white/30 border-dark-300 cursor-not-allowed"
                                    }`}
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Generating Your Interview Plan...</>
                                ) : (
                                    <><Brain className="w-6 h-6" /> Generate Interview Plan <Zap className="w-5 h-5" /></>
                                )}
                            </button>
                            {!canProceed && !loading && (
                                <p className="text-white/30 text-xs text-center mt-2 font-grotesk">Complete JD, role, level, and at least one round to continue</p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
