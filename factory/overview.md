# CLAUDE.md — Factory

> Tầng này quản lý: DCC tools pipeline — chuyển đổi asset từ source tools sang .glb production-ready.
> KHÔNG can thiệp: runtime shading, effects, web engine rules.
> ← Ecosystem context: `../Web-3D/CLAUDE.md`

---

## Vai trò

Factory = xưởng sản xuất asset. Output duy nhất: `.glb` compressed → `../Web-3D/assets/[cat]/production/`

**Anchor tool: Blender** — mọi định dạng đều chạy qua Blender trước khi thành .glb.

---

## Pipeline

```
source/         ← input: .blend, .hip (Houdini), .fbx (Unreal/Unity) — tất cả tools đọc từ đây
      ↓ [tool làm tay: bake trong Blender/Houdini/...]
baked/          ← output: .glb thô — tất cả tools ghi vào đây
      ↓ scripts/deploy.js  [automation bắt đầu từ đây]
../Web-3D/assets/[cat]/production/   ← delivery destination
```

---

## Folder structure

```
Factory/
├── source/           ← input assets (tất cả tools dùng chung)
├── baked/            ← .glb thô (output của bất kỳ tool nào)
├── scripts/          ← shared: deploy.js (Phase D)
├── blender/          ← tool plugin — ANCHOR hiện tại
│   ├── scripts/      ← Python Blender-specific
│   ├── templates/    ← .blend templates chuẩn
│   └── PIPELINE.md
├── houdini/          ← future plugin
├── unreal/           ← future plugin
├── unity/            ← future plugin
└── deferred/
```

**Nguyên tắc plugin:** Thêm/xóa 1 tool = thêm/xóa folder của nó. `scripts/deploy.js` không biết tool nào tạo ra .glb.

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

Trước khi dùng .glb trong Web-3D, chạy validate từ thư mục `Web-3D/THREEJS/`:
```
node validate.js ../../assets/[cat]/[name]
```

---

## Phase hiện tại

**Phase A ⏳ — Blender MCP Foundation.** Chi tiết: [`ROADMAP.md`](ROADMAP.md)

---

## Shared AI Context

| File | Mục đích |
|---|---|
| `SYNC.md` | Log quyết định + trạng thái — **đọc đầu session** |
| `ROADMAP.md` | Kế hoạch phases A-D + feeders tương lai |
| `deferred/README.md` | Tính năng đã nghiên cứu nhưng hoãn |
