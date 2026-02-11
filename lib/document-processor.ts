import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export interface ProcessingResult {
    markdown: string;
    success: boolean;
    error?: string;
}

/**
 * Procesa un documento (Word o PDF) y utiliza IA para estructurarlo en Markdown limpio.
 */
export async function processDocument(buffer: Buffer, fileType: string): Promise<ProcessingResult> {
    try {
        let rawContent = "";

        // 1. Extracción Cruda
        if (fileType.includes('officedocument.wordprocessingml') || fileType.includes('msword')) {
            const result = await mammoth.extractRawText({ buffer });
            rawContent = result.value;
        } else if (fileType.includes('pdf')) {
            const data = await pdf(buffer);
            rawContent = data.text;
        } else {
            return { markdown: "", success: false, error: "Tipo de archivo no soportado para procesamiento inteligente." };
        }

        if (!rawContent.trim()) {
            return { markdown: "", success: false, error: "No se pudo extraer texto del documento." };
        }

        // 2. Limpieza e Inteligencia con IA
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Actúa como un experto en estructuración de datos. 
            A continuación te proporciono el texto extraído de un documento (posiblemente con tablas o cronogramas desordenados).
            
            TU TAREA:
            1. Convierte este contenido en Markdown limpio y profesional.
            2. Si hay tablas o cronogramas de pago, asegúrate de que queden formateados como TABLAS DE MARKDOWN reales.
            3. Elimina ruido, saltos de línea innecesarios o caracteres extraños de la conversión.
            4. Mantén la información intacta, no inventes datos.
            5. El resultado debe ser EXCLUSIVAMENTE el código Markdown.

            CONTENIDO RAW:
            ---
            ${rawContent}
            ---
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Limpiar bloques de código markdown si la IA los incluye
        text = text.replace(/^```markdown\n/, '').replace(/\n```$/, '').replace(/^```\n/, '').replace(/\n```$/, '');

        return {
            markdown: text.trim(),
            success: true
        };

    } catch (error: any) {
        console.error("❌ Error en processDocument:", error);
        return {
            markdown: "",
            success: false,
            error: error.message
        };
    }
}
