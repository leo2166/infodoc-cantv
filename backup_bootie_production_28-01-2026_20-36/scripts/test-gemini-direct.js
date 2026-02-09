const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function run() {
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log("API Key loaded:", apiKey ? "Yes" : "No");

    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTry = ["gemini-pro", "gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-1.0-pro"];

    for (const modelName of modelsToTry) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hola");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}:`, response.text());
            return; // Stop on first success
        } catch (error) {
            console.error(`FAILED ${modelName}:`, error.message.split('\n')[0]);
        }
    }
}

run();
