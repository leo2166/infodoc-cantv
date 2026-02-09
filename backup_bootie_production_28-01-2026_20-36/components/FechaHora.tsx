"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FechaHora = () => {
  const [fecha, setFecha] = useState<Date | null>(null);

  useEffect(() => {
    // Set the date immediately on the client
    setFecha(new Date()); 
    
    const timer = setInterval(() => {
      setFecha(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!fecha) {
    // Render a placeholder on the server and on the initial client render to prevent layout shift
    return <div className="text-center text-sm text-gray-600 dark:text-gray-400 h-5"></div>;
  }

  const formattedDate = format(fecha, "eeee, d 'de' MMMM 'de' yyyy", { locale: es });
  const formattedTime = format(fecha, "h:mm:ss a");

  return (
    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
      Hoy es: {formattedDate} - {formattedTime}
    </div>
  );
};

export default FechaHora;
