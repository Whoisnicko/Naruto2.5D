# Playbook — Naruto 2.5D
1. Abrir index.html en Chrome/Edge con aceleración gráfica activa. Alternativamente servir por HTTP con `python -m http.server 8000`.
2. Nueva aventura: caminar hacia Kakashi, E, cruzar puente hacia el este, derrotar cinco renegados y volver a cobrar recompensa.
3. Comprobar técnicas, pausa, calidad, guardado y continuar. Registrar FPS en plaza y combate en cada calidad. Reportar GPU, resolución y navegador si hay tirones.
4. Mantener la versión 2D separada; publicar el nuevo prototipo en una rama/repositorio separado cuando exista.
5. Cloudflare Pages: proyecto estático, sin build, raíz con index.html. Verificar URL antes de registrarla.

Pendientes: validación visual real, perfil de rendimiento, modelos anime y animaciones, sombras, sonido, minimapa, migración de mecánicas anteriores.

## Pruebas v0.3
Comparar FPS con v0.2 (144 reportados por el jugador), comprobar orientación y animaciones al correr, técnicas, puente, misión, calidad gráfica y continuidad del guardado. Mantener v0.2 como respaldo.

## Despliegue
Repositorio: https://github.com/Whoisnicko/Naruto2.5D
Rama de producción: main. Cloudflare Pages: framework None; comando de build vacío; directorio de salida `.` (raíz). No requiere variables ni dependencias en v0.3. URL pública: https://naruto2-5d.pages.dev/ (informada por el propietario; acceso externo y despliegue automático pendientes de verificar).
Mantener main estable; desarrollar cambios grandes en ramas separadas y probar antes de integrar. No almacenar tokens, partidas ni credenciales en este repositorio público.

## v0.4 beta
Trabajar en `feature/v04-threejs`. Ejecutar `node tests/smoke.mjs`; el adaptador gráfico está simulado. Usar el preview de Cloudflare para verificar GPU y FPS antes de fusionar. La URL principal sigue en main. Ver [migración](docs/V04-MIGRATION.md).

## v0.6 beta — pivot pixel anime
Rama `feature/v06-pixel-anime` basada en v0.4. Preview desde Cloudflare Deployments; no asumir URL hasta confirmación. Abrir `assets/sprite-lab.html` en ese mismo preview para hojas reales. Ejecutar `node tests/smoke.mjs`. Guardado compatible por JSON entre orígenes. No fusionar a producción antes de validar visual y FPS.

## v0.7 beta
Rama `feature/v07-game-feel`; abrir preview desde Cloudflare Deployments. Probar Q, J encadenado, K/L/Espacio, números, cámara y sonido. Ejecutar `node tests/smoke.mjs`. Abrir `assets/sprite-lab.html` y revisar/exportar animaciones reales. Exportar JSON del guardado antes de cambiar de origen. No fusionar hasta validar.

## v0.8 beta
Rama `feature/v08-advanced-combat`. Preview desde Cloudflare Deployments, URL pendiente de verificar. Probar Q/J/K/L/Espacio existentes, R Kawarimi y F Fūma, guardia, kunai y marcas de clones. Ejecutar `node tests/smoke.mjs`. Guardado compatible; importar JSON si cambia origen. No fusionar antes de validar.

## v0.9 beta
Producción v0.8: https://naruto2-5d.pages.dev/ — PR 6 fusionado, check Cloudflare success. Rama de prueba `feature/v09-rpg-progression`. Exportar partida v2 antes de probar. I inventario, P árbol, 1–3 consumibles, G técnica desbloqueable. Probar equipo visible, entrenamiento, reserva de botín y migración a v3. Ejecutar `node tests/smoke.mjs`. Mantener v0.9 fuera de main hasta validación.

## v0.10 beta
Producción v0.9: https://naruto2-5d.pages.dev/ — PR 7 fusionado, check Cloudflare success. Rama `feature/v010-living-world`. Exportar JSON v3 antes del preview. E diálogo/cofre, M minimapa. Probar comercio, misiones, llave, persistencia y rendimiento; ejecutar `node tests/smoke.mjs`. No fusionar hasta validar.

## v0.11 beta
Producción v0.10: https://naruto2-5d.pages.dev/ — PR 8, deploy exitoso. Rama `feature/v011-boss-sandbox`. Exportar v4 antes de probar. Sandbox en menú o HUD: niveles, ryō, suministros, recuperación, jefes directos; salir restaura campaña. Normal: terminar misión, E en arena este del bosque. Ejecutar `node tests/smoke.mjs`. No fusionar antes de validar.

## v1.0 RC
Producción v0.11: https://naruto2-5d.pages.dev/ — PR 9, deploy exitoso. Rama `feature/v1-release-candidate`. Exportar JSON v5 antes de importar a beta. U diario, Esc pausa; completar misión inicial, Zabuza, Haku y regresar con Kakashi. Probar recompensa única, guardar/volver al menú, música y sandbox. Ejecutar `node tests/smoke.mjs`. No fusionar hasta aprobación.

