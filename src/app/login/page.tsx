"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Brain, Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-lime border-3 border-dark flex items-center justify-center">
                        <Brain className="w-5 h-5 text-dark" />
                    </div>
                    <span className="font-grotesk font-black text-white text-2xl">
                        Interview<span className="text-lime">IQ</span>
                    </span>
                </div>

                {/* Card */}
                <div className="bg-card border-3 border-lime shadow-brutal p-8">
                    <div className="brutal-tag inline-block mb-2">Welcome Back</div>
                    <h1 className="text-3xl font-grotesk font-black text-white mb-6">SIGN IN</h1>

                    {error && (
                        <div className="bg-red-500/10 border-3 border-red-500 text-red-400 text-sm font-grotesk p-3 mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-white/50 text-xs font-grotesk uppercase tracking-wide block mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full bg-dark border-3 border-dark-300 focus:border-lime text-white p-3 outline-none transition-colors font-inter placeholder:text-white/30"
                            />
                        </div>

                        <div>
                            <label className="text-white/50 text-xs font-grotesk uppercase tracking-wide block mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-dark border-3 border-dark-300 focus:border-lime text-white p-3 pr-10 outline-none transition-colors font-inter placeholder:text-white/30"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-lime text-dark font-grotesk font-black border-3 border-dark shadow-brutal-dark py-4 uppercase tracking-wide flex items-center justify-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? "Signing in..." : <><Zap className="w-4 h-4" /> Sign In</>}
                        </button>
                    </form>

                    <p className="text-white/40 text-sm text-center mt-6 font-grotesk">
                        No account?{" "}
                        <Link href="/register" className="text-lime hover:underline font-bold">
                            Create one free →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
