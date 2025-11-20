import { sleep } from 'k6';
import { createLoan } from '../../lib/api_placeholder.js';

const loanData = JSON.parse(open('../../data/loan.json'));

export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Calma antes de la tormenta
        { duration: '1m', target: 250 },  // SPIKE: 250 préstamos simultáneos
        { duration: '1m', target: 250 },  // Sostener el pico
        { duration: '30s', target: 0 },   // Calma
    ],
};

function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export default function () {
    // En un spike, nos interesa ver si la API responde con 500 o si maneja el 409 (Conflict) correctamente
    const payload = Object.assign({}, loanData, {
        userId: Math.floor(Math.random() * 5000) + 1,
        bookId: Math.floor(Math.random() * 5000) + 1,
        dueDate: getFutureDate(3)
    });

    createLoan(payload);
    sleep(1);
}