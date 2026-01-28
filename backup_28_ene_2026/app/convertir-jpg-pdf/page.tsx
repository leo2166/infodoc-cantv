'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, File, X, Loader2, Download, ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import Link from 'next/link';

export default function ConvertJpgToPdfPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const jpgFiles = files.filter(file => file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg'));
      setSelectedFiles(prevFiles => [...prevFiles, ...jpgFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
    const base64Promises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    });
    return Promise.all(base64Promises);
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      setError('Por favor, selecciona al menos un archivo JPG.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const base64Images = await convertFilesToBase64(selectedFiles);

      const response = await fetch('/api/convert-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: base64Images }),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor al crear el PDF.');
      }

      const pdfBlob = await response.blob();
      
      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = 'documento_convertido.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setSelectedFiles([]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto mb-8">
          <Link href="/">
            <Button variant="outline" className="touch-target">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Download className="w-6 h-6" />
              Convertir JPG a PDF
            </CardTitle>
            <CardDescription>
              Selecciona una o más imágenes JPG para combinarlas en un único archivo PDF.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                  </p>
                  <p className="text-xs text-muted-foreground">Solo archivos JPG</p>
                </div>
                <Input id="file-upload" type="file" className="hidden" multiple accept="image/jpeg" onChange={handleFileChange} />
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Archivos Seleccionados:</h3>
                <ul className="border rounded-md p-2 space-y-2 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between text-sm bg-muted/30 p-2 rounded-md">
                      <div className="flex items-center gap-2 truncate">
                        <File className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button onClick={handleConvert} disabled={isLoading || selectedFiles.length === 0} className="w-full text-lg py-6">
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
              ) : (
                'Convertir a PDF'
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}