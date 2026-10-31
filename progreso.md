# 📋 InfoDoc CANTV — Registro de Progreso

> **INSTRUCCIÓN PARA EL AGENTE IA:** Al iniciar cualquier sesión de trabajo en este proyecto, leer este archivo COMPLETO antes de cualquier acción. Registrar TODOS los cambios realizados durante la sesión al final del documento bajo la sección correspondiente a la fecha.

---

## 🏢 ¿Qué es InfoDoc CANTV?

**InfoDoc** es una aplicación web informativa desarrollada con **Next.js 14** orientada a jubilados y personal activo de CANTV (empresa de telecomunicaciones venezolana). Su propósito es centralizar en un solo portal toda la información que necesitan los jubilados: nóminas, servicios de salud, trámites, beneficios, directorio de farmacias, emergencias médicas, biblioteca digital, y más.

El sistema también incluye un **chatbot de IA multicapa** (hasta 7 capas de respaldo) para responder preguntas frecuentes, y funciona como **PWA** (Progressive Web App) instalable en dispositivos móviles.

**URL de Producción:** Desplegado en Vercel (rama `main` → deploy automático)  
**Repositorio:** `https://github.com/leo2166/infodoc-cantv`  
**Ubicación Local:** `C:\Users\Lucidio\Proyectos\infodoc-cantv`

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| Next.js 14 (App Router) | Framework principal |
| TypeScript | Lenguaje |
| Tailwind CSS v4 + Shadcn/UI | Estilos y componentes |
| Vercel | Hosting y CI/CD |
| Google Gemini API | IA principal del chatbot |
| OpenRouter | IA de respaldo gratuita |
| Cloudflare R2 | Almacenamiento de archivos |

---

## 📁 Estructura de Rutas Principales

```
app/
├── page.tsx                    ← Pantalla principal / Home
├── informacion/
│   ├── fotos/                  ← Galería de información y documentos
│   ├── salud/                  ← Gerencia Servicios de Salud
│   │   ├── reembolsos/
│   │   ├── carta-aval/
│   │   ├── farmacantv/
│   │   └── citas-medicas/      ← NUEVO (31/10/2026)
│   ├── ghz/                    ← Gestión Humana Zulia
│   ├── atencion-jubilado/
│   ├── biblioteca/
│   ├── accionista/
│   └── ...
├── nomina/                     ← Cronograma de nóminas
├── farmacias/                  ← Directorio de farmacias (32+)
├── emergencias/
└── ...
components/
├── navigation.tsx
├── bootie-widget.tsx           ← Chatbot Bootie (COMENTADO - inactivo)
├── whatsapp-widget.tsx         ← Widget informativo WhatsApp (NUEVO 31/10/2026)
├── news-ticker.tsx
└── ...
```

---

## 📅 Historial de Cambios por Sesión

---

### Sesión: 31/10/2026

#### 🆕 Nueva página: Citas Médicas (`/informacion/salud/citas-medicas`)
- **Problema:** La tarjeta "Citas médicas" en la galería de Servicios de Salud apuntaba directamente a un archivo JPG estático (`/infodoc_citas_medicas.jpg`) en lugar de tener una página propia con la misma estructura de navegación que las demás tarjetas.
- **Solución:** Se creó `app/informacion/salud/citas-medicas/page.tsx` con:
  - La misma estructura visual que `carta-aval`, `reembolsos` y `farmacantv`.
  - Imagen optimizada en WebP (`/infodoc_citas_medicas.webp`).
  - Botón para descargar el PDF (`/Citas Medicas.pdf`).
  - **Navegación en 3 niveles:** Volver a Servicios de Salud → Volver a la Galería → Volver al Inicio.
- **Archivos modificados:**
  - `app/informacion/salud/page.tsx` (href corregido: `.jpg` → `/citas-medicas`)
  - `app/informacion/salud/citas-medicas/page.tsx` (**CREADO**)

