
require('dns').setDefaultResultOrder('ipv4first');

const OPENROUTER_API_KEY = "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";

const MODELS_TO_TRY = [
    "google/gemma-2-9b-it:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "meta-llama/llama-3.2-1b-instruct:free",
    "google/gemini-2.0-flash-exp:free",
    "huggingfaceh4/zephyr-7b-beta:free",
    "nousresearch/hermes-3-llama-3.1-405b:free"
];

console.log('🧪 Probando múltiples modelos de OpenRouter...');

async function testModel(modelName) {
    console.log(`\n🤖 Probando: ${modelName}...`);
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
                "model": modelName,
                "messages": [
                    { "role": "user", "content": "Di hola" }
                ],
            })
        });

        const data = await response.json();

        if (data.error) {
            console.log(`❌ ERROR ${modelName}:`, data.error.message);
            return false;
        } else if (data.choices && data.choices[0]) {
            console.log(`✅ ÉXITO ${modelName}:`, data.choices[0].message.content);
            return true;
        }
    } catch (error) {
        console.log(`❌ EXCEPCIÓN ${modelName}:`, error.message);
    }
    return false;
}

(async () => {
    for (const model of MODELS_TO_TRY) {
        const success = await testModel(model);
        if (success) {
            console.log(`\n✨ ENCONTRADO MODELO QUE FUNCIONA: ${model}`);
            break;
        }
    }
})();
