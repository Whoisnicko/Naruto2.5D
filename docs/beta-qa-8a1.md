# 8A.1 — Beta Quality Assurance: historical reconciliation
Date: 28 November 2026. Production gameplay 7A.7 c9f23f3d8a3c9ad546a22b152a43f43b0b798c7a; base including documentation c1dd64bfcba45ccf3c1b9d94e285a41787497b90. User production playtest 6/6 approved: palace relocation, collisions, travel/minimap, NPC/roads/bridges, campaign/saves, combat/HUD/performance. No feedback. No gameplay edits in 8A.1.

## Historical trace
6C.3 production playtest 10/27, 17 unvalidated, as recorded in docs/level-up-review-6c4a.md and Drive Playbook. Exact original 27-item list not located in recovered records; do not fabricate or mark 17 historical checks closed. docs/kabuto-campaign-6c3.md identifies Giant Rasengan learned-skill restriction, both engines and keyboard/touch, and deferred Kabuto difficulty. Drive later records 6D.2 production 15/15 including normal/Kyubi/Giant learned Rasengan, melee, combos, manual priority, campaign, God Mode, HUD and responsive. 6F.2 production 14/14 including Fuma/clones normal/Kyubi, loader, victory/defeat/travel, save/respawn and responsive. 7A.7 6/6 gives further evidence. These are overlapping approvals, not exact mapping to historical list.

## Current source checks (17/17)
Executed exported pure functions in a JS isolate with in-memory storage; additional source-string checks for integration. 
1–4 Giant access equals learned flag in all four learned/Kyubi combinations.
5 normal and Giant recognized as Kyubi Rasengan.
6 non-Naruto not recognized as Kyubi Rasengan.
7 manual buffer or held Rasengan blocks involuntary impulse.
8 unbuffered impulse allowed.
9 production God Mode allowed.
10 defaults off.
11 on persists.
12 off persists.
13 unrelated host rejected.
14 failing storage safely returns false.
15 both engines reference shared learned rule.
16 Kabuto missing presentation guard in main.
17 Sandbox import and UI persistence guards present in main.
No complete browser simulation, visual, measured FPS, actual input/device/storage, or independent Cloudflare metadata verification. Not the original 17 checks. No full smoke suite run.

## New targeted acceptance matrix (8 checks, all pending)
A1. Export disposable campaign backup; enter Kabuto through campaign with requirements fulfilled; correct arena and phases load, victory returns to illustrated Konoha.
A2. With Giant Rasengan NOT learned, G is unavailable even in Kyubi. Learn via P / Skills (level 3 + Chakra Control); G becomes usable in normal and Kyubi forms in field.
A3. Repeat learned Giant, normal Rasengan and manual priority during Kyubi in Kabuto boss practice; test keyboard and touch when available (touch may remain pending).
A4. God Mode starts OFF in fresh session; toggle from pause, verify health protection and toggle OFF before normal difficulty testing; same-session persistence. Campaign progress saves, so use disposable data.
A5. Complete an eligible campaign boss once, save and reload; reward/progression exactly once and correct position. Test on a disposable backup, not sole save.
A6. In Sandbox gain XP/items, leave, and verify campaign state unchanged (compare original save); no sandbox overwrite.
A7. Defeat/retry and return from Kabuto practice; loader, dialogue, arena return and controls correct.
A8. Desktop and smaller viewport: HUD not clipped or disproportionate, controls accessible, FPS stable by player observation; record device and approximate FPS if available.

Production https://naruto2-5d.pages.dev/?v=7a7
Kabuto practice https://naruto2-5d.pages.dev/?arenaPractice=1&boss=kabuto&phase=1&v=7a7
Field sandbox https://naruto2-5d.pages.dev/konoha-three-lab.html?sandbox=1&v=7a7
Repository https://github.com/Whoisnicko/Naruto2.5D
Rollback https://github.com/Whoisnicko/Naruto2.5D/tree/backup/production-before-7a7

## Release policy
Documentation only in main, preserve all historical 17 as untraceable individually until exact source or explicit replacement acceptance; no arbitrary numerical closure. Preserve Kabuto tactical balance redesign, Kimimaro artistic polish, enemy redesign, HD facades, optional X/Y compensation, mandatory final-beta Character Design Overhaul. Correct only reproducible bugs in isolated branches after playtest. No new feature or art work this phase.
