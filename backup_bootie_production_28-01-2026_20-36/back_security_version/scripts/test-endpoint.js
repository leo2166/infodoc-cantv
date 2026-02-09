const http = require('http');

const message = process.argv[2] || 'cuando pagan la nomina';

console.log(`💬 Enviando pregunta: "${message}"`);

const data = JSON.stringify({ message });

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/chat-deepseek', // Endpoint CORRECTO
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    console.log(`📥 Status: ${res.statusCode}`);
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        try {
            const json = JSON.parse(body);
            console.log("\n🤖 Respuesta del Bot:");
            console.log("-----------------------------------------");
            console.log(json.text);
            console.log("-----------------------------------------");
        } catch (e) {
            console.log("Raw Body:", body);
        }
    });
});

req.on('error', error => {
    console.error("❌ Error de conexión:", error.message);
    console.error("Asegúrate de que 'npm run dev' esté corriendo en otra terminal.");
});

req.write(data);
req.end();
