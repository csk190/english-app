import { NextResponse } from 'next/server';

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

        // Mock data
        const mockData = {
            id: Date.now(),
            term: term.toLowerCase(),
            definition: `A generated definition for ${term}.`,
            partOfSpeech: 'noun',
            example: `This is an example sentence using the word ${term}.`,
            masteryLevel: 0,
            createdAt: new Date(),
        };

        words.unshift(mockData); // Add to beginning

        return NextResponse.json(mockData);
    } catch (error) {
        console.error('Error saving word:', error);
        return NextResponse.json({ error: 'Failed to save word' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(words);
}
