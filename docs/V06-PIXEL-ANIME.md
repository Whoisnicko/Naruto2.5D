# v0.6 beta — HD-2D Pixel Anime
Base: v0.4 validada por el jugador (~90 FPS). v0.5 se mantiene independiente (48 FPS reportados). No se modificó main ni se fusionaron ramas.
## Decisiones artísticas
- Cámara ortográfica elevada y mundo 2.5D, con personajes dibujados en pixel art original, no modelos GLB.
- Lenguaje 16-bit, cuadros de 24×32 píxeles por personaje; 4 direcciones × 16 cuadros (idle, caminar, correr, ataque, daño, jutsu). Naruto, Kakashi, renegados y clones.
- Sheet smear de 32×32, 3 cuadros × 4 direcciones; estelas de carrera y ataques J/Rasengan. Es un efecto visual, no una habilidad de dash nueva.
- FX sheet de 32×32, 8 cuadros × 5 tipos: Rasengan, clones, impacto, velocidad, shuriken.
- Árboles 40×48 en 3 variantes (105 colocaciones del mismo mapa); entorno 3D ligero con cuatro patrones de 16×16 y paleta anime; 8 edificios.
- UI de bordes rectos y paleta cálida. Sombras tipo blob para árboles, edificios y actores; no shadow maps.
## Arquitectura
src/pixel-art.js contiene el arte rasterizado a píxeles enteros y el diccionario ANIMS. src/pixel-renderer.js contiene la animación, texturas nearest-neighbor, reutilización de sprites y efectos, y árboles instanciados. src/renderer.js usa materiales sin iluminación dinámica, color sombreado precalculado y atlas de entorno. src/game.js conserva reglas y estado. src/save.js sin cambios.
## Assets
Originales del proyecto, generados a partir del código al iniciar. No assets de terceros ni dependencias de imagen nuevas. Ver assets/sprite-lab.html para hojas reales y exportar PNG. Respaldo procedural si el sistema de sprites o árboles no inicializa; legacy-v03.html permanece disponible. Naruto es propiedad de sus titulares.
## Rendimiento
Sin modelos GLB, rig, shadow maps ni MSAA. Límite de 8 rastros y 48/32/20 FX por calidad. Árboles agrupados por sector y variante; sombras de edificios instanciadas. Resolución limitada a DPR 1 y escalas 1/.75/.55. Contador de FPS y draw calls. Meta 60+ FPS; pendiente prueba GPU real.
## Pruebas
Sintaxis de módulos; simulación de inicio, ganchos de sprites, puente/río, misión, combate, recompensa, guardado/continuación/importación y rechazo de partidas inválidas. Rasterización simulada de las ocho hojas: todas las celdas no vacías, dimensiones correctas; selección de dirección y animación. No se verificó visualmente Three.js real, shader GLSL ni FPS.
## Checklist
- Revisar FPS alta/media/baja en aldea y bosque.
- Probar animaciones de cuatro direcciones, Shift, J/K/L/Espacio y estelas.
- Revisar árboles y sombras, edificios, colisión del puente.
- Ver sprite-lab y exportar PNG. Importar partida JSON de v0.4 si cambia origen.
- Confirmar estilo y rendimiento antes de integrar a producción.
