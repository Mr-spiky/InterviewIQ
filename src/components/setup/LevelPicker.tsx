import type { Level } from "@/lib/constants";

interface LevelPickerProps {
    levels: Level[];
    selected: string;
    onChange: (val: string) => void;
}

export default function LevelPicker({ levels, selected, onChange }: LevelPickerProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {levels.map(l => (
                <button
                    key={l.val}
                    onClick={() => onChange(l.val)}
                    className={`p-2 border-3 text-left transition-all duration-150 ${selected === l.val
                            ? "border-lime bg-lime/10 shadow-brutal"
                            : "border-dark-300 hover:border-white"
                        }`}
                >
                    <div className="font-grotesk font-bold text-white text-xs">{l.label}</div>
                    <div className="text-white/40 text-[10px]">{l.sub}</div>
                </button>
            ))}
        </div>
    );
}
