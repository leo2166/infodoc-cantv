"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Registrar service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[v0] SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("[v0] SW registration failed: ", registrationError)
        })
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("[v0] User accepted the install prompt")
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  return (
    <Dialog open={showPrompt} onOpenChange={(open) => {
      if (!open) {
        handleDismiss()
      }
    }}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Download className="w-6 h-6" />
            Instalar InfoDoc
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Instala la aplicación en tu dispositivo para un acceso más rápido y sin conexión.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Tendrás un ícono en tu pantalla de inicio, como cualquier otra aplicación.
          </p>
        </div>
        <DialogFooter className="sm:justify-center gap-2">
          <Button onClick={handleDismiss} variant="outline">
            Ahora no
          </Button>
          <Button onClick={handleInstall}>
            Instalar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
