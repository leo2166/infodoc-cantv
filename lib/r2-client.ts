import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Configuración del cliente S3 para Cloudflare R2
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

/**
 * Sube un archivo a Cloudflare R2
 * @param key - Ruta del archivo en el bucket (ej: "LibroL2.pdf")
 * @param body - Contenido del archivo (Buffer)
 * @param contentType - Tipo MIME del archivo
 */
export async function uploadToR2(
    key: string,
    body: Buffer,
    contentType: string
): Promise<void> {
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || '',
        Key: key,
        Body: body,
        ContentType: contentType,
    });

    await r2Client.send(command);
    console.log(`✅ Subido: ${key}`);
}

/**
 * Lista todos los archivos en el bucket R2
 */
export async function listR2Files(): Promise<string[]> {
    const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME || '',
    });

    const response = await r2Client.send(command);
    return response.Contents?.map((item) => item.Key || '') || [];
}

/**
 * Genera la URL pública de un archivo en R2
 * @param key - Ruta del archivo en el bucket
 */
export function getR2PublicUrl(key: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    return `${baseUrl}/${key}`;
}

export { r2Client };
