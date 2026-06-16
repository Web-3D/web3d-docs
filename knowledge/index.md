---
title: Knowledge Base — Web-3D Ecosystem
description: Tủ hồ sơ kỹ thuật. Mỗi entry là 1 case đã xử lý — vấn đề, phân tích, giải pháp đã validate.
audience: ai-agent, human
---

# Knowledge Base — Web-3D Ecosystem

> Đọc file này trước. Quick Index bên dưới giúp AI tìm entry liên quan mà không cần mở từng file.

---

## Quick Index (AI-scannable)

| Entry | Type | Domain | apply_when | Status |
|---|---|---|---|---|
| [engine/ — Engine Knowledge Map](engine/) | reference | three-js | Khi cần tra module / kỹ thuật / vai trò THREEJS, hoặc quyết hướng web-vs-game / framework (R3F) | living |
| [multi-agent-orchestration](innovations/multi-agent-orchestration) | innovation | agent-system | Khi nhiều Claude Code session cần phối hợp trong 1 ecosystem | validated |
| [houdini-techniques](reference/houdini-techniques) | reference | cross-ecosystem | Khi cần chọn kỹ thuật geometry/texture/terrain mà chưa biết Houdini có gì — tra theo NHU CẦU trước khi viết code mới | living (ảnh chụp 2026-06-10; tiến độ port = Factory catalog) |

---

## Agent Reading Guide

> Mỗi agent chỉ đọc entry có domain khớp với mình — không cần đọc tất cả.

| Bạn là agent nào | Đọc entry có domain |
|---|---|
| Planning agent (web3d-projects) | `agent-system`, `cross-ecosystem` |
| THREEJS agent | `three-js`, `cross-ecosystem` |
| Factory agent | `factory`, `cross-ecosystem` |
| Babylon.js agent | `babylonjs`, `cross-ecosystem` |

---

## Cách AI Agent dùng Knowledge Base này

```
1. Xác định domain của mình — xem bảng Agent Reading Guide trên
2. Đọc Quick Index — lọc entry có domain khớp, xem apply_when có match không
3. Mở entry đó — đọc section "APPLY WHEN" và "FOR AI AGENTS" trước
4. Nếu status = "validated" → áp dụng ngay, không cần reinvent
5. Nếu status = "proposed" → dùng làm starting point, verify trước khi build
6. Nếu status = "deprecated" → đọc phần "replaced_by" trong frontmatter
```

**Không có entry phù hợp?** Giải quyết xong → tạo entry mới theo template `_knowledge/_template.md`.

---

## Thêm Entry Mới

```
1. Copy _knowledge/_template.md → _knowledge/[type]/[kebab-title].md
2. Điền đầy đủ frontmatter — apply_when phải là 1 câu rõ ràng
3. Thêm row vào Quick Index bên trên
4. node c:\Edocs\sync.js --push
5. Thêm vào VitePress sidebar: c:\Edocs\.vitepress\config.ts
```

---

## Categories

| Folder | Chứa gì |
|---|---|
| `decisions/` | Tại sao chọn X không chọn Y — trade-off đã cân nhắc |
| `errors/` | Bug/problem → root cause → fix đã verify |
| `innovations/` | Insight mới, approach chưa phổ biến, discovery |
| `patterns/` | Proven code/workflow pattern đã dùng ≥ 3 lần |
| `reference/` | Bản đồ tra cứu toàn cảnh 1 lĩnh vực (Houdini techniques…) — đọc để CHỌN, không phải case lẻ |
