import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const MAX_RETRIES = 5;

  // The user has placed their OpenRouter key in this environment variable.
  const openRouterApiKey = process.env.DEEPSEEK_API_KEY;

  if (!openRouterApiKey) {
    return NextResponse.json(
      { error: "API key not configured. Please set DEEPSEEK_API_KEY in your environment variables." },
      { status: 500 }
    );
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openRouterApiKey}`,
          "HTTP-Referer": "https://infodoc-cantv.vercel.app", // Recommended by OpenRouter
          "X-Title": "InfoDoc CANTV", // Recommended by OpenRouter
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat", // Using OpenRouter's model identifier
          messages: [
            { role: "system", content: "Eres un asistente de IA para jubilados de CANTV. Tu objetivo es proporcionar respuestas claras, concisas y útiles." },
            { role: "user", content: message },
          ],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        // Check for rate limit status code (429)
        if (response.status === 429) {
          throw new Error("Rate limit exceeded");
        }
        throw new Error(errorBody.error?.message || "Failed to fetch response from OpenRouter");
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "No se pudo obtener una respuesta.";

      return NextResponse.json({ text });

    } catch (error: any) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      const isRateLimitError = error.message?.includes("Rate limit exceeded");

      if (isRateLimitError && attempt < MAX_RETRIES - 1) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000; // Exponential backoff with jitter
        console.log(`Rate limit hit. Retrying in ${delay.toFixed(0)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        return NextResponse.json(
          { error: `Internal Server Error: ${error.message}` },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json(
    { error: "Internal Server Error: All retry attempts failed." },
    { status: 500 }
  );
}