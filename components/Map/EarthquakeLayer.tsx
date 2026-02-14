'use client';

import { CircleMarker, Popup } from 'react-leaflet';
import { EarthquakeFeature } from '@/services/usgs';

interface EarthquakeLayerProps {
    events: EarthquakeFeature[];
    onSelectEvent?: (event: EarthquakeFeature) => void;
}

const getMagColor = (mag: number) => {
    if (mag >= 7.0) return '#b91c1c'; // Red-800
    if (mag >= 6.0) return '#ef4444'; // Red-500
    if (mag >= 5.0) return '#f97316'; // Orange-500
    if (mag >= 4.0) return '#eab308'; // Yellow-500
    if (mag >= 2.5) return '#84cc16'; // Lime-500
    return '#22c55e'; // Green-500
};

const getMagRadius = (mag: number) => {
    // Logarithmic scale or simply multiplier
    return Math.max(mag * 2, 4);
};

export default function EarthquakeLayer({ events, onSelectEvent }: EarthquakeLayerProps) {
    return (
        <>
            {events.map((ev) => (
                <CircleMarker
                    key={ev.id}
                    center={[ev.geometry.coordinates[1], ev.geometry.coordinates[0]]}
                    pathOptions={{
                        color: getMagColor(ev.properties.mag),
                        fillColor: getMagColor(ev.properties.mag),
                        fillOpacity: 0.6,
                        weight: 1,
                    }}
                    radius={getMagRadius(ev.properties.mag)}
                    eventHandlers={{
                        click: () => onSelectEvent?.(ev),
                    }}
                >
                    <Popup>
                        <div style={{ color: '#000' }}>
                            <strong>M {ev.properties.mag}</strong> - {ev.properties.place}
                            <br />
                            <small>{new Date(ev.properties.time).toLocaleString()}</small>
                            <br />
                            <a href={ev.properties.url} target="_blank" rel="noopener noreferrer">
                                Details
                            </a>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </>
    );
}
