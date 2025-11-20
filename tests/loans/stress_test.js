import { sleep } from 'k6';
import { createLoan } from '../../lib/api_placeholder.js';

const loanData = JSON.parse(open('../../data/loan.json'));

export const options = {
    stages: [
        { duration: '1m', target: 20 },
        { duration: '2m', target: 50 },  // Carga media
        { duration: '2m', target: 100 }, // Carga alta (muchas transacciones concurrentes)
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        // En estrés, es normal que aumenten los fallos por "Book not available" si el rango de IDs es corto
        http_req_failed: ['rate<0.10'], 
    },
};

function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export default function () {
    const payload = Object.assign({}, loanData, {
        userId: Math.floor(Math.random() * 2000) + 1, // Rango más amplio para reducir colisiones
        bookId: Math.floor(Math.random() * 2000) + 1,
        dueDate: getFutureDate(15)
    });

    createLoan(payload);
    
    sleep(0.5); // Peticiones rápidas
}