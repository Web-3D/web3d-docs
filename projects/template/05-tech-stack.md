# 05 — Tech Stack

> Engine, tools, render approach. Quyết định ở đây = không đổi giữa chừng.

---

## Render Engine

| Hạng mục | Lựa chọn | Lý do |
|---|---|---|
| Engine chính | _Three.js / Babylon.js / R3F_ | ... |
| Renderer | _WebGPU / WebGL_ | ... |
| Framework | _Vanilla / React + R3F / Next.js + R3F_ | ... |
| Build tool | _Vite / Next.js_ | ... |

---

## Factory Tools

| Công đoạn | Tool | Output |
|---|---|---|
| Modeling | _Blender / Houdini / ZBrush_ | `.blend / .hip` |
| Bake | _Blender_ | `.glb` thô |
| Optimize | _gltf-transform + draco_ | `.glb` compressed |
| Delivery | `Factory/scripts/deploy.js` | `Web-3D/assets/[cat]/production/` |

---

## Asset Pipeline

```
[Tool] → source/ → baked/ → deploy.js → Web-3D/assets/ → [Engine]
```

- Source format: ___
- Baked format: `.glb`
- Texture format: `PNG / KTX2 / WebP`
- Draco compression: có / không

---

## Shader Approach

| Loại shader | Tool | Ghi chú |
|---|---|---|
| Surface material | _TSL / GLSL_ | Ưu tiên TSL |
| VFX / Effects | _TSL / module_ | Dùng threejs-modules |
| Post-processing | _PostProcessing module_ | ... |

---

## Performance Budget

| Chỉ số | Giới hạn |
|---|---|
| Draw calls / frame | < ___ |
| Triangle count | < ___ |
| Texture memory | < ___ MB |
| Bundle size (gzipped) | < ___ KB |
| Target FPS | ___ fps |
| Target device | _desktop / mobile / both_ |

---

## Dependencies

_Liệt kê package sẽ dùng — không cài thêm ngoài danh sách này._

| Package | Version | Dùng cho |
|---|---|---|
| `three` | `0.174` | Core engine |
| ... | ... | ... |
