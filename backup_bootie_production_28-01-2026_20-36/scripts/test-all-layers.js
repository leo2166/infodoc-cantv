import dotenv from 'dotenv';
import dns from 'node:dns';
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// Fix DNS for Venezuela/CANTV
dns.setDefaultResultOrder('ipv4first');
dotenv.config({ path: '.env.local' });

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

// Colors for console
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m"
};

console.log(`${colors.cyan}==========================================${colors.reset}`);
console.log(`${colors.cyan}   DIAGNOSTICO DE CAPAS DE IA (V2)        ${colors.reset}`);
console.log(`${colors.cyan}==========================================${colors.reset}\n`);

async function testDeepSeek() {
    console.log(`${colors.blue}🔷 Probando CAPA 1: DeepSeek (Directo)...${colors.reset}`);
    if (!DEEPSEEK_KEY) { console.log(`${colors.yellow}⚠️ SALTADO: No Key${colors.reset}`); return; }

    try {
        const start = Date.now();
        // Try direct first as per previous findings
        const res = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${DEEPSEEK_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: "PING" }]
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errText}`);
        }
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "EMPTY";
        console.log(`${colors.green}✅ OKEY (${Date.now() - start}ms): ${content}${colors.reset}`);
    } catch (e) {
        console.error(`${colors.red}❌ FALLO: ${e.message}${colors.reset}`);
    }
}

async function testGemini() {
    console.log(`\n${colors.blue}🔶 Probando CAPA 2: Gemini Flash Lite...${colors.reset}`);
    if (!GOOGLE_KEY) { console.log(`${colors.yellow}⚠️ SALTADO: No Key${colors.reset}`); return; }

    try {
        const start = Date.now();
        const genAI = new GoogleGenAI({ apiKey: GOOGLE_KEY });
        const result = await genAI.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: { role: "user", parts: [{ text: "PING" }] }
        });
        console.log(`${colors.green}✅ OKEY (${Date.now() - start}ms): ${result.text}${colors.reset}`);
    } catch (e) {
        console.error(`${colors.red}❌ FALLO: ${e.message || e}${colors.reset}`);
    }
}

async function testGroq() {
    console.log(`\n${colors.magenta}🚀 Probando CAPA GROQ (Nuevo)...${colors.reset}`);
    if (!GROQ_KEY) { console.log(`${colors.yellow}⚠️ SALTADO: No Key${colors.reset}`); return; }

    try {
        const start = Date.now();
        const groq = new Groq({ apiKey: GROQ_KEY });
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "PING" }],
            model: "llama-3.3-70b-versatile",
        });
        console.log(`${colors.green}✅ OKEY (${Date.now() - start}ms): ${chatCompletion.choices[0]?.message?.content || ""}${colors.reset}`);
    } catch (e) {
        console.error(`${colors.red}❌ FALLO: ${e.message}${colors.reset}`);
    }
}

async function testOpenRouter() {
    console.log(`\n${colors.blue}🟣 Probando CAPA 3: OpenRouter...${colors.reset}`);
    if (!OPENROUTER_KEY) { console.log(`${colors.yellow}⚠️ SALTADO: No Key${colors.reset}`); return; }

    try {
        const start = Date.now();
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "google/gemma-3-27b-it:free",
                messages: [{ role: "user", content: "PING" }]
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errText}`);
        }
        const data = await res.json();
        console.log(`${colors.green}✅ OKEY (${Date.now() - start}ms): ${data.choices[0]?.message?.content}${colors.reset}`);
    } catch (e) {
        console.error(`${colors.red}❌ FALLO: ${e.message}${colors.reset}`);
    }
}

async function run() {
    await testDeepSeek();
    await testGemini();
    await testGroq();
    await testOpenRouter();
    console.log(`\n${colors.cyan}Diagnóstico finalizado.${colors.reset}`);
}

run();
