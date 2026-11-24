# v0.4 beta — migración Three.js
## Estado
Rama de pruebas; main permanece en v0.3. Se necesita validar renderizado WebGL 2 y FPS reales antes de fusionar. Dependencia CDN jsDelivr three@0.169.0 con import map; conexión a Internet para cargar módulos. El motor anterior está en legacy-v03.html.
## Arquitectura
- index.html: UI, import map, manejo de error de arranque.
- src/game.js: reglas, estado, mundo, colisiones, combate, input, HUD y game loop.
- src/renderer.js: Three.js Scene, OrthographicCamera, BufferGeometry, materiales toon, luz hemisférica y direccional, mapas de sombras, niebla, geometría por sectores y buffers dinámicos. Geometrías de personajes reutilizadas con SkinnedMesh/Skeleton y animación procedural de huesos.
- src/save.js: validación de datos, versión de esquema, localStorage, exportación/importación JSON y compatibilidad v0.3.
- assets/manifest.json: configuración de GLB opcionales.
- tests/smoke.mjs: pruebas aisladas con adaptador gráfico simulado; ejecutar node tests/smoke.mjs.
## Assets externos
No se ha incorporado un modelo profesional de Naruto o Kakashi: no se verificó ningún modelo compatible con derechos de redistribución pública. Las geometrías de respaldo son las del proyecto, con un esqueleto nuevo; el aspecto final sigue siendo procedural. La textura de terreno es ruido procedural, no un pack profesional.
Para incorporar un recurso autorizado, añadir assets/characters/<modelo>.glb y actualizar el campo url relativo al manifest (ej. characters/hero.glb), height, rotationY y animations (mapa de idle/walk/run/attack/shuriken/clone/rasengan a nombres exactos de clips). GLTFLoader importa el recurso; SkeletonUtils clona el esqueleto por actor; AnimationMixer mezcla animaciones. Si falla o no existe se usa la versión procedural. Registrar autor, licencia y atribución en assets/CREDITS.md antes de publicar.
## Rendimiento
Cámara ortográfica y tamaño de vista conservados; sectores visibles, IA cercana, HUD 5 Hz, buffers dinámicos. Alta: sombras 1024, media 512, baja sin sombras. Personajes procedurales con malla reutilizada y huesos en GPU. Meta 60 FPS, pendiente medición real.
## Guardado
Guardar manualmente, autoguardado cada 20 segundos de juego y al salir, exportar archivo .json, importar con validación de esquema y datos. Cada origen (producción/preview) tiene almacenamiento independiente. No hay guardado en nube D1.
## Checklist
1. Abrir preview Cloudflare; probar consola, modelos y cámara.
2. Comparar FPS alto/medio/bajo en aldea y combate.
3. Completar misión Kakashi, 5 enemigos y cuatro técnicas.
4. Guardar, recargar, continuar, exportar, importar y validar que no se pierde progreso.
5. Si se configura GLB, probar clips y fallback con URL incorrecta.
6. Confirmar calidad y fusionar a main solo después de validar.
