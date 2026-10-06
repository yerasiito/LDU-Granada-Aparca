import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'data');

async function downloadFile(url, fileName) {
  try {
    console.log(`Descargando ${url}...`);
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Error ${res.status} al descargar ${url}`);
      return null;
    }
    const text = await res.text();
    const dest = path.join(outDir, fileName);
    fs.writeFileSync(dest, text, 'utf-8');
    console.log(`Guardado ${fileName} (${text.length} bytes)`);
    return text;
  } catch (err) {
    console.error(`Fallo en ${url}:`, err.message);
    return null;
  }
}

async function main() {
  await downloadFile('http://www.movilidadgranada.com/_OPEN_DATA/parkings.kml', 'parkings.kml');
  await downloadFile('http://www.movilidadgranada.com/par_parking.php', 'par_parking.html');
  await downloadFile('http://www.movilidadgranada.com/_OPEN_DATA/reservas-aparcamiento.csv', 'reservas-aparcamiento.csv');
  await downloadFile('http://www.movilidadgranada.com/_OPEN_DATA/reservas-aparcamiento-pmr.csv', 'reservas-pmr.csv');
}

main();
