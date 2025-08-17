import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, TrendingUp, Users, DollarSign, Heart } from "lucide-react"
import Link from "next/link"

export default function NoticiasPage() {
  const featuredNews = {
    id: "aumento-pension-2025",
    title: "Anunciado Aumento del 15% en Pensiones para 2025",
    excerpt: "CANTV confirma incremento significativo en las pensiones de jubilados, efectivo desde enero 2025",
    category: "Pensiones",
    date: "2025-01-15",
    readTime: "3 min",
    image: "/elderly-celebration.png",
    featured: true,
  }

  const recentNews = [
    {
      id: "nuevos-beneficios-medicos",
      title: "Ampliación de Cobertura Médica para Jubilados",
      excerpt: "Se incluyen nuevas especialidades médicas y tratamientos en el plan de salud",
      category: "Beneficios",
      date: "2025-01-12",
      readTime: "4 min",
      image: "/elderly-medical-care.png",
    },
    {
      id: "evento-navidad-jubilados",
      title: "Gran Celebración Navideña para Jubilados de CANTV",
      excerpt: "Evento especial con actividades, regalos y almuerzo para toda la familia",
      category: "Eventos",
      date: "2025-01-10",
      readTime: "2 min",
      image: "/elderly-christmas-celebration.png",
    },
    {
      id: "nuevas-oficinas-atencion",
      title: "Apertura de Nuevas Oficinas de Atención al Jubilado",
      excerpt: "Tres nuevas sedes para mejorar la atención y reducir tiempos de espera",
      category: "Servicios",
      date: "2025-01-08",
      readTime: "3 min",
      image: "/modern-office-building.png",
    },
    {
      id: "programa-recreacion",
      title: "Lanzamiento del Programa de Recreación y Bienestar",
      excerpt: "Actividades físicas, talleres y excursiones diseñadas especialmente para jubilados",
      category: "Bienestar",
      date: "2025-01-05",
      readTime: "5 min",
      image: "/elderly-recreation.png",
    },
    {
      id: "actualizacion-sistema-pagos",
      title: "Modernización del Sistema de Pagos de Pensiones",
      excerpt: "Nuevo sistema digital para consultas y gestión de pagos más eficiente",
      category: "Tecnología",
      date: "2025-01-03",
      readTime: "4 min",
      image: "/digital-payment-system.png",
    },
  ]

  const categories = [
    { name: "Todas", count: 12, color: "bg-primary", icon: TrendingUp },
    { name: "Pensiones", count: 4, color: "bg-secondary", icon: DollarSign },
    { name: "Beneficios", count: 3, color: "bg-accent", icon: Heart },
    { name: "Eventos", count: 2, color: "bg-chart-3", icon: Users },
    { name: "Servicios", count: 2, color: "bg-chart-4", icon: Clock },
    { name: "Bienestar", count: 1, color: "bg-chart-5", icon: Heart },
  ]

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Noticias y Novedades</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mantente informado sobre las últimas noticias, beneficios y eventos para jubilados de CANTV
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button key={category.name} variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            )
          })}
        </div>

        {/* Featured News */}
        <Card className="mb-12 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={featuredNews.image || "/placeholder.svg"}
                alt={featuredNews.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="flex items-center space-x-4 mb-4">
                <Badge className={getCategoryColor(featuredNews.category)}>{featuredNews.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(featuredNews.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {featuredNews.readTime}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">{featuredNews.title}</h2>
              <p className="text-muted-foreground text-lg mb-6">{featuredNews.excerpt}</p>
              <Link href={`/noticias/${featuredNews.id}`}>
                <Button size="lg">
                  Leer Noticia Completa
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Recent News Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-8">Noticias Recientes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNews.map((news) => (
              <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img src={news.image || "/placeholder.svg"} alt={news.title} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(news.category)}>{news.category}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {news.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">{news.excerpt}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(news.date).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <Link href={`/noticias/${news.id}`}>
                      <Button variant="ghost" size="sm">
                        Leer más
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-heading font-bold mb-4">¿No te quieres perder ninguna noticia?</h3>
              <p className="text-muted-foreground mb-6">
                Suscríbete a nuestro boletín informativo y recibe las noticias más importantes directamente en tu correo
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>Suscribirse</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Respetamos tu privacidad. Puedes cancelar la suscripción en cualquier momento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
