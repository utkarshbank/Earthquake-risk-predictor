'use client';

import { EarthquakeFeature } from '@/services/usgs';

interface SidebarProps {
    selectedEvent: EarthquakeFeature | null;
    totalEvents: number;
    period: string;
    magnitude: string;
    onPeriodChange: (p: string) => void;
    onMagChange: (m: string) => void;
}

export default function Sidebar({
    selectedEvent,
    totalEvents,
    period,
    magnitude,
    onPeriodChange,
    onMagChange,
}: SidebarProps) {
    return (
        <div className="absolute top-4 left-4 z-[1000] w-80 glass p-4 rounded-xl text-white flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h1 className="text-2xl font-bold mb-2">QuakeWatch</h1>

            {/* Controls */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-300">Time Period</label>
                <select
                    value={period}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                >
                    <option value="hour">Past Hour</option>
                    <option value="day">Past Day</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                </select>

                <label className="text-sm font-semibold text-gray-300 mt-2">Min Magnitude</label>
                <select
                    value={magnitude}
                    onChange={(e) => onMagChange(e.target.value)}
                    className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white"
                >
                    <option value="1.0">M 1.0+</option>
                    <option value="2.5">M 2.5+</option>
                    <option value="4.5">M 4.5+</option>
                    <option value="significant">Significant Only</option>
                </select>
            </div>

            <div className="border-t border-slate-600 my-2"></div>

            {/* Stats */}
            <div className="text-sm">
                <span className="text-gray-400">Total Events:</span>{' '}
                <span className="font-bold text-xl">{totalEvents}</span>
            </div>

            {/* Selected Event Details (Simple Risk Analysis Heuristic) */}
            {selectedEvent ? (
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg animate-fade-in border border-slate-600">
                    <h2 className="text-lg font-bold text-primary mb-1">Event Analysis</h2>
                    <div className="text-3xl font-black mb-2" style={{ color: getRiskColor(selectedEvent.properties.mag) }}>
                        Risk Score: {calculateRisk(selectedEvent.properties.mag)}/10
                    </div>

                    <p className="text-sm mb-1">
                        <span className="text-gray-400">Location:</span> {selectedEvent.properties.place}
                    </p>
                    <p className="text-sm mb-1">
                        <span className="text-gray-400">Depth:</span> {selectedEvent.geometry.coordinates[2]} km
                    </p>
                    <p className="text-sm mb-1">
                        <span className="text-gray-400">Significance:</span> {selectedEvent.properties.sig}
                    </p>

                    <div className="mt-3 text-xs text-gray-400 italic">
                        * Risk score is a heuristic based on magnitude and depth. Real analysis would require building codes and population density data.
                    </div>
                </div>
            ) : (
                <div className="mt-4 p-4 text-center text-gray-500 text-sm">
                    Select an earthquake on the map to see risk analysis.
                </div>
            )}
        </div>
    );
}

// Simple heuristic for risk calculation
function calculateRisk(mag: number): number {
    // Base risk on magnitude squared-ish
    let risk = (mag * mag) / 5;
    if (risk > 10) risk = 10;
    return parseFloat(risk.toFixed(1));
}

function getRiskColor(mag: number): string {
    const risk = calculateRisk(mag);
    if (risk < 3) return '#22c55e';
    if (risk < 6) return '#eab308';
    return '#ef4444';
}
