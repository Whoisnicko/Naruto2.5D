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

## v1.11a beta — The Demon of the Mist (implemented)
First playable scripted encounter, using the existing eastern forest arena (32,-2). Discover without campaign prerequisite, lead as Naruto, use interact near the marker; normal NPC/chest interaction takes precedence. Standalone sandbox Zabuza/Haku buttons retained; new Mist Saga button tests full sequence. Stages: Zabuza + Kakashi until 180/360 HP; arrival dialogue; Haku + Sasuke until 150/300 HP; Sasuke knocked down, unlock and automatically activate current Three Tails (14 s, +10% max HP/s); Haku second half with breakable mirror objects and teleport between surviving mirrors; wrath scene in which Zabuza strikes Haku while attempting to attack Kakashi (alternate story); Zabuza returns with remaining 180 HP, +45% base speed, stronger and faster new attacks, fog; Kakashi + Sasuke; ending and first-clear rewards. Companion AI follows/attacks targets and has health/cooldowns; Sasuke may target a nearby mirror. Boss targets alternate between allies and Naruto. Cinematic dialogue uses existing sprite portraits, camera focus, staged cast, tilted fallen sprites and flashes, not new bespoke animations/videos. Pause damage during dialogue; Next, Enter, Space or interact advance.
Checkpoints persist in v11 bossProgress (mistStage, kyubiUnlocked). Retry after defeat/retreat from phase start, not exact health. Older saves retain Kyubi, completed encounters remain completed, one prior Zabuza victory resumes Haku and does not re-award Zabuza loot. New saves unlock only at awakening; Sandbox has free access. Existing campaign epilogue requires both boss victories plus initial mission. Final awards existing mistBlade/iceMask and consumables, 550 EXP and 400 ryō if neither was earned before. No duplicate first-clear rewards. Weather, controls and existing saves retained. Regression suite passed in JS harness with render/audio/UI mocked; real graphics, effects, sound, ally balance and FPS not yet independently verified. Gaara, Kabuto, Orochimaru and broader world-boss registry remain future work. Preview expected: https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/ (Cloudflare unconfirmed). Production v1.10f unchanged: https://naruto2-5d.pages.dev/.
QA: sandbox Mist Saga; advance dialogue; inspect Kakashi aggro; cross 50% Zabuza; inspect Haku/Sasuke, mirrors, 50% awakening; defeat Haku, verify Haku falls and wrath attacks; die and retry final checkpoint; complete final reward; exit sandbox and verify campaign unchanged. `node tests/smoke.mjs`.

## v1.11b beta — Cinematic flow and isolated boss arena
Fix for reported stuttering at saga start: previous dialogue path rendered only every 100ms (10fps), despite RAF-based FPS display. Render dialogue every animation frame, camera interpolation on real frame delta and feedback timers continue during scenes. Avoid duplicate first-stage creation after opening dialogue; reset feedback at scene transitions and limit boss-hit hit-stop to 18ms. Warm four encounter sprite pools/textures gradually at title. FPS now counts actual rendered frames and shows maximum frame interval in ms. No measured GPU improvement claimed.
- Prebuilt dedicated circular arena at existing coordinates (32,-2), with its own simple clearing, perimeter trees and visible boundary. Hide exploration terrain, props, tree instances, NPCs, chests, map/event HUD and weather particles while active. Suspend world clock, NPC routines, weather, events and enemy respawns; shift suspended timers on exit. Encounter updates only relevant actors, effects and projectiles. Normal and sandbox standalone world bosses use the same isolation, exams remain unchanged.
- No walking, dashing, substitution or Rasengan escape through arena boundary; boss no longer despawns on distance. Pause-to-title is disabled during encounter. Death preserves existing phase checkpoint and returns to Konoha. Sandbox Exit is retained as an explicit testing override.
- Camera shots per dialogue: 1.32–2.05x orthographic zoom, subtle horizontal camera angle rotation and elevated focus on speaker; smooth return to combat view. Existing sprites and portraits reused.
- Kakashi and Sasuke circle, approach, retreat from telegraphed attacks, and use separate timed jutsu with windup: Water Dragon / Raikiri, Fireball / Chidori. Visible fire/water projectiles and lightning impact, companion health and technique labels. Damage and cooldowns are provisional. No new Zabuza attack patterns in this iteration.
- Full logic smoke suite passed with mocked renderer/audio/UI, plus arena boundary, frozen NPC/world clock, ally displacement/jutsu and camera shot assertions. Browser GPU performance, precise framing, actual asset visuals and balance still need playtest. Production remains v1.10f. Preview expected https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/ (Cloudflare unconfirmed).
QA: launch Mist Saga from sandbox, advance opening dialogue and compare actual FPS/max frame ms; observe camera closeups, wait for both allies' techniques; attempt escape with sprint/dash/Rasengan and verify boss remains; defeat and retry checkpoint; exit sandbox and confirm world resumes.

