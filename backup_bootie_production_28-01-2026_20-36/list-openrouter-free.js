
require('dns').setDefaultResultOrder('ipv4first');

const OPENROUTER_API_KEY = "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";

console.log('📋 Listando modelos GRATUITOS disponibles en OpenRouter...');

async function listFreeModels() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/models", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            }
        });

        const data = await response.json();

        if (data.data) {
            console.log('✅ Modelos encontrados (filtrando gratuitos):');
            const freeModels = data.data.filter(m => {
                // Check if pricing is substantially zero
                const prompt = parseFloat(m.pricing.prompt);
                const completion = parseFloat(m.pricing.completion);
                return prompt === 0 && completion === 0;
            });

            if (freeModels.length > 0) {
                freeModels.forEach(m => console.log(`   - ${m.id}`));

                // Intentar el primero de la lista
                console.log(`\n🧪 Probando el primero: ${freeModels[0].id}...`);
                await testModel(freeModels[0].id);
            } else {
                console.log('❌ No se encontraron modelos gratuitos.');
            }
        } else {
            console.log('❌ Error listando modelos:', JSON.stringify(data));
        }

    } catch (error) {
        console.error('❌ Error conexión:', error.message);
    }
}

async function testModel(modelName) {
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
                "messages": [{ "role": "user", "content": "Di hola" }]
            })
        });

        const data = await response.json();
        if (data.choices) {
            console.log('✅ FUNCIONA:', data.choices[0].message.content);
        } else {
            console.log('❌ FALLO TEST:', JSON.stringify(data));
        }
    } catch (e) {
        console.log('❌ ERROR TEST:', e.message);
    }
}

listFreeModels();
