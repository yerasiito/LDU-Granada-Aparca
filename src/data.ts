// ─── Tipos ───────────────────────────────────────────────
export type NivelOcupacion = 'verde' | 'ambar' | 'rojo';
export type ModoDatos = 'simulado' | 'real';

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
  preferencias: Preferencias;
}

// ─── Datos reales del Ayuntamiento de Granada (Movilidad) ───
export const INFO_REAL = {
  fuente: 'Centro de Gestión Integral de Movilidad · Ayto. de Granada',
  actualizacion: '06/10/2026 11:43',
  totalMonitorizados: 24,
};

export const PARKINGS_REALES_GRANADA: ZonaData[] = [
  {
    id: 'rex',
    nombre: 'Garaje Rex',
    sector: 'C/ Recogidas, 38 · Centro (Real)',
    capacidad: 97,
    ocupadasAhora: 44, // 53 plazas libres en vivo
    variacion15min: 4,
    cocheMins: 2,
    pieMins: 1,
    direccion: 'C/ Recogidas, 38',
  },
  {
    id: 'socrates',
    nombre: 'Sócrates',
    sector: 'C/ Sócrates, 14 · Centro (Real)',
    capacidad: 162,
    ocupadasAhora: 87, // 75 plazas libres en vivo
    variacion15min: 6,
    cocheMins: 4,
    pieMins: 5,
    direccion: 'C/ Sócrates, 14',
  },
  {
    id: 'pedro-antonio',
    nombre: 'Pedro Antonio de Alarcón',
    sector: 'C/ Pedro Antonio de Alarcón · Ronda (Real)',
    capacidad: 200,
    ocupadasAhora: 102, // 98 plazas libres en vivo
    variacion15min: 5,
    cocheMins: 4,
    pieMins: 6,
    direccion: 'C/ Pedro Antonio de Alarcón',
  },
  {
    id: 'puerta-real',
    nombre: 'Puerta Real',
    sector: 'Acera del Darro, 40 · Centro (Real)',
    capacidad: 298,
    ocupadasAhora: 207, // 91 plazas libres en vivo
    variacion15min: 12,
    cocheMins: 3,
    pieMins: 3,
    direccion: 'Acera del Darro, 40',
  },
  {
    id: 'violon',
    nombre: 'Paseo del Violón',
    sector: 'Paseo del Violón · Palacio de Congresos (Real)',
    capacidad: 784,
    ocupadasAhora: 671, // 113 plazas libres en vivo
    variacion15min: 15,
    cocheMins: 5,
    pieMins: 8,
    direccion: 'Paseo del Violón s/n',
  },
  {
    id: 'alsina',
    nombre: 'Granada Centro Alsina',
    sector: 'C/ Arabial, 56 · Camino de Ronda (Real)',
    capacidad: 578,
    ocupadasAhora: 523, // 55 plazas libres en vivo
    variacion15min: 10,
    cocheMins: 5,
    pieMins: 8,
    direccion: 'C/ Arabial, 56',
  },
  {
    id: 'caleta',
    nombre: 'La Caleta',
    sector: 'Av. Constitución · Caleta (Real)',
    capacidad: 800,
    ocupadasAhora: 482, // 318 plazas libres en vivo
    variacion15min: 10,
    cocheMins: 9,
    pieMins: 22, // Excluido si maxPieMin < 22
    direccion: 'Av. Constitución / Juzgados',
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

/** Escenario de alerta: B sube a 90 ocupadas (nueva lectura ficticia) */
export const ZONAS_ALERTA: ZonaData[] = [
  { ...ZONAS_INICIAL[0] }, // A sin cambios
  {
    ...ZONAS_INICIAL[1],
    ocupadasAhora: 90, // B empeora
    variacion15min: 5,
  },
  { ...ZONAS_INICIAL[2] }, // C sin cambios
];

// ─── Estado global ───────────────────────────────────────
export const state: AppState = {
  modoDatos: 'real', // Activo por defecto con los datos reales descargados
  escenarioActivo: 'inicial',
  zonaSeleccionada: null,
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
