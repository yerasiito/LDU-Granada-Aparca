import { ZONAS_ALERTA } from '../data';
import { recomendarZonas, calcularPrevision } from '../engine';
import { navigateTo } from '../router';

export function renderAlertas(): void {
  const container = document.getElementById('view-alertas');
  if (!container) return;

  // Calcular datos del escenario de alerta
  const zonaBData = ZONAS_ALERTA.find((z) => z.id === 'B')!;
  const zonaB = calcularPrevision(zonaBData);

  const calculadas = recomendarZonas(ZONAS_ALERTA);
  const zonaC = calculadas.find((z) => z.id === 'C');
  const zonaA = calculadas.find((z) => z.id === 'A');

  container.innerHTML = `
    <!-- Status bar -->
    <div class="ga-status-bar">
      <span class="ga-time">18:00</span>
      <span class="ga-demo-badge">DEMO</span>
    </div>

    <!-- Header con volver -->
    <div class="ga-detail-header">
      <button class="ga-btn-back" id="alertas-back">‹</button>
      <span class="ga-detail-title">Avisos</span>
    </div>
    <div class="ga-detail-sector">Escenario de demostración</div>

    <!-- Alerta roja B -->
    <div class="ga-alert-card">
      <div class="ga-alert-title">B tendrá más ocupación</div>
      <div class="ga-alert-change">70 % → ${zonaB.porcentaje} % previsto</div>
      <div class="ga-alert-detail">Quedan ${zonaB.libresPrevistas} plazas estimadas a las 18:15.</div>
      <div class="ga-alert-note">Nueva lectura ficticia: ${zonaBData.ocupadasAhora} de ${zonaBData.capacidad}.</div>
    </div>

    <!-- Sección alternativa -->
    <div class="ga-section-title" style="margin-top: 16px;">Puedes cambiar de zona</div>

    ${zonaC ? `
    <div class="ga-alt-card">
      <div class="ga-alt-name">Zona C · menos saturada</div>
      <div class="ga-alt-stats">${zonaC.porcentaje} % previsto · ${zonaC.libresPrevistas} libres estimadas</div>
      <div class="ga-alt-times">${zonaC.cocheMins} min en coche · ${zonaC.pieMins} min a pie</div>
      <div class="ga-alt-note">Más lejos, pero menor ocupación que A.</div>
    </div>
    ` : ''}

    <!-- Info de puntuación -->
    <div class="ga-info-box">
      <div class="ga-info-highlight">A gana por puntuación, no por ocupación.</div>
      <div class="ga-info-detail">A: ${zonaA?.puntuacion ?? '—'} puntos · C: ${zonaC?.puntuacion ?? '—'} puntos</div>
    </div>

    <!-- Botones -->
    <button class="ga-btn-primary" id="btn-ver-alt-c">
      <span>Ver alternativa C</span>
      <span class="ga-btn-arrow">→</span>
    </button>
    <button class="ga-btn-outline" id="btn-mantener-b">
      <span>Mantener selección B</span>
      <span class="ga-btn-arrow-blue">→</span>
    </button>

    <div class="ga-disclaimer">Avisos silenciados durante la conducción</div>
  `;

  // Events
  document.getElementById('alertas-back')?.addEventListener('click', () => {
    navigateTo('inicio');
  });

  document.getElementById('btn-ver-alt-c')?.addEventListener('click', () => {
    navigateTo('detalle/C');
  });

  document.getElementById('btn-mantener-b')?.addEventListener('click', () => {
    navigateTo('detalle/B');
  });
}
