'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type HazardType = 'seismic' | 'wildfire' | 'storm';

interface HazardContextType {
    hazard: HazardType;
    setHazard: (hazard: HazardType) => void;
    theme: {
        accent: string;
        secondary: string;
        glow: string;
        label: string;
    };
}

const HazardContext = createContext<HazardContextType | undefined>(undefined);

const THEMES = {
    seismic: {
        accent: '#00FFD1',
        secondary: '#D4AF37',
        glow: 'rgba(0, 255, 209, 0.4)',
        label: 'Seismic Intelligence'
    },
    wildfire: {
        accent: '#FF4D00',
        secondary: '#FFB302',
        glow: 'rgba(255, 77, 0, 0.4)',
        label: 'Wildfire Intelligence'
    },
    storm: {
        accent: '#00D1FF',
        secondary: '#E0F2F1',
        glow: 'rgba(0, 209, 255, 0.4)',
        label: 'Storm Intelligence'
    }
};

export function HazardProvider({ children }: { children: React.ReactNode }) {
    const [hazard, setHazard] = useState<HazardType>('seismic');

    useEffect(() => {
        document.documentElement.setAttribute('data-hazard', hazard);
    }, [hazard]);

    return (
        <HazardContext.Provider value={{ hazard, setHazard, theme: THEMES[hazard] }}>
            {children}
        </HazardContext.Provider>
    );
}

export function useHazard() {
    const context = useContext(HazardContext);
    if (!context) {
        throw new Error('useHazard must be used within a HazardProvider');
    }
    return context;
}
