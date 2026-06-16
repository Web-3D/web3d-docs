# Engine Knowledge Map — THREE.js

> **Tổng hợp sống** về THREEJS engine + hệ liên quan trực tiếp: module, kỹ thuật, vai trò, cấu trúc, hướng web↔game.
> Nguồn canonical: `studio-3D/_knowledge/engine/` → auto-sync lên docs. Cập nhật sau mỗi thí nghiệm / module mới.
> Chi tiết từng module = page auto-gen từ README — trang này **link tới, KHÔNG chép lại** (tránh duplicate/drift).

---

## 3 trang con

| Trang | Nội dung |
|---|---|
| [Modules theo vai trò](./modules-by-role) | Toàn bộ module nhóm theo CHỨC NĂNG + status thật + link catalog |
| [Kỹ thuật](./techniques) | Cách vận hành các kỹ thuật đã thử/bàn (grass, wind, particles, raycast, LOD, perception, terrain, instancing/CSG) |
| [Web vs Game](./web-vs-game) | Phân loại hướng dùng + hướng framework (vanilla → R3F/drei + HTML↔3D) |

---

## Triết lý kiến trúc

- **Lõi / Vỏ / Project** — logic dựng-nhà ở **LÕI** (`building-kit`, headless, no DOM) · GUI ở **VỎ** (`archplan` editor) · quy hoạch ở **PROJECT** (`Doraemon`). archplan KHÔNG nhúng vào project nào.
- **1 nguồn — nhiều consumer** — wall pipeline / building state / wind field: định nghĩa 1 nơi, nhiều nơi đọc. Chép tay → drift (xem `known-issues/KI-001`).
- **Web-first → Game-later** — hiện build cho web (Three.js + TSL/WebGPU, budget chặt). Thuật toán/asset **port được** sang game engine sau; framework thì **không** (xem [Web vs Game](./web-vs-game)).
- **Status trung thực** — ✅ in-use (qua tích hợp) · 🧱 base (class nền) · 🗄 idle (xây sẵn, chưa qua lửa). Không giả production-ready.

## Stack hiện tại

- Three.js **0.174** · TypeScript strict · shader **TSL > WGSL > GLSL** · **WebGPURenderer**.
- Vite · ESLint · `RuntimeGuard` (budget: draw < 100, tri < 500k, tex ≤ 2048).
- 3 consumer thật: `00-Threejs` (gallery) · `01-Doraemon` (city runtime) · `archplan` (editor/vỏ).
- Quy ước module: 1-module-1-folder + `meta.json` + `example.ts` + dispose pattern. Sub-library (`building-kit`, `site`, `ops`) là ngoại lệ nhiều-file.

## Hướng sắp tới (đang cân nhắc, chưa chốt)

Chuyển vanilla TS → **R3F (react-three-fiber) + drei**, kết hợp **HTML ↔ 3D**. Module hiện tại là Three-native nên **phần lớn port được**; một số util bị R3F/drei thay thế (BaseWorld → `<Canvas>`, InteractionSystem → onClick built-in). Trade-off đầy đủ: [Web vs Game](./web-vs-game).
