'use client';

import { useCallback } from 'react';
import { UploadCloud, FileImage, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
    onImageSelected: (url: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const url = event.target?.result as string;
                onImageSelected(url);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative group">
            {/* Billion Dollar Glow on Hover */}
            <div className="absolute -inset-1.5 bg-cyan/30 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500"></div>

            <label className="relative flex flex-col items-center justify-center w-full min-h-[450px] bg-navy-900/40 backdrop-blur-2xl border-2 border-white/5 hover:border-cyan/50 rounded-[3rem] cursor-pointer transition-all duration-700 shadow-2xl">
                <div className="flex flex-col items-center justify-center pt-10 pb-12 px-16 text-center">
                    <div className="w-20 h-20 rounded-3xl border-2 border-cyan/20 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-cyan/10 group-hover:border-cyan/50 transition-all duration-700 shadow-cyan bg-midnight relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <UploadCloud className="w-8 h-8 text-cyan/60 group-hover:text-cyan transition-colors" />
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-3 h-3 text-cyan animate-pulse" />
                        <h3 className="text-3xl serif text-white tracking-[0.2em] font-light uppercase">
                            Transmit <span className="text-cyan glow-cyan italic">Data</span>
                        </h3>
                    </div>

                    <p className="text-[0.6rem] tracking-[0.5em] text-white/30 uppercase font-bold mb-12 px-8 leading-relaxed font-mono">
                        Satellite Spectral Mapping Data Acquisition (TIFF, PNG, JPG)
                    </p>

                    <div className="btn-cyan !px-10 !py-4 shadow-cyan group-hover:scale-105 transition-all">
                        <div className="flex items-center gap-4">
                            <FileImage className="w-4 h-4" />
                            <span className="text-[0.7rem] uppercase tracking-[0.3em] font-bold">Initialize Upload</span>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/5 w-full flex items-center justify-center gap-4 opacity-40">
                        <ShieldCheck className="w-4 h-4 text-cyan/60" />
                        <span className="text-[0.6rem] uppercase tracking-[0.4em] font-bold text-white/30 font-mono">Secure Intelligence Tunnel 01</span>
                    </div>
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
}
