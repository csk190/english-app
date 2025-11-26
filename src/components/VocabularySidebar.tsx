'use client';

import { useEffect, useState } from 'react';
import { X, Book } from 'lucide-react';

interface Word {
    id: number;
    term: string;
    definition: string;
    partOfSpeech: string;
    example: string;
}

interface VocabularySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    refreshTrigger: number; // Increment to reload words
}

export default function VocabularySidebar({ isOpen, onClose, refreshTrigger }: VocabularySidebarProps) {
    const [words, setWords] = useState<Word[]>([]);

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const res = await fetch('/api/vocabulary');
                if (res.ok) {
                    const data = await res.json();
                    setWords(data);
                }
            } catch (error) {
                console.error('Failed to load vocabulary', error);
            }
        };

        if (isOpen) {
            fetchWords();
        }
    }, [isOpen, refreshTrigger]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-96 bg-slate-900/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <Book size={24} />
                            </div>
                            Vocabulary
                        </h2>
                        <button
                            onClick={onClose}
                            className="btn btn-secondary p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {words.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20">
                                    <Book size={32} />
                                </div>
                                <p className="text-white/50 text-lg">
                                    Click on words in the text to add them here!
                                </p>
                            </div>
                        ) : (
                            words.map((word) => (
                                <div key={word.id} className="group p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-200">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="font-bold text-xl capitalize text-primary group-hover:text-primary-foreground transition-colors">{word.term}</h3>
                                        <span className="text-xs text-white/40 italic px-2 py-1 bg-black/20 rounded-full">{word.partOfSpeech}</span>
                                    </div>
                                    <p className="text-sm mb-3 text-white/80 leading-relaxed">{word.definition}</p>
                                    <p className="text-xs text-white/50 bg-black/20 p-3 rounded-lg border border-white/5 italic">
                                        "{word.example}"
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
