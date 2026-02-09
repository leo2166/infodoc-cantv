const sharp = require('sharp');
const fs = require('fs');

async function convertToWebP() {
    console.log('🔄 Iniciando conversión de Emergencias.jpg a WebP...\n');

    try {
        console.log('Convirtiendo Emergencias.jpg...');
        await sharp('public/Emergencias.jpg')
            .webp({ quality: 85 })
            .toFile('public/emergencias.webp');

        const originalSize = fs.statSync('public/Emergencias.jpg').size;
        const webpSize = fs.statSync('public/emergencias.webp').size;
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(2);

        console.log(`✅ Emergencias.jpg → emergencias.webp`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`   WebP: ${(webpSize / 1024).toFixed(2)} KB`);
        console.log(`   Ahorro: ${savings}%\n`);

    } catch (error) {
        console.error('❌ Error durante la conversión:', error);
        process.exit(1);
    }
}

convertToWebP();
