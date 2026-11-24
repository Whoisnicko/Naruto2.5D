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
