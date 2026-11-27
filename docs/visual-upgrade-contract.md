# Visual upgrade contract — required for all new arenas

6B.3 approved 14/14 by user. User explicitly wants complete character sprite, animation and technique VFX upgrades after bosses/maps, without recreating combat or arenas.

## Verified current architecture
- src/konoha-combat.js and src/combat-data.js own field combat state, timing, damage, movement and hit logic without importing pixel-art. src/boss-data.js and game.js contain boss rules; game.js still mixes some procedural effects and combat presentation, so it is not fully decoupled.
- src/pixel-art.js is common procedural art source; actor-pose.js translates semantic actions into frame indices. Both render paths use those resources: src/konoha-three-lab.js and src/pixel-renderer.js. Separate Kyubi/VFX rendering in field and boss paths, hard-coded hand anchors (rasenganHand), sprite sizes and some procedural geometry in game.js still need an adapter for a full higher-resolution redesign.
- Scene modules receive arena data and render decorative geometry independent from sprites. Bridge remains approved unchanged; new Kabuto scene uses this contract. No promise of zero renderer changes.

## Compatibility baseline and future migration
1. Current atlas: 24×32 cells, 64 columns, four directions down/left/right/up, 19 named animation ranges. Preserve semantic animation IDs, frame ranges and action impact timing. Larger cell sizes are NOT automatically supported today: both renderers and previews need a metadata adapter.
2. Future art provider must expose character/variant ID, source dimensions, per-frame rectangle, world scale, foot pivot, direction, normalized hand/weapon/effect anchors, animation names and impact markers. Renderer converts to positions; combat timing, radius, movement, hitboxes and save format remain authoritative. Keep fallback atlas/shape if an asset is absent. New art may contain additional frames mapped to the original normalized action progress; never derive damage from atlas pixels.
3. FX rows and Rasengan blue/purple atlases, Kyubi aura/tails/arms and world-space technique placement must share semantic effect IDs. Separate geometry effects in game.js and field VFX must be inventoried and moved behind presentation adapters before full art replacement. Preserve telegraph radius and duration. Cosmetic changes are not balance changes.
4. Character visual review includes all heroes, normal/transformed variants, bosses and enemy roles, equipment layers, movement, attack, hit, death, portraits and cinematic anchors. Use actual sprite/animation viewers and user approval, not mockups. Test both exploration and boss scenes, multiple viewport sizes, and performance. No change to approved maps or combat unless explicit gameplay request.
5. Before mass replacement: introduce and test shared visual registry + atlas adapters using existing art unchanged, validate both renderers, then replace assets incrementally. Check fallback and rollback. Regression tests must preserve named animation/effect contracts and positions while allowing intentional metadata migration. This is planned, not yet implemented.
6. New arena props remain outside combat geometry. Render-only art is not a new collision rule. Kabuto review is independent; no changes to current combat engine.

Historical validations, pending 3C.7.3 / 3C.7.5, enemy art, balance and responsive standard remain. User approves continuing with arena development under this design.
