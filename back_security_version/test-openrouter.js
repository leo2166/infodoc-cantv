
require('dns').setDefaultResultOrder('ipv4first');

const OPENROUTER_API_KEY = "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";
// Usamos el modelo gratuito de Google Gemma 2 9B
const MODEL = "google/gemma-2-9b-it:free";

console.log('🧪 Probando OpenRouter (Capa Gratuita)...');
console.log('🔑 Key:', OPENROUTER_API_KEY.substring(0, 10) + '...');
console.log('🤖 Modelo:', MODEL);

async function testOpenRouter() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                // Headers requeridos por OpenRouter para rankings
                "HTTP-Referer": "https://infodoc-cantv.vercel.app",
                "X-Title": "InfoDoc CANTV"
            },
            body: JSON.stringify({
                "model": MODEL,
                "messages": [
                    { "role": "user", "content": "Responde solo con la palabra: FUNCIONA" }
                ],
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('❌ ERROR API:', JSON.stringify(data.error));
        } else if (data.choices && data.choices[0]) {
            console.log('✅ RESPUESTA RECIBIDA:', data.choices[0].message.content);
            console.log('📊 Costo:', data.usage ? JSON.stringify(data.usage) : 'Desconocido');
        } else {
            console.log('⚠️ Respuesta inesperada:', JSON.stringify(data));
        }

    } catch (error) {
        console.error('❌ ERROR CONEXIÓN:', error.message);
        if (error.cause) console.error('   Causa:', error.cause);
    }
}

testOpenRouter();
