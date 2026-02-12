const fs = require('fs');
const path = require('path');

const kbPath = 'c:/Users/lf/proyectos/infodoc-cantv/knowledge-base.json';
const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));

console.log(`✅ KB Loaded: ${Object.keys(kb.sheets).length} sheets.`);
console.log(`Keys: ${Object.keys(kb.sheets).join(', ')}`);

function findRelevantSections(query, kb) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
    const relevantSections = [];

    for (const [key, sheet] of Object.entries(kb.sheets)) {
        const matchKeyword = sheet.keywords.some(kw => queryLower.includes(kw.toLowerCase()));
        const matchTitle = queryWords.some(word => sheet.titulo.toLowerCase().includes(word));

        if (matchKeyword || matchTitle) {
            relevantSections.push({ key, title: sheet.titulo, contenido: sheet.contenido });
        }
    }

    return relevantSections;
}

const queries = ["¿Cuándo pagan?", "nomina de febrero", "cronograma pagos"];

queries.forEach(query => {
    console.log(`\n🔍 Query: "${query}"`);
    const results = findRelevantSections(query, kb);
    if (results.length === 0) {
        console.log("❌ No matches.");
    } else {
        results.forEach(r => {
            console.log(`   🌟 Match: "${r.title}" (key: ${r.key})`);
            console.log(`      Content: ${r.contenido}`);
        });
    }
});
