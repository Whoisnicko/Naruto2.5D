# Mundo 3C.6.8 — Recuperación del mapa y separación de responsabilidades
26/11/2026. Rechazada 3C.6.7: reemplazaba el layout ilustrado aprobado por coordenadas del mapa clásico. Se revierte esa decisión; no se intenta rediseñar, fusionar o reescalar los mapas.

## Fuente de verdad
- Mundo 3C aprobado: 8b957833c7ba156d98d82ee7bdd97e3ed237d3c1. Layout de Konoha 144x84, plaza (72,43), edificios, caminos, río, tres puentes, monte, puerta y murallas. El layout y los datos de arte tienen exactamente los mismos blobs que esa versión. Medallón WebP original (86cbb6a72ef200b4f5be845980cbf9b56a5103fa) también intacto.
- Base funcional anterior a la unificación: 46dc3a9380054219acda7b8d83963089387a98de (3C.6.6). Se preserva HUD limpio, regiones, movimiento, combate, FPS y servicios tal como estaban. No se afirma paridad de combate con el motor clásico.
- 3C.6.7 conservada en su commit histórico y rama feature/world3c-single-engine, no activa. Se elimina illustrated-skin.js de la nueva rama y se restaura el arranque de campaña de 3C.6.6 (sólo cambia versión del URL).

## Separación aplicada
src/konoha-scene.js: construcción de terreno, edificios, decoración, sombras, medallón y visibilidad por región, extraída de konoha-three-lab.js. No importa el motor clásico, combate, RPG, inventario ni guardado.
src/konoha-layout.js y konoha-three-data.js: geometría, colisiones y placements aprobados, sin edición.
src/konoha-regions.js: regiones y conexión, sin edición.
src/konoha-three-lab.js: orquestación de escena, cámara, actores, input, UI, combate; queda pendiente extraer sus responsabilidades restantes en módulos dedicados, sin modificar gameplay incidentalmente.
src/konoha-combat.js / combat-data.js / character-data.js / enemy-ai.js: lógica y datos de combate; sin cambios en esta corrección.
src/konoha-services.js / rpg-data.js / world-data.js: progreso, inventario y reglas de mundo, sin cambios.
src/game.js y bridge: motor original y campaña histórica como referencia y soporte actual de encuentros; la transición vigente del 3C.6.6 se conserva por ahora. No es una migración completa.
El medallón real usa radio original 3.6 y centro (72,43); se incorpora como malla de suelo dedicada a altura .11, con prioridad de dibujo y polygon offset. Fallback si falta textura: símbolo simplificado en Canvas o círculo sólido. No se confirmó la causa exacta de su ausencia anterior en GPU. No se crean otros gráficos ni geometría.

## QA
10/10 pruebas con Three.js r169 real (geometría, sin render GPU): 324 mallas estáticas no correspondientes al medallón y 164 placements de billboards iguales a 3C.6.6; 39 nombres de assets, radio/posición/textura del medallón, visibilidad al cambiar de región, fallback de assets, dimensiones/colisión de plaza, ausencia de dependencias de gameplay en escena. Se comprobó sintaxis. Comparación GitHub con 3C.6.6 confirma que mapa, datos y lógica de combate no cambiaron. Se añade guardia reproducible docs/test-map-contract.py para fijar blobs de layout, arte, regiones, escena y emblema más ruta de campaña. El guardia se entregó pero no fue ejecutado en checkout local. HTML offline no regenerado; builder actualizado para incluir módulo, no validado integralmente. No se comprobó navegador/GPU ni Cloudflare. Main intacto.
## Orden acordado
1. Restaurar y validar estética del mapa nuevo, sin map merge.
2. Migrar UI/HUD/UX al mapa aprobado y comprobar.
3. Migrar por sistemas técnicas, habilidades, combate, mecánicas y progreso del original; extraer lógica común independiente del mapa con pruebas de paridad. No cambiar coordenadas ni reconstruir arte para corregir combate.
4. Jefes y cinemáticas, estabilidad y optimización.
Conservar las 28 aprobaciones históricas, pendientes acumulados de 3C.6.6/3C.6.7 sin marcar como aprobados. Primera verificación corta: plaza/medallón, arquitectura y vegetación, mirador, HUD, movimiento y viajes. No avanzar de fase hasta validar esta restauración.
Preview https://preview-konoha-world3c.naruto2-5d.pages.dev/?v=3c68
Sandbox https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html?v=3c68
