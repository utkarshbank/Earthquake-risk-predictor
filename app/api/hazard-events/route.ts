import { NextResponse } from 'next/server';
import axios from 'axios';

const GDACS_URL = 'https://www.gdacs.org/xml/gdacs.geojson';

export async function GET() {
    try {
        const response = await axios.get(GDACS_URL);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('GDACS Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to fetch hazard telemetry' }, { status: 500 });
    }
}
