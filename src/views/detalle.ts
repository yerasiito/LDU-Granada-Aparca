import { getZonasActivas, state } from '../data';
import { calcularPrevision, recomendarZonas, getColorNivel } from '../engine';
import { navigateTo } from '../router';
import * as bootstrap from 'bootstrap';

export function renderDetalle(zonaId: string): void {
  const container = document.getElementById('view-detalle');
  if (!container) return;

  let zonas = getZonasActivas();
  let zonaData = zonas.find((z) => z.id === zonaId);

  // Si el ID pertenece al otro modo, cambiamos automáticamente para que siempre se visualice
  if (!zonaData) {
    if (['A', 'B', 'C'].includes(zonaId)) {
      state.modoDatos = 'simulado';
      zonas = getZonasActivas();
      zonaData = zonas.find((z) => z.id === zonaId);
    } else {
      state.modoDatos = 'real';
      zonas = getZonasActivas();
      zonaData = zonas.find((z) => z.id === zonaId);
    }
  }

  if (!zonaData) {
    container.innerHTML = `
      <div class="ga-status-bar">
        <span class="ga-time">--:--</span>
        <button class="btn btn-sm btn-outline-secondary" id="btn-empty-back">‹ Volver</button>
      </div>
      <div class="ga-empty-state p-4 text-center">
        <h5>Opción no encontrada (${zonaId})</h5>
        <p class="text-muted small">No se encontró la zona seleccionada en el sistema.</p>
        <button class="btn btn-primary btn-sm mt-2" id="detalle-empty-back">Volver al inicio</button>
      </div>
    `;
    document.getElementById('btn-empty-back')?.addEventListener('click', () => navigateTo('inicio'));
    document.getElementById('detalle-empty-back')?.addEventListener('click', () => navigateTo('inicio'));
    return;
  }

  const zona = calcularPrevision(zonaData);
  const calculadas = recomendarZonas(zonas);
  zona.esRecomendada = calculadas.length > 0 && calculadas[0].id === zona.id;
  const colors = getColorNivel(zona.nivel);
  const esReal = state.modoDatos === 'real';

  // Porcentaje actual
  const porcAhora = Math.round((100 * zona.ocupadasAhora) / zona.capacidad);

  // Explicación de la decisión y del desempate
  let explicacion = '';
  if (esReal) {
    // Explicaciones para caso real (Yeray)
    if (zona.id === 'rex') {
      explicacion = `
        <div class="ga-explanation" style="background: #EFF5FF; border-left: 3px solid #1769C2;">
          👑 <strong>Opción recomendada para Yeray:</strong> Menor puntuación total (<strong>19 min</strong>). Previsión holgada en nivel verde con <strong>47 plazas libres</strong> estimadas a las 15:00.
        </div>
      `;
    } else if (zona.id === 'puerta-real') {
      explicacion = `
        <div class="ga-explanation" style="background: #FDF9EE; border-left: 3px solid #D97706;">
          🥈 <strong>Alternativa recomendada:</strong> A solo <strong>3 min a pie</strong> del Ayuntamiento. Empata a 20 min de puntuación con Ganivet, pero se recomienda Puerta Real por presentar <strong>menor ocupación (74 % vs 79 %)</strong> y mayor reserva (76 libres).
        </div>
      `;
    } else if (zona.id === 'ganivet') {
      explicacion = `
        <div class="ga-explanation">
          📍 <strong>Inmejorable ubicación a pie:</strong> A solo 2 min de Plaza del Carmen, pero con aforo más ajustado (<strong>79 % ocupado</strong>, 20 libres ahora).
        </div>
      `;
    } else if (zona.id === 'san-agustin') {
      explicacion = `
        <div class="ga-explanation">
          🏛️ <strong>Gran capacidad:</strong> 447 plazas totales junto a Gran Vía, a 5 min a pie del Ayuntamiento (puntuación: 23 min).
        </div>
      `;
    } else {
      explicacion = `
        <div class="ga-explanation">
          Opción viable a 9 min a pie del Ayuntamiento bordeando el río Genil. Puntuación: ${zona.puntuacion} min.
        </div>
      `;
    }
  } else {
    // Explicaciones para caso ficticio (Reto #07)
    if (zona.id === 'B') {
      explicacion = `
        <div class="ga-explanation" style="background: #EFF5FF; border-left: 3px solid #1769C2;">
          👑 <strong>Opción recomendada:</strong> Empata con Zona A en puntuación (<strong>15 min</strong>). Se elige <strong>Zona B</strong> por su menor ocupación prevista (<strong>70 %</strong> frente al 95 % de Zona A).
        </div>
      `;
    } else if (zona.id === 'A') {
      explicacion = `
        <div class="ga-explanation" style="background: #FDF0ED; border-left: 3px solid #DC2626;">
          ⚠️ <strong>Alta ocupación prevista (95 %):</strong> Aunque está muy cerca (3 min coche + 2 min pie), sufre una penalización de <strong>+10 min</strong> por búsqueda, perdiendo el desempate frente a B.
        </div>
      `;
    } else if (zona.id === 'C') {
      explicacion = `
        <div class="ga-explanation">
          🔄 <strong>Alternativa de menor saturación:</strong> Mayor tiempo de acceso (7 min coche + 8 min pie = 20 min totales), pero ofrece 21 plazas libres si B empeora su aforo.
        </div>
      `;
    }
  }

  container.innerHTML = `
    <!-- Status bar -->
    <div class="ga-status-bar">
      <span class="ga-time">${esReal ? state.horaConsulta : '18:00'}</span>
      <span class="ga-demo-badge" style="${esReal ? 'background: #2D6A3F; color: white;' : ''}">
        ${esReal ? 'CASO REAL YERAY' : 'DEMO RETO #07'}
      </span>
    </div>

    <!-- Header con botón volver -->
    <div class="ga-detail-header d-flex align-items-center gap-2 mb-1">
      <button class="ga-btn-back btn btn-link p-0 text-decoration-none" id="detalle-back" title="Volver al inicio" style="font-size: 26px; line-height: 1; color: #202C3A;">‹</button>
      <div class="flex-grow-1">
        <div class="ga-detail-title fw-bold" style="font-size: 18px; color: #202C3A;">${zona.nombre}</div>
      </div>
      ${zona.esRecomendada ? '<span class="badge bg-primary" style="font-size: 11px;">Recomendada</span>' : ''}
    </div>
    <div class="ga-detail-sector text-muted small mb-3">${zona.sector}</div>

    <!-- Tarjeta de previsión grande -->
    <div class="ga-prevision-card text-center p-3 mb-3" style="background: white; border: 1px solid #DFE5EB; border-radius: 14px;">
      <div class="ga-prevision-label text-muted text-uppercase fw-semibold" style="font-size: 11px; letter-spacing: 0.5px;">
        PREVISIÓN A LA LLEGADA (${esReal ? state.horaLlegada : '18:15'})
      </div>
      <div class="ga-prevision-big my-1 fw-bold" style="font-size: 40px; color: #202C3A;">
        ${zona.porcentaje} %
      </div>
      <div class="ga-prevision-badge d-inline-block px-3 py-1 rounded-pill fw-semibold mb-2" style="background: ${colors.badgeBg}; color: ${colors.badgeColor}; font-size: 12px;">
        ${zona.etiqueta}
      </div>
      <div class="ga-prevision-free fw-medium" style="color: #4B5B6D; font-size: 14px;">
        <strong>${zona.libresPrevistas}</strong> plazas libres estimadas
      </div>
      <div class="ga-prevision-disclaimer text-muted mt-1" style="font-size: 11px;">
        No es una reserva · Previsión orientativa
      </div>
    </div>

    <!-- Comparativa AHORA vs LLEGADA -->
    <div class="ga-compare-row d-flex gap-2 mb-3">
      <div class="ga-compare-box flex-fill text-center p-2 rounded-3" style="background: #F4F6F9; border: 1px solid #E5E9EF;">
        <div class="ga-compare-label text-muted fw-semibold" style="font-size: 10px;">
          AHORA (${esReal ? state.horaConsulta : '18:00'})
        </div>
        <div class="ga-compare-value fw-bold mt-1" style="font-size: 18px; color: #4B5B6D;">
          ${porcAhora} %
        </div>
        <div class="text-muted" style="font-size: 10px;">
          ${zona.capacidad - zona.ocupadasAhora} libres
        </div>
      </div>
      <div class="ga-compare-box flex-fill text-center p-2 rounded-3" style="background: #EFF5FF; border: 1px solid #BFDBFE;">
        <div class="ga-compare-label text-primary fw-semibold" style="font-size: 10px;">
          LLEGADA (${esReal ? state.horaLlegada : '18:15'})
        </div>
        <div class="ga-compare-value fw-bold mt-1" style="font-size: 18px; color: #1769C2;">
          ${zona.porcentaje} %
        </div>
        <div class="text-primary" style="font-size: 10px;">
          ${zona.libresPrevistas} estimadas
        </div>
      </div>
    </div>

    <!-- Desglose de Tiempos y Puntuación de Algoritmo -->
    <div class="ga-times-card p-3 mb-3 rounded-3" style="background: white; border: 1px solid #DFE5EB;">
      <div class="fw-semibold mb-2" style="font-size: 12px; color: #202C3A;">
        DESGLOSE DE PUNTUACIÓN (RETO #07)
      </div>
      <div class="d-flex justify-content-between py-1 border-bottom" style="font-size: 12px;">
        <span class="text-muted">🚗 ${esReal ? 'Coche (desde ETSIIT)' : 'Tiempo en coche'}:</span>
        <span class="fw-semibold">${zona.cocheMins} min</span>
      </div>
      <div class="d-flex justify-content-between py-1 border-bottom" style="font-size: 12px;">
        <span class="text-muted">🚶 ${esReal ? 'A pie (al Ayuntamiento)' : 'Tiempo a pie'}:</span>
        <span class="fw-semibold">${zona.pieMins} min</span>
      </div>
      <div class="d-flex justify-content-between py-1 border-bottom" style="font-size: 12px;">
        <span class="text-muted">⏳ Penalización por aforo (${zona.nivel}):</span>
        <span class="fw-semibold ${zona.penalizacion > 0 ? 'text-danger' : 'text-success'}">+${zona.penalizacion} min</span>
      </div>
      <div class="d-flex justify-content-between pt-2 fw-bold" style="font-size: 13px; color: #1769C2;">
        <span>Puntuación total de decisión:</span>
        <span>${zona.puntuacion} min</span>
      </div>
      <div class="mt-2 text-muted" style="font-size: 10px; border-top: 1px dashed #E5E9EF; padding-top: 6px;">
        Capacidad total: <strong>${zona.capacidad} plazas</strong> · Menor puntuación = mayor recomendación.
      </div>
    </div>

    <!-- Explicación del ranking -->
    ${explicacion}

    <!-- Botones de Acción Funcionales -->
    <div class="d-flex flex-column gap-2 mt-3 mb-2">
      <button class="ga-btn-primary btn btn-primary w-100 py-2 d-flex justify-content-between align-items-center" id="btn-ir-zona" style="border-radius: 12px; font-weight: 600;">
        <span>Navegar a ${zona.nombre}</span>
        <span>→</span>
      </button>

      <button class="ga-btn-outline btn btn-outline-primary w-100 py-2 d-flex justify-content-between align-items-center" id="btn-activar-aviso" style="border-radius: 12px; font-weight: 600;">
        <span>Simular aumento de saturación</span>
        <span>🔔</span>
      </button>

      <button class="btn btn-light w-100 py-2 text-muted" id="btn-volver-lista" style="border-radius: 12px; font-size: 12px;">
        ← Volver al listado de opciones
      </button>
    </div>

    <!-- Disclaimer -->
    <div class="ga-disclaimer text-center text-muted mt-2" style="font-size: 10px;">
      ${esReal ? 'Datos oficiales de movilidad del Ayto. de Granada · no garantiza plaza' : 'Datos simulados del Reto #07 · no garantiza plaza'}
    </div>
  `;

  // Event listeners
  document.getElementById('detalle-back')?.addEventListener('click', () => {
    navigateTo('inicio');
  });

  document.getElementById('btn-volver-lista')?.addEventListener('click', () => {
    navigateTo('inicio');
  });

  document.getElementById('btn-ir-zona')?.addEventListener('click', () => {
    const toastContainer = document.getElementById('ga-toast-container');
    if (toastContainer) {
      const toastEl = document.createElement('div');
      toastEl.className = 'toast align-items-center text-bg-primary border-0 rounded-3 shadow';
      toastEl.setAttribute('role', 'alert');
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <div>
              <strong>Ruta iniciada hacia ${zona.nombre}</strong><br>
              <small>${esReal ? 'Desde ETSIIT ➔ ' + zona.direccion : 'Destino: ' + zona.nombre}</small>
            </div>
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
    state.escenarioActivo = 'alerta';
    state.zonaSeleccionada = zonaId;
    navigateTo('alertas');
  });
}
