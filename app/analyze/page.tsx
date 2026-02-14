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
    // [Added state]
    const [hoveredChunk, setHoveredChunk] = useState<string | null>(null);

    const handleImageSelected = (imgUrl: string) => {
        setImage(imgUrl);
        setResult(null); // Reset previous results
    };

    const startAnalysis = async () => {
        if (!image) return;

        setIsAnalyzing(true);
        try {
            // Analyze with a 10x10 grid for demo purposes
            const data = await analyzeMapImage(image, 10, 10);
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
    };

    // Filter for high risk chunks to display in sidebar
    const highRiskChunks = result?.chunks
        .filter(c => c.riskScore > 50)
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5) || [];

    return (
        <div className="min-h-screen bg-slate-950 text-white" style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white' }}>

            <div className="container-max">
                {/* Header */}
                <header className="header-flex">
                    <h1 className="heading-1">
                        Map Analysis
                    </h1>
                    <Link href="/" className="btn-secondary">
                        ← Back to Map
                    </Link>
                </header>

                <div className="grid-layout">

                    {/* Left Column: Visuals */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
                        {!image ? (
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <ImageUploader onImageSelected={handleImageSelected} />
                            </div>
                        ) : (
                            <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                {result ? (
                                    <RiskGrid
                                        imageUrl={image}
                                        chunks={result.chunks}
                                        rows={10}
                                        cols={10}
                                        opacity={gridOpacity}
                                        highlightedChunkId={hoveredChunk}
                                    />
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={image} alt="Upload Preview" style={{ borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxHeight: '60vh', maxWidth: '100%' }} />
                                )}

                                {isAnalyzing && (
                                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', zIndex: 50, backdropFilter: 'blur(4px)' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div className="animate-spin" style={{ height: '3rem', width: '3rem', borderBottom: '2px solid #3b82f6', borderRadius: '9999px', margin: '0 auto 1rem auto' }}></div>
                                            <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Analyzing Topography...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Controls & Results */}
                    <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '2rem' }}>
                        <h2 className="heading-2">Analysis Control</h2>

                        {!image ? (
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Upload a map image (satellite view recommended) to begin analysis.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {!result ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Image loaded ready for processing.</p>
                                        <button
                                            onClick={startAnalysis}
                                            disabled={isAnalyzing}
                                            className="btn-primary"
                                            style={{ opacity: isAnalyzing ? 0.5 : 1, cursor: isAnalyzing ? 'not-allowed' : 'pointer' }}
                                        >
                                            {isAnalyzing ? 'Processing...' : 'Run Risk Analysis'}
                                        </button>
                                        <button
                                            onClick={reset}
                                            className="btn-secondary"
                                            style={{ width: '100%', textAlign: 'center' }}
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                        <div className="metric-card">
                                            <h3 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Overall Risk Score</h3>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '2.25rem', fontWeight: '900', color: 'white', lineHeight: '1' }}>{result.averageRisk}</span>
                                                <span style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>/ 100</span>
                                            </div>
                                        </div>

                                        <div className="metric-card">
                                            <h3 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>High Risk Zones</h3>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '2.25rem', fontWeight: '900', color: '#ef4444', lineHeight: '1' }}>{result.highRiskCount}</span>
                                                <span style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>chunks detected</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Overlay Opacity</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={gridOpacity}
                                                onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                                                className="range-input"
                                            />
                                        </div>

                                        <button
                                            onClick={reset}
                                            className="btn-danger"
                                        >
                                            Start New Analysis
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
