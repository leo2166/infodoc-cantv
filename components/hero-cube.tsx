'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  Newspaper,
  AlertTriangle,
  RotateCcw,
  Info,
  Phone,
  Link as LinkIcon,
} from 'lucide-react';
import { EmergencyGuideModal } from '@/components/emergency-guide-modal';

/* ──────────────────────────────────────────────────────────────────
   CONFIGURACIÓN DEL CUBO
────────────────────────────────────────────────────────────────── */
const SIZE  = 380;   // px – tamaño del cubo
const H     = SIZE / 2;  // mitad = distancia de cada cara al centro

/* Las 4 opciones del menú en la cara frontal (2 × 2) */
interface MenuItem {
  label: string;
  Icon: any;
  bg: string;
  color: string;
  href: string | null;
  external: boolean;
  isEmergency?: boolean;
}

const MENU: MenuItem[] = [
  {
    label: 'Información\nCANTV',
    Icon: Users,
    bg: '#eef2ff',
    color: '#4f46e5',
    href: '/informacion/fotos',
    external: false,
  },
  {
    label: 'Consulta\ncon IA',
    Icon: Sparkles,
    bg: '#f0f7ff',
    color: '#7c3aed',
    href: '/chat-deepseek',
    external: false,
  },
  {
    label: 'Noticias y\nTasas Bs/$',
    Icon: Newspaper,
    bg: '#f0fdf4',
    color: '#16a34a',
    href: 'https://leo2166.github.io/news-scraper/',
    external: true,
  },
  {
    label: 'En caso de\nEmergencia',
    Icon: AlertTriangle,
    bg: '#fff1f2',
    color: '#e11d48',
    href: null,
    external: false,
    isEmergency: true,
  },
];

/* ──────────────────────────────────────────────────────────────────
   PROPS
────────────────────────────────────────────────────────────────── */
interface HeroCubeProps {
  // sin props externas — el modal se maneja internamente
}

