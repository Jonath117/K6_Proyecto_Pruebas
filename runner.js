import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import 'dotenv/config'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de directorios
const TESTS_DIR = path.join(__dirname, 'tests');
const REPORTS_DIR = path.join(__dirname, 'reportes_finales');

// Asegurar que exista el directorio de salida donde K6 guardará los reportes
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

// Variables de entorno
const BASE_URL = process.env.BASE_URL || 'http://localhost:5555';
const TOKEN = process.env.TOKEN; 

if (!TOKEN) {
    console.error(" ERROR: No se encontró la variable TOKEN en el archivo .env");
    process.exit(1);
}

// --- FUNCIÓN PARA BUSCAR ARCHIVOS RECURSIVAMENTE ---
function getAllTestFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllTestFiles(fullPath, arrayOfFiles);
        } else {
            // Ignoramos helpers y archivos que no sean .js
            if (file.endsWith('.js') && !file.includes('api_place_holder')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

// Obtenemos la lista completa de archivos
const allTestFiles = getAllTestFiles(TESTS_DIR);

console.log(`\n Iniciando Suite de Pruebas K6 (Modo Delegado)`);
console.log(`Target: ${BASE_URL}`);
console.log(`Scripts encontrados: ${allTestFiles.length}\n`);

allTestFiles.forEach((filePath, index) => {
    // Construimos el nombre único del reporte
    const parentFolder = path.basename(path.dirname(filePath)); // ej: "books"
    const fileName = path.basename(filePath, '.js');            // ej: "load_test"
    
    // Nombre final: books_load_test
    const uniqueTestName = `${parentFolder}_${fileName}`; 

    console.log(` [${index + 1}/${allTestFiles.length}] Ejecutando: ${uniqueTestName}...`);

    try {
        // AQUI ESTÁ EL CAMBIO PRINCIPAL:
        // 1. Pasamos REPORT_NAME como variable de entorno (-e)
        // 2. Ya NO usamos --summary-export, porque el script lo maneja internamente
        const envVars = `-e BASE_URL=${BASE_URL} -e TOKEN=${TOKEN} -e REPORT_NAME="${uniqueTestName}"`;
        
        const cmd = `k6 run ${envVars} "${filePath}"`;
        
        // Ejecutamos comando
        execSync(cmd, { stdio: 'inherit' }); 

        console.log(`Finalizado. Reportes guardados en: ./reportes_finales/${uniqueTestName}.html\n`);

    } catch (error) {
        console.error(`Falló la ejecución de ${uniqueTestName}`);
        // No hacemos throw para que continúe con el siguiente test
    }
});

console.log(" Ejecución completa.");