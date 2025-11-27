import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { history, topic } = await request.json();

        const apiKey = request.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key is missing.' },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const chat = model.startChat({
            history: history.slice(0, -1).map((msg: any) => ({
                role: msg.role,
                parts: [{ text: msg.content }],
            })),
            generationConfig: {
                maxOutputTokens: 150, // Keep responses concise
            },
        });

        const lastMessage = history[history.length - 1].content;
        const prompt = `Topic: ${topic}. Context: You are a helpful English tutor discussing this topic with a student. Keep your responses encouraging, correct their English if there are major mistakes, but mostly focus on the conversation. 
        User says: ${lastMessage}`;

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error('Error in chat:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to generate chat response' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
