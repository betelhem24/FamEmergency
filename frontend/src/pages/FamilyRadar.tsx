import React from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Shield, Clock } from 'lucide-react';

const FamilyRadar: React.FC = () => {
    const center = [40.7128, -74.006]; // New York

    return (
        <div className="space-y-6 pt-2 pb-20">
            <div className="px-1 text-center">
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Family Radar</h1>
                <p className="text-life-cyan/80 text-[10px] font-black tracking-[0.4em] uppercase">Live Safety Perimeter</p>
            </div>

            <div className="px-1">
                <div className="h-[400px] glass-card rounded-[3rem] overflow-hidden border border-white/20 relative">
                    <MapContainer center={center as any} zoom={15} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            className="map-tiles"
                        />
                        <Circle
                            center={center as any}
                            radius={200}
                            pathOptions={{
                                fillColor: '#06b6d4',
                                color: '#06b6d4',
                                weight: 2,
                                fillOpacity: 0.2
                            }}
                        />
                    </MapContainer>

                    <div className="absolute top-6 right-6 z-[400] bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">3 Nodes Active</span>
                    </div>
                </div>
            </div>

            <div className="px-1 space-y-3">
                <div className="glass-panel p-4 rounded-[2rem] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <MapPin size={20} className="text-life-cyan" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Security Perimeter</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">All Members within 5km</p>
                        </div>
                    </div>
                    <Shield size={20} className="text-emerald-500/50" />
                </div>

                <div className="glass-panel p-4 rounded-[2rem] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl">
                            <Clock size={20} className="text-life-cyan" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Last Signal Sync</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">2 minutes ago</p>
                        </div>
                    </div>
                    <Phone size={20} className="text-life-cyan/50" />
                </div>
            </div>
        </div>
    );
};

export default FamilyRadar;
