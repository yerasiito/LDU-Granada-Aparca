// ─── Tipos ───────────────────────────────────────────────
export type NivelOcupacion = 'verde' | 'ambar' | 'rojo';
export type ModoDatos = 'real' | 'simulado';

export interface ZonaData {
  id: string;
  nombre: string;
  sector: string;
  capacidad: number;
  ocupadasAhora: number;
  variacion15min: number;
  cocheMins: number;
  pieMins: number;
  direccion?: string;
}

export interface ZonaCalculada extends ZonaData {
  ocupadasPrevistas: number;
  libresPrevistas: number;
  porcentaje: number;
  nivel: NivelOcupacion;
  penalizacion: number;
  puntuacion: number;
  etiqueta: string;
  esRecomendada: boolean;
}

export interface Preferencias {
  maxPieMin: number;
  tipo: 'publica' | 'parking' | 'ambos';
  presupuesto: string;
  avisos: boolean;
}

export interface AppState {
  modoDatos: ModoDatos;
  escenarioActivo: 'inicial' | 'alerta';
  zonaSeleccionada: string | null;
  conductor: string;
  origen: string;
  destino: string;
  horaConsulta: string;
  horaLlegada: string;
  preferencias: Preferencias;
}

// ─── Datos reales del Ayuntamiento de Granada (CGIM) ──────────
export const INFO_REAL = {
  fuente: 'Centro de Gestión Integral de Movilidad · Ayto. de Granada',
  actualizacion: '06/10/2026 11:43',
  totalMonitorizados: 24,
};

/**
 * Caso Particular: Yeray sale de la ETSIIT hacia el Ayuntamiento de Granada
 * Tiempos en coche desde ETSIIT y a pie hasta Plaza del Carmen (Ayuntamiento)
 */
export const PARKINGS_REALES_GRANADA: ZonaData[] = [
  {
    id: 'rex',
    nombre: 'Garaje Rex',
    sector: 'C/ Recogidas, 38 · Centro',
    capacidad: 97,
    ocupadasAhora: 44, // 53 plazas libres en vivo
    variacion15min: 6, // variación estimada para las 15:00
    cocheMins: 11,     // desde ETSIIT
    pieMins: 8,        // a pie al Ayuntamiento (Plaza del Carmen)
    direccion: 'C/ Recogidas, 38',
  },
  {
    id: 'puerta-real',
    nombre: 'Puerta Real',
    sector: 'Acera del Darro, 40 · Centro',
    capacidad: 298,
    ocupadasAhora: 207, // 91 plazas libres en vivo
    variacion15min: 15,
    cocheMins: 12,      // desde ETSIIT
    pieMins: 3,         // a pie al Ayuntamiento
    direccion: 'Acera del Darro, 40',
  },
  {
    id: 'ganivet',
    nombre: 'Ganivet',
    sector: 'C/ Ángel Ganivet · Centro',
    capacidad: 120,
    ocupadasAhora: 100, // 20 plazas libres en vivo
    variacion15min: -5,
    cocheMins: 13,      // desde ETSIIT
    pieMins: 2,         // a 100m del Ayuntamiento
    direccion: 'C/ Ángel Ganivet',
  },
  {
    id: 'san-agustin',
    nombre: 'San Agustín',
    sector: 'Plaza San Agustín · Gran Vía',
    capacidad: 447,
    ocupadasAhora: 328, // 119 plazas libres en vivo
    variacion15min: 20,
    cocheMins: 13,      // desde ETSIIT
    pieMins: 5,         // a pie al Ayuntamiento
    direccion: 'Plaza San Agustín',
  },
  {
    id: 'escolapios',
    nombre: 'Escolapios',
    sector: 'Paseo de los Basilios · Puente Blanco',
    capacidad: 330,
    ocupadasAhora: 224, // 106 plazas libres en vivo
    variacion15min: 10,
    cocheMins: 14,      // desde ETSIIT
    pieMins: 9,         // a pie al Ayuntamiento
    direccion: 'Paseo de los Basilios',
  },
  {
    id: 'socrates',
    nombre: 'Sócrates',
    sector: 'C/ Sócrates, 14 · Ronda',
    capacidad: 162,
    ocupadasAhora: 87,  // 75 plazas libres en vivo
    variacion15min: 5,
    cocheMins: 10,
    pieMins: 12,        // > 10 min a pie (se filtra si maxPieMin = 10)
    direccion: 'C/ Sócrates, 14',
  },
  {
    id: 'alsina',
    nombre: 'Granada Centro Alsina',
    sector: 'C/ Arabial, 56 · Camino de Ronda',
    capacidad: 578,
    ocupadasAhora: 523, // 55 plazas libres en vivo
    variacion15min: 10,
    cocheMins: 9,
    pieMins: 15,        // > 10 min a pie (se filtra si maxPieMin = 10)
    direccion: 'C/ Arabial, 56',
  },
];

// ─── Datos simulados (Reto #07) ───────────────────────────
export const ZONAS_INICIAL: ZonaData[] = [
  {
    id: 'A',
    nombre: 'Zona A',
    sector: 'Recogidas–Camino de Ronda · sector ficticio',
    capacidad: 80,
    ocupadasAhora: 72,
    variacion15min: 4,
    cocheMins: 3,
    pieMins: 2,
  },
  {
    id: 'B',
    nombre: 'Zona B',
    sector: 'Recogidas–Camino de Ronda · sector ficticio',
    capacidad: 100,
    ocupadasAhora: 65,
    variacion15min: 5,
    cocheMins: 5,
    pieMins: 5,
  },
  {
    id: 'C',
    nombre: 'Zona C',
    sector: 'Recogidas–Camino de Ronda · sector ficticio',
    capacidad: 140,
    ocupadasAhora: 112,
    variacion15min: 7,
    cocheMins: 7,
    pieMins: 8,
  },
];

export const ZONAS_ALERTA: ZonaData[] = [
  { ...ZONAS_INICIAL[0] },
  {
    ...ZONAS_INICIAL[1],
    ocupadasAhora: 90,
    variacion15min: 5,
  },
  { ...ZONAS_INICIAL[2] },
];

// ─── Estado global ───────────────────────────────────────
export const state: AppState = {
  modoDatos: 'real',
  escenarioActivo: 'inicial',
  zonaSeleccionada: null,
  conductor: 'Yeray',
  origen: 'ETSIIT Granada',
  destino: 'Ayuntamiento de Granada (Plaza del Carmen)',
  horaConsulta: '14:00',
  horaLlegada: '15:00',
  preferencias: {
    maxPieMin: 10,
    tipo: 'ambos',
    presupuesto: 'Sin límite en la simulación',
    avisos: true,
  },
};

export function getZonasActivas(): ZonaData[] {
  if (state.modoDatos === 'real') {
    return PARKINGS_REALES_GRANADA.filter(
      (z) => z.pieMins <= state.preferencias.maxPieMin
    );
  }
  return state.escenarioActivo === 'alerta' ? ZONAS_ALERTA : ZONAS_INICIAL;
}
