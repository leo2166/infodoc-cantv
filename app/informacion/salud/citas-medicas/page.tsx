import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Home, Download } from "lucide-react"

export default function CitasMedicasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <Link href="/informacion/salud">
                <Button variant="outline" className="touch-target">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Servicios de Salud
                </Button>
              </Link>
              <Link href="/informacion/fotos">
                <Button variant="outline" className="touch-target">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a la Galería
                </Button>
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" className="touch-target">
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-8 text-center">
            Información de Citas Médicas
          </h1>

          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center gap-6">
            <Image
              src="/infodoc_citas_medicas.webp"
              alt="Información sobre Citas Médicas"
              width={800}
              height={1131}
              priority
              className="rounded-md object-contain max-w-full h-auto"
            />

            <a
              href="/Citas Medicas.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2"
            >
              <Button variant="default" className="touch-target">
                <Download className="w-4 h-4 mr-2" />
                Descargar Documento PDF
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

