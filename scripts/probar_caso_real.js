import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

// 1. Cargar datos reales descargados del Ayuntamiento de Granada
const realData = JSON.parse(fs.readFileSync(path.join(dataDir, 'parkings_reales.json'), 'utf-8'));

console.log('========================================================================');
console.log('🚗 CASO PARTICULAR REAL: YERAY (ETSIIT ➔ AYUNTAMIENTO DE GRANADA)');
console.log('========================================================================');
console.log(`📡 Fuente oficial: ${realData.fuente}`);
console.log(`⏱️  Última actualización de aforos: ${realData.actualizacion}`);
console.log(`📊 Parkings públicos monitorizados: ${realData.total}`);
console.log('------------------------------------------------------------------------\n');

// 2. Definición del caso particular
const CASO = {
  conductor: 'Yeray',
  origen: 'ETSIIT Granada (C/ Periodista Daniel Saucedo Aranda)',
  destino: 'Ayuntamiento de Granada (Plaza del Carmen)',
  horaConsulta: '14:00',
  horaLlegada: '15:00', // Horizonte 60 min (franja mediodía/tarde)
  maxPieMin: 10,       // Preferencia: máx 10 min caminando al Ayuntamiento
};

console.log('📋 DETALLES DEL TRAYECTO:');
console.log(`- Conductor: ${CASO.conductor}`);
console.log(`- Origen: ${CASO.origen}`);
console.log(`- Destino: ${CASO.destino}`);
console.log(`- Horario: Consulta a las ${CASO.horaConsulta} ➔ Llegada prevista a las ${CASO.horaLlegada}`);
console.log(`- Preferencia máxima a pie: ${CASO.maxPieMin} min hasta la Plaza del Carmen\n`);

// 3. Parkings reales en el entorno del Ayuntamiento de Granada (Plaza del Carmen / Centro)
// Distancias en coche calculadas desde la ETSIIT y distancias a pie hasta el Ayuntamiento
const CANDIDATOS_AYUNTAMIENTO = [
  {
    nombre: 'Ganivet',
    direccion: 'C/ Ángel Ganivet (a 100 m del Ayuntamiento)',
    capacidad: 120,
    cocheMins: 13, // Conducción desde ETSIIT hasta Ganivet (acceso centro)
    pieMins: 2,    // Literalmente junto a Plaza del Carmen
    variacionEstimadaHora: -5 // Rotación de mediodía
  },
  {
    nombre: 'Puerta Real',
    direccion: 'Acera del Darro, 40 (Puerta Real)',
    capacidad: 298,
    cocheMins: 12, // Conducción desde ETSIIT vía Méndez Núñez
    pieMins: 3,    // 250 m a pie al Ayuntamiento
    variacionEstimadaHora: 15
  },
  {
    nombre: 'San Agustín',
    direccion: 'Plaza San Agustín (junto al Mercado y Gran Vía)',
    capacidad: 447,
    cocheMins: 13, // Conducción desde ETSIIT vía Severo Ochoa
    pieMins: 5,    // 400 m a pie por Gran Vía / Navas
    variacionEstimadaHora: 20
  },
  {
    nombre: 'Garaje Rex',
    direccion: 'C/ Recogidas, 38',
    capacidad: 97,
    cocheMins: 11, // Conducción directa por Camino de Ronda / Recogidas
    pieMins: 8,    // 650 m a pie a Plaza del Carmen
    variacionEstimadaHora: 6
  },
  {
    nombre: 'Escolapios',
    direccion: 'Paseo de los Basilios (Puente Blanco)',
    capacidad: 330,
    cocheMins: 14,
    pieMins: 9,    // 750 m a pie bordeando el Genil
    variacionEstimadaHora: 10
  },
  {
    nombre: 'Sócrates',
    direccion: 'C/ Sócrates, 14',
    capacidad: 162,
    cocheMins: 10,
    pieMins: 12,   // 1.000 m (excede 10 min a pie)
    variacionEstimadaHora: 5
  },
  {
    nombre: 'Granada Centro Alsina',
    direccion: 'C/ Arabial, 56 (Camino de Ronda)',
    capacidad: 578,
    cocheMins: 9,
    pieMins: 15,   // 1.200 m (excede 10 min a pie)
    variacionEstimadaHora: 10
  }
];

