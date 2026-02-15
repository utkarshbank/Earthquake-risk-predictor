'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, getHazardChatResponse } from '@/services/chatService';
import { ReportData } from '@/services/imageAnalysis';
import { useHazard } from '@/context/HazardContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, X, Send, Bot, Zap, Activity, BrainCircuit, Terminal,
    Sparkles, Mic, MicOff, Volume2, VolumeX, Pause, Play, RotateCcw,
    Square
} from 'lucide-react';

interface RiskChatbotProps {
    reportContext: ReportData;
    region?: string;
}

export default function RiskChatbot({ reportContext, region }: RiskChatbotProps) {
    const { hazard, theme } = useHazard();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [lastSpokenText, setLastSpokenText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // Auto-send voice queries
                setTimeout(() => handleSend(transcript), 500);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }

        if (isOpen && messages.length === 0) {
            const personaGreeting = {
                seismic: `NEURAL LINK ESTABLISHED. I have processed the seismic spectral data for ${region || 'targeted coordinates'}. Reagent analysis and structural vulnerability matrices are ready.`,
                wildfire: `EMBER LINK ACTIVE. Biomass fuel density and ignition risk models have been computed for ${region || 'this sector'}. Thermal propagation vectors are ready for query.`,
                storm: `TORRENT STREAM SYNCED. Atmospheric load and hydrologic saturation data for ${region || 'the region'} has been extracted. Infrastructure resilience metrics are available.`
            };
            const msg = personaGreeting[hazard];
            setMessages([{ role: 'assistant', content: msg }]);
            if (!isMuted) speak(msg);
        }
        scrollToBottom();
    }, [isOpen, messages.length, region, hazard]);

    const speak = (text: string) => {
        if (isMuted || typeof window === 'undefined') return;
        window.speechSynthesis.cancel();
        setLastSpokenText(text);
        setIsPaused(false);
        const utterance = new SpeechSynthesisUtterance(text);

        // Persona tuning (subtle pitch shifts)
        if (hazard === 'seismic') { utterance.pitch = 0.8; utterance.rate = 0.9; }
        else if (hazard === 'wildfire') { utterance.pitch = 1.1; utterance.rate = 1.0; }
        else { utterance.pitch = 0.9; utterance.rate = 1.1; }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
        window.speechSynthesis.speak(utterance);
    };

    const togglePlayback = () => {
        if (typeof window === 'undefined') return;
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        } else if (isSpeaking) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const restartAudio = () => {
        if (lastSpokenText) speak(lastSpokenText);
    };

    const endAudio = () => {
        if (typeof window === 'undefined') return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const handleSend = async (overrideInput?: string) => {
        const msgToSend = overrideInput || input.trim();
        if (!msgToSend || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: msgToSend }]);
        setIsLoading(true);

        try {
            const response = await getHazardChatResponse(msgToSend, messages, reportContext, hazard, region);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            if (!isMuted) speak(response);
        } catch (error: any) {
            console.error("Chatbot UI Error:", error);
            const errMsg = `❌ **TRANSMISSION ERROR:** ${error.message || "Neural link severed."} Please re-authenticate.`;
            setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
            if (!isMuted) speak("Neural link severed.");
        } finally {
            setIsLoading(false);
        }
    };

    const QuickQuestion = ({ text }: { text: string }) => (
        <button
            onClick={() => { setInput(text); }}
            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-[0.6rem] text-white/40 uppercase tracking-widest hover:bg-cyan/5 hover:text-cyan hover:border-cyan/20 transition-all duration-300 text-left font-bold"
        >
            {text}
        </button>
    );

    return (
        <div style={{ position: 'relative', zIndex: 1000 }}>
            {/* Pulsing Target FAB */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group overflow-hidden"
                style={{
                    background: 'rgba(11, 14, 20, 0.8)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(0, 255, 209, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 255, 209, 0.2)',
                    zIndex: 1001
                }}
            >
                <div className="absolute inset-0 bg-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    {isOpen ? (
                        <X className="w-6 h-6 text-cyan glow-cyan" />
                    ) : (
                        <div className="relative">
                            <MessageSquare className="w-6 h-6 text-cyan glow-cyan" />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -inset-2 bg-cyan/20 rounded-full -z-10"
                            />
                        </div>
                    )}
                </div>
            </motion.button>

            {/* Chat Intelligence Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        className="fixed bottom-28 right-8 w-[400px] h-[600px] elegant-panel border-cyan/20 overflow-hidden flex flex-col"
                        style={{ zIndex: 1001 }}
                    >
                        {/* Neural Header */}
                        <div className="p-6 relative border-b border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 to-gold/5 opacity-50" />
                            <div className="relative flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-midnight border border-cyan/30 flex items-center justify-center shadow-cyan">
                                        <Bot className="w-5 h-5 text-cyan" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-light serif tracking-[0.2em] text-white uppercase italic">
                                            {hazard === 'seismic' ? 'Seismic' : hazard === 'wildfire' ? 'Ember' : 'Torrent'} <span className="text-cyan glow-cyan">{hazard === 'seismic' ? 'Aether' : hazard === 'wildfire' ? 'Mind' : 'Sync'}</span>
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-cyan animate-pulse"></div>
                                            <span className="text-[0.5rem] font-bold text-white/30 uppercase tracking-[0.3em] font-mono">
                                                {isSpeaking ? (isPaused ? 'VOICE PAUSED' : 'TRANSMITTING VOICE') : isListening ? 'LISTENING...' : 'NEURAL LINK ACTIVE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
                                        <button
                                            onClick={togglePlayback}
                                            disabled={!isSpeaking && !isPaused}
                                            className={`p-1.5 rounded-md transition-colors ${isPaused ? 'text-gold hover:text-gold/80' : 'text-white/40 hover:text-white/70'} disabled:opacity-20`}
                                        >
                                            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                            onClick={restartAudio}
                                            disabled={!lastSpokenText}
                                            className="p-1.5 rounded-md text-white/40 hover:text-white/70 transition-colors disabled:opacity-20"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={endAudio}
                                            disabled={!isSpeaking && !isPaused}
                                            className="p-1.5 rounded-md text-white/40 hover:text-red-500 transition-colors disabled:opacity-20"
                                        >
                                            <Square className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-cyan transition-colors"
                                    >
                                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stream Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`relative max-w-[85%] group`}>
                                        <div className={`absolute -inset-0.5 bg-gradient-to-br ${msg.role === 'user'
                                            ? 'from-cyan/20 to-transparent'
                                            : 'from-gold/20 to-transparent'
                                            } rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500`} />
                                        <div className={`relative px-5 py-4 rounded-2xl text-[0.8rem] leading-relaxed font-light ${msg.role === 'user'
                                            ? 'bg-cyan/10 border border-cyan/20 text-cyan-50'
                                            : 'bg-navy-900/40 border border-white/5 text-white/80'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-2 opacity-30">
                                                {msg.role === 'user' ? (
                                                    <>
                                                        <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em]">End-User Terminal</span>
                                                        <Terminal className="w-3 h-3" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <BrainCircuit className="w-3 h-3" />
                                                        <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em]">Aether Intelligence</span>
                                                    </>
                                                )}
                                            </div>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-navy-800/30 border border-white/5 px-5 py-4 rounded-2xl flex items-center gap-3">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <Zap className="w-3 h-3 text-cyan shadow-cyan" />
                                        </motion.div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [4, 12, 4] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                                    className="w-0.5 bg-cyan/40 rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[0.6rem] text-white/30 uppercase tracking-[0.4em] font-bold">Neural Sync...</span>
                                    </div>
                                </div>
                            )}
                            {isSpeaking && (
                                <div className="flex justify-center py-2">
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-cyan/5 border border-cyan/20">
                                        <div className="flex gap-1 h-3 items-center">
                                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [2, 10, 2] }}
                                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                                                    className="w-1 bg-cyan shadow-cyan rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[0.5rem] font-bold text-cyan uppercase tracking-widest">Voice Synthesis Active</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Contextual Anchors */}
                        <div className="px-6 py-4 flex flex-wrap gap-2 border-t border-white/5 bg-navy-900/20">
                            <QuickQuestion text={hazard === 'seismic' ? "Explain the strain forecast" : hazard === 'wildfire' ? "Fuel moisture levels?" : "Wind load capacity?"} />
                            <QuickQuestion text={hazard === 'seismic' ? "Highest risk magnitude?" : hazard === 'wildfire' ? "Ignition probability?" : "Flood egress paths?"} />
                            <QuickQuestion text="Structural vulnerability scan" />
                        </div>

                        {/* Command Input */}
                        <div className="p-6 border-t border-white/5 bg-midnight/50 backdrop-blur-3xl">
                            <div className="relative group flex gap-3">
                                <div className="relative flex-1 group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan/20 to-gold/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={isListening ? "LISTENING..." : `TRANSMIT ${hazard.toUpperCase()} QUERY...`}
                                        className="relative w-full bg-navy-900/60 border border-white/10 rounded-2xl px-6 py-4 text-[0.65rem] font-mono tracking-widest text-cyan placeholder:text-white/10 focus:outline-none focus:border-cyan/50 transition-all uppercase"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan/40 hover:text-cyan transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={toggleListening}
                                    className={`w-14 h-14 rounded-2xl border transition-all duration-300 flex items-center justify-center shrink-0 ${isListening
                                        ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse'
                                        : 'bg-white/5 border-white/10 text-white/40 hover:border-cyan/30 hover:text-cyan'
                                        }`}
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-cyan/50 animate-pulse" />
                                    <div className="w-1 h-1 rounded-full bg-cyan/30" />
                                    <div className="w-1 h-1 rounded-full bg-cyan/10" />
                                </div>
                                <span className="text-[0.4rem] text-white/10 uppercase tracking-[0.5em] font-bold">Secure Intel Tunnel 02 // V.2.5</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
