# SYNC.md — Shared AI Context Log

> File này là **bảng thông báo tiến độ** của Claude Code (xử lý toàn bộ ecosystem từ 2026-05-29).
> Đọc đầu mỗi session để biết trạng thái hiện tại mà không cần giải thích lại.
>
> **KHÔNG thay thế:**
> - `.claude/skills/module-handoff/` — quy trình Claude tích hợp module vào project (HOW)
>
> **Ghi khi:** breaking API change, quyết định kiến trúc, cross-engine decision.
> **Không ghi:** tạo/xóa module thông thường (→ Living Index), bug fix, typo, format code.

---

## Bảng tổng — tất cả engines

| Engine     | Phase hiện tại                    | Trạng thái              | Modules done | Ghi chú                             |
| ---------- | --------------------------------- | ----------------------- | ------------ | ----------------------------------- |
| `THREEJS`  | Phase E ✅ hoàn thành             | ✅ Phase A–E xong       | 29 / 29      | +3 Phase E: InteractionSystem, AnimationSystem, ScrollTimeline. Docs site live 2026-05-17. |
| `BABYLONJS`| Phase D — Polish & Deploy         | ✅ Hoàn thành           | 14 / 14      | Phase A+B+C+D done. Phase E feasibility study tiếp theo |

> Tiến trình chi tiết → [`/ROADMAP.md`](ROADMAP.md) (nguồn duy nhất cho status).

**Shared assets:** `assets/` — chưa có asset nào, REGISTRY.json trống.

---

## THREEJS

**26 modules — Phase A–D ✅ hoàn thành.**
Gallery: `00-Threejs/src/gallery/` — 16 live canvas cards. Chưa tích hợp vào scene thực tế.
→ Module index + next steps: [`/ROADMAP.md`](ROADMAP.md)

### Log [THREEJS]

#### 2026-06-10 — 🔪 KỆ OPS dùng chung (6 op Houdini-style) + 🎨 PhotoGroundMix — kiến thức Factory↔THREEJS hợp nhất

- **`threejs-modules/ops/` = kệ HÀM THUẦN dùng chung mọi project** (≠ components class): #1 Resample
  (arc-length) · #2 Sweep (parallel-transport) · #3 Copy-to-Points (3 generator + `SurfacePoint`) ·
  #4 Bevel (`bevelProfile` 2D + `filletSpine` 3D) · #5 Scatter (seed/minDist/mask) · #6 Boolean
  (`booleanGeometry` wrap **three-bvh-csg PIN 0.0.17** — 0.0.18 đòi three ≥0.179, KHÔNG nâng lẻ).
  Bảng + quy ước: `threejs-modules/ops/README.md`. Import: `threejs-modules/ops/<file>` (cần alias
  hoặc exports map — archplan có sẵn; project khác muốn dùng thì thêm alias tương tự + `dedupe: ['three']`).
  **Catalog chọn op kế + tiến độ: `c:\Factory\deferred\houdini-algorithms.md`** (sống bên Factory —
  session THREEJS muốn thêm op thì đọc + cập nhật bảng 📊 ở đó, đừng mở catalog song song).
- **`PhotoGroundMix`** (shaders/ground): mix ≤5 texture TSL — bombing iq + height-lerp + mask VẼ TAY
  (PaintMask base64 trong state) + trộn xa; bias/seed/paint-rect = uniform LIVE (không recompile).
  Wired site-kit: zone surface + G0 base (`site.groundMix`). Plan gốc:
  `c:\Factory\deferred\ground-mix-port-plan.md`. Consumer mẫu: archplan ArchPlanLab `_zoneMix`.
