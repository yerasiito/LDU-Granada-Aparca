# Reto #07: Granada Aparca

**Enunciado:** Diseña una app que prediga la ocupación por zona y franja horaria para reducir vueltas innecesarias.

**Solución:** Granada Aparca

Granada Aparca es una aplicación conceptual que ayuda a elegir dónde aparcar antes de iniciar el trayecto. Compara zonas según la ocupación prevista a la hora de llegada, el tiempo de conducción y la distancia a pie, evitando que la opción más cercana sea siempre la elegida.

El usuario introduce su destino, la hora prevista de llegada y el máximo que acepta caminar. La aplicación recomienda una zona y ofrece alternativas mediante un semáforo de ocupación, mostrando plazas libres estimadas y aclarando que no reserva ni garantiza aparcamiento.

El prototipo interactivo presenta tres pantallas: inicio con comparación de zonas, detalle de la opción seleccionada y alerta con una alternativa. La demo simula un aumento de ocupación para mostrar cómo cambia la decisión. La previsión utiliza reglas transparentes; no se presenta como un modelo de inteligencia artificial validado.

**Métrica de éxito:** objetivo de reducir un 10 % el tiempo medio de búsqueda de aparcamiento, frente a buscar sin la aplicación, en pruebas con trayectos y franjas comparables. Se mide desde la llegada a la zona hasta estacionar. Es un objetivo pendiente de validación, no un resultado demostrado.

---

## 🎨 Diagrama Visual del Concepto

El diagrama vectorial completo se encuentra disponible en [`entrega/enunciado_solucion_granada_aparca.svg`](file:///c:/Users/yerasito/Desktop/ldu/entrega/enunciado_solucion_granada_aparca.svg).

```mermaid
graph TD
    classDef header fill:#202C3A,stroke:#1769C2,stroke-width:2px,color:#FFFFFF;
    classDef problem fill:#FEE2E2,stroke:#DC2626,stroke-width:1.5px,color:#991B1B;
    classDef solution fill:#EFF6FF,stroke:#1769C2,stroke-width:2px,color:#1E40AF;
    classDef screens fill:#F0FDF4,stroke:#059669,stroke-width:1.5px,color:#065F46;
    classDef metric fill:#059669,stroke:#047857,stroke-width:2px,color:#FFFFFF;

    subgraph ENUNCIADO ["Enunciado Reto #07"]
        E["<b>«Diseña una app que prediga la ocupación por zona y franja horaria<br>para reducir vueltas innecesarias»</b>"]:::header
    end

    subgraph PROBLEMA ["1. El Problema: Tráfico de Agitación"]
        P1["✕ La opción más cercana al destino suele estar saturada"]:::problem
        P2["✕ Conocer el aforo actual no sirve si cambia durante el trayecto"]:::problem
        P3["✕ Buscar en marcha distrae al volante: decidir antes de conducir"]:::problem
    end

    subgraph SOLUCION ["2. La Solución: Granada Aparca"]
        S1["📍 Entradas: Destino + Hora de llegada + Máximo a pie"]:::solution
        S2["🧠 Motor: Ocupación prevista a la llegada + Ponderación tiempos"]:::solution
        S3["🚦 Semáforo: Verde (&lt;70%), Ámbar (70-89%), Rojo (≥90%)"]:::solution
        S4["ℹ️ Transparencia: Previsión orientativa (no garantiza ni reserva)"]:::solution
    end

    subgraph PANTALLAS ["3. Las 3 Pantallas del Prototipo"]
        SC1["1. Inicio: Comparativa de zonas + Mapa esquemático + Recomendada"]:::screens
        SC2["2. Detalle: Aforo ahora vs Llegada + Tiempos + Ruta simulada"]:::screens
        SC3["3. Alerta: Detección de saturación + Alternativa viable"]:::screens
    end

    subgraph METRICA ["4. Métrica de Éxito"]
        M["🎯 Objetivo: Reducir un 10 % el tiempo medio de búsqueda de aparcamiento<br>(desde la llegada a la zona hasta estacionar, frente a buscar sin app)"]:::metric
    end

    E --> PROBLEMA
    E --> SOLUCION
    SOLUCION --> PANTALLAS
    PANTALLAS --> METRICA
```
