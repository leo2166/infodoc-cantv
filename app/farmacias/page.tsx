import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Globe, Smartphone } from "lucide-react"

interface Farmacia {
  name: string
  contact: string
  contact2?: string
  type: "web" | "whatsapp" | "telegram"
  location: string
}

export default function FarmaciasPage() {
  const farmacias: Farmacia[] = [
    // ── Existentes ──────────────────────────────────────────────────────────
    { name: "Farmatodo",          contact: "www.Farmatodo.com.ve", type: "web",      location: "" },
    { name: "Redvital",           contact: "04144991786",          type: "whatsapp", location: "La Limpia" },
    { name: "Farmaexpress",       contact: "04126913703",          type: "whatsapp", location: "Delicias" },
    { name: "Maraplus",           contact: "04246998400",          type: "telegram", location: "Delicias" },
    { name: "SAAS",               contact: "04122267724",          type: "whatsapp", location: "Bella Vista" },
    { name: "Nueva Goajira",      contact: "04120701895",          type: "whatsapp", location: "Pomona" },
    { name: "Farmaclic",          contact: "04124755829",          type: "whatsapp", location: "Haticos" },

    // ── Nuevas ───────────────────────────────────────────────────────────────
    { name: "Aventura",                         contact: "04246615959", type: "whatsapp", location: "" },
    { name: "Casana",                           contact: "04246568887", type: "whatsapp", location: "" },
    { name: "Claret",                           contact: "04149606158", type: "whatsapp", location: "" },
    { name: "Farma Lago",                       contact: "04126554437", type: "whatsapp", location: "" },
    { name: "FarmaBien",                        contact: "04141659021", type: "whatsapp", location: "Delicias Norte" },
    { name: "FarmaExpress",                     contact: "04246670793", type: "whatsapp", location: "Bella Vista" },
    { name: "FarmaExpress",                     contact: "04246850044", type: "whatsapp", location: "El Milagro" },
    { name: "FarmaExpress",                     contact: "04146274057", type: "whatsapp", location: "Fuerzas Armadas" },
    { name: "FarmaExpress",                     contact: "04146008130", type: "whatsapp", location: "Indio Mara" },
    { name: "FarmaExpress",                     contact: "04246160576", type: "whatsapp", location: "San Francisco" },
    { name: "FarmaExpress 24h",                 contact: "04246318163", type: "whatsapp", location: "" },
    { name: "FarmaExpress 72",                  contact: "04122068947", type: "whatsapp", location: "" },
    { name: "Farma Dr. Galué",                  contact: "04143687444", type: "whatsapp", location: "" },
    { name: "Farmacia Dr. Galué",               contact: "04246606331", type: "whatsapp", location: "San Miguel" },
    { name: "Farmacia Dr. Galué",               contact: "04246033434", type: "whatsapp", location: "La Estrella" },
    { name: "Farma Go",                         contact: "04120773791", type: "whatsapp", location: "" },
    { name: "Farma Venezuela",                  contact: "04146054862", type: "whatsapp", location: "" },
    { name: "Farmacia Clínica Zulia",           contact: "04246026972", type: "whatsapp", location: "" },
    { name: "Farmatem",                         contact: "04246644358", type: "whatsapp", location: "Irama" },
    { name: "Fleming",                          contact: "04168664809", type: "whatsapp", location: "" },
    { name: "Franjamar",                        contact: "04246402918", type: "whatsapp", location: "" },
    { name: "Inversiones 2000",                 contact: "04125347431", type: "whatsapp", location: "" },
    { name: "La Cascada",                       contact: "04146497236", type: "whatsapp", location: "" },
    { name: "La Venezolana",                    contact: "04149665716", type: "whatsapp", location: "" },
    { name: "Maraplus",                         contact: "04123483834", type: "whatsapp", location: "La Fuente" },
    { name: "Maraplus",                         contact: "04146922161", type: "whatsapp", location: "Tierra Negra" },
    { name: "MegaAhorro",                       contact: "04246016676", type: "whatsapp", location: "" },
    { name: "SAAS Dr. Portillo",                contact: "04246495193", type: "whatsapp", location: "" },
    { name: "SAAS Galería",                     contact: "04121042035", type: "whatsapp", location: "" },
    { name: "SAAS Tierra Negra",                contact: "04120697223", type: "whatsapp", location: "" },
    { name: "Suplos",                           contact: "04146667313", contact2: "04126939431", type: "whatsapp", location: "" },
  ]

  // Función para generar el enlace correcto según el tipo
  const getContactLink = (farmacia: Farmacia): string => {
    if (farmacia.type === "web") {
      return `https://${farmacia.contact}`
    } else if (farmacia.type === "whatsapp") {
      const cleanNumber = farmacia.contact.replace(/-/g, "")
      return `https://wa.me/58${cleanNumber}`
    } else if (farmacia.type === "telegram") {
      const cleanNumber = farmacia.contact.replace(/-/g, "")
      return `https://t.me/+58${cleanNumber}`
    }
    return "#"
  }

  const getContact2Link = (number: string): string => {
    const cleanNumber = number.replace(/-/g, "")
    return `https://wa.me/58${cleanNumber}`
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
  const formatContact = (contact: string, type: string): string => {
    if (type === "web") return contact
    return contact.replace(/(\d{4})(\d{7})/, "$1-$2")
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
            <p className="text-teal-100 mt-2 text-sm sm:text-base relative z-10">
              {farmacias.length} farmacias disponibles · Maracaibo
            </p>
          </div>

          {/* Contenedor de la información en recuadro blanco para máximo contraste */}
          <div className="bg-white text-slate-900 rounded-b-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8">

              {/* ── Vista de tarjetas para móvil ── */}
              <div className="block sm:hidden space-y-3">
                {farmacias.map((farmacia, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm hover:border-teal-400 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">
                          {farmacia.name}
                        </h3>
                        {farmacia.location && (
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            📍 {farmacia.location}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-2 mt-0.5">
                        {getIcon(farmacia.type)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={getContactLink(farmacia)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-teal-700 hover:text-teal-900 hover:underline transition-all active:scale-95 inline-block"
                      >
                        {formatContact(farmacia.contact, farmacia.type)}
                      </a>
                      {farmacia.contact2 && (
                        <>
                          <span className="text-slate-400 font-bold">·</span>
                          <a
                            href={getContact2Link(farmacia.contact2)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-bold text-teal-700 hover:text-teal-900 hover:underline transition-all active:scale-95 inline-block"
                          >
                            {formatContact(farmacia.contact2, farmacia.type)}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Tabla para desktop ── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-teal-50 border-b-2 border-teal-500">
                      <th className="px-5 py-4 text-left text-sm sm:text-base font-bold text-teal-950 uppercase tracking-wider">
                        Nombre de la Farmacia
                      </th>
                      <th className="px-5 py-4 text-center text-sm sm:text-base font-bold text-teal-950 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-5 py-4 text-left text-sm sm:text-base font-bold text-teal-950 uppercase tracking-wider">
                        Información de Contacto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmacias.map((farmacia, index) => (
                      <tr
                        key={index}
                        className={`border-b border-slate-200 hover:bg-teal-50/40 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                      >
                        <td className="px-5 py-3.5 font-bold text-base text-slate-900">
                          {farmacia.name}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {getIcon(farmacia.type)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={getContactLink(farmacia)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base sm:text-lg font-bold text-teal-700 hover:text-teal-900 hover:underline transition-all active:scale-95 inline-block"
                            >
                              {formatContact(farmacia.contact, farmacia.type)}
                            </a>
                            {farmacia.contact2 && (
                              <>
                                <span className="text-slate-400 font-bold">·</span>
                                <a
                                  href={getContact2Link(farmacia.contact2)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-base sm:text-lg font-bold text-teal-700 hover:text-teal-900 hover:underline transition-all active:scale-95 inline-block"
                                >
                                  {formatContact(farmacia.contact2, farmacia.type)}
                                </a>
                              </>
                            )}
                            {farmacia.location && (
                              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                                📍 {farmacia.location}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Nota informativa de alto contraste */}
              <div className="mt-8 p-4 bg-teal-50 rounded-xl border border-teal-200 shadow-sm">
                <p className="text-sm sm:text-base text-slate-800 text-center font-medium">
                  💡 <strong className="text-teal-900 font-bold">Consejo:</strong> Haz clic en el número o enlace para contactar directamente por WhatsApp, Telegram o visitar el sitio web.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
