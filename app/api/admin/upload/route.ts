
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { exec } from 'child_process';
import util from 'util';
import { processDocument } from '@/lib/document-processor';

const execPromise = util.promisify(exec);

// Configuración de rutas
// IMPORTANTE: Ajustamos las rutas relativas a la estructura del proyecto
// infodoc-cantv (donde corre esto) -> ../bootie-dev/raw_docs
// infodoc-cantv (donde corre esto) -> ../bootie-dev/documents

const RAW_DOCS_DIR = path.resolve(process.cwd(), '../bootie-dev/raw_docs');
const DOCS_DIR = path.resolve(process.cwd(), '../bootie-dev/documents');

// Asegurar que existan los directorios
if (!fs.existsSync(RAW_DOCS_DIR)) {
    fs.mkdirSync(RAW_DOCS_DIR, { recursive: true });
}
if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name;
        const rawFilePath = path.join(RAW_DOCS_DIR, filename);

        // 1. Guardar archivo original (.docx)
        fs.writeFileSync(rawFilePath, buffer);
        console.log(`✅ Archivo guardado en: ${rawFilePath}`);

        // 2. Procesamiento Inteligente (IA)
        console.log("🧠 Iniciando procesamiento inteligente con IA...");
        const result = await processDocument(buffer, file.type);

        if (!result.success) {
            console.error("❌ Error en procesamiento IA:", result.error);
            return NextResponse.json({ error: result.error || "Error al procesar el archivo" }, { status: 500 });
        }

        const cleanMarkdown = result.markdown;

        const mdFilename = filename.replace(/\.docx?$/i, '.md');
        const mdFilePath = path.join(DOCS_DIR, mdFilename);

        fs.writeFileSync(mdFilePath, cleanMarkdown, 'utf-8');
        console.log(`✅ Markdown generado en: ${mdFilePath}`);

        // 3. Ejecutar build-kb.js para actualizar la base de conocimientos
        console.log("🔄 Ejecutando re-build de KB...");
        try {
            // Ejecutamos el script existente que ya arreglamos
            // Asumimos que estamos en c:\Users\lf\proyectos\infodoc-cantv
            const scriptPath = path.join(process.cwd(), 'scripts', 'build-kb.js');
            const { stdout, stderr } = await execPromise(`node "${scriptPath}"`);

            console.log("📜 Build Output:", stdout);
            if (stderr) console.error("⚠️ Build Stderr:", stderr);

        } catch (buildErr: any) {
            console.error("❌ Error reconstruyendo KB:", buildErr);
            // No fallamos el request completo si solo falló el rebuild, pero avisamos
            return NextResponse.json({
                success: true,
                message: "Archivo subido y convertido, pero hubo un error actualizando la KB automática.",
                details: buildErr.message
            });
        }

        return NextResponse.json({
            success: true,
            message: `Archivo '${filename}' procesado correctamente. Base de conocimientos actualizada.`,
            convertedFile: mdFilename
        });

    } catch (error: any) {
        console.error("❌ Error general en upload:", error);
        return NextResponse.json(
            { error: "Error interno del servidor", details: error.message },
            { status: 500 }
        );
    }
}
