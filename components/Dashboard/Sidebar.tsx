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
        <div className="sidebar glass">
            <h1 className="text-2xl font-bold mb-2" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>QuakeWatch</h1>

            {/* Navigation to Analysis */}
            <div style={{ marginBottom: '1rem' }}>
                <a href="/analyze" className="btn-primary">
                    <span style={{ marginRight: '0.5rem' }}>🗺️</span> Upload & Analyze Map
                </a>
            </div>

            {/* Controls */}
            <div className="control-group">
                <label className="text-sm font-semibold text-gray-300" style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Time Period</label>
                <select
                    value={period}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    className="select-input"
                >
                    <option value="hour">Past Hour</option>
                    <option value="day">Past Day</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                </select>

                <label className="text-sm font-semibold text-gray-300" style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '0.5rem' }}>Min Magnitude</label>
                <select
                    value={magnitude}
                    onChange={(e) => onMagChange(e.target.value)}
                    className="select-input"
                >
                    <option value="1.0">M 1.0+</option>
                    <option value="2.5">M 2.5+</option>
                    <option value="4.5">M 4.5+</option>
                    <option value="significant">Significant Only</option>
                </select>
            </div>

            <div style={{ borderTop: '1px solid rgba(71,85,105,1)', margin: '0.5rem 0' }}></div>

            {/* Stats */}
            <div className="stat-item">
                <span style={{ color: '#94a3b8' }}>Total Events:</span>{' '}
                <span className="stat-value">{totalEvents}</span>
            </div>

            {/* Selected Event Details (Simple Risk Analysis Heuristic) */}
            {selectedEvent ? (
                <div className="card-panel">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.25rem' }}>Event Analysis</h2>
                    <div style={{ fontSize: '1.875rem', fontWeight: '900', marginBottom: '0.5rem', color: getRiskColor(selectedEvent.properties.mag) }}>
                        Risk Score: {calculateRisk(selectedEvent.properties.mag)}/10
                    </div>

                    <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#94a3b8' }}>Location:</span> {selectedEvent.properties.place}
                    </p>
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#94a3b8' }}>Depth:</span> {selectedEvent.geometry.coordinates[2]} km
                    </p>
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#94a3b8' }}>Significance:</span> {selectedEvent.properties.sig}
                    </p>

                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        * Risk score is a heuristic based on magnitude and depth. Real analysis would require building codes and population density data.
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: '1rem', padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
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
