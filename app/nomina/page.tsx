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
            Nómina Cantv 2026
          </h1>
          <div className="flex flex-col gap-8">
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/10oct.webp"
                alt="Cronograma de pago CANTV - Octubre 2026"
                width={800}
                height={618}
                priority
                className="rounded-md object-contain w-full h-auto max-w-[800px]"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/11nov.webp"
                alt="Cronograma de pago CANTV - Noviembre 2026"
                width={800}
                height={618}
                className="rounded-md object-contain w-full h-auto max-w-[800px]"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/12dic.webp"
                alt="Cronograma de pago CANTV - Diciembre 2026"
                width={800}
                height={618}
                className="rounded-md object-contain w-full h-auto max-w-[800px]"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-heading font-semibold text-foreground mb-4 text-center">
                Distribución de la Nómina Actual
              </h2>
              <div className="flex justify-center">
                <Image
                  src="/distribucion-nomina-actual.webp"
                  alt="Distribución de la Nómina Actual CANTV"
                  width={800}
                  height={1120}
                  className="rounded-md object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
