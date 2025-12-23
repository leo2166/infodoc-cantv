import { bcvDolar } from 'bcv-divisas';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

// Configuración de caché: revalidar cada 30 minutos (1800 segundos)
const CACHE_REVALIDATE_SECONDS = 1800;

// Función cacheada para obtener la tasa del BCV
const getCachedBcvRate = unstable_cache(
  async () => {
    try {
      console.log('🔄 Obteniendo tasa del BCV (no desde caché)...');
      const data = await bcvDolar();

      if (!data || !data._dolar) {
        throw new Error('No se pudo obtener la tasa de cambio.');
      }

      return {
        rate: data._dolar,
        timestamp: new Date().toISOString(),
        success: true
      };
    } catch (error) {
      console.error('❌ Error fetching exchange rate:', error);
      return {
        rate: null,
        timestamp: new Date().toISOString(),
        success: false,
        error: 'Error al obtener la tasa'
      };
    }
  },
  ['bcv-rate'], // Cache key
  {
    revalidate: CACHE_REVALIDATE_SECONDS, // Revalidar cada 30 minutos
    tags: ['bcv-rate']
  }
);

export async function GET() {
  try {
    const cachedData = await getCachedBcvRate();

    if (!cachedData.success || !cachedData.rate) {
      return NextResponse.json(
        {
          error: cachedData.error || 'No se pudo obtener la tasa de cambio.',
          timestamp: cachedData.timestamp
        },
        { status: 500 }
      );
    }

    console.log('✅ Tasa del BCV obtenida:', cachedData.rate);

    return NextResponse.json({
      rate: cachedData.rate,
      timestamp: cachedData.timestamp,
      cached: true
    });
  } catch (error) {
    console.error('❌ Error en el endpoint:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
