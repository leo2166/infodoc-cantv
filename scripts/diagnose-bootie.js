
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import dns from 'node:dns';

// Forzar IPv4
dns.setDefaultResultOrder('ipv4first');

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

console.log("🔍 INICIANDO DIAGNÓSTICO DE BOOTIE...");

// 1. Verificación de Variables
console.log("\n1️⃣ VERIFICACIÓN DE API KEYS:");
const googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const groqKey = process.env.GROQ_API_KEY;
const openRouterKey = process.env.OPENROUTER_API_KEY;

console.log(`- GOOGLE_API_KEY: ${googleKey ? "✅ Presente" : "❌ FALTANTE"}`);
console.log(`- GROQ_API_KEY: ${groqKey ? "✅ Presente" : "❌ FALTANTE"}`);
console.log(`- OPENROUTER_API_KEY: ${openRouterKey ? "✅ Presente" : "❌ FALTANTE"}`);

// 2. Verificación de Knowledge Base
console.log("\n2️⃣ VERIFICACIÓN DE KNOWLEDGE BASE:");
const kbPath = path.join(process.cwd(), "knowledge-base.json");
if (fs.existsSync(kbPath)) {
    try {
        const kb = JSON.parse(fs.readFileSync(kbPath, "utf-8"));
        const sheetsCount = Object.keys(kb.sheets || {}).length;
        console.log(`✅ knowledge-base.json encontrado con ${sheetsCount} secciones.`);
    } catch (e) {
        console.log(`❌ Error leyendo knowledge-base.json: ${e.message}`);
    }
} else {
    console.log("❌ knowledge-base.json NO encontrado en la raíz.");
}

// 3. Prueba de Conectividad (Secuencial)
async function testConnections() {
    // TEST GEMINI
    console.log("\n3️⃣ TEST GEMINI (Capa 1):");
    if (googleKey) {
        try {
            const genAI = new GoogleGenAI({ apiKey: googleKey });
            const result = await genAI.models.generateContent({
                model: "gemini-2.0-flash", // Usamos 2.0 que suele ser más estable para test
                contents: "Responde solo con la palabra: CONECTADO",
            });
            console.log(`✅ Gemini Respondió: ${result.text ? result.text.trim() : "Sin texto"}`);
        } catch (e) {
            console.log(`❌ Error Gemini: ${e.message}`);
        }
    } else {
        console.log("⚠️ Saltando Gemini (Sin Key)");
    }

    // TEST GROQ
    console.log("\n4️⃣ TEST GROQ (Capa 2/3):");
    if (groqKey) {
        try {
            const groq = new Groq({ apiKey: groqKey });
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: "Responde solo con la palabra: CONECTADO" }],
                model: "llama-3.1-8b-instant",
            });
            console.log(`✅ Groq Respondió: ${completion.choices[0]?.message?.content}`);
        } catch (e) {
            console.log(`❌ Error Groq: ${e.message}`);
        }
    } else {
        console.log("⚠️ Saltando Groq (Sin Key)");
    }

    // TEST OPENROUTER
    console.log("\n5️⃣ TEST OPENROUTER (Capa 4):");
    if (openRouterKey) {
        try {
            const openai = new OpenAI({
                apiKey: openRouterKey,
                baseURL: "https://openrouter.ai/api/v1",
            });
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: "Responde solo con la palabra: CONECTADO" }],
                model: "google/gemma-3-27b-it",
            });
            console.log(`✅ OpenRouter Respondió: ${completion.choices[0]?.message?.content}`);
        } catch (e) {
            console.log(`❌ Error OpenRouter: ${e.message}`);
        }
    } else {
        console.log("⚠️ Saltando OpenRouter (Sin Key)");
    }
}

testConnections();
