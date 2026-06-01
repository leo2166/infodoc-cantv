/**
 * query-classifier.ts
 * Detector inteligente que decide si una pregunta necesita búsqueda web
 * o puede responderse directamente con el conocimiento del modelo de IA.
 */

// ─── Patrones que SÍ necesitan búsqueda web ───────────────────────────────────
const WEB_SEARCH_PATTERNS = [
  // Datos corporativos / empresariales verificables
  /\b(rif|nit|registro|ruc)\b/i,
  /\b(tel[eé]fono|n[uú]mero de contacto|n[uú]mero de tel|c[oó]mo llamo?|llamar a)\b/i,
  /\b(direcci[oó]n|sede|oficina|sucursal|ubicaci[oó]n)\b/i,
  /\b(correo|email|contacto|atencion al cliente)\b/i,

  // Precios y tarifas actuales
  /\b(precio|tarifa|costo|cuanto cuesta|cu[aá]nto vale|valor)\b/i,
  /\b(plan|planes|oferta|ofertas|paquete|paquetes)\b/i,

  // Personas y cargos actuales
  /\b(qui[eé]n es|quien dirige|presidente|director|gerente|ministro|ceo|jefe)\b/i,
  /\b(nombr[ao]|designa[do]|cargo actual|actualmente)\b/i,

  // Noticias y eventos recientes
  /\b(noticias?|noticia de hoy|[uú]ltimas noticias|qu[eé] pas[oó]|qu[eé] ha pasado)\b/i,
  /\b(hoy|ayer|esta semana|este mes|reciente|[uú]ltimo|nuevo|nueva)\b/i,
  /\b(acontecimiento|evento|suceso)\b/i,

  // URLs / sitios web
  /\b(p[aá]gina web|sitio web?|portal|url|link|enlace|direcci[oó]n web)\b/i,
  /\b(www\.|\.com|\.ve|\.net|\.org)\b/i,

  // Verificación de datos específicos
  /\b(cu[aá]l es el|cu[aá]les son los|d[oó]nde queda|d[oó]nde est[aá])\b/i,
  /\b(verificar|comprobar|confirmar|buscar informaci[oó]n)\b/i,

  // Estado de servicios
  /\b(servicio|corte|falla|inter|averia|funciona|disponible|estado del)\b/i,
];

// ─── Patrones de FECHA/HORA (el servidor los resuelve directamente) ───────────
const DATE_PATTERNS = [
  /\b(qu[eé] fecha|cu[aá]l es la fecha|hoy es|d[ií]a de hoy)\b/i,
  /\b(qu[eé] hora|cu[aá]l es la hora|hora actual|hora en)\b/i,
  /\b(qu[eé] d[ií]a es hoy|d[ií]a hoy|fecha de hoy)\b/i,
];

// ─── Tipos de consulta ────────────────────────────────────────────────────────
export type QueryType = "web_search" | "date_query" | "direct_ai";

/**
 * Analiza la pregunta y determina qué tipo de respuesta necesita.
 */
export function classifyQuery(query: string): QueryType {
  // 1. ¿Pregunta por fecha/hora? → El servidor lo resuelve
  for (const pattern of DATE_PATTERNS) {
    if (pattern.test(query)) {
      console.log("📅 [Classifier] Tipo: Fecha/Hora → el servidor responde directo");
      return "date_query";
    }
  }

  // 2. ¿Necesita datos actuales verificables? → Buscar en Tavily
  for (const pattern of WEB_SEARCH_PATTERNS) {
    if (pattern.test(query)) {
      console.log(`🌐 [Classifier] Tipo: Búsqueda web necesaria (patrón: ${pattern})`);
      return "web_search";
    }
  }

  // 3. Conocimiento general, recetas, conversación → IA directa
  console.log("🧠 [Classifier] Tipo: IA directa (conocimiento general)");
  return "direct_ai";
}

/**
 * Retorna la fecha y hora actual de Venezuela formateada.
 */
export function getCurrentDateContext(): string {
  const now = new Date();
  const fechaLarga = now.toLocaleDateString('es-VE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Caracas',
  });
  const hora = now.toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Caracas',
  });

  return `Hoy es ${fechaLarga} y la hora actual en Venezuela es ${hora}.`;
}

/**
 * Construye el prompt enriquecido para enviar a la IA.
 * - Si hay contexto de búsqueda web, lo prepende a la pregunta.
 * - Si hay contexto de fecha, lo incluye como nota informativa.
 */
export function buildEnrichedPrompt(
  query: string,
  searchContext?: string | null,
  dateContext?: string | null
): string {
  const parts: string[] = [];

  if (dateContext) {
    parts.push(`[CONTEXTO DE FECHA: ${dateContext}]`);
  }

  if (searchContext) {
    parts.push(searchContext);
  }

  parts.push(query);

  return parts.join("\n\n");
}
