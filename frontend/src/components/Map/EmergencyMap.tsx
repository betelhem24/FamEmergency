import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, MapPin, Users, Navigation } from 'lucide-react';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Emergency Icon (Pulsing Red)
const emergencyIcon = L.divIcon({
    className: 'emergency-marker',
    html: `
        <div class="relative flex h-10 w-10">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-10 w-10 bg-red-600 border-4 border-white flex items-center justify-center shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </span>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

// Custom Guardian Icon
const guardianIcon = L.divIcon({
    className: 'guardian-marker',
    html: `
        <div class="relative flex h-8 w-8">
            <span class="relative inline-flex rounded-full h-8 w-8 bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

interface EmergencyMapProps {
    activeAlerts: any[];
}

export const EmergencyMap: React.FC<EmergencyMapProps> = ({ activeAlerts }) => {
    const defaultCenter: [number, number] = [32.0853, 34.7818]; // Tel Aviv
    const [center, setCenter] = useState<[number, number]>(defaultCenter);

    useEffect(() => {
        if (activeAlerts.length > 0) {
            const latest = activeAlerts[0];
            if (latest.latitude && latest.longitude) {
                setCenter([latest.latitude, latest.longitude]);
            }
        }
    }, [activeAlerts]);

    return (
        <div className="relative w-full h-[350px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl glass-card">
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: '100%', width: '100%', filter: 'grayscale(0.2) contrast(1.1)' }}
                scrollWheelZoom={false}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MapUpdater center={center} />

                {activeAlerts.map((alert) => (
                    <React.Fragment key={alert.emergencyId}>
                        <Marker
                            position={[alert.latitude, alert.longitude]}
                            icon={emergencyIcon}
                        >
                            <Popup>
                                <div className="text-center p-2">
                                    <p className="font-black uppercase text-xs text-red-500">{alert.userName || 'Unknown'}</p>
                                    <p className="font-bold text-[10px] uppercase text-slate-500 mt-1">{alert.type}</p>
                                    <p className="text-[9px] text-slate-400 mt-2">SEVERITY: {alert.severity}</p>
                                </div>
                            </Popup>
                        </Marker>
                        <Circle
                            center={[alert.latitude, alert.longitude]}
                            radius={500}
                            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, dashArray: '5, 10' }}
                        />
                    </React.Fragment>
                ))}

                {/* Simulated Guardian nearby */}
                {activeAlerts.length > 0 && (
                    <Marker
                        position={[activeAlerts[0].latitude + 0.005, activeAlerts[0].longitude - 0.003]}
                        icon={guardianIcon}
                    >
                        <Popup>
                            <div className="text-center p-2">
                                <p className="font-black uppercase text-[10px] text-emerald-500">Guardian En Route</p>
                                <p className="text-[9px] text-slate-500 mt-1 italic">ETA: 4 MIN</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Map Overlay Stats */}
            <div className="absolute top-4 left-6 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">
                        {activeAlerts.length} Active Incidents
                    </span>
                </div>
            </div>

            <div className="absolute bottom-4 left-6 right-6 flex justify-between gap-2 pointer-events-none">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Navigation size={12} className="text-[var(--accent-primary)]" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Response Priority: {activeAlerts.length > 0 ? activeAlerts[0].severity : 'NORMAL'}</span>
                </div>
                {activeAlerts.length > 0 && (
                    <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <Users size={12} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">1 Guardian Active</span>
                    </div>
                )}
            </div>
        </div>
    );
};
