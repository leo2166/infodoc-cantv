const fs = require('fs');
const path = require('path');

// Cargar KB
const kbPath = path.join(__dirname, '../lib/knowledge-base.json');
if (!fs.existsSync(kbPath)) {
    console.error("❌ Link failed: knowledge-base.json not found in lib/");
    process.exit(1);
}
const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));

console.log(`✅ KB Loaded: ${Object.keys(kb.sheets).length} sheets.`);

// Lógica de Búsqueda (Copia de route.ts)
function findRelevantContext(query, kb) {
    console.log(`\n🔍 Query: "${query}"`);
    const normalizedQuery = query.toLowerCase();
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 3);

    const scoredSheets = Object.values(kb.sheets).map(sheet => {
        let score = 0;
        sheet.keywords.forEach(keyword => {
            if (normalizedQuery.includes(keyword.toLowerCase())) score += 5;
        });
        if (sheet.contenido.toLowerCase().includes(normalizedQuery)) score += 2;
        queryWords.forEach(word => {
            if (sheet.contenido.toLowerCase().includes(word)) score += 1;
        });
        return { sheet, score };
    });

    const topResults = scoredSheets
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    if (topResults.length === 0) {
        console.log("❌ No matches found.");
        return;
    }

    topResults.forEach(r => {
        console.log(`   🌟 Match: "${r.sheet.titulo}" (Score: ${r.score})`);
        console.log(`      Content Preview: ${r.sheet.contenido.substring(0, 100)}...`);
    });
}

// Pruebas
findRelevantContext("contacto de armando parodi", kb);
findRelevantContext("que necesito para la carta aval", kb);
findRelevantContext("reembolso de farmacia", kb);
findRelevantContext("informacion sobre nomina 2026", kb);
