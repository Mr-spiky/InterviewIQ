import Tag from "./Tag";

interface SectionHeaderProps {
    tag: string;
    title: React.ReactNode;
    subtitle?: string;
    className?: string;
}

/**
 * SectionHeader — reusable Tag + Title + optional subtitle block.
 * Used at the top of every landing page section.
 *
 * @example
 * <SectionHeader tag="Features" title={<>COMPLETE <span className="text-lime">PIPELINE</span></>} />
 */
export default function SectionHeader({
    tag,
    title,
    subtitle,
    className = "",
}: SectionHeaderProps) {
    return (
        <div className={`text-center mb-16 ${className}`}>
            <Tag className="mb-4">{tag}</Tag>
            <h2 className="section-title mt-2">{title}</h2>
            {subtitle && (
                <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
