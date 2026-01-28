import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Percent, Gift, Users, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function BeneficiosPage() {
  const benefits = [
    {
      icon: Heart,
      title: "Seguro Médico",
      description: "Cobertura médica integral para ti y tu familia",
      details: [
        "Consultas médicas generales y especializadas",
        "Medicamentos con descuentos especiales",
        "Hospitalización y cirugías",
        "Cobertura para cónyuge e hijos menores",
      ],
      color: "bg-primary",
    },
    {
      icon: Percent,
      title: "Descuentos Especiales",
      description: "Beneficios exclusivos en comercios afiliados",
      details: [
        "Farmacias: hasta 30% de descuento",
        "Supermercados: 10-15% en productos básicos",
        "Servicios médicos privados: 20% descuento",
        "Recreación y turismo: ofertas especiales",
      ],
      color: "bg-secondary",
    },
    {
      icon: Gift,
      title: "Ayudas Económicas",
      description: "Subsidios y ayudas en situaciones especiales",
      details: [
        "Bono navideño anual",
        "Ayuda por nacimiento de hijos",
        "Subsidio por fallecimiento",
        "Préstamos a bajo interés",
      ],
      color: "bg-accent",
    },
    {
      icon: Users,
      title: "Programas Sociales",
      description: "Actividades y programas para el bienestar",
      details: [
        "Actividades recreativas y culturales",
        "Programas de salud preventiva",
        "Talleres y capacitaciones",
        "Eventos sociales y celebraciones",
      ],
      color: "bg-chart-3",
    },
  ]

  const eligibilityRequirements = [
    "Ser jubilado activo de CANTV",
    "Mantener datos actualizados en el sistema",
    "Cumplir con los requisitos específicos de cada beneficio",
    "Presentar documentación requerida cuando sea necesario",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/informacion">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Información
            </Button>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Beneficios Sociales</h1>
          <p className="text-xl text-muted-foreground">
            Conoce todos los beneficios disponibles para jubilados de CANTV
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${benefit.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                      <CardDescription>{benefit.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Eligibility Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Requisitos de Elegibilidad</CardTitle>
            <CardDescription>Condiciones para acceder a los beneficios</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {eligibilityRequirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Contact for Benefits */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-2xl">¿Necesitas Más Información?</CardTitle>
            <CardDescription>Contacta con nuestro departamento de beneficios sociales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Línea de Beneficios</p>
                  <p className="text-muted-foreground">0800-CANTV-01</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Oficina de Bienestar Social</p>
                  <p className="text-muted-foreground">Torre CANTV, Piso 15</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/informacion/contactos">
                <Button>Ver Todos los Contactos</Button>
              </Link>
              <Link href="/chat-ia">
                <Button variant="outline">Consultar con IA</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
