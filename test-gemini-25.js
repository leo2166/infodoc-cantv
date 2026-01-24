
require('dns').setDefaultResultOrder('ipv4first');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyB2TVEGTzjZpsRRmnKFZsT88bY83uaNEIE";

console.log('🧪 Probando GEMINI 2.5 FLASH...');

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // CAMBIO: Usamos 2.5-flash (que aparece en la lista)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log('📡 Enviando solicitud...');
        const result = await model.generateContent("Di hola");
        const response = await result.response;
        console.log('✅ RESPUESTA (2.5 Flash):', response.text());
    } catch (error) {
        console.error('❌ ERROR (2.5 Flash):', error.message);
    }
}

testGemini();
