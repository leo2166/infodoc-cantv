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

### Sesión: 03/11/2026

#### 📅 Actualización de cronograma de Nómina Noviembre 2026
- **Motivo:** El usuario entregó una nueva imagen PNG con el cronograma de pago de noviembre 2026 actualizado.
- **Imagen recibida:** `public/nomina 03112026.png` (258 KB, 1999x1545 px).
- **Proceso:**
  - Se convirtió la imagen a formato WebP (calidad 85%) usando `sharp` → `public/11nov.webp` (146 KB).
  - Se actualizaron las dimensiones en `app/nomina/page.tsx` (width: 1999, height: 1545) para reflejar la resolución real.
- **Archivos modificados:**
  - `public/11nov.webp` (reemplazado)
  - `app/nomina/page.tsx` (dimensiones de imagen de noviembre)
- **Commit:** `96820d9`

#### 🗑️ Eliminación del cronograma de Octubre 2026
- **Motivo:** Ya estamos en noviembre, el cronograma de octubre está vencido.
- **Cambios:**
  - `app/nomina/page.tsx`: Se eliminó el bloque de imagen de octubre (`/10oct.webp`) y se asignó `priority` a noviembre por ser ahora la primera imagen.

---

### Sesión: 01/11/2026

#### 🎨 Ajustes visuales en Autorización de Retiro de Bolsa (`/documentos/autorizacion-bolsa`)
- **Motivo:** Mejorar el contraste y legibilidad en la sección "Datos del Titular": el título era oscuro y los recuadros eran rosados. Se solicitó cambiar el título a amarillo piolín y los recuadros a amarillo.
- **Cambios realizados:**
  - `app/documentos/autorizacion-bolsa/page.tsx`:
    - Título `"Datos del Titular"`: Adaptativo por tema. En modo oscuro amarillo piolín brillante (`dark:text-[#FFE600]`) y en modo claro ámbar dorado de alto contraste (`text-amber-600`) para legibilidad óptima sobre fondo blanco.
    - Recuadros de entrada (inputs) de Titular: Cambiados de fondo rosa/borde rojo (`bg-[#FFF5F5] border-red-200`) a amarillo (`border-2 border-yellow-400 bg-[#FEFCE8] dark:bg-yellow-950/20`), ofreciendo tono crema suave con borde amarillo en modo claro y fondo oscuro con borde amarillo en modo oscuro.
    - Los campos de "Datos del Autorizado" se mantuvieron intactos según lo indicado.

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
    - Texto informativo: *"Envía la palabra hola al 0412-1024405"*, con la palabra **"hola"** en verde WhatsApp (`#25D366`).
    - Icono circular verde con logo oficial de WhatsApp.
    - **Elementos 100% estáticos e informativos:** Sin links ni redirecciones, con `pointer-events-none` tanto en PC como en móviles.
- **Commits:** `e41f8b7` (versión inicial) → `6abf272` (versión estática) → `59693b7` (estilo verde) → texto actualizado a *"Envía la palabra hola al 0412-1024405"*.

#### ⚙️ Creación del System Prompt Permanente (`GEMINI.md`)
- **Motivo:** Garantizar que cualquier agente de IA en sesiones futuras lea obligatoriamente `progreso.md` al iniciar y registre cualquier avance o cambio antes de cerrar la sesión.
- **Archivo creado:** `GEMINI.md` en la raíz del repositorio, configurado como regla de workspace de Antigravity.

#### ✅ Estado final de sesión
- Build de producción: ✅ Exitoso (42 páginas generadas estáticamente)
- Todos los cambios desplegados en producción vía Git push a `origin/main`
- Commits relevantes de la jornada: `3c01215`, `e41f8b7`, `6abf272`, `d75e3fe`, `59693b7`, `62d011d`.

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

---

## 📌 Tareas Técnicas Pendientes (Backlog de Optimización)

- [ ] **Tarea 1: Limpieza del endpoint de administración (`/api/admin/upload`)**
  - Desacoplar la dependencia local a `../bootie-dev` que no existe en el entorno Serverless de Vercel.
- [ ] **Tarea 2: Consolidación y unificación del Chat IA**
  - Unificar `/api/chat`, `/api/chat-deepseek` y `/api/chat-bootie` en un flujo modular (`lib/ai-cascade.ts`).
- [ ] **Tarea 3: Optimización de timeouts y resiliencia en Vercel**
  - Ajustar tiempos máximos de espera por capa y evaluar `maxDuration` para evitar errores 504.
- [ ] **Tarea 4: Depuración de scripts temporales**
  - Reorganizar o limpiar scripts de prueba `test-*.js` en desuso fuera de la raíz.


