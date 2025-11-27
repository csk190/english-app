const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found in .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // There isn't a direct listModels method on the SDK instance easily accessible in this version 
        // without looking at docs, but we can try to use the REST API directly if SDK fails,
        // or just try a known working model like 'gemini-1.0-pro' if 'gemini-pro' fails.
        // However, let's try to use the REST API to list models as the error suggested.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log('Failed to list models:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
