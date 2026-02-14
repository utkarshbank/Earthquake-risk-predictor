'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, getSeismicChatResponse } from '@/services/chatService';
import { ReportData } from '@/services/imageAnalysis';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, X, Send, Bot, Zap, Activity, BrainCircuit, Terminal,
    Sparkles
} from 'lucide-react';

interface SeismicChatbotProps {
    reportContext: ReportData;
    region?: string;
}

export default function SeismicChatbot({ reportContext, region }: SeismicChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: `NEURAL LINK ESTABLISHED. I have processed the seismic spectral data for the ${region || 'targeted coordinates'}. Reagent analysis and structural vulnerability matrices are ready for query.`
            }]);
        }
        scrollToBottom();
    }, [isOpen, messages, region]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await getSeismicChatResponse(userMsg, messages, reportContext, region);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error: any) {
            console.error("Chatbot UI Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ **TRANSMISSION ERROR:** ${error.message || "Neural link severed."} Please re-authenticate.`
            }]);
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
                                            Seismic <span className="text-cyan glow-cyan">Aether</span>
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan shadow-cyan animate-pulse"></div>
                                            <span className="text-[0.5rem] font-bold text-white/30 uppercase tracking-[0.3em] font-mono">Neural Link Active</span>
                                        </div>
                                    </div>
                                </div>
                                <Activity className="w-4 h-4 text-white/10" />
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
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Zap className="w-3 h-3 text-cyan shadow-cyan" />
                                        </motion.div>
                                        <span className="text-[0.6rem] text-white/30 uppercase tracking-[0.4em] font-bold">Processing Neural Matrix...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Contextual Anchors */}
                        <div className="px-6 py-4 flex flex-wrap gap-2 border-t border-white/5 bg-navy-900/20">
                            <QuickQuestion text="Explain the strain forecast" />
                            <QuickQuestion text="What is the highest risk magnitude?" />
                            <QuickQuestion text="Structural preparation scan" />
                        </div>

                        {/* Command Input */}
                        <div className="p-6 border-t border-white/5 bg-midnight/50 backdrop-blur-3xl">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan/20 to-gold/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="TRANSMIT SEISMIC QUERY..."
                                    className="relative w-full bg-navy-900/60 border border-white/10 rounded-2xl px-6 py-4 text-[0.65rem] font-mono tracking-widest text-cyan placeholder:text-white/10 focus:outline-none focus:border-cyan/50 transition-all uppercase"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan/40 hover:text-cyan transition-colors"
                                >
                                    <Send className="w-4 h-4" />
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
