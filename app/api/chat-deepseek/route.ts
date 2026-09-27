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
// Timeouts ajustados para Vercel: máx 5s por capa
function withTimeout<T>(promise: Promise<T>, ms: number = 5000): Promise<T> {
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

  // Si se pide búsqueda web, intentamos con grounding
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
      console.warn(`⚠️ [Gemini ${modelName}] Búsqueda web no disponible (${e.message}), continuando con generación directa...`);
    }
  }

  // Generación directa estándar
  try {
    console.log(`🚀 [Gemini] Intentando ${modelName} directo...`);
    const response = await withTimeout(ai.models.generateContent({
      model: modelName,
      contents: query,
      config: { 
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 600
      }
    }), 4500);

    const text = response.text;
    if (text) {
      console.log(`✅ [Gemini ${modelName}] Respuesta directa exitosa`);
      return { text, searchUsed: false };
    }
    return null;
  } catch (error: any) {
    console.error(`❌ [Gemini ${modelName}] Error:`, error.message || error);
    throw error;
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
    }), 4500);

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ [OpenRouter ${modelName}] HTTP ${res.status}:`, err.slice(0, 150));
      throw new Error(`HTTP ${res.status}: ${err.slice(0, 100)}`);
    }

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content || null;
    if (response) {
      console.log(`✅ [OpenRouter ${modelName}] Respuesta exitosa`);
    }
    return response;
  } catch (error: any) {
    console.error(`❌ [OpenRouter ${modelName}] Error:`, error.message || error);
    throw error;
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
    }), 4500);

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
    }), 4500);

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
async function callAICascade(
  query: string, 
  needsWebSearch: boolean,
  debugLogs: string[]
): Promise<{ text: string; source: string } | null> {

  // FASE 1 — Gemini 3.5 Flash Lite (Responde en 600ms, cuota activa)
  debugLogs.push("Intentando Gemini 3.5 Flash Lite...");
  try {
    const geminiLite = await callGemini("gemini-3.5-flash-lite", query, false);
    if (geminiLite) {
      return { text: geminiLite.text, source: "Gemini 3.5 Flash Lite" };
    }
    debugLogs.push("Gemini 3.5 Flash Lite devolvió null");
  } catch (e: any) {
    debugLogs.push(`Gemini 3.5 Flash Lite error: ${e.message}`);
  }

  // FASE 2 — Gemini 3.8 Flash (Última versión oficial de Google)
  debugLogs.push("Intentando Gemini 3.8 Flash...");
  try {
    const gemini38 = await callGemini("gemini-3.8-flash", query, needsWebSearch);
    if (gemini38) {
      const label = gemini38.searchUsed ? "Gemini 3.8 Flash (Búsqueda Web)" : "Gemini 3.8 Flash";
      return { text: gemini38.text, source: label };
    }
    debugLogs.push("Gemini 3.8 Flash devolvió null");
  } catch (e: any) {
    debugLogs.push(`Gemini 3.8 Flash error: ${e.message}`);
  }

  // FASE 3 — OpenRouter Free (Router gratuito: Nemotron / Qwen)
  debugLogs.push("Intentando OpenRouter Free...");
  try {
    const openRouterFree = await callOpenRouter("openrouter/free", query);
    if (openRouterFree) {
      return { text: openRouterFree, source: "OpenRouter (Free)" };
    }
    debugLogs.push("OpenRouter Free devolvió null");
  } catch (e: any) {
    debugLogs.push(`OpenRouter Free error: ${e.message}`);
  }

  // FASE 4 — Groq (Llama 3.3 70B)
  debugLogs.push("Intentando Groq Llama 3.3 70B...");
  try {
    const groqResponse = await callGroq(query);
    if (groqResponse) {
      return { text: groqResponse, source: "Groq (Llama 3.3 70B)" };
    }
    debugLogs.push("Groq devolvió null");
  } catch (e: any) {
    debugLogs.push(`Groq error: ${e.message}`);
  }

  // FASE 5 — DeepSeek como último recurso
  debugLogs.push("Intentando DeepSeek Directo...");
  try {
    const deepseekResponse = await callDeepSeek(query);
    if (deepseekResponse) {
      return { text: deepseekResponse, source: "DeepSeek" };
    }
    debugLogs.push("DeepSeek devolvió null");
  } catch (e: any) {
    debugLogs.push(`DeepSeek error: ${e.message}`);
  }

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
  const debugLogs: string[] = [];
  const result = await callAICascade(finalPrompt, isWebSearch, debugLogs);

  if (result) {
    const label = searchLabel
      ? `\n\n*— vía ${result.source}${searchLabel}*`
      : `\n\n*— vía ${result.source}*`;
    return NextResponse.json({ text: result.text + label });
  }

  // Fallo total de todas las capas
  console.error("🔴 [ERROR] Todas las capas de IA fallaron:", debugLogs);
  return NextResponse.json(
    { 
      error: "Todos los servicios de IA están temporalmente saturados. Por favor intenta de nuevo en unos momentos.",
      debug: debugLogs
    },
    { status: 503 }
  );
}

// ─── Endpoint de Diagnóstico Seguro (sin exponer secretos) ───────────────────
export async function GET() {
  return NextResponse.json({
    status: "online",
    activeModels: ["gemini-3.5-flash-lite", "gemini-3.8-flash", "openrouter/free", "groq", "deepseek"],
    keysConfigured: {
      GOOGLE_API_KEY: !!GOOGLE_API_KEY,
      OPENROUTER_API_KEY: !!OPENROUTER_API_KEY,
      GROQ_API_KEY: !!GROQ_API_KEY,
      DEEPSEEK_API_KEY: !!DEEPSEEK_API_KEY,
    }
  });
}