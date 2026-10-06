import { getZonasActivas, state, INFO_REAL } from '../data';
import { recomendarZonas, getColorNivel } from '../engine';
import type { ZonaCalculada } from '../data';
import { navigateTo } from '../router';

function renderZonaCard(zona: ZonaCalculada): string {
  const colors = getColorNivel(zona.nivel);
  const bgStyle = zona.esRecomendada
    ? 'background: #EFF5FF; border: 1px solid #1769C2;'
    : 'background: #FFFFFF; border: 1px solid #DFE5EB;';
  const badge = zona.esRecomendada
    ? `<span class="ga-badge-recommended">Recomendada</span>`
    : `<span class="ga-badge-level" style="color: ${colors.badgeColor}">${zona.etiqueta}</span>`;

  return `
    <div class="ga-zone-card" style="${bgStyle}" data-zone-id="${zona.id}">
      <div class="ga-zone-card-header">
        <span class="ga-zone-name">${zona.nombre}</span>
        ${badge}
        <span class="ga-zone-arrow">›</span>
      </div>
      <div class="ga-zone-stats">
        <strong>${zona.porcentaje} % previsto · ${zona.libresPrevistas} libres estimadas</strong>
      </div>
      <div class="ga-zone-times">
        ${zona.cocheMins} min en coche · ${zona.pieMins} min a pie · Puntuación: <strong>${zona.puntuacion} min</strong>
      </div>
    </div>
  `;
}

function renderMapaSVG(zonas: ZonaCalculada[]): string {
  if (state.modoDatos === 'real') {
    // Mapa esquemático adaptado a parkings reales en Recogidas / Centro
    const getCircleColor = (id: string): string => {
      const zona = zonas.find((z) => z.id === id);
      if (!zona) return '#999';
      return getColorNivel(zona.nivel).circleColor;
    };

    return `
      <div class="ga-map-container">
        <svg viewBox="0 0 342 118" width="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="342" height="118" rx="12" fill="#EAF0F3"/>
          <!-- Calles principales de Granada -->
          <text x="14" y="22" font-size="9" font-weight="600" fill="#7A8B99">Cno. Ronda</text>
          <text x="130" y="22" font-size="9" font-weight="600" fill="#7A8B99">Recogidas</text>
          <text x="240" y="22" font-size="9" font-weight="600" fill="#7A8B99">Pta. Real / Darro</text>
          
          <rect x="36" y="26" width="10" height="86" fill="white"/>
          <rect x="156" y="26" width="10" height="86" fill="white"/>
          <rect x="276" y="26" width="10" height="86" fill="white"/>
          <rect x="6" y="58" width="330" height="10" fill="white"/>
          
          <!-- Parkings reales -->
          <!-- Garaje Rex (en Recogidas) -->
          <circle cx="161" cy="63" r="16" fill="${getCircleColor('rex')}" class="ga-map-circle" data-zone="rex"/>
          <text x="153" y="68" font-size="13" font-weight="700" fill="white" style="pointer-events:none">Rex</text>
          
          <!-- Sócrates -->
          <circle cx="85" cy="45" r="15" fill="${getCircleColor('socrates')}" class="ga-map-circle" data-zone="socrates"/>
          <text x="80" y="50" font-size="12" font-weight="700" fill="white" style="pointer-events:none">Sóc</text>

          <!-- Puerta Real -->
          <circle cx="281" cy="63" r="16" fill="${getCircleColor('puerta-real')}" class="ga-map-circle" data-zone="puerta-real"/>
          <text x="273" y="68" font-size="13" font-weight="700" fill="white" style="pointer-events:none">PR</text>

          <!-- Pedro Antonio -->
          <circle cx="41" cy="85" r="14" fill="${getCircleColor('pedro-antonio')}" class="ga-map-circle" data-zone="pedro-antonio"/>
          <text x="34" y="89" font-size="10" font-weight="700" fill="white" style="pointer-events:none">PA</text>
        </svg>
        <div class="ga-map-caption">Parkings reales en torno a Recogidas · Ayto. de Granada</div>
      </div>
    `;
  }

  // Modo simulación Reto 07 (Figma)
  const getCircleColor = (id: string): string => {
    const zona = zonas.find((z) => z.id === id);
    if (!zona) return '#999';
    return getColorNivel(zona.nivel).circleColor;
  };

  return `
    <div class="ga-map-container">
      <svg viewBox="0 0 342 118" width="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="342" height="118" rx="12" fill="#EAF0F3"/>
        <rect x="46" y="6" width="8" height="106" fill="white"/>
        <rect x="121" y="6" width="8" height="106" fill="white"/>
        <rect x="199" y="6" width="8" height="106" fill="white"/>
        <rect x="276" y="6" width="8" height="106" fill="white"/>
        <rect x="6" y="28" width="330" height="8" fill="white"/>
        <rect x="6" y="76" width="330" height="8" fill="white"/>
        <rect x="154" y="9" width="31" height="20" rx="4" fill="#D7E9DD"/>
        <rect x="62" y="47" width="45" height="22" rx="4" fill="#D7E9DD"/>
        <!-- Zona A -->
        <circle cx="35" cy="47" r="17" fill="${getCircleColor('A')}" class="ga-map-circle" data-zone="A"/>
        <text x="29" y="53" font-size="16" font-weight="700" fill="white" style="pointer-events:none">A</text>
        <!-- Zona B -->
        <circle cx="168" cy="54" r="17" fill="${getCircleColor('B')}" class="ga-map-circle" data-zone="B"/>
        <text x="162" y="60" font-size="16" font-weight="700" fill="white" style="pointer-events:none">B</text>
        <!-- Zona C -->
        <circle cx="268" cy="27" r="17" fill="${getCircleColor('C')}" class="ga-map-circle" data-zone="C"/>
        <text x="262" y="33" font-size="16" font-weight="700" fill="white" style="pointer-events:none">C</text>
      </svg>
      <div class="ga-map-caption">Esquema de zonas · no es un mapa real</div>
    </div>
  `;
}

