'use client';

import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { HazardEvent } from '@/services/hazardEvents';
import { useHazard } from '@/context/HazardContext';
import * as THREE from 'three';

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

    // Add stars to the scene
    useEffect(() => {
        if (!globeEl.current) return;

        let stars: THREE.Points | null = null;
        let ambientLight: THREE.AmbientLight | null = null;
        let timeoutId: NodeJS.Timeout | null = null;

        // Wait for scene to be ready
        const setupScene = () => {
            const scene = globeEl.current?.scene();
            if (!scene) {
                timeoutId = setTimeout(setupScene, 100);
                return;
            }

            // Create starfield
            const starsGeometry = new THREE.BufferGeometry();
            const starsMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.5,
                transparent: true,
                opacity: 0.8,
            });

            const starsVertices = [];
            const numStars = 5000;
            for (let i = 0; i < numStars; i++) {
                const x = (Math.random() - 0.5) * 2000;
                const y = (Math.random() - 0.5) * 2000;
                const z = (Math.random() - 0.5) * 2000;
                starsVertices.push(x, y, z);
            }

            starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
            stars = new THREE.Points(starsGeometry, starsMaterial);
            scene.add(stars);

            // Add ambient light to brighten the earth
            ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);
        };

        setupScene();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            
            const scene = globeEl.current?.scene();
            if (scene) {
                if (stars) scene.remove(stars);
                if (ambientLight) scene.remove(ambientLight);
            }
        };
    }, [dimensions]);

    // Prepare data for the globe
    const globeData = events.map(event => {
        // Dark orange for earthquakes, with some transparency
        let color = '#FF8C00CC'; // Dark orange for seismic/earthquake with ~80% opacity (CC = 204/255)
        if (hazard === 'wildfire') color = '#ff4d00'; // Flame Orange
        if (hazard === 'storm') color = '#00f2ff'; // Torrent Cyan

        return {
            ...event,
            size: hazard === 'seismic' ? Math.pow(event.magnitude, 2) / 40 : event.intensity * 0.15,
            color: color
        };
    });

    // Filter rings to only show for current hazard type
    const ringsData = globeData.filter(d => {
        const eventType = (d as any).type;
        return d.intensity > 0.6 && eventType === hazard;
    });

    return (
        <div className="absolute inset-0 z-0 bg-transparent flex items-center justify-center">
            <Globe
                key={hazard} // Force remount when hazard changes to clear old rings
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                atmosphereColor="#87CEEB"
                atmosphereAltitude={0.15}

                pointsData={globeData}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.02}
                pointRadius={d => {
                    const base = (d as any).type === 'seismic' ? Math.pow((d as any).magnitude, 2.2) / 20 : (d as any).intensity * 0.4;
                    return Math.max(base, 1.0); // Larger, more visible points
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

                // Ring data for significant events - only show rings for current hazard type
                ringsData={ringsData}
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
