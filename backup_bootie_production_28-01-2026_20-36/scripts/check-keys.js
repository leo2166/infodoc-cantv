import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

function mask(key) {
    if (!key) return "MISSING";
    if (key.length < 10) return "TOO_SHORT";
    return key.substring(0, 7) + "..." + key.substring(key.length - 4);
}

const deepseek = process.env.DEEPSEEK_API_KEY;
const google = process.env.GOOGLE_API_KEY;
const openrouter = process.env.OPENROUTER_API_KEY;

console.log("Key Formats:");
console.log(`DEEPSEEK_API_KEY: ${mask(deepseek)}`);
console.log(`GOOGLE_API_KEY: ${mask(google)}`);
console.log(`OPENROUTER_API_KEY: ${mask(openrouter)}`);

if (deepseek && !deepseek.startsWith("sk-or-")) {
    console.log("WARNING: DEEPSEEK_API_KEY does not start with 'sk-or-'. If you are using OpenRouter, it should start with 'sk-or-'.");
}
