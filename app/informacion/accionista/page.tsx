import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AccionistaPage() {
  const phoneNumbers = [
    { display: "0212-5004758" },
    { display: "0212-5004945" },
    { display: "0212-5004379" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden relative">
      <Navigation />

      <main className="relative pt-8 pb-12 px-4 sm:px-6 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Botón Volver */}
          <div className="mb-6">
            <Link href="/informacion/fotos">
              <Button variant="outline" className="touch-target">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>

          {/* Contenedor Principal - Efecto Hoja Flotante */}
          <div className="bg-white px-4 py-8 sm:p-12 rounded-2xl shadow-[0_10px_40px_rgba(0,92,185,0.15)] border border-gray-100">

            {/* ENCABEZADO */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-6 relative">
              {/* Izquierda: Título y Logo */}
              <div className="flex flex-col gap-4 w-full sm:w-auto">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-[#005CB9] tracking-tight text-center sm:text-left">
                  Infodoc
                </h1>

                {/* Contenedor Logo + Texto Móvil */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-6 justify-center sm:justify-start">

                  {/* Logo CANTV */}
                  <div className="bg-[#005CB9] rounded-3xl w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] flex-shrink-0 flex items-center justify-center shadow-lg">
                    <Image
                      src="/logocantv.png"
                      alt="CANTV"
                      width={130}
                      height={80}
                      className="object-contain w-20 h-20 sm:w-32 sm:h-24"
                      priority
                    />
                  </div>

                  {/* Texto visible SOLO EN MÓVIL */}
                  <div className="block sm:hidden text-left flex-grow">
                    <h2 className="text-2xl font-extrabold text-[#005CB9] leading-tight">
                      Atención al
                    </h2>
                    <h2 className="text-2xl font-extrabold text-[#005CB9] leading-tight">
                      Accionista
                    </h2>
                    <p className="text-3xl font-extrabold text-[#005CB9] mt-1 leading-none">
                      CANTV
                    </p>
                  </div>
                </div>
              </div>

              {/* Derecha: Texto visible SOLO EN DESKTOP */}
              <div className="hidden sm:block text-right mt-6 sm:mt-0">
                <h2 className="text-5xl font-extrabold text-[#005CB9] leading-tight">
                  Atención al
                </h2>
                <h2 className="text-5xl font-extrabold text-[#005CB9] leading-tight">
                  Accionista
                </h2>
                <p className="text-5xl font-extrabold text-[#005CB9] mt-2">
                  CANTV
                </p>
              </div>
            </div>

            {/* SEPARADOR DE PUNTOS */}
            <div className="flex justify-between items-center gap-1 sm:gap-2 mb-6 overflow-hidden">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full bg-[#005CB9] ${i === 7 ? 'w-5 h-5 sm:w-6 sm:h-6' :
                    i === 6 || i === 8 ? 'w-4 h-4 sm:w-5 sm:h-5' :
                      'w-3 h-3 sm:w-4 sm:h-4'
                    }`}
                />
              ))}
            </div>

            {/* LISTA DE NÚMEROS */}
            <div className="flex justify-center">
              <div className="flex flex-col items-start gap-2 text-left pl-8">
                {phoneNumbers.map((item, index) => (
                  <span
                    key={index}
                    className="text-3xl sm:text-5xl font-extrabold text-black leading-tight"
                  >
                    {item.display}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  )
}
