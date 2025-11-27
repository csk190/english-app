'use client';

import { useState } from 'react';
import { Book } from 'lucide-react';
import TopicInput from '@/components/TopicInput';
import ReadingView from '@/components/ReadingView';
import AudioPlayer from '@/components/AudioPlayer';
import VocabularySidebar from '@/components/VocabularySidebar';
import QuizView from '@/components/QuizView';
import WritingView from '@/components/WritingView';
import FastReadingView from '@/components/FastReadingView';
import ChatView from '@/components/ChatView';

interface PassageData {
  title: string;
  content: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Home() {
  const [step, setStep] = useState<'input' | 'reading' | 'quiz' | 'fast-reading' | 'chat' | 'writing'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [passage, setPassage] = useState<PassageData | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vocabRefreshTrigger, setVocabRefreshTrigger] = useState(0);
  const [apiKey, setApiKey] = useState('');

  const handleGenerate = async (topic: string, difficulty: string, length: string, key: string) => {
    setIsLoading(true);
    setApiKey(key);
    try {
      const response = await fetch('/api/generate/passage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': key
        },
        body: JSON.stringify({ topic, difficulty, length }),
      });
      const data = await response.json();
      if (data && data.content) {
        setPassage(data);
        setStep('reading');
      } else {
        throw new Error('Invalid passage data received');
      }
    } catch (error) {
      console.error('Failed to generate passage:', error);
      alert('Failed to generate passage. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!passage) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey
        },
        body: JSON.stringify({ topic: passage.title, content: passage.content }),
      });
      const data = await response.json();
      setQuizQuestions(data);
      setStep('quiz');
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    setStep('fast-reading');
  };

  const handleFastReadingComplete = () => {
    setStep('chat');
  };

  const handleChatComplete = () => {
    setStep('writing');
  };

  const handleWordClick = async (word: string) => {
    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey
        },
        body: JSON.stringify({ term: word }),
      });

      if (res.ok) {
        setVocabRefreshTrigger(prev => prev + 1);
        setIsSidebarOpen(true);
      }
    } catch (error) {
      console.error('Failed to save word:', error);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-background text-foreground relative">
      <div className="container mx-auto">
        <header className="mb-12 text-center relative">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-primary">
            English Reading Practice
          </h1>
          <p className="text-muted-foreground">
            Generate custom reading materials with AI
          </p>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute right-0 top-0 btn btn-secondary p-2 rounded-full md:flex items-center gap-2 hidden"
          >
            <Book size={20} />
            <span>Vocabulary</span>
          </button>
        </header>

        {step === 'input' && (
          <TopicInput onGenerate={handleGenerate} isLoading={isLoading} />
        )}

        {step === 'reading' && passage && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setStep('input')}
                className="btn btn-secondary"
              >
                ← Back to Topics
              </button>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="btn btn-secondary md:hidden"
              >
                <Book size={20} />
              </button>
            </div>

            <AudioPlayer text={passage.content} apiKey={apiKey} />

            <ReadingView
              title={passage.title}
              content={passage.content}
              onWordClick={handleWordClick}
            />

            <div className="flex justify-center mt-8">
              <button
                onClick={handleStartQuiz}
                className="btn btn-primary px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Generating Quiz...' : 'Take Quiz'}
              </button>
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <QuizView questions={quizQuestions} onComplete={handleQuizComplete} />
        )}

        {step === 'fast-reading' && passage && (
          <FastReadingView content={passage.content} onComplete={handleFastReadingComplete} />
        )}

        {step === 'chat' && passage && (
          <ChatView topic={passage.title} apiKey={apiKey} onComplete={handleChatComplete} />
        )}

        {step === 'writing' && (
          <WritingView topic={passage?.title || 'Topic'} onComplete={() => setStep('input')} />
        )}
      </div>

      <VocabularySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        refreshTrigger={vocabRefreshTrigger}
      />
    </main>
  );
}
