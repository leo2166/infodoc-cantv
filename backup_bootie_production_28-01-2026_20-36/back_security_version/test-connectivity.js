
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

console.log('🧪 Iniciando prueba de conectividad Node.js...');
console.log('📅 Hora:', new Date().toISOString());

const URL = 'https://generativelanguage.googleapis.com';

// 1. Prueba de DNS
console.log('\n🔍 1. Probando resolución DNS...');
dns.lookup('generativelanguage.googleapis.com', (err, address, family) => {
    if (err) {
        console.error('❌ Error DNS:', err);
    } else {
        console.log('✅ DNS Resuelto:', address, '(Familia: IPv' + family + ')');

        // 2. Prueba HTTP después de DNS
        testHttp();
    }
});

async function testHttp() {
    console.log('\n🔍 2. Probando conexión HTTP (fetch)...');
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(URL, {
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        console.log('✅ Conexión establecida!');
        console.log('📊 Status:', response.status, response.statusText);
        // Esperamos 404 para la raíz, eso es éxito de conexión
    } catch (error) {
        console.error('❌ Error HTTP:', error.message);
        if (error.cause) console.error('   Causa:', error.cause);
    }
}
