# FACTORY-COMPATIBILITY.md — Engine ↔ Factory Integration

> Scope: ecosystem-level — áp dụng cho cả Three.js và Babylon.js.

---

## Ma trận tích hợp tổng quan

| Factory Tool | Three.js | Babylon.js | Mức độ |
|---|---|---|---|
| **Blender** | ✅ | ✅ | Đầy đủ — GLTF là cầu nối chính |
| **Houdini** | ✅ | ⚠️ | GLTF có, VAT cần viết shader riêng cho Babylon |
| **Substance Painter** | ✅ | ✅ | Đầy đủ — PBR metal-roughness tương thích trực tiếp |
| **Megascans / Fab** | ✅ | ✅ | Đầy đủ — không cần Unreal để dùng |
| **Unreal Engine** | ❌ | ⚠️ | Runtime không chạy trên web — chỉ dùng làm workflow reference cho Babylon |

---

## Blender — data nào truyền được

| Data | Định dạng | Three.js API | Babylon.js API |
|---|---|---|---|
| Mesh geometry | GLB | `GLTFLoader` | `SceneLoader` |
| PBR material | GLB embedded | `MeshStandardMaterial` auto | `PBRMaterial` auto |
| Skeleton + bone weights | GLB | `SkinnedMesh` | `Skeleton` |
| Animation clip | GLB | `AnimationMixer` | `AnimationGroup` |
| Morph target (facial) | GLB | `morphTargetInfluences` | `morphTargetManager` |
| Normal map / AO map baked | PNG / KTX2 | `TextureLoader` / `KTX2Loader` | `Texture` / built-in |
| Lightmap baked | EXR / PNG | `EXRLoader` + `lightMap` | `LightmapTexture` |

---

## Houdini — data nào truyền được

| Data | Định dạng | Three.js | Babylon.js | Ghi chú |
|---|---|---|---|---|
| Static / rigged mesh | GLB | ✅ | ✅ | Via Houdini Labs GLTF exporter |
| Simulation animation (fire, cloth, destruction) | VAT — `.exr` / `.png` | ✅ `VATShader` có sẵn | ⚠️ Cần viết shader | VAT = position + normal mỗi vertex baked vào texture |
| Particle data | Texture sequence | ✅ đọc trong shader | ⚠️ Cần shader | |
| Procedural geometry (1 frame) | GLB | ✅ | ✅ | |

**VAT format:**

| File | Nội dung | Format |
|---|---|---|
| `position_map.exr` | (x, y, z) mỗi vertex mỗi frame | Float32 EXR |
| `normal_map.png` | Normal vector baked | PNG |
| `meta.json` | Frame count, frame rate, bounds | JSON |

---

## Substance Painter — map nào tương ứng đâu

| Substance output | Three.js (`MeshStandardMaterial`) | Babylon.js (`PBRMaterial`) |
|---|---|---|
| Base Color | `map` | `albedoTexture` |
| Normal | `normalMap` | `bumpTexture` |
| Roughness | `roughnessMap` | `metallicRoughnessTexture` |
| Metallic | `metalnessMap` | `metallicRoughnessTexture` |
| Ambient Occlusion | `aoMap` | `ambientTexture` |
| Emissive | `emissiveMap` | `emissiveTexture` |
| Opacity | `alphaMap` | `opacityTexture` |

Export preset: **"glTF PBR Metal Roughness"** — map trực tiếp, không cần chỉnh.

---

## Megascans / Fab — map nào dùng được

| Map | Three.js / Babylon.js | Ghi chú |
|---|---|---|
| Albedo | ✅ direct | |
| Normal | ✅ — **phải chọn OpenGL (Y+)** | Mặc định Megascans xuất DirectX (Y-) — phải flip Green channel hoặc chọn đúng convention khi export |
| Roughness | ✅ direct | |
| Metalness | ✅ direct | |
| AO | ✅ direct | |
| Displacement | ⚠️ web không support native | Bake vào normal map hoặc dùng custom shader |
| Cavity | ✅ blend vào albedo / roughness | Không dùng trực tiếp |

**Module phù hợp nhất:** `TriplanarMapping` — terrain/rock không cần UV.

---

## Unreal Engine — tại sao không fit

| Lý do | Chi tiết |
|---|---|
| Runtime không chạy trên browser | Unreal build ra binary native — không có web target khả dụng |
| Shader không portable | Material Graph compile sang HLSL proprietary — không convert sang TSL / GLSL |
| Features không có equivalent | Lumen, Nanite không thể reproduce trên web budget |
| Babylon.js Node Material Editor | Tương đồng workflow với Unreal Material Graph — artist quen Unreal chuyển sang được |

**Trường hợp dùng được (Babylon.js):** Asset baked từ Unreal (texture PNG/EXR) import được bình thường — nhưng Blender làm được tương tự và miễn phí.

---

## Định dạng file — reference

| Định dạng | Extension | Mục đích | Three.js | Babylon.js | Ghi chú |
|---|---|---|---|---|---|
| **GLTF / GLB** | `.gltf` `.glb` | Mesh + material + animation | ✅ native | ✅ native | Chuẩn chính — dùng mặc định |
| **Draco** | (in GLTF) | Geometry compression | ✅ DRACOLoader | ✅ built-in | Giảm 5–10× file size |
| **Meshopt** | (in GLTF) | Geometry + animation compression | ✅ MeshoptDecoder | ✅ built-in | Nhanh hơn Draco, tốt hơn cho animation |
| **KTX2 / Basis** | `.ktx2` | GPU texture compression | ✅ KTX2Loader | ✅ built-in | 4–8× nhỏ hơn PNG trên GPU |
| **EXR** | `.exr` | HDR, lightmap, VAT position | ✅ EXRLoader | ✅ built-in | Float32 — không mất precision |
| **PNG** | `.png` | Texture thông thường | ✅ | ✅ | Không compress trên GPU |
| **WebP** | `.webp` | Texture nhỏ hơn PNG ~30% | ✅ | ✅ | Không compress trên GPU |
| **VAT** | `.png` `.exr` | Vertex animation từ Houdini | ✅ VATShader | ⚠️ cần shader | EXR cho position (float), PNG cho normal |
| **FBX** | `.fbx` | Legacy Autodesk | ⚠️ hạn chế | ✅ tốt hơn | Tránh — dùng GLTF thay thế |
| **OBJ** | `.obj` | Mesh cơ bản, không animation | ✅ | ✅ | Legacy — không có material standard |
| **USD / USDC** | `.usd` | Universal Scene Description | ⚠️ experimental | ⚠️ experimental | Chưa production-ready trên web |

---

## Pipeline khuyến nghị

| Bước | Input | Output | Tool |
|---|---|---|---|
| Model + rig | Source file | `.glb` + Draco + Meshopt | Blender |
| Texture | Source file | `.ktx2` | Blender / Substance |
| Simulation bake | Houdini sim | `position.exr` + `normal.png` + `meta.json` | Houdini |
| Lightmap bake | Hi-poly scene | `lightmap.exr` | Blender Cycles |
| Web load | `.glb` + `.ktx2` + `.exr` | Mesh trong scene | GLTFLoader + KTX2Loader + EXRLoader |

**Rule:** Không export FBX, không export OBJ nếu có thể tránh. GLTF/GLB là định dạng duy nhất đảm bảo hoạt động đầy đủ trên cả hai engine.

---

## Changelog

| Ngày | Thay đổi |
|---|---|
| 2026-05-17 | Rewrite dạng table-heavy, bỏ prose |
| 2026-05-17 | Tạo file — compatibility matrix từ session discussion |
