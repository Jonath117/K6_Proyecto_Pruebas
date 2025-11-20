import { sleep } from 'k6';
import { createBook } from '../../lib/api_placeholder.js';

export const options = {
    stages: [
        { duration: '30s', target: 5 },   // Calentamiento
        { duration: '1m', target: 200 },  // SPIKE: 200 VUs insertando libros a la vez
        { duration: '1m', target: 200 },  // Mantener pico
        { duration: '30s', target: 0 },   // Enfriamiento
    ],
};

export default function () {
    const uniqueRef = `${Date.now()}-${__VU}-${__ITER}`;
    
    const payload = {
        title: `Spike Book ${uniqueRef}`,
        author: "Spike Runner",
        isbn: `SPIKE-${uniqueRef}`,
        publicationYear: 2024,
        categoryId: 1,
        totalQuantity: 100,
        availableQuantity: 100
    };

    createBook(payload);
    sleep(1);
}