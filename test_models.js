const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    try {
        const apiKey = 'AIzaSyBC7cxyaADXq9BBO-d1jBKEdz7yNjp3A7E';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = "Hello";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(`Success with ${modelName}:`, response.text());
    } catch (error) {
        console.error(`Failed with ${modelName}:`, error.message);
    }
}

async function run() {
    // await testModel('gemini-1.5-flash');
    await testModel('gemini-pro');
}

run();
