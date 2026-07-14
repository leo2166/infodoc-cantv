'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Sparkles, Newspaper, AlertTriangle } from 'lucide-react';

interface MenuItem {
  label: string;
  Icon: any;
  bg: string;
  borderColor: string;
  iconBg: string;
  color: string;
  href: string;
  external: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Información\nCANTV',
    Icon: Users,
    bg: 'bg-slate-200/90 hover:bg-slate-300/90 dark:bg-slate-700/60 dark:hover:bg-slate-600/70',
    borderColor: 'border-slate-300/70 dark:border-slate-600/50',
    iconBg: 'bg-blue-100/90 border-blue-200/70 text-blue-600 dark:bg-blue-900/40 dark:border-blue-800/40 dark:text-blue-400',
    color: '#0f172a',
    href: '/informacion/fotos',
    external: false,
  },
  {
    label: 'Consulta\ncon IA',
    Icon: Sparkles,
    bg: 'bg-slate-200/90 hover:bg-slate-300/90 dark:bg-slate-700/60 dark:hover:bg-slate-600/70',
    borderColor: 'border-slate-300/70 dark:border-slate-600/50',
    iconBg: 'bg-blue-100/90 border-blue-200/70 text-blue-600 dark:bg-blue-900/40 dark:border-blue-800/40 dark:text-blue-400',
    color: '#0f172a',
    href: '/chat-deepseek',
    external: false,
  },
  {
    label: 'Noticias y\nTasas Bs/$',
    Icon: Newspaper,
    bg: 'bg-slate-200/90 hover:bg-slate-300/90 dark:bg-slate-700/60 dark:hover:bg-slate-600/70',
    borderColor: 'border-slate-300/70 dark:border-slate-600/50',
    iconBg: 'bg-blue-100/90 border-blue-200/70 text-blue-600 dark:bg-blue-900/40 dark:border-blue-800/40 dark:text-blue-400',
    color: '#0f172a',
    href: 'https://leo2166.github.io/news-scraper/',
    external: true,
  },
  {
    label: 'En caso de\nEmergencia',
    Icon: AlertTriangle,
    bg: 'bg-slate-200/90 hover:bg-slate-300/90 dark:bg-slate-700/60 dark:hover:bg-slate-600/70',
    borderColor: 'border-slate-300/70 dark:border-slate-600/50',
    iconBg: 'bg-red-100/90 border-red-200/70 text-red-600 dark:bg-red-900/40 dark:border-red-800/40 dark:text-red-400',
    color: '#0f172a',
    href: '/emergencias',
    external: false,
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
              {/* Círculo del ícono */}
              <div
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${item.iconBg}`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
              </div>

              {/* Título de la opción */}
              <span className="text-[10px] sm:text-xs font-black text-slate-800 dark:text-slate-200 text-center uppercase tracking-wider leading-snug whitespace-pre-line">
                {item.label}
              </span>
            </div>
          );

          if (item.external) {
            return (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full no-underline"
              >
                {innerCard}
              </a>
            );
          }

          return (
            <Link key={i} href={item.href} className="block h-full w-full no-underline">
              {innerCard}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
