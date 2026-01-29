// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

export const LiveMap: React.FC = () => {
    const myLocation = useSelector((state: RootState) => state.location.myLocation);
    const familyLocations = useSelector((state: RootState) => state.location.familyLocations);

    const defaultCenter: [number, number] = [32.0853, 34.7818]; // Tel Aviv
    const center: [number, number] = myLocation
        ? [myLocation.latitude, myLocation.longitude]
        : defaultCenter;

    return (
        <div style={{ height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MapUpdater center={center} />

                {myLocation && (
                    <Marker position={[myLocation.latitude, myLocation.longitude]}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}

                {familyLocations.map((member) =>
                    member.location && (
                        <Marker
                            key={member.userId}
                            position={[member.location.latitude, member.location.longitude]}
                        >
                            <Popup>{member.name}</Popup>
                        </Marker>
                    )
                )}
            </MapContainer>
        </div>
    );
};
