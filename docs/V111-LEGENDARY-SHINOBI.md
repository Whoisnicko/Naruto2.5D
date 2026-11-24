# v1.11 — Legendary Shinobi (design only)

Approved initial roster: Zabuza Momochi, Haku, Gaara, Kabuto Yakushi, Orochimaru. Classic Naruto era; postpone Konoha Invasion. No gameplay changes in this design phase.

## Proposed encounters
| Boss | Arena concept | Suggested HP | Mechanics |
|---|---|---:|---|
| Zabuza | Misty lake | 360 | Existing sword slash, water dragon, mist; improve surprise attacks |
| Haku | Frozen grove | 300 | Existing ice needles; breakable mirrors and movement between mirrors |
| Kabuto | Abandoned laboratory | 420 | Chakra scalpel, limited regeneration, temporary debuff, dodge |
| Gaara | Sand frontier | 560 | Sand shield, sand burial, waves, partial Shukaku |
| Orochimaru | Secret hideout | 750 | Snakes, Kusanagi, extended neck, limited skin-shedding recovery |

HP values, arena locations and additional mechanics are proposals, not implemented or tested. Zabuza and Haku reuse existing rewards and base statistics. New unique loot to be balanced. No more Naruto transformations in this phase.

## Architecture and migration
- Keep the existing campaign progress for Zabuza and Haku separately from a new independent world boss registry; old saves remain compatible. Decouple campaign completion from total world boss count. Map discovery is persistent; no exact position shown before discovery.
- Boss definitions hold arena coordinates, phases, stats, loot, intro and behavior; shared encounter state tracks discovery, battle, defeat/retreat, and first-clear reward. Reuse current warning hitboxes and boss HUD. Do not lock access behind campaign completion. Avoid NPC/terrain overlap; test collision and actual reachable placements before committing arena locations.
- On retreat or defeat, reset encounter; allow replay, no repeated unique loot. Sandbox buttons for all five, isolated from saves. Bosses do not use common enemy 60s respawn.
- Incremental implementation: first separate encounter framework and Zabuza/Haku; then Kabuto, Gaara, Orochimaru with dedicated assets and behavior. Use fallbacks, English UI, retain Kyubi/controls/weather and campaign.
- QA: existing save migration; discover in any order; independent arenas; no accidental duplicate reward; retreat and retry; sandbox isolation; actual visual/FPS checks.

Production unchanged v1.10f: https://naruto2-5d.pages.dev/
Repository: https://github.com/Whoisnicko/Naruto2.5D
Design branch: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v111-legendary-shinobi
Preview not applicable yet (design only).

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
