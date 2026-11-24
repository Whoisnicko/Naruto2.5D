# v1.16b Advanced Game Feel


## v1.16b beta — Advanced Game Feel (2026-11-24)
Player approved v1.16a animation quality. This beta branches from approved animation commit a846f86e2f055e58c84d7729adbf54a9fa4234ea. Production main remains v1.15d at 8e55ea5867ca087de02d0aafb8f7a98e9d9270a2; no explicit promotion requested this turn. Nine cosmetic contact profiles (light, heavy, critical, chakra, Kyubi, block, break, dodge, hurt). Actual accepted contact emits directional spark fan and optional ring into existing effect mesh. Eight reusable bursts maximum; density respects quality, dodge feedback throttled to .18s. Camera directional impulse and subtle zoom decay in real time, scaled by existing shake preference (35% default), disabled with shake off, new camera impulses excluded in cinematics and prisons. Existing hit-stop, damage, AI, resources and cooldowns unchanged. Procedural audio distinguishes critical, chakra, block, break, dodge; optional stereo panning by relative horizontal position, mono fallback, existing 14 voice limit, mute/volume preserved. Full simulated regression suite passed, plus Web Audio mocked panner, clamp, cap, cleanup, mute and fallback test. No actual acoustic playback, GPU/FPS or visual QA; Cloudflare deployment unverified. Tested code f2f2929b6025e42bb9cd8c951b10433f9f5e8dfb. Preview expected https://feature-v116-advanced-game-feel.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v116-advanced-game-feel ; production https://naruto2-5d.pages.dev/ . Next v1.17 HUD & UX after approval.

## QA
- Compare light, heavy, critical and chakra hits, normal and Kyubi.
- Block, deplete stamina, dodge; check cues only on relevant contacts.
- Compare shake at 0/35/100% and sound mute/volume.
- Fight Sasuke/Jiraiya; preserve boss telegraphs and finales.
- Compare FPS, p95 and effective resolution under identical encounter with prior ~99 FPS reference.
