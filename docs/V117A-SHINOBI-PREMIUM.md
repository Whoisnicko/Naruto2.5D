# v1.17a Shinobi Premium HUD


## Production v1.16b — 2026-11-24
Player approved v1.16a and v1.16b; PR #33 https://github.com/Whoisnicko/Naruto2.5D/pull/33 merged at 788bd8293fec611e19c7c82e6493fba4f90ff7f9. Zero file differences against approved f72fea269626a8e16a31b18f466e20cf248a3267. Production https://naruto2-5d.pages.dev/ ; actual Cloudflare status unverified. Prior stable 8e55ea5867ca087de02d0aafb8f7a98e9d9270a2.

## v1.17a beta — Shinobi Premium HUD & UX
Separate assets/shinobi-ui.css, forest/aged gold/parchment visual tokens. Resource HUD with portrait from real in-game atlas, numeric health/chakra/stamina/XP, compact Kyubi and combat status. Skill dock: inline vector icons, character-specific jutsu variants, keys, costs, circular cooldown mask/time, distinct low-chakra state, charge tooltip; B/V hold controls with active state. Boss portrait, numeric HP, current phase pips independent of real HP thresholds, existing cast/shield information retained. Quest/map legend, utilities collapsible, persistent FPS/version, optional immersive view saved separately from campaign. Responsive desktop/coarse-pointer layouts; existing inventory, settings, dialogue, journal, pause and sandbox restyled, not mechanically rewritten. Original title artwork retained. Existing IDs and pointer handlers retained, keyboard skill focus handled, no new world render pass. Updates at existing 200ms HUD cadence; actual frame performance and visual layout unverified. Corrected Kyubi tooltip from inaccurate +10% to +3% HP/s. All simulated regression and new HUD state tests passed. Tested code 868ce556bd4df56b51fdb87f890a993bb7f76556. Preview expected https://feature-v117-hud-ux.naruto2-5d.pages.dev/ ; source https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v117-hud-ux ; main stays v1.16b. Next: v1.17b detailed menu/inventory UX only if needed after player feedback; then v1.18 stress testing.

## QA
- At 1920×1080, 1366×768, 1280×720 and small touchscreen: inspect overlapping/overflow, controls and tool panel.
- Test all four playable characters, remapped controls, mouse/touch hold charge, cooldown/cost and low chakra.
- Test boss phase/shields/channel, sandbox collapse, prison and scripted endings.
- Toggle immersive, map/legend, tools and pause; reload to verify UI preference independent of campaign save.
- Compare FPS/P95/resolution with prior ~99 FPS reference in same fight.
- Validate actual browser and Cloudflare preview before promotion.