## v1.1 beta
Rama `feature/v11-konoha-expansion`, parte de RC original. Probar Shikamaru, jardín, mercado, mirador, cofre, equipo visible, guardado y FPS. Exportar respaldo v6 antes del preview. `node tests/smoke.mjs`. Main intacta; no fusionar antes de aprobar.

## v1.2 beta
Base v1.1 aprobada. Rama `feature/v12-world-expansion`. Exportar v7 antes del preview. Caminar hacia este por el camino del bosque, vencer tres renegados, cruzar puerta, vencer guardián, abrir relicario, regresar y guardar. `node tests/smoke.mjs`. No fusionar antes de validar.

## v1.3 beta
Rama `feature/v13-playable-characters`. Exportar v8 antes de probar. C cerca de Kakashi después de misión inicial o sandbox en zona segura. Probar Espacio/F/L/G, equipo visible, guardado y FPS. `node tests/smoke.mjs`. No fusionar antes de validar.

## v1.35 beta
Producción v1.3 (8276d8c), aprobada. Rama `feature/v135-combat-art`. Exportar v9 antes de probar. C selecciona, P árbol propio, G técnica avanzada. Sandbox permite niveles y pergaminos. Probar cuatro personajes, preparación/impacto, Sprite Lab, guardar, equipo y FPS. `node tests/smoke.mjs`. No fusionar hasta aprobación.

## v1.4 beta
Rama `feature/v14-chunin-exams`, v1.35 aprobada funcionalmente. Exportar respaldo v10. N con Iruka o sandbox; aprobar 4/5, vencer rivales y recoger ambos pergaminos con E antes de 100 s, ganar tres duelos, comprobar recompensa y recarga. `node tests/smoke.mjs`. Pendiente WebGL/FPS. v1.5 validación y v1.6 arte de combate profundo.

## v1.5 RC
Rama `feature/v15-final-polish`. Exportar partida antes de probar. Probar dos guardados distintos, recuperar respaldo desde título, importación, personaje activo, torneo, inventario y FPS en alta/media/baja. No borrar el guardado principal para probar corrupción salvo en un perfil de navegador desechable. `node tests/smoke.mjs`. Publicar tras aprobación. v1.6: Rasengan de referencia, aprobación visual, resto de jutsus.

## v1.6a beta
Rama `feature/v16a-rasengan`. Probar Naruto con Espacio en cuatro direcciones, al aire y contra enemigos, equipo visible y FPS alta/media/baja. Sprite Lab: Naruto + Rasengan, exportar atlas real. `node tests/smoke.mjs`. No fusionar hasta aprobar estética. Producción v1.5, rollback de código `backup/production-v13-before-v15`.

## v1.7 beta
Rama `feature/v17-kyubi-awakening`. Entrar en Sandbox con Naruto, pulsar Kyūbi · 15 s, probar J a distancia, Espacio y G cargables, renovar modo y salir. En campaña T al llenar medidor; G requiere árbol. Guardado v11. `node tests/smoke.mjs`. Validar visual/FPS antes de fusionar.

## v1.8 beta — Kyūbi Evolution
Probar 1, 2 y 3 colas en Sandbox; T evoluciona con furia 100. Validar combos, impulso involuntario, expiración y FPS. `node tests/smoke.mjs`. Preview prevista: https://feature-v18-kyubi-evolution.naruto2-5d.pages.dev/

## v1.8b — Kyūbi definitivo (tres colas)
Decisión del jugador: una única forma de tres colas, activación directa con T al 100%, 14 s, y un botón de sandbox. Se conserva el arte, Rasengan púrpura, ataques extensibles, daño múltiple y furia de v1.8. No añadir más transformaciones por ahora. Guardado v11. Smoke tests de lógica aprobados; render/audio reales y deploy pendientes.

## v1.9 beta — Shinobi Combat Intelligence
Probar patrullas en bosque/frontera, marcar bajas, esperar 60 s de juego, botón Reaparecer enemigos, médico/asesino/invocador/élite y aislamiento de misiones. `node tests/smoke.mjs`. Preview prevista: https://feature-v19-shinobi-ai.naruto2-5d.pages.dev/ (confirmar Cloudflare).

