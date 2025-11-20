import { sleep } from 'k6';
import { getBooks, getCategories } from '../../lib/api_placeholder.js';

export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Calentamiento
        { duration: '1m', target: 400 },  // SPIKE: Subida brutal a 400 usuarios
        { duration: '2m', target: 400 },  // Mantener el pico
        { duration: '1m', target: 10 },   // Bajada rápida
        { duration: '1m', target: 0 },    // Fin
    ],
};

export default function () {
    // Durante un spike, nos interesa ver si las APIs de lectura aguantan
    getBooks();
    getCategories();
    sleep(1);
}