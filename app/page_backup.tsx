'use client';

import { useState, useEffect } from 'react';
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Newspaper, MessageCircle, Phone, Mail, MapPin, Users, Shield, Clock, HelpCircle, ArrowDown, FileSearch } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ChatWidget } from "@/components/chat-widget"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import FechaHora from '@/components/FechaHora';
import { EmergencyGuideModal } from "@/components/emergency-guide-modal";
import { NewsTicker } from "@/components/news-ticker"; 
import BootieWidget from "@/components/bootie-widget";
import { AnnouncementModal } from "@/components/announcement-modal";

export default function HomePageBackup() {

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
      <AnnouncementModal />
      <Navigation />

      <main role="main" className="relative">

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 hero-gradient" aria-labelledby="hero-heading">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/fusionbanderas.webp"
              alt="Fondo de banderas fusionadas"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-10"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-foreground mb-6"
            >
              Bienvenido a <span className="text-primary">InfoDoc</span>
            </h1>
            <div className="flex justify-center mb-4">
              <a
                href="https://copa26lf.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                title="Copa Mundial de Fútbol 2026 ⚽"
                aria-label="Visitar página del Mundial de Fútbol 2026"
                className="group flex flex-col items-center gap-2 no-underline"
              >
                <div className="relative" style={{ width: 80, height: 80 }}>
                  <svg
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      animation: 'soccerBounce 2s ease-in-out infinite',
                      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))',
                    }}
                    aria-hidden="true"
                  >
                    <defs>
                      <radialGradient id="ballGrad" cx="38%" cy="35%" r="55%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="70%" stopColor="#eaeaea" />
                        <stop offset="100%" stopColor="#a0a0a0" />
                      </radialGradient>
                      <clipPath id="ballClip">
                        <circle cx="50" cy="50" r="47.5" />
                      </clipPath>
                    </defs>
                    <circle cx="50" cy="50" r="47.5" fill="url(#ballGrad)" />
                    <g clipPath="url(#ballClip)">
                      <line x1="65.2" y1="93.0" x2="86.2" y2="77.8" stroke="#111" strokeWidth="2.5" />
                      <line x1="95.6" y1="48.9" x2="87.6" y2="24.1" stroke="#111" strokeWidth="2.5" />
                      <line x1="63.0" y1="6.2" x2="37.0" y2="6.2" stroke="#111" strokeWidth="2.5" />
                      <line x1="12.4" y1="24.1" x2="13.8" y2="42.0" stroke="#111" strokeWidth="2.5" />
                      <line x1="4.4" y1="70.9" x2="34.8" y2="93.0" stroke="#111" strokeWidth="2.5" />
                      
                      <line x1="50" y1="66" x2="50" y2="82" stroke="#111" strokeWidth="2.5" />
                      <line x1="65.2" y1="54.9" x2="80.4" y2="59.9" stroke="#111" strokeWidth="2.5" />
                      <line x1="59.4" y1="37.1" x2="68.8" y2="24.1" stroke="#111" strokeWidth="2.5" />
                      <line x1="40.6" y1="37.1" x2="31.2" y2="24.1" stroke="#111" strokeWidth="2.5" />
                      <line x1="34.8" y1="54.9" x2="19.6" y2="59.9" stroke="#111" strokeWidth="2.5" />

                      <polygon points="50,82 34.8,93.0 30,110 70,110 65.2,93.0" fill="#111" stroke="#111" strokeWidth="1" />
                      <polygon points="80.4,59.9 86.2,77.8 100,90 110,60 95.6,48.9" fill="#111" stroke="#111" strokeWidth="1" />
                      <polygon points="68.8,24.1 87.6,24.1 110,10 80,-10 63.0,6.2" fill="#111" stroke="#111" strokeWidth="1" />
                      <polygon points="31.2,24.1 37.0,6.2 20,-10 -10,10 12.4,24.1" fill="#111" stroke="#111" strokeWidth="1" />
                      <polygon points="19.6,59.9 13.8,42.0 -10,30 -10,90 4.4,70.9" fill="#111" stroke="#111" strokeWidth="1" />
                      
                      <polygon points="50,66 65.2,54.9 59.4,37.1 40.6,37.1 34.8,54.9" fill="#111" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
                    </g>
                    <circle cx="50" cy="50" r="47.5" fill="none" stroke="#111" strokeWidth="3" />
                    <path d="M 50 5 A 45 45 0 0 1 85 20 A 40 40 0 0 0 15 20 A 45 45 0 0 1 50 5 Z" fill="#ffffff" opacity="0.4" />
                  </svg>
                </div>
                <span
                  className="text-xs font-bold tracking-widest uppercase text-primary group-hover:text-primary/80 transition-colors"
                  style={{ letterSpacing: '0.15em' }}
                >
                  ⚽ Mundial 2026
                </span>
              </a>
            </div>
            <style>{`
              @keyframes soccerBounce {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                30% { transform: translateY(-14px) rotate(15deg); }
                60% { transform: translateY(-6px) rotate(8deg); }
                80% { transform: translateY(-10px) rotate(12deg); }
              }
            `}</style>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Toda la información de interés al alcance de los jubilados de CANTV
            </p>
            <div className="datetime-widget inline-block mb-8">
              <FechaHora />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/informacion/fotos" className="w-full sm:w-auto">
                <button
                  className="font-anton text-lg px-8 py-4 min-h-[56px] touch-target w-full rounded-lg btn-explore flex items-center justify-center gap-2"
                  aria-describedby="explore-info-desc"
                >
                  <FileSearch className="w-5 h-5 mr-1" />
                  Información CANTV
                </button>
              </Link>
              <span id="explore-info-desc" className="sr-only">
                Accede a información sobre pensiones, beneficios y trámites
              </span>
              <Link href="/chat-deepseek" className="w-full sm:w-auto">
                <button
                  className="font-anton text-lg px-8 py-4 min-h-[56px] touch-target w-full rounded-lg btn-ai flex items-center justify-center gap-2"
                  aria-describedby="ai-chat-desc"
                >
                  ✨ Consultar con IA
                </button>
              </Link>
              <span id="ai-chat-desc" className="sr-only">
                Haz preguntas a asistentes de inteligencia artificial
              </span>

              <a
                href="https://leo2166.github.io/news-scraper/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-anton text-lg px-8 py-4 h-[56px] flex items-center justify-center rounded-lg btn-news touch-target w-full sm:w-auto gap-2"
                aria-label="Noticias y Tasas del Dólar en Venezuela"
              >
                📰 Noticias y Tasas Bs/$
              </a>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <EmergencyGuideModal>
                <button
                  className="font-bold text-sm px-8 py-4 min-h-[56px] touch-target w-full sm:w-auto rounded-lg btn-emergency flex items-center justify-center gap-2"
                  aria-describedby="emergency-guide-desc"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span>¿Qué hacer en caso de emergencia? CLIC AQUÍ</span>
                </button>
              </EmergencyGuideModal>
              <span id="emergency-guide-desc" className="sr-only">
                Guía completa sobre qué hacer en caso de emergencia. Haz clic aquí para más información.
              </span>
              <div className="flex justify-center mt-4">
                <ArrowDown className="w-6 h-6 text-blue-500 animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="quick-links-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="quick-links-heading" className="text-3xl font-heading font-bold text-center mb-12">
              Accesos Rápidos
            </h2>
            <div className="grid md:grid-cols-3 gap-8" role="list">
              {quickLinks.map((link, index) => {
                const Icon = link.icon
                const cardColorClass = link.href === '/emergencias' ? 'card-emergency'
                  : link.href === '/nomina' ? 'card-nomina'
                    : 'card-funeraria'
                return (
                  <div key={link.href} role="listitem">
                    <Link href={link.href} aria-describedby={`link-desc-${link.href.replace("/", "")}`}>
                      <div className={`h-full glass-card ${cardColorClass} rounded-xl p-6 cursor-pointer transition-all duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2`}>
                        <div className="text-center">
                          <div
                            className={`w-16 h-16 ${link.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                            aria-hidden="true"
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl font-heading font-semibold mb-2">{link.title}</h3>
                          <p
                            className="text-muted-foreground text-base"
                            id={`link-desc-${link.href.replace("/", "")}`}
                          >
                            {link.description}
                          </p>
                        </div>
                      </div>
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

      <BootieWidget />
      <PWAInstallPrompt />
    </div>
  )
}
