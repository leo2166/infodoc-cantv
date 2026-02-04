"use client";

import React from "react";

interface NewsTickerProps {
  message: string;
  speed?: number; // Duración de la animación en segundos (menor = más rápido)
  backgroundColor?: string;
  textColor?: string;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({
  message,
  speed = 30,
  backgroundColor = "bg-red-600",
  textColor = "text-white",
}) => {
  return (
    <div className={`${backgroundColor} ${textColor} py-2 overflow-hidden relative w-full`}>
      <div className="ticker-wrapper">
        <div
          className="ticker-content inline-block whitespace-nowrap"
          style={{
            animation: `scroll-left ${speed}s linear infinite`,
          }}
        >
          <span className="text-base md:text-lg font-semibold px-8">
            📢 {message}
          </span>
          <span className="text-base md:text-lg font-semibold px-8">
            📢 {message}
          </span>
          <span className="text-base md:text-lg font-semibold px-8">
            📢 {message}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-66.666%);
          }
        }

        .ticker-wrapper {
          display: inline-block;
          white-space: nowrap;
        }

        .ticker-content {
          display: inline-block;
          padding-left: 0;
        }

        .ticker-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
