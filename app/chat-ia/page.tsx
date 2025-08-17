"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Brain,
  Clock,
  HelpCircle,
  Calculator,
  FileText,
  Phone,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  aiProvider?: "copilot" | "gemini"
}

export default function ChatIAPage() {
  const [selectedAI, setSelectedAI] = useState<"copilot" | "gemini">("copilot")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const aiProviders = [
    {
      id: "copilot" as const,
      name: "Microsoft Copilot",
      description: "Asistente inteligente para consultas generales y cálculos",
      icon: Brain,
      color: "bg-primary",
    },
    {
      id: "gemini" as const,
      name: "Google Gemini",
      description: "IA avanzada para análisis detallados y explicaciones",
      icon: Sparkles,
      color: "bg-secondary",
    },
  ]

  const quickQuestions = [
    {
      question: "¿Cómo calcular mi pensión?",
      category: "Pensiones",
      icon: Calculator,
    },
    {
      question: "¿Qué beneficios médicos tengo disponibles?",
      category: "Beneficios",
      icon: FileText,
    },
    {
      question: "¿Cuándo se pagan las pensiones este mes?",
      category: "Pagos",
      icon: Clock,
    },
    {
      question: "¿Cómo actualizar mis datos personales?",
      category: "Trámites",
      icon: User,
    },
    {
      question: "¿Dónde están las oficinas de atención?",
      category: "Contacto",
      icon: Phone,
    },
    {
      question: "¿Qué documentos necesito para un trámite?",
      category: "Documentos",
      icon: FileText,
    },
  ]

  // Simulated AI responses
  const getAIResponse = (message: string, provider: "copilot" | "gemini"): string => {
    const responses = {
      copilot: {
        pension:
          "Para calcular tu pensión de CANTV, se considera: 1) Años de servicio (mínimo 25), 2) Promedio salarial de los últimos 3 años, 3) Porcentaje según años trabajados (75-100%). Con 25-29 años: 75%, 30-34 años: 85%, 35+ años: 100%. ¿Te ayudo con un cálculo específico?",
        beneficios:
          "Como jubilado de CANTV tienes derecho a: Seguro médico integral, descuentos en farmacias (hasta 30%), ayudas económicas especiales, bono navideño, y acceso a programas recreativos. El seguro cubre consultas, medicamentos y hospitalización para ti y tu familia directa.",
        pagos:
          "Las pensiones de CANTV se pagan durante los últimos 5 días hábiles de cada mes. Para enero 2025, los pagos serán entre el 27 y 31 de enero. Puedes verificar el depósito en tu cuenta bancaria o llamar al 0800-CANTV-00 para confirmación.",
        default:
          "Hola, soy Copilot de Microsoft. Estoy aquí para ayudarte con tus consultas sobre CANTV. Puedo asistirte con cálculos de pensión, información sobre beneficios, fechas de pago y trámites. ¿En qué puedo ayudarte hoy?",
      },
      gemini: {
        pension:
          "El sistema de pensiones de CANTV se basa en un modelo de beneficio definido. La fórmula considera tu salario promedio de los últimos 36 meses y tus años de servicio. El factor multiplicador varía: 25-29 años (75%), 30-34 años (85%), 35+ años (100%). También se incluyen bonificaciones por antigüedad y ajustes por inflación.",
        beneficios:
          "El paquete de beneficios para jubilados de CANTV es integral: 1) Cobertura médica HCM con red nacional, 2) Descuentos comerciales en +500 establecimientos, 3) Subsidios especiales (nacimiento, matrimonio, defunción), 4) Programas de bienestar y recreación, 5) Acceso a préstamos preferenciales. Cada beneficio tiene requisitos específicos.",
        pagos:
          "El cronograma de pagos sigue el calendario laboral venezolano. Para 2025, las fechas exactas son: Enero 27-31, Febrero 24-28, Marzo 26-31. Los depósitos se procesan automáticamente. Si no recibes tu pago en estas fechas, contacta inmediatamente la línea de emergencias 0800-CANTV-911.",
        default:
          "Saludos, soy Gemini de Google. Mi capacidad de análisis me permite brindarte información detallada sobre pensiones, beneficios y procedimientos de CANTV. Puedo explicar procesos complejos de manera sencilla y ayudarte a entender tus derechos como jubilado. ¿Qué te gustaría saber?",
      },
    }

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("pensión") || lowerMessage.includes("pension") || lowerMessage.includes("calcul")) {
      return responses[provider].pension
    } else if (
      lowerMessage.includes("beneficio") ||
      lowerMessage.includes("médico") ||
      lowerMessage.includes("seguro")
    ) {
      return responses[provider].beneficios
    } else if (lowerMessage.includes("pago") || lowerMessage.includes("fecha") || lowerMessage.includes("cuándo")) {
      return responses[provider].pagos
    } else {
      return responses[provider].default
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content, selectedAI),
        sender: "ai",
        timestamp: new Date(),
        aiProvider: selectedAI,
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleQuickQuestion = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Consultas con Inteligencia Artificial
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Obtén respuestas inmediatas sobre pensiones, beneficios y trámites con la ayuda de IA avanzada
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Provider Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  Seleccionar Asistente IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiProviders.map((provider) => {
                  const Icon = provider.icon
                  return (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedAI(provider.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedAI === provider.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Preguntas Frecuentes
                </CardTitle>
                <CardDescription>Haz clic para consultar rápidamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(item.question)}
                      className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="w-4 h-4 mt-0.5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{item.question}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 ${aiProviders.find((p) => p.id === selectedAI)?.color} rounded-lg flex items-center justify-center`}
                    >
                      {selectedAI === "copilot" ? (
                        <Brain className="w-5 h-5 text-white" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{aiProviders.find((p) => p.id === selectedAI)?.name}</CardTitle>
                      <CardDescription>Asistente IA activo</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    En línea
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">¡Hola! ¿En qué puedo ayudarte?</h3>
                    <p className="text-muted-foreground">
                      Pregúntame sobre pensiones, beneficios, trámites o cualquier duda sobre CANTV
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "ai" && (
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {message.aiProvider === "copilot" ? (
                              <Brain className="w-3 h-3 text-white" />
                            ) : (
                              <Sparkles className="w-3 h-3 text-white" />
                            )}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          {selectedAI === "copilot" ? (
                            <Brain className="w-3 h-3 text-white" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                    placeholder="Escribe tu pregunta aquí..."
                    className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isLoading}
                    size="lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Presiona Enter para enviar. La IA puede cometer errores, verifica información importante.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-heading font-bold mb-4">¿Necesitas ayuda adicional?</h3>
              <p className="text-muted-foreground mb-6">
                Si la IA no puede resolver tu consulta, nuestro equipo humano está disponible para ayudarte
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar 0800-CANTV-00
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat en Vivo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
