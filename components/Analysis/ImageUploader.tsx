'use client';

import { useState, ChangeEvent } from 'react';

interface ImageUploaderProps {
    onImageSelected: (imageDataUrl: string) => void;
}

export default function ImageUploader({ onImageSelected }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            onImageSelected(result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    return (
        <div
            className="upload-zone"
            style={{
                borderColor: isDragging ? 'var(--primary)' : undefined,
                backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : undefined,
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="file-upload"
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <svg style={{ width: '3rem', height: '3rem', color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#e2e8f0' }}>
                        Upload Map Image
                    </div>
                    <p style={{ color: '#94a3b8' }}>
                        Click or drag & drop a satellite map
                    </p>
                </div>
            </label>
        </div>
    );
}
