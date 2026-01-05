import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NominaPage() {
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
            Nómina Cantv
          </h1>
          <div className="flex flex-col gap-8">
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/enero_2026.png"
                alt="Información de nómina - Enero 2026"
                width={800}
                height={1120}
                priority
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/CNC_DIC2025.png"
                alt="Información de nómina - Diciembre 2025"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
