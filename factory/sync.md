# SYNC.md — Factory AI Log

> Đọc đầu mỗi session để biết context. Ghi sau mỗi quyết định quan trọng.

---

## Trạng thái hiện tại

| Item | Trạng thái |
|---|---|
| Factory skeleton | ✅ Tạo 2026-05-17 |
| Warehouse MCP server (`mcp-server.js`) | ✅ 4 tools, smoke test passed 2026-05-18 |
| Orders queue (`asset-orders.json`) | ✅ Sẵn sàng nhận orders |
| Blender MCP setup | ✅ Phase A hoàn thành 2026-05-18 — 5/5 tasks done |
| First asset qua pipeline | ✅ prop-donut-chocolate — validate PASS 2026-05-18 |
| Deploy automation (`scripts/deploy.js`) | ✅ Phase C hoàn thành 2026-05-18 |
| Asset Scale — 4 category templates + batch export | ✅ Phase D hoàn thành 2026-05-19 |
| rig/ character lane (humanoid-B + build_skeleton + export flag) | 🔧 Tooling sẵn 2026-06-02 — chưa runtime-test (cần Blender) |
| Houdini connector | ⏳ Deferred |
| Unreal connector | ⏳ Deferred |
| Unity connector | ⏳ Deferred |

---

## Log

### 2026-06-11 — make-thumbs.ps1: thumb 64² cho kho texture (palette mix archplan)

- **Script:** `scripts/make-thumbs.ps1` — System.Drawing (0 dependency Windows), đọc `production/basecolor.jpg|png`
  (KHÔNG đụng .ktx2), JPEG q85 HighQualityBicubic, idempotent (skip thumb mới hơn basecolor, `-Force` ghi đè);
  kiêm chèn field `"thumb": "thumb.jpg"` vào meta.json — ghi `[IO.File]::WriteAllText` UTF8 no-BOM + string-insert
  (né bẫy Set-Content BOM/mojibake tiếng Việt PS 5.1, giữ nguyên format file).
- **Chạy lần đầu:** 22/22 bộ ✅ (~1.3KB/thumb, 29KB tổng, 0 warn) — assets repo commit `1ab108a`; chạy lại = 22 skip.
- **PROTOCOL.md (assets/textures):** +row `thumb` schema §2 + dòng cây production/ + mục "Thumb cho UI"
  (palette dùng `<img>` thumb, KHÔNG decode ktx2 ra canvas; thumb = DERIVED, hỏng thì chạy lại script).
- **Pipeline +1 bước:** texture mới → đủ production/ → chạy lại 1 lệnh script (idempotent).
- **Kết quả:** PASS — consumer: palette texture swatch archplan (plan mix-palette-bucket ✅ trọn cùng ngày, Engine/THREEJS).

### 2026-06-02 — Lane character/rig: dựng tooling + chốt boundary với engine

- **Verify hướng mới engine (grep toàn `THREEJS/`, trừ node_modules):**
  - `building/` + `archplan/` = **100% procedural** (parts BoxGeometry + token số `tokens.ts` + config JSON). **0 file `.glb`.** archplan = GUI tác giả config. → Factory **không có cửa** vào mảng building. Không dựng (YAGNI).
  - Engine chỉ load `.glb` ở **`AnimationSystem`** (character: `gltf.scene`+`gltf.animations`) và `ResourceLoader`. → Cửa thật của Factory = **character/rig**.
  - `ARCHITECTURE.md` STAGE 2 = "Blender MCP bake+rig" **trùng charter Factory** → chồng lấn cần theo dõi (ai sở hữu bake stage). User chọn build lane character trước.
- **Gap đã fix:** `export_glb.py` thêm param `with_animations` (mặc định False = prop tĩnh giữ nguyên; True = bật `export_animations` cho character rig). Trước đó hardcode False → không xuất nổi character.
- **`rig/lib/build_skeleton.py`:** đọc `skeletons/<spec>.json` → sinh armature Blender (T-pose, scale `height_m`, mirror `.R`), idempotent. `py_compile` PASS.
- **`rig/CONTRACT.md`:** hợp đồng character `.glb` → AnimationSystem (cấu trúc scene+clips, tên clip canonical `Idle/Walk/Run/Jump`, budget NPC<10k/Hero<30k tris, transform mét+Yup+origin chân).
- **Doc sync:** `blender/PIPELINE.md` (+lane character), `rig/README.md` (+bảng lane + link CONTRACT).
- **Kết quả:** Tooling lane sẵn sàng. **Blocker: runtime-test cần Blender mở + BlenderMCP Start Server** (`get_scene_info` báo not connected). Bước thủ công còn lại: skin mesh + đặt tên Action per character.

