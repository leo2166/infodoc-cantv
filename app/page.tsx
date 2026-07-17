'use client';

import { useState, useEffect } from 'react';
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Newspaper, MessageCircle, Phone, Mail, MapPin, Users, Shield, Clock, HelpCircle, ArrowDown, FileSearch, Calendar } from "lucide-react"
import Link from "next/link"
import { ChatWidget } from "@/components/chat-widget"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
// import { RippleBackground } from "@/components/ui/ripple-background"  // Comentado temporalmente
import FechaHora from '@/components/FechaHora';
import { NewsTicker } from "@/components/news-ticker";
import BootieWidget from "@/components/bootie-widget";
import { HeroMenu } from "@/components/hero-menu";
import { SidebarPanel } from "@/components/sidebar-panel";

export default function HomePage() {

  const quickLinks = [
    {
      title: "Emergencias médicas",
      description: "Contacto rápido para emergencies de salud",
      icon: Phone,
      href: "/emergencias",
      color: "bg-red-500",
    },
    {
      title: "Nómina Cantv",
      description: "Consulta y gestiona tu información de nómina",
      icon: Calendar,
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
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Fondo MOVIL: Bandera Zulia de punta a punta con cortina glass */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden lg:hidden">
        <img
          src="/Bzulia.webp"
          alt="Fondo bandera del Zulia"
          className="w-full h-full object-cover opacity-20"
          loading="lazy"
          decoding="async"
        />
        {/* Cortina glass movil: misma capa blanca semitransparente */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/75 backdrop-blur-[2px]" />
      </div>

      {/* Fondo PC: fusionbanderas de punta a punta (absolute = cubre todo el documento) */}
      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/Bzulia.webp"
          alt="Fondo bandera del Zulia"
          className="w-full h-full object-cover opacity-20"
          loading="lazy"
          decoding="async"
        />
        {/* Cortina glass: capa blanca semitransparente uniforme sobre toda la imagen */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/75 backdrop-blur-[2px]" />
      </div>
      <Navigation />

      <main role="main" className="relative overflow-x-hidden">

        {/* === VERSION NUEVA - REDISENO CON CUADRADO MENU PLANO === */}
        <section className="relative py-3 sm:py-6 lg:min-h-[calc(100vh-3.5rem)] px-3 sm:px-6 lg:px-8 flex flex-col justify-between overflow-hidden">

          <div className="relative z-10 max-w-7xl mx-auto w-full mt-0 lg:my-auto">

            {/* MOVIL: widgets SOBRE el menu */}
            <div className="lg:hidden w-full flex flex-col items-center mb-3">
              {/* Título en azul — solo móvil */}
              <p className="text-lg font-anton text-blue-600 dark:text-blue-400 leading-relaxed uppercase tracking-widest text-center mb-3 px-2">
                Toda la información de interés al alcance de los jubilados de CANTV
              </p>
              <div className="w-full">
                <SidebarPanel />
              </div>
            </div>

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-center">

              {/* Columna izquierda — solo desktop */}
              <div className="hidden lg:flex lg:col-span-2 flex-col items-start text-left space-y-5">
                <div className="w-12 h-1 bg-blue-600 rounded-full" />
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-600 dark:text-slate-300">
                    Bienvenido a
                  </h2>
                  <h1 className="text-5xl sm:text-6xl font-heading font-black text-blue-600 dark:text-blue-400 tracking-tight leading-none">
                    InfoDoc
                  </h1>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 max-w-xs font-bold leading-relaxed">
                  Toda la información de interés al alcance de los jubilados de CANTV
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
                  Asociados Jubilados CANTV
                </p>
              </div>

              {/* Columna Central: menú plano 2x2 — siempre visible */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center overflow-visible relative">
                {/* Blur expansivo de fondo en negro, aumentado de tamaño y desenfoque */}
                <div className="absolute w-[540px] h-[540px] rounded-full bg-black/15 dark:bg-black/50 blur-[120px] pointer-events-none z-0" />
                
                {/* Balón de fútbol para PC (encima del menú) */}
                <a
                  href="https://copa26lf.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center mb-4 w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:scale-110 active:scale-95 transition-all duration-300 relative z-10"
                  title="Mundial de Fútbol 2026"
                >
                  <span className="text-2xl leading-none animate-[spin_10s_linear_infinite]">⚽</span>
                </a>

                <div className="relative z-10 mx-auto flex items-center justify-center w-full">
                  <HeroMenu />
                </div>
              </div>

              {/* Columna Derecha: widgets — solo desktop */}
              <div className="hidden lg:flex lg:col-span-3 justify-center w-full">
                <SidebarPanel />
              </div>

            </div>

          </div>
        </section>

        {/* SECCIONES ADICIONALES */}
        <section className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/40" aria-labelledby="quick-links-heading">
          <div className="max-w-4xl mx-auto">
            <h2 id="quick-links-heading" className="text-2xl font-heading font-bold text-center mb-8">
              Accesos Rápidos
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10" role="list">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                const isEmergency = link.href === '/emergencias';
                const isNomina = link.href === '/nomina';
                
                // Texto: Emergencias en rojo, Nómina en azul, Servicios Funerarios en gris/neutral
                const textClass = isEmergency 
                  ? "text-red-600 dark:text-red-400 font-extrabold hover:text-red-700 hover:scale-105"
                  : isNomina
                    ? "text-blue-600 dark:text-blue-400 font-extrabold hover:text-blue-700 hover:scale-105"
                    : "text-slate-700 dark:text-slate-300 font-extrabold hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105";
                
                // Iconos: Emergencias en rojo, Nómina en azul, Funeraria en azul
                const iconColor = isEmergency 
                  ? "text-red-600 dark:text-red-400 animate-pulse"
                  : "text-blue-600 dark:text-blue-400";
                  
                return (
                  <div key={link.href} role="listitem">
                    <Link 
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 ${textClass}`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
                      <span className="text-base tracking-wide">{link.title}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200/50 dark:border-slate-800/40" aria-labelledby="services-heading">
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

        <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="contact-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="contact-heading" className="text-3xl font-heading font-bold mb-8">
              ¿Necesitas Ayuda Adicional?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6" role="list">
              <div className="flex flex-col items-center" role="listitem">
                <Phone className="w-8 h-8 text-primary mb-2" aria-hidden="true" />
                <h3 className="font-semibold mb-1">Teléfono</h3>
                <p className="text-muted-foreground">
                  {/* Teléfono de contacto */}
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


      {/* Widget Bootie - solo pantalla principal */}
      <BootieWidget />

      <PWAInstallPrompt />

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-slate-950/70 backdrop-blur-sm pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/40" role="contentinfo">
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
