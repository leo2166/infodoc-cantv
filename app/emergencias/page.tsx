import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function EmergenciasPage() {
  // Números de emergencia con sus enlaces tel: (sin guiones)
  const emergencyNumbers = [
    { display: "0800-2268892", tel: "08002268892", bold: true },
    { display: "0800-cantvya", tel: "08002268892", bold: true },
    { display: "sep", tel: "" }, // Separador visual
    { display: "0212-504 71 91", tel: "02125047191", bold: true },
    { display: "0212-504 70 35", tel: "02125047035", bold: true },
    { display: "0212-504 70 37", tel: "02125047037", bold: true },
    { display: "*426 solo movilnet", tel: "*426", bold: true },
    { display: "0412-9140633", tel: "04129140633", bold: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden relative">
      <Navigation />


      <main className="relative pt-8 pb-12 px-4 sm:px-6 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Botón Volver */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="touch-target">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
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

                  {/* Texto visible SOLO EN MÓVIL (al lado del logo) */}
                  <div className="block sm:hidden text-left flex-grow">
                    <h2 className="text-2xl font-extrabold text-[#005CB9] leading-tight">
                      Números de
                    </h2>
                    <h2 className="text-2xl font-extrabold text-[#005CB9] leading-tight">
                      Emergencia
                    </h2>
                    <p className="text-4xl font-extrabold text-[#005CB9] mt-1 leading-none">
                      24 hrs
                    </p>
                  </div>
                </div>
              </div>

              {/* Derecha: Texto visible SOLO EN DESKTOP (alineado a la derecha) */}
              <div className="hidden sm:block text-right mt-6 sm:mt-0">
                <h2 className="text-5xl font-extrabold text-[#005CB9] leading-tight">
                  Números de
                </h2>
                <h2 className="text-5xl font-extrabold text-[#005CB9] leading-tight">
                  Emergencia
                </h2>
                <p className="text-6xl font-extrabold text-[#005CB9] mt-2">
                  24 hrs
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

            {/* TEXTO GUÍA */}
            <h3 className="text-center text-red-600 font-extrabold text-lg sm:text-xl mb-8 uppercase tracking-wide">
              Clic en el número que desea marcar
            </h3>

            {/* LISTA DE NÚMEROS */}
            <div className="flex justify-center">
              <div className="flex flex-col items-start gap-2 text-left pl-8">
                {emergencyNumbers.map((item, index) => {
                  if (item.display === "sep") return <div key={index} className="h-6" />

                  return (
                    <a
                      key={index}
                      href={`tel:${item.tel}`}
                      className="group transition-all duration-200 active:scale-95 hover:scale-105"
                    >
                      <span className={`text-3xl sm:text-5xl text-black leading-tight group-hover:text-[#005CB9] transition-colors ${item.bold ? 'font-extrabold' : 'font-semibold'}`}>
                        {item.display}
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  )
}
