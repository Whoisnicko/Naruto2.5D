# Naruto 2.5D — Web startup and fullscreen

Base: `feature/itch-responsive-hud` at `3d321af81fbb1063d7877939dda14bcc8861ff26`. Experimental branch `feature/itch-web-shell`. No changes to campaign, combat, saves, sprites, original title image, or production.

## Implementation
- A self-contained branded overlay appears before the original title menu. It tracks 3 actual milestones: interface markup, title artwork settled (decoded or fallback), and successful import of the game module with New Game enabled (UI lab uses its own readiness flag). These are steps, not byte/download percentages. The existing engine import and startup paths remain authoritative. It does not wait for all optional HUD textures, lazy shader warmup, or first gameplay frame. No artificial delay. Missing title art falls back after 8s. Failed import or startup deadline of 60s exposes Retry and Legacy build; menu and HUD remain inert until successful boot.
- Fullscreen buttons on the title and utility dock request document-element fullscreen on user action; sync via fullscreenchange and support exit. Existing game resize handler handles viewport changes. If embed permission/browser disallows fullscreen, show a readable message. No auto-fullscreen or changes to save state.
- Existing responsive HUD CSS retained. No new images or external loading-screen dependencies. New styles are scoped. Desktop utility dock gains a compact fourth icon; title button sits outside the five-option kunai selector.

## QA
`tests/test_web_shell.py` uses isolated markup, actual new JS/CSS, simulated module readiness, and a missing cover. Chromium tested 941×534, 1280×720, 1920×1080, 390×844; menu gated until actual promise resolves, image fallback, rejected import error, allowed iframe fullscreen enter/exit, denied iframe fallback. `docs/web-shell-qa.json` records results. Full game, CDN availability, exact CSS cascade, Firefox, actual itch.io, and Cloudflare deployment not verified. No production merge.

## Publication playbook
- GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/itch-web-shell
- Source ZIP: https://github.com/Whoisnicko/Naruto2.5D/archive/refs/heads/feature/itch-web-shell.zip (extract then rezip contents, index.html at root)
- Expected Cloudflare preview (not verified): https://feature-itch-web-shell.naruto2-5d.pages.dev/
- Production: https://naruto2-5d.pages.dev/
- itch.io: HTML project; Embed in page, 960×540, enable Fullscreen button (or Click to launch in fullscreen). Upload correct web ZIP, check browser play, save draft and test menu, retry, New Game, fullscreen enter/exit and HUD at embed size. Actual itch project URL not known.
