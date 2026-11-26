# Mundo 3C.5.1 — Atmosphere hotfix
Base 4bd1d5d27ab9bb0bd0a1fd857ac5a4c4e2e7cb37. User rejected night lighting, weak fog/rain/storm, audio and dawn.
- Day unchanged at neutral grade. Only day/sunset/night in controls, 360 s simulation cycle retained. Sunset stronger warm sepia, saturation, orange wash. Night uses darkness mask with local cutouts and amber illumination around visible actual lamp sprite heads and ground; four lamp sprites added to outpost. Forest remains dark, slight local visibility at character. Screen-space approximate lighting, not physical shadows or volumetric rendering.
- Fog increased to .83 target plus layered mist; rain target .86, up to 390 streaks; storm target 1, up to 560 longer slanted streaks, darker scene, visible branching bolt and two flash pulses per event; first within 0.65–1.30s, subsequent 4.5–8s simulation intervals. Reduced-motion users get static lower-density rain and no flashes. No gameplay changes.
- Removed synthetic audio implementation and controls completely. Original campaign files untouched. 
- 15 logic/Canvas command checks passed; combined script syntax valid. Actual visual perception, WebGL, Cloudflare and standalone file not validated/generated. Builder updated.
Preview https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html?v=3c51
GitHub https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
Production https://naruto2-5d.pages.dev/
