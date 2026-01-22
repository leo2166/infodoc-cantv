import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let message;
  try {
    const body = await req.json();
    message = body.message;
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY not configured." },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Usamos gemini-1.5-flash que es rápido y gratuito
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemInstruction = "Eres un asistente de IA para jubilados de CANTV. Tu objetivo es ser claro, útil y directo. \n\nIMPORTANTE:\n1. Responde SIEMPRE en formato MARKDOWN.\n2. Usa negritas, listas y tablas para organizar la información.\n3. NO generes código HTML.\n4. Mantén un tono respetuoso y profesional.\n5. SALUDO: Si el input del usuario es un saludo simple (como 'Hola', 'Buenos días'), responde ÚNICAMENTE con: 'Hola, Soy tu asistente de IA, diseñado para ayudar con cualquier pregunta o información que necesiten. Mi objetivo es ser claro, útil y directo para ti.'";

    // Gemini no soporta "system" role en chatSession de la misma manera que OpenAI en versiones viejas, 
    // pero podemos concatenarlo o usar systemInstruction si el modelo lo permite.
    // Para simplificar, lo enviamos como parte del prompt o usamos la API de chat con systemInstruction.

    // O mejor, enviamos un prompt simple con el contexto.
    const fullPrompt = `${systemInstruction}\n\nPregunta del usuario: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Error in Gemini API:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}