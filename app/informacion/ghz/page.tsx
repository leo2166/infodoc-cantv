import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

export default function GhzPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link href="/informacion/fotos">
              <Button variant="outline" className="touch-target">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la Galería
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="touch-target">
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
            <Image
              src="/Gestion humana actualizado.png"
              alt="Gerencia de Talento Humano"
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
