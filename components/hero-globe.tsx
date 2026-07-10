'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Newspaper,
  HeartPulse,
  FileImage,
  Link as LinkIcon,
  Headphones,
  Users,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
//  DISEÑO DEL CANVAS ESCALABLE (Dimensiones lógicas fijas)
// ═══════════════════════════════════════════════════════════════════
const W    = 800;   // Ancho del canvas
const H    = 800;   // Alto del canvas
const PCX  = 400;   // Centro X
const PCY  = 400;   // Centro Y
const PR   = 290;   // Radio del planeta
const IR   = 255;   // Radio orbital — cerca del centro pero tarjetas legibles

const CARD_W = 142; // Ancho de las tarjetas
const CARD_H = 136; // Alto similar → tarjetas casi cuadradas
const ICON_D = 50;  // Diámetro del ícono circular

interface GNode {
  angle: number;
  title: string;
  desc: string;
  href: string;
  external?: boolean;
  bg: string;
  gradEnd: string;
  Icon: React.FC<{ size?: number; color?: string }>;
}

const NODES: GNode[] = [
  {
    angle: -90, // 12 en punto
    title: 'Documentos Importantes', desc: 'Accede a formularios y manuales',
    href: '/construccion',
    bg: '#0d9e6e', gradEnd: '#05d890', Icon: FileText,
  },
  {
    angle: -30, // 2 en punto
    title: 'Noticias y Tasas Bs/$', desc: 'Mantente al día con las últimas noticias',
    href: 'https://leo2166.github.io/news-scraper/', external: true,
    bg: '#7c3aed', gradEnd: '#a855f7', Icon: Newspaper,
  },
  {
    angle: 30, // 4 en punto
    title: 'Farmacias Locales', desc: 'Encuentra farmacias cerca de ti',
    href: '/farmacias',
    bg: '#1d6ef5', gradEnd: '#38bdf8', Icon: HeartPulse,
  },
  {
    angle: 90, // 6 en punto
    title: 'Convertir JPG > PDF', desc: 'Convierte tus imágenes a PDF fácilmente',
    href: '/convertir-jpg-pdf',
    bg: '#16a34a', gradEnd: '#4ade80', Icon: FileImage,
  },
  {
    angle: 150, // 8 en punto
    title: 'Enlaces de Interés', desc: 'Sitios web útiles para jubilados',
    href: '/enlaces-interes',
    bg: '#d97706', gradEnd: '#fbbf24', Icon: LinkIcon,
  },
  {
    angle: 210, // 10 en punto
    title: 'Asistencia y Soporte', desc: 'Estamos para ayudarte',
    href: '/chat-deepseek',
    bg: '#dc2626', gradEnd: '#f87171', Icon: Headphones,
  },
];

const toRad = (d: number) => (d * Math.PI) / 180;

// Calcula la posición exacta del contenedor de la tarjeta para centrarlo simétricamente
function getCardStyle(angle: number) {
  const rad = toRad(angle);
  const x = PCX + IR * Math.cos(rad);
  const y = PCY + IR * Math.sin(rad);
  return {
    position: 'absolute' as const,
    left: x - CARD_W / 2,
    top: y - CARD_H / 2,
    width: CARD_W,
    height: CARD_H,
    zIndex: 40,
  };
}

function Lnk({ n, children }: { n: GNode; children: React.ReactNode }) {
  if (n.external) {
    return <a href={n.href} target="_blank" rel="noopener noreferrer" className="no-underline block">{children}</a>;
  }
  return <Link href={n.href} className="no-underline block">{children}</Link>;
}

