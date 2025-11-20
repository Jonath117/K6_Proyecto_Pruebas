import { sleep } from 'k6';
import { createLoan } from '../../lib/api_placeholder.js';

// Cargar el JSON en la fase de inicialización
const loanData = JSON.parse(open('../../data/loan.json'));

export const options = {
    stages: [
        { duration: '1m', target: 10 }, // Subir suavemente
        { duration: '3m', target: 10 }, // Mantener tráfico constante
        { duration: '1m', target: 0 },  // Bajar
    ],
    thresholds: {
        http_req_duration: ['p(95)<600'], // Escrituras suelen ser más lentas que lecturas
        http_req_failed: ['rate<0.05'],   // Toleramos 5% de fallos (por colisiones de libros)
    },
};

// Función para obtener fecha futura (ISO string)
function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

export default function () {
    // Clonamos el objeto y aleatorizamos IDs para evitar conflictos de "Libro ya prestado"
    // Asumimos que tienes usuarios del 1 al 1000 y libros del 1 al 1000 en tu DB seed
    const payload = Object.assign({}, loanData, {
        userId: Math.floor(Math.random() * 1000) + 1,
        bookId: Math.floor(Math.random() * 1000) + 1,
        dueDate: getFutureDate(7) // Préstamo por 7 días
    });

    createLoan(payload);
    
    sleep(1); 
}