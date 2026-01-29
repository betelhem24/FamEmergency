import { Home, Users, Map, Activity, Phone, Settings } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'family', icon: Users, label: 'Family' },
        { id: 'map', icon: Map, label: 'Map' },
        { id: 'health', icon: Activity, label: 'Health' },
        { id: 'contacts', icon: Phone, label: 'Contacts' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <nav className="bottom-nav">
            {tabs.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    className={`nav-item ${activeTab === id ? 'active' : ''}`}
                    onClick={() => onTabChange(id)}
                    aria-label={label}
                >
                    <Icon size={24} />
                    <span className="nav-label">{label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
