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
                src="/Nomina_año_2026.png"
                alt="Cronograma de pago CANTV - Anual 2026"
                width={800}
                height={1120}
                priority
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/marzo_2026.png"
                alt="Cronograma de pago CANTV - Marzo 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/Abril_2_2026.png"
                alt="Cronograma de pago CANTV - Abril 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/Nomina_05_2026.png"
                alt="Cronograma de pago CANTV - Mayo 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/Nomina_06_2026.png"
                alt="Cronograma de pago CANTV - Junio 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/Nomina_07_2026.png"
                alt="Cronograma de pago CANTV - Julio 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/8.jpg"
                alt="Cronograma de pago CANTV - Agosto 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/9.jpg"
                alt="Cronograma de pago CANTV - Septiembre 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/10.jpg"
                alt="Cronograma de pago CANTV - Octubre 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/11.jpg"
                alt="Cronograma de pago CANTV - Noviembre 2026"
                width={800}
                height={1120}
                className="rounded-md object-contain"
              />
            </div>
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md flex justify-center">
              <Image
                src="/12.jpg"
                alt="Cronograma de pago CANTV - Diciembre 2026"
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
