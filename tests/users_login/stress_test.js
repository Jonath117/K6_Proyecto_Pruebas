import { sleep } from 'k6';
import { getBooks, getCategories } from '../../lib/api_placeholder.js';

export const options = {
    stages: [
        { duration: '2m', target: 50 },  // Carga baja
        { duration: '2m', target: 100 }, // Carga media
        { duration: '2m', target: 200 }, // Carga alta (Punto de estrés probable para local)
        { duration: '2m', target: 300 }, // Carga muy alta
        { duration: '2m', target: 0 },   // Recuperación
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // Menos del 1% de fallos permitidos
    },
};

export default function () {

    getBooks();
    getCategories();
    
    sleep(0.5);
}