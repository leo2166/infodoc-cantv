"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ZoomIn, ZoomOut, Contrast, Type, Settings, X, RefreshCw } from "lucide-react"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

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

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrast])

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 10, 150));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 10, 80));
  const resetSettings = () => {
    setFontSize(100)
    setHighContrast(false)
  }

  return (
    <>
      <div className="fixed top-20 right-4 z-40">
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
        <div className="fixed top-32 right-4 z-40 w-72">
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
                <Button variant={highContrast ? "default" : "outline"} onClick={() => setHighContrast(!highContrast)} className="w-full justify-start" aria-pressed={highContrast}>
                  <Contrast className="w-4 h-4 mr-2" /> Alto Contraste
                </Button>
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