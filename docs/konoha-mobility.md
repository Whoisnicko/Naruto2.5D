# Mundo 3C.1 — Konoha Mobility

Base preview: `8b957833c7ba156d98d82ee7bdd97e3ed237d3c1`; main `0f2da406ef15447b7eb6112dc41cdebf98293163` ya contiene los tres commits web-shell, fullscreen/foco y HUD responsive. No cambiar main ni la campaña. Preview independiente con los 39 assets existentes, mismo plano y colisiones.

- Cámara cercana automática (24 unidades verticales; adaptada en pantalla vertical), sin zoom manual. Mirador con encuadre que muestra la montaña completa. Vista panorámica durante viaje rápido de 2.1 segundos de simulación, transición suavizada. Ocho destinos de prueba dentro de Konoha, todos desbloqueados temporalmente; descubrimiento persistente y viajes entre mapas reales pendientes de integración. M abre el selector; movimiento vuelve a exploración. No se toca localStorage ni guardados.
- Sprint desbloqueable de prueba: Shift más movimiento continuo durante 2.5 s; caminar 4.8, correr 8.4, sprint 16 u/s, aceleración de 0.45 s. Reinicia al detenerse, bloquearse, soltar Shift o viajar. Animación 1.55x, polvo con límite 100, líneas de velocidad discretas. Interruptor de laboratorio habilitado por defecto, no habilidad real del árbol todavía. Controles táctiles incluyen correr; fullscreen separado del laboratorio.
- QA Chromium, 1366×768 con fallback Canvas: 39/39 recursos, encuadre de los cuatro rostros, viaje a puerta/mirador, sprint 16 u/s y polvo, reset al soltar, sprint bloqueado, colisión, cero errores de página. WebGL, móvil, pantalla completa y despliegue Cloudflare no validados en esta revisión.

Preview: https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html
GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
PR borrador: https://github.com/Whoisnicko/Naruto2.5D/pull/34
Producción: https://naruto2-5d.pages.dev/
