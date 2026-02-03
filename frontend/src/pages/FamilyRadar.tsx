import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Shield, Clock, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';
import { MessageCircle } from 'lucide-react';

// Fix for default marker icon
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

const FamilyRadar: React.FC = () => {
    const { token } = useAuth();
    const [familyLocations, setFamilyLocations] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    useEffect(() => {
        // Request user's real-time location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                    setLastUpdate(new Date());
                    updateBackendLocation(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocationError('Location access denied. Using default location.');
                    setUserLocation([40.7128, -74.006]);
                }
            );

            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                    setLastUpdate(new Date());
                    updateBackendLocation(position.coords.latitude, position.coords.longitude);
                },
                (error) => console.error('Watch position error:', error),
                { enableHighAccuracy: true, maximumAge: 10000 }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setLocationError('Geolocation not supported');
            setUserLocation([40.7128, -74.006]);
        }
    }, []);

    // Fetch Family Locations
    useEffect(() => {
        if (!token) return;
        const fetchFamily = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/location/family`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.locations) {
                    setFamilyLocations(data.locations.filter((l: any) => l.location));
                }
            } catch (err) {
                console.error("Failed to fetch family locations", err);
            }
        };
        fetchFamily();
        const interval = setInterval(fetchFamily, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [token]);

    const updateBackendLocation = async (lat: number, lng: number) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/location/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ latitude: lat, longitude: lng })
            });
        } catch (err) {
            console.error("Failed to sync location to cloud", err);
        }
    };

    const center = userLocation || [40.7128, -74.006];

    const getTimeSinceUpdate = () => {
        const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="space-y-6 pt-2 pb-20 px-4 bg-[var(--bg-primary)] h-full overflow-y-auto no-scrollbar">
            <div className="text-center">
                <h1 className="text-3xl font-black text-[var(--text-primary)] italic tracking-tighter uppercase underline decoration-[var(--accent-primary)] decoration-4 underline-offset-8">Family Radar</h1>
                <p className="text-[var(--accent-primary)]/60 text-[9px] font-black tracking-[0.4em] uppercase mt-3 italic">Live Safety Perimeter</p>
            </div>

            {locationError && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{locationError}</p>
                </div>
            )}

            <div className="h-[400px] glass-card rounded-[3rem] overflow-hidden border border-white/5 relative shadow-2xl">
                <MapContainer center={center as any} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapUpdater center={center as [number, number]} />
                    {familyLocations.map((member) => (
                        member.location && (
                            <Marker
                                key={member._id || member.id}
                                position={[member.location.latitude, member.location.longitude]}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <p className="font-black text-xs">{member.name}</p>
                                        <p className="text-[8px] text-gray-600">Family Guardian</p>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                    {userLocation && (
                        <>
                            <Marker position={userLocation}>
                                <Popup>
                                    <div className="text-center">
                                        <p className="font-black text-xs">Your Location</p>
                                        <p className="text-[8px] text-gray-600">Live GPS</p>
                                    </div>
                                </Popup>
                            </Marker>
                            <Circle
                                center={userLocation}
                                radius={500}
                                pathOptions={{
                                    fillColor: '#06b6d4',
                                    color: '#06b6d4',
                                    weight: 2,
                                    fillOpacity: 0.1
                                }}
                            />
                        </>
                    )}
                </MapContainer>

                <div className="absolute top-6 right-6 z-[400] bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">GPS Active</span>
                </div>

                <div className="absolute bottom-6 left-6 z-[400] bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2">
                        <Navigation size={14} className="text-[var(--accent-primary)]" />
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">
                            {userLocation ? `${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}` : 'Locating...'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="glass-card p-5 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[var(--accent-primary)]/10 rounded-2xl">
                            <MapPin size={20} className="text-[var(--accent-primary)]" />
                        </div>
                        <div>
                            <h4 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-tight italic">Security Perimeter</h4>
                            <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-0.5">500m Geofence Active</p>
                        </div>
                    </div>
                    <Shield size={20} className="text-emerald-500/50" />
                </div>

                <div className="glass-card p-5 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[var(--accent-primary)]/10 rounded-2xl">
                            <Clock size={20} className="text-[var(--accent-primary)]" />
                        </div>
                        <div>
                            <h4 className="font-black text-[var(--text-primary)] text-sm uppercase tracking-tight italic">Last Signal Sync</h4>
                            <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest mt-0.5">{getTimeSinceUpdate()}</p>
                        </div>
                    </div>
                    <Phone size={20} className="text-[var(--accent-primary)]/50" />
                </div>

                {/* Family Members List */}
                <div className="pt-4 space-y-4">
                    <h3 className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.4em] ml-2">Linked Guardians</h3>
                    {familyLocations.length === 0 ? (
                        <div className="glass-card p-8 text-center border-dashed border-white/10">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No family members found</p>
                        </div>
                    ) : familyLocations.map((member) => (
                        <div key={member._id} className="glass-card p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                                    <span className="text-white font-black uppercase">{member.name?.[0]}</span>
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-sm uppercase tracking-tight">{member.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active Now</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`tel:${member.phoneNumber || '000'}`}
                                    className="p-3 bg-white/5 rounded-2xl text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black transition-all shadow-lg active:scale-95"
                                >
                                    <Phone size={18} />
                                </a>
                                <a
                                    href={`sms:${member.phoneNumber || '000'}`}
                                    className="p-3 bg-white/5 rounded-2xl text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all shadow-lg active:scale-95"
                                >
                                    <MessageCircle size={18} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FamilyRadar;
