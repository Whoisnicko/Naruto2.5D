# Naruto 2.5D — Fullscreen focus hotfix

Base: 19e816cf44bb0277ad2a405b21bba6ff3c1698f6, feature/itch-web-shell (user approved on itch.io). Release focus from the activated fullscreen button before requesting fullscreen and on completion if it regained focus. This preserves native user activation, accessibility, error handling and the existing key bindings. No changes to combat, graphics, save files, loading screen, or responsive HUD. Do not remove the keyboard focus outline or globally suppress Space.

QA: Chromium isolated iframe fixture using actual web-shell JS/CSS. Click enter/exit fullscreen then press Space: keydown and keyup reach a synthetic gameplay input listener and fullscreen state remains unchanged. Intentional keyboard activation and denied permission also pass. Previous startup and fullscreen tests pass. Actual Rasengan, Firefox, itch.io and Cloudflare require user verification.

GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/itch-web-shell
Archive: https://github.com/Whoisnicko/Naruto2.5D/archive/refs/heads/feature/itch-web-shell.zip
Cloudflare preview expected (not verified): https://feature-itch-web-shell.naruto2-5d.pages.dev/
Production: https://naruto2-5d.pages.dev/ (main unchanged until approved)
Itch.io: keep index.html at ZIP root, replace previous upload, browser-play option enabled. Test fullscreen, hold/release Space for Rasengan, exit fullscreen, repeat, and verify existing saves.
