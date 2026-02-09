import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const BUCKET_NAME = 'infodoc-assets';
// Nota: Usamos comillas para manejar espacios en nombres de archivos
const BACKUP_DIR = path.join(process.cwd(), 'public', 'backup-migrados');

async function uploadToRealR2() {
    console.log('🚀 Iniciando subida REAL a Cloudflare R2 (Modo Remote)...\n');

    if (!fs.existsSync(BACKUP_DIR)) {
        console.error('❌ No se encontró el directorio de backup.');
        return;
    }

    const files = fs.readdirSync(BACKUP_DIR);
    let successCount = 0;
    let errorCount = 0;

    for (const fileName of files) {
        // Ignorar archivos ocultos o de sistema si los hay
        if (fileName.startsWith('.')) continue;

        const filePath = path.join(BACKUP_DIR, fileName);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) continue;

        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`📤 Subiendo a la NUBE: ${fileName} (${fileSizeMB} MB)...`);

        // IMPORTANTE: Agregamos --remote para ir a producción
        // Envolvemos fileName y filePath en comillas para manejar espacios
        const command = `wrangler r2 object put ${BUCKET_NAME}/"${fileName}" --file="${filePath}" --remote`;

        try {
            execSync(command, {
                stdio: 'inherit',
                cwd: process.cwd()
            });

            console.log(`✅ Subido a Cloudflare: ${fileName}\n`);
            successCount++;
        } catch (cmdError) {
            console.error(`❌ Error al subir ${fileName}:`, cmdError);
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE SUBIDA REAL');
    console.log('='.repeat(60));
    console.log(`✅ Archivos subidos a la nube: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
}

uploadToRealR2();
