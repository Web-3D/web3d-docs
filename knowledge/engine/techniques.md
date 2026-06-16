# Kỹ thuật — cách vận hành

> Các kỹ thuật đã thử / đã bàn, kèm cách hoạt động + khi nào dùng + module/deferred liên quan.
> Nguyên tắc xuyên suốt: **GPU-driven + instancing + budget** — kỹ thuật quyết định mượt hay giật, không phải hiệu ứng.

---

## 1. Cỏ tương tác (uốn khi chạm/gió)
**Cách vận hành:** vertex shader đẩy đỉnh blade (gốc đứng yên, đỉnh uốn theo `uv.y`). Nguồn displacement = gió (noise) hoặc vật chạm. KHÔNG dùng physics/Rapier (hàng nghìn blade = chết). Spring-back = damping theo thời gian hoặc fade influence.
**2 cấp:** uniform vật chạm (vài interactor) → influence-map RT (nhiều + để lại vệt).
**Module:** `GrassBlades` (tier B geo) + `GrassGround` (tier A surface) + `WindAnimation`.

## 2. Wind field (gió noise + cơn giật di chuyển)
**Cách vận hành:** nền = scrolling directional noise (sóng gió tự chạy) — rẻ. Cộng thêm **gust agent vô hình** (uniform pos+dir di chuyển bằng curl noise) cho cơn giật cục bộ, uốn theo HƯỚNG di chuyển (khác chạm tay = tỏa tròn).
**Mấu chốt:** 1 wind field → nhiều consumer (cỏ uốn + particles trôi cùng hướng). Đừng bỏ baseline kẻo giữa các cơn cỏ chết cứng.
**Module:** `WorldNoise`, `WindAnimation`, `GlobalUniforms` (uWeather).

## 3. GPU particles (vai trò bổ trợ)
**Cách vận hành:** sim trên GPU (`GPUParticleSystem` base, custom physics qua TSL builder). Preset = composition (`SparkSystem` wrap base, không inherit).
**Vai trò:** làm gió HIỆN trên không (lá/bụi advect theo wind field) · burst khi tương tác (raycast hit → spawn) · weather. KHÔNG làm cỏ bằng particles. Bẫy: overdraw transparent → thưa + nhỏ.
**Module:** `GPUParticleSystem`/`BaseGPUEffect` (base); `Precipitation`/`SnowCover`/`SplashBurst` (weather ✅); `SparkSystem`/`FireSystem`/`TrailSystem`/`BeamEffect`/`ShockwaveRing`.

## 4. Raycasting (1 hệ, nhiều dụng)
**Cách vận hành:** bắn tia → vật cắt + `point`/`distance`/`face.normal`/`uv`/`instanceId`.
**Dùng:** picking/hover/click · đặt vật lên ground · terrain height (bắn xuống) · line-of-sight · hitscan.
**Bẫy + mẹo:** raycast vào **ground plane / proxy** (math, gần free), KHÔNG vào mesh high-poly mỗi frame; mesh nặng → `three-mesh-bvh`; tường merge không pick được từng viên → **lớp box vô hình** để raycast.
**Module:** `InteractionSystem`. (Trong R3F: onClick/onPointerOver built-in → có thể thay.)

## 5. LOD + cỏ/terrain bám camera
**Cách vận hành:** giữ **vòng chi tiết quanh camera, di chuyển theo player** → blade/chunk count **bounded** bất kể map to. Tier: near (geo + tương tác) → mid (geo nhẹ, chỉ wind) → far (billboard/impostor) → very far (**texture trên đất, 0 geometry**).
**Bẫy giật:** pop-in ranh LOD → cross-fade/dither; rebuild cả patch 1 frame → **amortize** (chỉ dải mới lộ, rải vài frame).
**Module:** `LODSystem`, `LODBillboard`.

## 6. Perception tricks (không gian nhỏ thấy rộng)
**Cách vận hành:** game ôm "lời nói dối phối cảnh" — forced perspective (vật xa nhỏ hơn thật) · vista (thấy xuyên ra cảnh lớn) · verticality (trần cao) · atmospheric fog · detail layering · `InteriorMapping` (phòng sâu giả trên mặt phẳng). **Ortho để THIẾT KẾ, perspective để TRÌNH BÀY.**
**Cảnh báo:** FOV rộng KHÔNG phải đòn bẩy chính (méo + frustum to hơn = render nhiều hơn). Tiết kiệm thật = ít geo + occlusion.
**Chi tiết:** `THREEJS/deferred/rendering/perception-tricks-compact-spaces.md`.

## 7. Terrain (Gaea → walkable)
**Cách vận hành:** Gaea sinh heightmap + mask → Factory decimate/bake → Engine. Heightmap = **3-trong-1**: mesh sàn + collision (sample height tại x,z, rẻ — Rapier heightfield chỉ khi cần physics thật) + placement map cho cỏ/đá theo slope. Cùng 1 núi: **far impostor / near walkable chunks** (chunked LOD + stream).
**Quy mô:** núi leo-được + tương tác là cả subsystem (terrain LOD + character controller + cỏ-trên-dốc) — phase riêng.
**Chi tiết:** `THREEJS/deferred/rendering/megascans-gaea-natural-ground.md`.

## 8. Geometry procedural (Houdini ops + instancing + CSG)
**Cách vận hành:** asset = TỔ HỢP `ops` thuần (resample spine → sweep thân → copy-to-points rải viên → bevel bo → scatter → boolean CSG khoét lỗ). Mass count = **InstancedMesh 1 draw**; biến thể/decay = hash vị trí (deterministic, tái lập). Nhà = `building-kit` turtle (plan geometry) + wallAssembly.
**Module:** `ops/*`; `InstancedBrickWall`/`BrickPaving`/`CurvedBrickWall`/`StoneScatter`; `building-kit`.

## 9. Surface shader no-UV (triplanar / world-space)
**Cách vận hành:** vật liệu procedural lát theo **tọa độ world** (XZ hoặc triplanar 3 mặt) → KHÔNG cần UV, đúng mọi hướng/scale, ghép mảng liền mạch. Anti-tiling = bombing (xoay/offset per-ô) + mix nhiều texture + height-lerp.
**Module:** `TriplanarMapping`, `BrickWall`/`ConcretePanel`/..., `AsphaltGround`/`GrassGround`, `PhotoGroundMix`, `TexturedSurface`.
