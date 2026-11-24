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
