# Mundo 3C.5 — Atmosphere
Base d0590426e38693208c6dc71e26586df68370c863. Usuario confirmó los seis puntos del hotfix 3C.4.1. Preview only, no cambios en main.
- Ciclo original de 360 segundos simulados (DAY_RATE / worldTime), con interpolación de amanecer, día, atardecer, noche y madrugada. Hora global compartida entre las tres regiones. Selectores de prueba hora/clima (modo fijo o automático); no altera misiones, economía, velocidad ni rutas.
- Despejado, lluvia, niebla, tormenta: tiempos del RPG original, transiciones suaves, gotas, neblina, destellos leves de tormenta, partículas ambientales. Efectos sobre canvas con límites de cantidad y menor movimiento si preferencia de accesibilidad está activa; HUD independiente.
- Luces cálidas por proyección en Konoha (9 puntos) y puesto (4), no luces en bosque; grading CSS de escena compatible con ambos backends. Sonido ambiental de viento/lluvia sintetizado por Web Audio, opt-in, sin música ni assets adicionales. No es iluminación volumétrica ni nuevo arte.
- 27 comprobaciones modelo/efectos simulados pasaron y sintaxis de app combinada. Navegador real, GPU, sonido real, móvil y despliegue pendientes. Builder actualizado, HTML autónomo no regenerado.
Preview esperada https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html?v=3c5
GitHub https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
Producción https://naruto2-5d.pages.dev/
