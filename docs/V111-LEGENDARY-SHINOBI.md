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
