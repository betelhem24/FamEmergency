import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Shield, Activity, Battery, MessageSquare, ChevronLeft, Bell, Heart, Zap, UserPlus, X, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import L from 'leaflet';
import './FamilyRadar.css';
import SecureChat from '../components/SecureChat';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Color palette for family members (matching reference image)
const MEMBER_COLORS = ['#00f2ff', '#3b82f6', '#a855f7', '#f472b6', '#10b981', '#f59e0b'];

// Custom Marker Icon with Glow
const createNeonIcon = (color: string, photo?: string, name?: string) => {
    return L.divIcon({
        className: 'custom-neon-icon',
        html: `
            <div class="neon-marker-container">
                <div class="neon-marker-glow" style="--marker-color-alpha: ${color}44"></div>
                <div style="
                    width: 54px; 
                    height: 54px; 
                    background: ${color}; 
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 20px ${color};
                    border: 2px solid rgba(255,255,255,0.9);
                    position: relative;
                    z-index: 2;
                ">
                    <div style="
                        width: 44px; 
                        height: 44px; 
                        background: #050b16; 
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        border: 1px solid rgba(255,255,255,0.1);
                    ">
                        ${photo ? `<img src="${photo}" style="width: 100%; height: 100%; object-fit: cover;" />` :
                `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 16px;">${name?.[0] || '?'}</div>`}
                    </div>
                    <div style="
                        position: absolute;
                        bottom: 2px;
                        right: 2px;
                        width: 14px;
                        height: 14px;
                        background: #10b981;
                        border-radius: 50%;
                        border: 2px solid #050b16;
                    "></div>
                </div>
                <div style="
                    position: absolute;
                    top: -25px;
                    background: rgba(0,0,0,0.8);
                    padding: 2px 10px;
                    border-radius: 10px;
                    border: 1px solid ${color}44;
                    color: white;
                    font-size: 10px;
                    font-weight: 800;
                    font-size: 10px;
                    font-weight: 800;
                    white-space: nowrap;
                    pointer-events: none;
                ">
                    ${name || 'USER'}
                </div>
            </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
    });
};

const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 16, { animate: true, duration: 1.5 });
    }, [center, map]);
    return null;
};