// 4. Algoritmo de predicción y ranking (Reto #07)
function calcularPrediccion(p, libresReales) {
  const ocupadasAhora = Math.max(0, p.capacidad - libresReales);
  const ocupadasPrevistas = Math.min(p.capacidad, Math.max(0, ocupadasAhora + p.variacionEstimadaHora));
  const libresPrevistas = p.capacidad - ocupadasPrevistas;
  const porcentaje = Math.round((ocupadasPrevistas / p.capacidad) * 100);

  let nivel = 'verde';
  let penalizacion = 0;
  if (porcentaje >= 90) {
    nivel = 'rojo';
    penalizacion = 10;
  } else if (porcentaje >= 70) {
    nivel = 'ambar';
    penalizacion = 5;
  }

  const puntuacion = p.cocheMins + p.pieMins + penalizacion;

  return {
    ...p,
    libresReales,
    ocupadasAhora,
    ocupadasPrevistas,
    libresPrevistas,
    porcentaje,
    nivel,
    penalizacion,
    puntuacion
  };
}

// 5. Evaluación de los parkings candidatos
const evaluados = [];
const excluidos = [];

for (const cand of CANDIDATOS_AYUNTAMIENTO) {
  const aforoVivo = realData.parkings.find(x => 
    x.nombre.toLowerCase().includes(cand.nombre.toLowerCase()) || 
    cand.nombre.toLowerCase().includes(x.nombre.toLowerCase())
  );

  if (!aforoVivo) {
    console.warn(`[AVISO] No se encontró aforo en vivo para ${cand.nombre}`);
    continue;
  }

  if (cand.pieMins > CASO.maxPieMin) {
    excluidos.push({
      nombre: cand.nombre,
      motivo: `${cand.pieMins} min a pie supera el límite de ${CASO.maxPieMin} min establecido por ${CASO.conductor}`
    });
    continue;
  }

  const res = calcularPrediccion(cand, aforoVivo.plazasLibres);
  evaluados.push(res);
}

// 6. Ordenación por ranking de menor puntuación y desempates oficiales
evaluados.sort((a, b) => {
  if (a.puntuacion !== b.puntuacion) return a.puntuacion - b.puntuacion;
  if (a.porcentaje !== b.porcentaje) return a.porcentaje - b.porcentaje;
  return a.pieMins - b.pieMins;
});

// 7. Salida por terminal
console.log('🔍 RESULTADOS DE EVALUACIÓN PARA LAS 15:00:');
console.table(
  evaluados.map((x, idx) => ({
    Rank: idx === 0 ? '👑 RECOMENDADO' : idx === 1 ? '🥈 ALTERNATIVA' : `${idx + 1}º`,
    Parking: x.nombre,
    Capacidad: x.capacidad,
    'Libres Ahora': x.libresReales,
    'Ocupación Prevista %': `${x.porcentaje}% (${x.nivel.toUpperCase()})`,
    'Libres 15:00': x.libresPrevistas,
    'Coche (ETSIIT)': `${x.cocheMins} min`,
    'Pie (Ayto)': `${x.pieMins} min`,
    Penalización: `+${x.penalizacion} min`,
    'Puntuación Total': `${x.puntuacion} min`
  }))
);

if (excluidos.length > 0) {
  console.log('\n🚫 EXCLUIDOS POR PREFERENCIAS (Tiempo a pie > 10 min):');
  excluidos.forEach(e => console.log(`- ${e.nombre}: ${e.motivo}`));
}

console.log('\n========================================================================');
console.log('🎯 RECOMENDACIÓN PARA YERAY:');
const mejor = evaluados[0];
const segunda = evaluados[1];

console.log(`✅ PARKING RECOMENDADO: ${mejor.nombre}`);
console.log(`   - Ubicación: ${mejor.direccion}`);
console.log(`   - Tiempo de conducción desde ETSIIT: ${mejor.cocheMins} min`);
console.log(`   - Caminata hasta el Ayuntamiento: ${mejor.pieMins} min`);
console.log(`   - Previsión para las 15:00: ${mejor.porcentaje}% (${mejor.libresPrevistas} plazas libres estimadas)`);
console.log(`   - Puntuación de decisión: ${mejor.puntuacion} min totales`);

console.log(`\n🔄 SEGUNDA OPCIÓN (ALTERNATIVA MENOS SATURADA): ${segunda.nombre}`);
console.log(`   - Ubicación: ${segunda.direccion}`);
console.log(`   - Trayecto: ${segunda.cocheMins} min coche + ${segunda.pieMins} min pie (+${segunda.penalizacion} min penalización)`);
console.log(`   - Previsión para las 15:00: ${segunda.porcentaje}% (${segunda.libresPrevistas} plazas libres estimadas)`);
console.log(`   - Puntuación: ${segunda.puntuacion} min totales`);
console.log('========================================================================\n');
