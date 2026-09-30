# Alcance MVP — FlowSync (prm)

## 1. Terreno que ya existe

Hoy el proyecto solo tiene autenticación: registro, login con token de acceso, perfil y logout, con sus pantallas correspondientes en el frontend (login/registro, rutas protegidas y públicas, sesión rehidratada contra el perfil). El modelo de datos son dos tablas: usuarios (con email único y password) y los tokens de acceso ligados a cada usuario. No existe nada de tareas, equipos, proyectos ni membresías, ni tests todavía.

## 2. Interrogatorio

Una ronda de 5 preguntas, respondidas con la ficha de hechos. Lo que la ficha no cubre queda marcado como [Supuesto].

**1. ¿Qué dolor concreto resolvemos y a quién le duele?**
La ronda de "¿en qué estás?" de la daily y las interrupciones por Slack. Le duele a los pares, no a un lead. Episodio de referencia: dos personas tocaron el mismo módulo la misma semana sin saberlo y perdieron dos días.

**2. ¿Qué significa "tiempo real" y qué decisión cambia?**
Ver los cambios de estado de las tareas sin refrescar ni preguntar. No es chat, ni presencia, ni edición simultánea. El estado es de la tarea, no de la persona. La decisión que cambia: no empezar algo que otro ya tiene, y elegir lo siguiente sabiendo qué está libre. Se consume como resumen que espera, sin push.
- [Supuesto] Para "ver qué se ha movido" al volver de una reunión hace falta alguna señal visible de lo reciente. La ficha no dice cuál; se decide al especificar.

**3. ¿Quién mantiene el estado al día y por qué lo haría?**
Lo teclea quien hace la tarea, en dos clics y sin campos obligatorios. Cobra en el momento: la lista es su propia cola de trabajo y deja de recibir interrupciones. Si el estado se queda viejo, el producto pierde el sentido — es el riesgo #1 a validar, y la mitigación es que actualizar cueste poco.

**4. ¿Quién es el usuario y cuál es la frontera del alcance?**
Equipos remotos de 3–10 personas, roles planos: todos ven y editan lo mismo. Caso de estudio: equipo de 6 personas en 3 husos horarios, no un cliente real. Espacio único, sin entidad "equipo". FlowSync sustituye al gestor de tareas, no convive con él. Una tarea lleva título, responsable, estado y vencimiento; la lista se filtra por estado. Fuera: sprints, estimaciones, épicas, backlog, informes, push, Slack, permisos avanzados, analítica, comentarios.
- [Supuesto] Cualquier usuario registrado entra directamente al espacio único, sin invitación ni aprobación (no hay entidad equipo).
- [Supuesto] Varios equipos, o gente en más de uno, queda anotado como fuera de alcance, no construido.

**5. ¿Cómo sabremos que funcionó y cuánto construimos?**
A una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva. Si la siguen haciendo igual, no funcionó. La daily no desaparece entera — la parte de bloqueos sigue, y este MVP no la resuelve. Se construye una vertical fina de punta a punta: mejor una capability terminada que tres a medias.
- [Supuesto] No hay medición automática; el criterio de éxito se comprueba observando al equipo, porque analítica y reporting están fuera.

## 3. Alcance en cinco bloques

### Problema

Los equipos remotos pequeños no saben en qué trabaja cada uno sin interrumpir a alguien. Hoy lo resuelven con la ronda de "¿en qué estás?" de la daily y con preguntas sueltas por Slack. El coste real es el trabajo duplicado: dos personas tocaron el mismo módulo la misma semana y perdieron dos días.

### Usuarios

- Equipos remotos de 3–10 personas con roles planos: todos ven y editan lo mismo.
- Quien cobra el valor son los pares, no un lead.
- Caso de estudio: equipo de producto SaaS de 6 personas en 3 husos horarios. No es un cliente real.

### Propuesta de valor

