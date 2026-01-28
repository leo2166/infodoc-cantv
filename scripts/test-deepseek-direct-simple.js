import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

async function testDirectDeepSeek() {
    console.log("Testing Direct DeepSeek API...");
    try {
        const res = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${DEEPSEEK_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: "PING" }]
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`HTTP ${res.status}: ${err}`);
        }

        const data = await res.json();
        console.log("✅ SUCCESS (Direct DeepSeek):", data.choices[0].message.content);
    } catch (e) {
        console.error("❌ FAILED (Direct DeepSeek):", e.message);
    }
}

testDirectDeepSeek();
