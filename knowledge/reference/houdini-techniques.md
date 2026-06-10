---
title: Bản đồ kỹ thuật Houdini — tra cứu toàn cảnh
description: Danh mục chi tiết các kỹ thuật hay của Houdini + đường áp dụng vào web-3D ecosystem. Tầng THAM KHẢO — tiến độ port nằm ở Factory catalog.
audience: human, ai-agent
---

# Bản đồ kỹ thuật Houdini — tra cứu toàn cảnh

> **Vai trò:** đọc để BIẾT Houdini có gì → chọn kỹ thuật có chủ đích thay vì may rủi.
> **KHÔNG phải catalog tiến độ** — bảng tiến độ + chọn op kế = `c:\Factory\deferred\houdini-algorithms.md`
> (nguồn sự thật duy nhất, cập nhật ở đó). Doc này cập nhật 2026-06-10, trạng thái ✅ là ảnh chụp thời điểm đó.

**Ký hiệu đường áp dụng vào web:**

| Ký hiệu | Nghĩa |
|---|---|
| **A-TS** | cấy thuật toán TypeScript chạy live trong browser (kệ `threejs-modules/ops/`) |
| **A-wrap** | trục A nhưng wrap thư viện JS/WASM sẵn — không tự viết |
| **A-shader** | làm bằng TSL/shader runtime (không phải geometry CPU) |
| **B-bake** | bắt buộc đi Houdini bake ra .glb/texture — web không kham nổi |
| **B-Gaea** | giao cho lane Gaea (heightmap .r32) |
| ✅ | ecosystem ĐÃ có (ghi rõ ở đâu) |

---

## §1 — TRA THEO NHU CẦU (bắt đầu từ đây)

| Muốn làm gì | Kỹ thuật đúng | Đường | Trạng thái |
|---|---|---|---|
| Chia đều vật thể dọc đường cong (đèn dọc lối đi, cọc rào cong, viên đá viền) | Resample (arc-length) + Copy to Points | A-TS | ✅ op #1 + #3 |
| Thanh/xà/khung chạy theo đường cong, tiết diện bất kỳ, thon dần | Sweep + ramp scale | A-TS | ✅ op #2 (xà mái đao) |
| Bo tròn/vát cạnh thanh, gối cong chỗ 2 thanh gặp nhau | PolyBevel / fillet spine | A-TS | ✅ op #4 |
| Rải cây/đá/cỏ random trên mặt đất, tránh vùng cấm | Scatter + mask + Copy to Points | A-TS | ✅ op #5 (🌿 cảnh quanh nhà) |
| Khoét lỗ xuyên khối (cửa tròn, hang, giao 2 khối) | Boolean (CSG) | A-wrap | ✅ op #6 (tường hồi cửa tròn) |
| Lợp ngói / lát gạch / ốp tấm theo mặt cong | Copy to Points theo hàng (rows) trên surface hàm | A-TS | ✅ op #3 (ngói âm dương, sân lát) |
| Đặt vật bám theo địa hình gồ ghề (đá theo gò) | Ray (drape) — chiếu điểm xuống mặt | A-TS | ✅ biến thể = drapeStonesToTerrain |
| Texture đất/đá không lặp ô (anti-tiling) | Texture bombing + macro noise + height-lerp + mask vẽ | A-shader | ✅ PhotoGroundMix 6 trụ |
| Tường rêu phong, chân tường bám bùn, vệt nước chảy | Gravity/position mask kiểu Substance generators | A-shader | kế hoạch nối ground-mix |
| Mesh AI-gen/scan bẩn → sạch | Fuse/Weld + Remesh + PolyReduce (decimate) | A-wrap | một phần (gltf-pipeline) |
| LOD tự động cho asset nặng | PolyReduce (QEM) | A-wrap | `meshoptimizer` — chưa cấy |
| Mái cho mặt bằng đa giác BẤT KỲ (L/T/U) | Straight Skeleton | A-TS/wrap | ⏳ op #8 (xa) |
| Đá non bộ / vách đá hero nhìn gần | VDB + boolean + erosion + bake normal/AO | **B-bake** | 📐 kế hoạch vòng MÔI TRƯỜNG E2 |
| Terrain km-scale có xói mòn thật | Heightfield Erode | **B-Gaea** | 📐 vòng MÔI TRƯỜNG E1 |
| Cây/bonsai đẹp | Labs Tree tools / L-System | B-bake (hero) · A-TS (stylized) | ⏳ |
| Tường nứt vỡ, gạch đổ TĨNH | Voronoi Fracture | A-TS/wrap | ⏳ verify lib trước |
| Khói/lửa/nước sim, vải | Pyro/FLIP/Vellum → bake VAT/Alembic | **B-bake** | xa |
| Vật cong theo bề mặt khác (dây leo ôm cột) | Path/Surface Deform · Lattice | A-TS | ⏳ |
| Biến thể 1 asset thành N phiên bản (đá to nhỏ méo) | Attribute Randomize + noise displace per-copy | A-TS | ✅ một phần (jagVertices, decay gạch) |

