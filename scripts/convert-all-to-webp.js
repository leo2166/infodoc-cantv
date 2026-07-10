const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function convertAll() {
  console.log('🚀 Iniciando conversión automática de PNG/JPG a WebP en el directorio public...');
  
  const files = fs.readdirSync(publicDir);
  let convertedCount = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // Omitir iconos del sistema PWA e imágenes ya optimizadas/directorios
    if (file === 'icon-192.png' || file === 'icon-512.png' || file.startsWith('placeholder')) {
      console.log(`ℹ️  Omitiendo archivo de sistema/placeholder: ${file}`);
      continue;
    }

    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const inputPath = path.join(publicDir, file);
      const outputName = path.basename(file, ext) + '.webp';
      const outputPath = path.join(publicDir, outputName);

      try {
        console.log(`🔄 Convirtiendo ${file} → ${outputName}...`);
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);

        const origSize = fs.statSync(inputPath).size;
        const webpSize = fs.statSync(outputPath).size;
        console.log(`   ✅ Completado! ${(origSize/1024).toFixed(1)} KB → ${(webpSize/1024).toFixed(1)} KB`);
        convertedCount++;
      } catch (err) {
        console.error(`   ❌ Error al convertir ${file}: ${err.message}`);
      }
    }
  }

  console.log(`\n🎉 Conversión completa! Se convirtieron ${convertedCount} imágenes a WebP.`);
}

convertAll();
