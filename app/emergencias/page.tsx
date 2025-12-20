import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function EmergenciasPage() {
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
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-8 text-center">
            Números de Contacto para Emergencias
          </h1>
          <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
          <Image
            src="/NE.jpg"
            alt="Números de Emergencia"
            width={1200}
            height={800}
            className="rounded-lg shadow-lg"
          />
          </div>
        </div>
      </main>
    </div>
  )
}
