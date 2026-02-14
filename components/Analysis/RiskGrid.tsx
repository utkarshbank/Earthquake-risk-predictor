'use client';

import { useState } from 'react';
import { GridChunk } from '@/services/imageAnalysis';

interface RiskGridProps {
    imageUrl: string;
    chunks: GridChunk[];
    rows: number;
    cols: number;
    opacity: number;
    highlightedChunkId?: string | null;
    onHover?: (id: string | null) => void;
}

const getRiskColor = (score: number) => {
    // Midnight Intelligence Palette for Risk
    if (score > 80) return 'rgba(0, 255, 209, 0.45)'; // Neon Cyan for critical
    if (score > 50) return 'rgba(212, 175, 55, 0.35)'; // Gold for significant
    if (score > 20) return 'rgba(113, 113, 122, 0.2)'; // Zinc/Slate
    return 'rgba(39, 39, 42, 0.15)'; // Near transparent stealth black
};

export default function RiskGrid({ imageUrl, chunks, rows, cols, opacity, highlightedChunkId, onHover }: RiskGridProps) {
    const [internalHoverId, setInternalHoverId] = useState<string | null>(null);

    const handleMouseEnter = (id: string) => {
        setInternalHoverId(id);
        onHover?.(id);
    };

    const handleMouseLeave = () => {
        setInternalHoverId(null);
        onHover?.(null);
    };

    return (
        <div
            className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white/5 bg-navy-900"
            style={{
                width: 'fit-content',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: '1fr'
            }}
        >
            {/* Base Image */}
            <img
                src={imageUrl}
                alt="Analyzed Map"
                style={{
                    maxHeight: '65vh',
                    maxWidth: '100%',
                    display: 'block',
                    gridColumn: 1,
                    gridRow: 1
                }}
            />

            {/* Grid Overlay */}
            <div
                className="grid"
                style={{
                    gridColumn: 1,
                    gridRow: 1,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    zIndex: 10
                }}
                onMouseLeave={handleMouseLeave}
            >
                {chunks.map((chunk) => {
                    const isHighlighted = highlightedChunkId === chunk.id || internalHoverId === chunk.id;
                    return (
                        <div
                            key={chunk.id}
                            className="relative cursor-crosshair transition-all duration-700"
                            style={{
                                backgroundColor: isHighlighted ? 'rgba(0, 255, 209, 0.2)' : getRiskColor(chunk.riskScore),
                                opacity: isHighlighted ? 1 : opacity,
                                border: isHighlighted ? '2px solid rgba(0, 255, 209, 0.5)' : '1px solid rgba(255,255,255,0.03)',
                                zIndex: isHighlighted ? 50 : 1,
                            }}
                            onMouseEnter={() => handleMouseEnter(chunk.id)}
                        >
                            {/* Visual Feedback on Highlight */}
                            {isHighlighted && (
                                <div className="absolute inset-0 flex items-center justify-center p-2 backdrop-blur-[2px]">
                                    <div className="px-5 py-2 rounded-xl bg-navy-900/90 border-2 border-cyan/40 text-[0.7rem] font-bold text-cyan tracking-[0.3em] uppercase shadow-cyan glow-cyan font-mono">
                                        INTEL {chunk.riskScore}%
                                    </div>
                                </div>
                            )}

                            {/* Signal Pulses for high risk */}
                            {chunk.riskScore > 80 && !isHighlighted && (
                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan shadow-cyan animate-pulse" />
                            )}
                            {chunk.riskScore > 50 && chunk.riskScore <= 80 && !isHighlighted && (
                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold shadow-gold opacity-50" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
