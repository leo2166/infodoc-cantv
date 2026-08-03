'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, Wind, Droplets, Thermometer, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { format, differenceInDays, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  city?: string;
}

// Mapeo de código WMO → descripción e ícono emoji
const weatherInfo = (code: number): { label: string; emoji: string; color: string } => {
  if (code === 0) return { label: 'Despejado', emoji: '☀️', color: 'text-yellow-500' };
  if (code <= 2) return { label: 'Parcialmente nublado', emoji: '⛅', color: 'text-blue-400' };
  if (code === 3) return { label: 'Nublado', emoji: '☁️', color: 'text-slate-400' };
  if (code <= 49) return { label: 'Niebla', emoji: '🌫️', color: 'text-slate-400' };
  if (code <= 59) return { label: 'Llovizna', emoji: '🌦️', color: 'text-cyan-500' };
  if (code <= 69) return { label: 'Lluvia', emoji: '🌧️', color: 'text-blue-600' };
  if (code <= 79) return { label: 'Nieve', emoji: '❄️', color: 'text-sky-300' };
  if (code <= 84) return { label: 'Chubascos', emoji: '🌨️', color: 'text-blue-500' };
  if (code <= 99) return { label: 'Tormenta', emoji: '⛈️', color: 'text-purple-600' };
  return { label: 'Desconocido', emoji: '🌡️', color: 'text-slate-500' };
};

