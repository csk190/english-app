import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { topic, content } = await request.json();

    // TODO: Call LLM to analyze writing
    // Mock response
    const mockFeedback = {
        grammar: [
            "Consider using 'have been' instead of 'was' in the second sentence.",
            "Watch out for subject-verb agreement in the last paragraph."
        ],
        structure: "Your essay has a clear introduction, but the conclusion could be stronger.",
        vocabulary: [
            "Instead of 'good', try 'excellent' or 'superb'.",
            "Use 'however' to transition between contrasting ideas."
        ],
        encouragement: "Great job! You expressed your ideas clearly. Keep practicing!"
    };

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json(mockFeedback);
}
