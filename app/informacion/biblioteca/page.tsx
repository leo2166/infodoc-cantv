"use client";

import Link from 'next/link';
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookUp } from "lucide-react";

const bookList = [
  {
    title: "La Inteligencia Artificial explicada a los humanos",
    author: "Jordi Torres",
    href: "/LibroL1.pdf"
  },
  {
    title: "El poder del Metabolismo",
    author: "Frank Suárez",
    href: "/LibroL2.pdf"
  },
  {
    title: "Diabetes Sin Problemas",
    author: "Frank Suárez",
    href: "/LibroL3.pdf"
  },
  {
    title: "Dieta Cetogénica Reto Keto 28 Días",
    author: "Barbara White",
    href: "/LibroL4 .pdf" // Note the space in the filename
  },
];

export default function BibliotecaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href="/informacion/fotos">
            <Button variant="outline" className="touch-target">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la Galería
            </Button>
          </Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Biblioteca
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecciona un libro para comenzar a leer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookList.map((book) => (
            <a 
              href={book.href} 
              key={book.title} 
              target="_blank" 
              rel="noopener noreferrer"
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg block h-full"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookUp className="w-8 h-8 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{book.author}</CardDescription>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