#### 🔧 Estandarización de navegación en tarjetas de Salud
- **Problema:** Las páginas `reembolsos`, `carta-aval` y `farmacantv` solo tenían dos botones de navegación: "Volver a Servicios de Salud" y "Volver al Inicio". Faltaba el botón intermedio "Volver a la Galería".
- **Solución:** Se agregó el botón "Volver a la Galería" (`/informacion/fotos`) a las 3 páginas, dejando la barra de navegación consistente en toda la sección de Salud.
- **Archivos modificados:**
  - `app/informacion/salud/reembolsos/page.tsx`
  - `app/informacion/salud/carta-aval/page.tsx`
  - `app/informacion/salud/farmacantv/page.tsx`
- **Commit:** `3c01215`

#### 🔄 Reemplazo del chatbot Bootie por widget informativo de WhatsApp
- **Motivo:** El chatbot Bootie fue descontinuado de la pantalla principal temporalmente. En su lugar se solicitó mostrar información de contacto por WhatsApp de forma estática.
- **Cambios:**
  - `app/page.tsx`: Se comentó `<BootieWidget />` y su importación. Se agregó `<WhatsAppWidget />`.
  - `components/whatsapp-widget.tsx` (**CREADO**): Widget flotante fijo en esquina inferior derecha con:
    - Texto informativo: *"Escribe hola al 0412-1024405"* (número en verde WhatsApp).
    - Icono circular verde con logo oficial de WhatsApp.
    - **Elementos completamente estáticos, sin links ni redirecciones.**
    - Sin animaciones hover ni cursor pointer (solo informativo).
- **Commits:** `e41f8b7` (versión con link) → `6abf272` (versión estática definitiva)

#### ✅ Estado final de sesión
- Build de producción: ✅ Exitoso (42 páginas generadas estáticamente)
- Todos los cambios desplegados en producción vía Git push a `origin/main`
- Último commit: `6abf272`

---

### Sesiones anteriores (resumen de PROJECT_MEMORY.md)

| Fecha | Cambio |
|---|---|
| 20/01/2026 | Fix selector de tema en móvil (Radix UI + eventos táctiles) |
| 23/01/2026 | Fix chat DeepSeek + estrategia doble capa IA |
| 24/01/2026 | Arquitectura 4 capas de IA (DeepSeek→Gemini→OpenRouter→Local) |
| 26/01/2026 | Recuperación de emergencia de producción (git reset --hard) |
| 28/01/2026 | Integración del chatbot Bootie como widget flotante |
| 28/01/2026 | Sistema RAG, consistencia de chat, base de conocimientos JSON |
| 28/01/2026 | Panel admin `/admin/upload` para carga de documentos DOCX |
| 31/01/2026 | Fix bug `message` → `lastMessage` en Bootie + reorden capas IA |
| 04/02/2026 | Cintillo noticiero (news-ticker) + fix duplicación de layout |
| 08/02/2026 | Actualización nómina Feb-Mar-Abr 2026 en formato WebP |
| 03/06/2026 | Eliminación visualización nómina Mayo 2026 (obsoleta) |
| 27/09/2026 | Diagnóstico y restauración capas IA (Gemini 2.5/3.8 + OpenRouter Free) |
| 08/10/2026 | Agregadas 31 farmacias nuevas con soporte de doble número |

---

## 🔑 Variables de Entorno (`.env.local`)

| Variable | Descripción | Estado |
|---|---|---|
| `GEMINI_API_KEY` / `GOOGLE_API_KEY` | Chat principal | ✅ Activa |
| `OPENROUTER_API_KEY` | Respaldo gratuito IA | ✅ Activa |
| `GROQ_API_KEY` | Respaldo Llama | ⚠️ Bloqueo geográfico Venezuela |
| `DEEPSEEK_API_KEY` | DeepSeek | ⚠️ Sin saldo |
| `CLOUDFLARE_R2_*` | Almacenamiento archivos | ✅ Activa |

---

## 🚦 Estado del Proyecto

| Módulo | Estado |
|---|---|
| Pantalla principal | ✅ Operativa |
| Galería de documentos | ✅ Operativa |
| Servicios de Salud (4 subsecciones) | ✅ Operativas |
| Nómina | ✅ Operativa |
| Farmacias (32+ registros) | ✅ Operativa |
| Chatbot Bootie | 🔴 Comentado / Inactivo |
| Widget WhatsApp informativo | ✅ Activo (estático) |
| Chat IA principal | ✅ Operativo (multicapa) |
| PWA (instalable) | ✅ Operativa |
| Admin Upload docs | ✅ Operativo |
