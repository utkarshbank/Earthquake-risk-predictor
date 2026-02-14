'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, getSeismicChatResponse } from '@/services/chatService';
import { ReportData } from '@/services/imageAnalysis';

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
                content: `Hello! I am your Seismic Companion. I've analyzed the report for ${region || 'this area'}. Ask me anything about the strain trends, magnitude risks, or structural vulnerabilities!`
            }]);
        }
        scrollToBottom();
    }, [isOpen, messages]);

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
                content: `⚠️ **Connection Error:** ${error.message || "I lost my connection to the seismic sensors."} Please verify your configuration.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const QuickQuestion = ({ text }: { text: string }) => (
        <button
            onClick={() => { setInput(text); }}
            style={{
                backgroundColor: 'rgba(129, 140, 248, 0.1)',
                border: '1px solid rgba(129, 140, 248, 0.2)',
                color: '#818cf8',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(129, 140, 248, 0.2)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(129, 140, 248, 0.1)'}
        >
            {text}
        </button>
    );

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '50%',
                        backgroundColor: '#818cf8',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(129, 140, 248, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    🤖
                </button>
            )}

            {/* Chat Container */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '380px',
                    height: '600px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
                    zIndex: 1001,
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.25rem',
                        background: 'linear-gradient(to right, #818cf8, #c084fc)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>🤖</span>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>Seismic Companion</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Live Expert Analysis</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '1.25rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    backgroundColor: msg.role === 'user' ? '#1e293b' : 'rgba(129, 140, 248, 0.1)',
                                    color: '#e2e8f0',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    borderBottomRightRadius: msg.role === 'user' ? '0.2rem' : '1rem',
                                    borderBottomLeftRadius: msg.role === 'assistant' ? '0.2rem' : '1rem',
                                    maxWidth: '85%',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    border: msg.role === 'assistant' ? '1px solid rgba(129, 140, 248, 0.2)' : '1px solid #334155'
                                }}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', padding: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                                <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#818cf8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out' }}></div>
                                <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#818cf8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></div>
                                <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#818cf8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    <div style={{ padding: '0 1.25rem 0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <QuickQuestion text="Explain the strain forecast" />
                        <QuickQuestion text="What is the highest risk magnitude?" />
                        <QuickQuestion text="How can I prepare?" />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.25rem', borderTop: '1px solid #1e293b' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about the report..."
                                style={{
                                    flex: 1,
                                    backgroundColor: '#020617',
                                    border: '1px solid #334155',
                                    color: 'white',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                style={{
                                    backgroundColor: '#818cf8',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0 1rem',
                                    borderRadius: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: '700'
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
            `}</style>
        </>
    );
}
