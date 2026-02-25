const fs = require('fs');
const path = require('path');

// RUTAS BASE
// Este script corre desde la raíz de infodoc-cantv
const INFODOC_DIR = path.resolve(__dirname, '..');
const BOOTIE_DEV_DIR = path.resolve(INFODOC_DIR, '..', 'bootie-dev');

console.log('🔄 Iniciando sincronización de Bootie...');
console.log(`📁 Buscando en: ${BOOTIE_DEV_DIR}`);

// 1. VERIFICAR QUE BOOTIE-DEV EXISTE
if (!fs.existsSync(BOOTIE_DEV_DIR)) {
    console.error('❌ ERROR: No se encontró la carpeta bootie-dev. Asegúrate de que esté al mismo nivel que infodoc-cantv.');
    process.exit(1);
}

// ---------------------------------------------------------
// REGLAS DE COPIA (Ajusta estos nombres según lo que usaste)
// ---------------------------------------------------------

// MAPA DE ARCHIVOS A COPIAR
// Formato: { origenEnBootieDev: destinoEnInfodoc }
const ARCHIVOS_A_SINCRONIZAR = {
    // Ejemplos comunes de Base de Conocimientos:
    'knowledge-base.md': 'knowledge-base.md',
    'knowledge-base.json': 'knowledge-base.json',

    // Ejemplos comunes de Imágenes:
    'public/bootieFgris.png': 'public/bootieFgris.png',
    'public/bootie-avatar.png': 'public/bootie-avatar.png',
    'public/robot.png': 'public/robot.png',

    // El código de la API (si lo modificas):
    'app/api/bootie/route.ts': 'app/api/bootie/route.ts',
    'app/api/chat/route.ts': 'app/api/chat/route.ts',

    // El diseño del widget principal
    'components/bootie-widget.tsx': 'components/bootie-widget.tsx'
};

let copiados = 0;
let advertencias = 0;

for (const [origenRel, destinoRel] of Object.entries(ARCHIVOS_A_SINCRONIZAR)) {
    const rutaOrigen = path.join(BOOTIE_DEV_DIR, origenRel);
    const rutaDestino = path.join(INFODOC_DIR, destinoRel);

    try {
        if (fs.existsSync(rutaOrigen)) {
            // Asegurarse de que exista el directorio destino
            const dirDestino = path.dirname(rutaDestino);
            if (!fs.existsSync(dirDestino)) {
                fs.mkdirSync(dirDestino, { recursive: true });
            }

            // Si es directorio (por si decides copiar carpetas enteras en el futuro)
            if (fs.statSync(rutaOrigen).isDirectory()) {
                console.warn(`⚠️ Omitiendo directorio: ${origenRel}. Este script es para archivos.`);
                continue;
            }

            fs.copyFileSync(rutaOrigen, rutaDestino);
            console.log(`✅ Copiado: ${origenRel} -> ${destinoRel}`);
            copiados++;
        } else {
            // Silencioso para los opcionales que listamos arriba
        }
    } catch (err) {
        console.error(`❌ Error copiando ${origenRel}:`, err.message);
        advertencias++;
    }
}

console.log('\n=======================================');
console.log(`🎉 SINCRONIZACIÓN COMPLETADA 🎉`);
if (copiados > 0) {
    console.log(`✨ Se actualizaron ${copiados} archivos desde bootie-dev.`);
    console.log('👀 RECUERDA: Revisa en tu navegador que todo funcione bien antes de hacer git push.');
} else {
    console.log(`⚠️ No se encontró ningún archivo modificado de la lista configurada.`);
}
console.log('=======================================\n');
