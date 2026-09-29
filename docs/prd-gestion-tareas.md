# PRD — Gestión de tareas (MVP)

**Producto:** FlowSync
**Estado:** borrador para validar con el equipo. **Bloqueado para implementar** hasta resolver I1 (el backend actual no tiene tareas ni listado de usuarios) y S2 (registro abierto); ver §8.
**Alcance de este documento:** primer MVP entregable de la épica de gestión de tareas

---

## 1. Problema

Un equipo chico no tiene un lugar único donde ver todo lo que hay que hacer. Como consecuencia:

- **No se distingue rápido el estado de cada tarea.** Hay que preguntar o revisar varios sitios para saber qué está pendiente, en curso o terminado.
- **Los cambios no quedan reflejados.** Cuando una tarea avanza, esa información se queda en la cabeza de quien la trabaja o se pierde entre mensajes.
- **No se sabe qué hace cada persona.** No queda claro quién tiene qué tarea, así que se duplica trabajo o los bloqueos se descubren tarde.
- **No se ve el avance.** Ni cada miembro ni el equipo pueden saber cuánto falta.

**Necesidad:** que cualquier miembro del equipo pueda ver, de un vistazo y sin preguntar, qué tareas existen, en qué estado están y quién trabaja en cada una, y que esa información se mantenga al día a medida que el trabajo progresa.

> Nota: en este MVP "avance" se reduce al estado de la tarea (pendiente / en curso / terminada). Ver §8, supuesto S3.

## 2. Usuarios

**Usuario del MVP:** los miembros de un único equipo, entendido como todo usuario registrado en FlowSync. El acceso es plano: no hay roles y quien lidera el equipo es un miembro más.

**Quién queda fuera del MVP**

| Perfil | Por qué queda fuera |
|---|---|
| Stakeholders externos (clientes, dirección) | Necesitan ver avance sin ser parte del equipo; requiere un modelo de acceso distinto. |
| Quien coordina y necesita visión agregada (carga por persona, cuellos de botella) | Se decidió que el líder es un miembro más. Esa vista agregada roza el principio de producto (§3). |
| Varios equipos o equipos grandes con dependencias | El problema cambia de escala; no hay multi-equipo. |
| Quien planifica a largo plazo (roadmaps, estimaciones, fechas) | El MVP cubre el estado presente, no la planificación. |
| Quien necesita medir productividad o auditar personas | Contradice el principio de producto. |
| Quien trabaja de forma asíncrona o en otra zona horaria y necesita enterarse de cambios | No hay tiempo real ni notificaciones; solo ve el estado al entrar. |

## 3. Principio de producto

**La visibilidad es para colaborar, no para vigilar.** Consecuencias directas:

- No hay métricas de "quién está atrasado", rankings ni productividad por persona.
- Las métricas de éxito del propio MVP se miden a nivel de equipo (§7).

## 4. Alcance (MoSCoW)

