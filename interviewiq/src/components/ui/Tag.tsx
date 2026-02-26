interface TagProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Tag — small lime accent badge used above section titles.
 * e.g. <Tag>Features</Tag>
 */
export default function Tag({ children, className = "" }: TagProps) {
    return (
        <span className={`brutal-tag ${className}`}>{children}</span>
    );
}
