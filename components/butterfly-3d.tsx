'use client';

import React, { useState, useEffect } from 'react';

/**
 * Componente Mariposa 3D Realista (Basado en la imagen de referencia del usuario)
 * 
 * Utiliza las alas y el cuerpo exactos de la imagen Morpho Azul del usuario,
 * recortados sin fondo y optimizados en WebP (calidad nítida, peso < 25 KB total).
 * 
 * Animación:
 * 1. Entra volando con aleteo 3D por la pantalla.
 * 2. Hace una curva suave y se posa sobre la esquina del contenedor de los 4 botones.
 * 3. Al posarse, descansa y aletea suavemente cada ciertos segundos.
 * 4. Al hacer click / tocarla, se asusta, da un vuelo circular y vuelve a posarse.
 */
export function Butterfly3D() {
  const [landed, setLanded] = useState(false);
  const [spooked, setSpooked] = useState(false);

  useEffect(() => {
    // Vuelo de entrada inicial (3.8 segundos)
    const timer = setTimeout(() => {
      setLanded(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  const handleInteract = () => {
    if (landed && !spooked) {
      setSpooked(true);
      setTimeout(() => {
        setSpooked(false);
      }, 3400);
    }
  };

  return (
    <>
      <style jsx global>{`
        /* ── Perspectiva y Escena 3D ── */
        .butterfly-stage {
          perspective: 1200px;
          transform-style: preserve-3d;
          pointer-events: auto;
          cursor: pointer;
        }

        .butterfly-rig {
          transform-style: preserve-3d;
          /* Inclinación natural hacia la vista del usuario */
          transform: rotateX(45deg) rotateZ(-18deg);
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* ── Bisagras de las Alas ── */
        .wing-hinge-left {
          transform-style: preserve-3d;
          transform-origin: 100% 50%;
        }

        .wing-hinge-right {
          transform-style: preserve-3d;
          transform-origin: 0% 50%;
        }

        /* Aleteo durante el vuelo (enérgico y fluido) */
        .flying .wing-hinge-left {
          animation: flap-left-real 0.19s ease-in-out infinite alternate;
        }

        .flying .wing-hinge-right {
          animation: flap-right-real 0.19s ease-in-out infinite alternate;
        }

        /* Aleteo cuando está posada (pausado, apertura y cierre de alas) */
        .resting .wing-hinge-left {
          animation: rest-flap-left-real 4.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .resting .wing-hinge-right {
          animation: rest-flap-right-real 4.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes flap-left-real {
          0% { transform: rotateY(5deg) rotateZ(-6deg); }
          100% { transform: rotateY(75deg) rotateZ(12deg); }
        }

        @keyframes flap-right-real {
          0% { transform: rotateY(-5deg) rotateZ(6deg); }
          100% { transform: rotateY(-75deg) rotateZ(-12deg); }
        }

        @keyframes rest-flap-left-real {
          0%, 60%, 100% { transform: rotateY(60deg) rotateZ(0deg); }
          72% { transform: rotateY(15deg) rotateZ(-4deg); }
          82% { transform: rotateY(65deg) rotateZ(2deg); }
        }

        @keyframes rest-flap-right-real {
          0%, 60%, 100% { transform: rotateY(-60deg) rotateZ(0deg); }
          72% { transform: rotateY(-15deg) rotateZ(4deg); }
          82% { transform: rotateY(-65deg) rotateZ(-2deg); }
        }

        /* ── Trayectoria de Vuelo de Entrada ── */
        @keyframes flight-entry-real {
          0% {
            transform: translate3d(-200px, -260px, 140px) scale(0.6) rotateZ(-50deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          40% {
            transform: translate3d(160px, -200px, 90px) scale(0.85) rotateZ(35deg);
          }
          70% {
            transform: translate3d(-90px, -70px, 45px) scale(1.05) rotateZ(-25deg);
          }
          90% {
            transform: translate3d(25px, -18px, 15px) scale(0.98) rotateZ(10deg);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1) rotateZ(0deg);
            opacity: 1;
          }
        }

        /* ── Vuelo al asustarse por click ── */
        @keyframes flight-spooked-real {
          0% { transform: translate3d(0, 0, 0) scale(1) rotateZ(0deg); }
          30% { transform: translate3d(-70px, -130px, 80px) scale(0.85) rotateZ(-35deg); }
          60% { transform: translate3d(100px, -100px, 60px) scale(0.95) rotateZ(40deg); }
          100% { transform: translate3d(0, 0, 0) scale(1) rotateZ(0deg); }
        }

        .animate-flight-entry-real {
          animation: flight-entry-real 3.8s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }

        .animate-flight-spooked-real {
          animation: flight-spooked-real 3.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Sombra realista proyectada */
        .butterfly-shadow-real {
          filter: blur(5px);
          transition: all 0.5s ease;
        }
        .resting .butterfly-shadow-real {
          transform: translateY(16px) scale(0.9);
          opacity: 0.4;
        }
        .flying .butterfly-shadow-real {
          transform: translateY(40px) scale(0.5);
          opacity: 0.18;
        }
      `}</style>

      {/* Anclado en la esquina superior derecha del contenedor HeroMenu */}
      <div
        className="absolute -top-9 -right-6 sm:-top-11 sm:-right-8 z-30 select-none"
        onClick={handleInteract}
        title="Tócame para verme volar 🦋"
        aria-label="Mariposa azul de referencia animada en 3D"
      >
        <div
          className={`butterfly-stage relative w-20 h-20 sm:w-24 sm:h-24 ${
            !landed
              ? 'animate-flight-entry-real flying'
              : spooked
              ? 'animate-flight-spooked-real flying'
              : 'resting'
          }`}
        >
          {/* Sombra sobre el contenedor */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="butterfly-shadow-real w-12 h-8 sm:w-14 sm:h-9 bg-blue-950/70 dark:bg-black/90 rounded-full" />
          </div>

          {/* Ensamblaje 3D de la Mariposa con las partes de la imagen del usuario */}
          <div className="butterfly-rig w-full h-full relative flex items-center justify-center">
            
            {/* ALA IZQUIERDA (bisagra a la derecha del ala, coincidiendo con el centro) */}
            <div className="wing-hinge-left absolute right-1/2 top-0 bottom-0 w-1/2 h-full">
              <img
                src="/butterfly-left.webp"
                alt="Ala izquierda"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,140,255,0.45)] pointer-events-none"
                draggable={false}
              />
            </div>

            {/* CUERPO CENTRAL (eje simétrico) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <img
                src="/butterfly-body.webp"
                alt="Cuerpo mariposa"
                className="h-full w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            </div>

            {/* ALA DERECHA (bisagra a la izquierda del ala, coincidiendo con el centro) */}
            <div className="wing-hinge-right absolute left-1/2 top-0 bottom-0 w-1/2 h-full">
              <img
                src="/butterfly-right.webp"
                alt="Ala derecha"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,140,255,0.45)] pointer-events-none"
                draggable={false}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