export function SidebarPanel() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Obtener clima: silencioso — sin diálogos de permiso
  useEffect(() => {
    const MARACAIBO_LAT = 10.6330;
    const MARACAIBO_LON = -71.6300;
    const MARACAIBO_CITY = 'Maracaibo';

    const fetchWeather = async (lat: number, lon: number, city?: string) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weathercode,windspeed_10m&timezone=auto`
        );
        const data = await res.json();
        const c = data.current;
        setWeather({
          temperature: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          windSpeed: Math.round(c.windspeed_10m),
          weatherCode: c.weathercode,
          city: city ?? MARACAIBO_CITY,
        });
      } catch {
        setWeatherError('No se pudo obtener el clima.');
      } finally {
        setWeatherLoading(false);
      }
    };

    const fetchWithRealLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es`
            );
            const geoData = await geoRes.json();
            // Intentar obtener ciudad + parroquia/barrio si está disponible
            const city =
              geoData?.address?.city ||
              geoData?.address?.town ||
              geoData?.address?.municipality ||
              MARACAIBO_CITY;
            const suburb =
              geoData?.address?.suburb ||
              geoData?.address?.neighbourhood ||
              geoData?.address?.quarter ||
              null;
            const displayCity = suburb ? `${city} - ${suburb}` : city;
            fetchWeather(latitude, longitude, displayCity);
          } catch {
            fetchWeather(latitude, longitude, MARACAIBO_CITY);
          }
        },
        () => {
          // Si falla por cualquier razón, Maracaibo
          fetchWeather(MARACAIBO_LAT, MARACAIBO_LON, MARACAIBO_CITY);
        },
        { timeout: 5000, maximumAge: 300000 }
      );
    };

    const initWeather = () => {
      // Verificar permiso SIN mostrar diálogo
      if (typeof navigator !== 'undefined' && navigator.permissions) {
        navigator.permissions
          .query({ name: 'geolocation' as PermissionName })
          .then((result) => {
            if (result.state === 'granted') {
              // GPS ya autorizado → usar ubicación real, sin diálogo
              fetchWithRealLocation();
            } else {
              // 'prompt' o 'denied' → Maracaibo sin preguntar nada
              fetchWeather(MARACAIBO_LAT, MARACAIBO_LON, MARACAIBO_CITY);
            }

            // Escuchar cambios futuros (si el usuario activa el GPS después)
            result.addEventListener('change', () => {
              if (result.state === 'granted') {
                fetchWithRealLocation();
              }
            });
          })
          .catch(() => {
            // Si permissions API no está disponible → Maracaibo
            fetchWeather(MARACAIBO_LAT, MARACAIBO_LON, MARACAIBO_CITY);
          });
      } else {
        // Sin soporte de permissions API → Maracaibo
        fetchWeather(MARACAIBO_LAT, MARACAIBO_LON, MARACAIBO_CITY);
      }
    };

    // Diferir la llamada 1.2s para liberar el hilo principal durante el renderizado en móviles
    const timer = setTimeout(initWeather, 1200);
    return () => clearTimeout(timer);
  }, []);




  // Cálculos para el Mundial de Fútbol 2026 (Final: 19 de Julio de 2026)
  const finalWorldCup = new Date(2026, 6, 19);
  const isAfterWorldCup = now ? isBefore(finalWorldCup, now) : false;
  const daysRemaining = now ? differenceInDays(finalWorldCup, now) : 0;

  const formattedDay = now ? format(now, "eeee", { locale: es }).replace(/^\w/, (c) => c.toUpperCase()) : "Cargando...";
  const formattedFullDate = now ? format(now, "d 'de' MMMM 'de' yyyy", { locale: es }) : "...";
  const formattedTime = now ? format(now, "hh:mm:ss a") : "--:--:--";

  // Emoji y label del tiempo para mostrar en la mitad derecha del widget móvil
  const wInfo = weather ? weatherInfo(weather.weatherCode) : null;

  return (
    <div className="w-full max-w-[380px] mx-auto">

      {/* ── En móvil: columna. En desktop: columna vertical ── */}
      <div className="flex flex-col gap-3 lg:gap-6">

        {/* ========================================================
            WIDGET 1-A: FECHA + CLIMA — SOLO MÓVIL (amarillo Piolín)
            ======================================================== */}
        <div
          className="lg:hidden rounded-[20px] p-3 border shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 ease-out"
          style={{ backgroundColor: '#FFE000', borderColor: '#D4BC00' }}
        >
          <div className="flex items-stretch">

            {/* MITAD IZQUIERDA: Fecha y Hora — ocupa exactamente el 50% */}
            <div className="w-1/2 flex flex-col justify-between pr-3">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-black/10 flex items-center justify-center text-black shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] font-bold text-black/60 uppercase tracking-widest block">Hoy es:</span>
                  <h3 className="text-sm font-extrabold text-black leading-tight">{formattedDay}</h3>
                  <p className="text-[10px] font-semibold text-black/80 leading-tight">{formattedFullDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-2 border-t border-black/15 mt-2 text-black">
                <Clock className="w-3 h-3 text-black/60" />
                <span className="text-xs font-bold font-mono tracking-wider" suppressHydrationWarning>
                  {formattedTime}
                </span>
              </div>
            </div>

            {/* DIVISOR VERTICAL */}
            <div className="w-px bg-black/20 self-stretch mx-1 shrink-0" />

            {/* MITAD DERECHA: Clima — ocupa exactamente el 50% */}
            <div className="w-1/2 flex flex-col justify-between pl-3">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-black/10 flex items-center justify-center shrink-0 text-base leading-none">
                  {wInfo ? wInfo.emoji : '🌡️'}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] font-bold text-black/60 uppercase tracking-widest block">Tiempo:</span>
                  {weatherLoading ? (
                    <div className="flex items-center gap-1 py-0.5">
                      <Loader2 className="w-3 h-3 text-black/60 animate-spin" />
                      <span className="text-[10px] text-black/60">Cargando...</span>
                    </div>
                  ) : weatherError ? (
                    <p className="text-[10px] font-bold text-red-700">Sin datos</p>
                  ) : weather ? (
                    <>
                      <h3 className="text-sm font-extrabold text-black leading-tight">{weather.temperature}°C</h3>
                      <p className="text-[10px] font-semibold text-black/80 leading-tight">{wInfo?.label}</p>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="pt-2 border-t border-black/15 mt-2">
                <div className="flex items-center gap-1 mb-1">
                  <Droplets className="w-3 h-3 text-black/60 shrink-0" />
                  <span className="text-[10px] font-semibold text-black/70">
                    Hum: <strong className="text-black">{weather ? `${weather.humidity}%` : '--'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-black/60 shrink-0" />
                  <span className="text-[10px] font-semibold text-black/70 truncate">
                    {weather?.city ?? 'Maracaibo'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            WIDGET 1-B: FECHA — SOLO DESKTOP (diseño referencia)
            ======================================================== */}
        <div className="hidden lg:block bg-amber-50/90 dark:bg-amber-950/30 rounded-[20px] p-5 border border-amber-200/80 dark:border-amber-800/50 shadow-[0_4px_20px_rgba(217,119,6,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(217,119,6,0.12)] ease-out">
          {/* Fila superior: ícono + label + día */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100/80 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">FECHA</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">{formattedDay}</h3>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{formattedFullDate}</p>
            </div>
          </div>
          {/* Divisor */}
          <div className="border-t border-slate-100 dark:border-slate-700/50 mb-3" />
          {/* Hora */}
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-lg font-bold font-mono tracking-widest" suppressHydrationWarning>
              {formattedTime}
            </span>
          </div>
        </div>

        {/* ========================================================
            WIDGET 2: ESTADO DEL TIEMPO — Solo visible en PC (Oculto en celular a petición)
            ======================================================== */}
        <div className="hidden lg:block bg-amber-50/90 dark:bg-amber-950/30 rounded-[20px] p-5 border border-amber-200/80 dark:border-amber-800/50 shadow-[0_4px_20px_rgba(217,119,6,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(217,119,6,0.12)] ease-out">
          {/* Fila superior: emoji + label + temp */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100/80 dark:bg-amber-900/40 flex items-center justify-center shrink-0 text-lg leading-none">
              {weather ? weatherInfo(weather.weatherCode).emoji : '🌡️'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">TIEMPO:</span>
              {weatherLoading ? (
                <div className="flex items-center gap-1.5 py-1">
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  <span className="text-sm text-slate-400">Cargando...</span>
                </div>
              ) : weatherError ? (
                <p className="text-sm font-bold text-red-500">{weatherError}</p>
              ) : weather ? (
                <>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                    {weather.temperature}°C - {weatherInfo(weather.weatherCode).label}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{weather.city}</span>
                  </p>
                </>
              ) : null}
            </div>
          </div>
          {/* Divisor */}
          <div className="border-t border-slate-100 dark:border-slate-700/50 mb-3" />
          {/* Detalles Hum / Vto */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>Hum: <strong className="text-slate-700 dark:text-slate-300">{weather ? `${weather.humidity}%` : '--'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Vto: <strong className="text-slate-700 dark:text-slate-300">{weather ? `${weather.windSpeed} km/h` : '--'}</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
