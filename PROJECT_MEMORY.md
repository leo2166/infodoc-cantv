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



## 🚨 Incidencia y Recuperación (26/01/2026)
**Evento:** Regresión accidental de producción (se sobrescribió versión estable con una versión antigua/rota).
**Solución de Emergencia:**
1.  **Identificación:** Se localizó commit estable del Sábado 24/01 5:13 PM (`5cf0ddd` / `b38b827`).
2.  **Restauración:** `git reset --hard` + limpieza de secretos en historial + `git push --force`.
3.  **Resultado:** Producción restaurada y funcional con las 3 capas de IA activas.
4.  **Respaldo de Seguridad:** Se creó la carpeta `back_security_version` con el snapshot exacto de los archivos fuente que "salvaron la vida" del proyecto.

---
**Versión Estable (Snapshot):** `b38b827`
**Ubicación de Respaldo:** `c:\Users\lf\proyectos\infodoc-cantv\back_security_version`

## 🤖 Integración de Bootie (28/01/2026)

### Arquitectura Implementada
Bootie se integró como un **widget flotante independiente** que aparece solo en la página principal (`/`).

**Decisión Técnica:** Se optó por **Opción C (Integración de Componentes)** en lugar de copiar la carpeta completa de bootie-dev, para evitar:
- Conflictos de 2 proyectos Next.js anidados
- Duplicación de node_modules (+400MB)
- Complejidad de mantenimiento

### Archivos Creados/Modificados
| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `components/bootie-widget.tsx` | Modificado | Añadido `usePathname()` para solo mostrar en `/`, endpoint cambiado a `/api/bootie` |
| `app/api/bootie/route.ts` | **Nuevo** | API de 6 capas de IA separada del chat principal |
| `app/layout.tsx` | Modificado | Añadido `<BootieWidget />` al layout |

### Sistema de 6 Capas de Bootie
```
CAPA 1: Gemini 2.5 Flash (Principal)
CAPA 2: Groq Llama 3.1 8B (Ultra rápido)
CAPA 3: Groq Llama 3.3 70B (Más inteligente)
CAPA 4: Gemma 3 27B (OpenRouter)
CAPA 5: Gemini 2.0 Flash (Respaldo)
CAPA 6: Procesador Local (Nunca falla)
```

### Respaldos de Seguridad Creados
- **Rama Git:** `backup-pre-bootie-integration-2026-01-28`
- **Tag Git:** `v1.0-pre-bootie`
- **Carpeta:** `backup_28_ene_2026/`

### Variables de Entorno Requeridas
| Variable | Capa | Estado |
|----------|------|--------|
| `GOOGLE_API_KEY` o `GEMINI_API_KEY` | 1 y 5 | ✅ Requerida |
| `GROQ_API_KEY` | 2 y 3 | ✅ Requerida |
| `OPENROUTER_API_KEY` | 4 | ⚠️ Opcional |

### Estado
- ✅ Build exitoso (`npm run build`)
- ✅ Widget solo visible en `/`
- ✅ APIs separadas (`/api/chat` vs `/api/bootie`)
- ✅ Bug de variable `message` corregido (31/01/2026)
- ✅ Capas de IA reordenadas por inteligencia (31/01/2026)
- 🔄 Pendiente: Prueba en servidor local y deploy a Vercel

## 🎯 Optimización de Capas de IA en Bootie (31/01/2026)
**Problema Reportado:** Respuestas inconsistentes sobre fechas de pago, algunas con errores, otras correctas con formato negrita.

**Causas Identificadas:**
1. **Bug Crítico:** Variable `message` undefined en línea 247 de `/api/bootie/route.ts` causaba que Gemini 2.5 Flash (Capa 1) fallara siempre.
2. **Orden Subóptimo:** Llama 3.1 8B (rápido pero impreciso) estaba en Capa 2, antes que modelos más inteligentes.

**Soluciones Implementadas:**
1. ✅ Corregido bug: `message` → `lastMessage` 
2. ✅ Reordenadas capas priorizando **INTELIGENCIA sobre VELOCIDAD**

**Nuevo Orden de Capas:**
```
CAPA 1: Gemini 2.5 Flash (Principal - Google, excelente calidad)
CAPA 2: Groq Llama 3.3 70B (MÁS INTELIGENTE - 70B parámetros)
CAPA 3: Gemma 3 27B (Inteligente - 27B parámetros)
CAPA 4: Gemini 2.0 Flash (Respaldo Google)
CAPA 5: Groq Llama 3.1 8B (Rápido - último respaldo IA)
CAPA 6: Procesador Local (Fallback final)
```

**Archivos Modificados:**
- `app/api/bootie/route.ts` (endpoint principal con historial)
- `app/api/chat-bootie/route.ts` (endpoint legacy)

**Resultado Esperado:** Respuestas más precisas, consistentes y con mejor formato markdown (negrita, listas).

## 🐛 Corrección de Consistencia del Chat (28/01/2026 - Tarde)
**Problema:** El usuario reportó respuestas inconsistentes (ej: números de jubilados en lugar de RRHH) y pérdida de contexto.
**Causas:**
1.  **API Stateless:** El chat no recordaba mensajes anteriores, impidiendo preguntas de seguimiento.
2.  **Keywords Débiles:** La hoja de "Emergencia/RRHH" no tenía palabras clave como "gestión" o "humana", confiando solo en búsquedas genéricas que fallaban.

**Solución Implementada:**
-   **Frontend:** `bootie-widget.tsx` actualizado para enviar el historial completo de mensajes.
-   **Backend:** `route.ts` modificado para:
    -   Usar solo el **último mensaje** para la búsqueda RAG (evita contaminación de contexto).
    -   Pasar el **historial completo** a la IA (permite conversación fluida).
