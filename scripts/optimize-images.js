/**
 * SCRIPT: optimize-images.js
 * Propósito: Convertir imágenes PNG/JPG pesadas a formato WebP optimizado
 *            para mejorar el rendimiento (LCP) de la webapp.
 * Uso: node scripts/optimize-images.js
 * Requiere: sharp (ya está en devDependencies)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// =========================================================================
// LISTA DE IMÁGENES A OPTIMIZAR
// Formato: { input, output, quality, width (opcional), blur (opcional) }
// =========================================================================
const imagesToOptimize = [
  // CRÍTICO: Imagen de fondo del Hero (2.47 MB -> ~70-100 KB)
  // Se usa al 10% de opacidad, no necesita alta resolución ni calidad
  {
    input: 'public/fusionbanderas.png',
    output: 'public/fusionbanderas.webp',
    quality: 60,
    width: 1920,  // Limitar resolución máxima para fondo web
    description: 'Fondo Hero Section (opacidad 10%)',
  },

  // Distribución de Nómina Jubilados (825 KB -> ~200 KB)
  {
    input: 'public/Ult distribucion de nomina jubilados.png',
    output: 'public/nomina-jubilados-dist.webp',
    quality: 82,
    description: 'Distribución de Nómina Jubilados',
  },

  // Reembolsos (452 KB -> ~100 KB)
  {
    input: 'public/reembolsos.png',
    output: 'public/reembolsos.webp',
    quality: 82,
    description: 'Formulario Reembolsos',
  },

  // Farmacia Cantv - Mapa 1 (627 KB -> ~150 KB)
  {
    input: 'public/Mp1.png',
    output: 'public/Mp1.webp',
    quality: 80,
    description: 'Farmacantv Mapa 1',
  },

  // Farmacia Cantv - Mapa 2 (706 KB -> ~170 KB)
  {
    input: 'public/Mp2.png',
    output: 'public/Mp2.webp',
    quality: 80,
    description: 'Farmacantv Mapa 2',
  },

  // Farmacia Cantv - Mapa 3 (732 KB -> ~175 KB)
  {
    input: 'public/Mp3.png',
    output: 'public/Mp3.webp',
    quality: 80,
    description: 'Farmacantv Mapa 3',
  },

  // Carta Aval (366 KB -> ~80 KB)
  {
    input: 'public/cartaAval.png',
    output: 'public/cartaAval.webp',
    quality: 82,
    description: 'Carta Aval',
  },

  // ATJ (376 KB -> ~85 KB)
  {
    input: 'public/ATJ.png',
    output: 'public/ATJ.webp',
    quality: 82,
    description: 'Atención al Jubilado (ATJ)',
  },

  // Gestión Humana (158 KB -> ~40 KB)
  {
    input: 'public/Gestion humana actualizado.png',
    output: 'public/gestion-humana.webp',
    quality: 82,
    description: 'Gestión Humana',
  },

  // Repdepc (236 KB -> ~55 KB)
  {
    input: 'public/Repdepc.png',
    output: 'public/Repdepc.webp',
    quality: 82,
    description: 'Repdepc (Publicidad)',
  },
];

// =========================================================================

async function optimizeImages() {
  console.log('\n🚀 Iniciando optimización de imágenes a WebP...\n');
  console.log('─'.repeat(65));

  let totalOriginal = 0;
  let totalWebP = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const img of imagesToOptimize) {
    if (!fs.existsSync(img.input)) {
      console.warn(`⚠️  Entrada no encontrada, omitiendo: ${img.input}`);
      continue;
    }

    console.log(`\n🖼️  ${img.description}`);
    console.log(`   Entrada: ${img.input}`);
    console.log(`   Salida:  ${img.output}`);

    try {
      let pipeline = sharp(img.input);

      // Reducir resolución si se especificó un ancho máximo
      if (img.width) {
        pipeline = pipeline.resize(img.width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }

      // Aplicar compresión WebP
      pipeline = pipeline.webp({ quality: img.quality });

      await pipeline.toFile(img.output);

      const originalSize = fs.statSync(img.input).size;
      const webpSize = fs.statSync(img.output).size;
      const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

      totalOriginal += originalSize;
      totalWebP += webpSize;
      successCount++;

      console.log(`   ✅ Original: ${(originalSize / 1024).toFixed(1)} KB → WebP: ${(webpSize / 1024).toFixed(1)} KB (Ahorro: ${savings}%)`);
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  const totalSavings = ((totalOriginal - totalWebP) / totalOriginal * 100).toFixed(1);

  console.log('\n' + '─'.repeat(65));
  console.log('\n📊 RESUMEN FINAL:');
  console.log(`   Imágenes procesadas: ${successCount}/${imagesToOptimize.length}`);
  if (errorCount > 0) console.log(`   Errores: ${errorCount}`);
  console.log(`   Peso total ANTES: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Peso total DESPUÉS: ${(totalWebP / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   🎉 Ahorro total: ${((totalOriginal - totalWebP) / 1024 / 1024).toFixed(2)} MB (${totalSavings}%)`);
  console.log('\n✅ Optimización completada. Ahora actualiza las referencias en el código.\n');
}

optimizeImages();
