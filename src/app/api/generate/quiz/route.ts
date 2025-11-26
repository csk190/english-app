import { NextResponse } from 'next/server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { topic, content } = await request.json();

        const apiKey = request.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key is missing' },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Generate 3 multiple-choice reading comprehension questions based on the following passage about "${topic}".
        
        Passage:
        ${content}

        Return the response in the following JSON format:
        [
            {
                "id": 1,
                "question": "Question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 0 // Index of the correct option (0-3)
            }
        ]
        Do not include markdown formatting. Just the raw JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const quiz = JSON.parse(cleanText);
        return NextResponse.json(quiz);

    } catch (error) {
        console.error('Error generating quiz:', error);
        return NextResponse.json(
            { error: 'Failed to generate quiz', details: String(error) },
            { status: 500 }
        );
    }
}
