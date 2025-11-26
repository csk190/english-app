'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, RotateCcw } from 'lucide-react';
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
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            const res = await fetch('/api/vocabulary');
            if (res.ok) {
                const data = await res.json();
                // Filter words that need review (masteryLevel < 3)
                const reviewWords = data.filter((w: Word) => w.masteryLevel < 3);
                setWords(reviewWords);
            }
        } catch (error) {
            console.error('Failed to load words', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            setFinished(true);
        }
    };

    const handleResult = async (success: boolean) => {
        // TODO: Update mastery level in DB
        handleNext();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <p>Loading vocabulary...</p>
            </div>
        );
    }

    if (words.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
                <h1 className="text-3xl font-bold mb-4">All Caught Up!</h1>
                <p className="text-muted-foreground mb-8">You have no words to review right now.</p>
                <Link href="/" className="btn btn-primary">
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Learning
                </Link>
            </div>
        );
    }

    if (finished) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
                <h1 className="text-3xl font-bold mb-4">Review Session Complete!</h1>
                <p className="text-muted-foreground mb-8">Great job reviewing your vocabulary.</p>
                <div className="flex gap-4">
                    <button onClick={() => {
                        setFinished(false);
                        setCurrentIndex(0);
                        setIsFlipped(false);
                    }} className="btn btn-secondary">
                        <RotateCcw className="mr-2" size={20} />
                        Review Again
                    </button>
                    <Link href="/" className="btn btn-primary">
                        <ArrowLeft className="mr-2" size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const currentWord = words[currentIndex];

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground p-8">
            <header className="mb-8">
                <Link href="/" className="btn btn-secondary inline-flex items-center">
                    <ArrowLeft className="mr-2" size={20} />
                    Back
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
                <div className="w-full flex justify-between text-sm text-muted-foreground mb-4">
                    <span>Word {currentIndex + 1} of {words.length}</span>
                    <span>Mastery: {currentWord.masteryLevel}/3</span>
                </div>

                <div
                    className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-2xl shadow-lg flex flex-col items-center justify-center p-8">
                            <h2 className="text-4xl font-bold mb-2">{currentWord.term}</h2>
                            <p className="text-muted-foreground italic">{currentWord.partOfSpeech}</p>
                            <p className="mt-8 text-sm text-muted-foreground">(Tap to flip)</p>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden bg-primary/5 border border-primary/20 rounded-2xl shadow-lg rotate-y-180 flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-xl mb-4">{currentWord.definition}</p>
                            <p className="text-muted-foreground italic">"{currentWord.example}"</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8 w-full max-w-md">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleResult(false); }}
                        className="flex-1 btn bg-red-100 text-red-700 hover:bg-red-200 py-4 flex flex-col items-center gap-1"
                    >
                        <X size={24} />
                        <span>Still Learning</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleResult(true); }}
                        className="flex-1 btn bg-green-100 text-green-700 hover:bg-green-200 py-4 flex flex-col items-center gap-1"
                    >
                        <Check size={24} />
                        <span>Got it!</span>
                    </button>
                </div>
            </main>
        </div>
    );
}
