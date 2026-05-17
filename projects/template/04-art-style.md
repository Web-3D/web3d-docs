# 04 — Art Style

> Định nghĩa visual language của toàn bộ dự án.
> File này là nguồn duy nhất — mọi asset, shader, lighting đều tuân theo.

---

## Style Category

- [ ] Anime / Cel-shaded
- [ ] Stylized (non-realistic, non-anime)
- [ ] Semi-realistic
- [ ] Photorealistic
- [ ] Low-poly flat
- [ ] Pixel / Voxel

---

## Color Palette

| Vai trò | Hex | Dùng cho |
|---|---|---|
| Primary | `#______` | Nhân vật chính, điểm nhấn |
| Secondary | `#______` | Environment, background |
| Accent | `#______` | VFX, highlight |
| Shadow | `#______` | Shadow tint |
| Sky | `#______` | Sky gradient top |
| Horizon | `#______` | Sky gradient bottom |

---

## Lighting

| Thuộc tính | Giá trị |
|---|---|
| Lighting model | _Physically Based / Toon / Flat_ |
| Key light direction | _vd: 45° từ phía trước-trên-phải_ |
| Shadow softness | _hard / soft / none_ |
| Ambient intensity | _vd: 0.4_ |
| Dynamic time of day | _có / không_ |
| Module | _DayNightCycle / static_ |

---

## Texture Style

| Thuộc tính | Giá trị |
|---|---|
| Hand-painted hay PBR? | ... |
| Texture resolution tối đa | _vd: 1024×1024_ |
| Normal maps | _có / không_ |
| AO maps | _có / không_ |
| Tiling vs unique UV | ... |

---

## Post-processing

| Effect | Strength | Module |
|---|---|---|
| Bloom | _vd: 0.3_ | PostProcessing |
| Outline | _vd: 1px_ | ... |
| Color grading | _vd: warm_ | PostProcessing |
| Vignette | _vd: subtle_ | PostProcessing |

---

## Reference Visual

_Mô tả hoặc link ảnh closest reference._

> "Scene trông giống [tên anime/game/phim] — đặc biệt ở [chi tiết cụ thể]."