---

## §2 — Polygon / mesh ops

| Kỹ thuật | Làm gì | Khi nào cần | Đường |
|---|---|---|---|
| PolyExtrude | đùn mặt theo normal/hướng, inset | khối kiến trúc, gờ chỉ, panel lồi lõm | A-TS — ✅ biến thể `solidify` (roof-lab) |
| PolyBevel | vát/bo cạnh mesh | mọi thứ "bớt CG sắc lẹm" | A-TS — ✅ đường rẻ op #4 (bevel lúc SINH); bevel mesh tổng quát hoãn |
| Boolean | union/subtract/intersect | khoét lỗ, giao khối, cắt hang | A-wrap — ✅ op #6 `three-bvh-csg` pin 0.0.17 |
| Fuse / Weld | gộp đỉnh trùng | nối mảnh, hàn seam, sạch mesh | A-TS — ✅ ý tưởng position-key (vertexNormalsByPosition) |
| Remesh (đều tam giác) | lưới lại đều cạnh | trước displace/deform cho đẹp | A-wrap — chưa cần |
| Subdivide (Catmull-Clark) | chia mịn làm mượt | prop stylized mượt | A-wrap `three-subdivide` |
| PolyReduce (QEM) | giảm poly giữ dáng | LOD, asset scan nặng | A-wrap `meshoptimizer.simplify` |
| Smooth / Relax (Laplacian) | thư giãn lưới | hậu xử lý scan/AI-gen | A-TS dễ |
| Clip / Mirror / Array | cắt phẳng, đối xứng, lặp | nửa nhà đối xứng, hàng cột | A-TS dễ — mái đã lặp 4 góc tay |
| PolyExpand2D | offset polygon 2D (nở/thót đều) | viền coping, vành quanh hồ | ✅ = `offsetPolygon` (site-kit) |
| Triangulate2D | đa giác 2D → tam giác | nền tự do, slab đa giác | ✅ = THREE.Shape/ShapeGeometry (earcut) |
| Convex Decomposition | tách mesh thành khối lồi | collision physics sau này | A-wrap (`v-hacd` wasm) — xa |

## §3 — Curve & Surface

| Kỹ thuật | Làm gì | Khi nào cần | Đường |
|---|---|---|---|
| Resample | chia lại curve ĐỀU theo chiều dài thật | nền của MỌI op curve — Bézier t-đều ≠ dài-đều | ✅ op #1 `arcLength`/`resampleCurve` |
| Sweep | tiết diện quét dọc spine + twist/scale ramp + caps | xà, khung, ống, diềm, tay vịn, KHUNG CỬA | ✅ op #2 parallel-transport |
| Carve | cắt đoạn curve theo fraction | lấy nửa đường, đoạn giữa | ✅ ý tưởng tStart/midT (hip beams) |
| Skin / Loft | nối dãy curve thành mặt | mái cong, thuyền, vải tĩnh | A-TS — ✅ 1 dạng Coons patch (4 biên) |
| Revolve (lathe) | xoay tiết diện quanh trục | chum, lư, cột tròn, bát | ✅ three có sẵn `LatheGeometry` |
| Ramp attribute dọc curve | giá trị biến thiên theo chiều dài | thon đầu xà, phình chân cột | ✅ pattern taper (mái) |
| Fillet spine 3D | bo góc polyline hở thành cung liền | khung gỗ gập, ống nước cong | ✅ op #4 `filletSpine` |
| Project curve on surface | chiếu đường lên mặt | lối đi vẽ trên terrain | A-TS — biến thể drape |

