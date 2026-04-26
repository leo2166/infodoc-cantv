"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, Download, PenTool, Globe, Check } from "lucide-react";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function AutorizacionBolsaPage() {
    const [option, setOption] = useState<number | null>(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nombre: "",
        cedula: "",
        telefono: "",
        autorizadoNombre: "",
        autorizadoCedula: "",
        mes: "",
        ciudad: "Maracaibo",
        gestionHumana: "Zulia",
        centroOperativo: "Sabaneta"
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generatePDF = async (includeLogo: boolean, fillData: boolean) => {
        setLoading(true);
        try {
            // Lazy load pdf-lib for faster page navigation
            const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([612, 792]);
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            // 1. Logo support
            if (includeLogo) {
                try {
                    const logoUrl = "/logo-autorizacion.png";
                    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
                    const logoImage = await pdfDoc.embedPng(logoBytes);
                    const dims = logoImage.scale(0.4);
                    page.drawImage(logoImage, {
                        x: 60,
                        y: height - 150,
                        width: dims.width,
                        height: dims.height,
                    });
                } catch (e) {
                    console.error("Error embedding logo, using fallback header", e);
                    page.drawText("AJUPTEL ZULIA", { x: 60, y: height - 80, size: 12, font: fontBold });
                }
            }

            // 2. Date Formatting (Top-Right)
            const today = new Date();
            const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
            const dateStr = today.toLocaleDateString('es-ES', options);
            const cityText = fillData ? (formData.ciudad || "Maracaibo") : "__________";
            const fullDateText = `${cityText}, ${dateStr}`;
            const dateWidth = font.widthOfTextAtSize(fullDateText, 12);
            page.drawText(fullDateText, {
                x: width - 60 - dateWidth,
                y: height - 80,
                size: 12,
                font: font
            });

            // 3. Header
            const headerBase = "Sres. Departamento Gestión Humana";
            const headerText = includeLogo
                ? `${headerBase} ${fillData ? (formData.gestionHumana || "Zulia") : "Zulia"}`
                : headerBase;
            page.drawText(headerText, { x: 80, y: height - 180, size: 12, font: fontBold });

            page.drawText("AUTORIZACIÓN PARA RETIRO DE BENEFICIO", {
                x: width / 2 - 130,
                y: height - 240,
                size: 14,
                font: fontBold,
            });

            const titleWidth = fontBold.widthOfTextAtSize("AUTORIZACIÓN PARA RETIRO DE BENEFICIO", 14);
            page.drawLine({
                start: { x: width / 2 - 130, y: height - 243 },
                end: { x: width / 2 - 130 + titleWidth, y: height - 243 },
                thickness: 1,
                color: rgb(0, 0, 0),
            });

            // 4. Body with Justification and Bold Data
            const leftMargin = 80;
            const rightMargin = 50;
            const contentWidth = width - leftMargin - rightMargin;
            const startY = height - 300;
            const lineHeight = 18;
            const fontSizeBody = 12;

            const data = {
                nombre: fillData ? (formData.nombre || "____________________") : "____________________",
                cedula: fillData ? (formData.cedula || "____________________") : "____________________",
                tlf: fillData ? (formData.telefono || "____________________") : "____________________",
                authNombre: fillData ? (formData.autorizadoNombre || "____________________") : "____________________",
                authCedula: fillData ? (formData.autorizadoCedula || "____________________") : "____________________",
                mes: fillData ? (formData.mes || "____________________") : "____________________",
                centro: fillData ? (formData.centroOperativo || "____________________") : "____________________",
            };

            const segments = [
                { text: "Yo, ", isBold: false },
                { text: data.nombre, isBold: true },
                { text: ", titular de la cédula de identidad Nº ", isBold: false },
                { text: data.cedula, isBold: true },
                { text: " teléfono de contacto: ", isBold: false },
                { text: data.tlf, isBold: true },
                { text: ", por medio de la presente autorizo al ciudadano(a): ", isBold: false },
                { text: data.authNombre, isBold: true },
                { text: " titular de la cédula de identidad Nº ", isBold: false },
                { text: data.authCedula, isBold: true },
                { text: " a efectuar en mi nombre el retiro del beneficio ", isBold: false },
                { text: '"Bolsa de Alimentación"', isBold: true },
                { text: ", correspondiente al mes de ", isBold: false },
                { text: data.mes, isBold: true },
                { text: ", en las instalaciones del Centro Operativo ", isBold: false },
                { text: data.centro, isBold: true },
                { text: ".", isBold: false }
            ];

            const drawRichText = (page: any, segments: any[], startX: number, startY: number, maxWidth: number, fontNormal: any, fontBold: any, fontSize: number, lineSpacing: number) => {
                let currentY = startY;
                let lines: { text: string; isBold: boolean }[][] = [[]];
                let currentLineWidth = 0;

                const allWords: { text: string; isBold: boolean }[] = [];
                segments.forEach(seg => {
                    const words = seg.text.split(/(\s+)/);
                    words.forEach((w: string) => {
                        if (w.length > 0) {
                            allWords.push({ text: w, isBold: seg.isBold });
                        }
                    });
                });

                let currentLine: { text: string; isBold: boolean }[] = [];
                allWords.forEach(wordObj => {
                    const f = wordObj.isBold ? fontBold : fontNormal;
                    const wordWidth = f.widthOfTextAtSize(wordObj.text, fontSize);

                    if (currentLineWidth + wordWidth > maxWidth && wordObj.text !== " ") {
                        lines.push(currentLine);
                        currentLine = [wordObj];
                        currentLineWidth = wordWidth;
                    } else {
                        currentLine.push(wordObj);
                        currentLineWidth += wordWidth;
                    }
                });
                lines.push(currentLine);
                lines = lines.filter(l => l.length > 0);

                lines.forEach((line, index) => {
                    const isLastLine = index === lines.length - 1;
                    let xOffset = startX;

                    let charWidth = 0;
                    let spaceCount = 0;
                    line.forEach((wObj) => {
                        const f = wObj.isBold ? fontBold : fontNormal;
                        charWidth += f.widthOfTextAtSize(wObj.text, fontSize);
                        if (wObj.text.trim() === "") spaceCount++;
                    });

                    const wordSpacing = (!isLastLine && spaceCount > 0) ? (maxWidth - charWidth) / spaceCount : 0;

                    line.forEach((wObj) => {
                        const actualFont = wObj.isBold ? fontBold : fontNormal;
                        page.drawText(wObj.text, {
                            x: xOffset,
                            y: currentY,
                            size: fontSize,
                            font: actualFont
                        });
                        const w = actualFont.widthOfTextAtSize(wObj.text, fontSize);
                        xOffset += w + (wObj.text.trim() === "" ? wordSpacing : 0);
                    });

                    currentY -= lineSpacing;
                });

                return currentY;
            };

            const nextY = drawRichText(page, segments, leftMargin, startY, contentWidth, font, fontBold, fontSizeBody, lineHeight);

            const noteY = nextY - 30;
            const noteSegments = [
                {
                    text: "La presente autorización se emite debido a un impedimento personal que me imposibilita trasladarme hasta el referido centro. En virtud de ello, agradezco a los responsables de la entrega la colaboración necesaria al ciudadano(a) autorizado(a).",
                    isBold: false
                }
            ];

            const noteEndY = drawRichText(page, noteSegments, leftMargin, noteY, contentWidth, font, fontBold, fontSizeBody, lineHeight);

            page.drawText("Sin más que agregar, suscribo la presente en conformidad.", { x: leftMargin, y: noteEndY - 30, size: 11, font });

            page.drawText("Firma del autorizante: _______________________", { x: leftMargin, y: noteEndY - 100, size: 12, font });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Autorizacion_Bolsa_${fillData ? formData.nombre : (includeLogo ? "Zulia" : "Otras_Regiones")}.pdf`;
            link.click();
            setShowDownloadModal(true);
        } catch (error) {
            console.error("Error generating PDF", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadOption = (opt: number) => {
        if (opt === 1) {
            generatePDF(true, false);
        } else {
            setOption(opt);
            if (opt === 3) {
                setFormData({ ...formData, ciudad: "", gestionHumana: "", centroOperativo: "" });
            } else {
                setFormData({ ...formData, ciudad: "Maracaibo", gestionHumana: "Zulia", centroOperativo: "Sabaneta" });
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-10">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/construccion">
                        <Button variant="outline" className="touch-target">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-pretty">
                        Autorización Retiro bolsa alimentación (beneficio)
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Selecciona una opción para generar tu documento de autorización.
                    </p>
                </div>

                {!option ? (
                    <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleDownloadOption(1)}>
                            <CardHeader className="text-center">
                                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <Download className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Zulia (Para rellenar)</CardTitle>
                                <CardDescription>Descarga el formato en blanco con el logo de la asociación.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">Seleccionar</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleDownloadOption(2)}>
                            <CardHeader className="text-center">
                                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <PenTool className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Zulia (Con datos)</CardTitle>
                                <CardDescription>Ingresa tus datos y genera el PDF listo para firmar.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">Seleccionar</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleDownloadOption(3)}>
                            <CardHeader className="text-center">
                                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Otras Regiones</CardTitle>
                                <CardDescription>Genera el documento sin logo para cualquier región del país.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">Seleccionar</Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {option === 2 ? <PenTool className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                    Datos de la Autorización ({option === 2 ? "Zulia" : "Global / Otras Regiones"})
                                </CardTitle>
                                <CardDescription>Completa los campos para generar el documento PDF.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                {/* ═══ SECCIÓN TITULAR ═══ */}
                                <div className="rounded-lg border-2 border-[#0044FF] p-4 space-y-4 shadow-[0_0_8px_0px_rgba(0,68,255,0.25)]">
                                    <p className="text-sm font-bold tracking-wide" style={{ color: "#7B1C1C" }}>
                                        Datos del Titular
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gestionHumana">Estado/Región (Gestión Humana)</Label>
                                            <Input
                                                id="gestionHumana"
                                                name="gestionHumana"
                                                value={formData.gestionHumana}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Zulia"
                                                readOnly={option === 2}
                                                className={`placeholder:text-muted-foreground/30 border-2 border-sky-200 rounded-md ${option === 2 ? "bg-muted cursor-not-allowed" : "bg-[#EFF6FF]"}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ciudad">Ciudad (Donde firmas)</Label>
                                            <Input
                                                id="ciudad"
                                                name="ciudad"
                                                value={formData.ciudad}
                                                onChange={handleInputChange}
                                                placeholder={option === 2 ? "Ej: Maracaibo" : "Ej: Cabimas"}
                                                className="placeholder:text-muted-foreground/30 bg-[#EFF6FF] border-2 border-sky-200 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">Nombre Completo</Label>
                                        <Input
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Juan Pérez"
                                            className="placeholder:text-muted-foreground/30 bg-[#EFF6FF] border-2 border-sky-200 rounded-md"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cedula">Cédula</Label>
                                            <Input
                                                id="cedula"
                                                name="cedula"
                                                value={formData.cedula}
                                                onChange={handleInputChange}
                                                placeholder="Ej: V-12.345.678"
                                                className="placeholder:text-muted-foreground/30 bg-[#EFF6FF] border-2 border-sky-200 rounded-md"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefono">Teléfono de Contacto</Label>
                                            <Input
                                                id="telefono"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                placeholder="Ej: 0412-1234567"
                                                className="placeholder:text-muted-foreground/30 bg-[#EFF6FF] border-2 border-sky-200 rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ═══ SECCIÓN AUTORIZADO ═══ */}
                                <div className="rounded-lg border-2 border-[#15803d] p-4 space-y-4 shadow-[0_0_8px_0px_rgba(21,128,61,0.2)]">
                                    <p className="text-sm font-bold tracking-wide" style={{ color: "#15803d" }}>
                                        Datos del Autorizado (Persona que retira)
                                    </p>

                                    <div className="space-y-2">
                                        <Label htmlFor="autorizadoNombre">Nombre del Autorizado</Label>
                                        <Input
                                            id="autorizadoNombre"
                                            name="autorizadoNombre"
                                            value={formData.autorizadoNombre}
                                            onChange={handleInputChange}
                                            placeholder="Ej: María Rodríguez"
                                            className="placeholder:text-muted-foreground/30 bg-[#F0FDF4] border-2 border-green-200 rounded-md"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="autorizadoCedula">Cédula del Autorizado</Label>
                                            <Input
                                                id="autorizadoCedula"
                                                name="autorizadoCedula"
                                                value={formData.autorizadoCedula}
                                                onChange={handleInputChange}
                                                placeholder="Ej: V-9.999.999"
                                                className="placeholder:text-muted-foreground/30 bg-[#F0FDF4] border-2 border-green-200 rounded-md"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mes">Mes del Beneficio</Label>
                                            <Input
                                                id="mes"
                                                name="mes"
                                                value={formData.mes}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Marzo 2026"
                                                className="placeholder:text-muted-foreground/30 bg-[#F0FDF4] border-2 border-green-200 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="centroOperativo">Centro Operativo (Donde se retira)</Label>
                                        <Input
                                            id="centroOperativo"
                                            name="centroOperativo"
                                            value={formData.centroOperativo}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Sabaneta"
                                            className="placeholder:text-muted-foreground/30 bg-[#F0FDF4] border-2 border-green-200 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setOption(null)}>Cancelar</Button>
                                    <Button className="flex-1" onClick={() => generatePDF(option === 2, true)} disabled={loading}>
                                        {loading ? "Generando..." : "Descargar PDF"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>

            <AlertDialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Descarga Completada
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tu autorización se ha generado y descargado correctamente. Por favor, revísala y fírmala.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDownloadModal(false)}>Aceptar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
