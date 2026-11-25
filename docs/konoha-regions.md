# Mundo 3C.4 — Viajes regionales
Base ae69592dedf8c39e6b473e9474cb4ba952e4f872. Preview only; PR #34 remains draft. No production or legacy campaign/save edits.
- Konoha ↔ Bosque de entrenamiento ↔ Puesto fronterizo (provisional settlement in Land of Fire). Explicit E/button near exit, two-way passages, validated spawn positions and road transition with fade. Exterior maps reuse the approved illustration kit, collision circles and separate geometry sets; not final art or full cities. No NPCs or combat in new regions yet.
- M: existing 8 Konoha fast-travel points remain unlocked for test; forest clearing and outpost plaza require reaching them on foot once. After discovery, cross-region travel works both ways. Location state resets on page reload; player/hero, currency, inventory, health, XP, quest flags and discoveries are kept in memory across map changes.
- Iruka scouting quest now requires the actual forest clearing, not the Konoha exit. Journal J works in all regions, Konoha NPCs and supply cache disabled outside Konoha. Existing Konoha art, sprint and camera preserved; lookout restricted to Konoha. Reset returns to current map spawn.
- 35 checks passed (router, collision, road links, discovery, quest, shared state); combined JS application syntax passed. Real browser, GPU, mobile, deployment and complete standalone HTML not verified/generated.
Preview: https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html
GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
Production: https://naruto2-5d.pages.dev/

## 3C.4.1 — Hotfix (user reported exterior maps not accessible, fast travel failed and south gate flicker)
- Preview intentionally unlocks all destinations; added direct buttons for all three regions. Campaign router default still requires discovery.
- South gate now has bidirectional connection with forest, and proximity prompt or walking into the passage starts travel. Added signage to Konoha exits. Real elapsed time prevents low FPS prolonging travel indefinitely.
- Candidate visual fix: separate overlapping road/circle heights and exterior ground patches, remove wall segment overlap, stable unique depth order for visible billboards. Real GPU verification still required.
- Version 3C.4.1 visible in HUD, query version on entry module/region import. Cloudflare URL not accessible from environment, older standalone not updated here. 20 targeted logic checks and combined app syntax passed. No browser/GPU test yet; do not approve visually until user confirms.

Runtime regression: 15 checks using real Three.js r169 geometry with simulated DOM/canvas/renderer and clock passed, including direct forest/outpost buttons, M menu return, low-FPS timer, NPC visibility, automatic south-gate passage, E return and unique depth ordering. These are not actual browser/GPU tests. Cloudflare preview could not be fetched; single-file export attempt hit tool-call limit, not regenerated. Previous standalone file is stale.
