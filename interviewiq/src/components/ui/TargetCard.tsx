"use client";

import { motion, type Variants } from "framer-motion";
import type { Target } from "@/lib/constants";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
};

interface TargetCardProps extends Target {
    index: number;
}

export default function TargetCard({ title, desc, icon: Icon, color, shadow, index }: TargetCardProps) {
    return (
        <motion.div
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className={`bg-card border-3 ${color} ${shadow} p-8 flex gap-6`}
        >
            <div className="w-14 h-14 bg-lime border-3 border-dark flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-dark" />
            </div>
            <div>
                <h3 className="text-xl font-grotesk font-black text-white uppercase mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
}
