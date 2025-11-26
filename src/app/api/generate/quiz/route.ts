import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { topic, content } = await request.json();

    // TODO: Call LLM to generate questions based on content
    // Mock response
    const mockQuiz = [
        {
            id: 1,
            question: `What is the main topic of the passage?`,
            options: [`The history of ${topic}`, `How to cook ${topic}`, `The future of ${topic}`, `Why ${topic} is bad`],
            correctAnswer: 0
        },
        {
            id: 2,
            question: "What did the author mention as a key benefit?",
            options: ["Saving money", "Improving health", "Understanding the universe", "Making friends"],
            correctAnswer: 2
        },
        {
            id: 3,
            question: "Which word best describes the tone of the passage?",
            options: ["Angry", "Informative", "Sad", "Funny"],
            correctAnswer: 1
        }
    ];

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(mockQuiz);
}
