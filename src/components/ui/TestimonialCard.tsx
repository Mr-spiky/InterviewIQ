"use client";

import { motion, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/constants";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
};

interface TestimonialCardProps extends Testimonial {
    index: number;
}

export default function TestimonialCard({ quote, name, role, stars, index }: TestimonialCardProps) {
    return (
        <motion.div
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-card border-3 border-white shadow-brutal-white p-8"
        >
            <div className="flex gap-1 mb-4">
                {Array(stars).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-lime text-lime" />
                ))}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 italic">
                &ldquo;{quote}&rdquo;
            </p>
            <div className="border-t-3 border-dark-200 pt-4">
                <div className="font-grotesk font-bold text-white">{name}</div>
                <div className="text-lime text-xs font-grotesk uppercase tracking-wide">{role}</div>
            </div>
        </motion.div>
    );
}
