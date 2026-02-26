interface SkillBarProps {
    name: string;
    score: number;
    color?: string;
}

/**
 * SkillBar — simple labeled progress bar.
 * Used in Dashboard skill breakdown and similar contexts.
 */
export default function SkillBar({ name, score, color = "bg-lime" }: SkillBarProps) {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-white/60 text-xs font-grotesk uppercase tracking-wide">{name}</span>
                <span className="text-lime text-xs font-grotesk font-bold">{score}%</span>
            </div>
            <div className="h-2 bg-dark-200 border border-dark-300">
                <div
                    className={`h-full ${color} transition-all duration-1000`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}