Una lista compartida de tareas que es a la vez la cola de trabajo de cada persona y el estado del equipo. Actualizarla cuesta dos clics. Quien la actualiza cobra en el momento, porque deja de recibir interrupciones. Los demás ven lo que se ha movido sin refrescar ni preguntar, y deciden qué coger sabiendo qué está libre.

### Alcance

Una sola vertical, de punta a punta:
- Espacio único compartido. Cualquier usuario registrado entra y ve las mismas tareas (supuesto ya marcado).
- Crear y actualizar tareas en segundos. Cada tarea tiene título, responsable, estado y vencimiento, sin campos obligatorios ni configuración.
- Filtrar por estado para centrarse en lo pendiente, con lo vencido visible de un vistazo.
- Cambios visibles sin refrescar. Es el "tiempo real" del MVP: se ve lo que se ha movido, pero sin push.
- Criterio de éxito: a una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva.

### NO-alcance

Cada exclusión se justifica por la hipótesis que no ayudaría a validar.

- **Notificaciones push.** La hipótesis es que un resumen que espera basta para no duplicar trabajo. Un push la contradice: reintroduce la interrupción que queremos quitar.
- **Integración con Slack.** No valida que el equipo mantenga el estado al día; solo mueve el aviso a otro canal y añade dependencia de terceros.
- **Derivar estado de Git, PRs, CI o calendario.** Es otro producto, con OAuth e integraciones. Nuestra hipótesis depende de que el estado lo teclee quien hace la tarea.
- **Roles y permisos avanzados.** Con 3–10 personas de confianza no hay hipótesis de permisos que probar; solo añadirían fricción.
- **Varios equipos, o gente en más de uno.** Complica el modelo de espacio sin ayudar a probar si un solo equipo abandona la ronda.
- **Comentarios en tareas.** Convierten la herramienta en chat, que rechazamos. La hipótesis trata de estado, no de conversación.
- **Analítica y reporting.** Nadie los pide y a un manager le daría igual; lo único que hay que medir es si cancelan la ronda, y eso se observa hablando con el equipo.
- **Presencia ("quién está conectado").** Es vigilancia, y la rechazamos a propósito. El estado es de la tarea, no de la persona.
- **Sprints, estimaciones, épicas y backlog priorizado.** Un equipo que necesite eso no es nuestro usuario; no ayudan a validar el ahorro de la ronda y llevan de vuelta al peso de Jira.
- **Convivir con otro gestor de tareas (importar o sincronizar).** Obligaría a actualizar dos veces, y así muere esta categoría. La hipótesis exige sustituir, no convivir.
- **Resolver los bloqueos de la daily.** Esa parte de la daily sigue; el MVP no la ataca. Es otra hipótesis distinta.

**Riesgo #1 a validar:** si el estado se queda viejo, el producto pierde el sentido. La mitigación es que actualizar cueste dos clics, y no obligar a nadie a hacerlo.

---

## Las tres líneas

1. **Los dos números:** propuestas por la IA: 5 · quedaron tras el recorte: 5 (no se cortó nada — el alcance propuesto trazaba 1:1 con la ficha de hechos, sin inventar de más).

2. **Tres cosas fuera, y por qué:**
   - **Notificaciones push** — un resumen que espera basta; un push reintroduce la interrupción que el MVP quiere sacar.
   - **Comentarios en tareas** — convierte la herramienta en chat; la hipótesis es sobre estado, no conversación.
   - **Presencia ("quién está conectado")** — es vigilancia; el estado es de la tarea, no de la persona.

3. **La exclusión de la que menos seguro estoy:** convivir con otro gestor de tareas (sin importar/sincronizar). Un equipo real ya tiene su historial en Jira o similar; pedirle que empiece de cero es una barrera de adopción real, contra el riesgo de duplicar mantenimiento que se quiso evitar. **Qué tendría que pasar para que entrara:** que el caso de estudio (o un equipo real) mostrara que el obstáculo de adopción real no es "crear tareas cuesta dos clics" sino "abandonar el historial acumulado" — ahí una importación de una sola vez (no sincronización continua) resolvería la adopción sin traer de vuelta el doble mantenimiento.
