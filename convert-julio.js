const sharp = require('sharp');
const fs = require('fs');

async function convertJulio() {
    const input = 'public/julio_actualizado.png';
    const output = 'public/Nomina_07_2026.webp';

    try {
        console.log(`Converting ${input} to ${output}...`);
        await sharp(input)
            .webp({ quality: 85 })
            .toFile(output);
        console.log('✅ Conversion completed successfully!');
    } catch (error) {
        console.error('❌ Error during conversion:', error);
        process.exit(1);
    }
}

convertJulio();
