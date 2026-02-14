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
}

const getRiskColor = (score: number) => {
    if (score > 80) return 'rgba(239, 68, 68, 0.6)'; // Red
    if (score > 50) return 'rgba(249, 115, 22, 0.6)'; // Orange
    if (score > 20) return 'rgba(234, 179, 8, 0.5)'; // Yellow
    return 'rgba(34, 197, 94, 0.3)'; // Green
};

export default function RiskGrid({ imageUrl, chunks, rows, cols, opacity, highlightedChunkId }: RiskGridProps) {
    // Track internal hover state for direct map interaction
    const [internalHoverId, setInternalHoverId] = useState<string | null>(null);

    return (
        <div className="relative inline-block overflow-hidden rounded-lg shadow-2xl border border-slate-700">
            {/* Base Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Analyzed Map" className="block max-w-full h-auto" />

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 grid"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                }}
                onMouseLeave={() => setInternalHoverId(null)}
            >
                {chunks.map((chunk) => {
                    // Highlight if triggered by external prop OR internal hover
                    const isHighlighted = highlightedChunkId === chunk.id || internalHoverId === chunk.id;
                    return (
                        <div
                            key={chunk.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                transition: 'all 0.2s ease-in-out',
                                backgroundColor: getRiskColor(chunk.riskScore),
                                opacity: isHighlighted ? 0.9 : opacity,
                                border: isHighlighted ? '2px solid white' : '0.5px solid rgba(255,255,255,0.2)',
                                transform: isHighlighted ? 'scale(1.15)' : 'scale(1)',
                                zIndex: isHighlighted ? 50 : 1,
                                boxShadow: isHighlighted ? '0 0 20px rgba(255,255,255,0.8)' : 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setInternalHoverId(chunk.id)}
                        // MouseLeave handled by parent grid to avoid flickering
                        >
                            {/* Visual Feedback for High Risk (Icon) */}
                            {chunk.riskScore > 80 && !isHighlighted && (
                                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>⚠️</span>
                            )}

                            {/* Tooltip-like popup on hover/highlight */}
                            <div
                                style={{
                                    opacity: isHighlighted ? 1 : 0,
                                    position: 'absolute',
                                    bottom: '100%',
                                    marginBottom: '0.5rem',
                                    zIndex: 60,
                                    backgroundColor: '#0f172a',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    padding: '0.5rem',
                                    borderRadius: '0.25rem',
                                    whiteSpace: 'nowrap',
                                    pointerEvents: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #475569',
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                <div style={{ fontWeight: 'bold' }}>Risk: {chunk.riskScore}%</div>
                                <div>Level: {chunk.riskLevel}</div>
                                <div style={{ color: '#94a3b8' }}>Dim: {chunk.row}x{chunk.col}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
