# Blender Pipeline — Bake & Export Rules

## Input formats

| Format | Source | Ghi chú |
|---|---|---|
| `.blend` | Blender native | Không cần convert |
| `.fbx` | Unreal, Unity, Houdini | Import → bake → export |
| `.abc` | Houdini simulation | Alembic — geometry cache |
| `.obj` | Generic | Fallback |
| `.usd` | Multi-DCC | Emerging standard |

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

Copy `output.glb` → `../Web-3D/assets/[category]/[name]/production/`

---

## Validate

```bash
# Chạy từ thư mục Web-3D/THREEJS/
node validate.js ../../assets/[category]/[name]
```
