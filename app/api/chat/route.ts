import { GoogleGenerativeAI, FunctionCallingTool, ToolFinder } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { GoogleSearchResults } from "google-search-results-nodejs";

const searchClient = new GoogleSearchResults(process.env.GOOGLE_SEARCH_API_KEY || "");

async function search(query: string) {
  return new Promise((resolve, reject) => {
    searchClient.json({
      q: query,
      google_domain: "google.com",
      hl: "en",
      gl: "us",
      num: 5, // Number of results
      api_key: process.env.GOOGLE_SEARCH_API_KEY,
      engine: "google",
      no_cache: true,
      safe: "active",
      lr: "lang_es", // Prefer Spanish results
      cx: process.env.GOOGLE_CSE_ID,
    }, (data: any) => {
      if (data.error) {
        reject(new Error(data.error));
      } else if (data.organic_results && data.organic_results.length > 0) {
        const results = data.organic_results.map((result: any) => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
        }));
        resolve(JSON.stringify(results));
      } else {
        resolve("No se encontraron resultados de búsqueda.");
      }
    });
  });
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

const toolFinder = new ToolFinder(tools);

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
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
      const toolResponse = await toolFinder.findAndCall(functionCall);
      result = await chat.sendMessage(toolResponse);
      response = result.response;
    }

    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error calling Gemini API or Search Tool:", error);
    return NextResponse.json(
      { error: "Internal Server Error or Search Tool Error" },
      { status: 500 }
    );
  }
}