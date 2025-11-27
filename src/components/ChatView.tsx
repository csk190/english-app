'use client';

import { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';

interface ChatViewProps {
    topic: string;
    apiKey: string;
    onComplete: () => void;
}

interface Message {
    role: 'user' | 'model';
    content: string;
}

export default function ChatView({ topic, apiKey, onComplete }: ChatViewProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: `Let's talk about "${topic}". What did you find most interesting about the passage?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-gemini-api-key': apiKey
                },
                body: JSON.stringify({
                    history: [...messages, userMsg],
                    topic
                }),
            });

            const data = await response.json();
            if (data.reply) {
                setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card max-w-3xl mx-auto h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-xl bg-white/5 border-white/10">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">Chat about {topic}</h2>
                <button onClick={onComplete} className="btn btn-sm btn-secondary">Next: Writing &rarr;</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white/10 text-white/70'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-primary/20 text-white rounded-tr-none'
                                : 'bg-white/5 text-white/80 rounded-tl-none'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="input flex-1 bg-black/20 border-white/10"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="btn btn-primary w-12 h-12 p-0 flex items-center justify-center rounded-xl"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
