'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Sparkles, Newspaper, AlertTriangle } from 'lucide-react';
import { EmergencyGuideModal } from '@/components/emergency-guide-modal';

interface MenuItem {
  label: string;
  Icon: any;
  /** Clases del fondo de la tarjeta */
  bg: string;
  /** Borde de la tarjeta */
  borderColor: string;
  /** Clases del círculo del ícono */
  iconBg: string;
  /** Color del ícono SVG */
  iconColor: string;
  href: string | null;
  external: boolean;
  isEmergency?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    // ─── Azul ─────────────────────────────────────────────────────
    label: 'Información\nCANTV',
    Icon: Users,
    bg: 'bg-blue-100/90 hover:bg-blue-200/80 dark:bg-blue-900/40 dark:hover:bg-blue-800/50',
    borderColor: 'border-blue-200/70 dark:border-blue-800/40',
    iconBg: 'bg-blue-600 dark:bg-blue-500',
    iconColor: 'text-white',
    href: '/informacion/fotos',
    external: false,
  },
  {
    // ─── Morado ───────────────────────────────────────────────────
    label: 'Consulta\ncon IA',
    Icon: Sparkles,
    bg: 'bg-purple-100/90 hover:bg-purple-200/80 dark:bg-purple-900/40 dark:hover:bg-purple-800/50',
    borderColor: 'border-purple-200/70 dark:border-purple-800/40',
    iconBg: 'bg-purple-500 dark:bg-purple-400',
    iconColor: 'text-white',
    href: '/chat-deepseek',
    external: false,
  },
  {
    // ─── Verde ────────────────────────────────────────────────────
    label: 'Noticias y\nTasas Bs/$',
    Icon: Newspaper,
    bg: 'bg-green-100/90 hover:bg-green-200/80 dark:bg-green-900/40 dark:hover:bg-green-800/50',
    borderColor: 'border-green-200/70 dark:border-green-800/40',
    iconBg: 'bg-green-600 dark:bg-green-500',
    iconColor: 'text-white',
    href: 'https://leo2166.github.io/news-scraper/',
    external: true,
  },
  {
    // ─── Rojo ────────────────────────────────────────────────────
    label: 'En caso de\nEmergencia',
    Icon: AlertTriangle,
    bg: 'bg-red-100/90 hover:bg-red-200/80 dark:bg-red-900/40 dark:hover:bg-red-800/50',
    borderColor: 'border-red-200/70 dark:border-red-800/40',
    iconBg: 'bg-red-500 dark:bg-red-600',
    iconColor: 'text-white',
    href: null,
    external: false,
    isEmergency: true,
  },
] as const;

export function HeroMenu() {
  return (
    <div className="w-full max-w-[300px] sm:max-w-[380px] aspect-square bg-white dark:bg-slate-900 rounded-[28px] sm:rounded-[32px] p-2 sm:p-2.5 border border-slate-200/60 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_35px_80px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_35px_80px_rgba(0,0,0,0.55)] ease-out">
      <div className="grid grid-cols-2 gap-2.5 h-full w-full">
        {MENU_ITEMS.map((item, i) => {
          const Icon = item.Icon;

          const innerCard = (
            <div
              className={`h-full w-full rounded-[22px] sm:rounded-[24px] p-3 sm:p-5 flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 border transition-all duration-300 cursor-pointer select-none group ${item.bg} ${item.borderColor}`}
            >
              {/* Círculo del ícono — sólido y coloreado */}
              <div
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${item.iconBg}`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor}`} strokeWidth={1.75} />
              </div>

              {/* Título de la opción */}
              <span className="text-[10px] sm:text-xs font-black text-slate-800 dark:text-slate-200 text-center uppercase tracking-wider leading-snug whitespace-pre-line">
                {item.label}
              </span>
            </div>
          );

          if (item.isEmergency) {
            return (
              <EmergencyGuideModal key={i}>
                <div className="h-full w-full block">
                  {innerCard}
                </div>
              </EmergencyGuideModal>
            );
          }

          if (item.external) {
            return (
              <a
                key={i}
                href={item.href!}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full no-underline"
              >
                {innerCard}
              </a>
            );
          }

          return (
            <Link key={i} href={item.href!} className="block h-full w-full no-underline">
              {innerCard}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
