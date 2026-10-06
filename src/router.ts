type RouteHandler = (params?: string) => void;

interface Route {
  pattern: string;
  handler: RouteHandler;
}

const routes: Route[] = [];
let currentView: string | null = null;

/** Registra una ruta con su handler */
export function addRoute(pattern: string, handler: RouteHandler): void {
  routes.push({ pattern, handler });
}

/** Navega a una ruta hash */
export function navigateTo(hash: string): void {
  window.location.hash = hash;
}

/** Oculta todas las vistas y muestra la indicada */
export function showView(viewId: string): void {
  const views = document.querySelectorAll<HTMLElement>('.ga-view');
  views.forEach((v) => (v.style.display = 'none'));

  const target = document.getElementById(viewId);
  if (target) {
    target.style.display = 'block';
    currentView = viewId;
  }

  // Actualizar nav inferior
  updateBottomNav(viewId);
}

function updateBottomNav(viewId: string): void {
  const navItems = document.querySelectorAll<HTMLElement>('.ga-nav-item');
  navItems.forEach((item) => {
    const target = item.dataset.view;
    if (target === viewId || (viewId === 'view-detalle' && target === 'view-inicio')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/** Resuelve la ruta actual del hash */
function resolveRoute(): void {
  const hash = window.location.hash.slice(1) || 'inicio';

  for (const route of routes) {
    // Ruta con parámetro: "detalle/:id" o "detalle/"
    if (route.pattern.includes(':')) {
      const basePattern = route.pattern.split(':')[0];
      if (hash.startsWith(basePattern)) {
        const param = hash.slice(basePattern.length);
        route.handler(param);
        return;
      }
    } else if (route.pattern.endsWith('/') && hash.startsWith(route.pattern)) {
      const param = hash.slice(route.pattern.length);
      route.handler(param);
      return;
    }
    // Ruta exacta
    if (hash === route.pattern) {
      route.handler();
      return;
    }
  }

  // Fallback
  if (routes.length > 0) {
    routes[0].handler();
  }
}

/** Inicializa el router */
export function initRouter(): void {
  window.addEventListener('hashchange', resolveRoute);
  resolveRoute();
}

export function getCurrentView(): string | null {
  return currentView;
}
