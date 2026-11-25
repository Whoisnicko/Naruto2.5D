# Mundo 3C.2 — Konoha Village / NPC integration
Base: b6eea7cfe6e204687cfc736a0094a4d89da3da31. Preview only, PR #34; no merge, no production changes.

- Six original NPCs: Kakashi (plaza), Shikamaru (plaza), Sakura (hospital), Teuchi (Ichiraku), Tenten (mercado), Iruka (academia). Reuses original sprite sheets, roles, IDs and existing dialogue text (Kakashi gets a temporary lab greeting). Short collision-tested local patrols, directional idle/walk, shadows and depth ordering. Fallback for sprite construction.
- Four original heroes selectable for exploration only: Naruto, Sasuke, Sakura, Kakashi. The NPC counterpart of the selected hero is hidden. No campaign progression or character-specific combat in this lab.
- E or contextual button to talk; dialogue pauses movement, Escape or close returns to exploration. No shop, quest, healing or save side effects.
- Existing camera, sprint, fast travel and assets preserved. Standalone build script updated to extract original data exports; generated standalone HTML not built in this revision.
- QA: parsed JavaScript with syntax checks; tested all six patrol routes using actual layout blocked/step; verified original roster count. Browser rendering, mobile, GPU, fullscreen, regression tests and deployment not verified.

Preview: https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html
GitHub: https://github.com/Whoisnicko/Naruto2.5D/tree/preview/konoha-world3c
PR: https://github.com/Whoisnicko/Naruto2.5D/pull/34
Production: https://naruto2-5d.pages.dev/
