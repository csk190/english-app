'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Check, X, Trophy, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';

interface Word {
    id: number;
    term: string;
    definition: string;
    partOfSpeech: string;
    example: string;
    masteryLevel: number;
}

export default function ReviewPage() {
    const [words, setWords] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            const res = await fetch('/api/vocabulary');
            const data = await res.json();
            // Filter out words that are already mastered (though API shouldn't return them if deleted)
            // and maybe shuffle?
            const shuffled = data.sort(() => Math.random() - 0.5);
            setWords(shuffled);
        } catch (error) {
            console.error('Failed to fetch words:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResult = async (correct: boolean) => {
        const currentWord = words[currentIndex];

        try {
            await fetch('/api/vocabulary/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentWord.id, correct }),
            });

            // Move to next card
            if (currentIndex < words.length - 1) {
                setIsFlipped(false);
                setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
            } else {
                setIsComplete(true);
            }
        } catch (error) {
            console.error('Failed to update word:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="animate-spin text-4xl">⏳</div>
            </div>
        );
    }

    if (words.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8 text-center">
                <Trophy size={64} className="text-yellow-500 mb-6" />
                <h1 className="text-3xl font-bold mb-4">All Caught Up!</h1>
                <p className="text-muted-foreground mb-8">You have no words to review right now. Great job!</p>
                <Link href="/" className="btn btn-primary">
                    <HomeIcon className="mr-2" size={20} />
                    Back to Learning
                </Link>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8 text-center animate-in zoom-in duration-500">
                <Trophy size={64} className="text-yellow-500 mb-6 animate-bounce" />
                <h1 className="text-3xl font-bold mb-4">Session Complete!</h1>
                <p className="text-muted-foreground mb-8">You've reviewed all your cards for this session.</p>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="btn btn-secondary">
                        Review Again
                    </button>
                    <Link href="/" className="btn btn-primary">
                        <HomeIcon className="mr-2" size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const currentWord = words[currentIndex];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md mb-8 flex justify-between items-center">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    <HomeIcon size={24} />
                </Link>
                <div className="text-sm font-medium text-muted-foreground">
                    {currentIndex + 1} / {words.length}
                </div>
            </div>

            <div className="relative w-full max-w-md aspect-[3/4] perspective-1000">
                <div
                    className={`w-full h-full relative transition-all duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden card flex flex-col items-center justify-center p-8 text-center border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:shadow-primary/20 transition-shadow">
                        <span className="text-sm uppercase tracking-widest text-primary mb-4">Word</span>
                        <h2 className="text-4xl font-bold mb-2">{currentWord.term}</h2>
                        <div className="mt-8 text-xs text-muted-foreground">Tap to flip</div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 card flex flex-col items-center justify-center p-8 text-center border-white/10 bg-black/40 backdrop-blur-xl">
                        <span className="text-xs uppercase tracking-widest text-secondary mb-2">{currentWord.partOfSpeech}</span>
                        <p className="text-xl mb-6 font-medium">{currentWord.definition}</p>
                        <div className="bg-white/5 p-4 rounded-xl w-full">
                            <p className="text-sm italic text-muted-foreground">&quot;{currentWord.example}&quot;</p>
                        </div>
                        <div className="mt-auto pt-8 w-full flex gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleResult(false); }}
                                className="flex-1 btn bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/50"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleResult(true); }}
                                className="flex-1 btn bg-green-500/20 hover:bg-green-500/30 text-green-200 border-green-500/50"
                            >
                                <Check size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
