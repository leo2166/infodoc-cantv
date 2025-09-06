import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, FileText, Shield, Pill } from "lucide-react"

const healthServices = [
  {
    title: "Reembolsos",
    description: "Consulta la información y el proceso para la solicitud de reembolsos.",
    icon: FileText,
    href: "/informacion/salud/reembolsos",
  },
  {
    title: "Carta Aval",
    description: "Información y proceso para la solicitud de cartas aval.",
    icon: Shield,
    href: "/informacion/salud/carta-aval",
  },
  {
    title: "Farmacantv",
    description: "Información sobre el programa Farmacantv (próximamente).",
    icon: Pill, // Icono de píldora como placeholder
    href: "#", // Enlace deshabilitado temporalmente
  },
]

export default function SaludPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="touch-target">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Gerencia Servicios de Salud
            </h1>
            <p className="text-xl text-muted-foreground">Selecciona una opción para ver los detalles.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthServices.map((service) => (
              <Link key={service.href} href={service.href} className={`focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg ${service.href === '#' ? 'cursor-not-allowed' : ''}`}>
                <Card className={`h-full hover:shadow-lg transition-shadow ${service.href === '#' ? 'opacity-50' : 'cursor-pointer'}`}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <service.icon className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
