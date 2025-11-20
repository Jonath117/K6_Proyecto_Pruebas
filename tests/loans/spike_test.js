import { sleep } from 'k6';
import { createLoan } from '../../lib/api_placeholder.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const loanData = JSON.parse(open('../../data/loan.json'));

export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 250 },
        { duration: '1m', target: 250 },
        { duration: '30s', target: 0 },
    ],
};

function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export default function () {
    const payload = Object.assign({}, loanData, {
        userId: Math.floor(Math.random() * 5000) + 1,
        bookId: Math.floor(Math.random() * 5000) + 1,
        dueDate: getFutureDate(3)
    });

    createLoan(payload);
    sleep(1);
}

export function handleSummary(data) {
    const reportName = __ENV.REPORT_NAME || 'loans_spike_test';
    const pathJson = `./reportes_finales/${reportName}.json`;
    const pathHtml = `./reportes_finales/${reportName}.html`;
  
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }), 
        [pathJson]: JSON.stringify(data), 
        [pathHtml]: htmlReport(data), 
    };
}