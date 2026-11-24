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

## v1.10d — Corrección del color del Rasengan
Separación de pools de sprites normal y Kyūbi para evitar contaminación de Source compartido de Three.js al reasignar map.image. Máximo ocho sprites Rasengan visibles, reutilización independiente. Tras expirar la transformación, el Rasengan en carga y los nuevos lanzamientos vuelven a celeste, tamaño normal; daño de ataque ya iniciado se conserva. Regeneración v1.10c intacta. Pruebas de lógica y de selección/reutilización de atlas superadas (render GPU real pendiente). Preview misma rama; Cloudflare sin confirmar. Producción v1.10b intacta.

## v1.10e — Classic title, English and control settings
Approved classic Team 7 title artwork tracked at assets/title-classic.png, functional HTML menu and fallback. English main UI, campaign, dialogue, item and combat strings; final visual/localization QA pending. Persistent keyboard remapping, duplicate keys swapped, defaults, arrows and touch remain supported. Normal and Kyūbi Rasengan resist ordinary damage interruption; lethal damage cancels. Retains +10% max HP/s Kyūbi regeneration and palette fix. Smoke logic tests passed with renderer/audio/UI mocked. Promotion to main requested; Cloudflare deploy requires verification.

## v1.10f — Lighting and random weather
Day/Sunset/Night: 120 active simulation seconds each, same saved clock schema. Apply CSS color grade directly to the world canvas (sunset warm, night 53% brightness with blue tint), transition 2 s, interior neutral, HUD unaffected. Weather runs on independent timer: clear 35–85 s, then random rain (82%, 25–55 s) or storm (18%, 20–40 s), then clear. Rain more visible; sandbox explicit Auto/Clear/Rain/Fog/Storm buttons and Change Time. Manual overrides persist within sandbox until Auto; normal session restored with original weather timer. Smoke tests passed, GPU/visual QA pending. Preview expected https://feature-v110f-weather-lighting.naruto2-5d.pages.dev/; Cloudflare not independently confirmed. Main v1.10e unchanged.

## v1.11a beta — The Demon of the Mist (implemented)
First playable scripted encounter, using the existing eastern forest arena (32,-2). Discover without campaign prerequisite, lead as Naruto, use interact near the marker; normal NPC/chest interaction takes precedence. Standalone sandbox Zabuza/Haku buttons retained; new Mist Saga button tests full sequence. Stages: Zabuza + Kakashi until 180/360 HP; arrival dialogue; Haku + Sasuke until 150/300 HP; Sasuke knocked down, unlock and automatically activate current Three Tails (14 s, +10% max HP/s); Haku second half with breakable mirror objects and teleport between surviving mirrors; wrath scene in which Zabuza strikes Haku while attempting to attack Kakashi (alternate story); Zabuza returns with remaining 180 HP, +45% base speed, stronger and faster new attacks, fog; Kakashi + Sasuke; ending and first-clear rewards. Companion AI follows/attacks targets and has health/cooldowns; Sasuke may target a nearby mirror. Boss targets alternate between allies and Naruto. Cinematic dialogue uses existing sprite portraits, camera focus, staged cast, tilted fallen sprites and flashes, not new bespoke animations/videos. Pause damage during dialogue; Next, Enter, Space or interact advance.
Checkpoints persist in v11 bossProgress (mistStage, kyubiUnlocked). Retry after defeat/retreat from phase start, not exact health. Older saves retain Kyubi, completed encounters remain completed, one prior Zabuza victory resumes Haku and does not re-award Zabuza loot. New saves unlock only at awakening; Sandbox has free access. Existing campaign epilogue requires both boss victories plus initial mission. Final awards existing mistBlade/iceMask and consumables, 550 EXP and 400 ryō if neither was earned before. No duplicate first-clear rewards. Weather, controls and existing saves retained. Regression suite passed in JS harness with render/audio/UI mocked; real graphics, effects, sound, ally balance and FPS not yet independently verified. Gaara, Kabuto, Orochimaru and broader world-boss registry remain future work. Preview expected: https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/ (Cloudflare unconfirmed). Production v1.10f unchanged: https://naruto2-5d.pages.dev/.

