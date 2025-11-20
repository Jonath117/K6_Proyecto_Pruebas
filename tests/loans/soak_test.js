import { sleep } from 'k6';
import { createLoan } from '../../lib/api_placeholder.js';

const loanData = JSON.parse(open('../../data/loan.json'));

export const options = {
    stages: [
        { duration: '2m', target: 20 },  // Subir a 20 usuarios
        { duration: '30m', target: 20 },  // MANTENER por 30 minutos
        { duration: '2m', target: 0 },   // Bajar
    ],
};

function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export default function () {
    const payload = Object.assign({}, loanData, {
        // Usamos rangos muy altos para intentar no repetir IDs durante las 3 horas
        userId: Math.floor(Math.random() * 10000) + 1,
        bookId: Math.floor(Math.random() * 10000) + 1,
        dueDate: getFutureDate(30)
    });

    createLoan(payload);
    
    sleep(4); // Pausa larga para simular flujo operativo real
}