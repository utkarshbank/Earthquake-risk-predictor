'use client';

import { useState } from 'react';
import ImageUploader from '@/components/Analysis/ImageUploader';
import { analyzeMapImage, AnalysisResult } from '@/services/imageAnalysis';
import ReportOverlay from '@/components/Analysis/ReportOverlay';

export default function AnalysisPage() {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [gridOpacity, setGridOpacity] = useState(0.6);
    const [hoveredChunk, setHoveredChunk] = useState<string | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);

    const handleImageSelected = (imgUrl: string) => {
        setImage(imgUrl);
        setResult(null);
    };

    const startAnalysis = async () => {
        if (!image) return;

        setIsAnalyzing(true);
        try {
            // Updated to 3x3 with expanded intelligence report
            const data = await analyzeMapImage(image, 3, 3);
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white', padding: '2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.5rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Earthquake Risk Predictor
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Advanced AI-driven seismic modeling and hazard assessment</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
                    {/* Left Side: Map/Image Viewer */}
                    <div style={{
                        backgroundColor: '#0f172a',
                        borderRadius: '1.5rem',
                        padding: '1.5rem',
                        border: '1px solid #1e293b',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        {!image ? (
                            <ImageUploader onImageSelected={handleImageSelected} />
                        ) : (
                            <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #334155' }}>
                                <img src={image} alt="Selected map" style={{ width: '100%', height: 'auto', display: 'block' }} />

                                {result && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gridTemplateRows: 'repeat(3, 1fr)',
                                        opacity: gridOpacity,
                                        transition: 'opacity 0.3s ease'
                                    }}>
                                        {result.chunks.map((chunk) => {
                                            const colors = {
                                                'Low': 'rgba(34, 197, 94, 0.6)',
                                                'Moderate': 'rgba(234, 179, 8, 0.6)',
                                                'High': 'rgba(249, 115, 22, 0.6)',
                                                'Critical': 'rgba(239, 68, 68, 0.6)'
                                            };
                                            return (
                                                <div
                                                    key={chunk.id}
                                                    onMouseEnter={() => setHoveredChunk(chunk.id)}
                                                    onMouseLeave={() => setHoveredChunk(null)}
                                                    style={{
                                                        border: hoveredChunk === chunk.id ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                                                        backgroundColor: colors[chunk.riskLevel],
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '5px',
                                                        left: '5px',
                                                        fontSize: '0.7rem',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        textShadow: '0 0 2px black'
                                                    }}>
                                                        {chunk.riskScore}%
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {image && result && (
                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Grid Opacity:</span>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.1"
                                    value={gridOpacity}
                                    onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                                    style={{ flex: 1, accentColor: '#818cf8' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Side: Analysis Controls & Results */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{
                            backgroundColor: '#0f172a',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            border: '1px solid #1e293b',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#f8fafc' }}>Risk Assessment</h2>

                            {!image ? (
                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>Upload a map image to begin the seismic vulnerability assessment and risk matrix generation.</p>
                            ) : (
                                <>
                                    {!result ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.75rem', borderLeft: '4px solid #818cf8' }}>
                                                <p style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>Image analysis ready. AI will generate a detailed probabilistic seismic report with full visual analytics.</p>
                                            </div>

                                            <button
                                                onClick={startAnalysis}
                                                disabled={isAnalyzing}
                                                style={{
                                                    backgroundColor: '#818cf8',
                                                    color: 'white',
                                                    padding: '1rem',
                                                    borderRadius: '0.75rem',
                                                    border: 'none',
                                                    fontWeight: '700',
                                                    fontSize: '1rem',
                                                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                                                    boxShadow: '0 10px 15px -3px rgba(129, 140, 248, 0.3)',
                                                    transition: 'all 0.2s ease',
                                                    opacity: isAnalyzing ? 0.7 : 1
                                                }}
                                            >
                                                {isAnalyzing ? 'Analyzing Map Geometry...' : 'Generate Full Risk Matrix'}
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

                                            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(129, 140, 248, 0.1)', borderRadius: '1rem', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                                                <h3 style={{ color: '#818cf8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Primary Risk Factor</h3>
                                                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                                                    {hoveredChunk
                                                        ? result.chunks.find(c => c.id === hoveredChunk)?.reason
                                                        : result.chunks.sort((a, b) => b.riskScore - a.riskScore)[0].reason
                                                    }
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setIsReportOpen(true)}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    color: 'white',
                                                    padding: '1rem',
                                                    borderRadius: '0.75rem',
                                                    border: '1px solid #334155',
                                                    fontWeight: '700',
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                📈 View Full Analysis Report
                                            </button>

                                            <button
                                                onClick={() => { setImage(null); setResult(null); }}
                                                style={{ color: '#64748b', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                                            >
                                                Reset Analysis
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Full Report Overlay */}
                {result && (
                    <ReportOverlay
                        isOpen={isReportOpen}
                        onClose={() => setIsReportOpen(false)}
                        data={result.reportData}
                        isAiVerified={result.isAiVerified}
                        region={result.detectedRegion}
                    />
                )}
            </div>
        </div>
    );
}
