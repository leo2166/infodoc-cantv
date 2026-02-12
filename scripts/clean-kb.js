const fs = require('fs');
const path = require('path');

const files = [
    'c:/Users/lf/proyectos/bootie-dev/knowledge-base.json',
    'c:/Users/lf/proyectos/infodoc-cantv/knowledge-base.json'
];

const keysToRemove = [
    'atencin-al-jubilado-contactos',
    'carta-aval',
    'nomina cantv ano 2026',
    'nomina-cantv-ao-2026',
    'reembolsos-por-gastos-mdicos'
];

files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        try {
            console.log(`🧹 Cleaning ${filePath}...`);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            keysToRemove.forEach(key => {
                if (data.sheets[key]) {
                    delete data.sheets[key];
                    console.log(`   - Removed key: ${key}`);
                }
            });

            data.lastUpdated = new Date().toISOString();
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ ${path.basename(filePath)} cleaned successfully.`);
        } catch (e) {
            console.error(`❌ Error cleaning ${filePath}:`, e.message);
        }
    } else {
        console.warn(`⚠️ File not found: ${filePath}`);
    }
});
