import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Globe, Smartphone } from "lucide-react"

interface Farmacia {
  name: string
  contact: string
  type: "web" | "whatsapp" | "telegram"
  location: string
}

export default function FarmaciasPage() {
  const farmacias: Farmacia[] = [
    { name: "Farmatodo", contact: "www.Farmatodo.com.ve", type: "web", location: "" },
    { name: "Redvital", contact: "04144991786", type: "whatsapp", location: "La Limpia" },
    { name: "Farmaexpress", contact: "04126913703", type: "whatsapp", location: "Delicias" },
    { name: "Maraplus", contact: "04246998400", type: "telegram", location: "Delicias" },
    { name: "SAAS", contact: "04122267724", type: "whatsapp", location: "Bella Vista" },
    { name: "Nueva Goajira", contact: "04120701895", type: "whatsapp", location: "Rómulo" },
    { name: "Farmaclic", contact: "04124755829", type: "whatsapp", location: "Halcox a arriba" }
  ]

  // Función para generar el enlace correcto según el tipo
  const getContactLink = (farmacia: Farmacia): string => {
    if (farmacia.type === "web") {
      return `https://${farmacia.contact}`
    } else if (farmacia.type === "whatsapp") {
      // Formato WhatsApp: https://wa.me/58XXXXXXXXXX (sin guiones)
      const cleanNumber = farmacia.contact.replace(/-/g, "")
      return `https://wa.me/58${cleanNumber}`
    } else if (farmacia.type === "telegram") {
      // Formato Telegram: https://t.me/+58XXXXXXXXXX
      const cleanNumber = farmacia.contact.replace(/-/g, "")
      return `https://t.me/+58${cleanNumber}`
    }
    return "#"
  }

  // Función para renderizar el icono correcto
  const getIcon = (type: string) => {
    switch (type) {
      case "web":
        return <Globe className="w-6 h-6 text-blue-600" />
      case "whatsapp":
      case "telegram":
        return <Smartphone className="w-6 h-6 text-green-600" />
      default:
        return null
    }
  }

  // Función para formatear el contacto mostrado
  const formatContact = (farmacia: Farmacia): string => {
    if (farmacia.type === "web") {
      return farmacia.contact
    }
    // Agregar guiones para mejor legibilidad del número
    return farmacia.contact.replace(/(\d{4})(\d{7})/, "$1-$2")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="touch-target">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>

          {/* Encabezado con tema médico */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-t-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 text-6xl">⚕️</div>
              <div className="absolute bottom-4 right-8 text-5xl">💊</div>
              <div className="absolute top-1/2 left-1/4 text-4xl">🏥</div>
              <div className="absolute top-1/3 right-1/4 text-4xl">💉</div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white relative z-10">
              Donde Ubicar Mis Medicamentos
            </h1>
          </div>

          {/* Contenedor de la tabla */}
          <div className="bg-card rounded-b-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Tabla responsive */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-4 text-left text-sm sm:text-base font-bold text-primary border-b-2 border-primary">
                        Nombre de la Farmacia
                      </th>
                      <th className="px-4 py-4 text-center text-sm sm:text-base font-bold text-primary border-b-2 border-primary">
                        Tipo
                      </th>
                      <th className="px-4 py-4 text-left text-sm sm:text-base font-bold text-primary border-b-2 border-primary">
                        Información de Contacto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmacias.map((farmacia, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 font-semibold text-base sm:text-lg text-foreground">
                          {farmacia.name}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {getIcon(farmacia.type)}
                        </td>
                        <td className="px-4 py-4">
                          <a
                            href={getContactLink(farmacia)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg sm:text-xl font-bold text-primary hover:text-primary/80 hover:underline transition-all active:scale-95 inline-block"
                          >
                            {formatContact(farmacia)}
                          </a>
                          {farmacia.location && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              {farmacia.location}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Nota informativa */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-muted-foreground text-center">
                  💡 <strong>Consejo:</strong> Haz clic en el número o enlace para contactar directamente por WhatsApp, Telegram o visitar el sitio web.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

