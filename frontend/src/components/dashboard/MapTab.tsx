import React from 'react';
import { Search, Navigation, Hospital, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-medical-navy italic">Global Safety Map</h2>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em]">Real-time awareness node</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search emergency facilities..."
                            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-xs font-bold text-medical-navy focus:ring-2 focus:ring-medical-cyan/50 outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <button className="p-4 bg-medical-navy text-white rounded-2xl shadow-xl">
                        <Navigation size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 glass-card min-h-[500px] border border-white/10 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                    <MapContainer
                        center={[40.7128, -74.006]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            url="https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
                            attribution='&copy; Google Maps'
                        />
                        {/* Example Hospital Markers */}
                        {[
                            { name: 'Metro Health Center', pos: [40.7228, -74.016] },
                            { name: 'Central Fire Dept', pos: [40.7028, -73.996] }
                        ].map((loc, idx) => (
                            <Marker key={idx} position={loc.pos as [number, number]}>
                                <Popup>{loc.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    <div className="absolute bottom-8 left-8 p-5 glass-card rounded-2xl border border-white/10 z-[1000]">
                        <div className="text-[10px] font-black text-medical-cyan uppercase mb-1 tracking-widest">Active Sector</div>
                        <div className="text-sm font-black text-white font-mono uppercase">REAL-TIME SATELLITE FEED</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-[2rem]">
                        <h3 className="text-[10px] font-black text-white uppercase mb-6 tracking-widest flex items-center gap-2 italic">
                            <Hospital size={16} className="text-medical-cyan" /> Proximity Hubs
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Metro Health Center', dist: '0.8 mi', status: 'Active' },
                                { name: 'Central Fire Dept', dist: '1.2 mi', status: 'Ready' },
                                { name: '24h Trauma Unit', dist: '3.5 mi', status: 'Active' }
                            ].map(loc => (
                                <div key={loc.name} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-medical-cyan/30 transition-all cursor-pointer group">
                                    <div className="text-[11px] font-black text-white mb-0.5 group-hover:text-medical-cyan uppercase tracking-tight">{loc.name}</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{loc.dist}</span>
                                        <span className="text-[9px] font-black text-medical-cyan uppercase tracking-widest">{loc.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent rounded-[2rem]">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-medical-cyan" size={18} />
                            <span className="text-[10px] font-black text-white tracking-widest uppercase">Safe Protocols</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider opacity-70">
                            Emergency routing is dynamically optimized via neural health encryption.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapTab;
