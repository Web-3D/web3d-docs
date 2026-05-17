# ROADMAP.md — Factory Pipeline Phases

> Source of truth cho kế hoạch xây dựng Factory.
> Trạng thái realtime → `SYNC.md`.
> Kiến trúc tổng quan → `CLAUDE.md`.

---

## Phase A — Blender MCP Foundation _(⏳ chưa bắt đầu)_

**Mục tiêu:** Kết nối Claude Code ↔ Blender qua MCP. Claude Code có thể trigger Blender operations trực tiếp — không cần thao tác tay.

**Exit criteria:** Claude Code gửi lệnh → Blender mở file, chạy script, export .glb thành công ít nhất 1 lần.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | Cài Blender MCP addon (blender-mcp) | config | ⏳ | Server chạy trong Blender, Claude Code connect qua stdio |
| 2 | Thêm blender-mcp vào `.claude/mcp.json` | config | ⏳ | Depends on #1 |
| 3 | Smoke test: Claude Code list objects trong scene | test | ⏳ | Verify kết nối 2 chiều |
| 4 | Python script: `export_glb.py` — apply modifiers + export .glb | script | ⏳ | Chạy qua Blender MCP |
| 5 | Test export 1 asset .blend đơn giản | test | ⏳ | Output: `baked/test.glb` |

---

## Phase B — First Asset End-to-End _(chờ Phase A)_

**Mục tiêu:** Chạy toàn bộ pipeline với 1 asset thực tế. Validate đầu ra đạt standard Web-3D.

**Exit criteria:** 1 asset từ `source/` → `Web-3D/assets/[cat]/production/` → `node validate.js` PASS.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | Chọn 1 asset đơn giản (prop hoặc building) làm test case | prep | ⏳ | Nên chọn mesh đơn giản, có UV sẵn |
| 2 | Bake theo checklist trong `blender/PIPELINE.md` | manual | ⏳ | Lần đầu làm tay để hiểu pipeline |
| 3 | Export .glb từ Blender | script | ⏳ | Dùng `export_glb.py` từ Phase A |
| 4 | Chạy gltf-transform optimize + draco | script | ⏳ | `npx gltf-transform optimize input.glb output.glb --compress draco` |
| 5 | Copy vào `Web-3D/assets/[cat]/[name]/production/` | deploy | ⏳ | Theo cấu trúc assets/ |
| 6 | Validate: `node validate.js ../../assets/[cat]/[name]` | validate | ⏳ | Chạy từ `Web-3D/THREEJS/` |
| 7 | Document kết quả — ghi vào `SYNC.md` | doc | ⏳ | Ghi nhận issues nếu có |

---

## Phase C — Asset Categories _(chờ Phase B)_

**Mục tiêu:** Xây dựng template + pattern riêng cho từng category. Mỗi category có 1 validated asset.

**Exit criteria:** 4 categories (prop, building, character, environment) — mỗi cái 1 asset PASS validate.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | `.blend` template cho `props/` | template | ⏳ | Scale chuẩn, UV, material slot rỗng |
| 2 | `.blend` template cho `buildings/` | template | ⏳ | Scale lớn hơn, exterior UV mapping |
| 3 | `.blend` template cho `characters/` | template | ⏳ | Rig-ready, texture atlas 1024×1024 |
| 4 | `.blend` template cho `environments/` | template | ⏳ | Terrain scale, tiled UV |
| 5 | Test 1 prop qua pipeline | test | ⏳ | Validate PASS |
| 6 | Test 1 building qua pipeline | test | ⏳ | Validate PASS |
| 7 | Test 1 character qua pipeline | test | ⏳ | Validate PASS |
| 8 | Test 1 environment qua pipeline | test | ⏳ | Validate PASS |
| 9 | Python script: `batch_export.py` — xử lý nhiều asset 1 lần | script | ⏳ | Đọc folder `source/`, export tất cả |

---

## Phase D — Post-Blender Automation _(chờ Phase C)_

**Mục tiêu:** Sau khi Blender xong việc (export .glb thô), tự động hoá phần còn lại — không cần chạy tay 3 lệnh.

**Scope rõ:** Automation bắt đầu từ file .glb trong `baked/` — không phải từ Blender hay feeders.

**Exit criteria:** 1 lệnh `npm run deploy [file.glb] [category/name]` → gltf-transform + copy + validate chạy tự động.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | Script: `deploy.js` — nhận `baked/*.glb` → gltf-transform → copy vào `Web-3D/assets/` | script | ⏳ | Node.js, 2 args: file path + category/name |
| 2 | Gọi `node validate.js` sau copy — fail thì xóa file vừa copy | script | ⏳ | Không để broken asset trong production |
| 3 | `npm run deploy` shortcut trong `package.json` | config | ⏳ | UX: thay cho 3 bước tay |

---

## Future (Deferred) — Feeders

Tất cả deferred có research notes tại `deferred/README.md`.

| Phase | Tool | Mô tả | Khi nào |
|-------|------|--------|---------|
| E | Houdini MCP | .hip → .abc → Blender nhận → .glb | Sau Phase D |
| F | Unreal MCP | .uasset → .fbx → Blender nhận → .glb | Sau Phase D |
| G | Unity MCP | .prefab → .fbx → Blender nhận → .glb | Sau Phase D |

---

## Changelog

| Ngày | Thay đổi |
|------|---------|
| 2026-05-17 | Tạo file — Factory skeleton + Phases A-D lên kế hoạch |
