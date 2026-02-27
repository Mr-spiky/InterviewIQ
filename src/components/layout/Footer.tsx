"use client";

import Link from "next/link";
import { Brain, Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#" },
        { label: "Dashboard", href: "/dashboard" },
    ],
    Company: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact", href: "#" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-dark border-t-3 border-lime mt-0">
            {/* Marquee top strip */}
            <div className="bg-lime overflow-hidden py-2 border-b-3 border-dark">
                <div className="flex animate-marquee whitespace-nowrap">
                    {Array(8).fill(0).map((_, i) => (
                        <span key={i} className="text-dark font-grotesk font-black text-sm uppercase tracking-widest mx-8">
                            THINK • PRACTICE • IMPROVE • ACE YOUR INTERVIEW •
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-lime border-3 border-dark flex items-center justify-center shadow-brutal-dark">
                                <Brain className="w-5 h-5 text-dark" />
                            </div>
                            <span className="font-grotesk font-bold text-xl text-white">
                                Interview<span className="text-lime">IQ</span>
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            The world&apos;s most advanced AI mock interviewer. Practice smarter, land your dream role faster.
                        </p>
                        <div className="flex gap-3 mt-6">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 border-3 border-white flex items-center justify-center text-white hover:bg-lime hover:text-dark hover:border-dark transition-all duration-150"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Groups */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group}>
                            <h4 className="font-grotesk font-bold text-lime uppercase tracking-widest text-xs mb-4">
                                {group}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors duration-200">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t-3 border-dark-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm font-grotesk">
                        © 2026 InterviewIQ by TRAE. All rights reserved.
                    </p>
                    <div className="brutal-tag">
                        Built for Hackathon 🚀
                    </div>
                </div>
            </div>
        </footer>
    );
}