## v1.11b beta — Cinematic flow and isolated boss arena
Fix for reported stuttering at saga start: previous dialogue path rendered only every 100ms (10fps), despite RAF-based FPS display. Render dialogue every animation frame, camera interpolation on real frame delta and feedback timers continue during scenes. Avoid duplicate first-stage creation after opening dialogue; reset feedback at scene transitions and limit boss-hit hit-stop to 18ms. Warm four encounter sprite pools/textures gradually at title. FPS now counts actual rendered frames and shows maximum frame interval in ms. No measured GPU improvement claimed.
- Prebuilt dedicated circular arena at existing coordinates (32,-2), with its own simple clearing, perimeter trees and visible boundary. Hide exploration terrain, props, tree instances, NPCs, chests, map/event HUD and weather particles while active. Suspend world clock, NPC routines, weather, events and enemy respawns; shift suspended timers on exit. Encounter updates only relevant actors, effects and projectiles. Normal and sandbox standalone world bosses use the same isolation, exams remain unchanged.
- No walking, dashing, substitution or Rasengan escape through arena boundary; boss no longer despawns on distance. Pause-to-title is disabled during encounter. Death preserves existing phase checkpoint and returns to Konoha. Sandbox Exit is retained as an explicit testing override.
- Camera shots per dialogue: 1.32–2.05x orthographic zoom, subtle horizontal camera angle rotation and elevated focus on speaker; smooth return to combat view. Existing sprites and portraits reused.
- Kakashi and Sasuke circle, approach, retreat from telegraphed attacks, and use separate timed jutsu with windup: Water Dragon / Raikiri, Fireball / Chidori. Visible fire/water projectiles and lightning impact, companion health and technique labels. Damage and cooldowns are provisional. No new Zabuza attack patterns in this iteration.
- Full logic smoke suite passed with mocked renderer/audio/UI, plus arena boundary, frozen NPC/world clock, ally displacement/jutsu and camera shot assertions. Browser GPU performance, precise framing, actual asset visuals and balance still need playtest. Production remains v1.10f. Preview expected https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/ (Cloudflare unconfirmed).

## v1.11c beta — The Hidden Mist
- World entry: persistent bright pink minimap marker and named quest hint while Mist Saga incomplete; visible Zabuza/Haku sprites in eastern forest at (32,-2) and (33.8,-3.4). Interact within 5 units prioritizes the saga before nearby chest/cache/NPC; no training prerequisite. Completed saved encounters remain completed; sandbox available for replay.
- Zabuza 1440 HP and Haku 1200 HP (+300%, 4x); half phases 720 and 600. Faster movement, windups and cooldowns; randomized available attack selection excludes immediate repeats. Normal and wrath Zabuza launch 3s homing Water Dragon and summon up to 3 water clones per cast (max 4, 45 HP, 9s lifetime). Clone contact traps Naruto in a Water Prison: alternate mapped left/right keys (default A/D) 12 times within 4.5s, touch buttons work; failure causes 22 base damage, 2.5s capture immunity on release. Explicit prison status cancels charge, but ordinary damage still preserves Rasengan. UI time updates at 10Hz. Haku teleports among surviving mirrors, independently fires needle fans and additional phase 2 volleys; max 40 concurrent projectiles at needle spawn. Existing stage/arena/checkpoint isolation preserved. Kyubi locked during full saga stages 0/1 even in sandbox or legacy unlocked save; old unlock outside saga and standalone sandbox practice retained. Awakening scene adds 4.8x closeup, camera look height 1.7, shaking WWRRAAAH!! dialogue, existing synthetic roar effect. Transform after dialogue advances. No recorded voice or bespoke animation.
- More ambient fog, stronger boss fog, two traversable shallow river sections (z -20..-12 and 16..24), turquoise terrain and minimap strips; remaining deep water retains collision. Full logic smoke suite passed twice with mocked renderer/audio/UI (world entry, HP/phase thresholds, homing, clone capture, alternate keys, timeout, mirror teleport/needles, unlock and camera assertions). No browser visual, audio or FPS verification; difficulty values provisional. Preview expected https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/; Cloudflare unconfirmed. Production v1.10f unchanged.

