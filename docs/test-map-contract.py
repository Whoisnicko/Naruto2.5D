"""Protect the approved world map from accidental gameplay-driven edits.
Run: python docs/test-map-contract.py
Intentional map changes require visual review and explicit update of this contract.
"""
from pathlib import Path
import hashlib

ROOT = Path(__file__).resolve().parents[1]
LOCKED = {
  "src/konoha-layout.js": "ee14ac53a84604c87b927e4bdde17878efd4073b",
  "src/konoha-three-data.js": "20d2b1da01f55e4f16c9391374de41af68d9abf3",
  "src/konoha-regions.js": "5caf06cc3f587a7a68cfaa87f1ce85f26f099fff",
  "src/konoha-scene.js": "ff925dd0259a2a3cf2c76eb490657d60626a7fd4",
  "assets/konoha-world3c/plaza-medallion.webp": "86cbb6a72ef200b4f5be845980cbf9b56a5103fa"
}
for path, expected in LOCKED.items():
    data = (ROOT / path).read_bytes()
    actual = hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
    assert actual == expected, f"Map contract changed: {path}"
game = (ROOT / "src/game.js").read_text(encoding="utf-8")
lab = (ROOT / "src/konoha-three-lab.js").read_text(encoding="utf-8")
assert "?campaign=1&v=" in game and "illustrated-skin" not in game
assert "createKonohaScene({" in lab and "function assemble(){" not in lab
assert "function ground(){" not in lab
print(f"Map contract OK: {len(LOCKED)} locked files and campaign routing.")
