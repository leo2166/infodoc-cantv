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
*   **Inteligencia Artificial:**
    *   **Google Gemini:** Implementación principal en `/api/chat`. Usa modelo `gemini-2.5-pro` (o similar) y búsqueda web.
    *   **OpenAI:** Referencias en `/api/chat-gemini` (posible código legado o mal nombrado).
    *   **DeepSeek:** Implementación alterna en `/api/chat-deepseek` (vía OpenRouter).
*   **Utilidades:** Generación de PDFs, gráficos (`recharts`).

## 🔑 Variables de Entorno Requeridas
El archivo `.env.local` debe crearse con las siguientes claves (ver `.env.local.example` creado):

| Variable | Descripción | Crítica |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Para el chat principal (`/api/chat`). | ✅ SÍ |
| `GOOGLE_SEARCH_API_KEY` | Para que el bot busque en internet. | ✅ SÍ |
| `GOOGLE_CSE_ID` | ID del buscador personalizado de Google. | ✅ SÍ |
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

## 🤖 Estado Actual: Prototipo Bootie (RAG)
Debido a bloqueos de red y validación de API, se está trabajando en un prototipo aislado: `c:\Users\lf\proyectos\bootie-dev`.

- **Estado:** Conexión exitosa a Gemini verificada.
- **Parche Crítico:** Se requiere forzar IPv4 en Node.js (`dns.setDefaultResultOrder('ipv4first')`) para conectar desde Venezuela con VPN.
- **Próximo Paso:** Cargar documentos en `bootie-dev/documents` y ejecutar `npm run ingest`.

---
*Para ver detalles específicos del prototipo, consultar `c:\Users\lf\proyectos\bootie-dev\BOOTIE_MEMORY.md`.*

