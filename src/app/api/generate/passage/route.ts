import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { topic, difficulty, length } = await request.json();

        const apiKey = request.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY;
        console.log('API Key configured:', !!apiKey);
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key is missing. Please provide it in the input field.' },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Generate a reading passage about "${topic}". 
        Difficulty level: ${difficulty}. 
        Length: ${length}.
        
        Return the response in the following JSON format:
        {
            "title": "A suitable title for the passage",
            "content": "The content of the passage"
        }
        Do not include markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON object.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the text if it contains markdown code blocks
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanText);
        } catch (e) {
            console.error('Failed to parse JSON:', text);
            // Fallback if JSON parsing fails, though we asked for JSON
            parsedResponse = {
                title: `Passage about ${topic}`,
                content: text
            };
        }

        return NextResponse.json(parsedResponse);
    } catch (error) {
        console.error('Error generating passage:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to generate passage', details: String(error) }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