## §4 — Scatter / Copy / Instancing (cỗ máy làm cảnh)

| Kỹ thuật | Làm gì | Khi nào cần | Đường |
|---|---|---|---|
| Scatter | rải điểm theo mật độ/diện tích + mask | cây, đá, cỏ, rác, props | ✅ op #5 (MeshSurfaceSampler + seed + minDist + mask) |
| Copy to Points | instance object theo điểm + orient/scale | map THẲNG sang InstancedMesh | ✅ op #3 (grid/rows/cols generators) |
| Attribute Randomize | random per-point có seed | xoay/scale/màu mỗi instance khác nhau | ✅ pattern hash01/mulberry32 |
| Relax points | đẩy điểm bớt dính chùm (poisson) | phân bố tự nhiên hơn dart-throwing | A-wrap — minDist hiện đủ |
| Instance per-color / variant | đổi variant theo attribute | phá lặp hàng loạt (gạch sạm, ngói úa) | ✅ instanceColor decay (BrickPaving) |
| Packed primitives | instance lồng instance, nhẹ RAM | rừng cây, khu phố N nhà | = InstancedMesh lồng group — khi làm neighborhood |
| Mask by feature (slope/height/AO/curvature) | điểm chỉ rải nơi thỏa điều kiện | cỏ chỉ mọc đất thoải, rêu nơi khuất | A-TS — slope/height dễ khi có heightfield; deferred rule slope |

## §5 — Deformers (biến dạng không phá topology)

| Kỹ thuật | Làm gì | Khi nào cần | Đường |
|---|---|---|---|
| Bend / Twist / Taper | uốn, xoắn, thon theo trục | cột cong, cây nghiêng, biến thể prop | A-TS dễ (transform per-vertex theo hàm) |
| Lattice | khung lưới bao biến dạng tự do | nặn khối lớn không sculpt | A-TS trung bình |
| Path Deform | mesh chạy/uốn theo curve | rồng ôm cột, dây leo, hàng rào theo đồi | A-TS — họ hàng sweep |
| Surface Deform / Wrap | mesh bám theo mặt khác | vải phủ bàn, tuyết đậu mái | B-bake nếu phức tạp |
| **Ray (drape)** | chiếu đỉnh/điểm xuống mặt dưới | đặt vật bám terrain | ✅ = `drapeStonesToTerrain` (path bám gò) |
| Peak | đẩy đỉnh dọc normal | phồng/xẹp nhanh | A-TS 1 dòng |
| Soft selection / falloff | biến dạng có vùng ảnh hưởng mềm | nặn gò, kéo mũi mái | ✅ pattern hipTent/tipCurlOffset (falloff field) |

## §6 — Attributes & VEX patterns (meta — đáng học nhất)

| Pattern | Làm gì | Bài học cho ecosystem |
|---|---|---|
| **Attribute-driven everything** | mọi op đọc/ghi attribute trên điểm | ✅ ĐANG theo: op nhận **hàm** (inset theo v, mask theo vị trí) thay hằng số → mask/ramp/noise điều khiển mọi thứ không cần op mới |
| AttribTransfer (proximity) | lan giá trị từ vật A sang vật B theo khoảng cách | "gần hồ thì ẩm/sẫm màu", "gần lối đi thì cỏ mòn" — A-TS dễ, chưa cấy |
| Group by bbox/normal/angle | chọn vùng theo điều kiện hình học | op chỉ tác động vùng chọn — làm khi ≥2 op cần |
| For-Each loop | lặp op trên từng piece/group | xử lý từng viên/mảnh độc lập — pattern JS map sẵn có |
| Solver (iterative) | lặp tích lũy qua N bước (growth, lan) | rêu LAN dần, vết nứt LAN — A-TS khi cần hiệu ứng growth |
| Measure (area/curvature) | đo diện tích/độ cong ghi vào attribute | mask theo độ cong (mòn ở cạnh lồi) — họ curvature |
| Point cloud lookup (pcopen) | tra k điểm gần nhất | blur attribute, lan giá trị — HashGrid op #5 là dạng này |

