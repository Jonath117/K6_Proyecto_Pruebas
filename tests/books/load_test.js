import { sleep } from 'k6';
import { createBook } from '../../lib/api_placeholder.js';

export const options = {
    stages: [
        { duration: '1m', target: 10 }, // Subida suave
        { duration: '3m', target: 10 }, // Mantener carga
        { duration: '1m', target: 0 },  // Bajada
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], 
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    // Generador de ISBN único simple para evitar conflictos
    const uniqueCode = `${__VU}${__ITER}${Date.now().toString().slice(-4)}`;
    
    const payload = {
        title: `K6 Test Book ${uniqueCode}`,
        author: "K6 Automated Author",
        isbn: `978-0-${uniqueCode}-1`, // ISBN simulado único
        publicationYear: 2024,
        categoryId: 1, // Asegúrate que la categoría ID 1 exista en tu DB
        totalQuantity: 50,
        availableQuantity: 50
    };

    createBook(payload);
    
    sleep(1); 
}