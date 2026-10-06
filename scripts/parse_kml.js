import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const kmlPath = path.join(__dirname, '..', 'data', 'parkings.kml');

const kml = fs.readFileSync(kmlPath, 'utf-8');

// Extraer Placemarks
const placemarkRegex = /<Placemark>([\s\S]*?)<\/Placemark>/gi;
const placemarks = [];
let m;
while ((m = placemarkRegex.exec(kml)) !== null) {
  const content = m[1];
  const nameM = content.match(/<name>(.*?)<\/name>/i);
  const descM = content.match(/<description>([\s\S]*?)<\/description>/i);
  const coordM = content.match(/<coordinates>([\s\S]*?)<\/coordinates>/i);
  
  placemarks.push({
    name: nameM ? nameM[1].trim() : 'Sin nombre',
    desc: descM ? descM[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '',
    coords: coordM ? coordM[1].trim().split(/\s+/)[0] : ''
  });
}

console.log(`Total Placemarks en KML: ${placemarks.length}`);
console.log('Primeros 10:');
placemarks.slice(0, 10).forEach(p => {
  console.log(`- ${p.name} | Coord: ${p.coords} | Desc: ${p.desc.slice(0, 100)}...`);
});

// Guardar listado de placemarks extraídos
fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'parkings_kml_parsed.json'),
  JSON.stringify(placemarks, null, 2),
  'utf-8'
);
