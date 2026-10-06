import type { ZonaData, ZonaCalculada, NivelOcupacion } from './data';

/** Limita un valor entre min y max */
function limitar(valor: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, valor));
}

/** Calcula el nivel de ocupación y la penalización de búsqueda */
function calcularNivel(porcentaje: number): { nivel: NivelOcupacion; penalizacion: number; etiqueta: string } {
  if (porcentaje >= 90) {
    return { nivel: 'rojo', penalizacion: 10, etiqueta: 'Ocupación alta' };
  }
  if (porcentaje >= 70) {
    return { nivel: 'ambar', penalizacion: 5, etiqueta: 'Ocupación media' };
  }
  return { nivel: 'verde', penalizacion: 0, etiqueta: 'Disponible' };
}

/** Calcula previsiones para una zona */
export function calcularPrevision(zona: ZonaData): ZonaCalculada {
  const ocupadasPrevistas = limitar(
    zona.ocupadasAhora + zona.variacion15min,
    0,
    zona.capacidad
  );
  const libresPrevistas = zona.capacidad - ocupadasPrevistas;
  const porcentaje = Math.round((100 * ocupadasPrevistas) / zona.capacidad);
  const { nivel, penalizacion, etiqueta } = calcularNivel(porcentaje);
  const puntuacion = zona.cocheMins + zona.pieMins + penalizacion;

  return {
    ...zona,
    ocupadasPrevistas,
    libresPrevistas,
    porcentaje,
    nivel,
    penalizacion,
    puntuacion,
    etiqueta,
    esRecomendada: false,
  };
}

/**
 * Ordena y recomienda zonas según el algoritmo del reto:
 * 1. Menor puntuación
 * 2. Desempate: menor porcentaje de ocupación
 * 3. Segundo desempate: menor tiempo a pie
 */
export function recomendarZonas(zonas: ZonaData[]): ZonaCalculada[] {
  const calculadas = zonas
    .map(calcularPrevision)
    .filter((z) => z.libresPrevistas > 0);

  calculadas.sort((a, b) => {
    if (a.puntuacion !== b.puntuacion) return a.puntuacion - b.puntuacion;
    if (a.porcentaje !== b.porcentaje) return a.porcentaje - b.porcentaje;
    return a.pieMins - b.pieMins;
  });

  if (calculadas.length > 0) {
    calculadas[0].esRecomendada = true;
  }

  return calculadas;
}

/** Obtiene los datos de color CSS para un nivel */
export function getColorNivel(nivel: NivelOcupacion): {
  bgClass: string;
  textClass: string;
  badgeBg: string;
  badgeColor: string;
  circleColor: string;
} {
  switch (nivel) {
    case 'rojo':
      return {
        bgClass: 'ga-alert-bg',
        textClass: 'ga-red',
        badgeBg: '#FCECE9',
        badgeColor: '#B33B32',
        circleColor: '#B33B32',
      };
    case 'ambar':
      return {
        bgClass: 'ga-amber-bg',
        textClass: 'ga-amber',
        badgeBg: '#FBEBDE',
        badgeColor: '#93500D',
        circleColor: '#93500D',
      };
    case 'verde':
      return {
        bgClass: 'ga-green-bg',
        textClass: 'ga-green',
        badgeBg: '#D7E9DD',
        badgeColor: '#2D6A3F',
        circleColor: '#2D6A3F',
      };
  }
}
