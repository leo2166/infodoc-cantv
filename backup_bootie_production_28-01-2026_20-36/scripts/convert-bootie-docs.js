const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-'
});

// Configurar turndown para manejar tablas (básico)
turndownService.keep(['table', 'tr', 'td', 'th', 'tbody', 'thead']);

const SOURCE_DIR = path.resolve(__dirname, '../../bootie-dev/raw_docs');
const DEST_DIR = path.resolve(__dirname, '../../bootie-dev/documents');

async function convertDocs() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
        return;
    }

    if (!fs.existsSync(DEST_DIR)) {
        fs.mkdirSync(DEST_DIR, { recursive: true });
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(file => file.endsWith('.docx'));

    console.log(`🔍 Encontrados ${files.length} documentos .docx`);

    for (const file of files) {
        const filePath = path.join(SOURCE_DIR, file);
        const outputName = file.replace('.docx', '.md').replace(/\s+/g, '-').toLowerCase();
        const outputPath = path.join(DEST_DIR, outputName);

        try {
            console.log(`Processing: ${file}...`);

            // Convertir docx a HTML usando mammoth (preservando headers lo mejor posible)
            const result = await mammoth.convertToHtml({ path: filePath });
            const html = result.value;
            const messages = result.messages; // Any warnings

            if (messages.length > 0) {
                console.log('  ⚠️ Warnings:', messages);
            }

            // Convertir HTML a Markdown
            let markdown = turndownService.turndown(html);

            // Limpieza básica post-conversión
            markdown = markdown.replace(/&nbsp;/g, ' ');

            fs.writeFileSync(outputPath, markdown);
            console.log(`  ✅ Guardado en: ${outputName}`);

        } catch (error) {
            console.error(`  ❌ Error converting ${file}:`, error);
        }
    }
}

convertDocs();
