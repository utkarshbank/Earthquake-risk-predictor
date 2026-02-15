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

export const fetchEarthquakes = async (period: 'hour' | 'day' | 'week' | 'month' | 'year' | '5years' | '10years' = 'day', mag: 'all' | '1.0' | '2.5' | '4.5' | 'significant' = '2.5'): Promise<EarthquakeCollection> => {
    try {
        // For year periods, use USGS search API with date ranges
        if (period === 'year' || period === '5years' || period === '10years') {
            const endTime = new Date().toISOString();
            const startTime = new Date();
            
            if (period === 'year') {
                startTime.setFullYear(startTime.getFullYear() - 1);
            } else if (period === '5years') {
                startTime.setFullYear(startTime.getFullYear() - 5);
            } else if (period === '10years') {
                startTime.setFullYear(startTime.getFullYear() - 10);
            }
            
            const startTimeISO = startTime.toISOString();
            const minMag = mag === 'all' ? '0' : mag === 'significant' ? '6' : mag;
            
            // Use USGS search API for custom date ranges
            const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTimeISO}&endtime=${endTime}&minmagnitude=${minMag}&limit=20000`;
            const response = await axios.get<EarthquakeCollection>(url);
            return response.data;
        }
        
        // For standard periods, use the summary feed
        const url = `${BASE_URL}/${mag}_${period}.geojson`;
        const response = await axios.get<EarthquakeCollection>(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        throw error;
    }
};
