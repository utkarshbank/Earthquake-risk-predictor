'use client';

import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { HazardEvent } from '@/services/hazardEvents';
import { useHazard } from '@/context/HazardContext';

interface GlobeViewerProps {
    events: HazardEvent[];
    onSelectEvent: (event: any | null) => void;
}

export default function GlobeViewer({ events, onSelectEvent }: GlobeViewerProps) {
    const { hazard } = useHazard();
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

        // Enable auto-rotation
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prepare data for the globe
    const globeData = events.map(event => {
        let color = '#d4af37'; // Default Gold for seismic
        if (hazard === 'wildfire') color = '#ff4d00'; // Flame Orange
        if (hazard === 'storm') color = '#00f2ff'; // Torrent Cyan

        return {
            ...event,
            size: hazard === 'seismic' ? Math.pow(event.magnitude, 2) / 40 : event.intensity * 0.15,
            color: event.intensity > 0.6 ? color : `${color}80` // Fade lower intensity
        };
    });

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
                pointRadius={d => {
                    const base = (d as any).type === 'seismic' ? Math.pow((d as any).magnitude, 2.2) / 25 : (d as any).intensity * 0.35;
                    return Math.max(base, 0.5); // Ensure a minimum interaction radius
                }}
                pointsMerge={false}
                pointLabel={d => `
                    <div style="background: rgba(11, 14, 20, 0.95); border: 1px solid rgba(255,255,255,0.1); padding: 1.25rem; border-radius: 1.5rem; backdrop-filter: blur(20px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); min-width: 280px;">
                        <div style="font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(255,255,255,0.3); font-weight: bold; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                            <div style="width: 6px; height: 6px; border-radius: 50%; background: ${(d as any).color};"></div>
                            ${(d as any).type === 'seismic' ? 'Seismic Activity' : (d as any).type === 'wildfire' ? 'Wildfire Threat' : 'Storm Cell'}
                        </div>
                        <div style="font-size: 0.9rem; font-weight: 500; color: white; margin-bottom: 0.75rem; letter-spacing: 0.02em;">${(d as any).label}</div>
                        <p style="font-size: 0.7rem; line-height: 1.5; color: rgba(255,255,255,0.5); font-style: italic; margin-bottom: 1rem; border-left: 1px solid rgba(255,255,255,0.1); padding-left: 0.75rem;">
                            "${(d as any).details}"
                        </p>
                        <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid rgba(255,255,255,0.05); pt: 0.75rem;">
                            <span style="font-size: 1.5rem; color: ${(d as any).color}; font-family: serif; font-style: italic;">${(d as any).magnitude}</span>
                            <span style="font-size: 0.5rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.2); font-weight: bold;">
                                ${(d as any).type === 'seismic' ? 'Richter Scale' : 'Force Index'}
                            </span>
                        </div>
                    </div>
                `}

                onPointClick={(label: any) => onSelectEvent(label)}
                onPointHover={(point: any) => {
                    if (globeEl.current) {
                        globeEl.current.controls().autoRotate = !point;
                    }
                }}

                // Ring data for significant events
                ringsData={globeData.filter(d => d.intensity > 0.6)}
                ringLat="lat"
                ringLng="lng"
                ringColor={(d: any) => d.color}
                ringMaxRadius={12}
                ringPropagationSpeed={0.8}
                ringRepeatPeriod={3000}
            />

            {/* Elegant overlay vignette */}
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-noir-950/20 to-noir-950/80" />
        </div>
    );
}
