# Konoha World 3C — preview only

This preview combines the latest main (0f2da406ef15447b7eb6112dc41cdebf98293163) with the existing Three.js lab (b3724ebe68160aa19e115249940a7b6f0eb2fe34). All 10 independently changed main files are retained byte-for-byte. No overlap in changed paths. No production merge.

- The campaign remains at `/` with all startup/loading, fullscreen focus and responsive HUD updates.
- Open `/konoha-three-lab.html` to explore the separate illustrated village. It is not the campaign or its HUD. WebGL remains unvalidated on a real GPU; fallback tested previously.
- Expected Cloudflare preview: https://preview-konoha-world3c.naruto2-5d.pages.dev/konoha-three-lab.html (deployment not confirmed until checked).
- If preview builds are disabled, enable the branch in Cloudflare Pages > Settings > Builds & deployments > Branch control. Do not switch production branch or merge the PR.
