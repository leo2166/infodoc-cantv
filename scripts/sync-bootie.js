const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_PATH = path.resolve(__dirname, '../../bootie-dev/knowledge-base.json');
const DEST_PATH = path.resolve(__dirname, '../knowledge-base.json');

console.log('🤖 Bootie Sync: Iniciando sincronización de base de conocimientos...');
console.log(`📂 Origen: ${SOURCE_PATH}`);
console.log(`📂 Destino: ${DEST_PATH}`);

// Verify source exists
if (!fs.existsSync(SOURCE_PATH)) {
    console.error('❌ ERROR: No se encontró el archivo de origen en bootie-dev.');
    console.error('   Asegúrate de que la carpeta ../bootie-dev exista y tenga el archivo knowledge-base.json');
    process.exit(1);
}

try {
    // Read source
    const sourceData = fs.readFileSync(SOURCE_PATH);
    const sourceStats = fs.statSync(SOURCE_PATH);

    // Read destination (for comparison)
    let destStats = { size: 0, mtime: 0 };
    if (fs.existsSync(DEST_PATH)) {
        destStats = fs.statSync(DEST_PATH);
    }

    // Copy file
    fs.writeFileSync(DEST_PATH, sourceData);

    console.log('✅ Sincronización COMPLETADA con éxito.');
    console.log(`📊 Tamaño: ${destStats.size} bytes -> ${sourceStats.size} bytes`);
    console.log(`🕒 Fecha mod: ${new Date().toLocaleTimeString()}`);

} catch (error) {
    console.error('❌ ERROR CRÍTICO durante la copia:', error.message);
    process.exit(1);
}
