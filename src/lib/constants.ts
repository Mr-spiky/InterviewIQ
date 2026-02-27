import {
    Upload, Brain, BarChart3, Target, Users, Building2,
    GraduationCap, FileText, Mic, TrendingUp, Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Landing Page ───────────────────────────────────────────────────────────

export const marqueeItems = [
    "THINK •", "PRACTICE •", "IMPROVE •", "ACE YOUR INTERVIEW •",
    "BEAT THE AI •", "LAND THE JOB •", "LEVEL UP •",
];

export const marqueeItemsReverse = [
    "BEHAVIORAL ROUND •", "TECHNICAL DEPTH •", "SITUATIONAL JUDGEMENT •",
    "CASE STUDY •", "LEADERSHIP Q •",
];

export interface Phase {
    tag: string;
    title: string;
    color: string;
    tagColor: string;
    icon: LucideIcon;
    features: string[];
}

export const phases: Phase[] = [
    {
        tag: "Pre-Interview",
        title: "Personalized Plan",
        color: "border-lime shadow-brutal",
        tagColor: "bg-lime text-dark",
        icon: FileText,
        features: [
            "Parse resume & job description",
            "Map skills vs role requirements",
            "Generate tailored interview plan",
            "Set round types & difficulty level",
        ],
    },
    {
        tag: "Live Interview",
        title: "Adaptive AI Agent",
        color: "border-white shadow-brutal-white",
        tagColor: "bg-white text-dark",
        icon: Brain,
        features: [
            "Dynamic question generation",
            "Detect weak & strong answers",
            "Probe deeper on vague responses",
            "Behavioral, technical & situational rounds",
        ],
    },
    {
        tag: "Post Interview",
        title: "Structured Feedback",
        color: "border-lime shadow-brutal",
        tagColor: "bg-lime text-dark",
        icon: BarChart3,
        features: [
            "Communication & clarity scores",
            "Technical depth evaluation",
            "Confidence & behavioral signals",
            "Actionable improvement tips",
        ],
    },
];

export interface Step {
    num: string;
    title: string;
    desc: string;
    icon: LucideIcon;
}

export const steps: Step[] = [
    {
        num: "01",
        title: "Upload Resume + JD",
        desc: "Paste your resume and job description. Our AI parses everything to understand exactly what the role needs.",
        icon: Upload,
    },
    {
        num: "02",
        title: "AI Conducts Interview",
        desc: "A live conversational AI interviewer adapts in real-time — asking follow-ups, probing depth, raising difficulty.",
        icon: Mic,
    },
    {
        num: "03",
        title: "Get Actionable Feedback",
        desc: "Receive a structured performance report with scores, strengths, gaps, and a personalized improvement roadmap.",
        icon: TrendingUp,
    },
];

export interface Stat {
    val: string;
    label: string;
}

export const stats: Stat[] = [
    { val: "10K+", label: "Interviews Conducted" },
    { val: "50+", label: "Job Roles Covered" },
    { val: "95%", label: "Satisfaction Rate" },
    { val: "3x", label: "Faster Interview Prep" },
];

export interface Target {
    title: string;
    desc: string;
    icon: LucideIcon;
    color: string;
    shadow: string;
}

export const targets: Target[] = [
    {
        title: "Job Seekers",
        desc: "24/7 access to realistic, personalized interview practice at near-zero cost — no human coach needed.",
        icon: Users,
        color: "border-lime",
        shadow: "shadow-brutal",
    },
    {
        title: "Fresh Graduates",
        desc: "Overcome the experience gap. AI adapts to your background and builds skills progressively.",
        icon: GraduationCap,
        color: "border-white",
        shadow: "shadow-brutal-white",
    },
    {
        title: "Universities",
        desc: "Integrate into placement programs to train hundreds of students simultaneously at zero marginal cost.",
        icon: Building2,
        color: "border-lime",
        shadow: "shadow-brutal",
    },
    {
        title: "HR Teams",
        desc: "Pre-screen candidates with AI interviews before human rounds, reducing time-to-hire.",
        icon: Shield,
        color: "border-white",
        shadow: "shadow-brutal-white",
    },
];

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    stars: number;
}

export const testimonials: Testimonial[] = [
    {
        quote: "InterviewIQ helped me land a role at a FAANG company. The AI was brutally honest and exactly what I needed.",
        name: "Arjun Sharma",
        role: "SWE at Google",
        stars: 5,
    },
    {
        quote: "I practiced 15 interviews in 3 days before my placement season. The feedback reports are incredibly detailed.",
        name: "Priya Mehta",
        role: "Product Manager at Razorpay",
        stars: 5,
    },
    {
        quote: "Our placement cell adopted InterviewIQ for 200+ students. The improvement in offer metrics was measurable.",
        name: "Prof. Rajesh Kumar",
        role: "Placement Head, IIT Roorkee",
        stars: 5,
    },
];

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface Session {
    role: string;
    company: string;
    date: string;
    score: number;
    rounds: string[];
    status: string;
}

