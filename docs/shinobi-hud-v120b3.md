# Shinobi HUD: Definitive Edition — v1.20b.3 beta

Base v1.20b.2 (0bf5af035d88ca7f688a274d0dc2a3bb8aa499f1). The player profile omits visible HP, chakra, stamina and experience numbers, adds a thin neon-green experience meter beneath the illustrated stamina bar and puts only the current percentage of fury over the existing two-state portrait. Live resources and activation eligibility remain authoritative. XP already levels at every 100 experience; no progression changes. Existing mission DOM moves into the Journal (U or Journal button); live minimap remains interactive, with a transparent ring and floating region/time/weather/legend. The new dock, menu, icon atlas, quick slot and defense button art are extracted from approved user reference; labels, key bindings, counts, cooldowns, costs and actual item icons remain dynamic. On mobile the dock adapts to the existing responsive layout rather than stretching the desktop scroll. Six WebP textures (88,360 bytes); grouped asset preload with CSS/canvas fallback. No gameplay, save, boss AI or combat changes; game.js version text only.

QA: 42/42 layout scenarios in Chromium with actual HTML, CSS and UI Lab module and exact six new and four Living HUD textures. Older art not available in local QA used normal fallbacks. Functional checks for XP fill/reset, fury/transform, hidden resource values, Journal placement and map toggle passed. This is not a real campaign, GPU/FPS or Cloudflare verification. Mock quick item glyphs in the lab are sample values only; real game uses its original live item art. See docs/finished-hud-test-results.json.

Preview expected: https://feature-v120b3-definitive-hud.naruto2-5d.pages.dev/
Lab: https://feature-v120b3-definitive-hud.naruto2-5d.pages.dev/ui-lab.html
GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v120b3-definitive-hud
Drive: https://drive.google.com/drive/folders/1lLRCKby4Ev5Vw1Bl6rLWqPjieIqsq-Mf
Main unchanged; do not merge before user playtest.
