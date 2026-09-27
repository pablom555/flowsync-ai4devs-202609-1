# Comparación: con harness vs sin harness

Ticket: **FLOW-1 — Implementar login en el frontend** (Jira, único en "Por hacer" asignado a mí).
Mismo modelo (Sonnet), misma herramienta (Claude Code), mismo encargo en las dos copias.

## Archivos tocados

| | Con harness | Sin harness |
|---|---|---|
| **Archivos de código** | 26 (excluyendo `package-lock.json`) | 19 (excluyendo `package-lock.json`) |
| **Commits** | 2 (`feat(frontend): implementa login y registro con shadcn/ui`, `fix(frontend): evita rebote login/signup...`) | 0 — todo quedó sin commitear |
| **Rama** | `feat/flow-1-login-frontend` | Ninguna — trabajó directo sobre `s1/start` |
| **PR** | Abierto (#38) vía `gh pr create` | No aplica (sin rama, sin commit) |

## Convenciones respetadas / no respetadas

**Con harness (tenía `CLAUDE.md`/`AGENTS.md` con reglas escritas):**
- ✅ Exploró los validators reales del backend antes de asumir el contrato: descubrió que `signup` exige `passwordConfirmation` y admite `fullName`, ninguno mencionado en el ticket, y los incorporó.
- ✅ Validación de formularios con `zod` + `react-hook-form`, replicando exactamente las reglas del backend (incluye `.refine()` para `password === passwordConfirmation`).
- ✅ Distingue errores de campo (422, `fieldErrors` tipados) de error general (401) — UI muestra el mensaje correcto por campo.
- ✅ Creó la rama antes de tocar código, como pedía la regla de proceso.
- ✅ Abrió el PR con `gh pr create`.
- ❌ **La regla no escrita que se rompió sola:** al cerrar el trabajo, el propio agente rebaseó `feat/flow-1-login-frontend` contra `upstream/s1/start` en vez de mi `s1/start` local (que tenía los commits del harness). Resultado: `.claude/`, `CLAUDE.md`, `AGENTS.md` y `.mcp.json` **no son parte del PR #38 abierto** — el propio harness quedó fuera del PR que el harness generó.
- ❌ **No corrió el subagente `adversarial-reviewer`**, aunque la regla de `CLAUDE.md` lo pedía explícitamente ("usar el subagente adversarial-reviewer... antes de darlo por terminado"). Lo intentó, reportó que no estaba disponible en esa sesión, y ejecutó otra revisión en su lugar (probablemente un mecanismo propio de Claude Code). Causa raíz: `.claude/agents/adversarial-reviewer.md` tampoco era parte de la rama `feat/flow-1-login-frontend` — el mismo rebase que se llevó el resto del harness también se llevó la definición del subagente. No es un fallo aislado, es consecuencia directa del primer problema.

**Sin harness (sin ningún archivo de instrucciones — "esa es la respuesta y vale"):**
- No había ninguna convención escrita, así que no hay ninguna que "respetar" formalmente. Lo que se ve es lo que el modelo decide por defecto sin guía:
- ❌ No creó rama — todos los cambios quedaron directo sobre `s1/start`.
- ❌ No hizo commit ni abrió PR.
- ❌ Sin validación de formulario en cliente (ni `zod` ni chequeo manual antes de enviar): confía enteramente en el 422 del backend.
- ❌ Un solo mensaje de error genérico (`ApiError.message`), sin distinguir por campo.
- ✅ A pesar de que el *plan* no mencionaba `passwordConfirmation` ni `fullName` explícitamente, la *implementación* sí los incluyó correctamente en el formulario de registro — corrigió el hueco por su cuenta al tocar el código real, no se quedó con la lectura literal del ticket.

## Intervenciones

**Cero, en las dos copias.** Aprobaste el plan inicial y las dejaste correr solas hasta el final — sin corregir, aclarar ni repetir el encargo en ningún momento.

- Con harness: el error del rebase (harness fuera de la rama) lo detectó el propio agente y empezó a corregirlo sin que se lo pidieras — pero la falla de `adversarial-reviewer` **no la corrigió ni la señaló como incumplimiento de una regla explícita**: simplemente la sustituyó por otra revisión y siguió, sin que tú lo notaras hasta que revisamos el historial de git.

## Parte B

1. **Piezas montadas:** `CLAUDE.md` (generado por `/init` + reglas de proceso a mano), `AGENTS.md` (symlink), MCP de Jira (`--scope project`), las skills `priority-ticket` y `commit`, el subagente `adversarial-reviewer`, y el hook de formateo con Prettier sobre `frontend/src/**`. Lo que más tiempo se llevó no fue escribir ninguna de esas piezas — fue el propio harness rompiéndose solo al final: el rebase de la rama feature contra `upstream/s1/start` en vez de mi `s1/start` local se llevó `.claude/`, `CLAUDE.md`, `AGENTS.md` y `.mcp.json` fuera de la rama, y hubo que perseguir el porqué con `git reflog` y `git merge-base --is-ancestor` para entender qué había pasado.

2. **Primera diferencia:** no apareció en el código, apareció en el *plan* mismo, antes de aprobar nada. La copia con harness abrió los validators reales del backend y escribió explícitamente que `signup` exige `passwordConfirmation` y admite `fullName` — ninguno de los dos estaba en el ticket. La copia sin harness resumió el contrato de forma genérica (`signup → {user, token}`), sin mencionar esos campos. Me fijé comparando las dos secciones "Contexto"/"Contrato confirmado" de cada plan, lado a lado, antes de aprobar ninguno.

3. **Algo que no se cumplió:** la regla de `CLAUDE.md` dice, sin condicionales, "usar el subagente `adversarial-reviewer`... antes de darlo por terminado". No se ejecutó — el agente reportó que no estaba disponible en esa sesión y siguió con otra revisión en su lugar, sin marcarlo como un incumplimiento. La causa fue que el propio harness ya no estaba en la rama en ese punto (el mismo rebase del punto 1), así que la regla dependía de una condición que el propio flujo de cierre había roto un paso antes. Un archivo de instrucciones sube la probabilidad de que algo pase; no la garantiza, y verlo caer en cadena así fue la parte más útil del ejercicio.
