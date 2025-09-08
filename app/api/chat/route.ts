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

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: tools,
      tool_config: {
        function_calling_config: {
          mode: "AUTO",
        },
      },
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

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error calling Gemini API or Search Tool:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}