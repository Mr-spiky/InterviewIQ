import { ReactNode } from "react";

interface BrutalistCardProps {
    children: ReactNode;
    className?: string;
    /** "lime" uses lime border+shadow, "white" uses white border+shadow */
    variant?: "lime" | "white";
    hover?: boolean;
    onClick?: () => void;
}

/**
 * BrutalistCard — reusable thick-border card with hard box-shadow.
 * Use `variant="lime"` (default) or `variant="white"`.
 */
export default function BrutalistCard({
    children,
    className = "",
    variant = "lime",
    hover = true,
    onClick,
}: BrutalistCardProps) {
    const styles = {
        lime: "border-lime shadow-brutal",
        white: "border-white shadow-brutal-white",
    };

    return (
        <div
            onClick={onClick}
            className={[
                "bg-card border-3 p-6",
                styles[variant],
                hover ? "transition-transform duration-200 hover:-translate-y-1" : "",
                onClick ? "cursor-pointer" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </div>
    );
}
