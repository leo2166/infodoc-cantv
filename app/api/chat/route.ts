import { GoogleGenAI } from "@google/genai";
import dns from 'node:dns';
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

// Forzar IPv4 para evitar problemas con VPN/CANTV
dns.setDefaultResultOrder('ipv4first');

const apiKey = process.env.GOOGLE_API_KEY;
const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

// No lanzamos error si falta google_api_key para permitir que build corra, pero logueamos
if (!apiKey) {
  console.warn("⚠️ GOOGLE_API_KEY no está configurada");
}

const genAI = new GoogleGenAI({ apiKey: apiKey || "dummy" });

// Función para llamar a DeepSeek (vía OpenRouter)
async function callDeepSeek(systemPrompt: string, context: string, query: string) {
  if (!deepseekApiKey) {
    console.log("⚠️ DEEPSEEK_API_KEY no configurada");
    return null;
  }

  try {
    console.log("🚀 [DeepSeek] Enviando petición a OpenRouter...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${deepseekApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://infodoc-cantv.vercel.app",
        "X-Title": "InfoDoc CANTV",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `CONTEXTO:\n${context}\n\nPREGUNTA: ${query}\n\nRESPUESTA:` }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [DeepSeek] Error HTTP", response.status, ":", errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      console.log("✅ [DeepSeek] Respuesta exitosa");
      return content;
    } else {
      console.error("❌ [DeepSeek] Respuesta vacía:", JSON.stringify(data));
      return null;
    }
  } catch (e: any) {
    console.error("❌ [DeepSeek] Excepción:", e.message || e);
    return null;
  }
}

interface KnowledgeBase {
  sheets: {
    [key: string]: {
      titulo: string;
      contenido: string;
      keywords: string[];
    };
  };
  lastUpdated: string;
}

// Cargar la base de conocimiento
function loadKnowledgeBase(): KnowledgeBase | null {
  try {
    // AJUSTE PARA INFODOC: Ruta en /lib/
    const kbPath = path.join(process.cwd(), "lib", "knowledge-base.json");
    if (fs.existsSync(kbPath)) {
      const data = fs.readFileSync(kbPath, "utf-8");
      return JSON.parse(data);
    } else {
      console.error("❌ Conocimiento no encontrado en:", kbPath);
    }
  } catch (e) {
    console.error("Error cargando knowledge base:", e);
  }
  return null;
}

// Buscar información relevante basada en palabras clave en las "hojas"
function findRelevantSections(query: string, kb: KnowledgeBase): string[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
  const relevantSections: string[] = [];

  for (const [key, sheet] of Object.entries(kb.sheets)) {
    // Verificar si alguna keyword de la hoja está en la consulta
    const matchKeyword = sheet.keywords.some(kw => queryLower.includes(kw.toLowerCase()));

    // Verificar si alguna palabra de la consulta está en el título o contenido
    const matchTitle = queryWords.some(word => sheet.titulo.toLowerCase().includes(word));

    if (matchKeyword || matchTitle) {
      relevantSections.push(sheet.contenido);
    }
  }

  return relevantSections;
}

