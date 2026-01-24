# 🧠 Memoria del Proyecto: InfoDoc CANTV

Este documento reconstruye el contexto técnico y funcional del proyecto tras la recuperación del repositorio.

## 📋 Resumen del Proyecto
Aplicación web informativa ("InfoDoc") orientada a jubilados o personal de CANTV, con funcionalidades de chat inteligente e información de servicios.

**Estado Actual:** 🛠️ En desarrollo activo
**Ubicación:** `C:\Users\lf\proyectos\infodoc-cantv`

## 🛠️ Stack Tecnológico Detectado
*   **Framework:** Next.js 14 (App Router)
*   **Lenguaje:** TypeScript
*   **Estilos:** Tailwind CSS v4 + Shadcn/UI (Radix UI)
*   **Inteligencia Artificial (Arquitectura de 4 Capas):**
    1.  **DeepSeek:** Prioridad 1 (vía OpenRouter, requiere saldo).
    2.  **Google Gemini:** Prioridad 2 (vía API oficial, cuota gratuita diaria).
    3.  **OpenRouter (Gemma 3):** Prioridad 3 (Respaldo Gratuito Ilimitado).
    4.  **Local:** Fallback final (Búsqueda en JSON local).
*   **Utilidades:** Generación de PDFs, gráficos (`recharts`).

## 🔑 Variables de Entorno Requeridas
El archivo `.env.local` debe crearse con las siguientes claves (ver `.env.local.example` creado):

| Variable | Descripción | Crítica |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Para el chat principal (`/api/chat`). | ✅ SÍ |
| `GOOGLE_SEARCH_API_KEY` | Para que el bot busque en internet. | ✅ SÍ |
| `GOOGLE_CSE_ID` | ID del buscador personalizado de Google. | ✅ SÍ |
| `OPENROUTER_API_KEY` | Clave de OpenRouter para acceso a modelos gratuitos (Gemma 3). | ✅ SÍ |
| `OPENROUTER_MODEL` | Modelo a usar en OpenRouter (Ej: `google/gemma-3-27b-it:free`). | ✅ SÍ |
| `OPENAI_API_KEY` | Si se planea usar `/api/chat-gemini` (que parece usar GPT). | ⚠️ Opcional |
| `DEEPSEEK_API_KEY` | Si se planea usar `/api/chat-deepseek`. | ⚠️ Opcional |

## 📂 Estructura Clave
*   `app/api/chat/route.ts`: **Cerebro principal.** Maneja el chat con Gemini y llamadas a herramientas (Google Search).
*   `app/page.tsx`: Página de inicio.
*   `components/`: Componentes de UI reutilizables (Botones, Inputs, etc.).
*   `components/accessibility-toolbar.tsx`: Toolbar de accesibilidad con selector de tema.
*   `lib/`: Utilidades y librerías auxiliares.

## 🔧 Correcciones Recientes

### Selector de Tema en Móvil (20/01/2026)
**Problema:** El selector de tema (Claro/Oscuro/Sistema) no funcionaba en dispositivos móviles.

**Causa:** 
- El listener de eventos del toolbar de accesibilidad cerraba prematuramente el menú
- Radix UI renderiza el Select en un portal con atributo `data-radix-popper-content-wrapper`
- Solo se escuchaban eventos `mousedown`, no eventos táctiles

**Solución implementada en `components/accessibility-toolbar.tsx`:**
```typescript
// Exclusión de todos los contenedores de Radix UI
const isInRadixUI = 
  element.closest?.('[data-radix-portal]') ||
  element.closest?.('[data-radix-popper-content-wrapper]') ||
  element.closest?.('[role="listbox"]') ||
  element.closest?.('[role="option"]');

// Soporte para eventos táctiles
document.addEventListener("touchstart", handleClickOutside)
```

**Estado:** ✅ Resuelto y verificado en desktop y móvil.

### Arreglo del Chat InfoDoc (23/01/2026)
**Problema:** El chat interno (`/chat-deepseek`) fallaba por bloqueo de red y modelo incorrecto.
**Solución:**
- Se implementó estrategia **Doble Capa**: DeepSeek (Prioridad) -> Gemini (Respaldo).
- Se aplicó parche DNS IPv4 (`dns.setDefaultResultOrder('ipv4first')`) para red venezolana.
- Se configuró modelo `gemini-2.0-flash` (único disponible en la cuenta actual).
- Se configuró modelo `gemini-2.0-flash` (único disponible en la cuenta actual).
- **Nota:** Actualmente sufre de límites de cuota (Error 429), se restablece diariamente.

### Integración OpenRouter y Resiliencia (24/01/2026)
**Problema:** Fallo total de IAs (DeepSeek sin saldo, Gemini sin cuota).
**Solución:**
- Se implementó arquitectura de **4 Capas** en `/api/chat`:
    1. DeepSeek (Mejor calidad, requiere $)
    2. Gemini (Buena calidad, cuota diaria)
    3. **OpenRouter** (Respaldo gratuito con `google/gemma-3-27b-it:free`)
    4. Local (Base de conocimientos cruda)
- Se verificó conectividad con scripts de prueba (`test-openrouter-best.js`).
- El sistema ahora es resiliente a fallos de cuota y red.

## 🤖 Estado Actual: Prototipo Bootie (RAG) v1.1
Debido a bloqueos de red y validación de API, se está trabajando en un prototipo aislado: `c:\Users\lf\proyectos\bootie-dev`.

- **Estado:** ✅ Producción (v1.1)
- **Diferenciación de Proyectos:**
    - **Bootie**: Proyecto independiente/futuro ("burbuja").
    - **InfoDoc Chat**: Chat interno actual de la webapp (`/chat-deepseek`), separado de Bootie.
- **Mejoras Clave (21/01/2026):**
  - **RAG Optimizado**: Documentos en Markdown limpio (sin HTML), tablas formateadas.
  - **Chatbot Rendering**: Se reemplazó `dangerouslySetInnerHTML` por `react-markdown` para evitar inyección de HTML y errores de visualización.
  - **Resiliencia**: Arquitectura de 3 capas (DeepSeek -> Gemini -> Local).
  - **Identidad**: Prompt maestro con reglas de tono y precisión.
- **Parche Crítico:** Se requiere forzar IPv4 en Node.js (`dns.setDefaultResultOrder('ipv4first')`) para conectar desde Venezuela con VPN.
- **Workflow:** 
  1. `npm run convert` (DOCX -> MD)
  2. `npm run ingest` (MD -> JSON)

---
*Para ver detalles técnicos profundos, consultar `c:\Users\lf\proyectos\bootie-dev\BOOTIE_MEMORY.md`.*


## 📜 Reglas de Usuario
*   **Idioma:** Siempre usar **ESPAÑOL** para la comunicación y documentación.
