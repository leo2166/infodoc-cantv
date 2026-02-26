import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // URL del proyecto Bootie externo (standalone)
        const bootieUrl = process.env.BOOTIE_API_URL || "https://bootie-dev.vercel.app";

        console.log(`\n➡️  Redirigiendo consulta a Bootie Externo: ${bootieUrl}`);

        // La ruta en el standalone es /api/chat-bootie (según el análisis previo)
        // Pero el usuario dijo bootie-dev.vercel.app, así que probaremos con /api/chat primero
        // o si sabemos que el standalone usa chat-bootie, usamos esa.
        // Revisando route.ts local, su nombre es chat-bootie.

        const response = await fetch(`${bootieUrl}/api/chat-bootie`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error en el servidor de Bootie");
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("❌ Error conectando con el Bootie externo:", error);

        return NextResponse.json(
            { error: "No pude conectar con el cerebro de Bootie.", details: error.message },
            { status: 500 }
        );
    }
}
