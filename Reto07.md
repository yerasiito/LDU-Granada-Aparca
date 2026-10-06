# Reto #07

Diseña una app que prediga la ocupación de aparcamientos por zona y franja horaria para reducir vueltas innecesarias.

<aside>
🚗

**Granada Aparca — aparca con previsión, no dando vueltas.**

App conceptual que compara zonas de aparcamiento según su ocupación prevista a la hora de llegada, el tiempo de conducción y la distancia a pie. El entregable de una hora será un prototipo navegable con datos simulados, no una integración real con sensores ni un modelo de IA entrenado.

</aside>

## Definir el problema

### Usuario objetivo: quién lo usará y por qué

Conductores que se desplazan a Granada por trabajo, estudios, compras o gestiones y desconocen dónde tendrán más opciones de aparcar al llegar. Necesitan decidir antes de entrar en una zona congestionada, evitando búsquedas repetidas y consultando la app únicamente antes de conducir o con el vehículo detenido.

**Problema:** conocer la ocupación actual no basta si cambia durante el trayecto. Además, una zona cercana al destino puede implicar más búsqueda que otra algo más alejada.

**Propuesta de valor:** recomendar una zona para la hora prevista de llegada y ofrecer una alternativa, mostrando disponibilidad estimada, actualización y limitaciones. No reserva ni garantiza una plaza.

### Caso de uso concreto: situación real y específica

Ana sale hacia una cita cerca de Recogidas y quiere aparcar sobre las 18:15 de un día laborable. Acepta caminar hasta 10 minutos y solo quiere opciones compatibles con su vehículo y presupuesto.

1. Introduce el destino, la hora de llegada y sus preferencias.
2. Consulta tres zonas con ocupación prevista para las 18:15.
3. La app recomienda la zona B: supone algo más de conducción, pero presenta menor ocupación prevista.
4. Ana abre el detalle y pulsa «Ir a esta zona».
5. Si consulta de nuevo antes de salir y la previsión empeora, la app ofrece otra opción. Las alertas durante la conducción quedan silenciadas.

### Contexto urbano: barrio/ciudad, condiciones y actores

**Ámbito propuesto:** piloto en el entorno de Recogidas–Camino de Ronda, Granada. Las zonas A, B y C del prototipo son sectores ficticios: sus capacidades y tiempos no representan mediciones reales.

**Condiciones a contemplar:** variaciones por hora, día de la semana, eventos, restricciones de acceso, plazas reservadas y diferencias entre aparcamiento en vía pública y parkings. Se comparan únicamente opciones legales y compatibles con las preferencias; las restricciones deben verificarse antes de una implantación.

**Actores:** conductores; Ayuntamiento, para regulación y datos disponibles; operadores de aparcamientos, para aforos; proveedor de sensores y plataforma, para captura y mantenimiento. Su participación es una propuesta, no un acuerdo existente.

**Validación futura:** medir el tiempo de búsqueda, las vueltas realizadas y el error de ocupación prevista frente a observada. La demo no demuestra todavía ahorro de tiempo ni reducción de emisiones.

## Diseñar la solución

### Arquitectura: App + API + sensores + IA

```
[Fuentes de ocupación]
Sensores IoT / aforos de parkings / histórico
                 |
                 v
[API de ingesta y validación]
Comprueba fecha, zona, duplicados y valores
                 |
                 v
[Base de datos]
Zonas, capacidades, restricciones e histórico
                 |
                 v
[Motor de predicción y recomendación]
Estima ocupación futura y ordena zonas válidas
                 |
                 v
[API de consulta]
Devuelve previsión, actualización y alternativa
                 |
                 v
[App]
Inicio → Detalle → Acción/alertas → Perfil
```

**En una hora:** sustituir sensores, API y base de datos por un JSON local con tres zonas y dos escenarios. La lógica se puede ejecutar en JavaScript o representarse mediante estados de Figma. No hace falta desplegar un backend.

