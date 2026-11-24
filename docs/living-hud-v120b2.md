# Living Shinobi HUD — v1.20b.2 beta

Base: v1.20b.1 (f5e781fdbec344f012267de686065a52ffd98f78). Production unchanged. Two approved portraits are taken directly from the supplied asset sheet; four transparent WebP textures preserve the painted bars and darken only the filled interiors for the empty state. SVG clips reveal the original pixels using actual HP, chakra, stamina and fury; the active portrait is selected only from the actual transformation state. The old seal DOM remains a hidden compatibility source; no separate visible bubble. Clicking the portrait delegates to the existing activation button and its eligibility guard. No change to gameplay logic, damage, timers, save schema or controls. Other characters retain their existing HUD. Missing images use original bars and portrait with CSS radial meter. UI Lab supports resource sliders and art fallback.

Validation: Chromium isolated DOM fixture using the exact four textures, 21 layout combinations and functional assertions. This is not a full game or Cloudflare deployment test. Existing world art, mission scroll, toolkit and minimap are unchanged in this phase. User playtest required before promotion.

Preview (expected): https://feature-v120b2-living-hud.naruto2-5d.pages.dev/
Lab: https://feature-v120b2-living-hud.naruto2-5d.pages.dev/ui-lab.html
Source: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v120b2-living-hud
Drive: https://drive.google.com/drive/folders/1lLRCKby4Ev5Vw1Bl6rLWqPjieIqsq-Mf
