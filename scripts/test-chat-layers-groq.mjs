import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";
import dotenv from 'dotenv';
import dns from 'node:dns';

// Load env vars
dotenv.config({ path: '.env.local' });

// Fix DNS for Venezuela/CANTV
dns.setDefaultResultOrder('ipv4first');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

console.log("🔍 Checking API Keys...");
console.log(`Groq Key:    ${GROQ_API_KEY ? "✅ Present" : "❌ Missing"}`);
console.log(`Gemini Key:  ${GOOGLE_API_KEY ? "✅ Present" : "❌ Missing"}`);

// --- Layer 1: Groq (Llama 3) ---
async function testGroq() {
    console.log("\n🔷 Testing Layer 1: Groq (Llama 3 70B)...");
    if (!GROQ_API_KEY) {
        console.log("❌ SKIPPED: No API Key");
        return;
    }

    try {
        const groq = new Groq({ apiKey: GROQ_API_KEY });

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Responde con la palabra 'FUNCIONA' en mayúsculas." }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
        });

        const content = completion.choices[0]?.message?.content;
        console.log(`✅ SUCCESS: "${content}"`);

    } catch (error) {
        console.error("❌ Exception:", error.message || error);
    }
}

// --- Layer 2: Gemini (Google AI) ---
async function testGemini() {
    console.log("\n🔶 Testing Layer 2: Gemini (Flash 2.0 Lite)...");
    if (!GOOGLE_API_KEY) {
        console.log("❌ SKIPPED: No API Key");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
        // Using 2.0-flash-lite to match production route
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

        const result = await model.generateContent("Responde con la palabra 'FUNCIONA'.");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS: "${text}"`);

    } catch (error) {
        console.error("❌ Exception:", error.message);
    }
}

async function runTests() {
    await testGroq();
    await testGemini();
}

runTests();
