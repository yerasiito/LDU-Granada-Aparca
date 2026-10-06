# 🚗 Diagramas Visuales de Granada Aparca

Este documento recoge los diagramas visuales del sistema para la memoria y presentación de entrega.

---

## 1. Diagrama de Flujo del Algoritmo de Previsión y Decisión

```mermaid
flowchart TD
    classDef input fill:#EFF5FF,stroke:#1769C2,stroke-width:2px,color:#1769C2;
    classDef filter fill:#F8FAFC,stroke:#8FA2B5,stroke-width:1px,color:#202C3A;
    classDef calc fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E;
    classDef output fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#065F46;
    classDef discard fill:#FEE2E2,stroke:#DC2626,stroke-width:1px,color:#991B1B;

    subgraph ENTRADA ["1. Entradas al Sistema"]
        U["👤 Conductor (Yeray)<br>Origen: ETSIIT | Destino: Ayto.<br>Hora: 14:00 ➔ Llegada: 15:00<br>Preferencia máx a pie: 10 min"]:::input
        S["📡 Sensores Oficiales Ayto.<br>Plazas libres en vivo cada 5 min"]:::input
        M["🗺️ Matriz de Movilidad<br>Minutos coche + Minutos a pie"]:::input
    end

    subgraph FILTRADO ["2. Filtro y Validación de Candidatos"]
        F1{"¿Tiempo a pie ≤ 10 min?"}:::filter
        EX["🚫 Descartados:<br>• Sócrates (12 min)<br>• Alsina (15 min)"]:::discard
        OK["✅ Candidatos válidos:<br>Rex, Puerta Real, Ganivet,<br>San Agustín, Escolapios"]:::filter
    end

    subgraph MOTOR ["3. Motor de Previsión de Ocupación"]
        P1["Fórmula de Previsión:<br><b>Ocupadas = limitar(Actuales + Δ, 0, Capacidad)</b><br>Libres = Capacidad - Ocupadas"]:::calc
        P2{"Clasificación por Semáforo"}:::calc
        V["🟢 Verde (&lt; 70%)<br>Penalización: +0 min"]:::calc
        A["🟡 Ámbar (70% - 89%)<br>Penalización: +5 min"]:::calc
        R["🔴 Rojo (≥ 90%)<br>Penalización: +10 min"]:::calc
    end

    subgraph PUNTUACION ["4. Puntuación y Desempate"]
        SCORE["Función de Coste:<br><b>Puntuación = Min Coche + Min Pie + Penalización</b>"]:::calc
        RANK["Desempates Oficiales:<br>1. Menor Puntuación<br>2. Menor % Ocupación<br>3. Menor caminata a pie"]:::calc
    end

    subgraph DECISION ["5. Recomendación al Usuario en App"]
        REC["👑 1ª Recomendada: Garaje Rex<br>11m coche + 8m pie + 0m pen = 19 min<br>Previsión: 52% (47 plazas libres)"]:::output
        ALT["🥈 2ª Alternativa: Puerta Real<br>12m coche + 3m pie + 5m pen = 20 min<br>Previsión: 74% (76 plazas libres)"]:::output
    end

    U --> F1
    S --> P1
    M --> F1
    F1 -- "No" --> EX
    F1 -- "Sí" --> OK
    OK --> P1
    P1 --> P2
    P2 --> V
    P2 --> A
    P2 --> R
    V --> SCORE
    A --> SCORE
    R --> SCORE
    SCORE --> RANK
    RANK --> REC
    RANK --> ALT
```

---

## 2. Diagrama de Arquitectura Tecnológica del Sistema

```mermaid
graph LR
    classDef layer fill:#FFFFFF,stroke:#CBD5E1,stroke-width:1px,color:#0F172A;
    classDef comp fill:#EFF6FF,stroke:#3B82F6,stroke-width:1.5px,color:#1E40AF;

    subgraph FUENTES ["Fuentes de Datos"]
        F1["Sensores CGIM Granada<br>(par_tabla.php)"]:::comp
        F2["Open Data Municipal<br>(KML Parkings / GIS)"]:::comp
        F3["Mapas / Tráfico Urbano<br>(Matriz ETSIIT - Centro)"]:::comp
    end

    subgraph INGESTA ["Ingesta y Normalización"]
        I1["Parser de Aforos<br>(fetch_real_data.js)"]:::comp
        I2["Validador de Frescura<br>(descarte &gt; 10 min)"]:::comp
    end

    subgraph MOTOR ["Motor de Negocio"]
        M1["Cálculo de Previsión (+15m / Horaria)"]:::comp
        M2["Semáforo de Agitación (+0 / +5 / +10m)"]:::comp
        M3["Ranking y Desempates"]:::comp
    end

    subgraph CLIENTE ["Frontend Web (SPA Vite + Bootstrap)"]
        C1["Pantalla Inicio<br>(Ruta + Mapa SVG + Tarjetas)"]:::comp
        C2["Pantalla Detalle<br>(Aforo en vivo vs Previsión)"]:::comp
        C3["Simulador Alertas<br>(Cambio de escenario)"]:::comp
    end

    FUENTES --> INGESTA
    INGESTA --> MOTOR
    MOTOR --> CLIENTE
```

---

> 💡 **Nota:** Se ha generado también un archivo SVG vectorial de alta resolución en [`entrega/diagrama_visual.svg`](file:///c:/Users/yerasito/Desktop/ldu/entrega/diagrama_visual.svg) listo para insertar en diapositivas, Figma o documentos impresos.
