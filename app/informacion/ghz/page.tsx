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
              src="/ghz.jpg"
              alt="Información sobre Gestión Humana Zulia"
              width={800} 
              height={1120}
              priority
              className="rounded-md object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
