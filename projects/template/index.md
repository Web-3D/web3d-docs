# Project Bible — Template

> Điền 8 file theo thứ tự. Càng chi tiết → AI workflow càng nhanh, build càng chính xác.

---

## Cách dùng

1. Copy folder `_template/` → `[project-name]/`
2. Điền từng file theo thứ tự 01 → 08
3. Commit sau mỗi file hoàn thành
4. Claude Code đọc folder này trước khi làm bất kỳ task nào trong project

---

## 8 File Template

| File | Nội dung | Điền khi nào |
|---|---|---|
| [01 — Concept](01-concept) | Elevator pitch, mood, scope | Trước tiên — defines everything |
| [02 — World & Map](02-world) | Scale, zones, terrain, ASCII map | Sau khi concept rõ |
| [03 — Characters](03-characters) | Nhân vật chính, NPC, animated objects | Song song với 02 |
| [04 — Art Style](04-art-style) | Style checklist, color, lighting, texture | Sau 01 |
| [05 — Tech Stack](05-tech-stack) | Engine, tools, pipeline, performance budget | Sau 04 |
| [06 — Module Mapping](06-modules) | Module nào dùng cho gì trong scene | Sau 05 |
| [07 — Infrastructure](07-infrastructure) | Repo structure, naming, CI, AI workflow | Trước khi code |
| [08 — Build Phases](08-phases) | Phase A–D, exit criteria, timeline | Sau khi 01–07 xong |

---

## Nguyên tắc

- **Số rõ ràng hơn mô tả mờ** — "30 NPC" tốt hơn "nhiều NPC"
- **Xóa row không dùng** — table trống gây nhầm lẫn hơn là bỏ đi
- **AI đọc file này = không hỏi lại** — mỗi câu hỏi AI phải hỏi = thiếu thông tin ở đây
