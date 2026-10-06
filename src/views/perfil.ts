import { state } from '../data';
import { navigateTo } from '../router';
import * as bootstrap from 'bootstrap';

export function renderPerfil(): void {
  const container = document.getElementById('view-perfil');
  if (!container) return;

  const prefs = state.preferencias;

  container.innerHTML = `
    <!-- Status bar -->
    <div class="ga-status-bar">
      <span class="ga-time">18:00</span>
      <span class="ga-demo-badge">DEMO</span>
    </div>

    <!-- Header con volver -->
    <div class="ga-detail-header">
      <button class="ga-btn-back" id="perfil-back">‹</button>
      <span class="ga-detail-title">Tus preferencias</span>
    </div>
    <div class="ga-detail-sector">Valores predefinidos para esta demo</div>

    <div class="ga-section-title" style="margin-top: 16px;">Cómo quieres aparcar</div>

    <!-- Máximo a pie -->
    <div class="ga-pref-card">
      <div class="ga-pref-label">Máximo a pie</div>
      <div class="ga-pref-value-row">
        <span class="ga-pref-value">${prefs.maxPieMin} minutos</span>
        <span class="ga-pref-chevron">▾</span>
      </div>
    </div>

    <!-- Tipo -->
    <div class="ga-pref-card">
      <div class="ga-pref-label">Tipo de aparcamiento</div>
      <div class="ga-pref-value-row">
        <span class="ga-pref-value">Vía pública y parking</span>
        <span class="ga-pref-chevron">▾</span>
      </div>
    </div>

    <!-- Presupuesto -->
    <div class="ga-pref-card-simple">
      <div class="ga-pref-label">Presupuesto</div>
      <div class="ga-pref-value-sm">${prefs.presupuesto}</div>
    </div>

    <!-- Ubicación + avisos -->
    <div class="ga-pref-card-combined">
      <div class="ga-pref-combined-top">
        <div class="ga-pref-value-sm" style="font-weight: 700;">Ubicación</div>
        <div class="ga-pref-label" style="margin-top: 4px;">Destino introducido manualmente</div>
      </div>
      <div class="ga-pref-divider"></div>
      <div class="ga-pref-toggle-row">
        <span>Avisos antes de conducir</span>
        <div class="ga-toggle ${prefs.avisos ? 'active' : ''}" id="toggle-avisos">
          <div class="ga-toggle-knob"></div>
        </div>
      </div>
    </div>

    <!-- Disclaimers -->
    <div class="ga-pref-notes">
      <div>Controles ilustrativos, no filtros activos.</div>
      <div>No guardamos historial de trayectos.</div>
    </div>

    <!-- Guardar -->
    <button class="ga-btn-primary" id="btn-guardar-perfil">
      <span>Guardar y volver</span>
      <span class="ga-btn-arrow">→</span>
    </button>
  `;

  // Toggle
  document.getElementById('toggle-avisos')?.addEventListener('click', (e) => {
    const toggle = e.currentTarget as HTMLElement;
    toggle.classList.toggle('active');
    state.preferencias.avisos = toggle.classList.contains('active');
  });

  // Back
  document.getElementById('perfil-back')?.addEventListener('click', () => {
    navigateTo('inicio');
  });

  // Guardar
  document.getElementById('btn-guardar-perfil')?.addEventListener('click', () => {
    // Toast de confirmación
    const toastContainer = document.getElementById('ga-toast-container');
    if (toastContainer) {
      const toastEl = document.createElement('div');
      toastEl.className = 'toast align-items-center text-bg-primary border-0 rounded-3 shadow';
      toastEl.setAttribute('role', 'alert');
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <strong>Preferencias guardadas</strong> — En una app real se almacenarían de forma local.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      toastContainer.appendChild(toastEl);
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
      toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
    navigateTo('inicio');
  });
}
