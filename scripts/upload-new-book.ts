import fs from 'fs';
import path from 'path';
import { uploadToR2 } from '../lib/r2-client';
import 'dotenv/config';

async function uploadBook() {
    try {
        const pdfPath = path.join('public', 'PADRE RICO, PADRE POBRE.pdf');
        const imgPath = path.join('public', 'img_padre.jpg');

        if (!fs.existsSync(pdfPath) || !fs.existsSync(imgPath)) {
            console.error('❌ No se encontraron los archivos en la carpeta public/');
            process.exit(1);
        }

        const pdfBuffer = fs.readFileSync(pdfPath);
        const imgBuffer = fs.readFileSync(imgPath);

        console.log('Subiendo PDF...');
        await uploadToR2('LibroL5.pdf', pdfBuffer, 'application/pdf');

        console.log('Subiendo Carátula...');
        await uploadToR2('L5.jpg', imgBuffer, 'image/jpeg');

        console.log('✅ Libro subido exitosamente como LibroL5 y L5.jpg');
    } catch (error) {
        console.error('❌ Error subiendo el libro:', error);
        process.exit(1);
    }
}

uploadBook();
