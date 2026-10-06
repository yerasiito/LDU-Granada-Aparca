import { getZonasActivas, state } from '../data';
import { calcularPrevision, recomendarZonas, getColorNivel } from '../engine';
import { navigateTo } from '../router';
import * as bootstrap from 'bootstrap';

export function renderDetalle(zonaId: string): void {
  const container = document.getElementById('view-detalle');
  if (!container) return;

  const zonas = getZonasActivas();
  const zonaData = zonas.find((z) => z.id === zonaId);
  if (!zonaData) {
    container.innerHTML = `<div class="ga-empty-state">Zona no encontrada</div>`;
    return;
  }

  const zona = calcularPrevision(zonaData);
  const colors = getColorNivel(zona.nivel);
  const calculadas = recomendarZonas(zonas);
  const recomendada = calculadas[0];

  // Porcentaje actual
  const porcAhora = Math.round((100 * zona.ocupadasAhora) / zona.capacidad);

  // Explicación del ranking
  let explicacion = '';
  if (zona.esRecomendada || (recomendada && zona.id === recomendada.id)) {
    // Check empate
    const empateZona = calculadas.find(
      (z) => z.id !== zona.id && z.puntuacion === zona.puntuacion
    );
    if (empateZona) {
      explicacion = `
        <div class="ga-explanation">
          Empata con ${empateZona.nombre} en puntuación.<br>
          Se elige ${zona.nombre} por su menor ocupación.
        </div>
      `;
    }
  } else {
    explicacion = `
      <div class="ga-explanation">
        ${zona.nivel === 'rojo' ? 'Alta ocupación prevista.' : 'Menos saturada que A, pero más lejos.'}
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Status bar -->
    <div class="ga-status-bar">
      <span class="ga-time">18:00</span>
      <span class="ga-demo-badge">DEMO</span>
    </div>

    <!-- Header con volver -->
    <div class="ga-detail-header">
      <button class="ga-btn-back" id="detalle-back">‹</button>
      <span class="ga-detail-title">${zona.nombre}</span>
    </div>
    <div class="ga-detail-sector">${zona.sector}</div>

    <!-- Tarjeta de previsión grande -->
    <div class="ga-prevision-card">
      <div class="ga-prevision-label">PREVISIÓN A LAS 18:15</div>
      <div class="ga-prevision-big">${zona.porcentaje} %</div>
      <div class="ga-prevision-badge" style="background: ${colors.badgeBg}; color: ${colors.badgeColor}">
        ${zona.etiqueta}
      </div>
      <div class="ga-prevision-free">${zona.libresPrevistas} plazas libres estimadas</div>
      <div class="ga-prevision-disclaimer">No es una reserva de plaza</div>
    </div>

    <!-- Comparativa ahora vs llegada -->
    <div class="ga-compare-row">
      <div class="ga-compare-box">
        <div class="ga-compare-label">AHORA · 18:00</div>
        <div class="ga-compare-value">${porcAhora} %</div>
      </div>
      <div class="ga-compare-box">
        <div class="ga-compare-label">A TU LLEGADA</div>
        <div class="ga-compare-value ga-compare-arrival">${zona.porcentaje} %</div>
      </div>
    </div>

    <!-- Tiempos -->
    <div class="ga-times-card">
      <div class="ga-times-row">
        <span class="ga-time-value">${zona.cocheMins} min en coche</span>
        <span class="ga-time-value">${zona.pieMins} min a pie</span>
      </div>
      <div class="ga-times-disclaimer">Tiempos y disponibilidad ficticios</div>
    </div>

    ${explicacion}

    <!-- Botones de acción -->
    <button class="ga-btn-primary" id="btn-ir-zona">
      <span>Ir a esta zona</span>
      <span class="ga-btn-arrow">→</span>
    </button>
    <button class="ga-btn-outline" id="btn-activar-aviso">
      <span>Activar aviso</span>
      <span class="ga-btn-arrow-blue">→</span>
    </button>

    <div class="ga-disclaimer">Datos simulados · no garantiza plaza</div>
  `;

  // Event listeners
  document.getElementById('detalle-back')?.addEventListener('click', () => {
    navigateTo('inicio');
  });

  document.getElementById('btn-ir-zona')?.addEventListener('click', () => {
    // Mostrar toast de navegación simulada
    const toastContainer = document.getElementById('ga-toast-container');
    if (toastContainer) {
      const toastEl = document.createElement('div');
      toastEl.className = 'toast align-items-center text-bg-primary border-0 rounded-3 shadow';
      toastEl.setAttribute('role', 'alert');
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <strong>Navegación simulada</strong> — En una app real, se abriría Google Maps hacia ${zona.nombre}.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      toastContainer.appendChild(toastEl);
      const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
      toast.show();
      toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
  });

  document.getElementById('btn-activar-aviso')?.addEventListener('click', () => {
    // Activar escenario de alerta y navegar a avisos
    state.escenarioActivo = 'alerta';
    state.zonaSeleccionada = zonaId;
    navigateTo('alertas');
  });
}
