'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Settings2,
    ShieldAlert,
    Activity,
    ChevronRight,
    Info,
    Scan,
    RefreshCcw,
    MapPin,
    Zap,
    Cpu
} from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/Analysis/ImageUploader';
import RiskGrid from '@/components/Analysis/RiskGrid';
import { analyzeMapImage, AnalysisResult } from '@/services/imageAnalysis';

export default function AnalysisPage() {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [gridOpacity, setGridOpacity] = useState(0.4);
    const [location, setLocation] = useState('');
    const [hoveredChunk, setHoveredChunk] = useState<string | null>(null);

    const handleImageSelected = (imgUrl: string) => {
        setImage(imgUrl);
        setResult(null);
    };

    const startAnalysis = async () => {
        if (!image) return;
        setIsAnalyzing(true);
        try {
            const data = await analyzeMapImage(image, 3, 3, location);
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setImage(null);
        setResult(null);
        setHoveredChunk(null);
        setLocation('');
    };

    const hoveredData = result?.chunks.find(c => c.id === hoveredChunk);

    return (
        <main className="min-h-screen relative overflow-x-hidden pt-12 pb-24 bg-midnight">
            {/* Midnight Intelligence Background Glows */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-cyan/5 blur-[200px] rounded-full -z-10" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 blur-[200px] rounded-full -z-10" />

            <div className="container mx-auto px-8 max-w-7xl">
                {/* Navigation Header */}
                <header className="flex justify-between items-end mb-20">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-10"
                    >
                        <Link href="/" className="group p-4 rounded-2xl border border-white/5 bg-navy-900/40 hover:border-cyan/50 hover:bg-cyan/5 transition-all duration-500 shadow-xl">
                            <ArrowLeft className="w-6 h-6 text-cyan/60 group-hover:text-cyan group-hover:-translate-x-1 transition-all" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Cpu className="w-4 h-4 text-cyan/30" />
                                <span className="text-[0.55rem] uppercase tracking-[0.5em] font-bold text-white/30 font-mono">Neural Analysis Node</span>
                            </div>
                            <h1 className="text-5xl serif text-white tracking-widest font-light uppercase">
                                Risk <span className="text-cyan glow-cyan italic">Lab</span>
                            </h1>
                        </div>
                    </motion.div>

                    <Link href="/">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-[0.65rem] uppercase tracking-[0.4em] font-bold text-white/20 hover:text-cyan transition-all flex items-center gap-4 group"
                        >
                            <span className="group-hover:tracking-[0.5em] transition-all">De-authenticate</span>
                            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-cyan" />
                        </motion.div>
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Visual Section (Main Viewer) */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-8 group relative"
                    >
                        <div className="elegant-panel p-1 border-white/5 bg-navy-800/40 shadow-2xl overflow-hidden min-h-[600px] flex items-center justify-center relative">
                            <div className="w-full h-full p-8 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {!image ? (
                                        <motion.div
                                            key="uploader"
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 1.05, opacity: 0 }}
                                            className="w-full max-w-lg"
                                        >
                                            <ImageUploader onImageSelected={handleImageSelected} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full flex flex-col items-center gap-10 py-6"
                                        >
                                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group/img border-4 border-white/5 bg-midnight p-2">
                                                {result ? (
                                                    <RiskGrid
                                                        imageUrl={image}
                                                        chunks={result.chunks}
                                                        rows={3}
                                                        cols={3}
                                                        opacity={gridOpacity}
                                                        highlightedChunkId={hoveredChunk}
                                                        onHover={setHoveredChunk}
                                                    />
                                                ) : (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={image} alt="Upload Preview" className="max-h-[65vh] w-auto object-contain rounded-2xl" />
                                                )}

                                                {isAnalyzing && (
                                                    <div className="absolute inset-0 bg-midnight/90 backdrop-blur-3xl flex flex-col items-center justify-center gap-10 z-50">
                                                        <div className="relative">
                                                            <div className="w-24 h-24 rounded-full border-t-2 border-cyan animate-spin shadow-cyan" />
                                                            <Scan className="w-8 h-8 text-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse glow-cyan" />
                                                        </div>
                                                        <div className="text-center space-y-3">
                                                            <p className="text-2xl serif tracking-[0.3em] uppercase text-white glow-cyan">Spectral Extraction</p>
                                                            <p className="text-[0.55rem] tracking-[0.5em] text-cyan/40 uppercase font-mono font-bold">Synchronizing Satellite Telemetry</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Billion Dollar Corners */}
                            <div className="absolute top-10 left-10 w-px h-16 bg-gradient-to-b from-cyan/40 to-transparent" />
                            <div className="absolute top-10 left-10 w-16 h-px bg-gradient-to-r from-cyan/40 to-transparent" />
                            <div className="absolute bottom-10 right-10 w-px h-16 bg-gradient-to-t from-gold/40 to-transparent" />
                            <div className="absolute bottom-10 right-10 w-16 h-px bg-gradient-to-l from-gold/40 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Controls & Metrics Section */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4 space-y-10"
                    >
                        {/* Status Card */}
                        <div className="elegant-panel p-10 space-y-10 border-white/5 bg-navy-900/40 shadow-2xl">
                            <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                                <div className="p-3.5 rounded-2xl bg-cyan/10 border border-cyan/20 text-cyan shadow-cyan">
                                    <Settings2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-white/40 mb-1">Telemetry Status</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping" />
                                        <span className="text-[0.55rem] text-cyan uppercase font-mono tracking-widest font-bold">Secure Link Active</span>
                                    </div>
                                </div>
                            </div>

                            {!image ? (
                                <div className="py-12 space-y-8">
                                    <p className="text-[0.75rem] text-white/30 leading-relaxed italic border-l-2 border-cyan/20 pl-8 font-serif">
                                        Awaiting high-resolution spectral transmission. Provide structural mapping data to initialize neural simulation.
                                    </p>
                                    <div className="flex items-center gap-4 text-[0.6rem] text-cyan/40 uppercase font-bold tracking-[0.3em] font-mono">
                                        <Zap className="w-4 h-4" />
                                        <span>Full Power Reserved</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {!result ? (
                                        <>
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <label className="flex items-center gap-3 text-[0.6rem] font-bold text-white/20 uppercase tracking-[0.3em] font-mono">
                                                        <MapPin className="w-4 h-4 text-cyan/40" />
                                                        Regional Identifier
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="ENTER COORDINATES OR SECTOR TAG"
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        className="w-full bg-midnight/60 border border-white/10 rounded-2xl px-6 py-5 text-xs text-white placeholder:text-white/10 outline-none focus:border-cyan/50 transition-all font-mono tracking-widest uppercase shadow-inner"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-6">
                                                <button
                                                    onClick={startAnalysis}
                                                    disabled={isAnalyzing}
                                                    className="btn-cyan w-full py-5 text-[0.7rem] tracking-[0.4em] uppercase font-bold flex items-center justify-center gap-4 shadow-cyan"
                                                >
                                                    <Scan className="w-5 h-5" />
                                                    {isAnalyzing ? 'Processing...' : 'Execute Intelligence'}
                                                </button>
                                                <button
                                                    onClick={reset}
                                                    className="w-full py-4 text-[0.6rem] font-bold tracking-[0.3em] uppercase text-white/10 hover:text-white/40 transition-colors uppercase"
                                                >
                                                    Flush Buffer
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="space-y-12">
                                            {/* Top Metrics */}
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="elegant-card p-8 rounded-[2rem] border-cyan/10 bg-navy-800/60 shadow-xl overflow-hidden relative">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan shadow-cyan" />
                                                    <p className="text-[0.55rem] uppercase font-mono font-bold text-white/20 mb-3 tracking-widest">Aggregate Risk</p>
                                                    <p className="text-4xl serif text-white tracking-widest glow-cyan">
                                                        {result.averageRisk}<span className="text-[0.6rem] text-cyan/40 ml-1 font-mono">%</span>
                                                    </p>
                                                </div>
                                                <div className="elegant-card p-8 rounded-[2rem] border-gold/10 bg-navy-800/60 shadow-xl overflow-hidden relative">
                                                    <div className="absolute top-0 left-0 w-full h-1 bg-gold shadow-gold" />
                                                    <p className="text-[0.55rem] uppercase font-mono font-bold text-white/20 mb-3 tracking-widest">Critical Zones</p>
                                                    <p className={`text-4xl serif tracking-widest ${result.highRiskCount > 0 ? 'text-gold glow-gold' : 'text-white/20'}`}>
                                                        {result.highRiskCount}<span className="text-[0.6rem] text-white/20 ml-1 font-mono">/ 9</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Section Deep-Dive */}
                                            <div className="space-y-8">
                                                <div className="flex items-center justify-between px-2">
                                                    <h3 className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-white/10 font-mono">Neural Insights</h3>
                                                    {hoveredData && (
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-2 h-2 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: getRiskColor(hoveredData.riskScore), boxShadow: `0 0 10px ${getRiskColor(hoveredData.riskScore)}` }} />
                                                            <span className="text-[0.65rem] font-bold text-white/60 font-mono">INDEX-{hoveredData.row}{hoveredData.col}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="elegant-card p-8 rounded-[2.5rem] min-h-[300px] relative overflow-hidden group/card border-white/5 bg-navy-900/40 shadow-2xl">
                                                    <AnimatePresence mode="wait">
                                                        {hoveredData ? (
                                                            <motion.div
                                                                key={hoveredData.id}
                                                                initial={{ opacity: 0, y: 15 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -15 }}
                                                                className="space-y-10"
                                                            >
                                                                <div className="flex justify-between items-end">
                                                                    <p className="text-6xl serif text-white tracking-widest glow-cyan">
                                                                        {hoveredData.riskScore}<span className="text-xl text-cyan/30 ml-1 font-mono">%</span>
                                                                    </p>
                                                                    <div className="px-4 py-1.5 rounded bg-cyan/10 border border-cyan/20 text-[0.55rem] font-bold uppercase tracking-[0.4em] text-cyan mb-3 glow-cyan">
                                                                        {hoveredData.riskLevel} Hazard
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-8 border-t border-white/5 pt-8">
                                                                    {[
                                                                        { label: "SUBSURFACE GEOLOGY", val: hoveredData.details.geological },
                                                                        { label: "STRUCTURAL PROTOCOLS", val: hoveredData.details.structural },
                                                                        { label: "SOCIO-URBAN IMPACT", val: hoveredData.details.urban }
                                                                    ].map((item, i) => (
                                                                        <div key={i} className="space-y-2">
                                                                            <p className="text-[0.5rem] uppercase font-bold text-white/20 tracking-[0.4em] font-mono">{item.label}</p>
                                                                            <p className="text-[0.75rem] leading-relaxed text-white/70 font-sans tracking-wide">{item.val}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="h-full flex flex-col items-center justify-center text-center py-16 space-y-8"
                                                            >
                                                                <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.01]">
                                                                    <Scan className="w-8 h-8 text-white/10" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <p className="text-[0.65rem] text-white/10 uppercase font-bold tracking-[0.4em] px-12 leading-relaxed italic font-serif">
                                                                        Synchronize pointer with sector nodes to extract deep spectral telemetry.
                                                                    </p>
                                                                    <p className="text-[0.5rem] text-cyan/5 uppercase tracking-widest font-mono">Neural stream standby</p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            {/* Options */}
                                            <div className="space-y-10 pt-10">
                                                <div className="flex items-center justify-between px-2">
                                                    <label className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-white/20 font-mono">Overlay Density</label>
                                                    <span className="text-[0.7rem] font-bold text-cyan glow-cyan font-mono">{Math.round(gridOpacity * 100)}%</span>
                                                </div>
                                                <div className="relative h-2 bg-white/5 rounded-full">
                                                    <motion.div
                                                        className="absolute h-full bg-cyan shadow-cyan rounded-full"
                                                        style={{ width: `${gridOpacity * 100}%` }}
                                                    />
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="0.9"
                                                        step="0.05"
                                                        value={gridOpacity}
                                                        onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                                                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                                <button
                                                    onClick={reset}
                                                    className="w-full mt-10 flex items-center justify-center gap-4 group text-[0.65rem] font-bold uppercase tracking-[0.4em] text-cyan/30 hover:text-cyan transition-all py-6 rounded-[2rem] border border-cyan/10 hover:bg-cyan/5 shadow-inner"
                                                >
                                                    <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-1000" />
                                                    Re-Sync Protocol
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Additional Lab Info */}
                        <div className="elegant-panel p-8 bg-cyan/[0.02] flex gap-8 items-center border-cyan/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 blur-3xl rounded-full -z-10" />
                            <div className="w-14 h-14 rounded-full border border-cyan/20 flex items-center justify-center text-cyan shadow-cyan bg-midnight shrink-0">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <p className="text-[0.65rem] leading-relaxed text-white/40 uppercase font-bold tracking-[0.3em] font-mono">
                                Intelligence stream synchronized with real-time neural extraction and historical seismic force records.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

const getRiskColor = (score: number) => {
    if (score > 80) return '#00FFD1'; // Neon Cyan
    if (score > 50) return '#D4AF37'; // Gold
    if (score > 20) return '#71717a'; // Zinc
    return '#27272a'; // Zinc 800
};
