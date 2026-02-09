// Script para probar el endpoint del chat con sistema de 3 capas
// Groq → DeepSeek → Gemini

const testMessage = "Hola, ¿cómo estás?";

console.log("🧪 Probando endpoint /api/chat-deepseek");
console.log("📝 Mensaje de prueba:", testMessage);
console.log("");

fetch("http://localhost:3000/api/chat-deepseek", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: testMessage }),
})
    .then((res) => {
        console.log("📊 Status:", res.status, res.statusText);
        return res.json();
    })
    .then((data) => {
        console.log("");
        console.log("✅ Respuesta del servidor:");
        console.log(data);
        console.log("");
        if (data.text) {
            console.log("💬 Texto de respuesta:");
            console.log(data.text);
        } else if (data.error) {
            console.log("❌ Error recibido:");
            console.log(data.error);
        }
    })
    .catch((error) => {
        console.error("❌ Error en la petición:");
        console.error(error);
    });