const FamilyRadar: React.FC = () => {
    const { token, user } = useAuth();
    const { socket } = useSocket();
    const [familyLocations, setFamilyLocations] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [paths, setPaths] = useState<Record<string, [number, number][]>>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatRecipient, setChatRecipient] = useState<{ id: string; name: string } | null>(null);

    // Real-time location tracking
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newLocation: [number, number] = [latitude, longitude];
                    setUserLocation(newLocation);

                    if (socket) {
                        socket.emit('location:update', {
                            latitude,
                            longitude,
                            accuracy: position.coords.accuracy,
                            heartRate: 72 + Math.floor(Math.random() * 8),
                            batteryLevel: 85 - Math.floor(Math.random() * 5)
                        });
                    }
                },
                (error) => console.error('Watch position error:', error),
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [socket]);

    // Listen for real-time location updates
    useEffect(() => {
        if (!socket) return;

        socket.on('location:updated', (data) => {
            setFamilyLocations(prev => {
                const index = prev.findIndex(l => l._id === data.userId);
                if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = {
                        ...updated[index],
                        location: {
                            latitude: data.latitude,
                            longitude: data.longitude,
                            accuracy: data.accuracy,
                            timestamp: data.timestamp
                        },
                        heartRate: data.heartRate || updated[index].heartRate,
                        batteryLevel: data.batteryLevel || updated[index].batteryLevel
                    };
                    return updated;
                }
                return prev;
            });

            setPaths(prev => {
                const userPath = prev[data.userId] || [];
                const newPath = [...userPath, [data.latitude, data.longitude] as [number, number]].slice(-20);
                return { ...prev, [data.userId]: newPath };
            });
        });

        return () => {
            socket.off('location:updated');
        };
    }, [socket]);

    // Fetch family members and their locations
    useEffect(() => {
        if (!token) return;
        const fetchFamily = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/location/family`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.locations) {
                    setFamilyLocations(data.locations);
                }
            } catch (err) {
                console.error("Failed to fetch family locations", err);
            }
        };
        fetchFamily();
        // Refresh every 30 seconds
        const interval = setInterval(fetchFamily, 30000);
        return () => clearInterval(interval);
    }, [token]);

    // Search for users to add
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/family/search?query=${encodeURIComponent(query)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.success) {
                setSearchResults(data.users || []);
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    // Add family member
    const handleAddMember = async (memberEmail: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/family/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ email: memberEmail })
            });
            const data = await res.json();
            if (data.success) {
                // Refresh family list
                const refreshRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/location/family`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const refreshData = await refreshRes.json();
                if (refreshData.success) {
                    setFamilyLocations(refreshData.locations);
                }
                setShowAddModal(false);
                setSearchQuery('');
                setSearchResults([]);
            } else {
                alert(data.message || 'Failed to add family member');
            }
        } catch (err) {
            console.error("Failed to add family member", err);
            alert('Failed to add family member');
        }
    };

    // Remove family member
    const handleRemoveMember = async (memberId: string) => {
        if (!confirm('Are you sure you want to remove this family member?')) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/family/${memberId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setFamilyLocations(prev => prev.filter(m => m._id !== memberId));
                if (selectedUser === memberId) {
                    setSelectedUser(null);
                }
            }
        } catch (err) {
            console.error("Failed to remove family member", err);
        }
    };

    // Calculate map center - prioritize selected user, then current user, then default
    const getCenter = (): [number, number] => {
        if (selectedUser) {
            const member = familyLocations.find(m => m._id === selectedUser);
            if (member?.location) {
                return [member.location.latitude, member.location.longitude];
            }
        }
        return userLocation || [40.7128, -74.006];
    };

    const center = getCenter();

    const activeMember = familyLocations.find(m => m._id === selectedUser) || {
        name: user?.name,
        heartRate: 72,
        batteryLevel: 88
    };

    return (
        <div className="flex h-screen radar-container overflow-hidden font-['Inter'] relative">
            {/* Sidebar with Profiles */}
            <div className="w-80 glass-sidebar flex flex-col p-6 space-y-6 overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 bg-white/5 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black text-white italic tracking-tighter">Family Radar</h1>
                    <div className="ml-auto relative">
                        <Bell size={20} className="text-slate-400" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </div>
                </div>

                {/* Add Family Member Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center gap-2 text-cyan-400 font-bold transition-all hover:scale-105"
                >
                    <UserPlus size={20} />
                    <span>Add Family Member</span>
                </button>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                    {familyLocations.map((member, index) => (
                        <div
                            key={member._id}
                            onClick={() => setSelectedUser(member._id)}
                            className={`user-pill p-4 rounded-3xl cursor-pointer flex items-center gap-4 group ${selectedUser === member._id ? 'active' : 'hover:bg-white/5'}`}
                        >
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full border-2 p-1 bg-slate-900" style={{ borderColor: `${MEMBER_COLORS[index % MEMBER_COLORS.length]}33` }}>
                                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-lg overflow-hidden border border-white/10">
                                        {member.photo ? <img src={member.photo} className="w-full h-full object-cover" alt={member.name} /> : member.name?.[0]}
                                    </div>
                                </div>
                                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_#10b981]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg leading-tight">{member.name}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Tracking</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setChatRecipient({ id: member._id, name: member.name });
                                        setIsChatOpen(true);
                                    }}
                                    className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-400 transition-all"
                                >
                                    <MessageSquare size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMember(member._id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Vertical Vitals Bar */}
                <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-6">
                    <div className="flex items-center justify-around bg-slate-900/40 py-6 rounded-[2.5rem] border border-white/5">
                        <div className="vital-icon-container">
                            <Heart size={24} className="text-cyan-400 animate-pulse fill-cyan-400/20" />
                            <span className="vital-value">{activeMember.heartRate || 72} BPM</span>
                        </div>
                        <div className="vital-icon-container">
                            <Battery size={24} className="text-emerald-400" />
                            <span className="vital-value">{activeMember.batteryLevel || 85}%</span>
                        </div>
                        <div className="vital-icon-container">
                            <Activity size={24} className="text-purple-400" />
                            <span className="vital-value">Active</span>
                        </div>
                        <div className="vital-icon-container">
                            <Zap size={24} className="text-orange-400" />
                            <span className="vital-value">Charged</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                <MapContainer
                    center={center as any}
                    zoom={15}
                    style={{ height: 'calc(100vh - 100px)', width: '100%', maxHeight: '100vh' }}
                    zoomControl={false}
                >
                    {/* Google Maps with English language */}
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
                        attribution='&copy; Google Maps'
                    />
                    <MapUpdater center={center as [number, number]} />

                    {/* Rendering Path Trails with Glow */}
                    {Object.entries(paths).map(([userId, path]) => (
                        <Polyline
                            key={`path-${userId}`}
                            positions={path}
                            pathOptions={{
                                color: '#00f2ff',
                                weight: 5,
                                opacity: 0.8,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                    ))}

                    {/* Family Markers */}
                    {familyLocations.map((member, index) => (
                        member.location && (
                            <Marker
                                key={`marker-${member._id}`}
                                position={[member.location.latitude, member.location.longitude]}
                                icon={createNeonIcon(MEMBER_COLORS[index % MEMBER_COLORS.length], member.photo, member.name)}
                            >
                                <Popup className="custom-popup">
                                    <div className="text-center p-2 min-w-[140px]">
                                        <p className="font-black text-base text-white italic">{member.name}</p>
                                        <div className="flex items-center gap-4 justify-center mt-3 pt-3 border-t border-white/5">
                                            <div className="flex flex-col items-center">
                                                <Heart size={14} className="text-cyan-400 mb-1" />
                                                <span className="text-[10px] font-black">{member.heartRate || 72}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <Battery size={14} className="text-emerald-400 mb-1" />
                                                <span className="text-[10px] font-black">{member.batteryLevel || 85}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}

                    {/* Self Marker */}
                    {userLocation && (
                        <Marker position={userLocation} icon={createNeonIcon('#a855f7', user?.photo, user?.name)}>
                            <Popup className="custom-popup">
                                <div className="text-center p-2">
                                    <p className="font-black text-base text-white italic">You</p>
                                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1">Primary Node</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Map Floating Actions */}
                <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-4">
                    <button
                        onClick={() => {
                            if (selectedUser) {
                                const member = familyLocations.find(m => m._id === selectedUser);
                                if (member) {
                                    setChatRecipient({ id: member._id, name: member.name });
                                    setIsChatOpen(true);
                                }
                            } else {
                                alert("Select a family member to chat");
                            }
                        }}
                        className="w-16 h-16 bg-[#00f2ff] rounded-2xl flex items-center justify-center text-slate-900 shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:scale-105 transition-transform group"
                    >
                        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
                    </button>
                    <button className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:scale-105 transition-transform group">
                        <Shield size={28} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Add Family Member Modal */}
            {
                showAddModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,242,255,0.2)]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-white">Add Family Member</h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                                    style={{ textTransform: 'none' }}
                                />
                            </div>

                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {isSearching && (
                                    <p className="text-center text-slate-400 py-4">Searching...</p>
                                )}
                                {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
                                    <p className="text-center text-slate-400 py-4">No users found</p>
                                )}
                                {searchResults.map((result) => (
                                    <div
                                        key={result._id}
                                        className="flex items-center gap-4 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white overflow-hidden">
                                            {result.photo ? <img src={result.photo} className="w-full h-full object-cover" alt={result.name} /> : result.name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{result.name}</p>
                                            <p className="text-sm text-slate-400">{result.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddMember(result.email)}
                                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold transition-all"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Secure Chat Modal */}
            <SecureChat
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                recipientId={chatRecipient?.id || ''}
                recipientName={chatRecipient?.name || 'Family Member'}
            />
        </div >
    );
};

export default FamilyRadar;
