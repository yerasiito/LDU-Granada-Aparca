import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import { addRoute, initRouter, showView } from './router';
import { renderInicio } from './views/inicio';
import { renderDetalle } from './views/detalle';
import { renderAlertas } from './views/alertas';
import { renderPerfil } from './views/perfil';
import { state } from './data';

// ─── Rutas ───────────────────────────────────────────────
addRoute('inicio', () => {
  showView('view-inicio');
  renderInicio();
});

addRoute('detalle/:id', (zonaId?: string) => {
  showView('view-detalle');
  renderDetalle(zonaId ?? (state.modoDatos === 'real' ? 'rex' : 'B'));
});

addRoute('detalle/', (zonaId?: string) => {
  showView('view-detalle');
  renderDetalle(zonaId ?? (state.modoDatos === 'real' ? 'rex' : 'B'));
});

addRoute('alertas', () => {
  showView('view-alertas');
  renderAlertas();
});

addRoute('perfil', () => {
  showView('view-perfil');
  renderPerfil();
});

// ─── Navegación inferior ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initRouter();

  // Bottom nav click handlers
  document.querySelectorAll<HTMLElement>('.ga-nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view === 'view-inicio') {
        state.escenarioActivo = 'inicial';
        window.location.hash = 'inicio';
      } else if (view === 'view-alertas') {
        window.location.hash = 'alertas';
      } else if (view === 'view-perfil') {
        window.location.hash = 'perfil';
      }
    });
  });
});
