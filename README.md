# 🚗 Granada Aparca

> **Aparca con previsión, no dando vueltas.**  
> Aplicación web (SPA) para predecir la ocupación de aparcamientos por zona y franja horaria en Granada, reduciendo el tráfico de agitación y las emisiones asociadas a la búsqueda de parking.

Prototipo interactivo desarrollado para el **Reto #07**, diseñado en base al mock-up de **Figma** e integrado con **datos oficiales en tiempo real del Ayuntamiento de Granada**.

---

## 📌 Tabla de Contenidos

1. [El Problema y la Propuesta de Valor](#-el-problema-y-la-propuesta-de-valor)
2. [Características Principales](#-características-principales)
3. [Integración con Datos Reales de Granada](#-integración-con-datos-reales-de-granada)
4. [Caso Particular Probado (Caso Ana en Recogidas)](#-caso-particular-probado-caso-ana-en-recogidas)
5. [Algoritmo de Predicción y Recomendación](#-algoritmo-de-predicción-y-recomendación)
6. [Estructura del Proyecto](#-estructura-del-proyecto)
7. [Instalación y Uso](#-instalación-y-uso)
8. [Limitaciones y Próximos Pasos](#-limitaciones-y-próximos-pasos)

---

## 🎯 El Problema y la Propuesta de Valor

* **Problema:** Conocer la ocupación actual no es suficiente si esta cambia drásticamente durante el trayecto de conducción. Además, una zona inmediata al destino puede suponer más minutos de vuelta y congestión que un aparcamiento situado a escasos minutos a pie.
* **Propuesta de valor:** Recomendar la mejor zona para la **hora prevista de llegada** (+15 min) y ofrecer una alternativa menos saturada, ponderando tiempo de conducción, caminata a pie y penalización por alta ocupación.
* **Transparencia:** La app **no garantiza ni reserva plaza**; proporciona información predictiva clara para tomar mejores decisiones antes de ponerse al volante.

---

## ✨ Características Principales

* 📱 **Diseño móvil (Figma Fidelity):** Interfaz contenida en formato móvil (390×844 px), respetando la paleta de color (`#1769C2`, `#202C3A`, `#F6F8FB`) y tipografía del prototipo Figma.
* 🔀 **Modo Dual:**
  * **📡 Datos Reales (En vivo):** Conexión con los aforos de los parkings públicos monitorizados por el Ayuntamiento de Granada.
  * **🧪 Simulación Reto #07:** Escenario base con Zonas A, B y C del enunciado del reto para demostración controlada.
* 🗺️ **Mapa Esquemático Dinámico:** Representación SVG contextualizada según las zonas evaluadas y su nivel de disponibilidad.
* 🚦 **Semáforo de Disponibilidad:**
  * 🟢 **Verde (< 70 %):** Disponible · Sin penalización.
  * 🟡 **Ámbar (70 % – 89 %):** Ocupación media · Penalización de +5 min.
  * 🔴 **Rojo (≥ 90 %):** Alta ocupación · Penalización de +10 min.
* 🔔 **Simulador de Alertas:** Flujo de aviso si la zona elegida empeora su ocupación durante el trayecto, ofreciendo una alternativa viable.
* ⚙️ **Preferencias de Usuario:** Filtro de tiempo máximo a pie (por defecto 10 min), tipología de aparcamiento y control de notificaciones.

---

## 🌐 Integración con Datos Reales de Granada

El sistema descarga y procesa datos abiertos oficiales del **Centro de Gestión Integral de Movilidad (CGIM) del Ayuntamiento de Granada**:

| Fuente / Recurso | Endpoint / Archivo | Utilidad |
|---|---|---|
| **Aforos en Tiempo Real** | `movilidadgranada.com/aparcamientos/par_tabla.php` | Plazas libres y estado en vivo de **24 parkings públicos** de Granada (actualizado cada 5 min). |
| **Open Data Parkings** | `movilidadgranada.com/_OPEN_DATA/parkings.kml` | 329 elementos espaciales con geometrías, accesos peatonales y rodados. |
| **Reservas en Superficie** | `movilidadgranada.com/_OPEN_DATA/reservas-aparcamiento.csv` | 11.838 registros de plazas en vía pública por distrito, barrio y coordenadas GIS. |
| **Reservas PMR** | `movilidadgranada.com/_OPEN_DATA/reservas-aparcamiento-pmr.csv` | Plazas reservadas para personas con movilidad reducida. |

Los datos descargados se almacenan localmente en la carpeta `data/`.

---

## 🧪 Caso Particular Probado: Yeray (ETSIIT ➔ Ayuntamiento)

> * **Conductor:** Yeray.
> * **Origen:** ETSIIT Granada (C/ Periodista Daniel Saucedo Aranda).
> * **Destino:** Ayuntamiento de Granada (Plaza del Carmen).
> * **Horario:** Consulta a las **14:00** con previsión de llegada a las **15:00** (franja de mediodía/tarde).
> * **Preferencia:** Máximo **10 minutos** a pie hasta el Ayuntamiento.

Se evaluaron los parkings públicos reales en el entorno de la Plaza del Carmen y Centro cruzando sus capacidades con los **aforos oficiales en tiempo real del Ayuntamiento de Granada**:

| Rank | Parking Real | Capacidad | Libres en Vivo | Previsión 15:00 | Coche (ETSIIT) / Pie (Ayto) | Penalización | Puntuación Final |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 👑 **1º** | **Garaje Rex** (C/ Recogidas, 38) | 97 | 53 | **52 % (🟢)** · 47 lib. | 11 min / 8 min | 0 min | **19 min (Recomendada)** |
| 🥈 **2º** | **Puerta Real** (Acera del Darro) | 298 | 91 | **74 % (🟡)** · 76 lib. | 12 min / 3 min | +5 min | **20 min (Alternativa)** |
| 3º | **Ganivet** (C/ Ángel Ganivet) | 120 | 20 | **79 % (🟡)** · 25 lib. | 13 min / 2 min | +5 min | **20 min** |
| 4º | **San Agustín** (Plaza San Agustín) | 447 | 119 | **78 % (🟡)** · 99 lib. | 13 min / 5 min | +5 min | **23 min** |
| 5º | **Escolapios** (Pº de los Basilios) | 330 | 106 | **71 % (🟡)** · 96 lib. | 14 min / 9 min | +5 min | **28 min** |

* **Desempate oficial:** *Puerta Real* y *Ganivet* empatan en 20 min de puntuación. El criterio de desempate del reto asigna la 2ª posición a *Puerta Real* por presentar menor ocupación prevista (74 % frente al 79 % de Ganivet).
* **Filtro de exclusión:** Parkings como *Sócrates* (12 min a pie) y *Alsina* (15 min a pie) quedan excluidos automáticamente por exceder el límite de 10 min establecido en las preferencias de Yeray.
* **Resultado del algoritmo:**
  * **Opción Recomendada:** **Garaje Rex** (52 % previsto en franja verde, puntuación mínima de 19 min).
  * **Alternativa:** **Puerta Real** (a 3 min a pie del Ayuntamiento, 74 % previsto, puntuación de 20 min).

---

## 📐 Algoritmo de Predicción y Recomendación

El motor implementa las reglas definidas en el reto:

1. **Previsión de plazas ocupadas:**
   $$\text{ocupadas\_previstas} = \min(\text{capacidad}, \max(0, \text{ocupadas\_actuales} + \Delta_{15\text{min}}))$$
2. **Porcentaje previsto:**
   $$\text{ocupacion\_\%} = \frac{\text{ocupadas\_previstas}}{\text{capacidad}} \times 100$$
3. **Penalización por búsqueda:**
   * $< 70\,\%$ $\to$ $+0\text{ min}$
   * $70\,\%$ a $89\,\%$ $\to$ $+5\text{ min}$
   * $\ge 90\,\%$ $\to$ $+10\text{ min}$
4. **Puntuación global (a minimizar):**
   $$\text{puntuacion} = \text{minutos\_coche} + \text{minutos\_a\_pie} + \text{penalizacion}$$
5. **Criterio de desempate:**
   * Menor puntuación global.
   * Si empatan: menor porcentaje de ocupación previsto.
   * Si persiste: menor tiempo de caminata a pie.

---

## 📂 Estructura del Proyecto

```text
ldu/
├── data/                               # Datos oficiales descargados del Ayuntamiento
│   ├── parkings_reales.json            # Aforos en vivo parseados (24 parkings)
│   ├── parkings.kml                    # Capa geográfica oficial
│   ├── reservas-aparcamiento.csv       # Plazas en superficie (11.838 registros)
│   └── reservas-pmr.csv                # Plazas PMR
├── scripts/
│   ├── fetch_real_data.js              # Descarga en vivo de movilidadgranada.com
│   ├── download_opendata_files.js      # Descarga de KML y CSV de Open Data
│   └── probar_caso_real.js             # Evaluación por CLI del caso particular
├── src/
│   ├── views/                          # Vistas de la aplicación
│   │   ├── inicio.ts                   # Pantalla principal (mapa + tarjetas de zona)
│   │   ├── detalle.ts                  # Detalle de zona y previsión
│   │   ├── alertas.ts                  # Alertas y recomendación de alternativa
│   │   └── perfil.ts                   # Ajustes y preferencias
│   ├── data.ts                         # Modelo de datos (reales y simulados)
│   ├── engine.ts                       # Lógica de cálculo, semáforo y ranking
│   ├── router.ts                       # Enrutador SPA ligero basado en hash
│   ├── main.ts                         # Entrada de la app
│   └── style.css                       # Sistema de diseño y maquetación Figma
├── index.html                          # Contenedor HTML móvil
├── package.json
├── tsconfig.json
└── Reto07.md                           # Especificación y requerimientos del reto
```

---

## 🚀 Instalación y Uso

### Prerrequisitos

* [Node.js](https://nodejs.org/) (versión 18 o superior).

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre en tu navegador: **[http://localhost:5173/](http://localhost:5173/)**

### 3. Ejecutar la prueba del caso particular por consola

```bash
npm test
```

Ejecuta el script [`scripts/probar_caso_real.js`](file:///c:/Users/yerasito/Desktop/ldu/scripts/probar_caso_real.js) mostrando la tabla comparativa y la decisión del sistema con los aforos en vivo.

### 4. Actualizar datos en tiempo real de los sensores

```bash
npm run update-data
```

Descarga la última lectura oficial disponible del servidor de tráfico del Ayuntamiento de Granada.

### 5. Compilar para producción

```bash
npm run build
```

---

## ⚠️ Limitaciones y Próximos Pasos

* **Datos en vivo vs. Modelo predictivo:** Actualmente la previsión a +15 minutos utiliza una variación heurística sobre el aforo en vivo. En fases posteriores se entrenará un modelo de Machine Learning con el histórico acumulado de franjas horarias y eventos en la ciudad.
* **Integración de navegación:** La acción "Ir a esta zona" muestra una confirmación simulada; en una aplicación final invocará la API de navegación GPS (Google Maps / Apple Maps / Waze).
* **Alcance:** La aplicación busca informar y reducir tráfico parasitario, sin garantizar una plaza reservada ni sustituir la señalización vial.
