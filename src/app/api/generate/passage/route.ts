import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { topic, difficulty, length } = await request.json();

    // TODO: Integrate real LLM here
    // Mock response for now
    const mockPassage = {
        title: `The Wonders of ${topic}`,
        content: `This is a generated passage about ${topic}. It is designed for ${difficulty} level learners and is of ${length} length.
    
    Space exploration has always fascinated humanity. From the early days of gazing at the stars to the modern era of sending rovers to Mars, our curiosity knows no bounds. The universe is vast and full of mysteries waiting to be solved.
    
    Scientists work tirelessly to understand the cosmos. They build giant telescopes and launch powerful rockets. Every discovery brings us closer to understanding our place in the universe. Who knows what we will find next? Maybe life on other planets or new sources of energy.`
    };

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json(mockPassage);
}
