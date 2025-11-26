'use client';

import { useState } from 'react';

interface TopicInputProps {
  onGenerate: (topic: string, difficulty: string, length: string) => void;
  isLoading: boolean;
}

export default function TopicInput({ onGenerate, isLoading }: TopicInputProps) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [length, setLength] = useState('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, difficulty, length);
    }
  };

  const handleRandomTopic = () => {
    const topics = ['Space Exploration', 'Ancient History', 'Artificial Intelligence', 'Global Warming', 'Modern Art', 'Healthy Eating'];
    const random = topics[Math.floor(Math.random() * topics.length)];
    setTopic(random);
  };

  return (
    <div className="card w-full max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-xl bg-white/5 border-white/10">
      <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
        What do you want to read about?
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Space travel, Korean History, Coffee..."
            className="input flex-1 text-lg placeholder:text-white/30"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleRandomTopic}
            className="btn btn-secondary whitespace-nowrap px-6"
            disabled={isLoading}
          >
            Random
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Difficulty</label>
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="Beginner" className="bg-slate-900">Beginner</option>
                <option value="Intermediate" className="bg-slate-900">Intermediate</option>
                <option value="Advanced" className="bg-slate-900">Advanced</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                ▼
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Length</label>
            <div className="relative">
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="input appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="Short" className="bg-slate-900">Short (~100 words)</option>
                <option value="Medium" className="bg-slate-900">Medium (~250 words)</option>
                <option value="Long" className="bg-slate-900">Long (~500 words)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                ▼
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Generating...
            </span>
          ) : 'Generate Passage'}
        </button>
      </form>
    </div>
  );
}
