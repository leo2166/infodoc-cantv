import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Archivos a migrar (solo los PDFs grandes)
const FILES_TO_MIGRATE = [
    'LibroL2.pdf',
    'LibroL3.pdf',
    'LibroL4 .pdf', // Nota: tiene un espacio antes de .pdf
];

const BUCKET_NAME = 'infodoc-assets';
const PUBLIC_URL = 'https://pub-191743e1ba734c8eaa9ae902e6a12737.r2.dev';

async function migrateToR2() {
    console.log('🚀 Iniciando migración a Cloudflare R2 usando Wrangler...\n');

    const publicDir = path.join(process.cwd(), 'public');
    const backupDir = path.join(publicDir, 'backup-migrados');

    // Crear directorio de backup si no existe
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        console.log('📁 Creado directorio de backup: /public/backup-migrados\n');
    }

    let successCount = 0;
    let errorCount = 0;

    for (const fileName of FILES_TO_MIGRATE) {
        const filePath = path.join(publicDir, fileName);

        try {
            // Verificar si el archivo existe
            if (!fs.existsSync(filePath)) {
                console.log(`⚠️  Archivo no encontrado: ${fileName} (saltando...)`);
                continue;
            }

            const fileSizeMB = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
            console.log(`📤 Subiendo: ${fileName} (${fileSizeMB} MB)...`);

            // Usar wrangler para subir el archivo
            const command = `wrangler r2 object put ${BUCKET_NAME}/${fileName} --file="${filePath}"`;

            try {
                execSync(command, {
                    stdio: 'inherit',
                    cwd: process.cwd()
                });

                console.log(`✅ Subido exitosamente: ${fileName}`);
                console.log(`   📍 URL pública: ${PUBLIC_URL}/${fileName}\n`);

                // Mover archivo a backup
                const backupPath = path.join(backupDir, fileName);
                fs.renameSync(filePath, backupPath);
                console.log(`   📦 Respaldado en: /public/backup-migrados/${fileName}\n`);

                successCount++;
            } catch (cmdError) {
                console.error(`❌ Error al subir ${fileName}:`, cmdError);
                errorCount++;
            }
        } catch (error) {
            console.error(`❌ Error al procesar ${fileName}:`, error);
            errorCount++;
        }
    }

    // Resumen
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Archivos migrados exitosamente: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📦 Archivos respaldados en: /public/backup-migrados`);

    if (successCount > 0) {
        console.log('\n💡 Próximos pasos:');
        console.log('   1. Actualizar referencias en el código');
        console.log('   2. Probar localmente con npm run dev');
        console.log('   3. Configurar variables de entorno en Vercel');
        console.log('   4. Hacer deploy\n');
    }
}

// Ejecutar migración
migrateToR2()
    .then(() => {
        console.log('🎉 Migración completada!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Error fatal durante la migración:', error);
        process.exit(1);
    });
