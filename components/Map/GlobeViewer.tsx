'use client';

import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { EarthquakeFeature } from '@/services/usgs';

interface GlobeViewerProps {
    events: EarthquakeFeature[];
    onSelectEvent: (event: EarthquakeFeature | null) => void;
}

export default function GlobeViewer({ events, onSelectEvent }: GlobeViewerProps) {
    const globeEl = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prepare data for the globe
    const globeData = events.map(event => ({
        ...event,
        lat: event.geometry.coordinates[1],
        lng: event.geometry.coordinates[0],
        size: Math.pow(event.properties.mag, 2) / 40,
        color: event.properties.mag >= 6.0 ? '#d4af37' : 'rgba(212, 175, 55, 0.6)'
    }));

    return (
        <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center">
            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                atmosphereColor="#d4af37"
                atmosphereAltitude={0.15}

                pointsData={globeData}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.01}
                pointRadius="size"
                pointsMerge={true}
                pointLabel={d => `
                    <div class="bg-noir-900/90 border border-gold/30 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
                        <div class="text-[0.6rem] uppercase tracking-[0.2em] text-gold/60 mb-1">Seismic Event</div>
                        <div class="text-sm font-medium text-white mb-2">${(d as any).properties.place}</div>
                        <div class="flex items-center gap-3">
                            <span class="text-xl font-serif text-gold">${(d as any).properties.mag}</span>
                            <span class="text-[0.7rem] text-white/40 italic">Magnitude</span>
                        </div>
                    </div>
                `}

                onPointClick={(label: any) => onSelectEvent(label)}

                // Ring data for significant events
                ringsData={globeData.filter(d => d.properties.mag >= 6.0)}
                ringLat="lat"
                ringLng="lng"
                ringColor={() => '#d4af37'}
                ringMaxRadius={5}
                ringPropagationSpeed={1}
                ringRepeatPeriod={2000}
            />

            {/* Elegant overlay vignette */}
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-noir-950/20 to-noir-950/80" />
        </div>
    );
}