## v1.11d beta — Zabuza Combat Rebalance
Zabuza and wrath use independent ability cooldown groups measured after strike: sword 3s (shared across sword slash/whirlwind), dragon 7s, water clones 12s. Initial availability staggered (dragon 2.5s, clones 5s); random selection among available in-range patterns. Dragon channels stationary for exactly 2 simulation seconds in both phases, tracks aim while casting, displays cyan ground rings and a cast progress bar; existing 3s homing projectile unchanged. Sword radius normal 4.2 / whirlwind 5.2; wrath 4.8 / 6.2; windups normal .48/.55, wrath .40/.48. Reposition/orbit, direction reversals and pursuit between casts; retain ally targeting. HP, damage, clone lifetime, prison and Haku mechanics unchanged. Full regression suite passed in JS harness (renderer/audio/UI mocked); 65-second normal and wrath simulations assert minimum cooldowns, shared sword timer, 2s dragon channel, movement and all three abilities used. Browser playtest/balance and Cloudflare preview not independently confirmed. Main/production unchanged v1.10f. Preview: https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/.

## v1.11e beta — Zabuza cooldown tuning
Dragon cooldown 12s and water clones 20s after execution, in both phases. Sword shared 3s cooldown, dragon channel 2s, homing duration 3s, initial stagger, HP, damage and movement unchanged. Full JS smoke suite passed with mocked renderer/audio/UI, including 65-second simulations of both forms. Browser playtest and Cloudflare preview unconfirmed. Production unchanged v1.10f.
## Proposed level scaling (design, not implemented)
Current level = 1 + floor(XP/100), level grants skill points but no automatic base stats. Suggested automatic growth per gained level: +5 max HP, +3 max chakra, +2 attack, +1 flat defense per 3 levels gained, +0.5% movement speed and +0.5 percentage points critical chance; cap automatic bonus at level 20 initially, keep equipment and skill tree independent. Review normalized 0–100 HP/chakra storage, damage, healing, consumables, save migration, HUD, and Kyubi 10% max-HP/s before implementation. Do not modify XP thresholds or character stats until proposal approved. Preview https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/.

## v1.11f beta — Haku Combat Rebalance
Haku world boss uses one offensive timer: a single combined teleport and randomized 5/7/9 needle volley, with 5s cooldown measured after firing and existing .30–.40s preparation. Removed independent mirror barrage and extra phase-two volley. Between casts Haku repositions on foot. Ice Shield activates every 20 simulation seconds (start-to-start within each phase), lasts 3s, cancels current windup and prevents movement/attacks; existing fired projectiles can still travel. All damage sources blocked before damage/rage processing, mirrors remain independently destructible. Ice crystals, cyan rings, sprite tint, IMMUNE feedback and HUD countdown. Both scripted phases and standalone sandbox Haku use same AI. HP 1200, Zabuza timing, saves, progression unchanged. Full JS regression suite passed with mocked renderer/audio/UI, including 65-second simulations for both phases, volley intervals, shield cycle, immunity and restoration. Browser visual and actual difficulty remain unverified. Preview https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/ (Cloudflare unconfirmed). Production v1.10f unchanged.

## v1.11g beta — Collapsible Sandbox
Sandbox tools now have a Hide button and a compact toggle in the bottom tools row, with aria-expanded, responsive scrollable panel and automatic collapse on entering a world boss arena or Chūnin combat. Manual reopening during active combat is available; toggling does not pause simulation, modify save state or reset the encounter. New sandbox sessions begin expanded; leaving hides both controls. No combat/stat changes. Full JS smoke suite passed with mocked UI/renderer/audio, including collapse, movement while hidden, automatic collapse, reopen and exit isolation. Browser layout/playtest and Cloudflare preview unconfirmed. Production v1.10f unchanged. Preview https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/.

## v1.11h beta — Sandbox Immortal Mode and top dock
Sandbox-only toggle defaults OFF on entry and resets OFF on exit. Enabling restores HP to 100 and prevents loss from playerHurt and trapped chests; ordinary hit feedback, knockback, substitution, rage accrual and water-prison behavior remain, allies/bosses retain normal damage. Remains enabled across saga stages and when tools are hidden. No save schema or production changes. Compact top-centered sandbox dock and status label, panel immediately below, boss/event HUD repositioned in sandbox, automatic collapse retained. Full logic regression passed with mocked UI/render/audio, including fatal hits, prison timeout, Haku transition, OFF restoration and save isolation. Real browser layout and Cloudflare preview pending. Preview https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/.

