import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Download, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function TramitesPage() {
  const commonProcedures = [
    {
      title: "Certificado de Pensión",
      description: "Documento oficial que certifica tu condición de pensionado",
      requirements: ["Cédula de identidad", "Solicitud escrita", "Foto carnet reciente"],
      timeframe: "3-5 días hábiles",
      cost: "Gratuito",
    },
    {
      title: "Actualización de Datos",
      description: "Mantén tu información personal y bancaria actualizada",
      requirements: ["Cédula vigente", "Comprobante de domicilio", "Estado de cuenta bancario"],
      timeframe: "1-2 días hábiles",
      cost: "Gratuito",
    },
    {
      title: "Constancia de Supervivencia",
      description: "Certificación requerida para mantener activa tu pensión",
      requirements: ["Cédula de identidad", "Presencia física del pensionado"],
      timeframe: "Inmediato",
      cost: "Gratuito",
    },
    {
      title: "Solicitud de Préstamo",
      description: "Préstamos especiales para pensionados con condiciones preferenciales",
      requirements: ["Solicitud formal", "Constancia de ingresos", "Referencias personales"],
      timeframe: "15-20 días hábiles",
      cost: "Evaluación gratuita",
    },
  ]

  const importantTips = [
    {
      icon: Clock,
      title: "Horarios de Atención",
      content: "Lunes a Viernes de 8:00 AM a 4:00 PM. Evita las horas pico (11 AM - 2 PM)",
    },
    {
      icon: FileText,
      title: "Documentos",
      content: "Siempre lleva originales y copias. Verifica que estén vigentes y legibles",
    },
    {
      icon: CheckCircle,
      title: "Seguimiento",
      content: "Guarda tu número de expediente para hacer seguimiento de tu trámite",
    },
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
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Trámites y Documentos</h1>
          <p className="text-xl text-muted-foreground">Guía completa para realizar tus trámites de manera eficiente</p>
        </div>

        {/* Important Tips */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {importantTips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm">{tip.content}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Common Procedures */}
        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-heading font-bold">Trámites Más Comunes</h2>
          {commonProcedures.map((procedure, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{procedure.title}</CardTitle>
                <CardDescription>{procedure.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Requisitos:</h4>
                    <ul className="space-y-1">
                      {procedure.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Tiempo de Procesamiento:</h4>
                    <p className="text-sm text-muted-foreground">{procedure.timeframe}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Costo:</h4>
                    <p className="text-sm text-muted-foreground">{procedure.cost}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Download Forms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Download className="w-6 h-6 mr-2" />
              Formularios Descargables
            </CardTitle>
            <CardDescription>Descarga y completa los formularios antes de tu visita</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Solicitud de Certificado</h4>
                <p className="text-sm text-muted-foreground mb-3">Formulario para solicitar certificados oficiales</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Actualización de Datos</h4>
                <p className="text-sm text-muted-foreground mb-3">Formulario para actualizar información personal</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Solicitud de Préstamo</h4>
                <p className="text-sm text-muted-foreground mb-3">Formulario para solicitar préstamos especiales</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Reclamos y Sugerencias</h4>
                <p className="text-sm text-muted-foreground mb-3">Formulario para presentar reclamos o sugerencias</p>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="border-l-4 border-l-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Aviso Importante</h3>
                <p className="text-muted-foreground mb-4">
                  Todos los trámites son gratuitos. CANTV no cobra por ningún servicio relacionado con pensiones o
                  beneficios. Desconfía de personas que soliciten pagos por gestiones que puedes hacer directamente.
                </p>
                <Link href="/informacion/contactos">
                  <Button variant="outline">Reportar Irregularidades</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
