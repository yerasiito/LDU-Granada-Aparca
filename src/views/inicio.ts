import { getZonasActivas, state } from '../data';
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
        ${zona.cocheMins} min en coche · ${zona.pieMins} min a pie
      </div>
    </div>
  `;
}

function renderMapaSVG(zonas: ZonaCalculada[]): string {
  const getCircleColor = (id: string): string => {
    const zona = zonas.find((z) => z.id === id);
    if (!zona) return '#999';
    return getColorNivel(zona.nivel).circleColor;
  };

  return `
    <div class="ga-map-container">
      <svg viewBox="0 0 342 118" width="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="342" height="118" rx="12" fill="#EAF0F3"/>
        <!-- Calles -->
        <rect x="46" y="6" width="8" height="106" fill="white"/>
        <rect x="121" y="6" width="8" height="106" fill="white"/>
        <rect x="199" y="6" width="8" height="106" fill="white"/>
        <rect x="276" y="6" width="8" height="106" fill="white"/>
        <rect x="6" y="28" width="330" height="8" fill="white"/>
        <rect x="6" y="76" width="330" height="8" fill="white"/>
        <!-- Plazas verdes decorativas -->
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

  container.innerHTML = `
    <!-- Status bar -->
    <div class="ga-status-bar">
      <span class="ga-time">18:00</span>
      <span class="ga-demo-badge">DEMO</span>
    </div>

    <!-- Header -->
    <div class="ga-header">
      <div class="ga-logo">P</div>
      <div class="ga-header-text">
        <span class="ga-app-title">Granada Aparca</span>
      </div>
    </div>
    <div class="ga-subtitle">Aparca con previsión, no dando vueltas.</div>

    <!-- Destino -->
    <div class="ga-destination-card">
      <div class="ga-dest-label">DESTINO</div>
      <div class="ga-dest-value">Recogidas, Granada</div>
      <div class="ga-dest-details">Llegada 18:15 · hasta ${state.preferencias.maxPieMin} min a pie</div>
      <span class="ga-dest-chevron">▾</span>
    </div>

    <!-- Mapa esquemático -->
    ${renderMapaSVG(calculadas)}

    <!-- Zona recomendada -->
    <div class="ga-section-title">Tu mejor opción al llegar</div>

    <!-- Tarjetas de zona -->
    ${tarjetas}

    <!-- Disclaimer -->
    <div class="ga-disclaimer">Datos simulados · no garantiza plaza</div>
  `;

  // Event listeners
  container.querySelectorAll<HTMLElement>('.ga-zone-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.zoneId;
      if (id) navigateTo(`detalle/${id}`);
    });
  });

  container.querySelectorAll<SVGCircleElement>('.ga-map-circle').forEach((circle) => {
    circle.style.cursor = 'pointer';
    circle.addEventListener('click', () => {
      const id = circle.dataset.zone;
      if (id) navigateTo(`detalle/${id}`);
    });
  });
}
