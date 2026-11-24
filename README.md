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

## v1.1 beta — Konoha
Base RC original sin HD. Tres lugares, Shikamaru, misión, cofre y decoración estática. [Detalles](docs/V11-KONOHA-EXPANSION.md). Guardado v7 lee v2–v6. Pruebas simuladas aprobadas.

## v1.2 beta — Frontera del viento
Región conectada al este, santuario y ruinas, cuatro enemigos, dos cofres, talismán épico. Guardado v8. [Detalles y QA](docs/V12-WORLD-EXPANSION.md).

## v1.3 beta — Equipo 7
Sasuke, Sakura y Kakashi jugables, técnicas propias y progreso compartido. [Detalles](docs/V13-PLAYABLE-CHARACTERS.md). Guardado v9, pruebas simuladas aprobadas.

## v1.35 beta — Artes Shinobi
Cuatro árboles independientes, 24 nodos, poses de combate y FX ampliados. [Detalles y QA](docs/V135-COMBAT-ART.md). Guardado v10. Roadmap: v1.4 Exámenes Chūnin, v1.5 validación final.

## v1.4 beta — Exámenes Chūnin
Examen escrito, bosque con dos pergaminos y torneo Lee/Neji/Gaara. [Detalles](docs/V14-CHUNIN-EXAMS.md). Guardado v11. Roadmap v1.5 validación y v1.6 remodelación de combate pixel art.

## v1.5 RC — Validación y pulido
Base v1.4 aprobada. Respaldo local rotativo, recuperación, controles y HUD revisados. Guardado v11 intacto. [Auditoría y pruebas](docs/V15-FINAL-POLISH.md). Próxima fase v1.6 Combat Art Overhaul.

## v1.6a beta — Rasengan de referencia
Producción v1.5 aprobada. Seis poses por dirección y 36 cuadros FX específicos para Rasengan normal. [Detalles y QA](docs/V16A-RASENGAN.md). Guardado y balance intactos.

## v1.7 beta — Kyūbi Awakening
Modo de una cola, ataques físicos extensibles, Rasengan púrpura y sandbox. [Detalles y pruebas](docs/V17-KYUBI-AWAKENING.md). Producción v1.6b intacta.

## v1.8 beta — Kyūbi Evolution
Tres formas progresivas, furia, ataques múltiples, colas animadas y FX. [Detalles](docs/V18-KYUBI-EVOLUTION.md). Guardado v11.

## v1.8b — Kyūbi definitivo (tres colas)
Decisión del jugador: una única forma de tres colas, activación directa con T al 100%, 14 s, y un botón de sandbox. Se conserva el arte, Rasengan púrpura, ataques extensibles, daño múltiple y furia de v1.8. No añadir más transformaciones por ahora. Guardado v11. Smoke tests de lógica aprobados; render/audio reales y deploy pendientes.

## v1.9 beta — Shinobi Combat Intelligence
15 patrullas, siete arquetipos, respawn 60 s, minimapa y botón de sandbox. [Detalles](docs/V19-SHINOBI-AI.md). Guardado v11.

## v1.10 beta — Living World
v1.9 aprobada y fusionada a producción (PR #22). Living World agrega rutas NPC, tres interiores, clima y dos eventos dinámicos. [Detalles](docs/V110-LIVING-WORLD.md). Guardado v11.

## v1.10b — Living World presentation
A pedido del jugador: día, atardecer y noche duran 120 s de simulación cada uno (6 min por ciclo). Reloj de guardado v11 conserva rango 0..240; avanza a 2/3 de unidad por segundo, nuevas partidas empiezan a las 06:00. NPC siguen presentes y accesibles. Iluminación cálida al atardecer y azul oscuro por la noche, transición 2 s, contador visible y botón Cambiar hora en sandbox. Rasengan normal con bordes azul oscuro, centro celeste y ráfagas blancas; tamaño visual 0.74 vs 1.20 Kyūbi a igual carga, sin cambiar daño/colisiones/viaje. Eventos se activan tras 15 s en zona hostil incluso antes de misión inicial; 35 s de enfriamiento al completar, 25 s al expirar; reintento si el terreno no permite aparición. Aviso central 4.5 s, sonido, contador persistente, objetivo, mensaje de éxito/expiración. Menú RPG renovado con sprites reales del Equipo 7, paisaje vectorial original, protector, pergamino, kunai y shuriken; diseño responsive y sin imágenes externas. Suite smoke de lógica superada; validación visual, FPS, sonido y despliegue pendientes. Producción v1.9 intacta.

## Producción — v1.10b (24/11/2026)
PR #23 fusionado en main: b48bde7a91ca7b0c58b96df67e806d0c270b052f. Versión verificada en index.html de main. Publicación Cloudflare: sin confirmación independiente. URL https://naruto2-5d.pages.dev/. Revisión visual en curso; versión anterior recuperable desde el historial de GitHub.

## v1.10c — Regeneración del Kyūbi
Tres colas: regeneración continua de 10 puntos de HP por segundo de simulación (10% de vida máxima), solo mientras la transformación está activa, con límite de 100 HP. Se prorratea el último frame de transformación; no revive ni cura tras expirar. Duración 14 s y demás estadísticas intactas. Disponible en campaña y sandbox; indicador +10% HP/s. Pruebas de lógica: velocidad, límite, expiración exacta y aislamiento sandbox superadas, render/audio/UI simulados. Preview prevista: https://feature-v110c-kyubi-regen.naruto2-5d.pages.dev/ (Cloudflare sin confirmar). Producción v1.10b intacta.
