"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, Zap, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const publicLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "For Who", href: "#targets" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-dark border-b-3 border-lime" : "bg-transparent border-b-3 border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-lime border-3 border-dark flex items-center justify-center shadow-brutal-dark group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all duration-150">
                            <Brain className="w-5 h-5 text-dark" />
                        </div>
                        <span className="font-grotesk font-bold text-xl text-white">
                            Interview<span className="text-lime">IQ</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-grotesk font-medium text-white/70 hover:text-lime transition-colors duration-200 uppercase tracking-wide"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                href="/dashboard"
                                className="text-sm font-grotesk font-medium text-white/70 hover:text-lime transition-colors duration-200 uppercase tracking-wide flex items-center gap-1"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Auth CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                {/* User pill */}
                                <div className="flex items-center gap-2 border-3 border-dark-300 px-3 py-1.5">
                                    <div className="w-6 h-6 bg-lime border-2 border-dark flex items-center justify-center">
                                        <User className="w-3 h-3 text-dark" />
                                    </div>
                                    <span className="text-white text-xs font-grotesk font-bold">
                                        {user.name.split(" ")[0].toUpperCase()}
                                    </span>
                                </div>
                                <Link href="/setup" className="brutal-btn-primary text-sm px-5 py-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> New Interview
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-white/40 hover:text-red-400 transition-colors p-2"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-grotesk font-bold text-white/70 hover:text-lime uppercase tracking-wide transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="brutal-btn-primary text-sm px-5 py-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-white border-3 border-white p-2"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-dark border-b-3 border-lime"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {publicLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-sm font-grotesk font-bold text-white uppercase tracking-wide py-2 border-b border-dark-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-grotesk font-bold text-white uppercase tracking-wide py-2 border-b border-dark-200">Dashboard</Link>
                                    <Link href="/setup" className="brutal-btn-primary w-full text-center block mt-4">New Interview</Link>
                                    <button onClick={logout} className="text-red-400 text-sm font-grotesk mt-2 w-full text-center">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-grotesk font-bold text-white/70 uppercase tracking-wide py-2">Login</Link>
                                    <Link href="/register" className="brutal-btn-primary w-full text-center block mt-4">Get Started Free</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
