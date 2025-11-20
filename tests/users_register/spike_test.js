import { sleep } from 'k6';
import { registerUser } from '../../lib/api_placeholder.js';

// Configuración: Pico repentino y agresivo
export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Bajo tráfico
        { duration: '1m', target: 300 },  // SPIKE: 300 usuarios simultáneos escribiendo
        { duration: '1m', target: 300 },  // Mantener la presión
        { duration: '30s', target: 0 },   // Caída
    ],
};

export default function () {
    const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;
    
    const payload = {
        name: "Juanceto01",
        email: `spike${uniqueId}@example.com`,
        password: "juan123",
        emailValidated: true
    };

    registerUser(payload);
    sleep(1);
}