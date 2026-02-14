'use client';

import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell,
    PieChart, Pie, Legend
} from 'recharts';
import { ReportData } from '@/services/imageAnalysis';
import SeismicChatbot from './SeismicChatbot';

interface ReportOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    data: ReportData;
    isAiVerified?: boolean;
    region?: string;
}

const COLORS = ['#818cf8', '#c084fc', '#fb7185', '#34d399', '#fbbf24'];

export default function ReportOverlay({ isOpen, onClose, data, isAiVerified, region }: ReportOverlayProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.95)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            overflowY: 'auto',
            backdropFilter: 'blur(12px)'
        }}>
            <div style={{
                maxWidth: '1100px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                                Advanced Seismic Intelligence Report
                            </h2>
                            {isAiVerified && (
                                <span style={{
                                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                                    color: '#34d399',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    border: '1px solid rgba(52, 211, 153, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}>
                                    <span>✨</span> AI VERIFIED
                                </span>
                            )}
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            {region ? `Regional Analysis: ${region}` : 'Comprehensive analysis of regional tectonic strain and structural vulnerability.'}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                            Accuracy Baseline
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: '700' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399', boxShadow: '0 0 8px #34d399' }}></div>
                            {isAiVerified ? 'GEMINI CALIBRATED' : 'LOCAL VISION'}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.75rem',
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                    >
                        Close Report
                    </button>
                </div>

                {/* AI Justification Section */}
                {data.justification && (
                    <div style={{
                        backgroundColor: 'rgba(129, 140, 248, 0.05)',
                        border: '1px solid rgba(129, 140, 248, 0.2)',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        marginTop: '-1rem'
                    }}>
                        <div style={{ color: '#818cf8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                            Scientific Basis (AI Assessment)
                        </div>
                        <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                            "{data.justification}"
                        </p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Graph 1: Temporal Trend */}
                    <div style={{ backgroundColor: '#0f172a', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#e2e8f0' }}>Vision-Adaptive Strain Forecast</h3>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Derived from Pixel Density & Topography</p>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <AreaChart data={data.temporalTrend}>
                                    <defs>
                                        <linearGradient id="colorStrain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="time" stroke="#64748b" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Area type="monotone" dataKey="strain" stroke="#818cf8" fillOpacity={1} fill="url(#colorStrain)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '1rem', lineHeight: '1.5' }}>
                            Forecasted strain accumulation relative to identified visual hotspots on the map. High-contrast areas correlate with increased tectonic flux indicators.
                        </p>
                    </div>

                    {/* Graph 2: Magnitude Distribution */}
                    <div style={{ backgroundColor: '#0f172a', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #1e293b' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#e2e8f0' }}>Chromatographic Risk Frequency</h3>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Adaptive Gutenberg-Richter Distribution</p>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={data.magnitudeDist}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="magnitude" stroke="#64748b" label={{ value: 'Magnitude', position: 'insideBottom', offset: -5, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" label={{ value: 'Incident Index', angle: -90, position: 'insideLeft', fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        formatter={(value: any) => [value !== undefined ? Number(value).toFixed(2) : "0.00", "Incident Index"]}
                                    />
                                    <Bar dataKey="probability" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: '#64748b', fontSize: 10, formatter: (val: any) => val !== undefined ? Number(val).toFixed(2) : "0.00" }}>
                                        {data.magnitudeDist.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.magnitude > 6 ? '#fb7185' : '#818cf8'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '1rem', lineHeight: '1.5' }}>
                            Magnitude probability curve dynamically weighted by primary hazard colors (Red/Orange) detected in the map vision analysis.
                        </p>
                    </div>

                    {/* Graph 3: Factor Comparison */}
                    <div style={{ backgroundColor: '#0f172a', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #1e293b', gridColumn: 'span 2' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#e2e8f0' }}>Multi-Factor Vulnerability Index</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                            <div style={{ height: '300px', width: '400px' }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={data.factorComparison}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.factorComparison.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                                        />
                                        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {data.factorComparison.map((factor, idx) => (
                                        <div key={factor.name}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: '500', color: '#cbd5e1' }}>{factor.name} Factors</span>
                                                <span style={{ color: COLORS[idx % COLORS.length], fontWeight: '700' }}>{factor.value}% Intensity</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${factor.value}%`, height: '100%', backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Analysis */}
                <div style={{
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.1), rgba(192, 132, 252, 0.1))',
                    border: '1px solid rgba(129, 140, 248, 0.2)',
                    marginBottom: '4rem'
                }}>
                    <h4 style={{ color: '#818cf8', fontSize: '1.1rem', marginBottom: '1rem' }}>Executive Summary</h4>
                    <p style={{ color: '#e2e8f0', lineHeight: '1.8', fontSize: '1.05rem' }}>
                        The model indicates a synergistic risk profile where geological volatility and structural vulnerability intersect. Continuous monitoring of seismic wave propagation is recommended.
                    </p>
                </div>
            </div>
        </div>
    );
}