**En una versión real:** sensores o aforos aportarían observaciones; la API serviría previsiones calculadas con históricos. Empezar por una línea base sencilla y evaluar después un modelo de aprendizaje automático con hora, día, ocupación reciente y eventos, sin prometer precisión antes de probarlo.

### Flujo de datos: origen → procesamiento → almacenamiento → visualización/acciones

1. **Origen:** registros con `zona`, `fecha_hora`, `capacidad_utilizable` y `ocupadas`; histórico por franjas de 15 minutos.
2. **Procesamiento:** validar que la ocupación está entre cero y la capacidad; excluir lecturas inválidas y detectar datos desactualizados.
3. **Almacenamiento:** conservar observaciones y metadatos de las zonas; en la demo, usar un JSON local.
4. **Predicción:** estimar la ocupación para la franja de llegada, no confundirla con la última lectura.
5. **Recomendación:** filtrar restricciones y preferencias; ordenar por tiempo de conducción, caminata y penalización por alta ocupación.
6. **Visualización/acciones:** mostrar porcentaje, plazas estimadas, hora de actualización, etiqueta de calidad y alternativa; permitir iniciar navegación.

**Privacidad:** ubicación solo con consentimiento; permitir introducir el destino manualmente. No se necesitan matrículas, identidad de otros conductores ni un historial personal de trayectos.

### Lógica principal: reglas/IA que convierten datos en decisiones

Para la demo, aplicar reglas transparentes sobre una previsión a 15 minutos:

- `ocupadas_previstas = limitar(ocupadas_actuales + variación_15min, 0, capacidad)`.
- `libres_previstas = capacidad − ocupadas_previstas`.
- `ocupación_% = 100 × ocupadas_previstas / capacidad`.
- **Verde:** menos del 70 %. **Ámbar:** desde el 70 % hasta menos del 90 %. **Rojo:** 90 % o más. Mostrar también texto, no depender únicamente del color.
- Penalización de búsqueda ficticia: verde = 0 minutos; ámbar = 5; rojo = 10. Es una heurística de demostración, no una estimación validada.
- `puntuación = minutos_conducción + minutos_a_pie + penalización`. Recomendar la menor puntuación entre las zonas válidas.
- Si la lectura tiene más de 10 minutos, mostrar «Datos desactualizados» y no tratarla como información en vivo. Si ninguna zona tiene datos recientes, no dar una recomendación fiable.

**Evolución con IA:** sustituir la variación ficticia por una previsión aprendida del histórico. Validar con separación temporal de entrenamiento y prueba, comparando el error con una línea base por zona, día y franja. Mostrar incertidumbre solo cuando pueda estimarse con datos; no inventar un porcentaje de confianza.

## Prototipo de app (clave)

### Figma / mockups: bocetos de pantallas

Crear cuatro pantallas móviles con el mismo encabezado, tarjetas y botones. Los siguientes bocetos son la especificación para montarlas; todavía no constituyen un archivo de Figma ni una app ejecutable.

```
1. INICIO
Granada Aparca                    [Perfil]
Destino: Recogidas
Llegada: 18:15    [Cambiar]
[Esquema de zonas A / B / C]
B · Recomendada · 70 % · 30 libres estimadas
5 min en coche + 5 min a pie       [Ver zona]
A · Alta ocupación prevista       [Ver zona]
C · Alternativa                   [Ver zona]
Datos simulados · Actualización 18:00

2. DETALLE DE ZONA B
[Volver]                         Zona B
Ahora: 65 % → A las 18:15: 70 %
30 plazas libres estimadas
5 min en coche · 5 min a pie
No garantiza una plaza
[Ir a esta zona]   [Activar aviso]

3. ACCIÓN / ALERTAS
Aviso simulado: B pasa al 95 %
Alternativa: C · 85 % previsto
[Ver alternativa]  [Mantener selección]
Avisos silenciados durante la conducción

4. PERFIL / PREFERENCIAS
Máximo a pie: [10 min]
Tipo: [Vía pública / Parking / Ambos]
Presupuesto: [Configurar]
Ubicación: [Permitir / Introducir manualmente]
Avisos: [Activar / Desactivar]
[Guardar y volver]
```

