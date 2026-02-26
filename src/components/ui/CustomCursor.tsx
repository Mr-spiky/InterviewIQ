"use client";

import "./CustomCursor.css";
import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorRingRef = useRef<HTMLDivElement>(null);

    // Lerp targets
    const mouse = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });
    const dotPos = useRef({ x: -100, y: -100 });
    const rafId = useRef<number>(0);
    const isHovering = useRef(false);
    const isClicking = useRef(false);

    const lerp = (start: number, end: number, factor: number) =>
        start + (end - start) * factor;

    const animate = useCallback(() => {
        const dot = cursorDotRef.current;
        const ring = cursorRingRef.current;
        if (!dot || !ring) return;

        // Dot follows instantly
        dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 0.25);
        dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 0.25);

        // Ring follows with smooth delay
        ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.1);
        ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.1);

        dot.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%) scale(${isClicking.current ? 0.5 : 1})`;
        ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${isHovering.current ? 2.8 : isClicking.current ? 0.85 : 1
            })`;

        rafId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Hide default cursor globally
        document.documentElement.style.cursor = "none";

        const onMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        const onMouseDown = () => {
            isClicking.current = true;
            cursorDotRef.current?.classList.add("cursor-click");
            cursorRingRef.current?.classList.add("cursor-ring-click");
        };

        const onMouseUp = () => {
            isClicking.current = false;
            cursorDotRef.current?.classList.remove("cursor-click");
            cursorRingRef.current?.classList.remove("cursor-ring-click");
        };

        const interactiveSelectors =
            "a, button, [role='button'], input, textarea, select, label[for], [data-cursor='hover']";

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest(interactiveSelectors)) {
                isHovering.current = true;
                cursorRingRef.current?.classList.add("cursor-hover");
                cursorDotRef.current?.classList.add("cursor-dot-hover");

                // Magnetic pull: move cursor slightly toward element center
                const el = (target.closest(interactiveSelectors) as HTMLElement);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const elCX = rect.left + rect.width / 2;
                    const elCY = rect.top + rect.height / 2;
                    mouse.current.x += (elCX - mouse.current.x) * 0.18;
                    mouse.current.y += (elCY - mouse.current.y) * 0.18;
                }
            }
        };

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest(interactiveSelectors)) {
                isHovering.current = false;
                cursorRingRef.current?.classList.remove("cursor-hover");
                cursorDotRef.current?.classList.remove("cursor-dot-hover");
            }
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseover", onMouseOver);
        window.addEventListener("mouseout", onMouseOut);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        rafId.current = requestAnimationFrame(animate);

        return () => {
            document.documentElement.style.cursor = "";
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onMouseOver);
            window.removeEventListener("mouseout", onMouseOut);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            cancelAnimationFrame(rafId.current);
        };
    }, [animate]);

    return (
        <>
            {/* Outer ring - slow follower with mix-blend-mode */}
            <div
                ref={cursorRingRef}
                className="cursor-ring"
                aria-hidden="true"
            />
            {/* Inner dot - fast follower */}
            <div
                ref={cursorDotRef}
                className="cursor-dot"
                aria-hidden="true"
            />
        </>
    );
}
