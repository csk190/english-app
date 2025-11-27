import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { term } = await request.json();

        // Check if word already exists
        const existingWord = await prisma.word.findUnique({
            where: { term: term.toLowerCase() },
        });

        if (existingWord) {
            return NextResponse.json(existingWord);
        }

        const apiKey = request.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key is missing' },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

        let data;
        try {
            data = JSON.parse(cleanText);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            return NextResponse.json({ error: 'Failed to parse definition' }, { status: 500 });
        }

        const newWord = await prisma.word.create({
            data: {
                term: term.toLowerCase(),
                definition: data.definition,
                partOfSpeech: data.partOfSpeech,
                example: data.example,
                masteryLevel: 0,
            },
        });

        return NextResponse.json(newWord);
    } catch (error) {
        console.error('Error saving word:', error);
        return NextResponse.json({ error: 'Failed to save word' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const words = await prisma.word.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(words);
    } catch (error) {
        console.error('Error fetching words:', error);
        return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 });
    }
}
