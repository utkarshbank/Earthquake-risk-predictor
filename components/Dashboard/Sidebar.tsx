'use client';

import { HazardEvent } from '@/services/hazardEvents';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Map as MapIcon,
    Clock,
    BarChart3,
    Info,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useHazard, HazardType } from '@/context/HazardContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Flame, CloudLightning, Shield } from 'lucide-react';

interface SidebarProps {
    selectedEvent: HazardEvent | null;
    totalEvents: number;
    period: string;
    magnitude: string;
    onPeriodChange: (p: string) => void;
    onMagChange: (m: string) => void;
}

export default function Sidebar({
    selectedEvent,
    totalEvents,
    period,
    magnitude,
    onPeriodChange,
    onMagChange,
}: SidebarProps) {
    const { hazard, setHazard, theme } = useHazard();
    const { solanaBalance } = useCurrency();

    const hazards: { id: HazardType; label: string; icon: any; color: string }[] = [
        { id: 'seismic', label: 'Seismic', icon: Activity, color: 'var(--seismic-cyan)' },
        { id: 'wildfire', label: 'Wildfire', icon: Flame, color: 'var(--wildfire-lava)' },
        { id: 'storm', label: 'Storm', icon: CloudLightning, color: 'var(--storm-torrent)' }
    ];

    const getPeriodLabel = (p: string) => {
        const labels: Record<string, string> = {
            'hour': 'Hour',
            'day': 'Day',
            'week': 'Week',
            'month': 'Month',
            'year': '1 Year'
        };
        return labels[p] || p;
    };
    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed top-8 left-8 z-[1000] w-80 max-h-[calc(100vh-4rem)] flex flex-col gap-6 overflow-visible"
        >
            {/* Brand Header */}
            <div className="elegant-panel p-6 border-white/5 bg-navy-900/40">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl serif text-white tracking-widest font-light uppercase">Aether</h1>
                    <div className="px-2.5 py-1 rounded bg-cyan/10 border-cyan/20 text-[0.55rem] text-cyan uppercase tracking-[0.3em] font-bold glow-cyan">Live Link</div>
                </div>
                <p className="text-[0.6rem] text-white/30 uppercase tracking-[0.4em] font-medium font-mono">{theme.label} Protocol</p>
                
                {/* SOLANA Balance */}
                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[0.5rem] uppercase tracking-[0.3em] text-white/20 font-bold font-mono">SOLANA Balance</span>
                        <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full">
                            <span className="text-lg serif text-gold glow-gold">{solanaBalance.toFixed(3)}</span>
                        </div>
                    </div>
                    <p className="text-[0.45rem] text-gold/40 uppercase tracking-[0.2em] font-mono mt-2 italic">0.015 SOL per full report</p>
                </div>
            </div>

            {/* Hazard Selector */}
            <div className="elegant-panel p-2 flex gap-1 border-white/5 bg-navy-900/40">
                {hazards.map((h) => (
                    <button
                        key={h.id}
                        onClick={() => setHazard(h.id)}
                        className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-3xl transition-all duration-500 ${hazard === h.id
                            ? 'bg-cyan/10 border border-cyan/30 text-cyan shadow-cyan'
                            : 'text-white/20 hover:text-white/40 hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <h.icon className="w-5 h-5" />
                        <span className="text-[0.5rem] uppercase tracking-[0.2em] font-bold">{h.label}</span>
                    </button>
                ))}
            </div>

            {/* Controls & Nav */}
            <div className="elegant-panel p-6 flex flex-col gap-8 overflow-y-auto border-white/5 bg-navy-900/40">
                {/* Primary Action */}
                <Link href="/analyze" className="w-full">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-cyan flex items-center justify-center gap-3 cursor-pointer group shadow-cyan"
                    >
                        <MapIcon className="w-4 h-4 transition-transform group-hover:rotate-12" />
                        <span className="text-[0.65rem] uppercase tracking-[0.3em] font-bold">Initiate Risk Lab</span>
                    </motion.div>
                </Link>

                {/* Intelligence Filters */}
                <div className="space-y-8">
                    <div key={`temporal-${hazard}`} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[0.6rem] uppercase tracking-[0.3em] text-white/20 font-bold flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" /> Temporal Range
                            </label>
                            <span className="text-[0.6rem] text-cyan uppercase font-bold tracking-widest font-mono glow-cyan">{getPeriodLabel(period)}</span>
                        </div>
                        <select
                            value={period}
                            onChange={(e) => onPeriodChange(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-[0.65rem] text-white/70 focus:outline-none focus:border-cyan/40 transition-all cursor-pointer appearance-none uppercase tracking-widest uppercase font-bold"
                        >
                            <option value="hour">Past Hour</option>
                            <option value="day">Past 24 Hours</option>
                            <option value="week">Past 7 Days</option>
                            <option value="month">Past 30 Days</option>
                            <option value="year">Past 1 Year</option>
                        </select>
                    </div>

                    <div key={`intensity-${hazard}`} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[0.6rem] uppercase tracking-[0.3em] text-white/20 font-bold flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" /> {hazard === 'seismic' ? 'Force' : 'Intensity'} Filter
                            </label>
                            <span className="text-[0.6rem] text-cyan uppercase font-bold tracking-widest font-mono glow-cyan">{hazard === 'seismic' ? 'M' : 'I'}{magnitude}+</span>
                        </div>
                        <select
                            value={magnitude}
                            onChange={(e) => onMagChange(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-[0.65rem] text-white/70 focus:outline-none focus:border-cyan/40 transition-all cursor-pointer appearance-none uppercase tracking-widest font-bold"
                        >
                            <option value="all">Full Spectrum</option>
                            <option value="1.0">{hazard === 'seismic' ? 'Magnitude 1.0+' : 'Intensity 0.1+'}</option>
                            <option value="2.5">{hazard === 'seismic' ? 'Magnitude 2.5+' : 'Intensity 0.25+'}</option>
                            <option value="4.5">{hazard === 'seismic' ? 'Magnitude 4.5+' : 'Intensity 0.45+'}</option>
                            <option value="significant">Critical Only</option>
                        </select>
                    </div>
                </div>

                {/* Metrics */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/20 font-bold font-mono">Satellite Records Found</span>
                        <div className="px-3 py-1 bg-white/5 rounded-full">
                            <span className="text-2xl serif text-white glow-gold">{totalEvents}</span>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            className="h-full bg-cyan shadow-cyan"
                        />
                    </div>
                </div>

                {/* Event Intel */}
                <AnimatePresence mode="wait">
                    {selectedEvent ? (
                        <motion.div
                            key={selectedEvent.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="elegant-card p-6 rounded-3xl relative overflow-hidden group border-cyan/20 bg-navy-800/60"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 blur-3xl rounded-full" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="px-3 py-1 rounded bg-cyan/10 border border-cyan/20 text-[0.5rem] text-cyan uppercase tracking-[0.3em] font-bold">Live Intelligence</div>
                                    <TrendingUp className="w-4 h-4 text-cyan/40" />
                                </div>
                                <h3 className="text-sm text-white/90 font-medium mb-4 leading-relaxed font-sans">
                                    {selectedEvent.label}
                                </h3>
                                <div className="flex items-end gap-3 pt-4 border-t border-white/5">
                                    <span className="text-4xl serif text-cyan leading-none glow-cyan">{selectedEvent.magnitude}</span>
                                    <div className="flex flex-col">
                                        <span className="text-[0.5rem] text-white/20 uppercase tracking-[0.3em] font-bold font-mono">
                                            {hazard === 'seismic' ? 'Magnitude' : 'Intensity'}
                                        </span>
                                        <span className="text-[0.5rem] text-cyan/30 uppercase tracking-[0.2em] font-bold font-mono italic">Spectral verified</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-10 text-center space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto shadow-sm">
                                <Info className="w-5 h-5 text-white/10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[0.6rem] text-white/20 uppercase tracking-[0.3em] font-bold leading-relaxed">
                                    Select coordinate on the Aether Globe to extract telemetry
                                </p>
                                <p className="text-[0.5rem] text-cyan/10 font-mono italic">Waiting for satellite ping...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
