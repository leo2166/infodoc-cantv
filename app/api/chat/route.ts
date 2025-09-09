import { GoogleGenerativeAI, FunctionCallingTool } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

async function search(query: string) {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cseId = process.env.GOOGLE_CSE_ID;

  if (!apiKey || !cseId) {
    throw new Error("Google Search API keys not configured.");
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(query)}&num=5&safe=active&lr=lang_es`;

  console.log("Attempting to call Google Custom Search API...");
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("Error from Google Custom Search API:", data.error);
      throw new Error(data.error.message);
    } else if (data.items && data.items.length > 0) {
      console.log("Successfully received data from Google Custom Search API.");
      const results = data.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }));
      return JSON.stringify(results);
    } else {
      return "No se encontraron resultados de búsqueda.";
    }
  } catch (error: any) {
    console.error("Error calling Google Custom Search API:", error);
    return `Error al realizar la búsqueda: ${error.message}`;
  }
}

const tools: FunctionCallingTool[] = [
  {
    function_declarations: [
      {
        name: "search",
        description: "Busca información en la web sobre un tema específico. Útil para preguntas sobre eventos actuales, hechos recientes, o información que no esté en el conocimiento general del modelo.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "La consulta de búsqueda para la web.",
            },
          },
          required: ["query"],
        },
      },
    ],
  },
];

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const MAX_RETRIES = 5;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro",
        tools: tools,
        tool_config: {
          function_calling_config: {
            mode: "AUTO",
          },
        },
        systemInstruction: "Eres un asistente de IA para jubilados de CANTV. Tu objetivo es proporcionar respuestas claras, concisas y útiles. Siempre que la pregunta del usuario requiera información que no conoces o datos actuales, DEBES usar la herramienta de búsqueda ('search') para encontrar la información más reciente en la web. Si la pregunta implica generar contenido estructurado como listas, comparaciones o menús, DEBES formatear tu respuesta usando tablas en formato Markdown. Si no se proporcionan preferencias específicas para una solicitud, genera un ejemplo genérico o una plantilla utilizando la búsqueda. Sé proactivo en el uso de la búsqueda y las tablas para dar la mejor respuesta posible.",
      });

      let chat = model.startChat();
      let result = await chat.sendMessage(message);
      let response = result.response;

      // Handle function calls
      while (response.function_calls && response.function_calls.length > 0) {
        const functionCall = response.function_calls[0];
        const toolName = functionCall.name;
        const toolArgs = functionCall.args;

        let toolResponse;
        if (toolName === "search") {
          toolResponse = await search(toolArgs.query);
        } else {
          throw new Error(`Herramienta no reconocida: ${toolName}`);
        }

        result = await chat.sendMessage({
          function_response: {
            name: toolName,
            response: toolResponse,
          },
        });
        response = result.response;
      }

      const text = response.text();

      // Success, return the response
      return NextResponse.json({ text });

    } catch (error: any) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      // Check if it's a rate limit error (often status 429)
      const isRateLimitError = error.message?.includes("429") || error.message?.includes("rate limit");

      if (isRate-limit-error && attempt < MAX_RETRIES - 1) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000; // Exponential backoff with jitter
        console.log(`Rate limit hit. Retrying in ${delay.toFixed(0)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Not a rate limit error or last attempt, so fail
        return NextResponse.json(
          { error: `Internal Server Error: ${error.message}` },
          { status: 500 }
        );
      }
    }
  }

  // This part is reached only if all retries fail
  return NextResponse.json(
    { error: "Internal Server Error: All retry attempts failed." },
    { status: 500 }
  );
}