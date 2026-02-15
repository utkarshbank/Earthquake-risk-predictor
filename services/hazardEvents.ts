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
        const p = period as 'hour' | 'day' | 'week' | 'month' | 'year' | '5years' | '10years';
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

    // For wildfires and storms, always return realistic mock data
    return generateMockHazardData(hazard);
};

// Generate realistic mock data for wildfires and storms
const generateMockHazardData = (hazard: HazardType): HazardEvent[] => {
    if (hazard === 'wildfire') {
        return [
            {
                id: 'wf-ca-001',
                lat: 34.0522,
                lng: -118.2437,
                magnitude: 7.2,
                intensity: 0.85,
                label: 'Pacific Palisades Wildfire',
                details: 'High-intensity wildfire threatening residential areas. Rapid spread due to dry conditions.',
                type: 'wildfire'
            },
            {
                id: 'wf-or-002',
                lat: 43.8041,
                lng: -120.5542,
                magnitude: 6.8,
                intensity: 0.75,
                label: 'Central Oregon Forest Fire',
                details: 'Large-scale forest fire burning through timber. Fire crews establishing containment lines.',
                type: 'wildfire'
            },
            {
                id: 'wf-nv-003',
                lat: 39.5296,
                lng: -119.8138,
                magnitude: 5.5,
                intensity: 0.65,
                label: 'Reno Hills Wildfire',
                details: 'Grassland fire advancing toward suburban communities. Air quality impact significant.',
                type: 'wildfire'
            },
            {
                id: 'wf-az-004',
                lat: 33.4484,
                lng: -112.0740,
                magnitude: 6.2,
                intensity: 0.70,
                label: 'Phoenix Metro Wildfire',
                details: 'Wildfire near urban interface. Multiple evacuation orders in effect.',
                type: 'wildfire'
            },
            {
                id: 'wf-co-005',
                lat: 39.7392,
                lng: -104.9903,
                magnitude: 5.8,
                intensity: 0.68,
                label: 'Colorado Front Range Fire',
                details: 'Mountain wildfire spreading through pine forest. Helicopter suppression operations active.',
                type: 'wildfire'
            }
        ];
    }
    
    if (hazard === 'storm') {
        return [
            {
                id: 'storm-gulf-001',
                lat: 29.9511,
                lng: -90.0715,
                magnitude: 8.5,
                intensity: 0.90,
                label: 'Gulf Coast Hurricane',
                details: 'Category 4 hurricane making landfall. Storm surge 15-20 feet expected.',
                type: 'storm'
            },
            {
                id: 'storm-atl-002',
                lat: 32.0835,
                lng: -81.0998,
                magnitude: 7.2,
                intensity: 0.78,
                label: 'Savannah Tropical Storm',
                details: 'Tropical storm bringing heavy rainfall and strong winds to coastal Georgia.',
                type: 'storm'
            },
            {
                id: 'storm-fl-003',
                lat: 25.7617,
                lng: -80.1918,
                magnitude: 6.8,
                intensity: 0.72,
                label: 'Miami Flood Event',
                details: 'Severe thunderstorm system causing urban flooding. Flash flood warnings active.',
                type: 'storm'
            },
            {
                id: 'storm-tx-004',
                lat: 29.7604,
                lng: -95.3698,
                magnitude: 7.5,
                intensity: 0.80,
                label: 'Houston Severe Weather',
                details: 'Complex storm system with tornado potential. Large hail and damaging winds reported.',
                type: 'storm'
            },
            {
                id: 'storm-nc-005',
                lat: 35.2271,
                lng: -80.8431,
                magnitude: 6.5,
                intensity: 0.68,
                label: 'Charlotte Storm System',
                details: 'Powerful cold front triggering severe thunderstorms. Widespread power outages reported.',
                type: 'storm'
            }
        ];
    }
    
    return [];
};
