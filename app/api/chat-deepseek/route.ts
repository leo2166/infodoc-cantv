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
// Timeouts ajustados para Vercel (límite 10s total): máx 3-4s por capa
function withTimeout<T>(promise: Promise<T>, ms: number = 4000): Promise<T> {
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

  const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

  // Si se pide búsqueda web, intentamos con grounding (timeout reducido a 4s)
  if (useSearchGrounding) {
    try {
      console.log(`🚀 [Gemini] Intentando ${modelName} con Google Search Grounding...`);
      const response = await withTimeout(ai.models.generateContent({
        model: modelName,
        contents: query,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ googleSearch: {} }]
        }
      }), 4000);

      const text = response.text;
      if (text) {
        const searchUsed = !!(response.candidates?.[0]?.groundingMetadata?.webSearchQueries?.length);
        console.log(`✅ [Gemini ${modelName}] Respuesta exitosa con búsqueda web`);
        return { text, searchUsed };
      }
    } catch (e: any) {
      console.warn(`⚠️ [Gemini ${modelName}] Búsqueda web lenta o fallida (${e.message}), continuando con generación directa...`);
    }
  }

  // Generación directa estándar (timeout reducido a 4s para Vercel)
  try {
    console.log(`🚀 [Gemini] Intentando ${modelName} directo...`);
    const response = await withTimeout(ai.models.generateContent({
      model: modelName,
      contents: query,
      config: { 
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 500
      }
    }), 4000);

    const text = response.text;
    if (text) {
      console.log(`✅ [Gemini ${modelName}] Respuesta directa exitosa`);
      return { text, searchUsed: false };
    }
    return null;
  } catch (error: any) {
    console.error(`❌ [Gemini ${modelName}] Error:`, error.message || error);
    return null;
  }
}

// ─── Capas OpenRouter (Modelos Gratuitos vía Fetch Directo) ────────────────────
async function callOpenRouter(modelName: string, query: string): Promise<string | null> {
  if (!OPENROUTER_API_KEY) {
    console.log(`⚠️ [OpenRouter ${modelName}] API Key no configurada`);
    return null;
  }

  try {
    console.log(`🚀 [OpenRouter] Intentando modelo ${modelName}...`);
    const res = await withTimeout(fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://infodoc-cantv.vercel.app",
        "X-Title": "InfoDoc CANTV"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query }
        ],
        temperature: 0.4,
        max_tokens: 500
      })
    }), 4000);

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ [OpenRouter ${modelName}] HTTP ${res.status}:`, err.slice(0, 150));
      return null;
    }

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content || null;
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

// ─── Cascada de IA Resiliente — Optimizada para Vercel (10s límite) ─────────────
// Estrategia: timeout 4s por capa → máx 3 capas secuenciales = ~12s
// Las capas 1-3 corren en PARALELO para ganar velocidad
async function callAICascade(
  query: string, 
  needsWebSearch: boolean
): Promise<{ text: string; source: string } | null> {

  // FASE 1 — Carrera paralela entre los 3 modelos Gemini más rápidos
  // El primero que responde gana; los otros se cancelan con timeout
  console.log("⚡ [FASE 1] Carrera paralela Gemini (3.5 Lite + 2.5 + 2.0 Flash)...");
  const geminiRace = await Promise.any([
    callGemini("gemini-2.5-flash-lite-preview-06-17", query, false)
      .then(r => r ? { ...r, model: "Gemini 2.5 Flash Lite" } : Promise.reject("null")),
    callGemini("gemini-2.5-flash", query, needsWebSearch)
      .then(r => r ? { ...r, model: r.searchUsed ? "Gemini 2.5 Flash (Búsqueda Web)" : "Gemini 2.5 Flash" } : Promise.reject("null")),
    callGemini("gemini-2.0-flash", query, false)
      .then(r => r ? { ...r, model: "Gemini 2.0 Flash" } : Promise.reject("null")),
  ]).catch(() => null);

  if (geminiRace) {
    console.log(`✅ [FASE 1] Ganó: ${geminiRace.model}`);
    return { text: geminiRace.text, source: geminiRace.model };
  }

  // FASE 2 — OpenRouter como backup rápido
  console.log("🟣 [FASE 2] Intentando OpenRouter Free Router...");
  const openRouterFree = await callOpenRouter("openrouter/free", query);
  if (openRouterFree) return { text: openRouterFree, source: "OpenRouter (Free)" };

  // FASE 3 — DeepSeek como último recurso
  console.log("🔴 [FASE 3] Intentando DeepSeek Directo...");
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