| Ítem | Categoría |
|---|---|
| Crear una tarea | **Must** |
| Ver todas las tareas del equipo en un mismo lugar | **Must** |
| Cambiar el estado de una tarea (pendiente / en curso / terminada) | **Must** |
| Asignar una tarea a un miembro | **Must** |
| Editar una tarea | **Should** |
| Archivar y restaurar una tarea | **Should** |
| Comentar en una tarea | **Won't** (reevaluable) |
| Fecha de vencimiento de una tarea, con indicador de "vencida" visible para todos | **Must** (revisado: antes Won't) |
| Agregados de vencidas por persona (conteos, rankings, listados de "atrasados") | **Won't** |
| Roles y permisos avanzados | **Won't** |
| Notificaciones / integración con Slack | **Won't** |
| Multi-equipo | **Won't** |
| Actualización en tiempo real | **Won't** |

**Relación entre categorías y entrega:** el MVP mínimo son los Must. Los Should entran si hay capacidad y, si no entran, se entregan en la iteración siguiente. Los requisitos de §5 marcan a qué categoría pertenece cada uno.

### Justificación de lo que queda fuera

- **Comentarios (Won't, reevaluable).** El problema es ver estado y responsable, no conversar. Los comentarios traen costo propio (notificaciones, edición, hilos, menciones). Sube a Should si, tras usar el MVP, el equipo sigue preguntando en el chat cosas como "¿por qué está bloqueada?".
- **Fecha límite: revisada, ya no es Won't.** Pasa a Must; ver «Revisión sobre la versión anterior» más abajo y §6, decisión 6.
- **Roles y permisos avanzados (Won't).** El acceso plano es una decisión de producto para el MVP; los roles añaden complejidad sin resolver el problema declarado.
- **Notificaciones / Slack (Won't).** Son una segunda superficie de comunicación. El MVP resuelve el "lugar único"; avisar es otro problema.
- **Multi-equipo (Won't).** Exige un modelo de equipo y pertenencia que no existe. El MVP asume un único equipo global.
- **Agregados de vencidas por persona (Won't).** Contar, listar u ordenar personas por tareas vencidas es exactamente la métrica "quién está atrasado" que el principio de §3 descarta. Se mantiene fuera aunque la fecha de vencimiento entre al MVP.

### Revisión sobre la versión anterior: fecha de vencimiento

**Esto es una revisión explícita de la versión anterior del PRD (PR #1), no un cambio silencioso.** La versión anterior clasificaba "Fecha límite" como Won't con esta justificación: *"La necesidad es el presente, no la planificación. Además arrastra vencidos, recordatorios y ordenación, y es la puerta directa a la métrica 'quién está atrasado', que el principio de producto descarta."*

**Decisión nueva:** la fecha de vencimiento pasa a **Must**.

**Nueva justificación:** el riesgo que motivó el Won't no era la fecha, sino su agregación por persona. Una tarea puede mostrar si está vencida como un dato de la propia tarea, visible para todos, y eso ayuda a colaborar: cualquiera puede ver qué necesita atención sin preguntar. El tablero **nunca** cuenta, lista ni ordena personas por tareas vencidas; eso sigue siendo Won't y protege el principio de §3.

**Qué sigue fuera:** los recordatorios y avisos de vencimiento siguen dentro de "Notificaciones / Slack" (Won't). La justificación anterior también mencionaba la ordenación; esta revisión no la decide (ver §6, decisión 6).
- **Tiempo real (Won't).** Los cambios son visibles al recargar o volver a entrar. Sale del alcance por costo; su efecto sobre el problema se discute en §8, supuesto S6.

## 5. Requisitos funcionales

Cada requisito indica su categoría entre corchetes. RF-5, RF-10 y RF-14 aún no tienen criterio de aceptación testable (ver I9 e I10 en §8).

### Crear tarea
- **RF-1** [Must]. Cualquier usuario registrado puede crear una tarea indicando un título.
- **RF-2** [Must]. El título es obligatorio (no vacío ni solo espacios) y admite hasta 120 caracteres. Si no cumple, la tarea no se crea y se informa el motivo.
- **RF-3** [Must]. La descripción es opcional. Crear una tarea sin ella funciona igualmente.
- **RF-4** [Must]. Toda tarea nueva nace en estado "pendiente" y sin asignar, salvo que se elija un responsable al crearla.
- **RF-5** [Must]. Tras crearla, la tarea aparece en el tablero para todos los miembros sin acciones extra por su parte, más allá de recargar o volver a entrar.

### Ver tareas
- **RF-6** [Must]. Cualquier usuario registrado ve todas las tareas activas del equipo, no solo las propias.
- **RF-7** [Must]. Las tareas se muestran agrupadas por estado (pendiente / en curso / terminada); cada una es identificable por su grupo sin abrirla.
- **RF-8** [Must]. Cada tarea del listado muestra título, estado y responsable (o "sin asignar").
- **RF-9** [Must]. Un usuario sin sesión no puede ver ninguna tarea.
- **RF-10** [Must]. El tablero no muestra métricas comparativas por persona (conteo de atrasadas, rankings, productividad). Solo estado y responsable de cada tarea.

### Cambiar estado
- **RF-11** [Must]. Cualquier miembro puede cambiar el estado de cualquier tarea, esté o no asignada a él.
- **RF-12** [Must]. Los estados válidos son únicamente pendiente, en curso y terminada. Cualquier otro valor se rechaza.
- **RF-13** [Must]. Se permite pasar de cualquier estado a cualquier otro, incluida la reapertura de una terminada. No hay flujo obligatorio.
- **RF-14** [Must]. El cambio de estado se conserva: al recargar o al entrar otro miembro, la tarea aparece en el nuevo estado.

### Asignar
- **RF-15** [Must]. Una tarea puede asignarse a exactamente un miembro, elegido entre los usuarios registrados en FlowSync.
- **RF-16** [Must]. Cualquier miembro puede asignar o reasignar cualquier tarea, incluida a sí mismo.
- **RF-17** [Must]. Una tarea puede quedar sin asignar (al crearla o quitando el responsable).
- **RF-18** [Must]. Solo se puede asignar a un usuario existente. Un identificador inexistente se rechaza y la asignación previa se mantiene.
- **RF-19** [Must]. Todos los miembros ven quién es el responsable actual de cada tarea (ver RF-8).

### Editar tarea
- **RF-20** [Should]. Cualquier miembro puede modificar el título y la descripción de una tarea existente.
- **RF-21** [Should]. Las validaciones de título de RF-2 se aplican también al editar. Si fallan, se conserva el valor anterior.
- **RF-22** [Should]. Editar no altera el estado ni el responsable, salvo cambio explícito por RF-11 o RF-16.

### Archivar y restaurar
- **RF-23** [Should]. Cualquier miembro puede archivar una tarea. Una tarea archivada deja de aparecer en el tablero activo para todos.
- **RF-24** [Should]. Antes de archivar se pide una confirmación explícita.
- **RF-25** [Should]. Una tarea archivada se puede restaurar. Al restaurarla vuelve al tablero con el estado y responsable que tenía.

### Transversal
- **RF-26** [Must]. Todas las acciones anteriores requieren sesión iniciada. Sin sesión se rechazan.

## 6. Decisiones de producto tomadas

1. **Archivar en lugar de borrar.** Es reversible y encaja con el enfoque de colaboración. Si se prefiere borrado definitivo, RF-25 desaparece y RF-24 se vuelve más crítico.
2. **Un solo responsable por tarea** (RF-15).
3. **Permisos totalmente planos** (RF-11, RF-16, RF-20, RF-23): cualquiera puede tocar cualquier tarea, incluida archivarla.
4. **Sin tiempo real**: los cambios se ven al recargar o reingresar (RF-5, RF-14).
5. **Límite de 120 caracteres en el título**: valor elegido para que RF-2 sea testable, sin evidencia de uso que lo respalde.
6. **Fecha de vencimiento en el MVP (revisión de la versión anterior, ver §4).** Reabre la decisión original de dejarla como Won't.
   - **Regla:** una tarea puede tener fecha de vencimiento y mostrar si está vencida, visible para todos los miembros. El tablero nunca agrega, cuenta ni lista "vencidas por persona" (Won't).
   - **Propuesta a validar:** la separación entre dato de la tarea y agregado por persona es suficiente para preservar §3. No hay evidencia de que el equipo lo perciba así; el guardrail de §7 es el que lo comprobaría.
   - **Pendiente de definir:** si una tarea terminada con fecha pasada cuenta como vencida, la zona horaria de la fecha si se permite editar o quitar la fecha y si las tareas se ordenan por fecha (mientras no se decida, no se ordenan).
   - **Fuera de esta revisión (no actualizado a propósito):** §5 no incluye aún requisitos funcionales para la fecha, y §7 y §8 no reflejan el cambio. Quedan desactualizados hasta una revisión posterior: §5 no cubre la fecha, y §8 (S2, I5 y el resto del análisis) fue escrito con la fecha en Won't.

## 7. Métricas de éxito

Se miden a nivel de **equipo**, nunca por persona. En un equipo chico los números son pequeños y buena parte se mide con revisión manual o en la retro. Los umbrales son propuestas: hay que calibrarlos contra una **línea base tomada antes del lanzamiento**; sin ella ninguna métrica prueba nada.

| # | Métrica | Problema que valida | Cómo se mide | Meta propuesta |
|---|---|---|---|---|
| M1 | **Fiabilidad del estado:** % de tareas cuyo estado en el tablero coincide con la realidad | La información queda en la cabeza de cada uno | Cada semana se toman 5 tareas al azar y su responsable confirma si el estado es correcto | ≥ 90 % durante 3 semanas seguidas |
| M2 | **Preguntas de estado en el chat:** mensajes tipo "¿cómo va X?" o "¿quién tiene Y?" | La información se pierde entre mensajes | Conteo manual semanal en el canal del equipo, comparado con la línea base | Reducción ≥ 50 % a las 4 semanas |
| M3 | **Cobertura de responsable:** % de tareas activas con responsable | No sabemos qué hace cada uno | Cálculo directo sobre el tablero | ≥ 90 % |
| M4 | **Tiempo para responder "¿quién hace qué y en qué estado está?"** | Ver de un vistazo, sin preguntar | Prueba con 3 o 4 miembros: 3 consultas concretas cronometradas, comparadas con hacerlo sin el tablero | < 30 s por consulta, sin preguntar a nadie |
| M5 | **Incidentes de descoordinación:** trabajo duplicado o bloqueos descubiertos tarde | El costo real del problema original | Se pregunta en la retro semanal y se registra el número | Tendencia a la baja frente a la línea base |
| M6 | **Tablero como fuente única:** % de trabajo que el equipo reconoce que no pasó por el tablero | Un lugar único | Pregunta fija en la retro | ≤ 10 % |

**Condición previa (no es éxito):** al menos el 80 % del equipo ha cambiado un estado alguna vez en la semana. Es actividad, no prueba éxito; solo indica si M1 a M6 tienen sentido.

**Guardrail — percepción de vigilancia.** Pregunta en la retro: "¿sientes que el tablero se usa para controlarte?". Si más de una persona responde que sí, el MVP falla aunque M1 a M6 estén en verde.

**Criterio de decisión:** el MVP se da por validado si M1, M2 y M3 alcanzan la meta y el guardrail está limpio tras 4 semanas de uso. M4 a M6 aportan contexto.

---

## 8. Revisión crítica del PRD

Esta sección es una auditoría del propio documento. Los ítems están ordenados por gravedad dentro de cada bloque.

### 8.1 Supuestos dados por ciertos sin evidencia

- **S1. El problema existe tal como está descrito.** Todo §1 parte de una descripción del dolor sin observación del equipo real: nadie ha medido cuánto tiempo se pierde, cuántas veces se duplicó trabajo ni cómo se coordinan hoy. Sin línea base (M2, M4, M5), el PRD es una hipótesis presentada como diagnóstico.
- **S2. "Todo usuario registrado" equivale a "el equipo".** El registro está abierto (`POST /auth/signup` no exige autenticación), así que cualquier persona que conozca la URL se registra y ve, edita y archiva todas las tareas. RF-6, RF-9 y RF-26 solo exigen sesión, no pertenencia al equipo. Es un hueco de seguridad y de privacidad, no un detalle de alcance.
- **S3. Tres estados bastan para representar el "avance".** El problema original pedía "el avance de la tarea". Se redujo a pendiente / en curso / terminada sin comprobar que eso satisface la necesidad. "En curso" puede significar desde "abrí el archivo" hasta "falta revisar", y el tablero no distinguirá esos casos.
- **S4. Un líder que es un miembro más no tiene necesidades distintas.** Es una decisión de producto, pero se tomó sin hablar con nadie que lidere un equipo. Si el líder necesita una vista agregada, el equipo terminará construyéndola por fuera del tablero y M6 fallará.
- **S5. La confianza total entre miembros.** Permisos planos implican que cualquiera archiva o reasigna la tarea de otro. Se asume que nadie lo hará por error o mala intención y que no hace falta saber quién hizo un cambio.
- **S6. Un refresco manual es suficiente.** Sin tiempo real ni notificaciones, el tablero mostrará estados viejos hasta que alguien recargue. Eso ataca directamente a M1 (fiabilidad del estado) y a M2 (preguntas en el chat): si el tablero puede estar desactualizado, la gente volverá a preguntar. El PRD declara el tiempo real como Won't sin evaluar ese efecto.
- **S7. Los miembros mantendrán el tablero al día.** Todo el valor depende de que cada persona actualice el estado. No hay ningún mecanismo ni requisito que incentive hacerlo; el PRD confía en la disciplina del equipo.
- **S8. Todos los números son inventados.** Los 120 caracteres, el 90 %, el 50 %, los 30 segundos, el 80 % y las 4 semanas no tienen respaldo empírico. Con un equipo de pocas personas, 4 semanas producen muestras tan pequeñas que una sola persona mueve cualquier porcentaje.
- **S9. Las métricas se pueden medir sin costo ni distorsión.** M2 exige leer el canal del equipo y contar mensajes a mano; M1 y M4 exigen tiempo de personas concretas. La medición puede pesar más que el problema que se quiere resolver.

### 8.2 Inconsistencias y huecos entre secciones

- **I1. El backend actual no cubre el MVP.** Según la documentación del repositorio, la API solo expone autenticación y perfil (`/auth/signup`, `/auth/login`, `/account/profile`, `/account/logout`) y el backend no se debe modificar en este ejercicio. No existen endpoints de tareas ni de listado de usuarios, y RF-15 exige poder elegir entre los usuarios registrados. El PRD describe un producto que hoy no se puede construir bajo la restricción vigente. Hay que resolver esta contradicción antes de estimar.
- **I2. Se puede restaurar lo que no se puede ver.** RF-25 exige restaurar tareas archivadas, pero ningún requisito define cómo se listan o se encuentran las archivadas. Sin eso, la restauración es inalcanzable.
- **I3. Las métricas contradicen el principio de producto.** La condición previa ("80 % del equipo ha cambiado un estado") es, en la práctica, actividad por persona. M3 empuja a asignar tareas para cumplir el 90 %, lo que puede leerse como presión. Se declara que las métricas son de equipo, pero no se define cómo calcular actividad "del equipo" sin mirar a individuos.
- **I4. El guardrail no es anónimo en un equipo chico.** La regla "más de una persona responde que sí" supone anonimato. Con cuatro o cinco miembros, es fácil deducir quién respondió, lo que invalida la honestidad que la pregunta necesita.
- **I5. M3 choca con RF-4 y RF-17.** Se permite explícitamente dejar tareas sin asignar, pero se exige que el 90 % lo tengan. Hay que decidir si "sin asignar" es un estado legítimo (una bandeja de entrada) o un defecto.
- **I6. M1 no se puede aplicar a tareas sin responsable.** El método de medición pide que el responsable confirme el estado; una tarea sin asignar no tiene a quién preguntar. Además, quien confirma es el mismo que la actualiza, lo que sesga el resultado.
- **I7. Las categorías MoSCoW y las métricas no coinciden.** Editar y archivar son Should, pero el §7 mide el MVP como un todo. No queda claro si un MVP sin Should puede cumplir M1 (sin editar no se corrigen errores) ni qué ocurre si los Should se difieren.
- **I8. Falta definir los conflictos de concurrencia.** Dos miembros pueden cambiar la misma tarea a la vez. No hay ningún requisito sobre qué gana, y con refresco manual (S6) el caso es probable.
- **I9. RF-10 no es verificable tal como está.** "Métricas comparativas por persona" es una negación abierta: no hay forma de probar que nunca aparecerá una. Necesita una lista cerrada de lo que el tablero puede mostrar.
- **I10. RF-5 y RF-14 son ambiguos.** "Aparece... más allá de recargar o volver a entrar" no define cuánto tiempo puede pasar ni qué recarga es aceptable. No son testables tal como están redactados.
- **I11. No hay requisitos no funcionales.** Faltan rendimiento con N tareas, uso en móvil, accesibilidad, retención de datos y manejo de errores de red. Se pidió solo funcionales, pero un PRD para entregar no puede omitirlos sin declararlo.

### 8.3 Scope no justificado que se coló

- **C1. Comentarios como "Could".** En la primera clasificación se dejaron como Could pese a que el propio criterio era desconfiar de esa categoría. Después pasaron a no-alcance con razón; el episodio muestra la tendencia a conservar lo que "sería lindo".
- **C2. Restaurar (RF-25).** El alcance original hablaba de "editar/borrar"; la restauración se añadió para justificar archivar en lugar de borrar. Es una funcionalidad nueva con su propia pantalla (I2) que nadie pidió.
- **C3. Confirmación antes de archivar (RF-24).** Si archivar es reversible (RF-25), la confirmación es una segunda protección contra el mismo riesgo. Es un detalle de interfaz elevado a requisito funcional sin justificar.
- **C4. Descripción de la tarea (RF-3, RF-20).** El alcance original hablaba de crear y editar tareas, no de un campo de descripción. Se añadió por defecto. Si el problema es estado y responsable, un título alcanza para el MVP.
- **C5. Elegir responsable al crear (RF-4).** Fusiona crear y asignar. Es cómodo, pero duplica el camino de asignación y multiplica los casos de prueba.
- **C6. Transiciones libres con reapertura (RF-13).** Permitir cualquier salto y reabrir tareas terminadas se decidió por "colaboración", sin evidencia de que el equipo lo necesite. Es una regla de negocio invisible.
- **C7. Requisitos que son consecuencias de otros.** RF-9 y RF-26 se solapan; RF-19 repite RF-8; RF-22 solo aclara lo que RF-11 y RF-16 ya implican. Inflan el número de requisitos sin añadir comportamiento verificable distinto.
- **C8. Cuatro métricas de contexto (M4, M5, M6 y la condición previa).** Solo M1, M2, M3 y el guardrail entran en el criterio de decisión. Las demás cuestan trabajo de medición y no cambian ninguna decisión, así que son candidatas a eliminarse.

### 8.4 Qué haría antes de dar por buena esta versión

1. Resolver I1 (backend) y S2 (acceso abierto): son los dos que pueden invalidar el MVP entero.
2. Tomar la línea base de M2, M4 y M5 antes de escribir código.
3. Cerrar I2 (vista de archivadas) o quitar RF-25 y RF-24.
4. Recortar C3 a C5 y C7, y decidir de forma explícita si "sin asignar" es legítimo (I5).
5. Reescribir RF-5, RF-10 y RF-14 con criterios de aceptación concretos.