- Consumer op trong archplan Lab Mái: ngói âm dương/vảy cá (#3), gối bo khung hồi + con đấu (#4),
  cảnh quanh nhà (#5), 🧱 tường hồi EWG/FXH khoét cửa tròn (#6). Chi tiết hình học: memory
  `canonical-roof-base` (Factory workspace) + `archplan/src/archplan/README.md`.

#### 2026-06-10 — 📦 BREAKING assets: texture gom 5 HỌ + 🌊 Waterfall A2 + gỡ non-bộ procedural
- **BREAKING cross-repo (Factory đọc đây):** `assets/textures/` gom 23 texture → 5 họ
  `ground/ wall/ stone/ wood/ roof/` (roof RỖNG chừa cho mái Factory). Import path đổi
  `assets/textures/<name>/` → `assets/textures/<fam>/<name>/`. Đã trỏ: archplan ArchPlanLab (101) +
  ground-lab dòng 16–24 (file Factory — sửa path-only khi app chết import-analysis). Map + note:
  `assets/textures/PROTOCOL.md`. Texture MỚI: đặt thẳng vào đúng họ. Nợ lộ ra: tên underscore fail
  kebab-case validate (sửa đợt riêng); Wooden_Plank vs wooden_planks nghi trùng.
- **Gỡ non-bộ procedural** (RockCluster + tab Rock + `rocks[]`): paradigm fail ("chưa ra dáng") —
  đá điểm nhấn chuyển hướng **Houdini bake** (`THREEJS/deferred/systems/houdini-bake-accents.md` —
  pipeline khớp Factory Phase E, slot `houdini/` + `textures/roof/` chờ sẵn). Design cũ có key `rocks`
  được parse bỏ qua an toàn.
- **Waterfall A2** (`components/Waterfall`): thác texture-vệt 3 lớp + fresnel + khúc xạ + mist/splash,
  3 draw 0 RTT; tune ở Lab tab 🌊 (quy trình mới: khái niệm mới → tab Lab, KHÔNG html preview rời).
  2 KI mới đọc-source-three: **KI-013** (THREE.Points trên WebGPU = 1px + positionGeometry-offset bug)
  + **KI-014** (`viewportSharedTexture` module-global — 2 renderer giành nhau; cùng họ KI-012).

#### 2026-06-01 (cont.) — Thin-out archplan → LÕI (Phase 0–4) + retire AP4
- **Định hướng kiến trúc:** building-kit = **LÕI** của ecosystem (gọi "lõi", KHÔNG "hạt nhân"). 3 thùng logic:
  dựng-nhà → lõi (headless, no DOM) · GUI → vỏ archplan · city-planning → project. archplan KHÔNG nhúng vào project nào.
- **Đẩy logic dựng-nhà từ archplan xuống lõi** (di dời thuần, 0 đổi hành vi; mỗi phase gate tsc/eslint/build + mắt :3002):
  - **P0** `state.ts` (BuildingState schema + factories + migration) → `building-kit/state.ts` + shim re-export ở archplan.
  - **P1** `build.ts` (build math) + renderer → lõi. `renderBuildingState` (free fn) + `class BuildingRenderer`
    (wrapper headless own ctx+dispose). ArchPlanLab delegate; pick-box giữ ở vỏ qua `Placement[]`. ArchPlanLab 1396→~950.
  - **P2** **retire `BuildingFromPlan`** (AP4 lossy, dormant 0 caller — Doraemon dùng `Building` preset, đường riêng).
    **Gap 2 đóng bằng construction** — 1 renderer canonical đọc `BuildingState` lossless (stairs/balcony/roof-rot/paint full fidelity).
  - **Orphan dọn:** `parts/Stair.ts` xoá; lớp AP4 export (`buildingStateToJSON`+3 hàm) xoá; nút 📄 JSON →
    `serializeDesign` (lossless, **Load lại được**) thay AP4.
  - **P4** reorg `building/` → `render/` (fromState) + `preset/` (Building, config); engine primitive (turtle/build/
    state/tokens/wallAssembly/wallMaterials) **FLAT**; bỏ prefix "Building" ở filename (giữ tên export/class). Git rename-tracked.
- **Luật mới (memory):** trước MỖI phase nêu trade-off+đề xuất; thêm chức năng → phân loại vai trò đầy đủ rồi đặt đúng
  chỗ; "viết báo cáo" = doc-sync .md scope vừa làm.
- Verify: tsc/eslint/build cả 3 project xanh. Tracker: `THREEJS/PLAN-thin-out-archplan.md`. Còn P3 (workspace package) optional khi Babylon. **CHƯA push.**

#### 2026-06-01 — Claude Code (catalog audit + building-kit hardening headless)
- **Catalog drift fixed** — README threejs-modules thiếu 6 module (BaseShaderMaterial, AsphaltGround, BaseGPUEffect, BeamEffect, BillboardSprite, ShockwaveRing). Gốc: 5 trong số đó tạo 2026-05-17 (xem log dưới) nhưng chưa add catalog. Đã bổ sung + thêm cột **Status** (in-use/base/idle) theo grep import consumer thật.
- **Audit usage (3 consumer):** lõi proven = `building-kit` + `BaseWorld` (cả 3 project) + bộ surface/wall archplan (`AsphaltGround`, `BrickWall/ConcretePanel/WoodPlank/MetalPanel`, `InstancedBrickWall/WoodSidingStrip/WoodSidingWall`, `Tabs`, `RuntimeGuard`). ~28/44 module 🗄 **idle** (built-ahead cho gameplay, chưa consumer) — đánh dấu honest, không giả production-ready.
- **building-kit hardening (headless):** phát hiện headless assembler **đã tồn tại** (`BuildingFromPlan`), nhưng turtle/transform **chép tay 2 bản** (editor `build.ts` + headless) → đã drift (headless ép `wallH=floorH`). Tách core `building/turtle.ts` dùng chung → chống KI-001. `BuildingFromPlan` giờ đọc **wallH per-segment**. Verify: tsc 3 project + eslint + vite build archplan đều xanh.
- **archplan rã monolith tiếp:** `ArchPlanLab.ts` 1950→1396 — tách `gui/devhud.ts`, `interaction/highlight.ts` (host-pattern), `state/persistence.ts`; + sau Gap 1 còn 1396.
- **Gap 1 ĐÓNG (material fidelity headless):** tách wall-pipeline ra building-kit dùng chung — `wallMaterials.ts` (WallMaterialCache + surface shaders + brick-tex, +textures/bricks/) + `wallAssembly.ts` (`assembleWall` dispatch 5 nhánh + `mergeWalls`). Editor + `BuildingFromPlan` CÙNG code-path → nhà build từ ngoài render đúng shader-surface/instanced như editor (hết toon), chống drift KI-001. AP4 export chở đủ field material.
- **Gap 2 → ĐÓNG** (xem entry thin-out trên cùng): renderer nhận thẳng `BuildingState` lossless; `BuildingFromPlan`/AP4 retire.

#### 2026-05-30 — Claude Code (cấu trúc: ui/ + known-issues/ + atelier decision)
- **Category module mới `ui/`** — widget DOM thuần (companion UI cho 3D tool, KHÔNG Three.js). Module đầu: `Tabs` (folder-style, ARIA + keyboard). `validate.js` whitelist thêm `ui`.
- **`known-issues/` — hệ thống mới** ở THREEJS root: catalog lỗi thường gặp `KI-NNN` (meta tag category/severity/status). Phân định rõ: `decisions/` = thay đổi cấu trúc lớn · `known-issues/` = lỗi thường gặp.
- **Quyết định atelier ↔ ArchPlan (đang thiết kế, chưa code):** palette node = consumer RUNTIME của atelier (đọc generated palette-index 1 chiều, không live cross-repo import). Model chốt: bảng swatch-lưới + cọ click-3D (pick layer vô hình vì tường merge). Sync mechanism dùng lại Phase 1 generated-file của atelier. ADR sẽ ghi sau spike.
- **Repo 01-Doraemon có remote** → `github.com/Web-3D/Doraemon.git` (trước đó local-only).

#### 2026-05-18 — Claude Code (Phase E hoàn thành)
- **Phase E unit-pass** — 3 modules: InteractionSystem, AnimationSystem, ScrollTimeline
- **InteractionSystem** — Raycaster wrapper: hover/click/pointerEnter/Leave trên bất kỳ Object3D nào, không global state
- **AnimationSystem** — AnimationMixer wrapper: play/crossFade/pause/stop glTF AnimationClip, warnMissing helper
- **ScrollTimeline** — scroll → CatmullRomCurve3 camera path, lookAt fixed|tangent, smooth lerp

#### 2026-05-17 — Claude Code (Docs site + GEMINI.md sync)
- **Docs site live** — VitePress tại `c:\Docs\`, deploy https://docs-3d-ng.vercel.app/
- **GitHub repo** — https://github.com/NgQuan86/web3d-docs (public, auto-redeploy qua Vercel)
- **sync.js** — copy 37+ MD files từ mọi project, `node sync.js --push` để update
- **GEMINI.md cập nhật** — module count 20→26, thêm Factory + Docs vào workspace layout, thêm module index table
- **6 modules mới (untracked, chưa commit vào THREEJS):** BaseGPUEffect, BeamEffect, BillboardSprite, ShockwaveRing, BaseShaderMaterial, BaseWorld

#### 2026-05-16 — Claude Code (Tooling + Refactor)
- **shaders/ restructured** — 3 subfolders: `foundation/` (WorldNoise), `vertex/` (WindAnimation, ProceduralFracture, VATShader), `fragment/` (TriplanarMapping, InteriorMapping, RoundedCorners, DissolveShader)
- **GlobalUniforms v2.0.0 — breaking change** — singleton class + `inject()` → 3 exported TSL `uniform()` nodes + helper functions. Import trực tiếp, không cần `inject()`. Xem `utils/GlobalUniforms/README.md`
- **Scripts mới** — `find-unused.js` (orphan/stale import detector) + `lint-shaders.js` (TSL/GLSL policy enforcer)
- **VERSION_INDEX.md xóa** — `meta.json` là nguồn duy nhất cho version; `scan-versions.js` đọc trực tiếp
- **ARCHITECTURE.md** — thêm File Registry (định danh vai trò từng file trong workspace)
- **WEEKLY-CHECK.md** — thêm bước 2: kiểm tra npm packages định kỳ cả 2 workspaces
- `update-index.js` + `validate.js` + `find-unused.js` — hỗ trợ 2-level module depth (shaders/vertex/WindAnimation)
- `gallery/modules.ts` — fix 7 stale import paths (SparkSystem + GPUParticleSystem: components/ → effects/; 5 shaders: thêm subfolder prefix)

#### 2026-05-15 — Claude Code (Phase D + Gallery)
- **Phase D hoàn thành** — 3 modules unit-pass: PostProcessing (WebGPU bloom), WindAnimation (triNoise3D positionNode), DayNightCycle (sun arc + ambient)
- **Phase C hoàn thành** — VATShader, LODBillboard, CharacterPool unit-pass
- **Gallery update** — 16 modules có live canvas demo tại `00-Threejs/src/gallery/`

#### 2026-05-14 — Claude Code
- `GPUParticleSystem` (components) — unit-pass ✅ | base class GPU particles, builder functions pattern, `ParticleNodeContext`, `ParticleNode` type via `ShaderNodeObject<Node>`
- **Kiến trúc:** `SparkSystem` refactored → wrap `GPUParticleSystem` (composition, không phải inheritance). Public API SparkSystem giữ nguyên 100%.
- Cross-module import: `SparkSystem` import từ `../GPUParticleSystem` — được phép khi documented trong `meta.json` dependencies

#### 2026-05-13 — Claude Code (session 2)
- `SparkSystem` (components) — unit-pass ✅ | GPU-driven particles, `PointsNodeMaterial`, TSL, 3 emitter shapes, turbulence
- **Phase B hoàn thành** — 4/4 modules unit-pass
- tsconfig path alias `threejs-modules/*` — dùng `vite-tsconfig-paths`, không dùng `file:` protocol
- `package.json` exports map đã thêm vào `threejs-modules/` (chuẩn bị npm publish sau này)
- `LODSystem` (utils) — unit-pass ✅ | wrap `THREE.LOD`, typed levels, autoUpdate
- `ProceduralFracture` (shaders) — unit-pass ✅ | `triNoise3D` vertex displacement along normal
- `InteriorMapping` (shaders) — unit-pass ✅ | tangent-space parallax, per-room hash variation

#### 2026-05-13 — Claude Code
- `WorldNoise` (shaders) — unit-pass ✅ | `triNoise3D` built-in, world-space animated noise
- `RoundedCorners` (shaders) — unit-pass ✅ | UV-space SDF, transparent `NodeMaterial`
- **Phase A hoàn thành** — 5/5 modules unit-pass
- `TriplanarMapping` (shaders) — unit-pass ✅ | import từ `three/webgpu`, `three/tsl`
- Fix `RuntimeGuard/example.ts` — đổi sang `WebGPURenderer` (WebGLRenderer không có `render.drawCalls`)

#### 2026-05-12 — Claude Code
- Tạo `BABYLONJS/` engine skeleton — `CLAUDE.md` + `babylon-modules/`
- Cập nhật `SYNC.md` → cấu trúc multi-engine (sections per engine)
- Cập nhật root `CLAUDE.md`, `GEMINI.md`, `.claude/README.md`, `.gemini/README.md` — link đúng cả 2 engine
- Init git ecosystem root → github.com/Web-3D/ecosystem-context-ai (public)
- Init git BABYLONJS → github.com/NgQuan86/babylonjs-modules (public)

#### 2026-05-09 — Claude Code
- Setup workspace root git repo (`THREEJS/`) — track AI instructions + scripts + skills
- Thêm `assets/REGISTRY.json` (auto-updated bởi validate.js sau mỗi asset PASS)
- Thêm caching vào `validate.js` — skip re-validate nếu file không đổi (hash MD5)
- Thêm `SYNC.md`, `DEFERRED.md`
- Gitignored: `.validate-cache.json`, `settings.local.json`, 3 subproject repos

---

## BABYLONJS

**14/14 modules — Phase A+B+C+D ✅ hoàn thành (2026-05-18).** Phase E (feasibility study) tiếp theo.
→ Module index: [`/ROADMAP.md`](ROADMAP.md)

### Log [BABYLONJS]

#### 2026-05-18 — Claude Code (Phase D hoàn thành)
- **PostProcessing** unit-pass ✅ — `DefaultRenderingPipeline`: bloom auto-apply qua `scene.render()`, không cần `pp.render()` như Three.js
- **WindAnimation** unit-pass ✅ — ShaderMaterial GLSL: TSL `triNoise3D` → value noise3D tự impl; object-space + `worldViewProjection`
- **DayNightCycle** unit-pass ✅ — `THREE.AmbientLight` → `HemisphericLight`; `light.position` → `light.direction`; `Color3.Lerp()` thay mutate-in-place
- **Phase D ✅ hoàn thành** — 3/3 modules, tổng 14 modules toàn engine

#### 2026-05-18 — Claude Code (Phase A bắt đầu)
- Tạo `00-Babylon/` project — Vite + TypeScript + Babylon.js 8.56.2
- `RuntimeGuard` unit-pass ✅ — adapt từ THREEJS, dùng `SceneInstrumentation.drawCallsCounter` + `scene.totalActiveIndicesPerfCounter.current / 3`
- `TriplanarMapping` unit-pass ✅ — NME programmatic wiring: `TriPlanarBlock` (built-in) + `TransformBlock` cho world pos/normal
- `WorldNoise` unit-pass ✅ — NME: `SimplexPerlin3DBlock` + `AnimatedInputBlockTypes.RealTime` (không cần update() thủ công)
- `RoundedCorners` unit-pass ✅ — ShaderMaterial GLSL: UV SDF, engine auto-convert WGSL
- **Phase B hoàn thành:** LODSystem (Mesh.addLODLevel), ProceduralFracture (GLSL vertex displacement), InteriorMapping (GLSL parallax + UV derivatives), SparkSystem (GPUParticleSystem + NoiseProceduralTexture)
- **Phase C hoàn thành:** VATShader (GLSL ES3 + gl_VertexID), LODBillboard (BILLBOARDMODE_ALL plane), CharacterPool (TransformNode generic pool)

#### 2026-05-12 — Claude Code
- Tạo engine skeleton: `BABYLONJS/CLAUDE.md` + `babylon-modules/`

---

## CROSS-ENGINE

> Quyết định ảnh hưởng tất cả engines hoặc thay đổi quy ước chung của ecosystem.

### Log [CROSS]

#### 2026-05-12 — Claude Code
- Đổi tên thư mục `BABYLON/` → `BABYLONJS/` trong toàn bộ docs ecosystem

---

## Quy tắc ghi SYNC.md

**Ghi vào đây khi:**
- Breaking change API của module (params đổi tên, method bị xóa)
- Quyết định kiến trúc quan trọng ảnh hưởng nhiều engine
- Thay đổi cross-engine (đổi convention, đổi cấu trúc thư mục chung)
- Update trạng thái phase (module xong → update bảng tổng + bảng engine)

**Không ghi:** tạo module mới (→ Living Index tự update), bug fix, typo, format code.

**Format mỗi entry:**
```
#### YYYY-MM-DD — Claude Code
- [Nội dung thay đổi ngắn gọn — 1 dòng mỗi thay đổi]
```

**Thêm engine mới:** thêm 1 dòng vào Bảng tổng + 1 section `## TENENGINE` mới.