-   **Datos:** Se corrigió `knowledge-base.json` agregando keywords explícitas (`gestion`, `humana`, `rrhh`).

## 🚀 Automatización de Carga de Documentos (28/01/2026 - Noche)
**Objetivo:** Permitir al usuario subir archivos Word (`.docx`) y actualizar la base de conocimientos sin tocar código.

**Implementación:**
-   **Nueva Ruta Admin:** `/admin/upload` (Interfaz Drag & Drop).
-   **Backend:** `/api/admin/upload`
    1.  Recibe el archivo y lo guarda en `raw_docs`.
    2.  Usa librería `mammoth` para convertir a Markdown limpio.

## 📢 Cintillo Informativo Noticiero y Ajustes UI (04/02/2026)
**Objetivo:** Mostrar mensaje importante "Fe de Vida" de forma llamativa (scroll horizontal) y resolver conflictos de UI.

**Implementación Tecnológica:**
- **Nuevo Componente:** `components/news-ticker.tsx` (CSS puro para animaciones performantes).
- **Características:**
    - Loop infinito perfecto con CSS `@keyframes`.
    - Pausa al hacer hover.
    - Responsive: Texto 16px (móvil) / 18px (desktop).
    - Velocidad optimizada para adultos mayores (38 segundos).

**Resolución de Conflicto UI (Botón Accesibilidad):**
**Problema:** El botón de accesibilidad flotante (`top-20 right-4`) tapaba el cintillo en móviles y daba problemas de diseño en desktop.
**Solución Definitiva:**
    - Se eliminó el botón flotante de `RootLayout`.
    - Se integró `AccessibilityToolbar` dentro de `Navigation` (`components/navigation.tsx`).
    - **Resultado:** El botón ahora vive dentro de la barra de navegación (junto al menú en móvil, a la derecha en desktop), alineado y sin solapamientos.

**Archivos Clave Modificados:**
- `app/page.tsx`: Inserción del cintillo en Hero Section.
- `components/navigation.tsx`: Inclusión del botón de accesibilidad.
- `components/news-ticker.tsx`: Lógica de animación.

**Tag de Seguridad:** `v1.1-pre-news-ticker`

## 🐛 Corrección de Duplicación de Páginas (04/02/2026)
**Problema Crítico:** Todas las páginas se duplicaban al hacer scroll, tanto en desktop como móvil.
**Causa Raíz:** El archivo `app/layout.tsx` tenía el contenedor `{children}` duplicado en las líneas 101-102.
**Impacto:** 
- Renderizado doble de todo el contenido
- IDs HTML duplicados (`main-content`)
- Problemas de accesibilidad
- Posible impacto negativo en SEO

**Solución Implementada:**
- Eliminada la línea duplicada `<div id="main-content">{children}</div>` en `app/layout.tsx` (línea 102).
- Commit: `6753d22` - "Fix: Eliminar duplicación de contenido en layout.tsx"
- Desplegado a producción vía Git push automático a Vercel.

**Archivos Modificados:**
- `app/layout.tsx`: Corrección de duplicación de contenedor principal.

**Estado:** ✅ Corregido y desplegado en producción

## 📅 Actualización de Nómina CANTV (08/02/2026)
**Objetivo:** Actualizar la sección de nómina para mostrar los cronogramas de febrero, marzo y abril 2026, convirtiendo las imágenes a formato WebP para optimizar el rendimiento.

**Cambios Implementados:**
1. **Conversión a WebP:** Se convirtieron 3 imágenes PNG a formato WebP (calidad 85%) usando la librería `sharp`:
   - `2.png` → `febrero.webp`
   - `Nomina Marzo 2026.png` → `marzo.webp`
   - `Nomina Abril 2026.png` → `abril.webp`

2. **Actualización de Página:** Se modificó `app/nomina/page.tsx` para:
   - Mostrar 3 meses (antes solo 2)
   - Orden ascendente: Febrero → Marzo → Abril
   - Actualizado título a "Nómina Cantv 2026"
   - Mejorados textos alt para accesibilidad

3. **Limpieza de Archivos:** Se eliminaron archivos obsoletos:
   - Imágenes de enero: `1.png`, `enero_2026.png`, `nomina01_01_2026.png`
   - Archivos antiguos: `1.webp`, `2.webp`
   - PNG originales convertidos

**Archivos Creados:**
- `scripts/convert-to-webp.js`: Script de conversión reutilizable para futuros meses
- `public/febrero.webp`, `public/marzo.webp`, `public/abril.webp`

**Archivos Modificados:**
- `app/nomina/page.tsx`: Actualización de componente para 3 meses

**Beneficios:**
- ⚡ Mayor velocidad de carga (WebP reduce tamaño 25-35% vs PNG)
- 🗂️ Mejor organización (orden cronológico ascendente)
- ♿ Mejor accesibilidad (textos alt descriptivos)

**Commit:** `cb52d93` - "feat: Update nomina section with Feb-Apr 2026 calendars in WebP format"
**Estado:** ✅ Desplegado y verificado en producción

## 📅 Actualización de Visualización de Nómina (03/06/2026)
**Objetivo:** Mantener la sección de nómina actualizada eliminando la información obsoleta del mes anterior.

**Cambios Implementados:**
1. **Limpieza de Interfaz:** Se eliminó el componente de imagen correspondiente al cronograma de Mayo 2026 en `app/nomina/page.tsx`.
2. **Preservación de Datos:** El archivo de imagen `/Mayo_2026_act.png` se mantiene en el servidor para fines de archivo, eliminando únicamente su referencia visual.

**Commit:** `92ccb6b` - "fix(nomina): eliminar visualización del cronograma de mayo 2026"
**Estado:** ✅ Desplegado y verificado en producción
