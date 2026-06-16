# Modules theo vai trò

> Nhóm theo CHỨC NĂNG (không phải theo folder). Status đo **đã qua tích hợp project thật chưa** — KHÁC `meta.status` (unit-pass).
> ✅ in-use · 🧱 base · 🗄 idle (xây sẵn) · 🆕 mới. Chi tiết từng cái → [catalog /threejs/modules](/threejs/modules) + page auto mỗi module.

**Lõi đã chứng minh:** `building-kit` + `BaseWorld` + bộ surface/wall của archplan + `ops/*`. Phần lớn còn lại 🗄 idle = built-ahead cho gameplay tương lai.

---

## 1. Lõi dựng hình procedural (sub-libraries)

| Module | Vai trò | Status |
|---|---|---|
| `building-kit` | LÕI sinh nhà procedural — `parts/` + `tokens` + `turtle` (plan geometry) + `wallAssembly`/`wallMaterials` (1 nguồn) + `render/fromState` (renderer canonical lossless) + `preset/Building` (city runtime) | ✅ in-use |
| `site` (site-kit) | Sinh sân vườn/lô quanh nhà — `state` + `render/fromState` (nền/cỏ/hồ/rào). Lô = building + site | ✅ in-use (G0/G1/G3) |
| `ops/*` | Hàm thuần kiểu Houdini SOP: `resample` `sweep` `copy-to-points` `bevel` `scatter` `boolean` (CSG). Asset mới = TỔ HỢP op | ✅ in-use |

## 2. Shader vật liệu (TSL NodeMaterial)

**Surface procedural (no-UV, triplanar/world-space):**

| Module | Vai trò | Status |
|---|---|---|
| `BrickWall` `ConcretePanel` `WoodPlank` `MetalPanel` | Surface tường procedural | ✅ in-use |
| `AsphaltGround` `GrassGround` | Surface nền (đường/cỏ) world-XZ | ✅ in-use |
| `PhotoGround` `PhotoGroundMix` `TexturedSurface` | Surface PBR từ texture ảnh (mix ≤5 + anti-tiling / triplanar mọi hướng) | ✅ in-use |
| `SeigaihaScreen` `ShojiScreen` `RoofTileJP` | Vật liệu Nhật (fusuma/shoji/ngói kawara) | ✅ / 🗄 |
| `Weathering` | Overlay rêu/bẩn/gỉ/vệt mưa (4 lớp) | 🗄 idle |

**Shader kỹ thuật / hiệu ứng:**

| Module | Vai trò | Status |
|---|---|---|
| `BaseShaderMaterial` | Base abstract cho shader TSL | 🧱 base |
| `TriplanarMapping` `WorldNoise` `RoundedCorners` | Tiện ích shader nền | 🗄 idle |
| `WindAnimation` | Vertex displacement gió (triNoise3D positionNode) | 🗄 idle |
| `ProceduralFracture` `VATShader` `DissolveShader` `InteriorMapping` | Fracture / animation GPU / dissolve / parallax room | 🗄 idle |

## 3. Geometry components (instanced / mesh thật)

| Module | Vai trò | Status |
|---|---|---|
| `InstancedBrickWall` `BrickPaving` `CurvedBrickWall` | Gạch geometry thật (tường/sân/tường cong) + decay tuổi | ✅ in-use |
| `WoodSidingWall` `WoodSidingStrip` | Tường ván gỗ (instanced rẻ / 1-khối mergeable có khoét cửa) | ✅ in-use |
| `GrassBlades` | Cỏ 3D nhú (tier B, multi-species) — cặp với `GrassGround` (tier A) | ✅ in-use |
| `WaterSurface` `Waterfall` `PondFish` | Hồ reflect+refract / thác stylized / đàn koi procedural | ✅ / 🆕 |
| `StoneScatter` | Rải đá dẹt Poisson-disk (stepping-stone) | 🆕 |
| `SkyGradient` | Trời gradient ngày↔đêm qua backgroundNode | ✅ in-use |
| `LODBillboard` `OutlineShader` `PostProcessing` | Swap mesh→billboard / viền chọn / bloom WebGPU | 🗄 idle |

## 4. Effects / VFX (GPU particles)

| Module | Vai trò | Status |
|---|---|---|
| `BaseGPUEffect` `GPUParticleSystem` | Base GPU effect / particles (custom physics qua TSL) | 🧱 base |
| `SparkSystem` `FireSystem` `TrailSystem` `BeamEffect` `BillboardSprite` `ShockwaveRing` | Tia lửa / lửa / vệt / beam / sprite / shockwave | 🗄 idle |
| `Precipitation` `SnowCover` `SplashBurst` | Mưa-tuyết field / tuyết đọng / nước bắn va-chạm (weather) | ✅ active |

## 5. Hệ thống runtime (systems)

| Module | Vai trò | Status |
|---|---|---|
| `BaseWorld` | Scene setup — WebGPURenderer + camera + loop trong 1 class | ✅ in-use |
| `RuntimeGuard` | Canh budget draw/tri/leak mỗi frame | ✅ in-use |
| `GlobalUniforms` | TSL nodes chung uTime/uWeather/uDamage | 🧱 base |
| `InteractionSystem` | Raycaster wrapper — hover/click/pointer | 🗄 idle |
| `AnimationSystem` `ScrollTimeline` | Mixer glTF / camera path theo scroll | 🗄 idle |
| `LODSystem` `CharacterPool` | Wrap THREE.LOD / object pool O(1) | 🗄 idle |
| `DayNightCycle` | Drive Directional+Ambient light theo chu kỳ | 🗄 idle |
| `AudioSystem` | Spatial audio (Web Audio) | 🗄 idle |

## 6. Physics (Rapier — built-ahead cho hướng GAME) 🗄

| Module | Vai trò | Status |
|---|---|---|
| `PhysicsWorld` | Rapier world wrapper (WASM async, gravity, step) | 🗄 idle |
| `RigidBody` | Gắn Rapier body+collider vào mesh, sync sau step | 🗄 idle |
| `CharacterController` | Kinematic WASD + jump + gravity, collision-resolved | 🗄 idle |
| `CollisionEventBus` | Collision → handler (force threshold → VAT/Particle/Audio) | 🗄 idle |

> Cả 4 đều idle — đây là **kho hạt giống cho hướng game** (terrain collision, leo núi, "bảo bối" gameplay). Web hiện tại chưa cần. Xem [Web vs Game](./web-vs-game).

## 7. UI (DOM thuần)

| Module | Vai trò | Status |
|---|---|---|
| `Tabs` | Tabs folder-style DOM — ARIA + keyboard, theme CSS vars | ✅ in-use |
