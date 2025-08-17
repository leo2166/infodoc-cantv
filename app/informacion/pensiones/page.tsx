import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calculator, Calendar, FileText, DollarSign, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PensionesPage() {
  const pensionSteps = [
    {
      step: "1",
      title: "Verificar Requisitos",
      description: "Confirma que cumples con los años de servicio y edad requerida",
      details: [
        "Mínimo 25 años de servicio",
        "Edad mínima: 55 años (mujeres), 60 años (hombres)",
        "Estar activo en CANTV",
      ],
    },
    {
      step: "2",
      title: "Reunir Documentos",
      description: "Prepara toda la documentación necesaria",
      details: ["Cédula de identidad vigente", "Constancia de trabajo", "Últimas 3 nóminas", "Certificado médico"],
    },
    {
      step: "3",
      title: "Solicitar Pensión",
      description: "Presenta tu solicitud en la oficina correspondiente",
      details: [
        "Llenar formulario oficial",
        "Entregar documentos",
        "Recibir número de expediente",
        "Seguimiento del proceso",
      ],
    },
  ]

  const pensionBenefits = [
    {
      icon: DollarSign,
      title: "Monto de Pensión",
      description: "Calculado según años de servicio y último salario",
      details: "Entre 75% y 100% del salario promedio",
    },
    {
      icon: Calendar,
      title: "Pago Mensual",
      description: "Depósito directo en tu cuenta bancaria",
      details: "Últimos 5 días hábiles del mes",
    },
    {
      icon: CheckCircle,
      title: "Beneficios Adicionales",
      description: "Mantén acceso a servicios médicos y otros beneficios",
      details: "Seguro médico, descuentos especiales",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/informacion">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Información
            </Button>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Pensiones y Jubilación</h1>
          <p className="text-xl text-muted-foreground">Guía completa sobre el proceso de jubilación en CANTV</p>
        </div>

        {/* Benefits Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pensionBenefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index}>
                <CardHeader className="text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-2">{benefit.description}</CardDescription>
                  <p className="text-sm font-medium text-primary">{benefit.details}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Process Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Proceso de Jubilación
            </CardTitle>
            <CardDescription>Sigue estos pasos para solicitar tu pensión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {pensionSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-3">{step.description}</p>
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calculator Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Calculator className="w-6 h-6 mr-2" />
              Calculadora de Pensión
            </CardTitle>
            <CardDescription>Estima el monto aproximado de tu pensión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Fórmula de Cálculo:</h4>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>25-29 años de servicio:</strong> 75% del salario promedio
                </p>
                <p>
                  <strong>30-34 años de servicio:</strong> 85% del salario promedio
                </p>
                <p>
                  <strong>35+ años de servicio:</strong> 100% del salario promedio
                </p>
              </div>
              <div className="mt-6">
                <Link href="/chat-ia">
                  <Button>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular con IA
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Fechas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Pago de Pensiones</h4>
                <p className="text-sm text-muted-foreground">Últimos 5 días hábiles de cada mes</p>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg">
                <h4 className="font-semibold text-secondary mb-2">Actualización de Datos</h4>
                <p className="text-sm text-muted-foreground">Enero y julio de cada año</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
