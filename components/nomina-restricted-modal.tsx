'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Clock, Lock } from 'lucide-react';

interface NominaRestrictedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NominaRestrictedModal({ open, onOpenChange }: NominaRestrictedModalProps) {
  const [countdown, setCountdown] = useState(20);

  // Reset y arrancar countdown al abrir
  useEffect(() => {
    if (!open) {
      setCountdown(20);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onOpenChange(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, onOpenChange]);

  // Porcentaje para el anillo SVG
  const circumference = 2 * Math.PI * 42;
  const progress = (countdown / 20) * circumference;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 overflow-hidden rounded-2xl max-w-sm sm:max-w-md border-0 shadow-2xl"
      >
        <DialogTitle className="sr-only">Acceso a Nómina Restringido</DialogTitle>

        {/* ═══ CABECERA ROJA ═══ */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-extrabold text-lg leading-tight">
              Acceso Restringido
            </h3>
            <p className="text-red-200 text-xs font-semibold mt-0.5">
              Cronograma de Pagos
            </p>
          </div>
        </div>

        {/* ═══ FRANJA AMARILLA DE ALERTA ═══ */}
        <div className="bg-amber-400 px-5 py-2.5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0" />
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
            Aviso Temporal
          </span>
        </div>

        {/* ═══ CUERPO DEL MENSAJE ═══ */}
        <div className="bg-white dark:bg-slate-900 px-6 py-6">
          <div className="text-center space-y-4">
            {/* Reloj regresivo circular */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                {/* Fondo del anillo */}
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48" cy="48" r="42"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="5"
                  />
                  {/* Progreso */}
                  <circle
                    cx="48" cy="48" r="42"
                    fill="none"
                    stroke="url(#countdown-gradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="countdown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Número central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-red-600 dark:text-red-400 tabular-nums leading-none">
                    {countdown}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    seg
                  </span>
                </div>
              </div>
            </div>

            {/* Título del mensaje */}
            <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
              Acceso restringido al cronograma de pagos
            </h4>

            {/* Cuerpo del mensaje */}
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-left">
              <p>
                Debido a la <strong className="text-red-600 dark:text-red-400">inconsistencia reciente</strong> en los depósitos de nómina y bonos por parte de CANTV, el cronograma de pagos permanecerá temporalmente deshabilitado.
              </p>
              <p>
                Se habilitará nuevamente cuando CANTV estabilice la frecuencia y fechas de pago.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ FOOTER CON BOTÓN CERRAR ═══ */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-center border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onOpenChange(false)}
            className="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-bold text-sm px-8 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Entendido
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
