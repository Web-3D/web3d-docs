# 06 — Module Mapping

> Module nào từ `threejs-modules/` dùng cho gì trong scene này.
> Đây là cầu nối giữa kế hoạch và implementation.

---

## Module Usage Map

| Module | Category | Dùng cho | Zone | Priority |
|---|---|---|---|---|
| `GlobalUniforms` | utils | uTime, uDelta inject toàn scene | All | Must |
| `RuntimeGuard` | utils | Monitor draw calls / triangles | Dev | Must |
| `DayNightCycle` | utils | Bầu trời + ánh sáng theo giờ | All | High |
| `PostProcessing` | components | Bloom, color grading | All | High |
| `WindAnimation` | shaders | Cây, cỏ đung đưa | Zone _ | Medium |
| `TriplanarMapping` | shaders | Texture tường, mặt đường | Zone _ | Medium |
| `BeamEffect` | effects | _[dùng cho gì?]_ | Zone _ | Low |
| `SparkSystem` | effects | _[dùng cho gì?]_ | Zone _ | Low |
| `BillboardSprite` | effects | NPC ở xa | Zone _ | Medium |
| `LODBillboard` | components | LOD cho character | Zone _ | Medium |

_Xóa row không dùng, thêm row mới nếu cần._

---

## Custom Modules cần build thêm

_Module chưa có trong `threejs-modules/` — cần tạo mới cho dự án này._

| Module mới | Vai trò | Dependency | Estimate |
|---|---|---|---|
| ... | ... | ... | ... |

---

## Module Load Order

_Thứ tự init quan trọng — module sau có thể depend vào module trước._

```
1. GlobalUniforms.init()
2. RuntimeGuard(renderer)
3. DayNightCycle(scene)
4. [các module khác theo thứ tự]
```

---

## Integration Notes

_Ghi chú đặc biệt về cách các module kết hợp với nhau trong scene này._
