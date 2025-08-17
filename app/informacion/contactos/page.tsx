import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, Mail, MapPin, Clock, Users, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ContactosPage() {
  const mainContacts = [
    {
      title: "Línea Principal de Jubilados",
      phone: "0800-CANTV-00",
      description: "Atención general para consultas sobre pensiones y beneficios",
      hours: "Lunes a Viernes: 8:00 AM - 6:00 PM",
      icon: Phone,
      color: "bg-primary",
    },
    {
      title: "Departamento de Beneficios",
      phone: "0800-CANTV-01",
      description: "Información específica sobre beneficios sociales y descuentos",
      hours: "Lunes a Viernes: 8:00 AM - 4:00 PM",
      icon: Users,
      color: "bg-secondary",
    },
    {
      title: "Línea de Emergencias",
      phone: "0800-CANTV-911",
      description: "Atención urgente para situaciones críticas",
      hours: "24 horas, 7 días a la semana",
      icon: AlertCircle,
      color: "bg-destructive",
    },
  ]

  const regionalOffices = [
    {
      region: "Caracas - Sede Principal",
      address: "Torre CANTV, Av. Libertador, Caracas",
      phone: "(0212) 500-2000",
      email: "jubilados.caracas@cantv.com.ve",
      hours: "Lunes a Viernes: 8:00 AM - 4:00 PM",
    },
    {
      region: "Maracaibo - Zulia",
      address: "Av. 5 de Julio, Centro Comercial Doral, Maracaibo",
      phone: "(0261) 700-1500",
      email: "jubilados.zulia@cantv.com.ve",
      hours: "Lunes a Viernes: 8:00 AM - 4:00 PM",
    },
    {
      region: "Valencia - Carabobo",
      address: "Av. Bolívar Norte, Edificio CANTV, Valencia",
      phone: "(0241) 800-1200",
      email: "jubilados.carabobo@cantv.com.ve",
      hours: "Lunes a Viernes: 8:00 AM - 4:00 PM",
    },
    {
      region: "Barquisimeto - Lara",
      address: "Carrera 19, Centro Empresarial, Barquisimeto",
      phone: "(0251) 600-1800",
      email: "jubilados.lara@cantv.com.ve",
      hours: "Lunes a Viernes: 8:00 AM - 4:00 PM",
    },
  ]

  const onlineServices = [
    {
      service: "Portal Web Oficial",
      url: "www.cantv.com.ve/jubilados",
      description: "Consultas en línea y trámites digitales",
    },
    {
      service: "Email General",
      url: "jubilados@cantv.com.ve",
      description: "Consultas generales y solicitudes por correo",
    },
    {
      service: "Chat en Línea",
      url: "Disponible en el portal web",
      description: "Atención inmediata durante horario laboral",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/informacion">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Información
            </Button>
          </Link>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Contactos Importantes</h1>
          <p className="text-xl text-muted-foreground">
            Encuentra todos los números y direcciones para contactar con CANTV
          </p>
        </div>

        {/* Main Contact Lines */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {mainContacts.map((contact, index) => {
            const Icon = contact.icon
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{contact.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-primary">{contact.phone}</p>
                    <p className="text-sm text-muted-foreground">{contact.description}</p>
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {contact.hours}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Regional Offices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              Oficinas Regionales
            </CardTitle>
            <CardDescription>Ubicaciones físicas para atención presencial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              {regionalOffices.map((office, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-primary">{office.region}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{office.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Online Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Servicios en Línea</CardTitle>
            <CardDescription>Canales digitales para consultas y trámites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {onlineServices.map((service, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">{service.service}</h4>
                  <p className="text-primary font-medium mb-2">{service.url}</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="border-l-4 border-l-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Contacto de Emergencia</h3>
                <p className="text-muted-foreground mb-4">
                  Para situaciones urgentes relacionadas con el pago de pensiones o problemas críticos con beneficios,
                  utiliza nuestra línea de emergencias disponible las 24 horas.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="text-destructive border-destructive bg-transparent">
                    <Phone className="w-4 h-4 mr-2" />
                    0800-CANTV-911
                  </Button>
                  <Link href="/chat-ia">
                    <Button variant="outline">Consultar con IA</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
