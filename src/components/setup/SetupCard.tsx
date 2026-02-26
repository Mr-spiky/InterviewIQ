import { ReactNode } from "react";

interface SetupCardProps {
    step: number;
    title: string;
    children: ReactNode;
    className?: string;
}

/**
 * SetupCard — numbered wrapper for each setup step section.
 */
export default function SetupCard({ step, title, children, className = "" }: SetupCardProps) {
    return (
        <div className={`bg-card border-3 border-white shadow-brutal-white p-6 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-lime border-2 border-dark flex items-center justify-center">
                    <span className="text-dark text-xs font-black">{step}</span>
                </div>
                <h2 className="font-grotesk font-black text-white text-lg">{title}</h2>
            </div>
            {children}
        </div>
    );
}
