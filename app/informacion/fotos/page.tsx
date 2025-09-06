"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from "lucide-react";

// --- INSTRUCCIÓN PARA TI ---
// Modifica esta lista con tus propias imágenes.
// Asegúrate de que las rutas (src) coincidan con los archivos que tienes en la carpeta `public/images/`.
const imageList = [
  { src: '/images/placeholder.jpg', alt: 'Descripción de la imagen de ejemplo 1', title: 'Documento de Identidad' },
  { src: '/images/placeholder.svg', alt: 'Descripción de la imagen de ejemplo 2', title: 'Factura de Servicios' },
  { src: '/images/digital-payment-system.png', alt: 'Descripción de la imagen de ejemplo 3', title: 'Soporte de Pago' },
  { src: '/images/elderly-medical-care.png', alt: 'Descripción de la imagen de ejemplo 4', title: 'Informe Médico' },
  // Puedes añadir más imágenes aquí, hasta 50 o las que necesites.
  // Ejemplo: { src: '/images/mi-otra-imagen.png', alt: 'Otra descripción', title: 'Otro Documento' },
];

export default function FotosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="touch-target">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Galería de Información y Documentos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Una guía visual de los documentos y procesos más importantes.
          </p>
        </div>
        
        {imageList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {imageList.map((image, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="truncate">{image.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-[4/3] bg-muted rounded-md overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No hay imágenes para mostrar.</p>
              <p className="text-sm text-muted-foreground mt-2">Añade imágenes a la lista en el archivo de esta página para empezar.</p>
          </div>
        )}
      </main>
    </div>
  );
}