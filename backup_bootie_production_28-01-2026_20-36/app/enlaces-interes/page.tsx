
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export default function EnlacesInteresPage() {
  const links = [
    {
      title: "Cantv",
      href: "http://www.Cantv.com.ve",
    },
    {
      title: "Banco Central de Venezuela",
      href: "http://www.bcv.org.ve",
    },
    {
      title: "Tutorial Reembolso",
      href: "https://youtu.be/nLq4uAbeTC8",
    },
    {
      title: "Tutorial Farmacantv",
      href: "https://youtu.be/9btLVX1LF6s",
    },
    {
      title: "Banco de Venezuela",
      href: "http://www.bancodevenezuela.com",
    },
    {
      title: "Banco Mercantil",
      href: "http://www.mercantilbanco.com",
    },
    {
      title: "Banesco",
      href: "http://www.banesco.com",
    },
    {
      title: "Banco Provincial",
      href: "http://www.provincial.com",
    },
    {
      title: "Preferencia Musical",
      href: "https://lfplayer.vercel.app",
    },
  ]

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
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Enlaces de Interés
            </h1>
            <p className="text-xl text-muted-foreground">
              Una colección de enlaces útiles a sitios web externos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <LinkIcon className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle>{link.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
