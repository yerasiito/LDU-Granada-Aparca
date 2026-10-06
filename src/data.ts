// ─── Tipos ───────────────────────────────────────────────
export type NivelOcupacion = 'verde' | 'ambar' | 'rojo';

export interface ZonaData {
  id: string;
  nombre: string;
  sector: string;
  capacidad: number;
  ocupadasAhora: number;
  variacion15min: number;
  cocheMins: number;
  pieMins: number;
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
  escenarioActivo: 'inicial' | 'alerta';
  zonaSeleccionada: string | null;
  preferencias: Preferencias;
}

// ─── Datos ficticios ─────────────────────────────────────

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
  return state.escenarioActivo === 'alerta' ? ZONAS_ALERTA : ZONAS_INICIAL;
}
