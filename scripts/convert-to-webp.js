const sharp = require('sharp');
const path = require('path');

const conversions = [
    { input: 'public/2.png', output: 'public/febrero.webp' },
    { input: 'public/Nomina Marzo 2026.png', output: 'public/marzo.webp' },
    { input: 'public/Nomina Abril 2026.png', output: 'public/abril.webp' }
];

async function convertToWebP() {
    console.log('Iniciando conversión de imágenes a WebP...\n');

    for (const { input, output } of conversions) {
        try {
            console.log(`Convirtiendo ${input} → ${output}...`);
            await sharp(input)
                .webp({ quality: 85 })
                .toFile(output);
            console.log(`✅ Completado: ${output}\n`);
        } catch (error) {
            console.error(`❌ Error convirtiendo ${input}:`, error.message);
        }
    }

    console.log('Conversión completada.');
}

convertToWebP();
