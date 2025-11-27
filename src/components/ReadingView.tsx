'use client';

import { useState } from 'react';

interface ReadingViewProps {
    title: string;
    content: string;
    onWordClick: (word: string) => void;
}

export default function ReadingView({ title, content, onWordClick }: ReadingViewProps) {
    // Split content into paragraphs, then words
    const paragraphs = (content || '').split('\n\n');

    if (!content) {
        return (
            <div className="card max-w-3xl mx-auto p-8 text-center backdrop-blur-xl bg-white/5 border-white/10">
                <p className="text-white/60">No content available to display.</p>
            </div>
        );
    }

    return (
        <div className="card max-w-3xl mx-auto animate-in fade-in zoom-in duration-500 backdrop-blur-xl bg-white/5 border-white/10">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 leading-tight">
                {title}
            </h1>
            <div className="prose prose-lg prose-invert max-w-none">
                {paragraphs.map((para, pIndex) => (
                    <p key={pIndex} className="mb-6 leading-loose text-lg text-white/90 font-light tracking-wide">
                        {para.split(' ').map((word, wIndex) => {
                            // Clean word for display and click handler
                            const cleanWord = word.replace(/[^a-zA-Z0-9']/g, '');

                            return (
                                <span key={`${pIndex}-${wIndex}`}>
                                    <span
                                        className="cursor-pointer hover:bg-primary/20 hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] rounded px-1 -mx-1 transition-all duration-200 border-b border-transparent hover:border-primary/50"
                                        onClick={() => onWordClick(cleanWord)}
                                    >
                                        {word}
                                    </span>{' '}
                                </span>
                            );
                        })}
                    </p>
                ))}
            </div>
        </div>
    );
}