/* ──────────────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
────────────────────────────────────────────────────────────────── */
export function HeroCube(_: HeroCubeProps = {}) {
  const [rotY, setRotY] = useState(-18);
  const [rotX, setRotX] = useState(14);
  const rotYRef = useRef(-18);
  const rotXRef = useRef(14);

  const dragging   = useRef(false);
  const paused     = useRef(false);
  const lastXY     = useRef({ x: 0, y: 0 });
  const totalDrag  = useRef(0);          // detectar click vs arrastre
  const autoTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Auto-rotación ─────────────────────────────────── */
  const startAuto = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      rotYRef.current -= 0.22;
      setRotY(rotYRef.current);
    }, 16);
  }, []);

  const stopAuto = useCallback(() => {
    if (autoTimer.current) { clearInterval(autoTimer.current); autoTimer.current = null; }
  }, []);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto, stopAuto]);

  /* ── Drag (mouse) ──────────────────────────────────── */
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current  = true;
    paused.current    = true;
    totalDrag.current = 0;
    lastXY.current    = { x: e.clientX, y: e.clientY };
    if (resumeRef.current) clearTimeout(resumeRef.current);
    stopAuto();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastXY.current.x;
    const dy = e.clientY - lastXY.current.y;
    totalDrag.current += Math.abs(dx) + Math.abs(dy);
    rotYRef.current  += dx * 0.55;
    rotXRef.current   = Math.max(-28, Math.min(28, rotXRef.current - dy * 0.35));
    setRotY(rotYRef.current);
    setRotX(rotXRef.current);
    lastXY.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    dragging.current = false;
    resumeRef.current = setTimeout(() => { paused.current = false; startAuto(); }, 2500);
  };

  /* ── Drag (touch) ──────────────────────────────────── */
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current  = true;
    paused.current    = true;
    totalDrag.current = 0;
    lastXY.current    = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (resumeRef.current) clearTimeout(resumeRef.current);
    stopAuto();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!dragging.current) return;
    const dx = e.touches[0].clientX - lastXY.current.x;
    const dy = e.touches[0].clientY - lastXY.current.y;
    totalDrag.current += Math.abs(dx) + Math.abs(dy);
    rotYRef.current  += dx * 0.55;
    rotXRef.current   = Math.max(-28, Math.min(28, rotXRef.current - dy * 0.35));
    setRotY(rotYRef.current);
    setRotX(rotXRef.current);
    lastXY.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = () => {
    dragging.current = false;
    resumeRef.current = setTimeout(() => { paused.current = false; startAuto(); }, 2500);
  };

  /* ── Estilos del cubo interno ──────────────────────── */
  const innerStyle: React.CSSProperties = {
    width:           SIZE,
    height:          SIZE,
    position:        'relative',
    transformStyle:  'preserve-3d',
    transform:       `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
    transition:      dragging.current ? 'none' : 'transform 0.08s linear',
    cursor:          dragging.current ? 'grabbing' : 'grab',
  };

  /* ── Estilos base de cada cara ─────────────────────── */
  const faceBase: React.CSSProperties = {
    position: 'absolute',
    width:    SIZE,
    height:   SIZE,
    overflow: 'hidden',
  };

  return (
    <div className="flex flex-col items-center gap-5 select-none">

      {/* ── Perspectiva + eventos ─────────────────────── */}
      <div
        style={{ perspective: '1100px', width: SIZE, height: SIZE }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div style={innerStyle}>

          {/* ════════════════════════════════════════════
              CARA FRONTAL — menú 2×2
          ════════════════════════════════════════════ */}
          <div style={{ ...faceBase, transform: `translateZ(${H}px)`, borderRadius: 28,
            boxShadow: '0 24px 64px rgba(0,0,0,0.14)', overflow: 'hidden' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', height: '100%' }}>
              {MENU.map((item, i) => {
                const Icon = item.Icon;
                const inner = (
                  <div
                    style={{
                      background:      item.bg,
                      display:         'flex',
                      flexDirection:   'column',
                      alignItems:      'center',
                      justifyContent:  'center',
                      gap:             12,
                      padding:         '20px 14px',
                      borderRight:     i % 2 === 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                      borderBottom:    i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                      cursor:          'pointer',
                      transition:      'all 0.2s',
                      userSelect:      'none',
                      height:          '100%',
                    }}
                    className="hover:brightness-95 active:brightness-90"
                  >
                    {/* Ícono con fondo circular */}
                    <div style={{
                      width: 56, height: 56,
                      borderRadius: '50%',
                      background:   `${item.color}18`,
                      border:       `1.5px solid ${item.color}30`,
                      display:      'flex',
                      alignItems:   'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={24} color={item.color} strokeWidth={1.6} />
                    </div>

                    {/* Etiqueta */}
                    <div style={{
                      fontSize:      12,
                      fontWeight:    800,
                      color:         '#1e293b',
                      textAlign:     'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      lineHeight:    1.3,
                      whiteSpace:    'pre-line',
                    }}>
                      {item.label}
                    </div>
                  </div>
                );

                // EMERGENCIA: envolver en EmergencyGuideModal
                if (item.isEmergency) return (
                  <EmergencyGuideModal key={i}>
                    <div
                      style={{ width: '100%', height: '100%', display: 'block' }}
                      onClick={e => { if (totalDrag.current > 8) e.preventDefault(); }}
                    >
                      {inner}
                    </div>
                  </EmergencyGuideModal>
                );

                if (item.external) return (
                  <a key={i} href={item.href!} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', height: '100%' }}
                    onClick={e => { if (totalDrag.current > 8) e.preventDefault(); }}>
                    {inner}
                  </a>
                );
                return (
                  <Link key={i} href={item.href!}
                    style={{ display: 'block', height: '100%' }}
                    onClick={e => { if (totalDrag.current > 8) e.preventDefault(); }}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ════════════════════════════════════════════
              CARA TRASERA
          ════════════════════════════════════════════ */}
          <div style={{
            ...faceBase,
            transform:  `translateZ(-${H}px) rotateY(180deg)`,
            background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)',
            borderRadius: 28,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <Info size={40} color="#4f46e5" strokeWidth={1.4} />
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', letterSpacing: '0.05em' }}>
              InfoDoc
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textAlign: 'center', maxWidth: 220 }}>
              Portal de información para jubilados de CANTV
            </div>
          </div>

          {/* ════════════════════════════════════════════
              CARA DERECHA
          ════════════════════════════════════════════ */}
          <div style={{
            ...faceBase,
            transform:  `translateX(${H}px) rotateY(90deg)`,
            background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: 28,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <LinkIcon size={36} color="#16a34a" strokeWidth={1.4} />
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Enlaces Útiles
            </div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textAlign: 'center', maxWidth: 200 }}>
              Acceso rápido a sitios de interés
            </div>
          </div>

          {/* ════════════════════════════════════════════
              CARA IZQUIERDA
          ════════════════════════════════════════════ */}
          <div style={{
            ...faceBase,
            transform:  `translateX(-${H}px) rotateY(-90deg)`,
            background: 'linear-gradient(180deg, #fff7ed 0%, #fef3c7 100%)',
            borderRadius: 28,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <Phone size={36} color="#d97706" strokeWidth={1.4} />
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Contacto
            </div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textAlign: 'center', maxWidth: 200 }}>
              Comunícate con tu AJUPTEL local
            </div>
          </div>

          {/* ════════════════════════════════════════════
              CARA SUPERIOR
          ════════════════════════════════════════════ */}
          <div style={{
            ...faceBase,
            transform:  `translateY(-${H}px) rotateX(90deg)`,
            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
            borderRadius: 28,
          }} />

          {/* ════════════════════════════════════════════
              CARA INFERIOR
          ════════════════════════════════════════════ */}
          <div style={{
            ...faceBase,
            transform:  `translateY(${H}px) rotateX(-90deg)`,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            borderRadius: 28,
            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.08)',
          }} />

        </div>
      </div>

      {/* ── Indicador ────────────────────────────────── */}
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase">
        <RotateCcw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
        <span>Gire para más opciones</span>
      </div>

    </div>
  );
}
