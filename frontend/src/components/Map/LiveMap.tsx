// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

// Custom Hook for Geo-Fencing Logic
const useGeoFencing = (myLocation, safeZones) => {
    const [lastCheck, setLastCheck] = useState(0);

    useEffect(() => {
        if (!myLocation || !safeZones.length) return;

        // PERFORMANCE: Throttle geo-fencing checks to once every 3 seconds to save CPU
        const now = Date.now();
        if (now - lastCheck < 3000) return;
        setLastCheck(now);

        safeZones.forEach(zone => {
            const distance = L.latLng(myLocation.latitude, myLocation.longitude)
                .distanceTo(L.latLng(zone.lat, zone.lng));

            if (distance > zone.radius) {
                console.warn(`GEOFENCE: Left safe zone "${zone.name}"!`);
                if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
            }
        });
    }, [myLocation, safeZones, lastCheck]);
};

export const LiveMap: React.FC = () => {
    const myLocation = useSelector((state: RootState) => state.location.myLocation);
    const familyLocations = useSelector((state: RootState) => state.location.familyLocations);

    // Mock Safe Zones (In production, these would come from the backend/doctor)
    const [safeZones] = useState([
        { id: 1, name: 'Home Safe Zone', lat: 32.0853, lng: 34.7818, radius: 500, color: '#06b6d4' }
    ]);

    useGeoFencing(myLocation, safeZones);

    const defaultCenter: [number, number] = [32.0853, 34.7818]; // Tel Aviv
    const center: [number, number] = myLocation
        ? [myLocation.latitude, myLocation.longitude]
        : defaultCenter;

    return (
        <div className="relative w-full h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl glass-panel">
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
                    attribution='&copy; Google Maps'
                />
                <MapUpdater center={center} />

                {/* Geo-Fencing Visuals */}
                {safeZones.map(zone => (
                    <Circle
                        key={zone.id}
                        center={[zone.lat, zone.lng]}
                        radius={zone.radius}
                        pathOptions={{
                            color: zone.color,
                            fillColor: zone.color,
                            fillOpacity: 0.1,
                            dashArray: '10, 10'
                        }}
                    >
                        <Popup>{zone.name}</Popup>
                    </Circle>
                ))}

                {/* Marker Clustering */}
                <MarkerClusterGroup
                    chunkedLoading
                    maxClusterRadius={50}
                    spiderfyOnMaxZoom={true}
                >
                    {myLocation && (
                        <Marker position={[myLocation.latitude, myLocation.longitude]}>
                            <Popup>
                                <div className="text-center">
                                    <p className="font-black uppercase text-[10px] text-life-cyan">You</p>
                                    <p className="text-[9px] text-slate-500">Live Status: Active</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {familyLocations.map((member) =>
                        member.location && (
                            <Marker
                                key={member.userId}
                                position={[member.location.latitude, member.location.longitude]}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <p className="font-black uppercase text-[10px] text-white">{member.name}</p>
                                        <p className="text-[9px] text-slate-500">Member ID: {member.userId.slice(-4)}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    )}
                </MarkerClusterGroup>
            </MapContainer>

            {/* Glass UI Overlay for Map Controls */}
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex justify-between items-center px-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Network Sync</span>
                    </div>
                    <span className="text-[10px] font-black text-life-cyan uppercase tracking-widest">{familyLocations.length} Members Online</span>
                </div>
            </div>
        </div>
    );
};

