"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Marquee from "@/components/ui/Marquee";
import SectionHeader from "@/components/ui/SectionHeader";
import GridBackground from "@/components/ui/GridBackground";
import PhaseCard from "@/components/ui/PhaseCard";
import StepCard from "@/components/ui/StepCard";
import TargetCard from "@/components/ui/TargetCard";
import TestimonialCard from "@/components/ui/TestimonialCard";
import {
  Zap, Target, CheckCircle, Clock, Shield,
  FileText, Mic, BarChart3,
} from "lucide-react";
import {
  marqueeItems, marqueeItemsReverse,
  phases, steps, stats, targets, testimonials,
} from "@/lib/constants";

const heroFloatCards = [
  { label: "Pre-Interview", sub: "Personalized Plan", icon: FileText },
  { label: "Live Interview", sub: "Adaptive AI Agent", icon: Mic },
  { label: "Post Interview", sub: "Structured Feedback", icon: BarChart3 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      {/* ───── HERO ───── */}
      <GridBackground cellSize={48} lineOpacity={0.06} className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border-3 border-lime bg-lime/10 px-4 py-2 mb-8"
          >
            <Zap className="w-4 h-4 text-lime" />
            <span className="text-lime font-grotesk font-bold text-sm uppercase tracking-widest">
              Powered by Claude AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-grotesk font-black text-white leading-[0.9] mb-6"
          >
            CRACK{" "}
            <span className="relative inline-block">
              <span className="text-lime">ANY</span>
            </span>
            <br />
            INTERVIEW.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            An end-to-end AI mock interview platform that autonomously conducts
            personalized interviews tailored to your resume, target role, and
            experience level — going beyond scripted Q&A.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/setup" className="brutal-btn-primary flex items-center gap-2 text-base px-8 py-4">
              <Zap className="w-5 h-5" />
              Start Free Interview
            </Link>
            <Link href="#how-it-works" className="brutal-btn-outline flex items-center gap-2 text-base px-8 py-4">
              How It Works
            </Link>
          </motion.div>

          {/* Floating Phase Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {heroFloatCards.map((card, i) => (
              <motion.div
                key={card.label}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                className="bg-card border-3 border-lime shadow-brutal p-4 text-left"
              >
                <card.icon className="w-6 h-6 text-lime mb-2" />
                <div className="text-xs font-grotesk font-bold text-lime uppercase tracking-widest mb-1">
                  {card.label}
                </div>
                <div className="text-white font-grotesk font-bold text-sm">{card.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </GridBackground>

      {/* ───── MARQUEE ───── */}
      <div className="border-y-3 border-lime bg-lime">
        <Marquee
          items={marqueeItems}
          itemClassName="text-dark font-grotesk font-black text-sm uppercase tracking-widest"
        />
      </div>

      {/* ───── STATS ───── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="bg-card border-3 border-white shadow-brutal-white p-6 text-center"
            >
              <div className="text-4xl font-grotesk font-black text-lime">{stat.val}</div>
              <div className="text-white/60 text-sm mt-1 font-grotesk">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Process"
            title={<>HOW IT <span className="text-lime">WORKS</span></>}
          />
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-[3px] bg-lime z-0" />
            {steps.map((step, i) => (
              <StepCard key={step.num} {...step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="features" className="py-24 px-4 bg-dark-50/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Features"
            title={<>COMPLETE <span className="text-lime">PIPELINE</span></>}
            subtitle="Every stage of interview preparation covered — from personalized planning to live practice to actionable feedback."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase, i) => (
              <PhaseCard key={phase.tag} {...phase} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── REVERSE MARQUEE ───── */}
      <div className="border-y-3 border-white bg-transparent overflow-hidden py-3">
        <Marquee
          items={marqueeItemsReverse}
          reverse
          itemClassName="text-white/40 font-grotesk font-bold text-sm uppercase tracking-widest"
        />
      </div>

      {/* ───── TARGET AUDIENCES ───── */}
      <section id="targets" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Who It's For"
            title={<>BUILT FOR <span className="text-lime">EVERYONE</span></>}
          />
          <div className="grid sm:grid-cols-2 gap-6">
            {targets.map((t, i) => (
              <TargetCard key={t.title} {...t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="py-24 px-4 bg-dark-50/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Social Proof"
            title={<>REAL <span className="text-lime">RESULTS</span></>}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} {...t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA BANNER ───── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-lime border-3 border-dark shadow-[8px_8px_0px_#000] p-12 text-center"
          >
            <div className="inline-block bg-dark border-3 border-dark text-lime px-3 py-1 text-xs font-grotesk font-black uppercase tracking-widest mb-6">
              Free to Start
            </div>
            <h2 className="text-4xl md:text-6xl font-grotesk font-black text-dark mb-4">
              READY TO ACE<br />YOUR INTERVIEW?
            </h2>
            <p className="text-dark/70 text-lg mb-8 max-w-xl mx-auto">
              3 free sessions per month. No credit card required. Start practicing in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/setup"
                className="bg-dark text-lime font-grotesk font-black border-3 border-dark shadow-[4px_4px_0px_#fff] px-8 py-4 uppercase tracking-wide hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 flex items-center gap-2 justify-center text-base"
              >
                <Zap className="w-5 h-5" />
                Start Free Interview
              </Link>
              <Link
                href="/dashboard"
                className="bg-transparent text-dark font-grotesk font-black border-3 border-dark px-8 py-4 uppercase tracking-wide hover:bg-dark hover:text-lime transition-all duration-150 flex items-center gap-2 justify-center text-base"
              >
                <Target className="w-5 h-5" />
                View Dashboard
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-dark/60 text-sm">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> No credit card</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Ready in 60 sec</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Privacy first</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
