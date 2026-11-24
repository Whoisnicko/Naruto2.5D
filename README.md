# Naruto — Senda del Shinobi | 2.5D v0.3
Prototipo fan-made independiente del juego 2D original. No es una migración completa ni una reproducción del arte conceptual.

## Decisiones
- WebGL nativo, sin dependencias externas; Three.js no estaba disponible para incluir y verificar offline.
- Cámara ortográfica elevada, mundo 3D estilizado de polígonos y colores planos, iluminación precalculada por cara; no hay modelos anime de alta resolución ni cel shading con contornos todavía.
- Geometría estática precalculada y agrupada en sectores de 20 unidades; descarte de sectores lejanos, colisión espacial por celdas de 5 unidades, IA suspendida fuera de 22 unidades, HUD a 5 Hz, resolución limitada y tres calidades manuales.
- Konoha, puente, río, bosque, campo de entrenamiento, Kakashi, cinco enemigos, cuatro técnicas, misión y guardado independiente. No se ha portado todo el contenido anterior. Efectos y personajes dinámicos aún generan geometría cada fotograma; optimizar con buffers reutilizables en fase posterior. Sin audio, sombras dinámicas, mapa o ciclo día/noche.

## Controles
WASD/flechas; Shift correr; E hablar; J taijutsu; K shuriken; L clones; Espacio Rasengan. Guardar y calidad en HUD. Controles táctiles básicos.

## Pruebas
Sintaxis JS comprobada. Prueba automatizada de lógica con WebGL simulado: aceptar misión, Rasengan, bajas y recompensa. WebGL real bloqueado en entorno de prueba; no se verificó imagen, FPS ni guardado real. Objetivo 60 FPS, no garantizado. Requiere navegador con WebGL y aceleración gráfica.

## v0.3 — Dirección artística
- Modelos procedurales articulados con rostro, pelo, vestimenta y accesorios; orientación según movimiento y ataques.
- Sombreado por bandas, materiales con detalle procedural, tejados, Ichiraku, faroles, flores y árboles de copa irregular.
- Sombras de contacto aproximadas, hojas y reflejos de agua animados, efectos de técnicas con densidad según calidad.
- Buffer dinámico reutilizable, sectores y suspensión de enemigos conservados. Sin dependencias externas ni cambios al formato del guardado.
- No incluye modelos profesionales importados, texturas fotográficas, sombras dinámicas reales ni animaciones capturadas. Prueba visual y FPS en GPU real pendientes.

## Estado actual
v0.3 aprobada por el jugador en perspectiva y rendimiento; guardado pendiente de corregir. Próxima fase: modelos 3D con licencias compatibles, animaciones, iluminación y exportación/importación de partidas. Proyecto fan-made no oficial, no comercial; no implica autorización de los titulares de Naruto.

## Jugar
https://naruto2-5d.pages.dev/ (URL de producción informada por el propietario; prueba de acceso externa pendiente).

## v0.4 beta — Three.js
Ver [migración, arquitectura y pruebas](docs/V04-MIGRATION.md). Rama de evaluación: Three.js, esqueletos procedurales, luces/sombras, GLB opcional y guardado portable. No incluye modelos externos profesionales aún. Validación WebGL real y FPS pendientes. La versión anterior está en `legacy-v03.html`.

## v0.6 beta — HD-2D Pixel Anime
Ver [decisiones y pruebas](docs/V06-PIXEL-ANIME.md) y [Sprite Lab](assets/sprite-lab.html). Base v0.4; sprites originales, FX 32×32, árboles pixelados, materiales simples, blob shadows. Sin GLB ni mapas de sombras. Pruebas simuladas aprobadas; validar WebGL y FPS reales.

## v0.7 beta — Game Feel
Base v0.6 validada a 144 FPS. Combos, dash, anticipación, impacto, audio y Sprite Lab 2.0. [Detalles y pruebas](docs/V07-GAME-FEEL.md). [Sprite Lab](assets/sprite-lab.html). Pruebas simuladas aprobadas; render y audio reales pendientes.

## v0.8 beta — Advanced Combat
Base v0.7 aprobada. Tres roles de enemigos, avisos, guardia, Kawarimi (R), Fūma (F), clones con vida y sinergia de Rasengan. [Documentación y pruebas](docs/V08-ADVANCED-COMBAT.md). Pruebas simuladas aprobadas; GPU/FPS y balance pendientes.

## v0.9 beta — RPG Progression
v0.8 fusionada a main (PR 6), check de Cloudflare exitoso para el commit. v0.9 añade inventario, equipo visible, botín, árbol, entrenamiento y Rasengan gigante; migración de guardado a v3. [Detalles y QA](docs/V09-RPG-PROGRESSION.md). Pruebas simuladas aprobadas, pendiente playtest real.

## v0.10 beta — Living Open World
v0.9 aprobada en main (PR 7), Cloudflare check exitoso. Nueva rama con NPC, diálogos, comercio, cofres, misiones y minimapa/ciclo día-noche. [Documentación y pruebas](docs/V010-LIVING-WORLD.md). Guardado v4 compatible hacia atrás al cargar v2/v3.

## v0.11 beta — Boss Encounters & Sandbox
v0.10 aprobada y publicada (PR 8, check Cloudflare exitoso). Zabuza/Haku en dos fases, recompensas, FX y sandbox temporal aislado. [Documentación y pruebas](docs/V011-BOSS-SANDBOX.md). Guardado v5 lee v2/v3/v4; pruebas simuladas aprobadas.

## v1.0 RC — Primera campaña
v0.11 aprobada y fusionada a main (PR 9), Cloudflare check exitoso. Seis capítulos, epílogo, diario U, pausa Esc, música procedural y guardado v6 compatible al cargar v2–v5. [Detalles y QA](docs/V1-RELEASE-CANDIDATE.md). Candidata pendiente de playtest.

## RC HD experimental
Fūma lateral con ocho cuadros de arte ilustrado generado, textura optimizada y fallback original. [Documentación y pruebas](docs/V1-HD-SPRITES.md). No altera guardados ni combate.

### HD2 — Naruto ilustrado permanente
Nuevo atlas de 12 poses. Naruto HD visible en reposo y movimiento, F lateral con atlas especial. Indicador HD activo y fallback. Equipo HD de traje fijo; modo original conserva capas. Guardados intactos.
