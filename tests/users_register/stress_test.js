import { sleep } from 'k6';
import { registerUser } from '../../lib/api_placeholder.js';

// Configuración: Llevar el sistema al límite
export const options = {
    stages: [
        { duration: '1m', target: 20 },  // Calentamiento
        { duration: '2m', target: 50 },  // Carga media
        { duration: '2m', target: 100 }, // Carga alta (muchas escrituras en DB)
        { duration: '2m', target: 200 }, // Punto de estrés extremo para escrituras locales
        { duration: '1m', target: 0 },   // Enfriamiento
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'], // Toleramos hasta 5% de fallos en estrés
    },
};

export default function () {
    const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;
    
    const payload = {
        name: "Juanceto01",
        email: `stress${uniqueId}@example.com`,
        password: "juan123",
        emailValidated: true
    };

    registerUser(payload);
    
    sleep(0.5); // Intervalos cortos para presionar la DB
}