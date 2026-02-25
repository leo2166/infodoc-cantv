const fs = require('fs');
const path = require('path');

// RUTAS BASE
const INFODOC_DIR = path.resolve(__dirname, '..');
const BOOTIE_DEV_DIR = path.resolve(INFODOC_DIR, '..', 'bootie-dev');

console.log('🔄 Iniciando sincronización de Bootie...');
console.log(`📁 Buscando en: ${BOOTIE_DEV_DIR}`);

if (!fs.existsSync(BOOTIE_DEV_DIR)) {
    console.error('❌ ERROR: No se encontró la carpeta bootie-dev.');
    process.exit(1);
}

// Detecta automáticamente la imagen más reciente en bootie-dev/public/
function detectarImagenBootie() {
    const publicDir = path.join(BOOTIE_DEV_DIR, 'public');
    if (!fs.existsSync(publicDir)) return null;
    const archivos = fs.readdirSync(publicDir).filter(f =>
        /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(f)
    );
    if (archivos.length === 0) return null;
    // Ordenar por fecha de modificación (más reciente primero)
    archivos.sort((a, b) => {
        const ta = fs.statSync(path.join(publicDir, a)).mtimeMs;
        const tb = fs.statSync(path.join(publicDir, b)).mtimeMs;
        return tb - ta;
    });
    return archivos[0]; // La imagen más reciente
}

// Archivos fijos a sincronizar
const FIJOS = [
    { origen: 'knowledge-base.json', destino: 'knowledge-base.json' },
    { origen: 'app/api/chat/route.ts', destino: 'app/api/chat/route.ts' },
    { origen: 'app/api/bootie/route.ts', destino: 'app/api/bootie/route.ts' },
];

let copiados = 0;

// Copiar archivos fijos
for (const { origen, destino } of FIJOS) {
    const src = path.join(BOOTIE_DEV_DIR, origen);
    const dst = path.join(INFODOC_DIR, destino);
    if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dst), { recursive: true });
        fs.copyFileSync(src, dst);
        console.log(`✅ Copiado: ${origen}`);
        copiados++;
    }
}

// Copiar imagen detectada y actualizar referencias en el widget
const imagenDetectada = detectarImagenBootie();
if (imagenDetectada) {
    const src = path.join(BOOTIE_DEV_DIR, 'public', imagenDetectada);
    const dst = path.join(INFODOC_DIR, 'public', imagenDetectada);
    fs.copyFileSync(src, dst);
    console.log(`🖼️  Imagen: ${imagenDetectada}`);
    copiados++;

    // Actualizar las referencias en el widget automáticamente
    const widgetPath = path.join(INFODOC_DIR, 'components', 'bootie-widget.tsx');
    if (fs.existsSync(widgetPath)) {
        let content = fs.readFileSync(widgetPath, 'utf8');
        // Reemplaza cualquier imagen png del botón (líneas con src="/algo.png")
        const updated = content.replace(/src="\/[^"]+\.(png|jpg|jpeg|webp)"/g, `src="/${imagenDetectada}"`);
        if (updated !== content) {
            fs.writeFileSync(widgetPath, updated, 'utf8');
            console.log(`✏️  Widget actualizado con imagen: /${imagenDetectada}`);
        }
    }
}

console.log('\n=======================================');
if (copiados > 0) {
    console.log(`🎉 ${copiados} archivos sincronizados desde bootie-dev.`);
    console.log('👀 Revisa localhost antes de hacer git push.');
} else {
    console.log('⚠️ No se encontraron archivos para sincronizar.');
}
console.log('=======================================\n');
