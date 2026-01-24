// Test DeepSeek API directamente
const DEEPSEEK_API_KEY = "sk-d38af05e372a4e8b9a86421b89f31af2";

console.log("🧪 Probando DeepSeek API directamente");
console.log("🔑 API Key:", DEEPSEEK_API_KEY.substring(0, 20) + "...");
console.log("");

fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: "Eres Bootie, un asistente útil." },
            { role: "user", content: "¿Qué es CANTV?" }
        ],
        temperature: 0.3,
        stream: false
    })
})
    .then(async (res) => {
        console.log("📊 Status:", res.status, res.statusText);
        const text = await res.text();
        console.log("📄 Raw response:", text);
        try {
            const data = JSON.parse(text);
            console.log("");
            console.log("✅ Parsed JSON:");
            console.log(JSON.stringify(data, null, 2));

            if (data.choices?.[0]?.message?.content) {
                console.log("");
                console.log("💬 Respuesta de DeepSeek:");
                console.log(data.choices[0].message.content);
            }
        } catch (e) {
            console.log("❌ Error parseando JSON");
        }
    })
    .catch((error) => {
        console.error("❌ Error en la petición:");
        console.error(error);
    });