## §7 — Noise & Displacement

| Kỹ thuật | Làm gì | Khi nào cần | Đường |
|---|---|---|---|
| Mountain / Attrib Noise | displace đỉnh theo Perlin/Simplex/Worley | đá, đất, gỗ cong vênh | A-TS — ⏳ op #7 (kế hoạch); ✅ biến thể jagVertices (đá viền), fbm terrain.ts |
| Ramp/mask displace | đẩy theo field có falloff | gò có chủ đích, lún cục bộ | ✅ pattern mounds + tipCurl |
| Worley/Voronoi noise | tế bào — đá nứt, da, sợi nước | texture procedural | ✅ shader (Voronoi strand thác nước) |
| Domain warp | méo miền noise cho hết "lưới đều" | terrain/texture tự nhiên hơn | ✅ terrain.ts warp |

## §8 — Volumes / VDB (vương quốc bake)

| Kỹ thuật | Làm gì | Khi nào cần | Đường |
|---|---|---|---|
| VDB from Polygons → Smooth → Convert | mesh→volume→mesh: boolean robust, làm sạch, dilate/erode | đá hero, hang động, khối hữu cơ sạch | **B-bake** — lý do tồn tại chính của Houdini connector (vách đá E2) |
| VDB Combine (CSG volume) | boolean không bao giờ fail | khối phức tạp boolean mesh hay nổ | B-bake |
| Cloud / Fog volume | mây khói thể tích | trời, sương thung lũng | B-bake hoặc né (web: SDF raymarch / fog rẻ) |

## §9 — Heightfields / Terrain → lane Gaea

| Kỹ thuật | Làm gì | Đường |
|---|---|---|
| HF Erode (hydraulic/thermal) | xói mòn thật — rãnh nước, sườn tự nhiên | **B-Gaea** (.r32 contract — vòng MÔI TRƯỜNG E1) |
| HF Scatter / mask by slope-height | rải theo độ dốc/cao độ | A-TS dễ KHI có heightmap — cây không mọc vách đứng |
| HF Noise / Terrace | tầng ruộng bậc thang, nhiễu nền | A-TS / A-shader |
| HF Flow Field | bản đồ dòng chảy (nước đổ đường nào) | B-Gaea xuất splat — texture ướt/suối |

## §10 — Fracture & Simulation

| Kỹ thuật | Làm gì | Đường | Ghi chú |
|---|---|---|---|
| Voronoi Fracture | đập khối thành mảnh (TĨNH) | A-TS/wrap | tường nứt, gạch vỡ trang trí — JS thiếu lib 3D-voronoi tốt, verify trước |
| RBD destruction / Pyro / FLIP / Vellum | sim phá hủy/khói/nước/vải | **B-bake** (VAT/Alembic→glb) | sim offline = vương quốc Houdini, đừng mơ cấy |
| Physics runtime web | va chạm thật trong browser | khác mảng | rapier/ammo — chuyện Engine runtime, không phải DCC |

## §11 — UV / Texture / Baking

| Kỹ thuật | Làm gì | Đường |
|---|---|---|
| UV Flatten (unwrap tự động) | trải UV mesh procedural | A-wrap — `xatlas` WASM chạy browser |
| UV Project / Triplanar | chiếu texture không cần UV | ✅ triplanar runtime sẵn (TexturedSurface) |
| Bake normal/AO high→low | nướng chi tiết mesh nặng vào texture | **B-bake** — đúng bake policy Factory |
| Anti-tiling / stochastic texturing | phá lặp ô texture | ✅ PhotoGroundMix 6 trụ (bombing+macro+height-lerp+mask vẽ+normal blend+dual-scale) |
| Hex-tiling 3-tap (Mikkelsen) · histogram-preserving | anti-tiling cao cấp hơn | A-shader — deferred có chủ đích |
| Substance-style generators (gravity/position mask) | rêu chân tường, vệt nước chảy dọc | A-shader — bước nối ground-mix → tường |

## §12 — Procedural kiến trúc (đặc sản đúng hướng archplan)

