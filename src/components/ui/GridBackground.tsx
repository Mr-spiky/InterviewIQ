import { ReactNode } from "react";

interface GridBackgroundProps {
    children?: ReactNode;
    /** Cell size in px (default 48) */
    cellSize?: number;
    /** Opacity of grid lines 0–1 (default 0.04) */
    lineOpacity?: number;
    /** Fill the full viewport height */
    fullscreen?: boolean;
    className?: string;
}

/**
 * GridBackground — codesphere.bio-style square grid overlay.
 *
 * Renders a CSS grid pattern of uniform squares as a fixed/absolute
 * background layer. Wrap your section content as children.
 *
 * @example
 * <GridBackground>
 *   <YourContent />
 * </GridBackground>
 */
export default function GridBackground({
    children,
    cellSize = 48,
    lineOpacity = 0.04,
    fullscreen = false,
    className = "",
}: GridBackgroundProps) {
    const gridStyle = {
        backgroundImage: `
      linear-gradient(rgba(255,255,255,${lineOpacity}) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,${lineOpacity}) 1px, transparent 1px)
    `,
        backgroundSize: `${cellSize}px ${cellSize}px`,
    };

    return (
        <div
            className={`relative ${fullscreen ? "min-h-screen" : ""} ${className}`}
            style={gridStyle}
        >
            {children}
        </div>
    );
}
