import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configurar cliente R2
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validar tipo de archivo (solo PDFs e imágenes)
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Tipo de archivo no permitido. Solo se permiten PDFs e imágenes (JPG, PNG, WebP)' },
                { status: 400 }
            );
        }

        // Validar tamaño (máx 50MB)
        const maxSize = 50 * 1024 * 1024; // 50 MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'El archivo es demasiado grande. Tamaño máximo: 50 MB' },
                { status: 400 }
            );
        }

        // Generar nombre de archivo con timestamp para evitar duplicados
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${sanitizedFileName}`;

        // Convertir archivo a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Subir a R2
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME || 'infodoc-assets',
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        });

        await r2Client.send(command);

        // Generar URL pública
        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;

        return NextResponse.json({
            success: true,
            fileName,
            originalName: file.name,
            size: file.size,
            type: file.type,
            url: publicUrl,
            message: 'Archivo subido exitosamente a Cloudflare R2'
        });

    } catch (error) {
        console.error('Error al subir archivo a R2:', error);
        return NextResponse.json(
            { error: 'Error al subir el archivo'),
            { status: 500 }
    );
    }
}
