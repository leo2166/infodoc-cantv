import { GoogleGenerativeAI } from "@google/generative-ai";
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
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const QWEN_API_KEY_NUEVA = process.env.QWEN_API_KEY_NUEVA;

const SYSTEM_PROMPT = "Eres un asistente de Inteligencia Artificial avanzado. Responde siempre en Español, usando Markdown simple. Tu principal deber es proveer información exacta y actualizada. Cuando se te proporcione información obtenida de internet, úsala como fuente principal y cita las fuentes al final de tu respuesta.";

// --- Layer 1: Qwen (vía OpenRouter con Búsqueda Web) ---
async function callQwen(query: string) {
  if (!QWEN_API_KEY_NUEVA) {
    console.log("⚠️ [Qwen] API Key de Qwen (QWEN_API_KEY_NUEVA) no configurada");
    return null;
  }

  try {
    console.log("🚀 [Qwen] Intentando conexión con OpenRouter...");
    const openai = new OpenAI({
      apiKey: QWEN_API_KEY_NUEVA,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "qwen/qwen-plus",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || null;
    if (response) {
      console.log("✅ [Qwen] Respuesta exitosa");
    }
    return response;

  } catch (error: any) {
    console.error("❌ [Qwen] Error:", error.message || error);
    return null;
  }
}

// --- Layer 2: Groq (Llama 3) ---
async function callGroq(query: string) {
  if (!GROQ_API_KEY) {
    console.log("⚠️ [Groq] API Key no configurada");
    return null;
  }

  try {
    console.log("🚀 [Groq] Attempting connection...");
    const groq = new Groq({ apiKey: GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

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

// --- Layer 3: DeepSeek (API Directa) ---
async function callDeepSeek(query: string) {
  if (!DEEPSEEK_API_KEY) {
    console.log("⚠️ [DeepSeek] API Key no configurada");
    return null;
  }

  try {
    console.log("🚀 [DeepSeek] Connecting to DeepSeek API...");
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
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
      console.error("❌ [DeepSeek] Respuesta vacía");
      return null;
    }
  } catch (error: any) {
    console.error("❌ [DeepSeek] Error:", error.message || error);
    return null;
  }
}

// --- Layer 4: Gemini (Google AI) ---
async function callGemini(query: string) {
  if (!GOOGLE_API_KEY) {
    console.log("⚠️ [Gemini] API Key no configurada");
    return null;
  }

  try {
    console.log("🚀 [Gemini] Attempting connection...");
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${query}`);
    const response = await result.response;
    const text = response.text();

    if (text) {
      console.log("✅ [Gemini] Respuesta exitosa");
    }
    return text;

  } catch (error: any) {
    console.error("❌ [Gemini] Error:", error.message);
    return null;
  }
}

// ─── Función principal que llama a las IAs en cascada ────────────────────────
async function callAICascade(enrichedQuery: string): Promise<{ text: string; source: string } | null> {
  // CAPA 1: Qwen
  console.log("🔶 [CAPA 1] Intentando Qwen...");
  const qwenResponse = await callQwen(enrichedQuery);
  if (qwenResponse) return { text: qwenResponse, source: "Qwen" };

  // CAPA 2: DeepSeek
  console.log("🔷 [CAPA 2] Intentando DeepSeek...");
  const deepseekResponse = await callDeepSeek(enrichedQuery);
  if (deepseekResponse) return { text: deepseekResponse, source: "DeepSeek" };

  // CAPA 3: Groq
  console.log("🟡 [CAPA 3] Intentando Groq...");
  const groqResponse = await callGroq(enrichedQuery);
  if (groqResponse) return { text: groqResponse, source: "Groq (Llama 3)" };

  // CAPA 4: Gemini
  console.log("🟢 [CAPA 4] Intentando Gemini...");
  const geminiResponse = await callGemini(enrichedQuery);
  if (geminiResponse) return { text: geminiResponse, source: "Gemini" };

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

  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  console.log("\n🔵 Nueva consulta:", message);

  // ── PASO 1: Clasificar la consulta ──────────────────────────────────────────
  const queryType = classifyQuery(message);
  let enrichedPrompt: string;
  let searchLabel = "";

  // ── PASO 2: Enriquecer el prompt según el tipo de consulta ──────────────────
  if (queryType === "date_query") {
    // La fecha la resuelve el servidor directamente, sin internet
    const dateCtx = getCurrentDateContext();
    enrichedPrompt = buildEnrichedPrompt(message, null, dateCtx);
    console.log("📅 [Sistema] Fecha inyectada:", dateCtx);
    searchLabel = " *(fecha del servidor)*";

  } else if (queryType === "web_search") {
    // Buscar en Tavily y enriquecer el prompt con los resultados reales
    console.log("🌐 [Sistema] Iniciando búsqueda en Tavily...");
    const searchContext = await searchTavily(message);

    if (searchContext) {
      enrichedPrompt = buildEnrichedPrompt(message, searchContext);
      searchLabel = " *(con búsqueda web real)*";
      console.log("✅ [Sistema] Prompt enriquecido con resultados de Tavily");
    } else {
      // Tavily falló → responde igual pero sin contexto web
      enrichedPrompt = buildEnrichedPrompt(message);
      searchLabel = " *(búsqueda web falló, respuesta desde entrenamiento)*";
      console.warn("⚠️ [Sistema] Tavily falló. La IA responderá desde su entrenamiento.");
    }

  } else {
    // Conocimiento general: la IA responde directamente
    enrichedPrompt = buildEnrichedPrompt(message);
    searchLabel = "";
  }

  // ── PASO 3: Llamar a las IAs en cascada con el prompt enriquecido ───────────
  const result = await callAICascade(enrichedPrompt);

  if (result) {
    const label = searchLabel
      ? `\n\n*— vía ${result.source}${searchLabel}*`
      : `\n\n*— vía ${result.source}*`;
    return NextResponse.json({ text: result.text + label });
  }

  // Total Failure
  console.error("🔴 [ERROR] Todas las capas de IA fallaron");
  return NextResponse.json(
    { error: "Todos los servicios de IA están temporalmente ocupados. Por favor intenta más tarde." },
    { status: 503 }
  );
}