export function renderInicio(): void {
  const container = document.getElementById('view-inicio');
  if (!container) return;

  const zonas = getZonasActivas();
  const calculadas = recomendarZonas(zonas);
  const tarjetas = calculadas.map(renderZonaCard).join('');

  const esReal = state.modoDatos === 'real';

  container.innerHTML = `
    <!-- Status bar -->
    <div class="ga-status-bar">
      <span class="ga-time">${esReal ? '11:43' : '18:00'}</span>
      <span class="ga-demo-badge" style="${esReal ? 'background: #2D6A3F; color: white;' : ''}">
        ${esReal ? 'DATOS REALES' : 'DEMO RETO 07'}
      </span>
    </div>

    <!-- Header con selector de modo -->
    <div class="ga-header">
      <div class="ga-logo">P</div>
      <div class="ga-header-text">
        <span class="ga-app-title">Granada Aparca</span>
      </div>
    </div>
    <div class="ga-subtitle">Aparca con previsión, no dando vueltas.</div>

    <!-- Pill selector modo de datos -->
    <div class="ga-mode-switch my-2 p-1 d-flex justify-content-between align-items-center" style="background: #E8EFF7; border-radius: 20px;">
      <button id="toggle-modo-real" class="btn btn-sm ${esReal ? 'btn-primary' : 'btn-light'}" style="border-radius: 16px; font-size: 11px; font-weight: 600; flex: 1; margin-right: 4px;">
        📡 Datos Reales (${INFO_REAL.totalMonitorizados})
      </button>
      <button id="toggle-modo-simulado" class="btn btn-sm ${!esReal ? 'btn-primary' : 'btn-light'}" style="border-radius: 16px; font-size: 11px; font-weight: 600; flex: 1;">
        🧪 Simulación Reto 07
      </button>
    </div>

    <!-- Banner origen de datos -->
    <div class="p-2 mb-2" style="background: ${esReal ? '#EBF5EE' : '#FFF9E6'}; border-radius: 8px; font-size: 11px; color: ${esReal ? '#204A2B' : '#735200'};">
      ${esReal 
        ? `<strong>En vivo:</strong> ${INFO_REAL.fuente}. Aforos oficiales actualizados hoy.` 
        : `<strong>Simulación:</strong> Zonas A, B y C del Reto #07.`}
    </div>

    <!-- Destino -->
    <div class="ga-destination-card">
      <div class="ga-dest-label">DESTINO</div>
      <div class="ga-dest-value">Recogidas, Granada</div>
      <div class="ga-dest-details">Llegada ${esReal ? 'en +15 min' : '18:15'} · hasta ${state.preferencias.maxPieMin} min a pie</div>
      <span class="ga-dest-chevron">▾</span>
    </div>

    <!-- Mapa esquemático -->
    ${renderMapaSVG(calculadas)}

    <!-- Zona recomendada -->
    <div class="ga-section-title">Tu mejor opción al llegar</div>

    <!-- Tarjetas de zona -->
    ${tarjetas}

    <!-- Disclaimer -->
    <div class="ga-disclaimer">
      ${esReal ? 'Previsión a 15 min basada en aforo oficial en vivo · no garantiza plaza' : 'Datos simulados · no garantiza plaza'}
    </div>
  `;

  // Event listeners para cambio de modo
  document.getElementById('toggle-modo-real')?.addEventListener('click', () => {
    state.modoDatos = 'real';
    renderInicio();
  });

  document.getElementById('toggle-modo-simulado')?.addEventListener('click', () => {
    state.modoDatos = 'simulado';
    renderInicio();
  });

  // Event listeners tarjetas
  container.querySelectorAll<HTMLElement>('.ga-zone-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.zoneId;
      if (id) navigateTo(`detalle/${id}`);
    });
  });

  // Event listeners mapa
  container.querySelectorAll<SVGCircleElement>('.ga-map-circle').forEach((circle) => {
    circle.style.cursor = 'pointer';
    circle.addEventListener('click', () => {
      const id = circle.dataset.zone;
      if (id) navigateTo(`detalle/${id}`);
    });
  });
}
