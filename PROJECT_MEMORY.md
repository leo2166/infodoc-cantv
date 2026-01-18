# 🧠 Memoria del Proyecto: InfoDoc CANTV

Este documento reconstruye el contexto técnico y funcional del proyecto tras la recuperación del repositorio.

## 📋 Resumen del Proyecto
Aplicación web informativa ("InfoDoc") orientada a jubilados o personal de CANTV, con funcionalidades de chat inteligente e información de servicios.

**Estado Actual:** 🛠️ En desarrollo / Recuperación
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
*   `lib/`: Utilidades y librerías auxiliares.

## 📝 Notas de Recuperación
*   Se detectaron implementaciones de chat duplicadas o de prueba (`chat-gemini`, `chat-ia`, `chat-deepseek`). Se recomienda consolidar en una sola si es posible.
*   Dependencias instaladas y actualizadas.
*   Es necesario verificar las claves API para restaurar la funcionalidad completa.
