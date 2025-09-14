import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Share2, User, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data - in a real app this would come from a database or CMS
const newsArticles = {
  "aumento-pension-2025": {
    id: "aumento-pension-2025",
    title: "Anunciado Aumento del 15% en Pensiones para 2025",
    excerpt: "CANTV confirma incremento significativo en las pensiones de jubilados, efectivo desde enero 2025",
    category: "Pensiones",
    date: "2025-01-15",
    readTime: "3 min",
    author: "Departamento de Comunicaciones CANTV",
    image: "/elderly-celebration.png",
    content: `
      <p>La Compañía Anónima Nacional Teléfonos de Venezuela (CANTV) se complace en anunciar un incremento del 15% en las pensiones de todos sus jubilados, medida que entrará en vigencia a partir del mes de enero de 2025.</p>
      
      <h2>Detalles del Incremento</h2>
      <p>Este aumento beneficiará a más de 25,000 jubilados de CANTV en todo el territorio nacional y representa el mayor incremento otorgado en los últimos cinco años. La medida forma parte del compromiso continuo de la empresa con el bienestar de sus ex-trabajadores.</p>
      
      <h2>Implementación</h2>
      <p>El incremento se aplicará automáticamente a partir del pago correspondiente al mes de enero de 2025. Los jubilados no necesitan realizar ningún trámite adicional, ya que el ajuste se procesará de manera automática en el sistema de nómina.</p>
      
      <h2>Beneficios Adicionales</h2>
      <p>Además del incremento en las pensiones, CANTV también anunció mejoras en los beneficios médicos y la ampliación de descuentos en farmacias afiliadas. Estos beneficios complementarios estarán disponibles a partir del segundo trimestre de 2025.</p>
      
      <h2>Declaraciones Oficiales</h2>
      <p>"Este incremento refleja nuestro compromiso inquebrantable con quienes dedicaron su vida profesional a CANTV. Reconocemos su valiosa contribución y queremos asegurar que tengan una jubilación digna y tranquila", declaró el Director de Recursos Humanos de la empresa.</p>
      
      <h2>Próximos Pasos</h2>
      <p>Los jubilados recibirán una comunicación oficial detallada durante la primera semana de enero, donde se especificarán los montos exactos del incremento según cada caso particular. Para consultas adicionales, pueden comunicarse con la línea de atención al jubilado.</p>
    `,
  },
  "nuevos-beneficios-medicos": {
    id: "nuevos-beneficios-medicos",
    title: "Ampliación de Cobertura Médica para Jubilados",
    excerpt: "Se incluyen nuevas especialidades médicas y tratamientos en el plan de salud",
    category: "Beneficios",
    date: "2025-01-12",
    readTime: "4 min",
    author: "Departamento de Bienestar Social",
    image: "/elderly-medical-care.png",
    content: `
      <p>CANTV anuncia la ampliación significativa de la cobertura médica para sus jubilados, incorporando nuevas especialidades y tratamientos que mejorarán sustancialmente la atención de salud disponible.</p>
      
      <h2>Nuevas Especialidades Incluidas</h2>
      <p>A partir de febrero de 2025, el plan de salud incluirá cobertura completa para:</p>
      <ul>
        <li>Cardiología intervencionista</li>
        <li>Neurología especializada</li>
        <li>Oncología y tratamientos de quimioterapia</li>
        <li>Fisioterapia y rehabilitación</li>
        <li>Psicología geriátrica</li>
      </ul>
      
      <h2>Tratamientos Especializados</h2>
      <p>La nueva cobertura incluye tratamientos de alta complejidad que anteriormente requerían autorización especial, ahora estarán disponibles de manera directa con la presentación de la credencial de jubilado.</p>
      
      <h2>Red de Proveedores</h2>
      <p>Se han incorporado 15 nuevos centros médicos especializados en atención geriátrica, distribuidos estratégicamente en las principales ciudades del país para facilitar el acceso de los jubilados.</p>
    `,
  },
  // Add more articles as needed
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params
  const article = newsArticles[slug as keyof typeof newsArticles]

  if (!article) {
    notFound()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Pensiones":
        return "bg-secondary text-secondary-foreground"
      case "Beneficios":
        return "bg-accent text-accent-foreground"
      case "Eventos":
        return "bg-chart-3 text-white"
      case "Servicios":
        return "bg-chart-4 text-white"
      case "Bienestar":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/noticias">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Noticias
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(article.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {article.readTime}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">{article.title}</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-muted-foreground">
              <User className="w-4 h-4 mr-2" />
              <span>{article.author}</span>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: article.content.replace(/\n\s*\n/g, "</p><p>").replace(/\n/g, "<br>"),
            }}
          />
        </div>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-heading font-bold mb-4">¿Tienes preguntas sobre esta noticia?</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Línea de Información</p>
                  <p className="text-muted-foreground">0800-CANTV-00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">Correo Electrónico</p>
                  <p className="text-muted-foreground">info@cantv.com.ve</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/noticias">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Ver Más Noticias
            </Button>
          </Link>
          <Link href="/chat-ia">
            <Button className="w-full sm:w-auto">Consultar con IA sobre esta noticia</Button>
          </Link>
        </div>
      </article>
    </div>
  )
}
