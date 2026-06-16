# Web vs Game — hướng dùng & framework

> Phân loại: cái gì hợp **web hiện tại**, cái gì để dành cho **game engine sau**, và hướng framework (vanilla → R3F/drei).
> Nguyên tắc: **thuật toán/asset port được; framework/renderer thì không.**

---

## 1. Hai hướng, hai bài toán

| | Web (hiện tại) | Game engine (sau — Unreal pivot) |
|---|---|---|
| Mục tiêu | Trang/app 3D tương tác, chạy browser | Game thật (leo núi, gameplay "bảo bối") |
| Ràng buộc | Budget chặt (draw<100, tri<500k), tải nhanh, WebGPU/WebGL | GPU mạnh, asset nặng, physics đầy đủ |
| Va chạm | raycast / sample heightmap (rẻ, không physics engine) | physics thật (Rapier/engine collision) |
| Không gian | nhỏ + perception tricks fake rộng | rộng thật, streaming |

**Cầu nối = archviz.** Đừng pivot sớm — web hiện tại là nền + kho thuật toán/asset port được.

## 2. Cái gì hợp WEB (giữ nhẹ)
- **Instancing + LOD + camera-relative tiling** — bound cost bất kể map.
- **Surface shader no-UV / procedural** — đẹp mà 0 asset texture nặng.
- **Raycast thay physics** — picking, ground placement, terrain height.
- **GPU particles thưa** — weather, ambient (coi chừng overdraw).
- **Perception tricks** — phòng nhỏ thấy rộng, tiết kiệm geo.
- **Vertex displacement** — cỏ/gió/water, rẻ trên GPU.

## 3. Cái gì để dành cho GAME (built-ahead, đang 🗄 idle)
- **Physics Rapier** — `PhysicsWorld`/`RigidBody`/`CharacterController`/`CollisionEventBus`. Hiện idle = kho hạt giống.
- **Terrain walkable** — Gaea heightmap + collision + chunked LOD streaming (núi leo-được).
- **Crowd/audio** — `CharacterPool`, `AudioSystem` spatial.
- Các effect gameplay (`VATShader`, `DissolveShader`, beam/shockwave) cho "bảo bối".

→ Web KHÔNG cần mấy cái này ngay; đừng kéo vào làm nặng. Nhưng đã xây sẵn nên lúc pivot không phải làm lại.

## 4. Port được gì khi lên game?
| Port được ✅ | Không port ❌ |
|---|---|
| Thuật toán (ops Houdini, building-kit logic, decay hash, wind/grass math) | Three.js renderer / WebGPURenderer |
| Asset đã bake (.glb qua Factory) | TSL NodeMaterial (viết lại shader theo engine đích) |
| Token tỉ lệ, decomposition data (Forge) | Framework UI (R3F/DOM) |
| Kiến trúc lõi/vỏ/project, status discipline | BaseWorld / loop / DOM |

---

## 5. Hướng framework: vanilla → R3F / drei + HTML↔3D

**Đang cân nhắc (chưa chốt):** bỏ JS thuần, chuyển **R3F (react-three-fiber) + drei**, kết hợp HTML và 3D.

### Tin tốt: module hiện tại PORT ĐƯỢC
R3F **chạy trên chính Three.js** (nó là reconciler declarative, không thay Three.js). Module của mình là **Three-native** → tái dùng:
- `building-kit`/`site`/`ops` trả `THREE.Group`/geometry → nhét vào R3F qua `<primitive object={...}>` hoặc `useMemo`.
- Shader TSL NodeMaterial → tạo material rồi gắn qua `<primitive>`/`attach`.
- `GrassBlades`/`InstancedBrickWall`/... = mesh thật → wrap được.
→ **Đầu tư vanilla KHÔNG mất.**

### Cái gì bị R3F/drei thay thế
| Hiện có | R3F/drei tương đương |
|---|---|
| `BaseWorld` (own renderer+loop) | `<Canvas>` (R3F sở hữu renderer+loop) |
| `InteractionSystem` (raycast wrapper) | `onClick`/`onPointerOver` built-in (R3F raycast sẵn) |
| `Tabs` DOM widget | React component tự nhiên |
| Camera/controls tay | drei `<OrbitControls>`, `<CameraControls>`… |
| update loop thủ công | `useFrame()` |
| `RuntimeGuard` | adapt vào `useFrame` (giữ logic) |

### HTML ↔ 3D (đúng cái bác muốn)
- **drei `<Html>`** — nhúng DOM vào tọa độ 3D (label, panel bám object). Chính là "HTML + Three.js trong đó luôn".
- **React overlay** — UI 2D phủ trên canvas (HUD, menu) = React thường.

### Trade-off — đánh giá thẳng
- **Lợi:** declarative (scene = component tree), state mgmt React, **hệ drei khổng lồ** (hàng trăm helper), HTML↔3D mượt, dễ tuyển/cộng tác.
- **Hại:** thêm tầng React reconciler (overhead nhỏ), learning curve, **TSL/WebGPU + R3F còn bleeding-edge** (drei WebGPU mới, mình xài TSL nặng → ở biên). Vanilla cho max control/perf.
- **Định vị:** R3F là lựa chọn **hướng WEB** (React ecosystem, web app). KHÔNG giúp hướng **game-engine** (Unreal) — lúc đó framework bỏ, chỉ thuật toán/asset đi theo.

### Tiêu chí quyết
- Làm **web product tương tác** (nhiều UI, HTML↔3D, scene động) → **R3F + drei** hợp lý.
- Cần **max perf / control tuyệt đối / TSL-WebGPU sâu** → cân nhắc giữ vanilla cho phần lõi render, R3F cho phần app/UI.
- Trước khi chuyển: **spike nhỏ** — port 1 scene (vd gallery hoặc 1 nhà building-kit) sang R3F + drei `<Html>`, đo perf + độ vừa của TSL/WebGPU, rồi mới quyết toàn bộ.
