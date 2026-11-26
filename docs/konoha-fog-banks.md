# Mundo 3C.5.2 — Fog banks
Base ebd8770e4c719a888f1b3c9e94df5ed05c6a1721. User approved all 3C.5.1 effects except homogeneous fog, asked to preserve FPS.
- Fog-only: two tileable 128x128 procedural opacity maps baked once lazily, composited to a 320x180 buffer at up to 20 Hz; thin background veil plus cloud banks with variable density and two directions of motion. One scaled image per visible frame. No per-frame noise generation or new external assets.
- Adaptive degradation to one layer at 10 Hz after sustained frame times over 33 ms, recovery with hysteresis; static in reduced-motion mode; original fog remains fallback if canvas unavailable. No changes to day/sunset/night, lights, rain, storm, sound, movement or campaign.
- 13 model/command tests passed; script syntax checked. Not a real FPS benchmark or visual browser verification. Cloudflare deployment unverified and standalone HTML not regenerated.
Preview https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html?v=3c52
GitHub https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
