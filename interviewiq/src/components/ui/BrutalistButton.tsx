import { ReactNode } from "react";
import Link from "next/link";

interface BrutalistButtonProps {
    children: ReactNode;
    variant?: "primary" | "outline" | "dark";
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit";
    /** Render as a full-width block */
    block?: boolean;
}

/**
 * BrutalistButton — thick-bordered Neo-Brutalist button.
 * - `primary`: lime bg, black border/shadow
 * - `outline`: transparent bg, white border/shadow
 * - `dark`: dark bg, lime text, dark border
 *
 * Pass `href` to render as a Next.js Link instead of a button.
 */
export default function BrutalistButton({
    children,
    variant = "primary",
    href,
    onClick,
    disabled = false,
    className = "",
    type = "button",
    block = false,
}: BrutalistButtonProps) {
    const base =
        "font-grotesk font-bold uppercase tracking-wide transition-all duration-150 flex items-center justify-center gap-2 text-sm px-6 py-3";

    const variants = {
        primary:
            "bg-lime text-dark border-3 border-dark shadow-brutal-dark hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        outline:
            "bg-transparent text-white border-3 border-white shadow-brutal-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:bg-white hover:text-dark",
        dark:
            "bg-dark text-lime border-3 border-dark shadow-brutal-dark hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
    };

    const disabledCls = disabled
        ? "opacity-40 pointer-events-none cursor-not-allowed"
        : "";
    const blockCls = block ? "w-full" : "inline-flex";

    const allCls = [base, variants[variant], disabledCls, blockCls, className]
        .filter(Boolean)
        .join(" ");

    if (href) {
        return (
            <Link href={href} className={allCls}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={allCls}>
            {children}
        </button>
    );
}
