import { sleep } from 'k6';
import { registerUser } from '../../lib/api_placeholder.js';

// Configuración: Larga duración (ej. 2 horas)
export const options = {
    stages: [
        { duration: '2m', target: 30 },   // Subir a 30 usuarios
        { duration: '30m', target: 30 },   // MANTENER por 30 minutos
        { duration: '2m', target: 0 },    // Bajar
    ],
};

export default function () {
    const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;
    
    const payload = {
        name: "Juanceto01",
        email: `soak${uniqueId}@example.com`,
        password: "juan123",
        emailValidated: true
    };

    registerUser(payload);
    
    // Importante: Pausa de 2 a 5 segundos para moderar el crecimiento de la DB
    // y enfocarse en la estabilidad de conexiones a largo plazo.
    sleep(3); 
}