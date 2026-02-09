'use client';

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TasaBcvPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto mb-8">
            <Link href="/">
                <Button variant="outline" className="touch-target">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
                </Button>
            </Link>
        </div>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Tasa de Cambio BCV</h1>
          <p className="text-lg text-muted-foreground">
            Aquí se mostrará información detallada sobre la tasa de cambio del Banco Central de Venezuela.
          </p>
          {/* Aquí se puede agregar más información, como un gráfico histórico, etc. */}
        </div>
      </main>
    </div>
  );
}