## v1.11c beta — The Hidden Mist
- World entry: persistent bright pink minimap marker and named quest hint while Mist Saga incomplete; visible Zabuza/Haku sprites in eastern forest at (32,-2) and (33.8,-3.4). Interact within 5 units prioritizes the saga before nearby chest/cache/NPC; no training prerequisite. Completed saved encounters remain completed; sandbox available for replay.
- Zabuza 1440 HP and Haku 1200 HP (+300%, 4x); half phases 720 and 600. Faster movement, windups and cooldowns; randomized available attack selection excludes immediate repeats. Normal and wrath Zabuza launch 3s homing Water Dragon and summon up to 3 water clones per cast (max 4, 45 HP, 9s lifetime). Clone contact traps Naruto in a Water Prison: alternate mapped left/right keys (default A/D) 12 times within 4.5s, touch buttons work; failure causes 22 base damage, 2.5s capture immunity on release. Explicit prison status cancels charge, but ordinary damage still preserves Rasengan. UI time updates at 10Hz. Haku teleports among surviving mirrors, independently fires needle fans and additional phase 2 volleys; max 40 concurrent projectiles at needle spawn. Existing stage/arena/checkpoint isolation preserved. Kyubi locked during full saga stages 0/1 even in sandbox or legacy unlocked save; old unlock outside saga and standalone sandbox practice retained. Awakening scene adds 4.8x closeup, camera look height 1.7, shaking WWRRAAAH!! dialogue, existing synthetic roar effect. Transform after dialogue advances. No recorded voice or bespoke animation.
- More ambient fog, stronger boss fog, two traversable shallow river sections (z -20..-12 and 16..24), turquoise terrain and minimap strips; remaining deep water retains collision. Full logic smoke suite passed twice with mocked renderer/audio/UI (world entry, HP/phase thresholds, homing, clone capture, alternate keys, timeout, mirror teleport/needles, unlock and camera assertions). No browser visual, audio or FPS verification; difficulty values provisional. Preview expected https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/; Cloudflare unconfirmed. Production v1.10f unchanged.
QA: fresh game, find bright pink marker east of bridge, enter with interact; dodge tracking dragon; allow clone capture then alternate controls and test timeout; verify 50% transitions, Haku mirror teleport, awakening roar/closeup, no escape, final rewards. Walk on shallow water; check visual fog and frame pacing.

## v1.11d beta — Zabuza Combat Rebalance
Zabuza and wrath use independent ability cooldown groups measured after strike: sword 3s (shared across sword slash/whirlwind), dragon 7s, water clones 12s. Initial availability staggered (dragon 2.5s, clones 5s); random selection among available in-range patterns. Dragon channels stationary for exactly 2 simulation seconds in both phases, tracks aim while casting, displays cyan ground rings and a cast progress bar; existing 3s homing projectile unchanged. Sword radius normal 4.2 / whirlwind 5.2; wrath 4.8 / 6.2; windups normal .48/.55, wrath .40/.48. Reposition/orbit, direction reversals and pursuit between casts; retain ally targeting. HP, damage, clone lifetime, prison and Haku mechanics unchanged. Full regression suite passed in JS harness (renderer/audio/UI mocked); 65-second normal and wrath simulations assert minimum cooldowns, shared sword timer, 2s dragon channel, movement and all three abilities used. Browser playtest/balance and Cloudflare preview not independently confirmed. Main/production unchanged v1.10f. Preview: https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/.

