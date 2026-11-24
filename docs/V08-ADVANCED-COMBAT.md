# v0.8 beta — Advanced Combat

## Base
v0.7 aprobada por el jugador. Rama independiente, sin cambios en main ni en las anteriores. Mapa, cámara, cinco IDs de enemigos, HP máximo 70, misión y recompensas originales conservados.

## Enemigos
- Renegado cuerpo a cuerpo (IDs 0 y 3): persigue, ataque cercano de 11, preparación 0.32 s.
- Lanzador de kunai (IDs 1 y 4): ataque a distancia hasta 8 unidades, preparación 0.55 s, proyectil 10 de daño, se retira durante cooldown si está demasiado cerca.
- Guardián (ID 2): golpe de área radio 2.5, 20 daño, preparación 0.65 s; defensa frontal durante recuperación, reduce daño un 65%. Remate de combo, Rasengan y Fūma rompen guardia; flanquear también evita reducción. Rotura aturde 0.9 s.
- Patrulla cercana al punto original, persecución, preparación, recuperación, retroceso y aturdimiento. Enemigos alejados del jugador no se actualizan. Avisos visuales en suelo: anillos para cuerpo a cuerpo, línea de puntería para kunai; guardia dorada y marca de clon azul.

## Técnicas
R: Kawarimi (18 chakra, cooldown 7 s, ventana 1.8 s). Al recibir un golpe dentro de la ventana, evita ese golpe, cancela ataque pendiente, desplaza a un punto seguro hasta 2.7 unidades si existe y concede 0.38 s invulnerabilidad. Si no hay ruta segura se queda en el sitio y evita el golpe. Si no recibe golpe, expira sin devolución de chakra.
F: Fūma de viento (variante original del fan game, 22 chakra, cooldown 3.2 s, 34 daño base, windup 0.25 s). Proyectil perforante, cada enemigo solo recibe daño una vez por lanzamiento; choca con obstáculos, rompe guardia. Alcance de selección 12 unidades.
Clones: dos clones de 22 HP cada uno, vida máxima 5 s, 18 daño base. Enemigos priorizan clones cercanos (peso 0.58 en selección por distancia). Golpes de clones marcan enemigo por 2.5 s; Rasengan directo consume marca y recibe +25% daño (75 base). Clones pueden morir por golpes o proyectiles, con nube de humo y barra de vida.
## Arte
Dos variantes nuevas de sprites 24×32 (88 celdas cada una), y tres filas FX 32×32 (viento, kunai, sustitución); total seis hojas de actores, 528 celdas, 64 FX, 12 smear. Sprite Lab incluye nuevos actores y efectos. No nuevos modelos 3D, texturas externas o mapas de sombras.
## Arquitectura
src/enemy-ai.js: roles, estados, selección objetivo, defensa frontal, IA, sustitución segura. src/combat-data.js: balance. src/game.js: resolución, proyectiles, marcas, UI y telegraphs. src/pixel-art.js/pixel-renderer.js: arte. src/save.js sin modificar; los roles derivan del ID estable y el estado temporal de combate se reinicia al cargar. Los archivos previos conservan compatibilidad.
## QA
Ejecutado con adaptadores simulados: regresión v0.7, guardado/importación, combos, colisión, misión y recompensa, sustitución y expiración, selección de clones y daño, guardia frontal/flanco/rotura, aviso de lanzador antes de disparar, Fūma perfora dos enemigos sin repetir daño, proyectil bloqueado por río. Sintaxis Sprite Lab comprobada. Pendientes render WebGL real, sonido, rendimiento, balance y preview Cloudflare.
## Playtest
Verificar las tres clases, esquivar avisos, usar R durante un ataque enemigo, F contra enemigos alineados, L para distraer y Rasengan contra marca azul, guardado y FPS. Si se usa otro preview, exportar/importar JSON.
## Siguiente
v0.9 progresión RPG e inventario; no iniciar hasta validar v0.8.
