const sharp = require('sharp');
const fs = require('fs');

async function convertToWebP() {
    console.log('🔄 Iniciando conversión a WebP...\n');

    try {
        // Convertir atejub.jpeg a WebP
        console.log('Convirtiendo atejub.jpeg...');
        await sharp('public/atejub.jpeg')
            .webp({ quality: 85 })
            .toFile('public/atejub.webp');

        const originalSize1 = fs.statSync('public/atejub.jpeg').size;
        const webpSize1 = fs.statSync('public/atejub.webp').size;
        const savings1 = ((originalSize1 - webpSize1) / originalSize1 * 100).toFixed(2);

        console.log(`✅ atejub.jpeg → atejub.webp`);
        console.log(`   Original: ${(originalSize1 / 1024).toFixed(2)} KB`);
        console.log(`   WebP: ${(webpSize1 / 1024).toFixed(2)} KB`);
        console.log(`   Ahorro: ${savings1}%\n`);

        // Convertir biblioteca.jpg a WebP
        console.log('Convirtiendo biblioteca.jpg...');
        await sharp('public/biblioteca.jpg')
            .webp({ quality: 85 })
            .toFile('public/biblioteca.webp');

        const originalSize2 = fs.statSync('public/biblioteca.jpg').size;
        const webpSize2 = fs.statSync('public/biblioteca.webp').size;
        const savings2 = ((originalSize2 - webpSize2) / originalSize2 * 100).toFixed(2);

        console.log(`✅ biblioteca.jpg → biblioteca.webp`);
        console.log(`   Original: ${(originalSize2 / 1024).toFixed(2)} KB`);
        console.log(`   WebP: ${(webpSize2 / 1024).toFixed(2)} KB`);
        console.log(`   Ahorro: ${savings2}%\n`);

        const totalOriginal = originalSize1 + originalSize2;
        const totalWebP = webpSize1 + webpSize2;
        const totalSavings = ((totalOriginal - totalWebP) / totalOriginal * 100).toFixed(2);

        console.log('📊 RESUMEN TOTAL:');
        console.log(`   Total original: ${(totalOriginal / 1024).toFixed(2)} KB`);
        console.log(`   Total WebP: ${(totalWebP / 1024).toFixed(2)} KB`);
        console.log(`   Ahorro total: ${totalSavings}%`);
        console.log('\n✅ Conversión completada exitosamente!');

    } catch (error) {
        console.error('❌ Error durante la conversión:', error);
        process.exit(1);
    }
}

convertToWebP();
