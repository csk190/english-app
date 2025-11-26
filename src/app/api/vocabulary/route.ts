import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock DB in memory
let words: any[] = [];

export async function POST(request: Request) {
    try {
        const { term } = await request.json();

        // Check if word already exists
        const existingWord = words.find(w => w.term === term.toLowerCase());
        if (existingWord) {
            return NextResponse.json(existingWord);
        }

        const apiKey = request.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            // Fallback to mock if no key, or error? Let's error for consistency with other routes, 
            // but maybe soft fail if it's just a sidebar lookup? 
            // For now, let's require the key for the "real" experience.
            return NextResponse.json(
                { error: 'API Key is missing' },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Define the word "${term}" in the context of learning English.
        Return the response in the following JSON format:
        {
            "definition": "Simple definition",
            "partOfSpeech": "noun/verb/adj/etc",
            "example": "Example sentence using the word"
        }
        Do not include markdown formatting. Just the raw JSON object.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanText);

        const newWord = {
            id: Date.now(),
            term: term.toLowerCase(),
            definition: data.definition,
            partOfSpeech: data.partOfSpeech,
            example: data.example,
            masteryLevel: 0,
            createdAt: new Date(),
        };

        words.unshift(newWord); // Add to beginning

        return NextResponse.json(newWord);
    } catch (error) {
        console.error('Error saving word:', error);
        return NextResponse.json({ error: 'Failed to save word' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(words);
}
