'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert, Activity, TrendingUp, Flame, CloudLightning } from 'lucide-react';
import { ReportData, HazardType } from '@/services/imageAnalysis';
import { useHazard } from '@/context/HazardContext';
import { useCurrency } from '@/context/CurrencyContext';

interface ReportOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    data: ReportData;
    isAiVerified?: boolean;
    region?: string;
}

const BRAND_COLORS = ['var(--hazard-accent)', 'var(--hazard-secondary)', '#1A2230', '#0B0E14', '#FFFFFF'];

export default function ReportOverlay({ isOpen, onClose, data, isAiVerified, region }: ReportOverlayProps) {
    const { hazard, theme } = useHazard();
    const { solanaBalance } = useCurrency();
    if (!isOpen) return null;

    const HazardIcon = hazard === 'seismic' ? Activity : hazard === 'wildfire' ? Flame : CloudLightning;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col p-8 overflow-y-auto bg-midnight/95 backdrop-blur-2xl">
            <div className="max-w-6xl w-full mx-auto flex flex-col gap-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-4xl serif font-light tracking-widest uppercase text-white">
                                {hazard === 'seismic' ? 'Seismic' : hazard === 'wildfire' ? 'Wildfire' : 'Storm'} <span className="text-cyan glow-cyan italic">Intelligence</span>
                            </h2>
                            {isAiVerified && (
                                <span className="px-3 py-1 bg-cyan/10 border border-cyan/20 text-[0.6rem] text-cyan uppercase tracking-[0.3em] font-bold glow-cyan flex items-center gap-2 rounded-full">
                                    <Zap className="w-3 h-3" /> AI CALIBRATED
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-6">
                            <p className="text-[0.65rem] uppercase tracking-[0.4em] font-bold text-white/30 font-mono">
                                {region ? `Regional Analysis Matrix: ${region}` : 'Satellite Spectral Analytics & Structural Vulnerability'}
                            </p>
                            {/* SOLANA Balance */}
                            <div className="flex items-center gap-3 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full">
                                <span className="text-[0.5rem] text-gold/60 uppercase tracking-[0.2em] font-mono">SOLANA</span>
                                <span className="text-sm serif text-gold glow-gold">{solanaBalance.toFixed(3)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <div className="text-[0.5rem] text-white/20 uppercase tracking-[0.3em] font-bold font-mono mb-1">
                                Accuracy Baseline
                            </div>
                            <div className="flex items-center gap-2 text-cyan font-bold tracking-widest text-[0.6rem] uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-cyan animate-pulse"></div>
                                {isAiVerified ? 'NEURAL SYNCED' : 'LOCAL VISION'}
                            </div>
                        </div>
                        <button onClick={onClose} className="btn-minimal">
                            Back to Analysis
                        </button>
                    </div>
                </div>

                {/* AI Justification Section */}
                {data.justification && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="elegant-panel !rounded-3xl p-6 bg-cyan/5 border-cyan/10"
                    >
                        <div className="text-[0.55rem] text-cyan/40 font-bold uppercase tracking-[0.4em] mb-3 flex items-center gap-3">
                            <ShieldAlert className="w-3 h-3" /> Core AI Assessment
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed font-light italic">
                            "{data.justification}"
                        </p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Graph 1: Temporal Trend */}
                    <div className="elegant-card p-8 rounded-[2.5rem] bg-navy-900/40 border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg text-white tracking-widest uppercase font-light">{data.unit1 || 'Strain'} Forecast</h3>
                                <p className="text-[0.5rem] text-white/20 uppercase tracking-[0.2em] font-mono">{hazard === 'seismic' ? 'Tectonic Spectral Flux' : hazard === 'wildfire' ? 'Biomass Ignition Potential' : 'Atmospheric Load Telemetry'}</p>
                            </div>
                            <HazardIcon className="w-4 h-4 text-cyan/30" />
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer>
                                <AreaChart data={data.temporalTrend}>
                                    <defs>
                                        <linearGradient id="colorStrain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00FFD1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#00FFD1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.1)" axisLine={false} tickLine={false} style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em' }} />
                                    <YAxis stroke="rgba(255,255,255,0.1)" axisLine={false} tickLine={false} style={{ fontSize: '0.6rem', fontWeight: 600 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid var(--hazard-accent)', borderRadius: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: 'var(--hazard-accent)', fontSize: '0.7rem', fontWeight: 700 }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', marginBottom: '4px', textTransform: 'uppercase' }}
                                    />
                                    <Area type="monotone" dataKey="value1" stroke="var(--hazard-accent)" fillOpacity={1} fill="url(#colorStrain)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="value2" stroke="var(--hazard-secondary)" fillOpacity={0.1} fill="transparent" strokeWidth={1} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Graph 2: Magnitude Distribution */}
                    <div className="elegant-card p-8 rounded-[2.5rem] bg-navy-900/40 border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg text-white tracking-widest uppercase font-light">{hazard === 'seismic' ? 'Risk Frequency' : 'Intensity Map'}</h3>
                                <p className="text-[0.5rem] text-white/20 uppercase tracking-[0.2em] font-mono">{hazard === 'seismic' ? 'Gutenberg-Richter Recurrence' : hazard === 'wildfire' ? 'Drought-Ignition Correlation' : 'Nexrad Precipitation Indices'}</p>
                            </div>
                            <TrendingUp className="w-4 h-4 text-gold/30" />
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={data.magnitudeDist}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.1)" axisLine={false} tickLine={false} style={{ fontSize: '0.6rem', fontWeight: 600 }} />
                                    <YAxis stroke="rgba(255,255,255,0.1)" axisLine={false} tickLine={false} style={{ fontSize: '0.6rem', fontWeight: 600 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid rgba(212, 175, 55, 0.1)', borderRadius: '1rem' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        formatter={(value: any) => [Number(value).toFixed(2), "Force Index"]}
                                    />
                                    <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                                        {data.magnitudeDist.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index > 4 ? 'var(--hazard-secondary)' : 'var(--hazard-accent)'} opacity={index > 4 ? 0.8 : 0.4} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Graph 3: Factor Comparison */}
                    <div className="elegant-card p-10 rounded-[3rem] bg-navy-900/40 border-white/5 lg:col-span-2">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-1.5 h-6 bg-cyan/40 rounded-full" />
                            <h3 className="text-xl text-white tracking-widest uppercase font-light">Vulnerability Matrix</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="h-[320px] relative">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={data.factorComparison}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {data.factorComparison.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'white' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[0.6rem] text-white/20 uppercase tracking-[0.4em] font-bold">Aggregate</span>
                                    <span className="text-3xl serif text-cyan glow-cyan italic">{hazard === 'seismic' ? 'Force' : hazard === 'wildfire' ? 'Brix' : 'Flow'}</span>
                                </div>
                            </div>
                            <div className="space-y-10">
                                {data.factorComparison.map((factor, idx) => (
                                    <div key={factor.name} className="group">
                                        <div className="flex justify-between items-end mb-3">
                                            <div className="space-y-1">
                                                <span className="text-[0.55rem] text-white/30 uppercase tracking-[0.3em] font-bold mb-1 block">Vector</span>
                                                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors uppercase tracking-widest">{factor.name} Analysis</span>
                                            </div>
                                            <span className="text-lg serif text-cyan glow-cyan italic">{factor.value}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${factor.value}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                style={{ backgroundColor: BRAND_COLORS[idx % BRAND_COLORS.length] }}
                                                className="h-full shadow-[0_0_10px_rgba(0,255,209,0.2)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Analysis */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="elegant-panel p-10 bg-navy-900/40 border-white/5 mb-16 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/5 blur-[100px] rounded-full -z-10 group-hover:bg-cyan/10 transition-all duration-1000" />
                    <div className="flex items-center gap-6 mb-6">
                        <Activity className="w-5 h-5 text-cyan glow-cyan" />
                        <h4 className="text-[0.6rem] text-cyan uppercase tracking-[0.5em] font-bold glow-cyan">Intelligence Stream Executive Summary</h4>
                    </div>
                    <p className="text-lg text-white/70 leading-relaxed font-light serif italic max-w-4xl">
                        {hazard === 'seismic'
                            ? "The neural extraction confirms a synergistic risk profile where geological volatility and structural vulnerability intersect. Continuous monitoring of seismic wave propagation via Aether Link is recommended."
                            : hazard === 'wildfire'
                                ? "Ember analysis indicates critical biomass fuel density with high ignition potential. Immediate defensible space enforcement and canopy moisture monitoring are advised for identified nodes."
                                : "Atmospheric telemetry reveals hydrologic saturation levels exceeding safety thresholds. Structural wind load and flood egress protocols should be prioritized for the analyzed urban grid."
                        }
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

