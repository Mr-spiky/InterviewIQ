import { CheckCircle } from "lucide-react";
import type { RoundType } from "@/lib/constants";

interface RoundTypePickerProps {
    roundTypes: RoundType[];
    selected: string[];
    onToggle: (id: string) => void;
}

export default function RoundTypePicker({ roundTypes, selected, onToggle }: RoundTypePickerProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {roundTypes.map(rt => (
                <button
                    key={rt.id}
                    onClick={() => onToggle(rt.id)}
                    className={`p-3 border-3 text-center transition-all duration-150 ${selected.includes(rt.id)
                            ? "border-lime bg-lime/10 shadow-brutal"
                            : "border-dark-300 hover:border-white"
                        }`}
                >
                    <div className="text-2xl mb-1">{rt.icon}</div>
                    <div className="font-grotesk font-bold text-white text-xs">{rt.label}</div>
                    {selected.includes(rt.id) && <CheckCircle className="w-3 h-3 text-lime mx-auto mt-1" />}
                </button>
            ))}
        </div>
    );
}
