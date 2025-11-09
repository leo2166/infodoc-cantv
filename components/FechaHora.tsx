"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FechaHora = () => {
  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setFecha(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = format(fecha, "eeee, d 'de' MMMM 'de' yyyy", { locale: es });
  const formattedTime = format(fecha, "h:mm:ss a");

  return (
    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
      Hoy es: {formattedDate} - {formattedTime}
    </div>
  );
};

export default FechaHora;
