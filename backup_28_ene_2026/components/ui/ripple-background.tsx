"use client";

import React, { useEffect, useState } from "react";

export const RippleBackground = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Esperar 3 segundos antes de montar el componente
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center opacity-50">
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/60 opacity-0 animate-ripple delay-0"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/60 opacity-0 animate-ripple delay-2000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/60 opacity-0 animate-ripple delay-4000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/60 opacity-0 animate-ripple delay-6000"></div>
      </div>
    </div>
  );
};
