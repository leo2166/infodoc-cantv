/**
 * tavily-search.ts
 * Módulo de búsqueda web real usando Tavily AI Search API.
 * Tavily está diseñado específicamente para IA: devuelve texto limpio,
 * no HTML crudo, ideal para inyectar en prompts.
 */

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_API_URL = "https://api.tavily.com/search";

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilySearchResponse {
  answer: string;         // Resumen generado por Tavily
  results: TavilyResult[]; // Resultados individuales con fuentes
  query: string;
}

/**
 * Busca en internet usando Tavily y devuelve un contexto
 * listo para inyectar en el prompt de la IA.
 * Retorna null si la búsqueda falla o no está configurada.
 */
export async function searchTavily(query: string): Promise<string | null> {
  if (!TAVILY_API_KEY) {
    console.warn("⚠️ [Tavily] TAVILY_API_KEY no configurada. Saltando búsqueda web.");
    return null;
  }

  try {
    console.log(`🔍 [Tavily] Buscando en internet: "${query}"`);

    const response = await fetch(TAVILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query: query,
        search_depth: "basic",   // "basic" = rápido, "advanced" = más preciso
        include_answer: true,    // Tavily genera un resumen automático
        include_raw_content: false,
        max_results: 4,          // 4 resultados es suficiente para el contexto
        include_domains: [],
        exclude_domains: [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [Tavily] Error HTTP ${response.status}: ${errorText}`);
      return null;
    }

    const data: TavilySearchResponse = await response.json();

    // Construir el contexto para inyectar al prompt
    let context = `📡 INFORMACIÓN OBTENIDA DE INTERNET (${new Date().toLocaleDateString('es-VE', { timeZone: 'America/Caracas' })}):\n\n`;

    // Incluir el resumen de Tavily si existe
    if (data.answer) {
      context += `Resumen: ${data.answer}\n\n`;
    }

    // Incluir los resultados individuales con sus fuentes
    if (data.results && data.results.length > 0) {
      context += "Fuentes consultadas:\n";
      data.results.slice(0, 3).forEach((result, index) => {
        context += `\n[${index + 1}] ${result.title}\n`;
        context += `Fuente: ${result.url}\n`;
        context += `Contenido: ${result.content.slice(0, 500)}...\n`; // Limitamos a 500 chars por resultado
      });
    }

    context += "\n---\nBasándote ÚNICAMENTE en la información anterior, responde la siguiente pregunta del usuario:";

    console.log(`✅ [Tavily] Búsqueda exitosa. ${data.results?.length ?? 0} resultados encontrados.`);
    return context;

  } catch (error: any) {
    console.error("❌ [Tavily] Error de conexión:", error.message || error);
    return null;
  }
}
