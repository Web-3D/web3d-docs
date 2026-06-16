# CLAUDE.md — Factory

> Tầng này quản lý: DCC tools pipeline — chuyển đổi asset từ source tools sang .glb production-ready.
> KHÔNG can thiệp: runtime shading, effects, web engine rules.
> ← Ecosystem context: `../Engine/CLAUDE.md`

---

## Vai trò

Factory = xưởng sản xuất asset. Output duy nhất: `.glb` compressed → `../Engine/assets/[cat]/production/`

**Anchor tool: Blender** — mọi định dạng đều chạy qua Blender trước khi thành .glb.

**Dual-path ecosystem (2026-05-20):** Forge sinh 2 output từ cùng props.json:
- `fromSDF.ts` → GLSL SDF shader → Engine trực tiếp (prop tĩnh stylized, organic shape)
- `toGlb.ts` → `.glb` phôi → **Factory gia công** → Engine (physics collider, LOD, character rig)

Factory chuyên biệt hóa: character, physics mesh, Houdini VFX, asset cần UV/normal bake thật.

---

## Pipeline

```
source/         ← input: .blend, .hip (Houdini), .fbx (Unreal/Unity) — tất cả tools đọc từ đây
      ↓ [tool làm tay: bake trong Blender/Houdini/...]
baked/          ← output: .glb thô — tất cả tools ghi vào đây
      ↓ scripts/deploy.js  [automation bắt đầu từ đây]
../Engine/assets/[cat]/production/   ← delivery destination
```

---

## Folder structure

```
Factory/
├── source/              ← input assets (tất cả tools dùng chung) — flat
├── baked/               ← .glb thô (output của bất kỳ tool nào) — flat
├── scripts/             ← shared: deploy.js (Phase D) + make-thumbs.ps1 (thumb.jpg 64² mọi texture set — palette UI)
├── blender/             ← tool plugin — ANCHOR hiện tại
│   ├── scripts/         ← Python Blender-specific
│   ├── templates/       ← .blend templates chuẩn
│   └── PIPELINE.md
├── houdini/             ← future plugin
├── unreal/              ← future plugin
├── unity/               ← future plugin
├── scans/               ← photogrammetry input: ảnh render từ scanner rig → Meshroom/RealityCapture
├── deferred/
├── mcp-server.js        ← MCP stdio server — Planning agent interface
├── asset-orders.json    ← orders queue (Planning agent ghi, Factory agent đọc)
└── package.json         ← ESM config cho mcp-server.js
```

**Nguyên tắc plugin:** Thêm/xóa 1 tool = thêm/xóa folder của nó. `scripts/deploy.js` không biết tool nào tạo ra .glb.

---

## Warehouse — MCP Interface

`mcp-server.js` là cầu nối giữa Planning agent (`studio-3D`) và Factory agent (`Factory/`).

**4 tools:**

| Tool | Mục đích |
|---|---|
| `list_assets` | Scan `baked/` + `production/` → liệt kê theo stage |
| `get_asset_info` | Chi tiết 1 asset (path, size, stage, category) |
| `queue_asset_order` | Planning agent tạo order → ghi vào `asset-orders.json` |
| `get_order_status` | Đọc queue — 1 order hoặc toàn bộ |

**Flow:**
```
Planning agent  →  queue_asset_order  →  asset-orders.json
Factory agent   ←  đọc queue          ←  asset-orders.json
Planning agent  →  list_assets / get_asset_info  →  biết trạng thái thực tế
```

Server load qua `c:\Editions\studio-3D\.mcp.json`.

---

## Bake policy — chỉ bake những gì cần thiết

**BAKE vào .glb:**
- Geometry (low-poly mesh, modifiers applied)
- UV maps
- Normal map (high → low poly bake)
- Base color / albedo texture
- AO texture (tuỳ chọn)

**KHÔNG BAKE — để Three.js / BabylonJS lo:**
- Dynamic shadows
- Lighting
- Particle effects / VFX
- Procedural textures (triplanar, noise)
- Post-processing

---

## Quality gate

Trước khi dùng .glb trong Engine, chạy validate từ thư mục `Engine/THREEJS/`:
```
node validate.js ../assets/[cat]/[name]
```

---

## Phase hiện tại

**Phase 0 ✅ — Warehouse Foundation** (MCP server + orders queue xong)
**Phase A ✅ — Blender MCP Foundation** (addon + export_glb.py + test_cube.glb PASS — 2026-05-18)
**Phase B ✅ — First Asset End-to-End** (prop-donut-chocolate PASS — 2026-05-18)
**Phase C ✅ — Deploy Automation** (`scripts/deploy.js` PASS — 2026-05-18)
**Phase D ✅ — Asset Scale** (4 categories, 4/4 validate PASS — 2026-05-19)
**Phase E ⏳ — Houdini Connector.** Chi tiết: [ROADMAP.md](ROADMAP.md)

---

## Skills System

5 skills tự động load mỗi session. Index: [`.claude/SKILLS-ROADMAP.md`](.claude/SKILLS-ROADMAP.md)

| Skill | Trigger |
|---|---|
| `blender-scene-check` | Trước mọi Blender MCP operation |
| `blender-export` | "xuất glb", "export từ blender" |
| `deploy-pipeline` | "deploy", "đưa vào production" |
| `asset-intake` | "asset mới", "tạo order" |
| `sync-state` | "phase xong", "ghi log", "cập nhật" |

---

## Session opener chuẩn

Câu đầu tiên khi mở Factory session:

```
Đọc CLAUDE.md + SYNC.md + c:\Editions\studio-3D\STATUS.md + c:\Engine\SYNC.md rồi báo cáo trạng thái.
```

---

## Shared AI Context

| File | Mục đích |
|---|---|
| `SYNC.md` | Log quyết định + trạng thái Factory — **đọc đầu session** |
| `ROADMAP.md` | Kế hoạch phases 0-D + feeders tương lai |
| `deferred/README.md` | Tính năng đã nghiên cứu nhưng hoãn |
| `mcp-server.js` | Warehouse MCP server — Planning agent gọi vào đây |
| `asset-orders.json` | Orders queue — trạng thái từng yêu cầu asset |
| `c:\Editions\studio-3D\STATUS.md` | Command center — active project, phase, blockers cross-repo |
| `c:\Engine\SYNC.md` | Ecosystem log — quyết định lớn ảnh hưởng cả Engine + Factory |
