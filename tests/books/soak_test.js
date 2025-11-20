import { sleep } from 'k6';
import { createBook } from '../../lib/api_placeholder.js';

export const options = {
    stages: [
        { duration: '2m', target: 15 },  // Carga moderada
        { duration: '30m', target: 15 },  // MANTENER por 30minutos
        { duration: '2m', target: 0 },   // Apagar
    ],
};

export default function () {
    const uniqueRef = `${Date.now()}-${__VU}-${__ITER}`;
    
    const payload = {
        title: `Soak Book ${uniqueRef}`,
        author: "Librarian Bot",
        isbn: `SOAK-${uniqueRef}`,
        publicationYear: 2023,
        categoryId: 1,
        totalQuantity: 5,
        availableQuantity: 5
    };

    createBook(payload);
    
    sleep(2); // Ritmo sostenible
}