export const recentSessions: Session[] = [
    { role: "Frontend Engineer", company: "Google", date: "Today", score: 82, rounds: ["Technical", "Behavioral"], status: "Completed" },
    { role: "Product Manager", company: "Razorpay", date: "Yesterday", score: 74, rounds: ["Case Study", "Leadership"], status: "Completed" },
    { role: "Data Scientist", company: "Meta", date: "3 days ago", score: 91, rounds: ["Technical", "System Design"], status: "Completed" },
    { role: "Backend Engineer", company: "Stripe", date: "5 days ago", score: 68, rounds: ["Technical", "Behavioral"], status: "Completed" },
];

export interface Skill {
    name: string;
    score: number;
    color: string;
}

export const skills: Skill[] = [
    { name: "Communication", score: 85, color: "bg-lime" },
    { name: "Technical Depth", score: 72, color: "bg-white" },
    { name: "Confidence", score: 78, color: "bg-lime" },
    { name: "Problem Solving", score: 90, color: "bg-white" },
];

export const upcomingTips: string[] = [
    "Practice system design questions — your weakest area",
    "Review STAR method for behavioral rounds",
    "Work on concise answers — avg response too long",
];

// ─── Setup ───────────────────────────────────────────────────────────────────

export const roles: string[] = [
    "Software Engineer", "Frontend Engineer", "Backend Engineer", "Full Stack Engineer",
    "Product Manager", "Data Scientist", "ML Engineer", "DevOps Engineer",
    "UI/UX Designer", "Data Analyst", "System Architect", "QA Engineer",
];

export interface Level {
    val: string;
    label: string;
    sub: string;
}

export const levels: Level[] = [
    { val: "entry", label: "Entry Level", sub: "0–2 years" },
    { val: "mid", label: "Mid Level", sub: "2–5 years" },
    { val: "senior", label: "Senior Level", sub: "5–10 years" },
    { val: "lead", label: "Lead / Staff", sub: "10+ years" },
];

export interface RoundType {
    id: string;
    label: string;
    icon: string;
}

export const roundTypes: RoundType[] = [
    { id: "technical", label: "Technical", icon: "⚙️" },
    { id: "behavioral", label: "Behavioral", icon: "🧠" },
    { id: "case", label: "Case Study", icon: "📊" },
    { id: "system", label: "System Design", icon: "🏗️" },
];

// ─── Feedback ─────────────────────────────────────────────────────────────────

export interface ScoreCategory {
    label: string;
    score: number;
    max: number;
    color: string;
    desc: string;
}

export const scoreCategories: ScoreCategory[] = [
    { label: "Communication & Clarity", score: 82, max: 100, color: "bg-lime", desc: "Clear articulation with good structure. Minor filler words noticed." },
    { label: "Technical Depth", score: 74, max: 100, color: "bg-white", desc: "Good fundamentals, but missed mentioning time complexity trade-offs." },
    { label: "Confidence & Delivery", score: 79, max: 100, color: "bg-lime", desc: "Steady pace. Could improve eye contact simulation through concise answers." },
    { label: "Behavioral Signals", score: 88, max: 100, color: "bg-white", desc: "Excellent use of STAR method. Strong ownership language throughout." },
];

export const strengths: string[] = [
    "Excellent STAR method usage in behavioral responses",
    "Strong ownership language and accountability mindset",
    "Clear problem decomposition approach",
    "Good communication of complex technical concepts",
];

export const improvements: string[] = [
    "Include time/space complexity in technical answers",
    "Reduce filler words (noticed 'um', 'like' frequently)",
    "Add specific quantifiable metrics to project stories",
    "Structure system design answers top-down",
];

export interface TranscriptEntry {
    q: string;
    a: string;
    score: number;
}

export const transcript: TranscriptEntry[] = [
    {
        q: "Tell me about yourself and your most impactful technical project.",
        a: "I'm a full-stack engineer with 4 years of experience. My most impactful project was building a real-time collaboration tool that reduced latency by 40% using CRDT algorithms...",
        score: 85,
    },
    {
        q: "Describe a time you disagreed with a technical decision. How did you handle it?",
        a: "At my previous company, we were debating between microservices vs monolith. I wrote a 3-page RFC comparing trade-offs and presented it...",
        score: 90,
    },
    {
        q: "Walk me through how you'd optimize a React app that's painfully slow.",
        a: "I'd start by profiling with Chrome DevTools, then look at unnecessary re-renders using React DevTools, then apply memoization strategies...",
        score: 72,
    },
];

// ─── Interview ────────────────────────────────────────────────────────────────

export const aiResponses: string[] = [
    "Interesting. Can you dive deeper into the performance optimization you mentioned? What specific metrics did you achieve?",
    "That's a solid approach. Now, how would you handle a scenario where your solution needs to scale to 10 million concurrent users?",
    "Good point. Let's pivot to a behavioral question — describe a time you had a major disagreement with your team. How did you resolve it?",
    "I see you used React Query. Walk me through why you chose it over Redux Toolkit for state management in that project.",
];
