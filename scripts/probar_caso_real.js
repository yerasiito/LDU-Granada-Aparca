import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

// 1. Cargar datos reales descargados del Ayuntamiento de Granada
const realData = JSON.parse(fs.readFileSync(path.join(dataDir, 'parkings_reales.json'), 'utf-8'));

console.log('========================================================================');
console.log('🚗 PRUEBA DE CASO PARTICULAR CON DATOS REALES DE GRANADA');
console.log('========================================================================');
console.log(`📡 Fuente: ${realData.fuente}`);
console.log(`⏱️  Última actualización de aforos: ${realData.actualizacion}`);
console.log(`📊 Total de parkings monitorizados: ${realData.total}`);
console.log('------------------------------------------------------------------------\n');

// 2. Definición del caso particular según Reto #07:
// "Ana sale hacia una cita cerca de Recogidas y quiere aparcar sobre las 18:15 de un día laborable.
// Acepta caminar hasta 10 minutos."
const CASO = {
  usuario: 'Ana',
  destino: 'Calle Recogidas, Granada',
  horaConsulta: '18:00',
  horaLlegada: '18:15',
  maxPieMin: 10,
};

console.log('📋 CASO DE USO:');
console.log(`- Conductora: ${CASO.usuario}`);
console.log(`- Destino: ${CASO.destino}`);
console.log(`- Hora de consulta: ${CASO.horaConsulta} | Hora prevista de llegada: ${CASO.horaLlegada}`);
console.log(`- Preferencia máxima a pie: ${CASO.maxPieMin} minutos\n`);

// 3. Fichas de parkings reales en el entorno de Recogidas / Camino de Ronda / Centro
// Combinamos los aforos en tiempo real con sus capacidades verificadas y tiempos de acceso
const CANDIDATOS_RECOGIDAS = [
  {
    nombre: 'Garaje Rex',
    direccion: 'C/ Recogidas, 38',
    capacidad: 97,
    cocheMins: 2,
    pieMins: 1, // En la misma calle Recogidas
    variacion15minEstimada: 4
  },
  {
    nombre: 'Puerta Real',
    direccion: 'Acera del Darro, 40 (Puerta Real / Recogidas)',
    capacidad: 298,
    cocheMins: 3,
    pieMins: 3,
    variacion15minEstimada: 12
  },
  {
    nombre: 'Sócrates',
    direccion: 'C/ Sócrates, 14',
    capacidad: 162,
    cocheMins: 4,
    pieMins: 5,
    variacion15minEstimada: 6
  },
  {
    nombre: 'Pedro Antonio de Alarcón',
    direccion: 'C/ Pedro Antonio de Alarcón',
    capacidad: 200,
    cocheMins: 4,
    pieMins: 6,
    variacion15minEstimada: 5
  },
  {
    nombre: 'Granada Centro Alsina',
    direccion: 'C/ Arabial, 56 (Camino de Ronda)',
    capacidad: 578,
    cocheMins: 5,
    pieMins: 8,
    variacion15minEstimada: 10
  },
  {
    nombre: 'Violón',
    direccion: 'Paseo del Violón (Palacio de Congresos)',
    capacidad: 784,
    cocheMins: 5,
    pieMins: 8,
    variacion15minEstimada: 15
  },
  // Parking fuera de rango de caminata (> 10 min) para probar el filtro
  {
    nombre: 'La Caleta',
    direccion: 'Av. Constitución / Caleta',
    capacidad: 800,
    cocheMins: 9,
    pieMins: 22, // Excede los 10 min
    variacion15minEstimada: 10
  }
];

// 4. Algoritmo Reto 07 aplicado a los datos reales
function calcularPrediccion(p, libresReales) {
  const ocupadasAhora = Math.max(0, p.capacidad - libresReales);
  const ocupadasPrevistas = Math.min(p.capacidad, Math.max(0, ocupadasAhora + p.variacion15minEstimada));
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

// 5. Evaluar cada parking
const evaluados = [];
const excluidos = [];

for (const cand of CANDIDATOS_RECOGIDAS) {
  // Buscar aforo en vivo
  const aforoVivo = realData.parkings.find(x => x.nombre.toLowerCase().includes(cand.nombre.toLowerCase()) || cand.nombre.toLowerCase().includes(x.nombre.toLowerCase()));
  
  if (!aforoVivo) {
    console.warn(`[AVISO] No se encontró aforo en vivo para ${cand.nombre}`);
    continue;
  }

  // Comprobar preferencias (máximo caminata)
  if (cand.pieMins > CASO.maxPieMin) {
    excluidos.push({
      nombre: cand.nombre,
      motivo: `Caminata de ${cand.pieMins} min excede el máximo de ${CASO.maxPieMin} min`
    });
    continue;
  }

  const res = calcularPrediccion(cand, aforoVivo.plazasLibres);
  evaluados.push(res);
}

// 6. Ordenar por puntuación ascendente (desempate: menor ocupación %, luego menor a pie)
evaluados.sort((a, b) => {
  if (a.puntuacion !== b.puntuacion) return a.puntuacion - b.puntuacion;
  if (a.porcentaje !== b.porcentaje) return a.porcentaje - b.porcentaje;
  return a.pieMins - b.pieMins;
});

// 7. Mostrar resultados
console.log('🔍 RESULTADOS DE PREDICCIÓN Y COMPARATIVA (DATOS REALES):');
console.table(
  evaluados.map((x, idx) => ({
    Rank: idx === 0 ? '👑 RECOMENDADO' : idx === 1 ? '🥈 ALTERNATIVA' : `${idx + 1}º`,
    Parking: x.nombre,
    Capacidad: x.capacidad,
    'Libres Ahora (Real)': x.libresReales,
    'Ocupación Prevista %': `${x.porcentaje}% (${x.nivel.toUpperCase()})`,
    'Libres Previstas': x.libresPrevistas,
    'Coche / Pie': `${x.cocheMins} min / ${x.pieMins} min`,
    Penalización: `+${x.penalizacion} min`,
    'Puntuación Total': `${x.puntuacion} min`
  }))
);

if (excluidos.length > 0) {
  console.log('\n🚫 EXCLUIDOS POR PREFERENCIAS:');
  excluidos.forEach(e => console.log(`- ${e.nombre}: ${e.motivo}`));
}

// 8. Resumen de decisión
console.log('\n========================================================================');
console.log('🎯 DECISIÓN DEL SISTEMA:');
const mejor = evaluados[0];
const segunda = evaluados[1];
console.log(`✅ ZONA RECOMENDADA: ${mejor.nombre}`);
console.log(`   - Puntuación: ${mejor.puntuacion} min (${mejor.cocheMins}m coche + ${mejor.pieMins}m pie + ${mejor.penalizacion}m penalización)`);
console.log(`   - Previsión: ${mejor.porcentaje}% de ocupación (${mejor.libresPrevistas} plazas libres estimadas)`);
console.log(`   - Ubicación: ${mejor.direccion}`);
console.log(`\n🔄 SEGUNDA OPCIÓN (ALTERNATIVA): ${segunda.nombre}`);
console.log(`   - Puntuación: ${segunda.puntuacion} min (${segunda.cocheMins}m coche + ${segunda.pieMins}m pie + ${segunda.penalizacion}m penalización)`);
console.log(`   - Previsión: ${segunda.porcentaje}% de ocupación (${segunda.libresPrevistas} plazas libres)`);
console.log('========================================================================\n');