### UI navegable: flujo clicable o storyboard

**Flujo principal:** Inicio → Ver zona B → Detalle B → Ir a esta zona → confirmación «Navegación simulada».

**Flujo alternativo:** Detalle B → Activar aviso → botón «Simular aumento de ocupación» → Alerta → Ver alternativa → Detalle C.

**Preferencias:** Inicio → Perfil → Guardar → Inicio. En un prototipo sin código, utilizar estados predefinidos; no presentar filtros como funcionales si no cambian el resultado.

En Figma, conectar los botones con interacciones y añadir una confirmación superpuesta para navegación. En HTML, usar cuatro vistas y botones que cambien el estado. Elegir una sola herramienta, la que ya se domine. La navegación real y el mapa cartográfico quedan fuera del alcance de la hora.

### Pantallas principales: inicio, detalle, alertas/acción y perfil

- **Inicio:** destino, llegada, tres opciones y recomendación visible sin desplazamiento excesivo.
- **Detalle:** ocupación actual y prevista claramente separadas; tiempo a pie y conducción; aviso de no garantía.
- **Alertas/acción:** cambio relevante, alternativa y decisión explícita del usuario; ningún cambio automático de ruta.
- **Perfil:** preferencias básicas, permisos y control de avisos.

## Lógica básica simulada

### Pseudocódigo o reglas simples

```
ENTRADA: destino, llegada, preferencias, zonas
DEMO: llegada = 18:15; lectura = 18:00

candidatas = []
PARA cada zona:
    SI no cumple restricciones o preferencias:
        continuar
    SI capacidad <= 0 o lectura inválida:
        marcar sin datos y continuar
    SI antigüedad de lectura > 10 minutos:
        marcar desactualizada y continuar

    previstas = limitar(ocupadas + variacion_15min, 0, capacidad)
    libres = capacidad - previstas
    porcentaje = 100 * previstas / capacidad

    SI libres == 0:
        continuar
    SI porcentaje >= 90:
        penalizacion = 10
    SINO SI porcentaje >= 70:
        penalizacion = 5
    SINO:
        penalizacion = 0

    puntuacion = coche_min + pie_min + penalizacion
    añadir zona, porcentaje, libres, puntuacion a candidatas

SI candidatas está vacía:
    mostrar "Sin recomendación fiable; consulta otras opciones"
SINO:
    ordenar por puntuacion ascendente
    mostrar primera como recomendada y segunda como alternativa

AL SIMULAR NUEVA LECTURA:
    recalcular y mostrar aviso si la zona elegida deja de ser recomendada
```

La frescura se evalúa al consultar: una lectura de las 18:00 es reciente si se consulta a las 18:00 para predecir las 18:15. No se utiliza como lectura vigente a las 18:15 sin actualizarla. Para otros horizontes se necesitan otras previsiones; la demo cubre solo estos 15 minutos.

### Demo simulada: datos ficticios y resultado esperado

**Consulta a las 18:00; llegada prevista a las 18:15.** Las tres zonas cumplen las preferencias. Capacidades, variaciones, tiempos y penalizaciones son ficticios.

| Zona | Capacidad | Ocupadas ahora | Variación en 15 min | Ocupadas previstas | Libres previstas | Ocupación prevista | Coche / a pie | Puntuación |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | 80 | 72 | +4 | 76 | 4 | 95 % · rojo | 3 / 2 min | 15 min |
| B | 100 | 65 | +5 | 70 | 30 | 70 % · ámbar | 5 / 5 min | 15 min |
| C | 140 | 112 | +7 | 119 | 21 | 85 % · ámbar | 7 / 8 min | 20 min |

**Desempate:** si dos zonas tienen la misma puntuación, elegir la de menor ocupación prevista; si persiste, la de menor caminata. Por tanto, se recomienda **B** frente a A. La puntuación sirve para comparar, no promete un tiempo real hasta aparcar.

