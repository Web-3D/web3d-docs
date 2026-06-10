# Blender Pipeline — Bake & Export Rules

## Input formats

| Format | Source | Ghi chú |
|---|---|---|
| `.blend` | Blender native | Không cần convert |
| `.glb` | Forge (`toGlb.ts`) | Phôi dual-path → `import_glb.py` → gia công → bake |
| `.fbx` | Unreal, Unity, Houdini | Import → bake → export |
| `.abc` | Houdini simulation | Alembic — geometry cache |
| `.obj` | Generic | Fallback |
| `.usd` | Multi-DCC | Emerging standard |

---

## Forge GLB intake lane (dual-path)

Forge `toGlb.ts` sinh `.glb` phôi vào `source/`. Factory gia công thêm những thứ
SDF không làm được: **rig, physics collider, LOD, UV/normal bake thật**.

```
source/*.glb  →[import_glb.py]→ Blender scene →[gia công: rig/physics/LOD]→
  →[export_glb.py]→ baked/*.glb  →[scripts/deploy.js]→ Engine/assets/[cat]/production/
```

**Các bước (qua Blender MCP `execute_blender_code`):**

```python
# 1. Import phôi từ source/ (dọn Cube/Light/Camera mặc định, select sẵn mesh)
exec(open(r'C:\Factory\blender\scripts\import_glb.py').read())
print(import_glb('chair_01'))

# 2. Gia công trong Blender: rig / physics collider / LOD / sửa mesh
#    (prop tĩnh đơn giản → bỏ qua bước này)

# 3. Bake ra baked/ — tái dùng export_glb.py, không viết lại
exec(open(r'C:\Factory\blender\scripts\export_glb.py').read())
print(export_selected_as_glb('chair_01'))   # → baked/chair_01.glb
```

Sau đó deploy như mọi asset: `node scripts/deploy.js chair_01 props/chair-01`.

---

## Character rig lane (feed AnimationSystem)

Khác prop tĩnh: character cần **skeleton + animation** → engine `AnimationSystem` load `gltf.scene` + `gltf.animations`. Spec + contract ở `rig/` ([rig/CONTRACT.md](../rig/CONTRACT.md)).

```python
# 1. Sinh armature từ spec (T-pose, scale theo height_m của character)
exec(open(r'C:\Factory\rig\lib\build_skeleton.py').read())
print(build_skeleton('humanoid-B', 'nobita'))   # → Armature 'rig_nobita', 22 bone

# 2. Skin mesh vào armature (parent → Automatic Weights) + tạo Action đặt tên: Idle/Walk/Run...
#    (tên clip là HỢP ĐỒNG với engine — xem rig/CONTRACT.md mục 2)

# 3. Chọn mesh + armature → export VỚI animation (flag with_animations=True)
exec(open(r'C:\Factory\blender\scripts\export_glb.py').read())
print(export_selected_as_glb('nobita', with_animations=True))   # → baked/nobita.glb
```

Deploy: `node scripts/deploy.js nobita characters/nobita` (meta.json category=characters cần `rig`+`animations`).

---

## Bake checklist

- [ ] Apply all modifiers (Ctrl+A → Apply All)
- [ ] Apply transforms (Ctrl+A → All Transforms) — scale/rotation/location = identity
- [ ] UV: unwrap hoặc kiểm tra UV hiện tại — không có overlapping islands
- [ ] Bake normal map nếu source có high-poly
- [ ] Texture: pack vào .blend trước khi export (File → External Data → Pack Resources)
- [ ] Kiểm tra scale thực tế: 1 Blender unit = 1 meter

---

## Export settings (.glb)

- **Format:** glTF Binary (.glb)
- **Transform:** +Y Up ✅ — Three.js / BabylonJS convention
- **Geometry:** Apply Modifiers ✅
- **Compression:** OFF — gltf-transform xử lý sau
- **Textures:** Automatic ✅ (embedded vào .glb)
- **Animation:** chỉ export nếu mesh có animation cần thiết

---

## Sau export — gltf-transform

```bash
npx gltf-transform optimize input.glb output.glb --compress draco
```

Copy `output.glb` → `../Engine/assets/[category]/[name]/production/`

---

## Validate

```bash
# Chạy từ thư mục Engine/THREEJS/
node validate.js ../assets/[category]/[name]
```
