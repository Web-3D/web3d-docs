# ROADMAP.md — Factory Pipeline Phases

> Source of truth cho kế hoạch xây dựng Factory.
> Trạng thái realtime → `SYNC.md`.
> Kiến trúc tổng quan → `CLAUDE.md`.

---

## Phase 0 — Warehouse Foundation _(✅ 2026-05-18)_

**Mục tiêu:** Planning agent có thể query Factory state và queue asset orders mà không cần switch terminal.

**Exit criteria:** MCP server respond đúng `initialize` + `tools/list` — đã pass.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | `mcp-server.js` — 4 tools (list_assets, get_asset_info, queue_asset_order, get_order_status) | script | ✅ | JSON-RPC 2.0 over stdio |
| 2 | `asset-orders.json` — orders queue | config | ✅ | Planning agent ghi, Factory agent đọc |
| 3 | `package.json` — ESM config, Node ≥18 | config | ✅ | Smoke test passed |

---

## Phase A — Blender MCP Foundation _(✅ 2026-05-18)_

**Mục tiêu:** Kết nối Claude Code ↔ Blender qua MCP. Claude Code có thể trigger Blender operations trực tiếp — không cần thao tác tay.

**Exit criteria:** Claude Code gửi lệnh → Blender mở file, chạy script, export .glb thành công ít nhất 1 lần.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | Cài Blender MCP addon (blender-mcp) | config | ✅ | addon.py copy vào AppData, enable trong Preferences |
| 2 | Thêm blender-mcp vào `.mcp.json` | config | ✅ | `C:\Factory\.mcp.json` — uvx full path |
| 3 | Smoke test: Claude Code list objects trong scene | test | ✅ | get_scene_info → Cube, Light, Camera |
| 4 | Python script: `export_glb.py` — apply modifiers + export .glb | script | ✅ | `blender/scripts/export_glb.py` |
| 5 | Test export 1 asset .blend đơn giản | test | ✅ | `baked/test_cube.glb` 1.9KB — PASS |

---

## Phase B — First Asset End-to-End _(✅ 2026-05-18)_

**Mục tiêu:** Chạy toàn bộ pipeline với 1 asset thực tế bằng tay. Hiểu từng bước trước khi tự động hóa.

**Exit criteria:** 1 asset từ `source/` → `Engine/assets/[cat]/production/` → `node validate.js` PASS.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | Chọn 1 asset đơn giản (prop hoặc building) làm test case | prep | ✅ | prop_donut_chocolate — torus 2 objects |
| 2 | Bake theo checklist trong `blender/PIPELINE.md` | manual | ✅ | Model + UV qua MCP, saved source/prop_donut_chocolate.blend |
| 3 | Export .glb từ Blender qua `export_glb.py` | script | ✅ | baked/prop_donut_chocolate.glb 238.6 KB |
| 4 | gltf-transform optimize + draco (tay) | manual | ✅ | 238.6 KB → 14.1 KB (94% giảm) |
| 5 | Copy vào `Engine/assets/[cat]/production/` | manual | ✅ | assets/props/prop-donut-chocolate/production/ |
| 6 | Validate: `node validate.js ../assets/[cat]/[name]` | validate | ✅ | PASS — fix bug registryPath trong validate.js |
| 7 | Document kết quả — ghi vào `SYNC.md` | doc | ✅ | Xem SYNC.md entry 2026-05-18 |

---

## Phase C — Deploy Automation _(✅ 2026-05-18)_

**Mục tiêu:** Tự động hóa phần post-Blender. Thay 3 bước tay bằng 1 lệnh.

**Scope:** Automation bắt đầu từ `baked/*.glb` — không phải từ Blender.

**Exit criteria:** `npm run deploy [file.glb] [category/name]` → gltf-transform + copy + validate chạy tự động, fail thì rollback.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | `scripts/deploy.js` — nhận `baked/*.glb` → gltf-transform → copy vào `Engine/assets/` | script | ✅ | Test PASS với prop-donut-chocolate |
| 2 | Rollback nếu validate fail — xóa file vừa copy | script | ✅ | rmSync outputGlb khi validate fail |
| 3 | `npm run deploy` shortcut trong `package.json` | config | ✅ | `node scripts/deploy.js` |

---

## Phase D — Asset Scale _(✅ 2026-05-19)_

**Mục tiêu:** Khi có dự án cụ thể (Doraemon District hoặc tương tự), xây template và pattern cho từng category. Scale từ 1 asset lên nhiều loại.

**Exit criteria:** 4 categories — mỗi cái 1 asset PASS validate + template .blend chuẩn.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | `.blend` template cho `props/` | template | ✅ | `props_template.blend` 89 KB |
| 2 | `.blend` template cho `buildings/` | template | ✅ | `buildings_template.blend` 88.7 KB |
| 3 | `.blend` template cho `characters/` | template | ✅ | `characters_template.blend` 109.4 KB — armature root |
| 4 | `.blend` template cho `environments/` | template | ✅ | `environments_template.blend` 88.5 KB — tiled UV |
| 5 | Test 1 asset mỗi category qua pipeline | test | ✅ | props/buildings/characters/environments — 4/4 validate PASS |
| 6 | `blender/scripts/batch_export.py` — xử lý nhiều asset 1 lần | script | ✅ | skip_existing=True, temp_override fix, log OK/SKIP/FAIL |

---

## Phase E — Houdini Connector _(⏳ 2026-05-19)_

**Mục tiêu:** Kết nối Houdini vào Factory pipeline. Output của Houdini (.abc hoặc .fbx) vào Blender → .glb sản xuất được.

**Flow:**
```
source/*.hip  →  Houdini export  →  source/*.abc  →  Blender import  →  baked/*.glb
```

**Exit criteria:** 1 Houdini geometry asset → Blender → .glb → `node validate.js` PASS.

| # | Task | Type | Status | Ghi chú |
|---|------|------|--------|---------|
| 1 | Verify Houdini MCP community addon — có stable không | research | ⏳ | Check github, nếu unstable dùng Python HDA |
| 2 | Tạo `houdini/PIPELINE.md` — document flow + conventions | doc | ⏳ | Tương tự `blender/PIPELINE.md` |
| 3 | Script: `houdini/scripts/export_abc.py` — export geometry từ Houdini sang .abc | script | ⏳ | Dùng `hou` Python API |
| 4 | Script: `blender/scripts/import_abc.py` — import .abc vào Blender, apply modifiers, prep export | script | ⏳ | Blender MCP exec |
| 5 | Test end-to-end: `source/*.hip` → `source/*.abc` → `baked/*.glb` → validate PASS | test | ⏳ | 1 asset đơn giản (box/sphere) |
| 6 | Update `houdini/PIPELINE.md` với kết quả thực tế | doc | ⏳ | |

---

## Future (Deferred) — Feeders

| Phase | Tool | Mô tả | Khi nào |
|-------|------|--------|---------|
| F | Unreal MCP | .uasset → .fbx → Blender nhận → .glb | Khi có game project |
| G | Unity MCP | .prefab → .fbx → Blender nhận → .glb | Khi có Unity project |

---

## Changelog

| Ngày | Thay đổi |
|------|---------|
| 2026-05-19 | Thêm Phase E — Houdini Connector. Promote từ deferred → active. |
| 2026-05-18 | Hệ thống lại phases — đảo C/D (automation trước, scale sau). Thêm Phase 0 ✅ done |
| 2026-05-17 | Tạo file — Factory skeleton + Phases A-D lên kế hoạch |
