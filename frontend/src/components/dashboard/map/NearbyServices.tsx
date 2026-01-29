import React from 'react';
import { Building2, Navigation2 } from 'lucide-react';

const services = [
    { name: 'City General Hospital', distance: '1.2 km', status: 'Open 24/7', type: 'Hospital' },
    { name: 'LifeCare Clinic', distance: '2.5 km', status: 'Until 8 PM', type: 'Clinic' },
    { name: 'Rapid Pharma', distance: '0.8 km', status: 'Open 24/7', type: 'Pharmacy' },
];

const NearbyServices: React.FC = () => {
    return (
        <div className="space-y-3">
            {services.map((service, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Building2 size={18} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white">{service.name}</h4>
                            <p className="text-[10px] text-gray-400">{service.type} • {service.status}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-indigo-300">{service.distance}</span>
                        <button className="mt-1 text-gray-500 group-hover:text-indigo-400 transition-colors">
                            <Navigation2 size={12} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NearbyServices;
