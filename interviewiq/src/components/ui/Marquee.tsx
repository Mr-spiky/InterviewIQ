"use client";

interface MarqueeProps {
    items: string[];
    speed?: number;
    reverse?: boolean;
    className?: string;
    itemClassName?: string;
}

export default function Marquee({
    items,
    reverse = false,
    className = "",
    itemClassName = "",
}: MarqueeProps) {
    const doubled = [...items, ...items];

    return (
        <div className={`overflow-hidden py-3 ${className}`}>
            <div
                className={`flex whitespace-nowrap ${reverse ? "animate-marquee-reverse" : "animate-marquee"
                    }`}
            >
                {doubled.map((item, i) => (
                    <span key={i} className={`mx-8 ${itemClassName}`}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
