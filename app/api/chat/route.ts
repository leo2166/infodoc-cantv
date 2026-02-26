import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Obtener la URL del proyecto Bootie externo, o un default si no está configurada
        const bootieUrl = process.env.BOOTIE_API_URL || "https://bootie-dev.vercel.app";

        console.log(`\n➡️  Redirigiendo consulta a Bootie Externo: ${bootieUrl}`);

        // Hacemos un proxy de la peticion al otro servidor
        const response = await fetch(`${bootieUrl}/api/chat`, {
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
