import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // URL del proyecto Bootie externo (standalone)
        const bootieUrl = process.env.BOOTIE_API_URL || "https://bootie-dev.vercel.app";

        console.log(`\n➡️  Redirigiendo consulta a Bootie Externo: ${bootieUrl}`);

        const response = await fetch(`${bootieUrl}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const responseText = await response.text();
        console.log(`Raw Response: ${responseText.substring(0, 200)}...`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${responseText || "Sin respuesta del servidor"}`);
        }

        const data = JSON.parse(responseText);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("❌ Error conectando con el Bootie externo:", error);

        return NextResponse.json(
            { error: "No pude conectar con el cerebro de Bootie.", details: error.message },
            { status: 500 }
        );
    }
}
