import { Navigation } from "@/components/navigation"
import { FileUploadToR2 } from "@/components/file-upload-to-r2"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SubirArchivosPage() {
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

                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                            Subir Archivos
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Sube documentos PDF o imágenes directamente a Cloudflare R2.
                            Los archivos quedarán disponibles públicamente a través de un enlace.
                        </p>
                    </div>

                    <FileUploadToR2 />

                    <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold mb-2">ℹ️ Información Importante</h3>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Los archivos se suben a Cloudflare R2 (no a Vercel)</li>
                            <li>Esto ahorra espacio en Vercel y aprovecha el CDN de Cloudflare</li>
                            <li>Tipos permitidos: PDF, JPG, PNG, WebP</li>
                            <li>Tamaño máximo: 50 MB por archivo</li>
                            <li>Los archivos son públicos y accesibles por cualquiera con el enlace</li>
                            <li>Guarda el enlace generado para compartir el archivo</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
