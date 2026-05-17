# 02 — World & Map

> Bản đồ địa hình, zones, tỉ lệ không gian.

---

## Tỉ lệ thực tế

| Đơn vị | Tương đương |
|---|---|
| 1 Three.js unit | _vd: 1 mét_ |
| Chiều cao nhân vật | _vd: 1.7 units_ |
| Kích thước scene tổng | _vd: 100 × 100 units_ |
| Camera far plane | _vd: 500 units_ |

---

## Zones (Khu vực)

_Chia scene thành các khu vực có tên. Mỗi zone = 1 vùng render riêng biệt._

| Zone | Mô tả | Kích thước | Priority |
|---|---|---|---|
| Zone A | ... | ... | High |
| Zone B | ... | ... | Medium |
| Zone C | ... | ... | Low |

---

## Terrain & Ground

| Thuộc tính | Giá trị |
|---|---|
| Kiểu địa hình | _flat / hills / mixed_ |
| Ground material | _vd: asphalt, grass, dirt_ |
| Tiling texture scale | _vd: 10 units/tile_ |
| Procedural hay baked? | _vd: baked từ Blender_ |

---

## Ranh giới scene (Boundary)

_Người dùng có thể đi tới đâu? Giới hạn camera như thế nào?_

- Camera movement: _free / fixed / orbit / rail_
- Boundary treatment: _invisible wall / fog / fade out_

---

## Sơ đồ bố cục (ASCII map)

```
+--------------------------------------------------+
|                                                  |
|   [Zone A]           [Zone B]                    |
|                                                  |
|         [Zone C]                                 |
|                          [Zone D]                |
|                                                  |
+--------------------------------------------------+
     ↑ North          Camera mặc định nhìn hướng này
```
