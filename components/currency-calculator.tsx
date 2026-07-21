'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Loader2, AlertCircle, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

interface RatesData {
  bcvUsd: number | null;
  bcvEur: number | null;
  binance: number | null;
  fechaValor: string;
}

const DATA_URL = 'https://leo2166.github.io/news-scraper/data.json';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos

// Cache global para evitar re-fetches innecesarios
let cachedRates: RatesData | null = null;
let cacheTimestamp = 0;

/**
 * Parsea un string con coma decimal (ej: "737,23") a número.
 * Retorna null si es "N/A" o no parseable.
 */
function parseRate(value: string | undefined): number | null {
  if (!value || value === 'N/A' || value.trim() === '') return null;
  const normalized = value.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

/**
 * Formatea un número al estilo venezolano: punto para miles, coma para decimales.
 * Ej: 2211.69 → "2.211,69"
 */
function formatBs(value: number): string {
  return value.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formatea una tasa para el banner amarillo.
 * Ej: 737.23 → "737,23"
 */
function formatRate(value: number | null): string {
  if (value === null) return 'N/A';
  return value.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrencyCalculator() {
  const [open, setOpen] = useState(false);
  const [rates, setRates] = useState<RatesData | null>(cachedRates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');

  const fetchRates = useCallback(async () => {
    // Si hay cache vigente, usar cache
    const now = Date.now();
    if (cachedRates && now - cacheTimestamp < CACHE_DURATION_MS) {
      setRates(cachedRates);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const parsed: RatesData = {
        bcvUsd: parseRate(data?.rates?.bcv?.usd),
        bcvEur: parseRate(data?.rates?.bcv?.eur),
        binance: parseRate(data?.rates?.binance?.usdt),
        fechaValor: data?.rates?.bcv?.fechaValor ?? '',
      };

      cachedRates = parsed;
      cacheTimestamp = Date.now();
      setRates(parsed);
    } catch (err) {
      setError('No se pudieron obtener las tasas. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch al abrir el modal
  useEffect(() => {
    if (open) {
      fetchRates();
    }
  }, [open, fetchRates]);

  const numAmount = parseFloat(amount.replace(',', '.')) || 0;

  const convBcvUsd = rates?.bcvUsd != null ? numAmount * rates.bcvUsd : null;
  const convBcvEur = rates?.bcvEur != null ? numAmount * rates.bcvEur : null;
  const convBinance = rates?.binance != null ? numAmount * rates.binance : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER: Botón circular de calculadora */}
      <button
        onClick={() => setOpen(true)}
        className="group flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-none outline-none"
        aria-label="Abrir calculadora de conversión"
        title="Calculadora de Conversión Bs/$"
      >
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-amber-500/40 group-active:scale-95">
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
        </div>
        <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Conversor
        </span>
      </button>

      {/* MODAL */}
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 overflow-hidden rounded-2xl max-w-sm sm:max-w-md border-0 shadow-2xl"
      >
        {/* Título accesible (visualmente oculto) */}
        <DialogTitle className="sr-only">Calculadora de Conversión de Tasas</DialogTitle>

        {/* ═══ BARRA SUPERIOR AZUL ═══ */}
        <div className="bg-[#1a1a5e] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4 text-white/80" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-white/50 uppercase tracking-wider font-semibold block mb-1">
              Consulta de precio:
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Monto a consultar"
              value={amount}
              onChange={(e) => {
                // Solo permitir números, coma y punto
                const val = e.target.value.replace(/[^0-9.,]/g, '');
                setAmount(val);
              }}
              autoFocus
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white placeholder:text-white/40 text-sm font-semibold outline-none focus:border-amber-400 focus:bg-white/15 transition-colors"
            />
          </div>
        </div>

        {/* ═══ BANNER AMARILLO CON TASAS ═══ */}
        <div className="bg-[#FFE000] px-4 py-2.5 flex items-center justify-center gap-1 flex-wrap">
          {loading ? (
            <div className="flex items-center gap-2 text-black/70">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold">Cargando tasas...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold">{error}</span>
            </div>
          ) : rates ? (
            <p className="text-xs sm:text-sm font-extrabold text-black text-center leading-snug">
              TASAS BCV:{' '}
              <span className="inline-block mx-1">($) {formatRate(rates.bcvUsd)}</span>
              <span className="inline-block mx-1">(€) {formatRate(rates.bcvEur)}</span>
              <span className="inline-block mx-1">(B) {formatRate(rates.binance)}</span>
            </p>
          ) : null}
        </div>

        {/* ═══ RESULTADOS DE CONVERSIÓN ═══ */}
        <div className="bg-white dark:bg-slate-900 px-6 pt-6 pb-4 space-y-5">
          {/* Bcv($) */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-extrabold text-[#1a1a5e] dark:text-slate-200">
              Bcv($)
            </span>
            <span className="text-lg sm:text-xl text-[#1a1a5e] dark:text-blue-400 font-semibold">
              Bs:
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {convBcvUsd !== null && numAmount > 0
                ? formatBs(convBcvUsd)
                : rates?.bcvUsd === null
                  ? 'N/D'
                  : '0,00'}
            </span>
          </div>

          {/* Bcv(€) */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-extrabold text-[#1a1a5e] dark:text-slate-200">
              Bcv(€)
            </span>
            <span className="text-lg sm:text-xl text-[#1a1a5e] dark:text-blue-400 font-semibold">
              Bs:
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {convBcvEur !== null && numAmount > 0
                ? formatBs(convBcvEur)
                : rates?.bcvEur === null
                  ? 'N/D'
                  : '0,00'}
            </span>
          </div>

          {/* Binance */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-extrabold text-[#1a1a5e] dark:text-slate-200">
              Binance
            </span>
            <span className="text-lg sm:text-xl text-[#1a1a5e] dark:text-blue-400 font-semibold">
              Bs:
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {convBinance !== null && numAmount > 0
                ? formatBs(convBinance)
                : rates?.binance === null
                  ? 'N/D'
                  : '0,00'}
            </span>
          </div>

          {/* Fecha de las tasas */}
          {rates?.fechaValor && (
            <p className="text-center text-[11px] text-[#1a1a5e] dark:text-blue-400 font-semibold mt-3">
              Tasa Correspondiente: {rates.fechaValor}
            </p>
          )}
        </div>

        {/* ═══ BOTÓN CERRAR ROJO ═══ */}
        <div className="bg-white dark:bg-slate-900 px-6 pb-8 pt-4 flex justify-center">
          <DialogClose asChild>
            <button
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-extrabold text-base px-10 py-3 rounded-full shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Cerrar
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
