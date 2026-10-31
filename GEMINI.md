# 🤖 Reglas y Directivas del Proyecto: InfoDoc CANTV

Este archivo define las reglas de comportamiento, directivas de sistema y protocolos obligatorios para cualquier agente de IA que trabaje en este repositorio.

---

## 📋 Protocolo Obligatorio: `progreso.md`

1. **Lectura obligatoria al iniciar sesión:**
   - Al comenzar **cualquier** sesión o conversación, el agente **DEBE leer obligatoriamente** el archivo `progreso.md` antes de realizar o proponer cualquier acción o cambio en el código.
   - Esto garantiza que el agente conozca el contexto más reciente, el estado de producción, decisiones arquitectónicas y qué cambios están activos o descartados.

2. **Registro obligatorio de cambios:**
   - **TODA modificación**, corrección de errores, adición de funcionalidades, eliminación de componentes, ajustes visuales o cualquier evolución del sistema **DEBE ser registrada en `progreso.md`**.
   - El registro debe incluir:
     - Fecha de la sesión.
     - Motivo del cambio o problema resuelto.
     - Archivos afectados (creados, modificados o eliminados).
     - Commit o estado del despliegue.

---

## 🛠️ Normas de Desarrollo y Despliegue

- **Framework:** Next.js 14 (App Router) con TypeScript y Tailwind CSS.
- **Entorno local:** Si el usuario solicita probar localmente, verificar puertos disponibles o usar el indicado (ej. 4006, 4007) mediante `npx next dev -p <puerto>`.
- **Despliegues a Producción:** Se realizan a través de la rama `main` de GitHub mediante el comando o skill `/subirgit` (`cmd /c "git add . && git commit -m deploy-auto && git push"`), el cual activa el despliegue automático en Vercel.
- **Preservación y Resiliencia:** No eliminar backups ni romper las capas de IA configuradas para el chatbot.
