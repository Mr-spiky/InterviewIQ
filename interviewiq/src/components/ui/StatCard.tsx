import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    delta?: string;
    variant?: "lime" | "white";
}

/**
 * StatCard — a single metric card showing a value, label, icon, and optional delta.
 * Used on Dashboard and Landing page stats row.
 */
export default function StatCard({
    label,
    value,
    icon: Icon,
    delta,
    variant = "lime",
}: StatCardProps) {
    const border = variant === "lime" ? "border-lime shadow-brutal" : "border-white shadow-brutal-white";

    return (
        <div className={`bg-card border-3 ${border} p-5`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-white/50 text-xs font-grotesk uppercase tracking-wide">
                    {label}
                </span>
                <Icon className="w-4 h-4 text-lime" />
            </div>
            <div className="text-3xl font-grotesk font-black text-white mb-1">{value}</div>
            {delta && <div className="text-xs text-lime font-grotesk">{delta}</div>}
        </div>
    );
}