## v1.11i beta — Shadow Clones & Western Forest
Naruto shadow clones, normal and Kyubi, now have 1 HP and disappear after the first positive damage hit. Damage, distraction and base 5s lifespan retained. Resilient Shadows (existing endurance skill ID) now grants +2 seconds of clone duration instead of +10 HP, preserving learned skills and save compatibility. Zabuza water clones and companions unchanged. Mist encounter relocated to Western Forest (-36,-18), same radius 12. Shared ARENA definition drives boss spawn, sentinel positions, campaign coordinates, minimap and quest hint. Cleared nearby tree obstructions and checked the west approach path; ambient fog follows the encounter. Old eastern encounter entry removed; existing eastern training, chest and regional progression retained. Full JS regression suite passed with mocked UI/render/audio, including one-hit clones, endurance skill, west entry, arena bounds and existing saga mechanics. Browser layout, visual map and Cloudflare deployment remain unverified. Production unchanged. Preview https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/.

## v1.11i release / v1.12 design
v1.11i merged to main via PR #26, commit a5f7845018a1a442398c6f5ec89dab28f1e4fe7d. Full regression passed with mocked renderer/audio/UI. Production URL https://naruto2-5d.pages.dev/; Cloudflare live version not independently verified. Next work is isolated in feature/v112-world-bosses, design only, see docs/V112-WORLD-BOSSES.md. Kabuto, Gaara, Orochimaru in that order; independent encounters and separate save progress from Mist Saga, no gameplay changes yet. Preview expected https://feature-v112-world-bosses.naruto2-5d.pages.dev/ (unverified).

## v1.12a beta — Kabuto: The Medical Prodigy (implemented)
Independent world boss registry with validated worldDefeated list inside existing bossProgress; legacy saves default to empty, Mist campaign completion and Kyubi unlock untouched. Northeast medical outpost (36,-30), radius 12, reachable entry with interact, mint minimap marker, unique procedural Kabuto sprite sheet and portrait with glasses, silver hair, ponytail, violet clothing, and chakra hand accents. Prebuilt laboratory arena with floor tiles, cyan/green columns and medical benches, world isolated. Solo fight, 1500 HP, phase dialogue at 50%, camera closeups at intro/phase/ending. Chakra Scalpel line attack 3s cooldown / .55s tell / 19 damage; Nervous System Disruption 12s cooldown / 1s tell / 12 damage and 5s 40% regen reduction on unavoided hit; Medical Regeneration 20s cooldown / 2s interruptible cast / +90 HP with 270 total healing cap; interrupt at 35 damage or guard-breaking strike. Evasive Step 7s cooldown lateral displacement, no invulnerability. Phase 2 +15% move speed and Surgical Cross 9s cooldown / .85s tell / 23 damage, two perpendicular forward hit zones. All cooldowns after execution, staggered initial availability, movement between attacks. Victory grants 650 XP, 420 ryō, 3 pills, Medical Gloves epic accessory (+3 chakra recovery, +8% ninjutsu) once. Sandbox launch supports repeat practice and Immortal; no save leakage. Defeat restarts Kabuto from beginning; no midfight checkpoint. No escape while active. Existing level stat growth remains proposal, not implemented. Full regression suite passed with simulated UI/renderer/audio including heal, interrupt, debuff, phase, save, replay and isolation. Visual appearance, performance and balance in real browser unverified. Production v1.11i untouched. Preview expected https://feature-v112-world-bosses.naruto2-5d.pages.dev/; Cloudflare unconfirmed. Gaara/Orochimaru not implemented.


## v1.12c — Gaara: The Sand Guardian
Experimental branch: 1900 HP, destructible 240 HP sand armor (4s / 18s cooldown), sand wave, sand coffin with temporary quicksand, phase 2 partial Shukaku with procedural claw/tail and annular Sand Tsunami safe center. Southern Sand Basin (36,34), sandbox and first-clear epic Sand Armor. Focused simulation and syntax passed; full regression and browser/Cloudflare unverified. Production remains v1.11i. Preview https://feature-v112-world-bosses.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v112-world-bosses. See docs/V112-WORLD-BOSSES.md.


