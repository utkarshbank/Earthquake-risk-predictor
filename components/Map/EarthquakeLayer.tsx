'use client';

import { CircleMarker, Popup } from 'react-leaflet';
import { EarthquakeFeature } from '@/services/usgs';

interface EarthquakeLayerProps {
    events: EarthquakeFeature[];
    onSelectEvent?: (event: EarthquakeFeature) => void;
}

const getMagColor = (mag: number) => {
    if (mag >= 7.0) return '#ef4444'; // Danger Red
    if (mag >= 6.0) return '#f97316'; // Warning Orange
    if (mag >= 5.0) return '#eab308'; // Caution Yellow
    if (mag >= 4.0) return '#3b82f6'; // Info Blue
    return '#64748b'; // Muted Slate
};

const getMagRadius = (mag: number) => {
    return Math.max(mag * 2.5, 6);
};

export default function EarthquakeLayer({ events, onSelectEvent }: EarthquakeLayerProps) {
    return (
        <>
            {events.map((ev) => {
                const color = getMagColor(ev.properties.mag);
                const isSignificant = ev.properties.mag >= 6.0;

                return (
                    <CircleMarker
                        key={ev.id}
                        center={[ev.geometry.coordinates[1], ev.geometry.coordinates[0]]}
                        pathOptions={{
                            color: isSignificant ? '#fff' : color,
                            fillColor: color,
                            fillOpacity: 0.5,
                            weight: isSignificant ? 2 : 1,
                            className: isSignificant ? 'animate-pulse-slow' : '',
                        }}
                        radius={getMagRadius(ev.properties.mag)}
                        eventHandlers={{
                            click: () => onSelectEvent?.(ev),
                        }}
                    >
                        <Popup className="premium-popup">
                            <div className="bg-slate-950 text-slate-200 p-3 rounded-xl border border-white/10 min-w-[200px] shadow-2xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xl font-black italic tracking-tighter" style={{ color }}>
                                        M {ev.properties.mag}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/5 font-bold uppercase tracking-wider">
                                        Seismic Event
                                    </span>
                                </div>

                                <p className="text-sm font-medium mb-3 leading-snug">
                                    {ev.properties.place}
                                </p>

                                <div className="space-y-1 text-[11px] text-slate-400 border-t border-white/5 pt-2">
                                    <div className="flex justify-between">
                                        <span>Time</span>
                                        <span className="text-slate-300">{new Date(ev.properties.time).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Depth</span>
                                        <span className="text-slate-300">{ev.geometry.coordinates[2]} km</span>
                                    </div>
                                </div>

                                <a
                                    href={ev.properties.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 block w-full py-2 text-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-600/20 transition-colors"
                                >
                                    View Detailed Intel
                                </a>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </>
    );
}
