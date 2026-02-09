// Test final del endpoint completo del chat
const testMessage = "Hola, ¿cómo puedo hacer un reembolso?";

console.log("🧪 Probando endpoint completo /api/chat-deepseek");
console.log("📝 Mensaje:", testMessage);
console.log("=".repeat(50));
console.log("");

fetch("http://localhost:3000/api/chat-deepseek", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: testMessage }),
})
    .then(async (res) => {
        console.log("📊 Status:", res.status, res.statusText);
        const data = await res.json();

        console.log("");
        if (data.text) {
            console.log("✅ ¡EL CHAT FUNCIONA!");
            console.log("");
            console.log("💬 Respuesta del asistente:");
            console.log("-".repeat(50));
            console.log(data.text);
            console.log("-".repeat(50));
        } else if (data.error) {
            console.log("❌ Error:");
            console.log(data.error);
        }
    })
    .catch((error) => {
        console.error("❌ Error de conexión:");
        console.error(error);
    });
