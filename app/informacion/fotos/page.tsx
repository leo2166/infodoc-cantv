"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from "lucide-react";

const imageList = [
  {
    src: 'https://images.pexels.com/photos/4154/clinic-doctor-health-hospital.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Estetoscopio sobre una mesa simbolizando servicios de salud',
    title: 'Gerencia Servicios de Salud',
    href: '/informacion/salud'
  },
  {
    src: '/ghz.jpg',
    alt: 'Información de Gestión Humana Zulia',
    title: 'Gestión Humana Zulia',
    href: '/ghz.jpg' // Corregido: Enlace directo a la imagen
  },
  { src: '/images/digital-payment-system.png', alt: 'Descripción de la imagen de ejemplo 3', title: 'Soporte de Pago' },
  { src: '/images/elderly-medical-care.png', alt: 'Descripción de la imagen de ejemplo 4', title: 'Informe Médico' },
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {imageList.map((image, index) => {
            const cardContent = (
              <Card key={image.src} className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <CardTitle className="truncate">{image.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
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
            );

            if (image.href) {
              return (
                <Link href={image.href} key={index} className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg" target="_blank" rel="noopener noreferrer">
                  {cardContent}
                </Link>
              );
            }

            return cardContent;
          })}
        </div>
      </main>
    </div>
  );
}
