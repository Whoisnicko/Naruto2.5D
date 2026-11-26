# Mundo 3C.6.14 — Kyūbi Visual Polish
26/11/2026. Parent 58a5ab94844623a0707b349d98c0fe1f98e5cc5d; approved art review b788ae4d97168b219f20c043a05cb8371b9c4d0b, 7/7 OK, no comments. 3C.6.13 playtest 24/27 OK, no functional failures; Sasuke/Sakura/Kakashi pending. Combat 9/10, 80 FPS at both 24/48 enemies, 76 FPS P95 20.9 ms, 1% low 34 FPS, 10/360 spikes, 90% scale. Keep all prior validations and pending items.

## Changes
Exact approved eye/whisker/fang patch from standalone review, 24×32 cell/64 frames/4 directions. Shared actor sheet affects transformed Naruto (and transformed clone sheet if requested), normal actor pixels unchanged. Shared original aura/tail generator rasterized at 64px into at most four direction textures; actor-depth sorted mesh just before each transformed owner, same size and projected ground anchor. Canvas fallback renderer includes aura mesh, exceptional texture failure uses ground ring. Foreground claw, purple orb, charge, smoke, burst and gameplay untouched. Existing classic preview may inherit the shared transformed facial pixels; classic aura order unchanged. Main and version-vieja untouched. No new assets or changes to map/physics/save/HUD layout. Game links versioned to 3c614.

## Verification
{"approvedRasterCells":256,"changedFrontSideCells":192,"unchangedBackCells":64,"unchangedNonKyubiCells":1280,"layerChecks":8,"syntaxChecks":4,"method":"deterministic raster mock and layer lifecycle mock; no browser/GPU"}. All tests executed in a mock environment; no actual browser/GPU FPS or final visual validation; offline standalone HTML not rebuilt. No new performance claim. Art approved before integration; in-game regression pending. Phase 4 open for validation of three other heroes and final Kyūbi check. Next phase 5 enemies/mechanics, then 6 bosses/cinematics.

Preview https://preview-konoha-world3c.naruto2-5d.pages.dev/?v=3c614
Sandbox https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html?sandbox=1&v=3c614
Production https://naruto2-5d.pages.dev/
Art review https://6c80e499.naruto2-5d.pages.dev/kyubi-review-3c614.html
