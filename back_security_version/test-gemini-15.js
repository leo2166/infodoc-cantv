
require('dns').setDefaultResultOrder('ipv4first');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyB2TVEGTzjZpsRRmnKFZsT88bY83uaNEIE";

console.log('🧪 Probando GEMINI 1.5 FLASH (Versión Estable)...');

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // CAMBIO: Usamos 1.5-flash en lugar de 2.0-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log('📡 Enviando solicitud...');
        const result = await model.generateContent("Di hola");
        const response = await result.response;
        console.log('✅ RESPUESTA (1.5 Flash):', response.text());
        return true;
    } catch (error) {
        console.error('❌ ERROR (1.5 Flash):', error.message);
        return false;
    }
}

testGemini();