## v1.12d — Shukaku Unleashed
Gaara phase 3 at 665 HP (35%), dedicated directional pixel avatar 1.85x, one animated tail, orbiting sand chakra, new exclusive detonation, shuriken volleys, irregular tail strikes and eruption. Focused 75s simulation and syntax checks passed; full regression and actual browser/Cloudflare unverified. Production v1.11i unchanged. Preview https://feature-v112-world-bosses.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v112-world-bosses. See docs/V112-WORLD-BOSSES.md.


## v1.12e — Orochimaru: The Immortal Serpent
Independent 2400 HP boss, Forbidden Underground Laboratory (40,12), 3 targetable serpents, venom, phase 2 at 50%, one-use body shedding at 30% (160 HP husk, 3.5s, +360 HP if not destroyed), epic Kusanagi. Focused 70s logic and syntax passed; full regression, actual browser appearance and deployment pending. Production unchanged. Preview https://feature-v112-world-bosses.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v112-world-bosses. See docs/V112-WORLD-BOSSES.md.


## v1.12f — Orochimaru: True White Serpent
Final transformation at 600 HP (25%) after body shedding resolves, 2x directional serpent sprite, animated tail and venom aura; exclusive fang lunge, lingering venom clouds, triple targeted eruptions and coil crush. No additional healing; previous phases and rewards preserved. Focused 70s logic and syntax passed; full regression, browser visuals and deployment pending. Production unchanged. Preview https://feature-v112-world-bosses.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v112-world-bosses. See docs/V112-WORLD-BOSSES.md.


## v1.12g — Kimimaro / The Last Kaguya
Independent 2800 HP boss, Valley of Bones (-30,32), Curse Mark I at 65%, II at 30%, three directional sprites, bone projectile volleys, four retargeted Seedling Fern eruptions with 5s slowing fields, unique Kaguya Bone Mantle. Focused 90s logic and syntax passed; full regression, browser visuals and deployment pending. Production unchanged. Next phase: Jiraiya sparring, authored loss, persistent Part I completion and Shippuden teaser (not implemented). Preview https://feature-v112-world-bosses.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v112-world-bosses. See docs/V112-WORLD-BOSSES.md.


## v1.12h — Valley of the End
Sasuke (2600 HP), four forms at 70%, 45%, 24%, scripted last clash at 5% or Naruto defeat in phase 4. Waterfall, water floor and twin stylized statues, Sharingan counter, curse mark sprites/wings, Chidori vs charged Rasengan with deterministic results, narrative exit and unique Memory of the Valley. Gate: Mist Saga + four independent villains. Focused 90s simulation and mocked-game integration (phase floors, reward, save/reload, clash win/loss, Immortal) passed; full regression, real browser visuals and deployment unverified. Production unchanged. Jiraiya training and Part I finale remain next phase. Preview https://feature-v112-world-bosses.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v112-world-bosses. See docs/V112-WORLD-BOSSES.md.


## v1.12i — Mandatory Mega Chidori / Mega Rasengan finale
Animated twin Sharingan eyes + synthesized sound; enveloping violet aura with black lightning; mandatory four-second lethal channel at 5% HP. Hold G or Space (remappable) for 1.25s at full chakra; automatic synchronized launch, impact, both down, Sasuke normal injured sprite and departure, dialogue and unique reward on success only. Early death or timeout = defeat, retry or return without losing previous progress; final timeout overrides Sandbox Immortal. Full smoke suite passed with mocked renderer/audio/UI, including both charge inputs, release, retry, persistence and failure. Real browser visuals/audio and Cloudflare deployment unverified. Production unchanged. Preview https://feature-v112-world-bosses.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v112-world-bosses. See docs/V112-WORLD-BOSSES.md.


## Production promotion — 2026-11-24
v1.12i was merged to `main` via PR #27 (https://github.com/Whoisnicko/Naruto2.5D/pull/27). Tested beta tree preserved exactly at merge commit `7bb87384bded97e66cde643e5489c404fb84c9b4`. Production URL: https://naruto2-5d.pages.dev/. Cloudflare deployment could not be independently confirmed (no GitHub deployment status and public URL inaccessible from this environment); verify the in-game version label `v1.12i beta`. Previous production commit for rollback: `a5f7845018a1a442398c6f5ec89dab28f1e4fe7d`. Jiraiya remains pending. Historical beta entries above describe their original release state.