const systemPrompt = `Eres un asistente institucional llamado Bootie. Tu función es responder preguntas de jubilados de CANTV sobre salud, reembolsos, atención y servicios disponibles. Tienes acceso a una base de conocimientos cargada en formato \`.md\` con secciones bien definidas. Tu comportamiento debe seguir estas reglas: 
1. **Responde con precisión y brevedad**, extrayendo solo la sección relevante del documento cuando el usuario mencione palabras clave como “reembolso”, “farmacia”, “hospitalización”, “consulta médica”, etc. 
2. **No muestres el documento completo**, solo la parte que responde directamente a la pregunta.
3. Si la pregunta es ambigua, responde con una lista de opciones claras para que el usuario elija. 
4. Si no encuentras información en la base de conocimientos, responde: “No tengo información específica sobre eso en mi base de datos actual. ¿hay algo más en que te pueda ayudar o puede reformular su pregunta?” 
5. Mantén un tono respetuoso, claro y directo. Evita tecnicismos innecesarios.

Ejemplo de respuesta ideal: 
Usuario: “¿Qué necesito para el reembolso de gastos por medicamentos?” 
Respuesta: “Para el reembolso por medicamentos, debe presentar: Informe médico vigente, récipes, indicaciones y factura original 
Para enviarlo a reembolsogss@cantv.com.ve .”`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Se requiere un mensaje válido" },
        { status: 400 }
      );
    }

    console.time("chat_total");
    const kb = loadKnowledgeBase();

    // 1. Manejo especial de Saludos (para ahorrar tokens y evitar cuota)
    const greetings = ["hola", "buenos dias", "buenas tardes", "buenas noches", "hey", "saludos"];
    const isGreeting = greetings.some(g => message.toLowerCase().trim().startsWith(g)) && message.length < 15;

    if (isGreeting) {
      console.log("👋 Saludo detectado, respuesta rápida.");
      return NextResponse.json({
        response: "¡Hola! Mi nombre es Bootie. Estoy listo para ayudarte con información de CANTV. ¿Qué necesitas saber hoy?"
      });
    }

    if (!kb) {
      return NextResponse.json(
        { error: "No hay base de conocimiento cargada." },
        { status: 500 }
      );
    }

    // Buscar secciones relevantes en las hojas
    console.time("kb_search");
    const relevantSections = findRelevantSections(message, kb);
    console.timeEnd("kb_search");

    // Construir contexto
    let context = "";
    if (relevantSections.length > 0) {
      console.log(`✅ Secciones encontradas: ${relevantSections.length}`);
      context = "INFORMACIÓN DEL DOCUMENTO:\n\n" + relevantSections.join("\n\n---\n\n");

      // Guardamos la info para el fallback
      const currentInfo = relevantSections;

      // Capa 1: Intentar DeepSeek (Calidad Superior)
      console.log("\n🔷 [CAPA 1] Intentando DeepSeek...");
      console.time("deepseek_api");
      // Nota: Podríamos omitir DeepSeek si sabemos que no hay quota, pero lo intentamos por si acaso.
      const deepseekResponse = await callDeepSeek(systemPrompt, context, message);
      console.timeEnd("deepseek_api");

      if (deepseekResponse) {
        console.log("✅ [CAPA 1] Respondiendo con DeepSeek");
        console.timeEnd("chat_total");
        return NextResponse.json({
          response: `${deepseekResponse}\n\n*— Respondido por DeepSeek AI*`
        });
      }

      // Capa 2: Fallback a Gemini Lite (si DeepSeek falla)
      console.log("\n🔶 [CAPA 2] DeepSeek falló, intentando Gemini...");
      console.time("gemini_api");
      try {
        // Gemini requiere GOOGLE_API_KEY
        if (!apiKey) throw new Error("Google API Key not configured");

        const result = await genAI.models.generateContent({
          model: "gemini-2.0-flash-lite",
          contents: {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\nCONTEXTO:\n${context}\n\nPREGUNTA: ${message}\n\nRESPUESTA:` }
            ]
          }
        });
        console.timeEnd("gemini_api");
        console.timeEnd("chat_total");

        const text = result.text || "No pude procesar tu respuesta en este momento.";

        console.log("✅ [CAPA 2] Respondiendo con Gemini");
        return NextResponse.json({
          response: `${text}\n\n*— Respondido por Gemini Flash Lite*`
        });
      } catch (apiError: any) {
        console.error("❌ [CAPA 2] Error en Gemini:", apiError.message || apiError);

        // Capa 3: Fallback Estructurado Local (Si todo falla)
        console.log("\n🔴 [CAPA 3] Ambas IAs fallaron, usando fallback local");
        const fallbackResponse = "Disculpe, mis sistemas de IA están algo saturados, pero aquí tiene la información exacta de mi base de datos:\n\n" +
          currentInfo.join("\n\n---\n\n") +
          "\n\n*— Información directa de la base de datos*";

        console.timeEnd("chat_total");
        return NextResponse.json({ response: fallbackResponse });
      }
    } else {
      console.log("⚠️ No se encontró info específica. Enviando mensaje de fallback directo.");
      console.timeEnd("chat_total");
      return NextResponse.json({
        response: "Disculpa esa informacion no se encuentra en mi base de datos, en que mas te puedo ayudar..."
      });
    }

  } catch (error: any) {
    console.error("Error en API de chat:", error);
    return NextResponse.json(
      { error: "Algo salió mal en mi sistema.", details: error.message },
      { status: 500 }
    );
  }
}