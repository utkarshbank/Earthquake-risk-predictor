'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix for default marker icons in Next.js/Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewerProps {
    center?: [number, number];
    zoom?: number;
    children?: React.ReactNode;
}

const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
        // Force a resize event with a small delay to ensure container is ready
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [center, zoom, map]);

    return (
        <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control leaflet-bar">
                <button
                    className="bg-white text-black p-2 font-bold w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    title="Locate Me"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent map click
                        map.locate().on('locationfound', (e) => {
                            map.flyTo(e.latlng, 10);
                        });
                    }}
                >
                    📍
                </button>
            </div>
        </div>
    );
};

export default function MapViewer({ center = [20, 0], zoom = 2, children }: MapViewerProps) {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#1e293b', zIndex: 0 }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="map-container"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <MapController center={center} zoom={zoom} />
                {children}
            </MapContainer>
        </div>
    );
}