**Escenario de alerta:** en una nueva consulta de demostración, B tiene 90 ocupadas y variación +5: prevé 95 ocupadas, 5 libres y un 95 % de ocupación. Su puntuación pasa a 20. Si A y C mantienen sus previsiones, **A pasa a ser la recomendación por puntuación (15)**, aunque con alta ocupación. Para demostrar una alternativa menos saturada, la alerta ofrece **C**, explicando el compromiso: más tiempo de acceso, pero menor ocupación prevista. El usuario decide; no se afirma que C sea la ganadora del ranking.

**Pruebas mínimas:** el escenario inicial recomienda B; una ocupación mayor que la capacidad se rechaza; una variación extrema queda limitada al rango válido; los datos antiguos no generan una recomendación fiable; con ninguna zona válida aparece un estado vacío.

## Plan de trabajo de 1 hora

**Objetivo al minuto 60:** propuesta completa, cuatro pantallas enlazadas, dos escenarios simulados y explicación breve. Prioridad: flujo navegable y coherencia; no infraestructura real.

| Minutos | Trabajo | Resultado / criterio de cierre |
| --- | --- | --- |
| 00–05 | Fijar alcance: Granada, tres zonas ficticias, llegada 18:15 y herramienta conocida. | Problema, usuario y límites claros. |
| 05–13 | Revisar caso de uso, contexto, privacidad y arquitectura. Copiar el esquema de bloques a la presentación si hace falta. | Se puede explicar de dónde salen los datos y qué hace cada componente. |
| 13–23 | Preparar datos iniciales y de alerta; implementar reglas en JavaScript o estados en Figma. | B recomendada al inicio; alerta coherente y datos identificados como simulados. |
| 23–43 | Montar Inicio, Detalle, Alertas y Perfil; conectar botones y confirmaciones. | Flujo principal y alternativa navegables. Sin botones críticos muertos. |
| 43–53 | Probar la demo y los casos de error; revisar porcentajes, etiquetas y legibilidad. | No hay contradicciones entre reglas, cifras y pantallas. |
| 53–60 | Guardar, comprobar el enlace o archivo y ensayar una explicación de 90 segundos. | Entrega accesible, con capturas de respaldo y alcance honesto. |

**Regla de recorte:** si al minuto 35 no están las cuatro pantallas, eliminar mapa elaborado, gráficas y personalización avanzada. Mantener tarjetas, detalle, alerta y perfil básico. Si al minuto 45 falla la lógica programada, entregar un flujo Figma con escenarios predefinidos, etiquetado como simulación.

### Checklist de entrega

- [ ]  Problema, usuario y contexto completados.
- [ ]  Arquitectura y flujo de datos explicables en 30 segundos.
- [ ]  Cuatro pantallas conectadas y botón de volver disponible.
- [ ]  Ocupación actual y prevista diferenciadas.
- [ ]  Datos ficticios y navegación simulada señalados.
- [ ]  Recomendación inicial, desempate y alerta coherentes.
- [ ]  Estado sin datos y ausencia de garantía de plaza visibles.
- [ ]  Enlace o archivo probado y capturas de respaldo guardadas.

### Guion de presentación: 90 segundos

**0–20 s — Problema:** «Buscar aparcamiento sin saber cómo estará la zona cuando llegas provoca vueltas innecesarias. Granada Aparca ayuda a decidir antes de conducir».

**20–55 s — Demo:** introducir destino y llegada; enseñar por qué B se recomienda frente a A; abrir detalle; simular el empeoramiento de B y mostrar la alternativa C con su compromiso de tiempo.

**55–75 s — Tecnología:** explicar fuentes → API → almacenamiento → predicción → app. Aclarar que hoy son datos ficticios y reglas; una versión real requeriría acceso a datos y validación del modelo.

**75–90 s — Valor y límites:** «No garantizamos plaza. Queremos reducir búsquedas innecesarias ofreciendo una previsión transparente. El siguiente paso es un piloto que mida error predictivo y tiempo real de búsqueda».