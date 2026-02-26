interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
}

/**
 * Tabs — simple two-tab switcher with Neo-Brutalist active style.
 */
export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="flex border-3 border-dark-200 mb-8 w-fit">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`px-6 py-3 font-grotesk font-bold text-sm uppercase tracking-wide transition-all duration-150 ${activeTab === tab.id
                            ? "bg-lime text-dark"
                            : "bg-transparent text-white/50 hover:text-white"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
