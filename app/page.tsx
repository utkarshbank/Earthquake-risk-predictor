'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Dashboard/Sidebar';
import { fetchEarthquakes, EarthquakeFeature } from '@/services/usgs';

// Dynamically import Map components to avoid SSR issues with Leaflet
const MapViewer = dynamic(() => import('@/components/Map/MapViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen bg-slate-900 text-white">Loading Map...</div>,
});

const EarthquakeLayer = dynamic(() => import('@/components/Map/EarthquakeLayer'), {
  ssr: false,
});

export default function Home() {
  const [events, setEvents] = useState<EarthquakeFeature[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EarthquakeFeature | null>(null);
  const [period, setPeriod] = useState('day');
  const [magnitude, setMagnitude] = useState('2.5');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Safe cast as keys match
        const p = period as 'hour' | 'day' | 'week' | 'month';
        const m = magnitude as 'all' | '1.0' | '2.5' | '4.5' | 'significant'; // Note: simplified check

        const data = await fetchEarthquakes(p, m);
        setEvents(data.features || []);
      } catch (error) {
        console.error('Failed to load earthquakes', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period, magnitude]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950">
      <Sidebar
        selectedEvent={selectedEvent}
        totalEvents={events.length}
        period={period}
        magnitude={magnitude}
        onPeriodChange={setPeriod}
        onMagChange={setMagnitude}
      />

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-xl font-bold animate-pulse">Fetching Data...</div>
        </div>
      )}

      <MapViewer zoom={3}>
        <EarthquakeLayer
          events={events}
          onSelectEvent={setSelectedEvent}
        />
      </MapViewer>
    </main>
  );
}
