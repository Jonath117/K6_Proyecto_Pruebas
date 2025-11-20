import { sleep } from 'k6';
import { registerUser, loginUser, getCategories, getBooks } from '../../lib/api_placeholder.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
        { duration: '1m', target: 20 },
        { duration: '3m', target: 20 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], 
    },
};

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

export function handleSummary(data) {
    const reportName = __ENV.REPORT_NAME || 'users_login_load_test';
    const pathJson = `./reportes_finales/${reportName}.json`;
    const pathHtml = `./reportes_finales/${reportName}.html`;
  
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }), 
        [pathJson]: JSON.stringify(data), 
        [pathHtml]: htmlReport(data), 
    };
}