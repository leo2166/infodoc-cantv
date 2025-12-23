'use client';

import { useState, useEffect } from 'react';
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Newspaper, MessageCircle, Phone, Mail, MapPin, Users, Shield, Clock, HelpCircle, ArrowDown } from "lucide-react"
import Link from "next/link"
import { ChatWidget } from "@/components/chat-widget"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import FechaHora from '@/components/FechaHora';
import { EmergencyGuideModal } from "@/components/emergency-guide-modal";

export default function HomePage() {
  const [bcvRate, setBcvRate] = useState<string | null>(null);
  const [bcvTimestamp, setBcvTimestamp] = useState<string | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchRate = async () => {
      try {
        setLoadingRate(true);
        const response = await fetch('/api/tasa-bcv');
        const data = await response.json();
        if (data.rate) {
          setBcvRate(data.rate);
          setBcvTimestamp(data.timestamp);
        }
      } catch (error) {
        console.error('Error fetching BCV rate:', error);
      } finally {
        setLoadingRate(false);
        scheduleNextFetch(); // Schedule the next fetch after the current one is done
      }
    };

    const scheduleNextFetch = () => {
      const now = new Date();
      const schedule = [
        { hour: 16, minute: 0 },
        { hour: 16, minute: 30 },
        { hour: 17, minute: 30 },
      ];

      let nextFetchTime: Date | null = null;

      // Find the next fetch time for today
      for (const time of schedule) {
        const fetchTime = new Date();
        fetchTime.setHours(time.hour, time.minute, 0, 0);
        if (fetchTime > now) {
          nextFetchTime = fetchTime;
          break;
        }
      }

      // If all fetch times for today have passed, schedule for the first time tomorrow
      if (!nextFetchTime) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const firstTime = schedule[0];
        tomorrow.setHours(firstTime.hour, firstTime.minute, 0, 0);
        nextFetchTime = tomorrow;
      }

      const delay = nextFetchTime.getTime() - now.getTime();

      timeoutId = setTimeout(fetchRate, delay);
    };

    fetchRate(); // Fetch immediately on mount

    return () => {
      clearTimeout(timeoutId); // Cleanup on unmount
    };
  }, []);



  // ... (rest of the file content)

  const quickLinks = [
    {
      title: "Emergencias médicas",
      description: "Contacto rápido para emergencias de salud",
      icon: Phone,
      href: "/emergencias",
      color: "bg-red-500",
    },
    {
      title: "Nómina Cantv",
      description: "Consulta y gestiona tu información de nómina",
      icon: FileText,
      href: "/nomina",
      color: "bg-blue-500",
    },
    {
      title: "Servicios Funerarios El Rosal",
      description: "Información sobre servicios funerarios",
      icon: Shield,
      href: "/servicios-funerarios",
      color: "bg-slate-500",
    },
  ]

  const services = [
    {
      icon: Users,
      title: "Atención Personalizada",
      description: "Para ampliar cualquier información aquí contenida, comunícate con tu AJUPTEL LOCAL o en su defecto a Gestión Humana.",
    },
    {
      icon: Shield,
      title: "Información Confiable",
      description: "Información oficial mayormente de CANTV, estática y que se actualizará cuando se produzcan cambios.",
    },
    {
      icon: Clock,
      title: "Disponible 24/7",
      description: "Accede a la información cuando la necesites",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main role="main">
        {/* Hero Section */}
        {/* Forzando actualización para Vercel */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto text-center">
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-foreground mb-6"
            >
              Bienvenido a <span className="text-primary">InfoDoc</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Toda la información de interés al alcance de los jubilados de CANTV
            </p>
            <FechaHora />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/informacion/fotos" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 min-h-[56px] touch-target w-full hover:bg-yellow-400"
                  aria-describedby="explore-info-desc"
                >
                  Explorar Información
                </Button>
              </Link>
              <span id="explore-info-desc" className="sr-only">
                Accede a información sobre pensiones, beneficios y trámites
              </span>
              <Link href="/chat-deepseek" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="aiChat"
                  className="text-lg px-8 py-4 min-h-[56px] touch-target w-full hover:bg-yellow-400"
                  aria-describedby="ai-chat-desc"
                >
                  Consultar con IA
                </Button>
              </Link>
              <span id="ai-chat-desc" className="sr-only">
                Haz preguntas a asistentes de inteligencia artificial
              </span>



              <div
                className="text-sm px-8 py-4 h-[56px] flex items-center justify-center rounded-md bg-blue-600 text-white touch-target w-full sm:w-auto"
                aria-live="polite"
              >
                {loadingRate ? (
                  <span>Cargando...</span>
                ) : (
                  <div className="text-center">
                    <span className="block font-bold">Tasa BCV:</span>
                    <span>{bcvRate ? bcvRate.replace('.', ',') : '...'}</span>
                  </div>
                )}
              </div>
            </div>
            {/* New Emergency Text Link */}
            <div className="mt-8 text-center">
              <EmergencyGuideModal>
                <Button
                  size="lg"
                  className="bg-red-500 text-white font-bold hover:bg-yellow-400 text-sm px-8 py-4 min-h-[56px] touch-target w-full sm:w-auto"
                  aria-describedby="emergency-guide-desc"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  <span>¿Qué hacer en caso de emergencia? CLIC AQUÍ</span>
                </Button>
              </EmergencyGuideModal>
              <span id="emergency-guide-desc" className="sr-only">
                Guía completa sobre qué hacer en caso de emergencia. Haz clic aquí para más información.
              </span>
              {/* Arrow pointing to Quick Links */}
              <div className="flex justify-center mt-4">
                <ArrowDown className="w-6 h-6 text-blue-500 animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" aria-labelledby="quick-links-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="quick-links-heading" className="text-3xl font-heading font-bold text-center mb-12">
              Accesos Rápidos
            </h2>
            <div className="grid md:grid-cols-3 gap-8" role="list">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <div key={link.href} role="listitem">
                    <Link href={link.href} aria-describedby={`link-desc-${link.href.replace("/", "")}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                        <CardHeader className="text-center">
                          <div
                            className={`w-16 h-16 ${link.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                            aria-hidden="true"
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-xl">{link.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription
                            className="text-center text-base"
                            id={`link-desc-${link.href.replace("/", "")}`}
                          >
                            {link.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="services-heading" className="text-3xl font-heading font-bold text-center mb-12">
              Nuestros Servicios
            </h2>
            <div className="grid md:grid-cols-3 gap-8" role="list">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <div key={index} className="text-center" role="listitem">
                    <div
                      className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      aria-hidden="true"
                    >
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" aria-labelledby="contact-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="contact-heading" className="text-3xl font-heading font-bold mb-8">
              ¿Necesitas Ayuda Adicional?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6" role="list">
              <div className="flex flex-col items-center" role="listitem">
                <Phone className="w-8 h-8 text-primary mb-2" aria-hidden="true" />
                <h3 className="font-semibold mb-1">Teléfono</h3>
                <p className="text-muted-foreground">

                </p>
              </div>
              <div className="flex flex-col items-center" role="listitem">
                <Mail className="w-8 h-8 text-primary mb-2" aria-hidden="true" />
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-muted-foreground">
                  <a
                    href="mailto:jubilados@cantv.com.ve"
                    className="hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    jubilados@cantv.com.ve
                  </a>
                </p>
              </div>
              <div className="flex flex-col items-center" role="listitem">
                <MapPin className="w-8 h-8 text-primary mb-2" aria-hidden="true" />
                <h3 className="font-semibold mb-1">Oficinas</h3>
                <p className="text-muted-foreground">Maracaibo, Venezuela</p>
              </div>
            </div>
          </div>
        </section>
      </main>



      {/* <ChatWidget /> */}

      <PWAInstallPrompt />

      {/* Footer */}
      <footer className="bg-card py-8 px-4 sm:px-6 lg:px-8 border-t border-border" role="contentinfo">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center" aria-hidden="true">
              <span className="text-primary-foreground font-bold text-sm">ID</span>
            </div>
            <span className="font-heading font-black text-lg">InfoDoc</span>
          </div>
          <p className="text-muted-foreground mb-2">Portal de información para jubilados de CANTV</p>
          <div className="text-sm text-muted-foreground my-4">
            <p>Desarrollado por <strong>Ing. Lucidio Fuenmayor</strong> con la asistencia de <strong>IA Gemini CLI</strong>.</p>
            <p>Licencia de Uso Libre.</p>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 InfoDoc. Toda la información de interés al alcance.</p>
        </div>
      </footer>
    </div>
  )
}