# Project Hades — v1.15c Combat Overhaul I


## Production v1.15b — 2026-11-24
Player approved Performance Core, reported approximately 99 FPS and improved fluidity/quality. Effective resolution and frame percentiles not reported. PR #31 https://github.com/Whoisnicko/Naruto2.5D/pull/31 merged at 59e643746c8ccec1d54552c8f07f2b012b2e1c8e; zero file differences vs approved candidate 03692aeb565accc8ddcd0e1118fc6abb4f33e178. Production https://naruto2-5d.pages.dev/ ; Cloudflare status empty, live production deployment unverified. Rollback reference ae3680e73292bc0d95c4fca68b901bc03a8b0e82.

## v1.15c beta — Project Hades Combat Overhaul I
Q then J during the dash (logical remappable actions) triggers one dash strike per dash if Taijutsu cooldown is ready; 85% base physical damage, 55ms windup and 240ms recovery, unchanged original attack cooldown, dash travel/cost/invulnerability. Existing swipe and attack pose reused, no new sprite assets. Movement direction stays locked independently of strike facing. Manual attacks use movement or last facing; physical attack cone ~130 degrees, wall-aware hits, optional target assistance picks visible aligned enemies within 45 degrees either side of aim, prioritizing distance and alignment. Ordinary non-Kyubi physical attacks can step up to .38 units to a target within .45 units beyond normal range; no lunge on dash strikes. Standard manual projectile throws align to aim and no longer snap to targets behind; scripted/automatic attacks and Rasengan charge/carry unchanged. Ordinary j/k/f/l actions can link within final 90ms of recovery once impact resolved and new skill cooldown ready. Charged Rasengan and scripted finales excluded. Existing dash cancel, cost, damage rules and boss restrictions retained. Focus/modal clears a pending dash strike; saved schema remains v11. Full simulated smoke suite plus focused dash distance, once-per-dash, cooldown, directional hit, aim toggle, blocked targeting, chain and focus checks passed using JS isolate adapters; actual WebGL, touch, perceived feel and FPS not independently tested. Production stays v1.15b. Preview expected https://feature-v115-hades-combat.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v115-hades-combat ; tested code 027e76ae8f0936dc2f6fee4132c7c122962471e1. No promotion without player approval. Next: animation transitions and advanced game feel, then HUD/UX and stress test.

## Manual playtest
- Q then J while moving toward a target. Try with remapped controls and touch if available.
- Compare a frontal vs rear target, with assistance enabled and disabled.
- Link J → K → F; cooldowns and chakra costs should remain intact.
- Dash away from Sasuke's Black Chidori; verify clash and Jiraiya finale remain unchanged.
- Compare FPS and p95 with v1.15b ~99 FPS player-reported baseline at equivalent graphics settings and encounter. Confirm effective resolution.
