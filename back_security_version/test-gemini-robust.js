
require('dns').setDefaultResultOrder('ipv4first');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyB2TVEGTzjZpsRRmnKFZsT88bY83uaNEIE";

console.log('🧪 Iniciando prueba ROBUSTA de Gemini...');
console.log('🔑 API Key (masked):', API_KEY.substring(0, 5) + '...');

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log('📡 Enviando solicitud a Gemini...');
        const result = await model.generateContent("Responde solo con la palabra: FUNCIONA");
        const response = await result.response;
        const text = response.text();

        console.log('✅ RESPUESTA RECIBIDA:', text);
        return true;
    } catch (error) {
        console.error('❌ ERROR GEMINI:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data));
        }
        return false;
    }
}

testGemini();
