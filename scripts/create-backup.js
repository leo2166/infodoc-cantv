/**
 * SCRIPT: create-backup.js
 * Propósito: Hacer una copia de seguridad física de las imágenes pesadas
 *            ANTES de aplicar la optimización de rendimiento.
 * Uso: node scripts/create-backup.js
 */

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join('public', 'backup-original', 'performance-june-2026');

// Lista de archivos a respaldar (relativos a la raíz del proyecto)
const filesToBackup = [
  'public/fusionbanderas.png',
  'public/Ult distribucion de nomina jubilados.png',
  'public/reembolsos.png',
  'public/Mp1.png',
  'public/Mp2.png',
  'public/Mp3.png',
  'public/cartaAval.png',
  'public/ATJ.png',
  'public/Gestion humana actualizado.png',
  'public/Repdepc.png',
];

async function createBackup() {
  console.log('\n🔒 Iniciando creación de respaldo de seguridad...\n');

  // Crear directorio de respaldo si no existe
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Carpeta de respaldo creada: ${BACKUP_DIR}\n`);
  } else {
    console.log(`📁 Carpeta de respaldo ya existe: ${BACKUP_DIR}\n`);
  }

  let successCount = 0;
  let errorCount = 0;
  let totalOriginalSize = 0;

  for (const filePath of filesToBackup) {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Archivo no encontrado, omitiendo: ${filePath}`);
      continue;
    }

    const fileName = path.basename(filePath);
    const destPath = path.join(BACKUP_DIR, fileName);
    const fileSize = fs.statSync(filePath).size;
    totalOriginalSize += fileSize;

    try {
      fs.copyFileSync(filePath, destPath);
      console.log(`✅ Respaldado: ${fileName} (${(fileSize / 1024).toFixed(1)} KB)`);
      successCount++;
    } catch (err) {
      console.error(`❌ Error al respaldar ${fileName}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 RESUMEN:`);
  console.log(`   Archivos respaldados: ${successCount}`);
  if (errorCount > 0) console.log(`   Errores: ${errorCount}`);
  console.log(`   Tamaño total de originales: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Destino: ${BACKUP_DIR}`);
  console.log('\n✅ Respaldo completado. Puedes proceder con la optimización con seguridad.\n');
}

createBackup();