export function HeroGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calc = () => {
      if (wrapRef.current) {
        const aw = wrapRef.current.clientWidth;
        // Escalar siempre al 100% del contenedor disponible
        setScale(aw / W);
      }
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full flex justify-center overflow-visible">
      {/* Contenedor responsivo proporcional */}
      <div style={{ width: W * scale, height: H * scale, position: 'relative', flexShrink: 0, overflow: 'visible' }}>

        {/* Lienzo interno escalado al píxel */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: W, height: H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflow: 'visible',
        }}>

          {/* ── Líneas conectoras radiales (detrás de todo) ─── */}
          <svg style={{ position: 'absolute', inset: 0, width: W, height: H, zIndex: 8, pointerEvents: 'none' }}>
            {NODES.map((n, i) => {
              const rad = toRad(n.angle);
              const x = PCX + IR * Math.cos(rad);
              const y = PCY + IR * Math.sin(rad);
              return (
                <line key={i}
                  x1={PCX} y1={PCY} x2={x} y2={y}
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth={1.8}
                  strokeDasharray="6 6"
                />
              );
            })}
          </svg>

          {/* ── PLANETA 3D DE FONDO ─── */}
          <div style={{
            position: 'absolute',
            left: PCX - PR,
            top:  PCY - PR,
            width:  PR * 2,
            height: PR * 2,
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            <Image
              src="/planeta-sf.png"
              alt="Planeta InfoDoc"
              fill
              priority
              sizes="640px"
              style={{ objectFit: 'contain' }}
              draggable={false}
            />
          </div>

          {/* ── NODO CENTRAL: Información CANTV ─────────────── */}
          <Link href="/informacion/fotos" style={{
            position: 'absolute',
            left: PCX - 78, top: PCY - 78,
            width: 156, height: 156,
            zIndex: 35, display: 'block',
          }}>
            <div style={{
              width: '100%', height: '100%',
              borderRadius: '50%',
              background: 'white',
              border: '4px solid rgba(191,219,254,0.9)',
              boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 10,
            }}>
              <Users size={32} color="#2563eb" style={{ marginBottom: 3 }} />
              <span style={{ fontSize: 13, fontWeight: 900, color: '#1e293b', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: 0.4 }}>Información</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#1e293b', lineHeight: 1.15, textTransform: 'uppercase', letterSpacing: 0.4 }}>CANTV</span>
              <span style={{ fontSize: 8.5, color: '#94a3b8', fontWeight: 600, textAlign: 'center', marginTop: 4, lineHeight: 1.3, maxWidth: 110 }}>
                Noticias, comunicados y actualizaciones
              </span>
            </div>
          </Link>

          {/* ── TARJETAS UNIFICADAS EN GLASSMORPHISM ─────────── */}
          {NODES.map((n) => {
            const Icon = n.Icon;
            const style = getCardStyle(n.angle);

            return (
              <div key={n.title} style={style} className="group">
                <Lnk n={n}>
                  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
                    
                    {/* Cuerpo de la tarjeta — fondo celeste claro, forma cuadrada */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(219, 234, 254, 0.88)', // Celeste claro (blue-100)
                      border: '1.8px solid rgba(147, 197, 253, 0.75)',   // Borde azul suave
                      borderRadius: '20px',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(12px) saturate(130%)',
                      WebkitBackdropFilter: 'blur(12px) saturate(130%)',
                      padding: '36px 10px 10px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      textAlign: 'center',
                      zIndex: 41,
                      transition: 'all 0.25s ease',
                    }} className="group-hover:bg-blue-100/95 group-hover:border-blue-300">
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', lineHeight: 1.2, marginBottom: 5 }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: 9, color: '#334155', fontWeight: 600, lineHeight: 1.35 }}>
                        {n.desc}
                      </div>
                    </div>

                    {/* Círculo del ícono (Montado físicamente arriba a la mitad) */}
                    <div style={{
                      position: 'absolute',
                      top: -ICON_D / 2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: ICON_D,
                      height: ICON_D,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${n.gradEnd} 0%, ${n.bg} 100%)`,
                      border: '3.5px solid white',
                      boxShadow: `0 6px 18px ${n.bg}45`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 43,
                      transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }} className="group-hover:scale-110">
                      <Icon size={20} color="white" />
                    </div>

                  </div>
                </Lnk>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
