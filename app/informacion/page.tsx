import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CreditCard, Users, Phone, Clock, Calculator, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function InformacionPage() {
  const infoCategories = [
    {
      title: "Pensiones y Jubilación",
      description: "Todo sobre tu pensión, cálculos y beneficios",
      icon: CreditCard,
      href: "/informacion/pensiones",
      color: "bg-primary",
      items: ["Cálculo de pensión", "Requisitos", "Documentos necesarios", "Fechas de pago"],
    },
    {
      title: "Beneficios Sociales",
      description: "Servicios y beneficios disponibles",
      icon: Users,
      href: "/informacion/beneficios",
      color: "bg-secondary",
      items: ["Seguro médico", "Ayudas económicas", "Descuentos especiales", "Programas sociales"],
    },
    {
      title: "Trámites y Documentos",
      description: "Guías para realizar trámites importantes",
      icon: FileText,
      href: "/informacion/tramites",
      color: "bg-accent",
      items: ["Certificaciones", "Actualizaciones", "Formularios", "Requisitos legales"],
    },
    {
      title: "Contactos Importantes",
      description: "Números y direcciones de oficinas",
      icon: Phone,
      href: "/informacion/contactos",
      color: "bg-chart-3",
      items: ["Oficinas regionales", "Números de emergencia", "Horarios de atención", "Direcciones"],
    },
  ]

  const quickFacts = [
    {
      icon: Clock,
      title: "Horarios de Atención",
      content: "Lunes a Viernes: 8:00 AM - 4:00 PM",
    },
    {
      icon: Calculator,
      title: "Fecha de Pago",
      content: "Últimos 5 días hábiles del mes",
    },
    {
      icon: Shield,
      title: "Línea de Ayuda",
      content: "0800-CANTV-00 (Gratuita)",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Centro de Información</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Encuentra toda la información que necesitas sobre pensiones, beneficios y trámites de CANTV
          </p>
        </div>

        {/* Quick Facts */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {quickFacts.map((fact, index) => {
            const Icon = fact.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{fact.title}</h3>
                  <p className="text-muted-foreground">{fact.content}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Information Categories */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {infoCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.href} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription className="text-base">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {category.items.map((item, index) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={category.href}>
                    <Button className="w-full">Ver Detalles</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Important Notice */}
        <Card className="border-l-4 border-l-secondary bg-secondary/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-secondary mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Información Importante</h3>
                <p className="text-muted-foreground mb-4">
                  Toda la información presentada en este portal es oficial y está actualizada según las últimas
                  resoluciones de CANTV. Para consultas específicas sobre tu caso particular, te recomendamos contactar
                  directamente con nuestras oficinas.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/informacion/contactos">
                    <Button variant="outline">Ver Contactos</Button>
                  </Link>
                  <Link href="/chat-ia">
                    <Button variant="outline">Consultar con IA</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
