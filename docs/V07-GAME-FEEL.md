# v0.7 beta — Game Feel & Sprite Lab 2.0

## Base validada
v0.6: jugador reportó 144 FPS, guardado funcional y Sprite Lab aprobado. Rama independiente. v0.6, v0.5 y producción no se modificaron.

## Controles
WASD/flechas: caminar; Shift: correr; Q: dash/esquiva (12 chakra, 0.85 s cooldown, 0.17 s movimiento, 0.19 s invulnerabilidad); E: hablar; J: combo de tres golpes; K: shuriken; L: clones; Espacio: Rasengan. Botones táctiles existentes y Q en hotbar.
J: puño 25, patada 28, remate 38 daño base. Encadenar en una ventana de 0.72 s; un J durante recuperación puede quedar en cola. Crítico 10%, multiplicador 1.5 en ataques directos. Rasengan: 60 daño base, preparación 0.26 s y pequeño impulso. Shuriken y clones mantienen costes y daño base. Enemigos preparan golpes durante 0.24 s y el jugador puede salir de alcance o esquivar.
## Game feel
Hit-stop breve (35–75 ms en golpes directos), vibración de cámara regulable por impacto, destello, retroceso con colisión por subpasos, números flotantes con pool y críticos amarillos. Vida, chakra y recompensas permanecen en esquema compatible v0.6; variables temporales de combate no se guardan. Sonido sintetizado mediante Web Audio (sin archivos externos), pasos, viento, golpes, dash y habilidades; mute y volumen persistentes en localStorage separados del guardado. Sonido necesita interacción inicial. Vibración desactivable.
## Sprite Lab 2.0
assets/sprite-lab.html: usa hojas reales de src/pixel-art.js. Personaje, dirección, reproducción/pausa, fotograma, FPS, duración individual, anclaje, opacidad, color principal de ropa, estelas, alcance aproximado, exportación PNG y JSON de borrador. Los ajustes del laboratorio no modifican automáticamente el juego. 22 columnas × 4 direcciones = 88 fotogramas por tipo de actor; 352 fotogramas de actores, 12 smear, 40 FX. Nuevas poses para patada/remate.
## Arquitectura
src/combat-data.js: balance, tiempos y movimiento en subpasos. src/feedback.js: hit-stop, cámara, audio y números. src/game.js: resolución de ataques y controles. src/pixel-renderer.js y pixel-art.js: sprites existentes más poses. src/save.js no modificado. Sin nuevos modelos, texturas externas ni mapas de sombras.
## Validación
Prueba ejecutada con renderer/audio simulados: sintaxis, dash/coste/cooldown/invulnerabilidad/desplazamiento, colisión de barrera y puente, anticipación sin daño prematuro, buffer de combo y tres etapas, Rasengan y demás técnicas, recompensa 160 ryō, guardado/continuación/importación, rechazo de guardado inválido, selección de poses y hit-stop. Guardar y exportar partidas entre orígenes como en v0.6.
Pendiente: ejecución real Three.js, sonido, estética/ergonomía, FPS y Cloudflare preview.
## Siguiente fase
v0.8 combate avanzado: nuevos tipos de enemigos, habilidades y sinergia de clones; después RPG, mundo vivo y bosses.
