import { bcvDolar } from 'bcv-divisas';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await bcvDolar();
    if (!data || !data._dolar) {
      return NextResponse.json({ error: 'No se pudo obtener la tasa de cambio.' }, { status: 500 });
    }
    return NextResponse.json({ rate: data._dolar });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
