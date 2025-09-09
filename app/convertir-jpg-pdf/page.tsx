import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ConvertirJpgPdfPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Convertir JPG a PDF</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Esta sección estará disponible pronto para ayudarte a convertir tus imágenes JPG a un único archivo PDF.
      </p>
      <Link href="/">
        <Button>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Button>
      </Link>
    </div>
  );
}
