import { sleep } from 'k6';
import { registerUser, loginUser, getCategories, getBooks } from '../../lib/api_placeholder.js';

// Configuración del escenario de carga
export const options = {
    stages: [
        { duration: '1m', target: 20 }, // Ramp-up: subir a 20 usuarios en 1 minuto
        { duration: '3m', target: 20 }, // Stay: mantener 20 usuarios por 3 minutos
        { duration: '1m', target: 0 },  // Ramp-down: bajar a 0 usuarios
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], 
    },
};

// Generador de emails aleatorios para evitar conflictos en registro
function generateRandomEmail() {
    return `user${__VU}_${__ITER}_${Date.now()}@example.com`;
}

export default function () {
    const email = generateRandomEmail();
    const password = 'password123';

    registerUser({
        name: 'LoadTestUser',
        email: email,
        password: password,
        emailValidated: true
    });

    loginUser({
        email: email,
        password: password
    });

    getCategories();
    sleep(1);
    getBooks();
    
    sleep(1);
}