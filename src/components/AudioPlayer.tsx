'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Loader2 } from 'lucide-react';
import { GOOGLE_TTS_VOICES, synthesizeSpeech } from '@/lib/GoogleTTS';

interface AudioPlayerProps {
    text: string;
    apiKey: string;
}

export default function AudioPlayer({ text, apiKey }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [selectedVoice, setSelectedVoice] = useState(GOOGLE_TTS_VOICES[0]);
    const [rate, setRate] = useState(1);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Reset audio when text changes
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setAudioUrl(null);
        setIsPlaying(false);
    }, [text]);

    const handlePlay = async () => {
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        if (audioUrl && audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }

        setIsLoading(true);
        try {
            const url = await synthesizeSpeech({
                text,
                languageCode: selectedVoice.languageCode,
                name: selectedVoice.name,
                ssmlGender: selectedVoice.gender as 'MALE' | 'FEMALE',
                speakingRate: rate,
            }, apiKey);

            setAudioUrl(url);
            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setIsPlaying(false);
            };

            audio.play();
            setIsPlaying(true);
        } catch (error) {
            console.error('Failed to play audio:', error);
            alert('Failed to generate audio. Please check your API key.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    };

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const voice = GOOGLE_TTS_VOICES.find(v => v.name === e.target.value);
        if (voice) {
            setSelectedVoice(voice);
            // Reset audio to force regeneration with new voice
            handleStop();
            setAudioUrl(null);
            audioRef.current = null;
        }
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRate = parseFloat(e.target.value);
        setRate(newRate);
        // Reset audio to force regeneration with new rate
        handleStop();
        setAudioUrl(null);
        audioRef.current = null;
    };

    return (
        <div className="card p-6 mb-8 flex flex-col gap-6 backdrop-blur-xl bg-white/5 border-white/10 shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePlay}
                        disabled={isLoading}
                        className="btn btn-primary rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isLoading ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={24} fill="currentColor" />
                        ) : (
                            <Play size={24} fill="currentColor" className="ml-1" />
                        )}
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
                                step="0.25"
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
                                value={selectedVoice.name}
                            >
                                {GOOGLE_TTS_VOICES.map(voice => (
                                    <option key={voice.name} value={voice.name} className="bg-slate-900">
                                        {voice.label}
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