| Kỹ thuật | Làm gì | Đường | Ghi chú |
|---|---|---|---|
| **Straight Skeleton** | sinh MÁI từ footprint đa giác BẤT KỲ | A-TS/wrap **khó** | ⏳ op #8 — chân trời kế tiếp của Lab Mái |
| L-System | văn phạm sinh cây/dây leo | A-TS | cây stylized; bonsai hero → B-bake |
| Stair / Railing generator | cầu thang lan can parametric | A-TS | tổ hợp sweep + array — "đủ op thì asset tự ra" |
| Ivy / Growth | dây leo bám mesh | A-wrap/TS | ivy-generator ports — kiến trúc cổ |
| Building generator (Labs) | nhà từ rule + module | tham khảo TƯ DUY | building-kit của ta = đường riêng đã chạy |
| Facade/window grammar (CGA-style) | mặt đứng theo văn phạm | tham khảo | deferred procedural-generation-techniques |

## §13 — SideFX Labs đáng biết (free toolkit)

| Tool | Làm gì | Liên hệ ecosystem |
|---|---|---|
| Labs Tree tools | cây parametric đủ loài | nguồn bake cây/bonsai (vòng MÔI TRƯỜNG E3) |
| Labs Rock/Cliff generators | đá vách procedural | tham khảo recipe cho vách đá E2 |
| Labs Texture Bake / Maps Baker | bake nhanh normal/AO/curvature | chuẩn pipeline B-bake |
| Labs Lot Subdivision | chia lô đất khu phố | khi làm neighborhood (deferred) |
| Labs Road Generator | đường + giao lộ từ curve | city sau này |
| Labs Edge Damage / Cable | sứt mẻ cạnh, dây điện | decay đã có hướng riêng (instanceColor) |

## §14 — Automation (PDG / TOPs / CLI)

| Kỹ thuật | Làm gì | Liên hệ |
|---|---|---|
| PDG / TOPs | dependency graph chạy hàng loạt (1 .hip → 100 biến thể asset) | tư duy cho Factory warehouse (orders schema đã có) |
| hbatch / hython | chạy Houdini headless CLI | Houdini connector Phase E (G1-②) |
| Gaea CLI (`Gaea.Build.exe` + variables) | rebuild heightmap từ ngoài | ⚠️ chỉ Professional $199 — xem `deferred/systems/terrain-gaea-heightmap.md` |
| Wedging (biến thể tham số) | 1 setup → N seed/param khác nhau | bộ variants đá/ngói (Hybrid lane #2 houdini-bake-accents) |

## §15 — Tư duy nền (quan trọng hơn mọi op lẻ)

1. **Attribute-driven**: dữ liệu (mask/ramp/noise trên điểm) điều khiển op — không phải tham số hằng. Op mới luôn nhận HÀM.
2. **Tách generator ↔ instancer ↔ deformer**: điểm sinh ở đâu / đặt gì lên / méo thế nào = 3 tầng độc lập, ghép tự do (op #3+#5 đã theo).
3. **Asset mới = tổ hợp op cũ** — mái đao = #1+#2+#3+#4+#5. Trước khi viết code mới: tra kệ `threejs-modules/ops/` đã.
4. **Đúng tầng giao hàng**: live-editable → A-TS/shader · tĩnh-mà-đẹp → B-bake · terrain lớn → B-Gaea (memory `project-build-vs-houdini-by-delivery-constraint`).
5. **Wrap trước, tự viết sau** — boolean/decimate/unwrap đều có lib chiến đấu rồi.

---

## Liên hệ

- **Catalog tiến độ (nguồn sự thật):** `c:\Factory\deferred\houdini-algorithms.md`
- **Kệ op đã cấy:** `Engine/THREEJS/threejs-modules/ops/README.md` (6 op, 2026-06-10)
- **Kế hoạch bake accent:** `Engine/THREEJS/deferred/systems/houdini-bake-accents.md`
- **Lane Gaea:** `Engine/THREEJS/deferred/systems/terrain-gaea-heightmap.md`
- Docs gốc: [SideFX SOP nodes](https://www.sidefx.com/docs/houdini/nodes/sop/) · [SideFX Labs](https://www.sidefx.com/products/sidefx-labs/)
