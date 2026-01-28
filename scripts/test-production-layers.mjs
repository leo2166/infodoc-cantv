import dotenv from 'dotenv';
import dns from 'node:dns';

// Fix DNS for Venezuela/CANTV
dns.setDefaultResultOrder('ipv4first');
dotenv.config({ path: '.env.local' });

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

async function testDeepSeek() {
    console.log("\n🔷 Testing Layer 1: DeepSeek (via OpenRouter)...");
    if (!DEEPSEEK_KEY) { console.log("❌ SKIPPED: No Key"); return; }
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${DEEPSEEK_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages: [{ role: "user", content: "Di 'DEEPSEEK_OK'" }]
            })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(`✅ SUCCESS: ${data.choices[0].message.content}`);
    } catch (e) {
        console.error(`❌ FAILED: ${e.message}`);
    }
}

async function testOpenRouter() {
    console.log("\n🟣 Testing Layer 3: OpenRouter (Gemma 3)...");
    if (!OPENROUTER_KEY) { console.log("❌ SKIPPED: No Key"); return; }
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "google/gemma-3-27b-it:free",
                messages: [{ role: "user", content: "Di 'OPENROUTER_OK'" }]
            })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log(`✅ SUCCESS: ${data.choices[0].message.content}`);
    } catch (e) {
        console.error(`❌ FAILED: ${e.message}`);
    }
}

async function run() {
    await testDeepSeek();
    await testOpenRouter();
}
run();
