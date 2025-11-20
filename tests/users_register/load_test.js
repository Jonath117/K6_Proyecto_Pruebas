import { sleep } from 'k6';
import { registerUser } from '../../lib/api_placeholder.js';

// Configuración: Carga sostenida normal
export const options = {
    stages: [
        { duration: '1m', target: 10 }, // Ramp-up: Subir a 10 usuarios registrándose a la vez
        { duration: '3m', target: 10 }, // Stay: Mantener ritmo constante
        { duration: '1m', target: 0 },  // Ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% de registros deben ser rápidos
        http_req_failed: ['rate<0.01'],   // Menos del 1% de fallos
    },
};

export default function () {
    // Generar datos únicos basados en tu JSON
    const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;
    const payload = {
        name: "Juanceto01",
        email: `juanceto${uniqueId}@example.com`, // Email dinámico
        password: "juan123",
        emailValidated: true
    };

    registerUser(payload);
    
    sleep(1); // Espera 1s entre registros por usuario
}