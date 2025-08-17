"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ZoomIn, ZoomOut, Contrast, Type, Settings, X } from "lucide-react"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    // Apply font size changes
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

  useEffect(() => {
    // Apply high contrast mode
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrast])

  const increaseFontSize = () => {
    if (fontSize < 150) {
      setFontSize((prev) => prev + 10)
    }
  }

  const decreaseFontSize = () => {
    if (fontSize > 80) {
      setFontSize((prev) => prev - 10)
    }
  }

  const resetSettings = () => {
    setFontSize(100)
    setHighContrast(false)
  }

  return (
    <>
      {/* Accessibility Button */}
      <div className="fixed top-20 right-4 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          className="bg-background shadow-lg border-2 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={isOpen ? "Cerrar herramientas de accesibilidad" : "Abrir herramientas de accesibilidad"}
          title="Herramientas de Accesibilidad"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          <span className="sr-only">Accesibilidad</span>
        </Button>
      </div>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed top-32 right-4 z-40 w-72">
          <Card className="shadow-2xl border-2">
            <CardContent className="p-4">
              <h3 className="font-heading font-bold text-lg mb-4">Herramientas de Accesibilidad</h3>

              {/* Font Size Controls */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Type className="w-4 h-4 mr-2" aria-hidden="true" />
                  Tamaño de Texto
                </h4>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFontSize}
                    disabled={fontSize <= 80}
                    aria-label="Disminuir tamaño de texto"
                    className="focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                  >
                    <ZoomOut className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <span className="text-sm font-medium min-w-[3rem] text-center" aria-live="polite">
                    {fontSize}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFontSize}
                    disabled={fontSize >= 150}
                    aria-label="Aumentar tamaño de texto"
                    className="focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="mb-4">
                <Button
                  variant={highContrast ? "default" : "outline"}
                  onClick={() => setHighContrast(!highContrast)}
                  className="w-full justify-start focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={highContrast ? "Desactivar alto contraste" : "Activar alto contraste"}
                  aria-pressed={highContrast}
                >
                  <Contrast className="w-4 h-4 mr-2" aria-hidden="true" />
                  Alto Contraste
                </Button>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                onClick={resetSettings}
                className="w-full focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                aria-label="Restablecer configuración de accesibilidad"
              >
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
