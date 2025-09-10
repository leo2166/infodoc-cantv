import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

const documents = [
  {
    title: "Estatutos de AJUPTEL ZULIA",
    fileName: "Estatutos.pdf",
    description: "Documento completo con los estatutos de la Asociación de Jubilados y Pensionados de Teléfonos de Venezuela, seccional Zulia.",
    href: "/documentos/Estatutos.pdf",
  },
  {
    title: "Convención Colectiva FETRATEL-CANTV 2023-2025",
    fileName: "Cc.pdf",
    description: "Contrato colectivo de trabajo entre la Federación de Trabajadores de Telecomunicaciones de Venezuela y CANTV.",
    href: "/documentos/Cc.pdf",
  },
];

export default function DocumentosPage() {
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
            Consulta de Documentos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Accede a los documentos importantes para la comunidad de jubilados.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-1 gap-8">
          {documents.map((doc) => (
            <Card key={doc.href} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                   <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={doc.href} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full sm:w-auto">
                    <FileText className="w-4 h-4 mr-2" />
                    Abrir Documento (PDF)
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}