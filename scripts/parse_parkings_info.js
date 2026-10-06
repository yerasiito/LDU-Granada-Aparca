import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

const html = fs.readFileSync(path.join(dataDir, 'par_parking.html'), 'utf-8');
const liveData = JSON.parse(fs.readFileSync(path.join(dataDir, 'parkings_reales.json'), 'utf-8'));

// Busquemos información de los parkings en el HTML
// Muchas veces vienen en fichas, tablas o bloques
console.log('--- Buscando parkings en par_parking.html ---');
const regexH3 = /<h[234][^>]*>(.*?)<\/h[234]>/gi;
const headings = [...html.matchAll(regexH3)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('Cabeceras encontradas:', headings.slice(0, 30));

// Buscar coincidencias con nombres de los 24 parkings en tiempo real
console.log('\n--- Comparando con los 24 parkings en vivo ---');
const liveNames = liveData.parkings.map(p => p.nombre);
console.log('Parkings en vivo:', liveNames);
