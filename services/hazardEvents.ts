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
    return generateMockHazardData(hazard, period);
};

// Generate realistic mock data for wildfires and storms
const generateMockHazardData = (hazard: HazardType, period: string): HazardEvent[] => {
    // Calculate multiplier based on time period
    const getTimeMultiplier = (period: string): number => {
        switch (period) {
            case 'hour': return 0.1;  // Very few events in an hour
            case 'day': return 1;      // Base multiplier
            case 'week': return 4;      // 4x events in a week
            case 'month': return 15;   // 15x events in a month
            default: return 1;
        }
    };

    const multiplier = getTimeMultiplier(period);

    if (hazard === 'wildfire') {
        const baseWildfires = [
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
                id: 'wf-az-003',
                lat: 33.4484,
                lng: -112.0740,
                magnitude: 6.2,
                intensity: 0.70,
                label: 'Phoenix Metro Wildfire',
                details: 'Wildfire near urban interface. Multiple evacuation orders in effect.',
                type: 'wildfire'
            }
        ];

        // Scale the number of wildfires based on period
        const targetCount = Math.max(1, Math.floor(baseWildfires.length * multiplier));
        return baseWildfires.slice(0, Math.min(targetCount, baseWildfires.length * 3)).map(wf => ({
            ...wf,
            type: 'wildfire' as HazardType
        }));
    }
    
    if (hazard === 'storm') {
        const baseStorms = [
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
            },
            {
                id: 'storm-midwest-006',
                lat: 41.8781,
                lng: -87.6298,
                magnitude: 7.0,
                intensity: 0.75,
                label: 'Chicago Severe Storms',
                details: 'Line of severe thunderstorms with damaging winds and frequent lightning.',
                type: 'storm'
            },
            {
                id: 'storm-plains-007',
                lat: 39.7392,
                lng: -104.9903,
                magnitude: 6.3,
                intensity: 0.70,
                label: 'Denver Hail Storm',
                details: 'Severe storm producing large hail and strong winds across the Front Range.',
                type: 'storm'
            },
            {
                id: 'storm-northeast-008',
                lat: 40.7128,
                lng: -74.0060,
                magnitude: 6.7,
                intensity: 0.73,
                label: 'New York Nor\'easter',
                details: 'Powerful coastal storm bringing heavy rain and coastal flooding to the Northeast.',
                type: 'storm'
            },
            {
                id: 'storm-pnw-009',
                lat: 47.6062,
                lng: -122.3321,
                magnitude: 7.1,
                intensity: 0.76,
                label: 'Seattle Atmospheric River',
                details: 'Intense atmospheric river causing widespread flooding and landslides.',
                type: 'storm'
            },
            {
                id: 'storm-south-010',
                lat: 33.7490,
                lng: -84.3880,
                magnitude: 6.9,
                intensity: 0.74,
                label: 'Atlanta Tornado Outbreak',
                details: 'Severe weather outbreak with multiple tornado touchdowns reported.',
                type: 'storm'
            },
            {
                id: 'storm-lakes-011',
                lat: 42.3314,
                lng: -83.0458,
                magnitude: 6.4,
                intensity: 0.71,
                label: 'Detroit Lake Effect Snow',
                details: 'Heavy lake effect snow storm creating hazardous travel conditions.',
                type: 'storm'
            },
            {
                id: 'storm-desert-012',
                lat: 36.1699,
                lng: -115.1398,
                magnitude: 6.6,
                intensity: 0.72,
                label: 'Las Vegas Flash Flood',
                details: 'Sudden desert flash flooding from intense thunderstorm activity.',
                type: 'storm'
            },
            // Additional global storms
            {
                id: 'storm-caribbean-013',
                lat: 18.2208,
                lng: -66.5901,
                magnitude: 7.8,
                intensity: 0.82,
                label: 'Puerto Rico Hurricane',
                details: 'Major hurricane impacting Caribbean islands with catastrophic winds and flooding.',
                type: 'storm'
            },
            {
                id: 'storm-central-america-014',
                lat: 14.0723,
                lng: -87.1921,
                magnitude: 7.3,
                intensity: 0.77,
                label: 'Honduras Tropical Storm',
                details: 'Tropical depression bringing torrential rains to Central America.',
                type: 'storm'
            },
            {
                id: 'storm-south-america-015',
                lat: -23.5505,
                lng: -46.6333,
                magnitude: 7.6,
                intensity: 0.79,
                label: 'São Paulo Severe Storms',
                details: 'Powerful storm system causing urban flooding and landslides in Brazil.',
                type: 'storm'
            },
            {
                id: 'storm-europe-016',
                lat: 51.5074,
                lng: -0.1278,
                magnitude: 6.8,
                intensity: 0.72,
                label: 'London Wind Storm',
                details: 'Severe Atlantic storm system bringing damaging winds to the UK.',
                type: 'storm'
            },
            {
                id: 'storm-germany-017',
                lat: 52.5200,
                lng: 13.4050,
                magnitude: 7.0,
                intensity: 0.75,
                label: 'Berlin Thunderstorm Complex',
                details: 'Severe thunderstorm outbreak with large hail and frequent lightning.',
                type: 'storm'
            },
            {
                id: 'storm-france-018',
                lat: 48.8566,
                lng: 2.3522,
                magnitude: 6.9,
                intensity: 0.74,
                label: 'Paris Flash Flood Event',
                details: 'Extreme rainfall causing urban flooding across the Paris region.',
                type: 'storm'
            },
            {
                id: 'storm-spain-019',
                lat: 40.4168,
                lng: -3.7038,
                magnitude: 7.2,
                intensity: 0.78,
                label: 'Mediterranean Storm',
                details: 'Powerful storm system affecting Spain with heavy rain and strong winds.',
                type: 'storm'
            },
            {
                id: 'storm-italy-020',
                lat: 41.9028,
                lng: 12.4964,
                magnitude: 6.7,
                intensity: 0.73,
                label: 'Rome Severe Weather',
                details: 'Mediterranean cyclone bringing torrential rain to central Italy.',
                type: 'storm'
            },
            {
                id: 'storm-scandinavia-021',
                lat: 59.9139,
                lng: 10.7522,
                magnitude: 7.4,
                intensity: 0.76,
                label: 'Oslo Blizzard',
                details: 'Extreme winter storm with heavy snow and hurricane-force winds.',
                type: 'storm'
            },
            {
                id: 'storm-russia-022',
                lat: 55.7558,
                lng: 37.6173,
                magnitude: 7.1,
                intensity: 0.75,
                label: 'Moscow Ice Storm',
                details: 'Severe freezing rain creating hazardous ice accumulation.',
                type: 'storm'
            },
            {
                id: 'storm-india-023',
                lat: 19.0760,
                lng: 72.8777,
                magnitude: 8.2,
                intensity: 0.85,
                label: 'Mumbai Monsoon',
                details: 'Intense monsoon rains causing widespread urban flooding.',
                type: 'storm'
            },
            {
                id: 'storm-china-024',
                lat: 31.2304,
                lng: 121.4737,
                magnitude: 7.9,
                intensity: 0.83,
                label: 'Shanghai Typhoon',
                details: 'Powerful typhoon making landfall with extreme winds and storm surge.',
                type: 'storm'
            },
            {
                id: 'storm-japan-025',
                lat: 35.6762,
                lng: 139.6503,
                magnitude: 8.0,
                intensity: 0.84,
                label: 'Tokyo Typhoon',
                details: 'Major Pacific typhoon threatening Japan with catastrophic potential.',
                type: 'storm'
            },
            {
                id: 'storm-philippines-026',
                lat: 14.5995,
                lng: 120.9842,
                magnitude: 8.3,
                intensity: 0.86,
                label: 'Manila Super Typhoon',
                details: 'Category 5 super typhoon with extreme winds and massive rainfall.',
                type: 'storm'
            },
            {
                id: 'storm-indonesia-027',
                lat: -6.2088,
                lng: 106.8456,
                magnitude: 7.5,
                intensity: 0.79,
                label: 'Jakarta Tropical Storm',
                details: 'Severe storm system causing flooding across Java island.',
                type: 'storm'
            },
            {
                id: 'storm-australia-028',
                lat: -33.8688,
                lng: 151.2093,
                magnitude: 7.6,
                intensity: 0.80,
                label: 'Sydney East Coast Low',
                details: 'Powerful low pressure system bringing damaging winds and coastal erosion.',
                type: 'storm'
            },
            {
                id: 'storm-africa-029',
                lat: -26.2041,
                lng: 28.0473,
                magnitude: 7.2,
                intensity: 0.77,
                label: 'Johannesburg Severe Storms',
                details: 'Intense thunderstorm outbreak with frequent lightning and hail.',
                type: 'storm'
            },
            {
                id: 'storm-egypt-030',
                lat: 30.0444,
                lng: 31.2357,
                magnitude: 6.8,
                intensity: 0.72,
                label: 'Cairo Sand Storm',
                details: 'Severe haboob creating reduced visibility and hazardous conditions.',
                type: 'storm'
            },
            {
                id: 'storm-canada-031',
                lat: 43.6532,
                lng: -79.3832,
                magnitude: 7.3,
                intensity: 0.76,
                label: 'Toronto Ice Storm',
                details: 'Freezing rain creating dangerous ice accumulation on infrastructure.',
                type: 'storm'
            },
            {
                id: 'storm-mexico-032',
                lat: 19.4326,
                lng: -99.1332,
                magnitude: 7.4,
                intensity: 0.78,
                label: 'Mexico City Hurricane',
                details: 'Pacific hurricane remnants bringing torrential rain to central Mexico.',
                type: 'storm'
            },
            {
                id: 'storm-alaska-033',
                lat: 61.2181,
                lng: -149.9003,
                magnitude: 8.1,
                intensity: 0.84,
                label: 'Anchorage Blizzard',
                details: 'Extreme arctic storm with hurricane-force winds and heavy snow.',
                type: 'storm'
            },
            {
                id: 'storm-greenland-034',
                lat: 64.1814,
                lng: -51.6941,
                magnitude: 7.7,
                intensity: 0.81,
                label: 'Greenland Cyclone',
                details: 'Powerful North Atlantic storm impacting Greenland with extreme winds.',
                type: 'storm'
            },
            {
                id: 'storm-newzealand-035',
                lat: -36.8485,
                lng: 174.7633,
                magnitude: 7.8,
                intensity: 0.82,
                label: 'Auckland Cyclone',
                details: 'South Pacific cyclone bringing destructive winds and flooding.',
                type: 'storm'
            }
        ];

        // Scale the number of storms based on period
        const targetCount = Math.max(1, Math.floor(35 * multiplier));
        return baseStorms.slice(0, Math.min(targetCount, 35)).map(storm => ({
            ...storm,
            type: 'storm' as HazardType
        }));
    }
    
    return [];
};
