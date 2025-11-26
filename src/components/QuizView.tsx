'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuizViewProps {
    questions: Question[];
    onComplete: (score: number) => void;
}

export default function QuizView({ questions, onComplete }: QuizViewProps) {
    const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
    const [showResults, setShowResults] = useState(false);

    const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
        if (showResults) return;
        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        setShowResults(true);
        const score = answers.reduce((acc, answer, index) => {
            return acc + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
        // Optional: Call onComplete with score if needed for parent state
    };

    const allAnswered = answers.every(a => a !== -1);

    return (
        <div className="card max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-xl bg-white/5 border-white/10">
            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Comprehension Check
            </h2>

            <div className="space-y-8">
                {questions.map((q, qIndex) => (
                    <div key={q.id} className="space-y-4">
                        <h3 className="font-medium text-xl text-white/90">{qIndex + 1}. {q.question}</h3>
                        <div className="space-y-3">
                            {q.options.map((option, oIndex) => {
                                const isSelected = answers[qIndex] === oIndex;
                                const isCorrect = q.correctAnswer === oIndex;
                                let className = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ";

                                if (showResults) {
                                    if (isCorrect) className += "bg-green-500/20 border-green-500/50 text-green-200";
                                    else if (isSelected && !isCorrect) className += "bg-red-500/20 border-red-500/50 text-red-200";
                                    else className += "border-white/5 opacity-50";
                                } else {
                                    if (isSelected) className += "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]";
                                    else className += "border-white/10 hover:bg-white/5 hover:border-white/20 text-white/80";
                                }

                                return (
                                    <button
                                        key={oIndex}
                                        onClick={() => handleOptionSelect(qIndex, oIndex)}
                                        className={className}
                                        disabled={showResults}
                                    >
                                        <span className="text-lg">{option}</span>
                                        {showResults && isCorrect && <CheckCircle size={20} className="text-green-400" />}
                                        {showResults && isSelected && !isCorrect && <XCircle size={20} className="text-red-400" />}
                                        {!showResults && <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-white/20 group-hover:border-white/40'}`} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {!showResults ? (
                <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className="btn btn-primary w-full mt-10 py-4 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Answers
                </button>
            ) : (
                <div className="mt-10 text-center animate-in zoom-in duration-500">
                    <div className="inline-block p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                        <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Your Score</p>
                        <p className="text-4xl font-bold text-white">
                            {answers.filter((a, i) => a === questions[i].correctAnswer).length} <span className="text-2xl text-white/40">/ {questions.length}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => onComplete(answers.filter((a, i) => a === questions[i].correctAnswer).length)}
                        className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40"
                    >
                        Continue to Writing
                    </button>
                </div>
            )}
        </div>
    );
}