## v1.10 beta — Living World
v1.9 fusionada a main (PR #22). Probar E en puertas turquesa, caminar y salir, guardar dentro y recargar fuera, rutinas NPC, clima y ambos eventos vía sandbox en bosque/frontera. Ejecutar `node tests/smoke.mjs`. Preview prevista: https://feature-v110-living-world.naruto2-5d.pages.dev/ (confirmar Cloudflare).

## v1.10b — Living World presentation
A pedido del jugador: día, atardecer y noche duran 120 s de simulación cada uno (6 min por ciclo). Reloj de guardado v11 conserva rango 0..240; avanza a 2/3 de unidad por segundo, nuevas partidas empiezan a las 06:00. NPC siguen presentes y accesibles. Iluminación cálida al atardecer y azul oscuro por la noche, transición 2 s, contador visible y botón Cambiar hora en sandbox. Rasengan normal con bordes azul oscuro, centro celeste y ráfagas blancas; tamaño visual 0.74 vs 1.20 Kyūbi a igual carga, sin cambiar daño/colisiones/viaje. Eventos se activan tras 15 s en zona hostil incluso antes de misión inicial; 35 s de enfriamiento al completar, 25 s al expirar; reintento si el terreno no permite aparición. Aviso central 4.5 s, sonido, contador persistente, objetivo, mensaje de éxito/expiración. Menú RPG renovado con sprites reales del Equipo 7, paisaje vectorial original, protector, pergamino, kunai y shuriken; diseño responsive y sin imágenes externas. Suite smoke de lógica superada; validación visual, FPS, sonido y despliegue pendientes. Producción v1.9 intacta.

QA: iniciar partida, inspeccionar menú y sprites, usar Cambiar hora, observar 120 s por fase, comparar Rasengan normal/Kyūbi a carga igual, permanecer 15 s en bosque antes de misión, probar ambos eventos, verificar contador y FPS. `node tests/smoke.mjs`.

## Producción — v1.10b (24/11/2026)
PR #23 fusionado en main: b48bde7a91ca7b0c58b96df67e806d0c270b052f. Versión verificada en index.html de main. Publicación Cloudflare: sin confirmación independiente. URL https://naruto2-5d.pages.dev/. Revisión visual en curso; versión anterior recuperable desde el historial de GitHub.

## v1.10c — Regeneración del Kyūbi
Tres colas: regeneración continua de 10 puntos de HP por segundo de simulación (10% de vida máxima), solo mientras la transformación está activa, con límite de 100 HP. Se prorratea el último frame de transformación; no revive ni cura tras expirar. Duración 14 s y demás estadísticas intactas. Disponible en campaña y sandbox; indicador +10% HP/s. Pruebas de lógica: velocidad, límite, expiración exacta y aislamiento sandbox superadas, render/audio/UI simulados. Preview prevista: https://feature-v110c-kyubi-regen.naruto2-5d.pages.dev/ (Cloudflare sin confirmar). Producción v1.10b intacta.
QA: bajar HP a 25, activar Kyūbi, observar +10 HP/s hasta 100, verificar fin de regeneración al expirar. `node tests/smoke.mjs`.

## v1.10d — Corrección del color del Rasengan
Separación de pools de sprites normal y Kyūbi para evitar contaminación de Source compartido de Three.js al reasignar map.image. Máximo ocho sprites Rasengan visibles, reutilización independiente. Tras expirar la transformación, el Rasengan en carga y los nuevos lanzamientos vuelven a celeste, tamaño normal; daño de ataque ya iniciado se conserva. Regeneración v1.10c intacta. Pruebas de lógica y de selección/reutilización de atlas superadas (render GPU real pendiente). Preview misma rama; Cloudflare sin confirmar. Producción v1.10b intacta.

## v1.10e — Classic title, English and control settings
Approved classic Team 7 title artwork tracked at assets/title-classic.png, functional HTML menu and fallback. English main UI, campaign, dialogue, item and combat strings; final visual/localization QA pending. Persistent keyboard remapping, duplicate keys swapped, defaults, arrows and touch remain supported. Normal and Kyūbi Rasengan resist ordinary damage interruption; lethal damage cancels. Retains +10% max HP/s Kyūbi regeneration and palette fix. Smoke logic tests passed with renderer/audio/UI mocked. Promotion to main requested; Cloudflare deploy requires verification.

## v1.10f — Lighting and random weather
Day/Sunset/Night: 120 active simulation seconds each, same saved clock schema. Apply CSS color grade directly to the world canvas (sunset warm, night 53% brightness with blue tint), transition 2 s, interior neutral, HUD unaffected. Weather runs on independent timer: clear 35–85 s, then random rain (82%, 25–55 s) or storm (18%, 20–40 s), then clear. Rain more visible; sandbox explicit Auto/Clear/Rain/Fog/Storm buttons and Change Time. Manual overrides persist within sandbox until Auto; normal session restored with original weather timer. Smoke tests passed, GPU/visual QA pending. Preview expected https://feature-v110f-weather-lighting.naruto2-5d.pages.dev/; Cloudflare not independently confirmed. Main v1.10e unchanged.
QA: Change Time x3, compare canvas brightness and HUD, select each manual weather, choose Auto, exit sandbox and check original weather. `node tests/smoke.mjs`.
