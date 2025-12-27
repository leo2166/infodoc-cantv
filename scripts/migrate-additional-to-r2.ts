import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Archivos a migrar - Prioridad Alta y Media
const FILES_TO_MIGRATE = [
    // Prioridad Alta
    'EM1.png',
    'AM.png',

    // Prioridad Media
    'elderly-recreation.png',
    'modern-office-building.png',
    'elderly-christmas-celebration.png',
    'elderly-medical-care.png',
    'elderly-celebration.png',
    'LibroL1.pdf',
];

const BUCKET_NAME = 'infodoc-assets';
const PUBLIC_URL = 'https://pub-191743e1ba734c8eaa9ae902e6a12737.r2.dev';

async function migrateAdditionalFiles() {
    console.log('🚀 Iniciando migración adicional (Prioridad Alta + Media)...\n');

    const publicDir = path.join(process.cwd(), 'public');
    const backupDir = path.join(publicDir, 'backup-migrados');

    let successCount = 0;
    let errorCount = 0;
    let totalSizeMB = 0;

    for (const fileName of FILES_TO_MIGRATE) {
        const filePath = path.join(publicDir, fileName);

        try {
            // Verificar si el archivo existe
            if (!fs.existsSync(filePath)) {
                console.log(`⚠️  Archivo no encontrado: ${fileName} (saltando...)`);
                continue;
            }

            const fileSizeMB = fs.statSync(filePath).size / (1024 * 1024);
            console.log(`📤 Subiendo: ${fileName} (${fileSizeMB.toFixed(2)} MB)...`);

            // Usar wrangler para subir el archivo
            const command = `wrangler r2 object put ${BUCKET_NAME}/${fileName} --file="${filePath}"`;

            try {
                execSync(command, {
                    stdio: 'pipe', // Cambiar a pipe para evitar output excesivo
                    cwd: process.cwd()
                });

                console.log(`✅ Subido exitosamente: ${fileName}`);
                console.log(`   📍 URL pública: ${PUBLIC_URL}/${fileName}\n`);

                // Mover archivo a backup
                const backupPath = path.join(backupDir, fileName);
                fs.renameSync(filePath, backupPath);

                totalSizeMB += fileSizeMB;
                successCount++;
            } catch (cmdError) {
                console.error(`❌ Error al subir ${fileName}`);
                errorCount++;
            }
        } catch (error) {
            console.error(`❌ Error al procesar ${fileName}:`, error);
            errorCount++;
        }
    }

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE MIGRACIÓN ADICIONAL');
    console.log('='.repeat(60));
    console.log(`✅ Archivos migrados exitosamente: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📦 Espacio migrado: ${totalSizeMB.toFixed(2)} MB`);
    console.log(`📂 Archivos respaldados en: /public/backup-migrados`);

    if (successCount > 0) {
        console.log('\n💡 Próximos pasos:');
        console.log('   1. Actualizar referencias en el código');
        console.log('   2. Probar localmente con npm run dev');
        console.log('   3. Deploy a Vercel\n');
    }
}

// Ejecutar migración
migrateAdditionalFiles()
    .then(() => {
        console.log('🎉 Migración adicional completada!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Error fatal durante la migración:', error);
        process.exit(1);
    });
