# 08 — Build Phases

> Thứ tự thực thi. Mỗi phase có exit criteria rõ ràng trước khi chuyển phase tiếp.

---

## Phase A — Asset Production (Factory)

**Mục tiêu:** Toàn bộ asset 3D production-ready trong `Web-3D/assets/`.

**Exit criteria:** Mọi asset trong danh sách dưới đây đều `validate.js PASS`.

| Asset | Category | Status | Ghi chú |
|---|---|---|---|
| ... | buildings | ⏳ | ... |
| ... | props | ⏳ | ... |
| ... | environments | ⏳ | ... |

---

## Phase B — Scene Foundation

**Mục tiêu:** Scene load được, camera đúng, assets hiện trong viewport.

**Exit criteria:** Chạy được không lỗi, FPS > 30 trên target device.

| Task | Status | Ghi chú |
|---|---|---|
| Setup BaseWorld / R3F canvas | ⏳ | |
| Load tất cả assets từ Phase A | ⏳ | |
| Camera position + controls | ⏳ | |
| Basic lighting (không có DayNight) | ⏳ | |

---

## Phase C — Shaders & Effects

**Mục tiêu:** Visual đúng với art style đã định nghĩa trong `04-art-style.md`.

**Exit criteria:** Screenshot gần với reference image.

| Task | Module | Status |
|---|---|---|
| DayNightCycle | DayNightCycle | ⏳ |
| Wind trên cây | WindAnimation | ⏳ |
| Bloom + color grading | PostProcessing | ⏳ |
| Texture tường | TriplanarMapping | ⏳ |
| VFX effects | ... | ⏳ |

---

## Phase D — Polish & Deploy

**Mục tiêu:** Production-ready, deploy lên Vercel.

**Exit criteria:** Lighthouse score > 80, FPS stable, không memory leak sau 5 phút.

| Task | Status | Ghi chú |
|---|---|---|
| Performance audit (RuntimeGuard) | ⏳ | |
| Mobile test | ⏳ | |
| Vercel deploy | ⏳ | |
| Docs update | ⏳ | |

---

## Timeline estimate

| Phase | Estimate | Depends on |
|---|---|---|
| A — Asset Production | ___ tuần | Blender MCP setup |
| B — Scene Foundation | ___ ngày | Phase A |
| C — Shaders & Effects | ___ ngày | Phase B |
| D — Polish & Deploy | ___ ngày | Phase C |
