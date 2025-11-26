'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface WritingViewProps {
    topic: string;
    onComplete: () => void;
}

interface Feedback {
    grammar: string[];
    structure: string;
    vocabulary: string[];
    encouragement: string;
}

export default function WritingView({ topic, onComplete }: WritingViewProps) {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/generate/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, content: text }),
            });
            const data = await response.json();
            setFeedback(data);
        } catch (error) {
            console.error('Failed to get feedback:', error);
            alert('Failed to get feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-xl bg-white/5 border-white/10">
            <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Writing Practice</h2>
            <p className="text-white/60 text-center mb-8 text-lg">
                Write a short reflection on: <span className="font-semibold text-white">{topic}</span>
            </p>

            {!feedback ? (
                <div className="space-y-6">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your thoughts here..."
                        className="input min-h-[250px] resize-y text-lg leading-relaxed p-6 bg-black/20 focus:bg-black/30 border-white/10 focus:border-primary/50"
                        disabled={isSubmitting}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !text.trim()}
                        className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin">⏳</span> Analyzing...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                Submit for Feedback
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur-md">
                        <h3 className="font-bold text-green-400 flex items-center gap-3 mb-4 text-xl">
                            <CheckCircle size={24} />
                            Feedback
                        </h3>
                        <p className="text-green-100 font-medium mb-8 text-lg leading-relaxed">{feedback.encouragement}</p>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                                <h4 className="font-semibold text-xs text-green-400 uppercase tracking-wider mb-3">Grammar</h4>
                                <ul className="space-y-2">
                                    {feedback.grammar.map((item, i) => (
                                        <li key={i} className="text-sm text-green-100/80 flex items-start gap-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500/50 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-black/20 rounded-xl p-5 border border-white/5">
                                <h4 className="font-semibold text-xs text-green-400 uppercase tracking-wider mb-3">Vocabulary Suggestions</h4>
                                <ul className="space-y-2">
                                    {feedback.vocabulary.map((item, i) => (
                                        <li key={i} className="text-sm text-green-100/80 flex items-start gap-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500/50 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-black/20 rounded-xl p-5 border border-white/5 md:col-span-2">
                                <h4 className="font-semibold text-xs text-green-400 uppercase tracking-wider mb-3">Structure</h4>
                                <p className="text-sm text-green-100/80 leading-relaxed">{feedback.structure}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onComplete}
                        className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40"
                    >
                        Finish Session
                    </button>
                </div>
            )}
        </div>
    );
}
