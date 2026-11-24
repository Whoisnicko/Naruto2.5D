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
