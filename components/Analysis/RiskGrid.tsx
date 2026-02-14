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
    if (score > 80) return 'rgba(239, 68, 68, 0.7)'; // Red
    if (score > 50) return 'rgba(249, 115, 22, 0.7)'; // Orange
    if (score > 20) return 'rgba(234, 179, 8, 0.6)'; // Yellow
    return 'rgba(34, 197, 94, 0.4)'; // Green
};

export default function RiskGrid({ imageUrl, chunks, rows, cols, opacity, highlightedChunkId, onHover }: RiskGridProps) {
    // Track internal hover state for direct map interaction
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
            className="relative overflow-hidden rounded-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-slate-800 bg-slate-900"
            style={{
                width: 'fit-content',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: '1fr'
            }}
        >
            {/* Base Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                backgroundColor: getRiskColor(chunk.riskScore),
                                opacity: isHighlighted ? 1 : opacity,
                                border: isHighlighted ? '3px solid rgba(255,255,255,0.9)' : '0.5px solid rgba(255,255,255,0.15)',
                                zIndex: isHighlighted ? 50 : 1,
                                cursor: 'pointer',
                                backdropFilter: isHighlighted ? 'blur(2px)' : 'none',
                                boxSizing: 'border-box'
                            }}
                            onMouseEnter={() => handleMouseEnter(chunk.id)}
                        >
                            {/* Value Display on Highlight */}
                            {isHighlighted && (
                                <div style={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    padding: '0.5rem 0.8rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '800',
                                    color: 'white',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {chunk.riskScore}%
                                </div>
                            )}

                            {/* Visual Feedback for Critical Risk */}
                            {chunk.riskScore > 80 && !isHighlighted && (
                                <div style={{
                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                    fontSize: '1.2rem'
                                }}>
                                    ⚠️
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.9); }
                }
            `}</style>
        </div>
    );
}
