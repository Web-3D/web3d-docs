# SYNC.md — Shared AI Context Log

> File này là **bảng thông báo tiến độ chung** giữa Claude Code và Gemini.
> Đọc đầu mỗi session để biết trạng thái hiện tại mà không cần giải thích lại.
>
> **KHÔNG thay thế:**
> - `.claude/skills/module-handoff/` — quy trình Claude tích hợp module (HOW)
> - `.gemini/skills/handoff-to-claude/` — quy trình Gemini viết SUMMARY.md (HOW)
> - `SUMMARY.md` trong từng project — payload cụ thể của mỗi handoff (WHAT to integrate)
>
> **Ghi khi:** breaking API change, quyết định kiến trúc, cross-engine decision.
> **Không ghi:** tạo/xóa module thông thường (→ Living Index), bug fix, typo, format code.

---

## Bảng tổng — tất cả engines

| Engine     | Phase hiện tại                    | Trạng thái              | Modules done | Ghi chú                             |
| ---------- | --------------------------------- | ----------------------- | ------------ | ----------------------------------- |
| `THREEJS`  | Phase D ✅ hoàn thành             | ✅ Tất cả 4 phases xong | 26 / 26      | 26 modules. +6 mới: BaseGPUEffect, BeamEffect, BillboardSprite, ShockwaveRing, BaseShaderMaterial, BaseWorld. Docs site live 2026-05-17. |
| `BABYLONJS`| Phase A — Environment Foundation  | ⏳ Chưa bắt đầu         | 0 / 4        | Bắt đầu sau khi THREEJS Phase D xong |

> Tiến trình chi tiết → [`/ROADMAP.md`](ROADMAP.md) (nguồn duy nhất cho status).

**Shared assets:** `assets/` — chưa có asset nào, REGISTRY.json trống.

---

## THREEJS

**26 modules — Phase A–D ✅ hoàn thành.**
Gallery: `00-Threejs/src/gallery/` — 16 live canvas cards. Chưa tích hợp vào scene thực tế.
→ Module index + next steps: [`/ROADMAP.md`](ROADMAP.md)

### Log [THREEJS]

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
- Init git ecosystem root → github.com/NgQuan86/Web-3D-Ecosystem (public)
- Init git BABYLONJS → github.com/NgQuan86/babylonjs-modules (public)

#### 2026-05-09 — Claude Code
- Setup workspace root git repo (`THREEJS/`) — track AI instructions + scripts + skills
- Thêm `assets/REGISTRY.json` (auto-updated bởi validate.js sau mỗi asset PASS)
- Thêm caching vào `validate.js` — skip re-validate nếu file không đổi (hash MD5)
- Thêm `SYNC.md`, `DEFERRED.md`
- Gitignored: `.validate-cache.json`, `settings.local.json`, 3 subproject repos

---

## BABYLONJS

**0 modules — Phase A chưa bắt đầu. Điều kiện bắt đầu đã đạt ✅ (THREEJS Phase D xong).**
→ Module index: [`/ROADMAP.md`](ROADMAP.md)

### Log [BABYLONJS]

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
- Quyết định kiến trúc quan trọng ảnh hưởng cả 2 AI
- Thay đổi cross-engine (đổi convention, đổi cấu trúc thư mục chung)
- Update trạng thái phase (module xong → update bảng tổng + bảng engine)

**Không ghi:** tạo module mới (→ Living Index tự update), bug fix, typo, format code.

**Format mỗi entry:**
```
#### YYYY-MM-DD — [Claude Code | Gemini]
- [Nội dung thay đổi ngắn gọn — 1 dòng mỗi thay đổi]
```

**Thêm engine mới:** thêm 1 dòng vào Bảng tổng + 1 section `## TENENGINE` mới.
