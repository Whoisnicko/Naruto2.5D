# 3C.7.3 — Campaign Integration

3C.7.2 player playtest 8/8 OK, no comments. All historical validations retained; enemy art/mechanical quality backlog remains (3C.7.1 7/10). Added supplemental campaign patrols after quest===3 (report to Kakashi), preserving original IDs 0–4 and 100–103, chest and mission logic. Same approved sprites/poses/AI, no new HUD/art. Nine patrol members use separate IDs, no extra EXP/coins/loot pending balance. Support applies to patrols only. Existing safe checkpoint/export bridge persists optional world.patrols (HP/death, reinforcement count inferred from sequential IDs, home position of reinforcement); main members restore at fixed patrol homes on reload. Dead cannot resurrect through normal transaction; old v11 saves missing field default empty, no save version bump. Sandbox remains independent, existing stress and roster retained. No production change. Tests: syntax checked five modules; simulation and save validation separately before publish. Actual browser/GPU/save round trip pending, no FPS measured or offline HTML regenerated.

Preview https://preview-konoha-world3c.naruto2-5d.pages.dev/?v=3c73
Production https://naruto2-5d.pages.dev/
