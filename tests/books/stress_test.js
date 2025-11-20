import { sleep } from 'k6';
import { createBook } from '../../lib/api_placeholder.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    stages: [
        { duration: '1m', target: 20 },
        { duration: '2m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '2m', target: 150 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'],
    },
};

export default function () {
    const randomPart = Math.floor(Math.random() * 1000000);
    
    const payload = {
        title: `Stress Book ${randomPart}`,
        author: "Stress Tester",
        isbn: `STRESS-${randomPart}-${__VU}-${__ITER}`,
        publicationYear: 2024,
        categoryId: 1, 
        totalQuantity: 10,
        availableQuantity: 10
    };

    createBook(payload);
    
    sleep(0.5);
}

export function handleSummary(data) {
    const reportName = __ENV.REPORT_NAME || 'books_stress_test';
    const pathJson = `./reportes_finales/${reportName}.json`;
    const pathHtml = `./reportes_finales/${reportName}.html`;
  
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }), 
        [pathJson]: JSON.stringify(data), 
        [pathHtml]: htmlReport(data), 
    };
}