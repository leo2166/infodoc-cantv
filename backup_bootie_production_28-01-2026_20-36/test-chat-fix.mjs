
import fetch from 'node-fetch';

async function testBootieChat() {
    const url = 'http://localhost:3000/api/bootie';

    console.log("🔵 Iniciando prueba de consistencia del Chat Bootie...\n");

    // Prueba 1: Gestión Humana (Debería traer info de RRHH, no de Jubilados)
    console.log("👉 Prueba 1: 'números gestión humana'");
    const payload1 = {
        messages: [
            { role: 'user', content: 'cuales son los números de gestión humana del zulia?' }
        ]
    };

    try {
        const res1 = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload1)
        });
        const data1 = await res1.json();
        const response1 = data1.response || "";

        console.log("\n💬 Respuesta Bot:\n", response1);

        if (response1.toLowerCase().includes("maría de los angeles") || response1.toLowerCase().includes("gilberto marcano") || response1.toLowerCase().includes("lisdeth carruyo")) {
            console.log("✅ ÉXITO: Se encontraron los contactos de Gestión Humana Zulia.");
        } else if (response1.toLowerCase().includes("armando parodi") || response1.toLowerCase().includes("efren boada")) {
            console.log("❌ FALLO: Se devolvieron contactos de Atención al Jubilado (Incorrecto).");
        } else {
            console.log("⚠️ ALERTA: Respuesta ambigua o no encontrada.");
        }

    } catch (e) {
        console.error("❌ Error en Prueba 1:", e.message);
    }
}

testBootieChat();
