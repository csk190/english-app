const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    try {
        const apiKey = 'AIzaSyBC7cxyaADXq9BBO-d1jBKEdz7yNjp3A7E';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = "Hello, world!";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
