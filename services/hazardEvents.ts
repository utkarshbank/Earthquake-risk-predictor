import axios from 'axios';
import { fetchEarthquakes } from './usgs';
import { HazardType } from './imageAnalysis';

const GDACS_URL = '/api/hazard-events';

export interface HazardEvent {
    id: string;
    lat: number;
    lng: number;
    magnitude: number;
    intensity: number; // 0-1 normalized
    label: string;
    details: string;
    type: HazardType;
}

export const fetchHazardEvents = async (
    hazard: HazardType,
    period: string = 'day',
    magnitude: string = '2.5'
): Promise<HazardEvent[]> => {
    if (hazard === 'seismic') {
        const p = period as 'hour' | 'day' | 'week' | 'month';
        const m = magnitude as 'all' | '1.0' | '2.5' | '4.5' | 'significant';
        const data = await fetchEarthquakes(p, m);
        return data.features.map(f => ({
            id: f.id,
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            magnitude: f.properties.mag,
            intensity: Math.min(f.properties.mag / 9, 1),
            label: f.properties.place,
            details: `Magnitude ${f.properties.mag} seismic activity detected.`,
            type: 'seismic'
        }));
    }

    try {
        const response = await axios.get(GDACS_URL);
        const features = response.data.features || [];

        const mappedEvents: HazardEvent[] = features
            .filter((f: any) => {
                const type = f.properties.eventtype;
                const isCentroid = f.id && f.id.toString().includes('Centroid');
                // Ensure we only use point telemetry, not area polygons
                if (!isCentroid && f.geometry.type !== 'Point') return false;

                if (hazard === 'storm') return type === 'TC' || type === 'FL';
                if (hazard === 'wildfire') return type === 'WF';
                return false;
            })
            .map((f: any, i: number) => {
                const props = f.properties;
                const severity = parseFloat(props.severity) || 0;

                // Map severity to magnitude-like scale
                let magVal = 5.0;
                if (props.eventtype === 'TC') magVal = severity / 5; // Normalize tropical cyclone severity
                if (props.eventtype === 'WF') magVal = severity / 50; // Normalize wildfire severity

                // Alert levels: Green, Orange, Red
                const intensityMap: Record<string, number> = { 'Green': 0.4, 'Orange': 0.7, 'Red': 1.0 };
                const intensity = intensityMap[props.alertlevel] || 0.5;

                return {
                    id: props.eventid || `gdacs-${i}`,
                    lat: f.geometry.type === 'Point' ? f.geometry.coordinates[1] : (parseFloat(props.latitude) || 0),
                    lng: f.geometry.type === 'Point' ? f.geometry.coordinates[0] : (parseFloat(props.longitude) || 0),
                    magnitude: parseFloat(Math.min(magVal, 10).toFixed(1)),
                    intensity: intensity,
                    label: props.name || props.description || 'Active Event',
                    details: (props.description || 'Live telemetry active. Monitoring established.').split('.')[0] + '.',
                    type: hazard
                };
            });

        // Filter based on intensity threshold (magnitude setting)
        const threshold = magnitude === 'significant' ? 0.7 : magnitude === 'all' ? 0.0 : (parseFloat(magnitude) / 10);
        return mappedEvents.filter(e => e.intensity >= threshold).slice(0, 50);

    } catch (error) {
        console.error('Failed to fetch GDACS data', error);
        return [];
    }
};
