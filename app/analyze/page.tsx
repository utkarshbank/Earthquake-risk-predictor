'use client';

import { useState } from 'react';
import ImageUploader from '@/components/Analysis/ImageUploader';
import RiskGrid from '@/components/Analysis/RiskGrid';
import { analyzeMapImage, AnalysisResult } from '@/services/imageAnalysis';
import Link from 'next/link';

export default function AnalysisPage() {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [gridOpacity, setGridOpacity] = useState(0.6);
    const [location, setLocation] = useState('');
    const [hoveredChunk, setHoveredChunk] = useState<string | null>(null);

    const handleImageSelected = (imgUrl: string) => {
        setImage(imgUrl);
        setResult(null); // Reset previous results
    };

    const startAnalysis = async () => {
        if (!image) return;

        setIsAnalyzing(true);
        try {
            // Updated to 3x3 with location context
            const data = await analyzeMapImage(image, 3, 3, location);
            setResult(data);
        } catch (err) {
            console.error(err);
            alert('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setImage(null);
        setResult(null);
        setHoveredChunk(null);
    };

    const hoveredData = result?.chunks.find(c => c.id === hoveredChunk);

    return (
        <div className="min-h-screen bg-slate-950 text-white" style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white' }}>

            <div className="container-max">
                {/* Header */}
                <header className="header-flex">
                    <h1 className="heading-1" style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Risk Intelligence
                    </h1>
                    <Link href="/" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', backgroundColor: '#1e293b', border: '1px solid #334155', transition: 'all 0.3s ease' }}>
                        ← Back to Map
                    </Link>
                </header>

                <div className="grid-layout" style={{ gap: '2.5rem' }}>

                    {/* Left Column: Visuals */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '600px', backgroundColor: '#0f172a', borderRadius: '1.5rem', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '1.5rem' }}>
                        {!image ? (
                            <div style={{ width: '100%', maxWidth: '450px' }}>
                                <ImageUploader onImageSelected={handleImageSelected} />
                            </div>
                        ) : (
                            <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                                {result ? (
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <RiskGrid
                                            imageUrl={image}
                                            chunks={result.chunks}
                                            rows={3}
                                            cols={3}
                                            opacity={gridOpacity}
                                            highlightedChunkId={hoveredChunk}
                                            onHover={setHoveredChunk}
                                        />
                                    </div>
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={image} alt="Upload Preview" style={{ borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', maxHeight: '65vh', maxWidth: '100%', objectFit: 'contain' }} />
                                )}

                                {isAnalyzing && (
                                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.5rem', zIndex: 50, backdropFilter: 'blur(8px)' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div className="animate-spin" style={{ height: '4rem', width: '4rem', borderTop: '4px solid #818cf8', borderRight: '4px solid transparent', borderRadius: '9999px', margin: '0 auto 1.5rem auto' }}></div>
                                            <p style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.025em' }}>Calculating Seismic Risk...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Controls & Results */}
                    <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '2rem', backgroundColor: '#0f172a', borderRadius: '1.5rem', border: '1px solid #1e293b', padding: '2rem' }}>
                        <h2 className="heading-2" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Analysis Report</h2>

                        {!image ? (
                            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>Please upload a satellite image or regional map to generate a localized risk assessment.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {!result ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.75rem', borderLeft: '4px solid #818cf8' }}>
                                            <p style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>Image analysis ready. Process will segment the area into a 3x3 grid for high-precision modeling.</p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location Context</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Sicily, Italy or Upington, SA"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '0.75rem',
                                                    backgroundColor: 'rgba(2, 6, 23, 0.5)',
                                                    border: '1px solid #334155',
                                                    color: 'white',
                                                    fontSize: '0.9rem',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <button
                                            onClick={startAnalysis}
                                            disabled={isAnalyzing}
                                            className="btn-primary"
                                            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600', transition: 'all 0.3s ease', backgroundColor: '#818cf8' }}
                                        >
                                            {isAnalyzing ? 'Processing Area...' : 'Generate 3x3 Risk Matrix'}
                                        </button>
                                        <button
                                            onClick={reset}
                                            className="btn-secondary"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: 'transparent', border: '1px solid #334155' }}
                                        >
                                            Reset Selection
                                        </button>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="metric-card" style={{ padding: '1.25rem', backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155' }}>
                                                <h3 style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Average Risk</h3>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                                    <span style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>{result.averageRisk}%</span>
                                                </div>
                                            </div>

                                            <div className="metric-card" style={{ padding: '1.25rem', backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155' }}>
                                                <h3 style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Critical Zones</h3>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                                    <span style={{ fontSize: '2rem', fontWeight: '800', color: result.highRiskCount > 0 ? '#f87171' : '#4ade80' }}>{result.highRiskCount}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/ 9</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Risk Explanation Section */}
                                        <div style={{ padding: '1.5rem', backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155', transition: 'all 0.3s ease', minHeight: '180px' }}>
                                            <h3 style={{ color: '#818cf8', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ height: '8px', width: '8px', borderRadius: '9999px', backgroundColor: hoveredData ? getRiskColor(hoveredData.riskScore) : '#475569' }}></span>
                                                {hoveredData ? `Section [${hoveredData.row + 1}, ${hoveredData.col + 1}] Analysis` : "Select a Zone to Analyze"}
                                            </h3>

                                            {hoveredData ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{hoveredData.riskScore}% Risk</span>
                                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.1)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            {hoveredData.riskLevel}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                                                <span style={{ fontSize: '1rem' }}>🪨</span>
                                                                <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Geological Factors</span>
                                                            </div>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                                                {hoveredData.details.geological}
                                                            </p>
                                                        </div>

                                                        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                                                <span style={{ fontSize: '1rem' }}>🏗️</span>
                                                                <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Structural Integrity</span>
                                                            </div>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                                                {hoveredData.details.structural}
                                                            </p>
                                                        </div>

                                                        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                                                <span style={{ fontSize: '1rem' }}>🏙️</span>
                                                                <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Urban Environment</span>
                                                            </div>
                                                            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                                                {hoveredData.details.urban}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                                    Hover over a grid section on the map to see localized risk metrics and detailed architectural vulnerability analysis.
                                                </p>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>Grid Visibility</label>
                                                <span style={{ fontSize: '0.875rem', color: '#818cf8' }}>{Math.round(gridOpacity * 100)}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="0.9"
                                                step="0.05"
                                                value={gridOpacity}
                                                onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                                                style={{ width: '100%', accentColor: '#818cf8', height: '6px', cursor: 'pointer' }}
                                            />
                                        </div>

                                        <button
                                            onClick={reset}
                                            className="btn-danger"
                                            style={{ padding: '1rem', borderRadius: '0.75rem', fontWeight: '600', backgroundColor: 'transparent', border: '1px solid #451a1a', color: '#f87171', transition: 'all 0.3s' }}
                                        >
                                            New Analysis
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper to provide color in page.tsx as well
const getRiskColor = (score: number) => {
    if (score > 80) return '#ef4444'; // Red
    if (score > 50) return '#f97316'; // Orange
    if (score > 20) return '#eab308'; // Yellow
    return '#22c55e'; // Green
};
