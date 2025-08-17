"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import Link from "next/link"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const quickActions = [
    "¿Cómo calcular mi pensión?",
    "Fechas de pago este mes",
    "Beneficios médicos disponibles",
    "Contactar oficinas",
  ]

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
          aria-label={isOpen ? "Cerrar chat de ayuda" : "Abrir chat de ayuda"}
          aria-expanded={isOpen}
          aria-controls="chat-widget"
        >
          {isOpen ? (
            <X className="w-6 h-6" aria-hidden="true" />
          ) : (
            <MessageCircle className="w-6 h-6" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96"
          id="chat-widget"
          role="dialog"
          aria-labelledby="chat-widget-title"
        >
          <Card className="shadow-2xl">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center text-lg" id="chat-widget-title">
                <Bot className="w-5 h-5 mr-2" aria-hidden="true" />
                Asistente InfoDoc
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 mb-4">
                <p className="text-sm text-muted-foreground">¡Hola! ¿En qué puedo ayudarte hoy?</p>
                <div className="space-y-2" role="list" aria-label="Preguntas frecuentes">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-11"
                      onClick={() => setMessage(action)}
                      role="listitem"
                      aria-label={`Pregunta rápida: ${action}`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <label htmlFor="chat-input" className="sr-only">
                  Escribe tu pregunta
                </label>
                <input
                  id="chat-input"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-11"
                  onKeyPress={(e) => e.key === "Enter" && message.trim() && console.log("Send message:", message)}
                />
                <Button
                  size="sm"
                  disabled={!message.trim()}
                  onClick={() => message.trim() && console.log("Send message:", message)}
                  aria-label="Enviar mensaje"
                  className="min-h-11 min-w-11"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="mt-3 text-center">
                <Link href="/chat-ia">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent touch-target focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Abrir chat completo con más funciones"
                  >
                    Abrir Chat Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