### 2026-05-20 — Quyết định kiến trúc: Dual-path rendering (SDF + Polygon)

- **Quyết định:** Forge duy trì 2 output path từ cùng 1 `props.json`:
  - `fromSDF.ts` → GLSL SDF shader → Engine (visual, organic shape, stylized)
  - `toGlb.ts` → `.glb` polygon → Factory gia công → Engine (physics, LOD, character)
- **Lý do:** SDF giải quyết organic shape (Tulip chair, character body) mà polygon primitive không làm được. Factory vẫn cần cho: character rig, physics collider, Houdini VFX, third-party engine.
- **SDF library:** `Forge/sdf/` — primitives.glsl + operations.glsl + domain.glsl (Inigo Quilez math)
- **Factory vai trò mới:** chuyên biệt hóa — organic asset + physics, không còn làm prop tĩnh stylized
- **Áp dụng từ:** session này trở đi

### 2026-05-20 — Forge workflow pivot: catalog-first ingestion

- **Quyết định:** Bỏ CC0 model download + Blender decompose làm primary path. Thay bằng số liệu thực từ catalog sản phẩm (IKEA, nội thất).
- **Lý do:** Số liệu catalog = chính xác hơn, semantic label sẵn, không cần Blender ingestion.
- **Tools mới:** `pipeline/ingest-catalog.ts` + `pipeline/catalog-template.json`
- **Schema update:** thêm license `"catalog-facts"` vào `data/prop-schema.json`
- **Test:** Saarinen Tulip Armless Chair (Knoll) — đọc từ dimensions.com screenshot → 4 parts → validate PASS
- **Bug fix:** `generator/toGlb.ts` line 432 — `setTranslation([pos.x, pos.y, pos.z])` → `[pos.x, pos.z, -pos.y]` (Forge Z-up → GLTF Y-up coordinate conversion)
- **Kết quả:** Pipeline catalog → Forge → Blender phôi hoạt động đúng

### 2026-05-19 — Phase D PASS — Asset Scale hoàn thành

- **Templates:** 4 .blend template tạo qua Blender MCP — props 89KB / buildings 88.7KB / characters 109.4KB / environments 88.5KB
- **Scripts:** `blender/scripts/create_templates.py` + `blender/scripts/batch_export.py` (skip_existing, temp_override fix)
- **Test pipeline:** 4 category × deploy → validate — 4/4 PASS
  - `props/prop-donut-chocolate` ✅ (Phase B, giữ nguyên)
  - `buildings/test-building-placeholder` ✅ 1.15 KB production
  - `characters/test-character-placeholder` ✅ 4.48 KB production
  - `environments/test-environment-placeholder` ✅ 1.11 KB production
- **Fix phát hiện:** meta.json cho characters cần `rig`+`animations`, environments cần `format` — đã update _template tương ứng
- **Fix kỹ thuật:** `bpy.ops.export_scene.gltf()` sau `open_mainfile` cần `temp_override(window, active_object, scene, view_layer)` — đã patch vào batch_export.py
- **Kết quả:** Phase D 6/6 tasks ✅. Factory pipeline hoàn chỉnh cho 4 categories.

---

### 2026-05-18 — Phase C PASS — Deploy Automation hoàn thành

- **Script:** `scripts/deploy.js` — 1 lệnh thay 3 bước tay: optimize → copy → validate → rollback
- **API:** `node scripts/deploy.js <baked-name> <cat/kebab-name>` / `npm run deploy`
- **Test:** `deploy prop_donut_chocolate props/prop-donut-chocolate` → PASS (8/8 checks, 14.1 KB)
- **Rollback:** `rmSync outputGlb` khi validate fail — không để broken asset trong production
- **Fail-fast:** kiểm tra input .glb + meta.json trước khi optimize
- **Rename fixes:** Web-3D → Engine (8 files), Projects → Editions (5 files) — toàn bộ active docs sync
- **Kết quả:** Phase C ✅. Phase D — Asset Scale chờ project thực tế.

### 2026-05-18 — Phase B PASS — prop-donut-chocolate end-to-end thành công

