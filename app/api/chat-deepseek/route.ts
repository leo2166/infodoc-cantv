import { GoogleGenAI } from "@google/genai";
import { Groq } from "groq-sdk";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import dns from 'node:dns';

// Módulos de búsqueda inteligente
import { searchTavily } from "@/lib/tavily-search";
import { classifyQuery, getCurrentDateContext, buildEnrichedPrompt } from "@/lib/query-classifier";

// Forzar IPv4 para evitar problemas con VPN/CANTV
dns.setDefaultResultOrder('ipv4first');

// Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.QWEN_API_KEY_NUEVA;

const SYSTEM_PROMPT = "Eres un asistente de Inteligencia Artificial avanzado para InfoDoc CANTV. Responde siempre en Español, usando Markdown simple y claro. Tu principal deber es proveer información exacta, útil y actualizada. Si se te proporciona información o resultados de búsqueda, úsalos como base principal.";

// Helper para timeout en llamadas a APIs
function withTimeout<T>(promise: Promise<T>, ms: number = 15000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout de ${ms}ms excedido`)), ms))
  ]);
}

// ─── Capas Gemini (Google GenAI Oficial) ──────────────────────────────────────
async function callGemini(modelName: string, query: string, useSearchGrounding: boolean = false): Promise<{ text: string; searchUsed: boolean } | null> {
  if (!GOOGLE_API_KEY) {
    console.log(`⚠️ [Gemini ${modelName}] GOOGLE_API_KEY no configurada`);
    return null;
  }

  try {
    console.log(`🚀 [Gemini] Intentando modelo ${modelName} (Search Grounding: ${useSearchGrounding})...`);
    const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
    
    const config: any = {
      systemInstruction: SYSTEM_PROMPT,
    };

    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await withTimeout(ai.models.generateContent({
      model: modelName,
      contents: query,
      config: config
    }), 18000);

    const text = response.text;
    if (text) {
      const searchUsed = !!(response.candidates?.[0]?.groundingMetadata?.webSearchQueries?.length);
      console.log(`✅ [Gemini ${modelName}] Respuesta exitosa (Búsqueda web nativa usada: ${searchUsed})`);
      return { text, searchUsed };
    }
    return null;
  } catch (error: any) {
    console.error(`❌ [Gemini ${modelName}] Error:`, error.message || error);
    return null;
  }
}

// ─── Capas OpenRouter (Modelos Gratuitos) ───────────────────────────────────────
async function callOpenRouter(modelName: string, query: string): Promise<string | null> {
  if (!OPENROUTER_API_KEY) {
    console.log(`⚠️ [OpenRouter ${modelName}] API Key no configurada`);
    return null;
  }

  try {
    console.log(`🚀 [OpenRouter] Intentando modelo ${modelName}...`);
    const openai = new OpenAI({
      apiKey: OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await withTimeout(openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      temperature: 0.4,
    }), 15000);

    const response = completion.choices[0]?.message?.content || null;
    if (response) {
      console.log(`✅ [OpenRouter ${modelName}] Respuesta exitosa`);
    }
    return response;
  } catch (error: any) {
    console.error(`❌ [OpenRouter ${modelName}] Error:`, error.message || error);
    return null;
  }
}

// ─── Capa Groq (Llama 3.3) ──────────────────────────────────────────────────
async function callGroq(query: string): Promise<string | null> {
  if (!GROQ_API_KEY) {
    console.log("⚠️ [Groq] API Key no configurada");
    return null;
  }

  try {
    console.log("🚀 [Groq] Intentando conexión...");
    const groq = new Groq({ apiKey: GROQ_API_KEY });

    const completion = await withTimeout(groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    }), 12000);

    const response = completion.choices[0]?.message?.content || null;
    if (response) {
      console.log("✅ [Groq] Respuesta exitosa");
    }
    return response;
  } catch (error: any) {
    console.error("❌ [Groq] Error:", error.message || error);
    return null;
  }
}

// ─── Capa DeepSeek (API Directa) ─────────────────────────────────────────────
async function callDeepSeek(query: string): Promise<string | null> {
  if (!DEEPSEEK_API_KEY) {
    console.log("⚠️ [DeepSeek] API Key no configurada");
    return null;
  }

  try {
    console.log("🚀 [DeepSeek] Intentando API directa...");
    const response = await withTimeout(fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query }
        ],
        temperature: 0.3,
        stream: false
      })
    }), 12000);

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
    }
    return null;
  } catch (error: any) {
    console.error("❌ [DeepSeek] Error:", error.message || error);
    return null;
  }
}

// ─── Cascada de IA Resiliente con 7 Capas de Respaldo ──────────────────────────
async function callAICascade(
  query: string, 
  needsWebSearch: boolean
): Promise<{ text: string; source: string } | null> {

  // CAPA 1: Gemini 2.5 Flash (Con Google Search Grounding nativo si se requiere búsqueda web)
  console.log("🔷 [CAPA 1] Intentando Gemini 2.5 Flash...");
  const gemini1 = await callGemini("gemini-2.5-flash", query, needsWebSearch);
  if (gemini1) {
    const sourceLabel = gemini1.searchUsed 
      ? "Gemini 2.5 Flash (con Búsqueda Web Google)" 
      : "Gemini 2.5 Flash";
    return { text: gemini1.text, source: sourceLabel };
  }

  // CAPA 2: Gemini 3.8 Flash (Última generación de Google)
  console.log("🔶 [CAPA 2] Intentando Gemini 3.8 Flash...");
  const gemini2 = await callGemini("gemini-3.8-flash", query, false);
  if (gemini2) return { text: gemini2.text, source: "Gemini 3.8 Flash" };

  // CAPA 3: Gemini 3.5 Flash Lite (Ultra rápido y eficiente)
  console.log("🟢 [CAPA 3] Intentando Gemini 3.5 Flash Lite...");
  const gemini3 = await callGemini("gemini-3.5-flash-lite", query, false);
  if (gemini3) return { text: gemini3.text, source: "Gemini 3.5 Flash Lite" };

  // CAPA 4: OpenRouter Free Router (Modelos abiertos gratuitos sin costo de saldo)
  console.log("🟣 [CAPA 4] Intentando OpenRouter Free Router...");
  const openRouterFree = await callOpenRouter("openrouter/free", query);
  if (openRouterFree) return { text: openRouterFree, source: "OpenRouter (Free Router)" };

  // CAPA 5: OpenRouter Nemotron 120B (Modelo libre de alta capacidad)
  console.log("🔵 [CAPA 5] Intentando OpenRouter Nemotron 120B...");
  const openRouterNemotron = await callOpenRouter("nvidia/nemotron-3-super-120b-a12b:free", query);
  if (openRouterNemotron) return { text: openRouterNemotron, source: "OpenRouter (Nemotron 120B Free)" };

  // CAPA 6: Groq (Llama 3.3 70B - Activo en producción cloud)
  console.log("🟡 [CAPA 6] Intentando Groq Llama 3.3 70B...");
  const groqResponse = await callGroq(query);
  if (groqResponse) return { text: groqResponse, source: "Groq (Llama 3.3 70B)" };

  // CAPA 7: DeepSeek (API Directa si hay saldo disponible)
  console.log("🔴 [CAPA 7] Intentando DeepSeek Directo...");
  const deepseekResponse = await callDeepSeek(query);
  if (deepseekResponse) return { text: deepseekResponse, source: "DeepSeek" };

  return null;
}

// ─── Handler principal ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let message: string;
  try {
    const body = await req.json();
    message = body.message;
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  console.log("\n🔵 Nueva consulta recibida:", message);

  // ── PASO 1: Clasificar la consulta ──────────────────────────────────────────
  const queryType = classifyQuery(message);
  let finalPrompt = message;
  let isWebSearch = false;
  let searchLabel = "";

  // ── PASO 2: Enriquecer el prompt o activar búsqueda ─────────────────────────
  if (queryType === "date_query") {
    const dateCtx = getCurrentDateContext();
    finalPrompt = buildEnrichedPrompt(message, null, dateCtx);
    console.log("📅 [Sistema] Fecha inyectada:", dateCtx);
    searchLabel = " *(fecha del servidor)*";
  } else if (queryType === "web_search") {
    isWebSearch = true;
    // Intentar Tavily si está disponible; si no, Gemini usará Google Search Grounding nativo
    const searchContext = await searchTavily(message);
    if (searchContext) {
      finalPrompt = buildEnrichedPrompt(message, searchContext);
      searchLabel = " *(con búsqueda web)*";
      console.log("✅ [Sistema] Prompt enriquecido con resultados de Tavily");
    } else {
      finalPrompt = buildEnrichedPrompt(message);
      console.log("🌐 [Sistema] Tavily no disponible, se activará Google Search Grounding nativo en Gemini.");
    }
  } else {
    finalPrompt = buildEnrichedPrompt(message);
  }

  // ── PASO 3: Ejecutar cascada de IAs ─────────────────────────────────────────
  const result = await callAICascade(finalPrompt, isWebSearch);

  if (result) {
    const label = searchLabel
      ? `\n\n*— vía ${result.source}${searchLabel}*`
      : `\n\n*— vía ${result.source}*`;
    return NextResponse.json({ text: result.text + label });
  }

  // Fallo total de todas las capas
  console.error("🔴 [ERROR] Todas las capas de IA fallaron.");
  return NextResponse.json(
    { error: "Todos los servicios de IA están temporalmente saturados. Por favor intenta de nuevo en unos momentos." },
    { status: 503 }
  );
}