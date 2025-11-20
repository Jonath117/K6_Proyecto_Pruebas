import { sleep } from 'k6';
import { createBook } from '../../lib/api_placeholder.js';

export const options = {
    stages: [
        { duration: '1m', target: 20 },
        { duration: '2m', target: 50 },
        { duration: '2m', target: 100 }, // Punto de estrés alto para inserciones
        { duration: '2m', target: 150 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'], // Tolerancia del 5% bajo estrés
    },
};

export default function () {
    // Usamos Math.random para mayor variabilidad en stress
    const randomPart = Math.floor(Math.random() * 1000000);
    
    const payload = {
        title: `Stress Book ${randomPart}`,
        author: "Stress Tester",
        isbn: `STRESS-${randomPart}-${__VU}-${__ITER}`,
        publicationYear: 2024,
        categoryId: 1, 
        totalQuantity: 10,
        availableQuantity: 10
    };

    createBook(payload);
    
    sleep(0.5); // Frecuencia alta
}