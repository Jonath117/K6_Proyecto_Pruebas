import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import reporter from 'k6-html-reporter';
import 'dotenv/config'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de directorios
const TESTS_DIR = path.join(__dirname, 'tests');
const REPORTS_DIR = path.join(__dirname, 'reportes_finales');
const TEMP_JSON_DIR = path.join(__dirname, 'temp_json');

// Asegurar que existan los directorios de salida
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
if (!fs.existsSync(TEMP_JSON_DIR)) fs.mkdirSync(TEMP_JSON_DIR, { recursive: true });

// Variables de entorno
const BASE_URL = process.env.BASE_URL || 'http://localhost:5555';
const TOKEN = process.env.TOKEN; 

if (!TOKEN) {
    console.error("❌ ERROR: No se encontró la variable TOKEN en el archivo .env");
    process.exit(1);
}

// --- FUNCIÓN PARA BUSCAR ARCHIVOS RECURSIVAMENTE ---
function getAllTestFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            // Si es carpeta, entramos en ella (recursividad)
            arrayOfFiles = getAllTestFiles(fullPath, arrayOfFiles);
        } else {
            // Si es archivo .js y no es un helper, lo agregamos
            if (file.endsWith('.js') && !file.includes('api_place_holder')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

// Obtenemos la lista completa de archivos incluyendo subcarpetas
const allTestFiles = getAllTestFiles(TESTS_DIR);

console.log(`\n🚀 Iniciando Suite de Pruebas K6 (Modo Recursivo)`);
console.log(`Target: ${BASE_URL}`);
console.log(`Total de scripts encontrados: ${allTestFiles.length}\n`);

allTestFiles.forEach((filePath, index) => {
    // Extraemos info para generar nombres únicos
    // Ejemplo filePath: .../tests/books/load_test.js
    const parentFolder = path.basename(path.dirname(filePath)); // "books"
    const fileName = path.basename(filePath, '.js');            // "load_test"
    
    // Nombre único: books_load_test
    const uniqueTestName = `${parentFolder}_${fileName}`; 
    const jsonReportPath = path.join(TEMP_JSON_DIR, `${uniqueTestName}.json`);

    console.log(`▶️ [${index + 1}/${allTestFiles.length}] Ejecutando: [${parentFolder}] ${fileName}...`);

    try {
        const envVars = `-e BASE_URL=${BASE_URL} -e TOKEN=${TOKEN}`;
        
        // Ejecutamos K6
        const cmd = `k6 run ${envVars} --summary-export "${jsonReportPath}" "${filePath}"`;
        execSync(cmd, { stdio: 'inherit' }); 

        console.log(`   ✅ Test finalizado. Generando HTML...`);

        // Generar reporte HTML
        reporter.generateSummaryReport({
            jsonFile: jsonReportPath,
            output: REPORTS_DIR,
        });

        // Renombrado del reporte para incluir la carpeta (books_load_test.html)
        const defaultHtml = path.join(REPORTS_DIR, 'report.html');
        const finalHtml = path.join(REPORTS_DIR, `${uniqueTestName}.html`);
        
        if (fs.existsSync(defaultHtml)) {
             if(fs.existsSync(finalHtml)) fs.unlinkSync(finalHtml);
             fs.renameSync(defaultHtml, finalHtml);
        }

        console.log(`   📄 Reporte guardado: ${finalHtml}\n`);

    } catch (error) {
        console.error(`❌ Falló la ejecución de ${uniqueTestName}`);
    }
});

console.log("🏁 Ejecución completa.");