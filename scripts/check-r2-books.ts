import { listR2Files } from '../lib/r2-client';
import 'dotenv/config';

async function checkBooks() {
    try {
        console.log('Consultando archivos en R2...');
        const files = await listR2Files();
        console.log('Archivos encontrados en el bucket:');
        console.log(files);
        
        const books = ['LibroL1.pdf', 'LibroL2.pdf', 'LibroL3.pdf', 'LibroL4 .pdf', 'L1.jpg', 'L2.jpg', 'L3.jpg', 'L4.jpg'];
        console.log('\nVerificación de libros específicos:');
        books.forEach(book => {
            const exists = files.includes(book);
            console.log(`${exists ? '✅' : '❌'} ${book}`);
        });
    } catch (error) {
        console.error('❌ Error consultando R2:', error);
    }
}

checkBooks();