## v1.11e beta — Zabuza cooldown tuning
Dragon cooldown 12s and water clones 20s after execution, in both phases. Sword shared 3s cooldown, dragon channel 2s, homing duration 3s, initial stagger, HP, damage and movement unchanged. Full JS smoke suite passed with mocked renderer/audio/UI, including 65-second simulations of both forms. Browser playtest and Cloudflare preview unconfirmed. Production unchanged v1.10f.
## Proposed level scaling (design, not implemented)
Current level = 1 + floor(XP/100), level grants skill points but no automatic base stats. Suggested automatic growth per gained level: +5 max HP, +3 max chakra, +2 attack, +1 flat defense per 3 levels gained, +0.5% movement speed and +0.5 percentage points critical chance; cap automatic bonus at level 20 initially, keep equipment and skill tree independent. Review normalized 0–100 HP/chakra storage, damage, healing, consumables, save migration, HUD, and Kyubi 10% max-HP/s before implementation. Do not modify XP thresholds or character stats until proposal approved. Preview https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/.

## v1.11f beta — Haku Combat Rebalance
Haku world boss uses one offensive timer: a single combined teleport and randomized 5/7/9 needle volley, with 5s cooldown measured after firing and existing .30–.40s preparation. Removed independent mirror barrage and extra phase-two volley. Between casts Haku repositions on foot. Ice Shield activates every 20 simulation seconds (start-to-start within each phase), lasts 3s, cancels current windup and prevents movement/attacks; existing fired projectiles can still travel. All damage sources blocked before damage/rage processing, mirrors remain independently destructible. Ice crystals, cyan rings, sprite tint, IMMUNE feedback and HUD countdown. Both scripted phases and standalone sandbox Haku use same AI. HP 1200, Zabuza timing, saves, progression unchanged. Full JS regression suite passed with mocked renderer/audio/UI, including 65-second simulations for both phases, volley intervals, shield cycle, immunity and restoration. Browser visual and actual difficulty remain unverified. Preview https://feature-v111-legendary-shinobi.naruto2-5d.pages.dev/ (Cloudflare unconfirmed). Production v1.10f unchanged.
QA: Sandbox Haku, observe 5s minimum volley interval; wait 20s for shield, attack during shield with taijutsu and Rasengan, verify 3s countdown and damage resumes, exit sandbox. Repeat in full Mist Saga.

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
QA: sandbox Kabuto, enable Immortal, interrupt healing, observe chakra regen debuff and phase transition, dodge Surgical Cross, defeat once and replay, confirm reward uniqueness and exit restoration. Try normal map approach and save/reload.


## v1.12b — Kabuto: The Forbidden Surgeon
Experimental branch only. Medical Regeneration up to 450 HP, special-only interrupt, Chakra Extraction and three-pulse Autopsy Protocol; see docs/V112-WORLD-BOSSES.md. Focused logic and syntax passed; full regression, real browser and Cloudflare unverified. Production v1.11i unchanged. Preview: https://feature-v112-world-bosses.naruto2-5d.pages.dev/ ; source: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v112-world-bosses.


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


## v1.12j — Production hotfix: frozen boss dialogue
Reproduced the actual animation callback crash `ReferenceError: vd is not defined` during periodic boss HUD refresh; `vd` was scoped to render(), not loop(). Resolve the final duel state with valleyFinal() in HUD, register the next animation frame at loop entry, and cap paused dialogue rendering to about 30 FPS while preserving elapsed animation time. Added regression invoking scheduled frames, clicking dialogue Next, Enter, returning to gameplay and final Mega Chidori HUD. No changes to balance, save format, or finale mechanics. Production URL https://naruto2-5d.pages.dev/. Cloudflare deployment and real browser rendering not verified.
