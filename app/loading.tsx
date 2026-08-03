import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors">
      <div className="flex flex-col items-center justify-center space-y-4 px-4 text-center">
        {/* Logo ID */}
        <div className="w-16 h-16 bg-[#0891b2] rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25 animate-pulse">
          <span className="text-white font-black text-2xl tracking-wider">ID</span>
        </div>

        {/* Título y estado */}
        <div className="space-y-1">
          <h1 className="font-heading font-black text-2xl text-slate-800 dark:text-slate-100">
            InfoDoc
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
            Cargando el sistema...
          </p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-44 sm:w-52 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-[#0891b2] via-blue-600 to-[#0891b2] rounded-full animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
}
