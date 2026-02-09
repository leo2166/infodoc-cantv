const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, '../../bootie-dev/documents');
const OUTPUT_FILE = path.resolve(__dirname, '../lib/knowledge-base.json');

function generateKeywords(filename) {
    const name = filename.replace('.md', '').replace(/-/g, ' ');
    const keywords = name.split(' ').filter(w => w.length > 3);

    // Agregar keywords comunes según el tema
    if (name.includes('nomina')) keywords.push('pago', 'pagar', 'pagan', 'paga', 'fecha', 'cobro', 'calendario', 'cronograma');
    if (name.includes('reembolso')) keywords.push('medico', 'gasto', 'factura', 'salud', 'dinero');
    if (name.includes('carta')) keywords.push('seguro', 'clinica', 'cobertura', 'aval');
    if (name.includes('contacto')) keywords.push('telefono', 'numero', 'llamada', 'correo', 'ubicacion');
    if (name.includes('emergencia')) keywords.push('ambulancia', 'clinica', 'urgencia');

    return keywords;
}

function buildKB() {
    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`❌ Documents directory not found: ${DOCS_DIR}`);
        return;
    }

    const files = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.md'));

    const kb = {
        sheets: {},
        lastUpdated: new Date().toISOString()
    };

    console.log(`🔍 Encontrados ${files.length} documentos Markdown`);

    for (const file of files) {
        const key = file.replace('.md', '');
        const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');

        kb.sheets[key] = {
            titulo: key.replace(/-/g, ' ').toUpperCase(),
            contenido: content.trim(),
            keywords: generateKeywords(file)
        };

        console.log(`  ➕ Sheet agregado: ${key} (${content.length} chars)`);
        console.log(`     Keywords: ${kb.sheets[key].keywords.join(', ')}`);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(kb, null, 2));
    console.log(`\n✅ Base de conocimientos CORREGIDA generada en: ${OUTPUT_FILE}`);
    console.log(`   Estructura: { sheets: { ... }, lastUpdated: ... }`);
}

buildKB();
