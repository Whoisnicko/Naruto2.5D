# v1.15a — Fluid Combat I
Production v1.14a: PR #30 merged at ae3680e73292bc0d95c4fca68b901bc03a8b0e82; identical tree to approved beta, Cloudflare status absent. Rollback to 3de884fb6496747b6a9eef258bc884780c3de48f.

Experimental controller pass: one buffered keyboard/touch action (220 ms), dash priority and 160 ms cooldown buffer, reset on modal/arena/blur/damage. Quick acceleration (24/s), immediate stop and 65% walk speed during ordinary recovery, attack facing locked during recovery. Existing cooldowns, damage, dash invulnerability, Naruto hold-charge and scripted finales unchanged. No sprite/animation blending or camera changes yet. Syntax check passed; full smoke suite and live browser verification pending.

Preview (expected): https://feature-v115-fluid-combat.naruto2-5d.pages.dev/
Production: https://naruto2-5d.pages.dev/
Source: https://github.com/Whoisnicko/Naruto2.5D/tree/feature/v115-fluid-combat

QA: keyboard/touch combos, short cooldown buffer, no delayed action after modal/blur/hit, diagonal motion, dash cancel, Rasengan hold/release, Valley and Jiraiya finale, save/sandbox isolation.
