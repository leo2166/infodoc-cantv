import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided.' }, { status: 400 });
    }

    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    for (const imageBase64 of images) {
      // Remove the data URI prefix
      const imageBytes = Buffer.from(imageBase64.split(',')[1], 'base64');

      // Embed the JPG image
      const jpgImage = await pdfDoc.embedJpg(imageBytes);

      // Add a new page
      const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);

      // Draw the image on the page, fitting it to the page size
      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="documento.pdf"',
      },
    });

  } catch (error) {
    console.error('Error creating PDF:', error);
    return NextResponse.json({ error: 'Failed to create PDF.' }, { status: 500 });
  }
}
