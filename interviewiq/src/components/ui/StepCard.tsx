"use client";

import { motion, type Variants } from "framer-motion";
import type { Step } from "@/lib/constants";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
};

interface StepCardProps extends Step {
    index: number;
}

export default function StepCard({ num, title, desc, icon: Icon, index }: StepCardProps) {
    return (
        <motion.div
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative z-10 bg-card border-3 border-lime shadow-brutal p-8 text-center"
        >
            <div className="w-16 h-16 bg-lime border-3 border-dark shadow-brutal-dark flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8 text-dark" />
            </div>
            <div className="text-5xl font-grotesk font-black text-white/10 mb-2">{num}</div>
            <h3 className="text-xl font-grotesk font-bold text-white mb-3">{title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}
