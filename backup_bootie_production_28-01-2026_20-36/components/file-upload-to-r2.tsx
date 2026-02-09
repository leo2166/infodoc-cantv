"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadResult {
    success: boolean;
    fileName?: string;
    originalName?: string;
    url?: string;
    size?: number;
    type?: string;
    error?: string;
    message?: string;
}

export function FileUploadToR2() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<UploadResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null); // Limpiar resultado anterior
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setResult({
                success: false,
                error: 'Por favor selecciona un archivo'
            });
            return;
        }

        setUploading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload-to-r2', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
                setFile(null); // Limpiar archivo seleccionado
            } else {
                setResult({
                    success: false,
                    error: data.error || 'Error al subir el archivo'
                });
            }
        } catch (error) {
            setResult({
                success: false,
                error: 'Error de red al subir el archivo'
            });
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Subir Archivo a Cloudflare R2
                </CardTitle>
                <CardDescription>
                    Sube PDFs o imágenes (JPG, PNG, WebP). Máximo 50 MB.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="file-upload">Seleccionar archivo</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="file-upload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="flex-1"
                        />
                    </div>
                    {file && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {file.type.startsWith('image/') ? (
                                <ImageIcon className="w-4 h-4" />
                            ) : (
                                <FileText className="w-4 h-4" />
                            )}
                            <span>{file.name} ({formatFileSize(file.size)})</span>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Subiendo...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Subir a R2
                        </>
                    )}
                </Button>

                {result && (
                    <Alert variant={result.success ? "default" : "destructive"}>
                        {result.success ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>
                            {result.success ? (
                                <div className="space-y-2">
                                    <p className="font-medium">{result.message}</p>
                                    <div className="text-sm space-y-1">
                                        <p><strong>Nombre:</strong> {result.fileName}</p>
                                        <p><strong>Tamaño:</strong> {result.size && formatFileSize(result.size)}</p>
                                        <p><strong>URL:</strong></p>
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline break-all"
                                        >
                                            {result.url}
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p>{result.error}</p>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
