
require('dns').setDefaultResultOrder('ipv4first');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyB2TVEGTzjZpsRRmnKFZsT88bY83uaNEIE";

console.log('📋 Listando modelos disponibles...');

async function listModels() {
    try {
        // Hacemos un fetch manual porque el SDK a veces oculta el listado
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log('✅ Modelos encontrados:');
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    console.log(`   - ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log('❌ No se encontraron modelos o hubo error:', JSON.stringify(data));
        }
    } catch (error) {
        console.error('❌ Error listando modelos:', error.message);
    }
}

listModels();
