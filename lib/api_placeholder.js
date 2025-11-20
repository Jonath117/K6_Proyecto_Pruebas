import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5555';
const TOKEN = __ENV.TOKEN;

if (!TOKEN) {
    throw new Error('ERROR: Debes proporcionar un TOKEN de autenticación.');
}

const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': TOKEN,
};

export function getCategories() {
    const url = `${BASE_URL}/api/categories`;
    const res = http.get(url, { headers: HEADERS });
    check(res, {
        'getCategories: status is 200': (r) => r.status === 200,
    });
    return res;
}

export function getBooks() {
    const url = `${BASE_URL}/api/books`;
    const res = http.get(url, { headers: HEADERS });
    check(res, {
        'getBooks: status is 200': (r) => r.status === 200,
    });
    return res;
}

export function createBook(bookData) {
    const url = `${BASE_URL}/api/books`;
    const payload = JSON.stringify(bookData);
    const res = http.post(url, payload, { headers: HEADERS });
    check(res, {
        'createBook: status is 201': (r) => r.status === 201,
    });
    return res;
}

export function registerUser(userData) {
    const url = `${BASE_URL}/api/auth/register`;
    const payload = JSON.stringify(userData);
    const res = http.post(url, payload, { headers: HEADERS });
    check(res, {
        'registerUser: status is 201': (r) => r.status === 201,
    });
    return res;
}

export function loginUser(credentials) {
    const url = `${BASE_URL}/api/auth/login`;
    const payload = JSON.stringify(credentials);
    const res = http.post(url, payload, { headers: HEADERS });
    check(res, {
        'loginUser: status is 200': (r) => r.status === 200,
    });
    return res;
}

export function createLoan(loanData) {
    const url = `${BASE_URL}/api/loans`;
    const payload = JSON.stringify(loanData);
    const res = http.post(url, payload, { headers: HEADERS });
    check(res, {
        'createLoan: status is 201': (r) => r.status === 201,
    });
    return res;
}

export function returnLoan(loanId) {
    const url = `${BASE_URL}/api/loans/${loanId}/return`;
    const res = http.put(url, null, { headers: HEADERS });
    check(res, {
        'returnLoan: status is 200': (r) => r.status === 200,
    });
    return res;
}