"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ZoomIn, ZoomOut, Contrast, Type, Settings, X, RefreshCw } from "lucide-react"

export function AccessibilityToolbar({ inline = false }: { inline?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const { theme, setTheme } = useTheme()
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Close toolbar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;

      // Ignore clicks/touches inside Radix UI portals and select dropdowns
      const element = target as Element;
      const isInRadixUI =
        element.closest?.('[data-radix-portal]') ||
        element.closest?.('[data-radix-popper-content-wrapper]') ||
        element.closest?.('[role="listbox"]') ||
        element.closest?.('[role="option"]');

      if (isInRadixUI) return;

      if (toolbarRef.current && !toolbarRef.current.contains(target)) {
        // Check if the click is on the toggle button itself to avoid immediate reopening
        const toggleButton = document.querySelector('[aria-label="Abrir herramientas de accesibilidad"], [aria-label="Cerrar herramientas de accesibilidad"]');
        if (toggleButton && toggleButton.contains(target)) {
          return;
        }
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    // Lógica para detectar actualizaciones del Service Worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration && registration.waiting) {
            setUpdateAvailable(true);
            setWaitingWorker(registration.waiting);
          } else {
            // Escucha por nuevas actualizaciones encontradas
            navigator.serviceWorker.addEventListener('updatefound', () => {
              const newWorker = registration?.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setUpdateAvailable(true);
                    setWaitingWorker(newWorker);
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error('Error during service worker registration:', error);
        }
      }
    };

    registerServiceWorker();

    // Recargar la página una vez que el nuevo SW toma el control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });

  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

  // Remove highContrast useEffect as it's replaced by theme
  // useEffect(() => {
  //   if (highContrast) {
  //     document.documentElement.classList.add("high-contrast")
  //   } else {
  //     document.documentElement.classList.remove("high-contrast")
  //   }
  // }, [highContrast])

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 10, 150));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 10, 80));
  const resetSettings = () => {
    setFontSize(100)
    setTheme("system") // Reset theme to system
  }

  return (
    <>
      <div className={inline ? "" : "fixed top-16 right-4 z-40 hidden md:block"}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          className="bg-background shadow-lg border-2 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative"
          aria-label={isOpen ? "Cerrar herramientas de accesibilidad" : "Abrir herramientas de accesibilidad"}
          title="Herramientas de Accesibilidad"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          {updateAvailable && !isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background" title="Actualización disponible"></span>
          )}
          <span className="sr-only">Accesibilidad</span>
        </Button>
      </div>

      {isOpen && (
        <div ref={toolbarRef} className="fixed top-32 right-4 z-40 w-72">
          <Card className="shadow-2xl border-2">
            <CardContent className="p-4">
              <h3 className="font-heading font-bold text-lg mb-4">Herramientas de Accesibilidad</h3>

              {updateAvailable && (
                <div className="mb-4">
                  <Button
                    onClick={handleUpdate}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    aria-label="Actualizar la aplicación a la última versión"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Actualizar Aplicación
                  </Button>
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center"><Type className="w-4 h-4 mr-2" /> Tamaño de Texto</h4>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={decreaseFontSize} disabled={fontSize <= 80} aria-label="Disminuir tamaño de texto">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[3rem] text-center" aria-live="polite">{fontSize}%</span>
                  <Button variant="outline" size="sm" onClick={increaseFontSize} disabled={fontSize >= 150} aria-label="Aumentar tamaño de texto">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center"><Contrast className="w-4 h-4 mr-2" /> Tema</h4>
                <Select onValueChange={(value) => setTheme(value)} value={theme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={resetSettings} className="w-full">
                Restablecer
              </Button>

              <p className="text-xs text-muted-foreground mt-3">
                Estas configuraciones se aplicarán solo durante tu visita actual.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}