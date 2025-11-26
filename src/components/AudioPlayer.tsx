'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface AudioPlayerProps {
    text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [rate, setRate] = useState(1);
    const synth = useRef<SpeechSynthesis | null>(null);
    const utterance = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis;

            const loadVoices = () => {
                const availableVoices = synth.current!.getVoices();
                // Filter for English voices
                const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
                setVoices(englishVoices);
                if (englishVoices.length > 0) {
                    setSelectedVoice(englishVoices[0]);
                }
            };

            loadVoices();
            if (synth.current.onvoiceschanged !== undefined) {
                synth.current.onvoiceschanged = loadVoices;
            }
        }

        return () => {
            if (synth.current) {
                synth.current.cancel();
            }
        };
    }, []);

    const handlePlay = () => {
        if (!synth.current) return;

        if (isPaused) {
            synth.current.resume();
            setIsPlaying(true);
            setIsPaused(false);
            return;
        }

        if (isPlaying) {
            synth.current.pause();
            setIsPlaying(false);
            setIsPaused(true);
            return;
        }

        utterance.current = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.current.voice = selectedVoice;
        }
        utterance.current.rate = rate;

        utterance.current.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        synth.current.speak(utterance.current);
        setIsPlaying(true);
    };

    const handleStop = () => {
        if (!synth.current) return;
        synth.current.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const voice = voices.find(v => v.name === e.target.value);
        if (voice) {
            setSelectedVoice(voice);
            // If playing, restart with new voice
            if (isPlaying || isPaused) {
                handleStop();
                setTimeout(handlePlay, 100);
            }
        }
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRate = parseFloat(e.target.value);
        setRate(newRate);
        // Note: Changing rate dynamically usually requires restarting the utterance in Web Speech API
    };

    return (
        <div className="card p-6 mb-8 flex flex-col gap-6 backdrop-blur-xl bg-white/5 border-white/10 shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePlay}
                        className="btn btn-primary rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-105 transition-all"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <button
                        onClick={handleStop}
                        className="btn btn-secondary rounded-full w-10 h-10 p-0 flex items-center justify-center hover:bg-white/10"
                        title="Stop/Reset"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Speed</label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/70 w-8">{rate}x</span>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={rate}
                                onChange={handleRateChange}
                                className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary hover:bg-white/30 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Voice</label>
                        <div className="relative">
                            <select
                                className="text-sm py-1 pl-2 pr-8 rounded bg-white/10 border border-white/10 text-white/90 focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                                onChange={handleVoiceChange}
                                value={selectedVoice?.name || ''}
                            >
                                {voices.map(voice => (
                                    <option key={voice.name} value={voice.name} className="bg-slate-900">
                                        {voice.name.replace(/Microsoft |Google |English /g, '').substring(0, 15)}...
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs">
                                ▼
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualizer Bar (Decorative) */}
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex items-end gap-0.5 opacity-50">
                {isPlaying && Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-primary/50 animate-pulse"
                        style={{
                            height: `${Math.random() * 100}%`,
                            animationDuration: `${0.5 + Math.random()}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
