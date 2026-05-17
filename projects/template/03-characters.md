# 03 — Characters & Entities

> Danh sách nhân vật, vật thể có animation, AI entities.

---

## Nhân vật chính (Main Characters)

| Tên | Vai trò | Hiện diện | Animation | Poly budget | Ghi chú |
|---|---|---|---|---|---|
| ... | Protagonist | Always | walk, idle | < 5k tris | ... |
| ... | NPC | Zone A only | idle | < 2k tris | Billboard LOD ở xa |

---

## NPC / Background Characters

| Tên / Loại | Số lượng | Spawn zone | Render method |
|---|---|---|---|
| ... | 5–10 | Zone B | BillboardSprite |
| ... | 1 | Zone A | Full mesh |

---

## Vật thể có animation (Animated Objects)

_Không phải nhân vật nhưng có movement — cây, đèn, xe..._

| Object | Animation type | Module | Ghi chú |
|---|---|---|---|
| Cây | Wind sway | WindAnimation | Amplitude 0.3 |
| Đèn đường | Flicker | BeamEffect | Randomized |
| ... | ... | ... | ... |

---

## Specs kỹ thuật

| Hạng mục | Giới hạn |
|---|---|
| Poly count nhân vật chính | < ___ tris |
| Poly count NPC | < ___ tris |
| Texture size nhân vật | ___ × ___ |
| Skeleton bones tối đa | ___ bones |
| Số nhân vật render đồng thời | < ___ |
