"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { Phase } from "@/lib/constants";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
};

interface PhaseCardProps extends Phase {
    index: number;
}

export default function PhaseCard({ tag, tagColor, title, icon: Icon, features, color, index }: PhaseCardProps) {
    return (
        <motion.div
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className={`bg-card border-3 ${color} p-8 hover:-translate-y-1 transition-transform duration-200`}
        >
            <div className={`inline-block ${tagColor} px-3 py-1 text-xs font-grotesk font-black uppercase tracking-widest border-2 border-dark mb-4`}>
                {tag}
            </div>
            <Icon className="w-8 h-8 text-lime mb-2" />
            <h3 className="text-2xl font-grotesk font-black text-white mb-6 underline decoration-lime">
                {title}
            </h3>
            <ul className="space-y-3">
                {features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-white/70 text-sm">
                        <CheckCircle className="w-4 h-4 text-lime mt-0.5 shrink-0" />
                        {feat}
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}
