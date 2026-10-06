import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function explore() {
  const url = 'http://www.movilidadgranada.com/datosabiertos.php';
  const res = await fetch(url);
  const html = await res.text();
  fs.writeFileSync(path.join(outDir, 'datosabiertos.html'), html, 'utf-8');
  
  const linkMatches = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
  const relevant = linkMatches.filter(l => 
    /aparc|parking|kml|geojson|csv|json|shp/i.test(l)
  );
  console.log('Enlaces relevantes en datosabiertos.php:');
  console.log(relevant);

  // También buscar texto asociado
  const aRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
  let match;
  while ((match = aRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (/aparc|parking|coche|vehic/i.test(text) || /aparc|parking/i.test(href)) {
      console.log(`[LINK] ${text} -> ${href}`);
    }
  }
}

explore().catch(console.error);
