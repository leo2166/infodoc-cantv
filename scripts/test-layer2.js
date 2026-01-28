import dotenv from 'dotenv';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');
dotenv.config({ path: '.env.local' });

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

async function testLayer2() {
    console.log("Testing Layer 2: OpenRouter (Llama 3.3 70B)...");
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://infodoc-cantv.vercel.app",
                "X-Title": "InfoDoc CANTV"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.3-70b-instruct:free",
                messages: [{ role: "user", content: "Say 'LLAMA_OK'" }]
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`HTTP ${res.status}: ${err}`);
        }

        const data = await res.json();
        console.log("✅ SUCCESS:", data.choices[0].message.content);
    } catch (e) {
        console.error("❌ FAILED:", e.message);
    }
}

testLayer2();
