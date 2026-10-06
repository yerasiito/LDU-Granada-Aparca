// Script to download and test real data from Ayuntamiento de Granada (Movilidad)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const url = 'http://www.movilidadgranada.com/aparcamientos/par_tabla.php';
  console.log('Descargando datos en tiempo real de:', url);
  
  const res = await fetch(url);
  const html = await res.text();
  
  // Guardamos HTML crudo como evidencia
  const outDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'real_granada_parkings_raw.html'), html, 'utf-8');

  // Extraer timestamp si existe
  const dateMatch = html.match(/Última actualización:\s*([^\n<]+)/i);
  const lastUpdate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();

  // Regex para filas
  const rowRegex = /<tr>\s*<td>\s*(.*?)\s*<\/td>\s*<td>\s*(\d+)\s*<\/td>\s*<td>\s*<span\s+class=["']estado["']\s+style=["']background-color:\s*([^"';]+);?["']>\s*([A-Z])\s*<\/span>\s*<\/td>\s*<\/tr>/gis;

  const parkings = [];
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const name = match[1].trim();
    const free = parseInt(match[2].trim(), 10);
    const color = match[3].trim();
    const code = match[4].trim(); // V = Verde, A = Ámbar, R = Rojo
    
    parkings.push({
      nombre: name,
      plazasLibres: free,
      color,
      estado: code === 'V' ? 'verde' : code === 'A' ? 'ambar' : 'rojo'
    });
  }

  console.log(`Fecha actualización oficial: ${lastUpdate}`);
  console.log(`Total de parkings obtenidos: ${parkings.length}`);
  console.table(parkings);

  // Guardar en JSON estructurado
  const result = {
    fuente: 'Centro de Gestión Integral de Movilidad - Ayuntamiento de Granada',
    url,
    actualizacion: lastUpdate,
    fechaDescarga: new Date().toISOString(),
    total: parkings.length,
    parkings
  };

  fs.writeFileSync(path.join(outDir, 'parkings_reales.json'), JSON.stringify(result, null, 2), 'utf-8');
  console.log('Guardado exitoso en data/parkings_reales.json');
}

main().catch(console.error);
