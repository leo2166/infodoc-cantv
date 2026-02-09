
require('dns').setDefaultResultOrder('ipv4first');

const OPENROUTER_API_KEY = "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";
// Model grande y reciente de Google
const MODEL = "google/gemma-3-27b-it:free";

console.log(`🧪 Probando ${MODEL}...`);

async function testOpenRouter() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://infodoc-cantv.vercel.app",
                "X-Title": "InfoDoc CANTV"
            },
            body: JSON.stringify({
                "model": MODEL,
                // Gemma 3 a veces necesita prompt específico, pero probamos estándar
                "messages": [
                    { "role": "user", "content": "Di hola en español" }
                ],
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            console.log('✅ FUNCIONA:', data.choices[0].message.content);
        } else {
            console.log('❌ FALLO:', JSON.stringify(data));
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

testOpenRouter();
