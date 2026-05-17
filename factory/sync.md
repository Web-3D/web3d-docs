# SYNC.md — Factory AI Log

> Đọc đầu mỗi session để biết context. Ghi sau mỗi quyết định quan trọng.

---

## Trạng thái hiện tại

| Item | Trạng thái |
|---|---|
| Factory skeleton | ✅ Tạo 2026-05-17 |
| Blender MCP setup | ⏳ Phase A — xem ROADMAP.md |
| First asset qua pipeline | ⏳ Chưa có |
| Houdini connector | ⏳ Deferred |
| Unreal connector | ⏳ Deferred |
| Unity connector | ⏳ Deferred |

---

## Log

### 2026-05-17 — Factory skeleton created

- **Quyết định:** Factory = xưởng sản xuất, Web-3D = sân khấu. Hai repo độc lập, flow 1 chiều.
- **Anchor tool:** Blender — mọi format đều qua Blender trước khi thành .glb.
- **Bake policy:** chỉ geometry + UV + normal + albedo. Shading/lighting/effects = runtime Three.js/BabylonJS.
- **Pipeline:** `source/` → Blender bake → `baked/` → gltf-transform → `Web-3D/assets/[cat]/production/`
- **Feeders (future):** Houdini/Unreal/Unity xuất .abc/.fbx → Blender nhận → .glb
