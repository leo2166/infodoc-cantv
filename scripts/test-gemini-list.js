const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("No API KEY");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error.message);
            } else {
                console.log("Available Models:");
                json.models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
            }
        } catch (e) {
            console.error("Parse Error:", e.message);
            console.log("Raw:", data);
        }
    });
}).on('error', (e) => {
    console.error("Req Error:", e.message);
});
