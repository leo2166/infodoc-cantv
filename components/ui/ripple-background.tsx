import React from "react";

export const RippleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center opacity-30">
        {/* Generamos 4 ondas con diferentes retrasos para el efecto continuo */}
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/40 opacity-0 animate-ripple delay-0"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/40 opacity-0 animate-ripple delay-1000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/40 opacity-0 animate-ripple delay-2000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/40 opacity-0 animate-ripple delay-3000"></div>
      </div>
    </div>
  );
};
