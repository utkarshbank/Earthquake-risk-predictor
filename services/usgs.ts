import axios from 'axios';

// Interfaces for USGS GeoJSON response
export interface EarthquakeFeature {
    type: 'Feature';
    properties: {
        mag: number;
        place: string;
        time: number;
        updated: number;
        tz: number | null;
        url: string;
        detail: string;
        felt: number | null;
        cdi: number | null;
        mmi: number | null;
        alert: string | null;
        status: string;
        tsunami: number;
        sig: number;
        net: string;
        code: string;
        ids: string;
        sources: string;
        types: string;
        nst: number | null;
        dmin: number | null;
        rms: number | null;
        gap: number | null;
        magType: string;
        type: string;
        title: string;
    };
    geometry: {
        type: 'Point';
        coordinates: [number, number, number]; // Longitude, Latitude, Depth
    };
    id: string;
}

export interface EarthquakeCollection {
    type: 'FeatureCollection';
    metadata: {
        generated: number;
        url: string;
        title: string;
        status: number;
        api: string;
        count: number;
    };
    features: EarthquakeFeature[];
    bbox?: [number, number, number, number, number, number];
}

const BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

export const fetchEarthquakes = async (period: 'hour' | 'day' | 'week' | 'month' = 'day', mag: 'all' | '1.0' | '2.5' | '4.5' | 'significant' = '2.5'): Promise<EarthquakeCollection> => {
    try {
        const url = `${BASE_URL}/${mag}_${period}.geojson`;
        const response = await axios.get<EarthquakeCollection>(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        throw error;
    }
};
