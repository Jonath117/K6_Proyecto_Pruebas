import { sleep } from 'k6';
import { loginUser, getBooks } from '../../lib/api_placeholder.js';

export const options = {
    stages: [
        { duration: '2m', target: 50 },  // Subir a carga moderada
        { duration: '1h', target: 50 },  // MANTENER por 1 hora
        { duration: '2m', target: 0 },   // Bajar
    ],
};

export default function () {
    getBooks();
    
    loginUser({
        email: "admin@example.com", // Usamos un user existente para no llenar la DB en 4 horas
        password: "123456"
    });

    sleep(2);
}