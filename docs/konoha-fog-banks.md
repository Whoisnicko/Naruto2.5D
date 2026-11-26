# Mundo 3C.5.2 — Fog banks
Base ebd8770e4c719a888f1b3c9e94df5ed05c6a1721. User approved all 3C.5.1 effects except homogeneous fog, asked to preserve FPS.
- Fog-only: two tileable 128x128 procedural opacity maps baked once lazily, composited to a 320x180 buffer at up to 20 Hz; thin background veil plus cloud banks with variable density and two directions of motion. One scaled image per visible frame. No per-frame noise generation or new external assets.
- Adaptive degradation to one layer at 10 Hz after sustained frame times over 33 ms, recovery with hysteresis; static in reduced-motion mode; original fog remains fallback if canvas unavailable. No changes to day/sunset/night, lights, rain, storm, sound, movement or campaign.
- 13 model/command tests passed; script syntax checked. Not a real FPS benchmark or visual browser verification. Cloudflare deployment unverified and standalone HTML not regenerated.
Preview https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html?v=3c52
GitHub https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c

## 3C.5.3 — Fog seam fix
User approved the rest; reported intermittent vertical gaps in fog. Replaced four separately positioned subpixel drawImage tiles per layer with a single cached repeating CanvasPattern and oversized clipped fill. Removes internal rectangle boundaries; preserves texture data, speeds, opacity, resolution and adaptive quality. Isolated real Chromium Canvas test of the exact new layer transform with opaque source, 240 frames across two scales: uniform alpha 217, zero missing pixels. Old path did not reproduce the reported artifact in that isolated browser, so actual visual fix still requires user's validation. 8 additional model/Canvas command checks passed. No full game browser or FPS benchmark, deployment not verified and standalone not regenerated. Preview https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html?v=3c53
