# Mundo 3C.6.6 — Hades Game Feel & FPS
Base: 400c583ae51914b841cfbae407d5c50c05aee287. Fecha: 26/11/2026.

## Playtest acumulado
Usuario conserva 11 aprobaciones de 3C.6.3 y confirma 17 adicionales en 3C.6.5: arranque/control, eliminación barra superior, animación sin congelamiento, pausa, minimapa visible, ataques y técnicas desde inicio, tres objetivos de práctica, cinco renegados antes de misión, enemigos fronterizos, legibilidad HUD, barras sincronizadas, inventario, equipar/desequipar, clones, Kawarimi/esquiva/bloqueo y sonidos. Total 28 puntos históricos aprobados; 40 de los 57 puntos de 3C.6.5 quedan sin validar, no se clasifican como bugs. El usuario reporta pérdida de game feel del overhaul Hades y solicita contador FPS.

## Cambios
- Adaptador ilustrado recupera parámetros originales COMBAT.fluid/Hades: buffer de acciones de .22 s, dash .16 s, encadenamiento al final de animación, aceleración, recuperación con movilidad, asistencia direccional y aproximación corta de melee. Ataque durante dash con pose propia; una vez por dash. Costes/cooldowns conservados; no se resetean por buffer.
- Rasengan pasa de salto de posición instantáneo a desplazamiento progresivo con velocidad, distancia y contacto originales, detención por colisión, fase de recuperación, escala de carga y rastro. Giant incluye daño de área simplificado. No se promete equivalencia exacta de técnicas especiales, Kyubi multietapa ni jefes.
- Impactos reutilizan CONTACT_FEEL original: hitstop breve, vibración/zoom sutil de cámara, chispas, feedback por tipo de contacto. Animaciones de ataque ligadas al avance de acción. Bonos de movimiento de personaje/equipo. Velocidades base/sprint y reglas de viaje conservadas.
- Contador FPS discreto, sin reintroducir barra superior. Esc > Rendimiento y movimiento: presets, límites 60/120/144/sin límite, resolución adaptativa, intensidad cámara y opción ocultar FPS. Reutiliza performance-core.js para medir intervalos de render, p95, CPU, escala y draw calls. Preferencias locales separadas del save. FPS real depende del hardware; no se promete 60/144. No se modifican arenas ni contenidos de historia.

## QA
21/21 comprobaciones de lógica con módulos reales: ataques, buffer y tres golpes, dash direccional y ataque en dash, Rasengan continuo y contacto/colisión, impactos, recuperación, limpiar buffer, telemetría/adaptación y sprint. 7/7 pruebas adicionales del tick/frame reales con DOM/canvas/renderizador/reloj simulados, 155 fotogramas activos, hitstop sin parar render, pausa/reanudación y aislamiento HUD. Prueba adicional del limitador: 240 callbacks simulados a 120Hz -> 120 renders a 60 FPS. Total 29/29 comprobaciones. Sintaxis JS y 145 IDs únicos sin referencias estáticas faltantes. Sin ejecución de navegador/GPU o verificación Cloudflare, sin métricas reales del equipo del jugador. Main intacto. HTML offline no regenerado.

## Playtest
Revisar primero aceleración, combo con buffer, dash strike, recuperación, Rasengan progresivo y colisiones, hitstop/vibración/chispas, lectura FPS, configuración Esc, rendimiento real. Repetir selectivamente combate/cambio de región y técnicas previamente aprobadas por impacto del refactor; conservar aprobaciones históricas. Incluir los 40 puntos pendientes. Próxima integración pendiente: interiores, eventos, equivalencia avanzada y arenas/cinemáticas ilustradas.

Preview https://preview-konoha-world3c.naruto2-5d.pages.dev/?v=3c66
GitHub https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
