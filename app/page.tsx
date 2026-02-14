'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Dashboard/Sidebar';
import { fetchEarthquakes, EarthquakeFeature } from '@/services/usgs';

// Dynamically import Map components to avoid SSR issues with Leaflet
const GlobeViewer = dynamic(() => import('@/components/Map/GlobeViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen bg-ivory text-gold/20 serif tracking-widest uppercase">Initializing Aether...</div>,
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
        const p = period as 'hour' | 'day' | 'week' | 'month';
        const m = magnitude as 'all' | '1.0' | '2.5' | '4.5' | 'significant';

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
    <main className="relative w-full h-screen overflow-hidden bg-midnight">
      {/* Midnight Intelligence Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan/5 blur-[180px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gold/3 blur-[180px] rounded-full -z-10" />

      <Sidebar
        selectedEvent={selectedEvent}
        totalEvents={events.length}
        period={period}
        magnitude={magnitude}
        onPeriodChange={setPeriod}
        onMagChange={setMagnitude}
      />

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-midnight/40 backdrop-blur-2xl transition-opacity duration-1000">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-t-2 border-cyan rounded-full animate-spin shadow-cyan" />
              <div className="absolute inset-0 w-16 h-16 border border-white/5 rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-cyan text-[0.6rem] tracking-[0.4em] uppercase font-bold glow-cyan px-2">Synchronizing Intelligence</div>
              <div className="text-white/20 text-[0.5rem] tracking-[0.2em] uppercase font-mono">Satellite Uplink Established</div>
            </div>
          </div>
        </div>
      )}

      <GlobeViewer
        events={events}
        onSelectEvent={setSelectedEvent}
      />
    </main>
  );
}
