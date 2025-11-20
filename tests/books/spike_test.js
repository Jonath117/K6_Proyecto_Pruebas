import { sleep } from 'k6';
import { createBook } from '../../lib/api_placeholder.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {

    stages: [
        { duration: '30s', target: 5 },   
        { duration: '1m', target: 200 },  
        { duration: '1m', target: 200 },  
        { duration: '30s', target: 0 },   
    ],

    thresholds: {
        http_req_failed: ['rate<0.05'], 
    },
};

export default function () {
    const uniqueRef = `${Date.now()}-${__VU}-${__ITER}`;
    
    const payload = {
        title: `Spike Book ${uniqueRef}`,
        author: "Spike Runner",
        isbn: `SPIKE-${uniqueRef}`,
        publicationYear: 2024,
        categoryId: 1,
        totalQuantity: 100,
        availableQuantity: 100
    };

    createBook(payload);
    sleep(1);
}

export function handleSummary(data) {
    const reportName = __ENV.REPORT_NAME || 'books_spike_test';
    
    const pathJson = `./reportes_finales/${reportName}.json`;
    const pathHtml = `./reportes_finales/${reportName}.html`;
  
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }), 
        [pathJson]: JSON.stringify(data), 
        [pathHtml]: htmlReport(data), 
    };
}