import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import dns from 'node:dns';

// Forzar IPv4 para evitar problemas con VPN/CANTV
dns.setDefaultResultOrder('ipv4first');

// Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// --- Layer 1: Groq (Llama 3) ---
async function callGroq(query: string) {
  if (!GROQ_API_KEY) {
    console.log("⚠️ [Groq] API Key no configurada");
    return null;
  }

  try {
    console.log("🚀 [Groq] Attempting connection...");
    const groq = new Groq({ apiKey: GROQ_API_KEY });

    // Usamos Llama 3.3 70B Versatile (actualizado - reemplazo del 3.1)
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Eres Bootie, un asistente de IA útil y directo para jubilados de CANTV. Responde siempre en Español, usando Markdown simple." },
        { role: "user", content: query }
      ],
      model: "llama-3.3-70b-versatile", // Modelo actualizado
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

// --- Layer 2: DeepSeek (API Directa) ---
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
          { role: "system", content: "Eres Bootie, un asistente de IA útil y directo para jubilados de CANTV. Responde siempre en Español, usando Markdown simple." },
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

// --- Layer 3: Gemini (Google AI) ---
async function callGemini(query: string) {
  if (!GOOGLE_API_KEY) {
    console.log("⚠️ [Gemini] API Key no configurada");
    return null;
  }

  try {
    console.log("🚀 [Gemini] Attempting connection...");
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    // Usamos 'gemini-2.0-flash' (Validado: único disponible por ahora)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemInstruction = "Eres Bootie, un asistente de IA útil para jubilados de CANTV. Responde en Markdown y se amable.";
    const result = await model.generateContent(`${systemInstruction}\n\nUser: ${query}`);
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

export async function POST(req: NextRequest) {
  let message;
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

  // CAPA 1: Try Groq (Llama 3) first
  console.log("🔷 [CAPA 1] Intentando Groq...");
  const groqResponse = await callGroq(message);
  if (groqResponse) {
    return NextResponse.json({ text: groqResponse + "\n\n*— vía Groq (Llama 3)*" });
  }

  // CAPA 2: Fallback to DeepSeek
  console.log("🔶 [CAPA 2] Groq falló, intentando DeepSeek...");
  const deepseekResponse = await callDeepSeek(message);
  if (deepseekResponse) {
    return NextResponse.json({ text: deepseekResponse + "\n\n*— vía DeepSeek*" });
  }

  // CAPA 3: Fallback to Gemini
  console.log("🟡 [CAPA 3] DeepSeek falló, intentando Gemini...");
  const geminiResponse = await callGemini(message);
  if (geminiResponse) {
    return NextResponse.json({ text: geminiResponse + "\n\n*— vía Gemini Flash*" });
  }

  // Total Failure
  console.error("🔴 [ERROR] Todas las capas de IA fallaron");
  return NextResponse.json(
    { error: "Todos los servicios de IA están temporalmente ocupados. Por favor intenta más tarde." },
    { status: 503 }
  );
}