- **Model:** Tạo trong Blender via MCP — 2 objects (Donut_Body 1920 tris + Donut_Icing 1536 tris), 2 materials (Mat_Donut vàng nâu + Mat_Chocolate dark), UV unwrap smart_project
- **Source:** `source/prop_donut_chocolate.blend` — saved via `bpy.ops.wm.save_as_mainfile`
- **Export:** `baked/prop_donut_chocolate.glb` 238.6 KB — PASS (2 objects exported)
- **Optimize:** `gltf-transform optimize --compress draco` → `baked/prop_donut_chocolate_opt.glb` 14.1 KB (**94% giảm**)
- **Deploy:** `Web-3D/assets/props/prop-donut-chocolate/production/prop-donut-chocolate.glb` — kebab-case (Factory dùng underscore, Web-3D dùng kebab-case)
- **Validate:** `node validate.js ../assets/props/prop-donut-chocolate` — **PASS** (8/8 checks ✅, 1 warn: polycount.production null)
- **Bug fix:** `validate.js:92` — `registryPath` sai path (`__dirname/assets/` → `__dirname/../assets/`) — đã fix
- **Known issue:** 3456 tris > budget 2000 (props/standard). `polycount.production` để null → skip budget check. Cần rebuild với major_segments=32, minor_segments=12 cho production thực tế.
- **Kết quả:** Phase B ✅ hoàn thành. Pipeline xác nhận hoạt động đúng đầu cuối. Phase C tiếp theo: `scripts/deploy.js` automation.

---

### 2026-05-18 — Factory skills system tạo xong (5/5 skills)

- **`blender-scene-check`** — verify MCP connection + đúng file + cleanup remnants
- **`blender-export`** — exec export_glb.py → baked/ + size budget check
- **`deploy-pipeline`** — gltf-transform (weld→simplify→normals→draco) + copy + validate + rollback
- **`asset-intake`** — naming convention + source/ placement + asset-orders.json entry
- **`sync-state`** — SYNC.md + ROADMAP.md + CLAUDE.md + asset-orders.json + STATUS.md
- **Design:** Skills encode procedures (workflow) thay vì code patterns — khác THREEJS skills
- **Location:** `.claude/skills/[name]/SKILL.md` — auto-load mỗi session
- **Index:** `.claude/SKILLS-ROADMAP.md`

---

### 2026-05-18 — Blender MCP kết nối thành công (Phase A tasks 1-3)

- **addon.py** copy vào `AppData\Blender Foundation\Blender\5.1\scripts\addons\blender_mcp.py`
- **`.mcp.json`** tạo ở Factory root — command: uvx full path `C:\Users\nguye\.local\bin\uvx.exe`
- **uv** cài tại `C:\Users\nguye\.local\bin\`
- **Smoke test passed:** `get_scene_info` trả về Cube + Light + Camera
- **`export_glb.py`** — `blender/scripts/export_glb.py`, gọi qua `exec(open(...).read())`
- **Test export:** `test_cube.glb` 1.9KB trong `baked/` — PASS
- **Phase A ✅ hoàn thành toàn bộ**

---

### 2026-05-18 — Warehouse foundation done

- **`mcp-server.js`** — MCP stdio server, 4 tools: `list_assets`, `get_asset_info`, `queue_asset_order`, `get_order_status`
- **`asset-orders.json`** — orders queue, Planning agent ghi / Factory agent đọc
- **`package.json`** — `"type": "module"` để server chạy ESM, Node ≥18
- **Smoke test:** `initialize` + `tools/list` passed — server sẵn sàng
- **Design:** `baked/` và `source/` đều flat (không nested theo category)
- **Load point:** `c:\Projects\studio-3D\.mcp.json`

---

### 2026-05-17 — Factory skeleton created

- **Quyết định:** Factory = xưởng sản xuất, Web-3D = sân khấu. Hai repo độc lập, flow 1 chiều.
- **Anchor tool:** Blender — mọi format đều qua Blender trước khi thành .glb.
- **Bake policy:** chỉ geometry + UV + normal + albedo. Shading/lighting/effects = runtime Three.js/BabylonJS.
- **Pipeline:** `source/` → Blender bake → `baked/` → gltf-transform → `Web-3D/assets/[cat]/production/`
- **Feeders (future):** Houdini/Unreal/Unity xuất .abc/.fbx → Blender nhận → .glb
