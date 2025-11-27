'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface FastReadingViewProps {
    content: string;
    onComplete: () => void;
}

export default function FastReadingView({ content, onComplete }: FastReadingViewProps) {
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute default
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleStart = () => {
        setIsActive(true);
    };

    return (
        <div className="card max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Fast Reading</h2>
                <div className="flex items-center gap-2 text-xl font-mono text-primary">
                    <Timer />
                    <span>{timeLeft}s</span>
                </div>
            </div>

            <div className={`prose prose-invert max-w-none text-lg leading-relaxed mb-8 transition-all duration-300 ${isActive ? 'blur-0' : 'blur-sm select-none'}`}>
                {content}
            </div>

            {!isActive && timeLeft > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-3xl z-10">
                    <button
                        onClick={handleStart}
                        className="btn btn-primary px-8 py-4 text-xl shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-all"
                    >
                        Start Fast Read
                    </button>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={onComplete}
                    className="btn btn-secondary"
                >
                    Next: Chat &rarr;
                </button>
            </div>
        </div>
    );
}
