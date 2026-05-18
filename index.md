---
layout: home

hero:
  name: Web-3D Docs
  text: Three.js · Babylon.js · Factory
  tagline: GPU effects, shaders, asset pipeline — tài liệu nội bộ ecosystem
  actions:
    - theme: brand
      text: Three.js Modules
      link: /threejs/
    - theme: alt
      text: Ecosystem Map
      link: /#ecosystem-architecture

features:
  - title: Three.js Engine ✅
    details: 26 modules — GPU effects, TSL shaders, utils, components. Phase D hoàn thành.
    link: /threejs/
  - title: Babylon.js Engine ⏳
    details: Phase A-E planned — mirror Three.js + high-fidelity rendering roadmap.
    link: /babylonjs/
  - title: Factory Pipeline ✅
    details: Phase 0 complete — MCP server, asset orders queue, Blender deploy pipeline.
    link: /factory/
  - title: Multi-Agent Orchestration ✅
    details: F.1 file protocol + F.2 MCP bridge — Planning agent query THREEJS và Factory không switch terminal.
    link: /knowledge/innovations/multi-agent-orchestration
---

## Ecosystem Architecture

Toàn bộ ecosystem gồm 5 workspace. `web3d-projects/` là trung tâm chỉ huy — kết nối với các repo khác qua **MCP bridge** (query real-time) và **file protocol** (STATUS.md, HANDOFF.md).

```
  ╔═══════════════════════════════════════════════════════════════╗
  ║        web3d-projects/   (Command Center)                    ║
  ║        STATUS.md  ·  HANDOFF.md  ·  asset-order.md          ║
  ╚══════════════════╤══════════════════════════╤════════════════╝
                     │ MCP bridge               │ MCP bridge
          ┌──────────┘                          └──────────┐
          │  list_modules · get_module_info                │  list_assets · get_asset_info
          │  validate_module · get_phase_status            │  queue_asset_order · get_order_status
          ▼                                                ▼
  ┌───────────────────────────┐          ┌────────────────────────────────┐
  │       THREEJS/            │          │          Factory/              │
  │    Three.js Engine        │          │     DCC Asset Pipeline         │
  │    Phase D  ✅            │          │     Phase 0  ✅                │
  │    26 modules ready       │          │     MCP server · orders queue  │
  └─────────────┬─────────────┘          └────────────────┬───────────────┘
                │  ← import                               │  deploy.js
                │                                         ▼
                │                          ┌──────────────────────────────┐
                └─────────────────────────►│       Web-3D/assets/         │
                                           │   .glb  production-ready     │
                                           │   buildings · characters      │
                                           │   environments · props        │
                                           └──────────────────────────────┘
  ┌───────────────────────────────────────────────────────────────────────┐
  │      BABYLONJS/   ⏳ Phase A — planned (mirror Three.js roadmap)      │
  └───────────────────────────────────────────────────────────────────────┘
```

### Phase Status

| Workspace | Vai trò | Phase | Trạng thái |
|---|---|---|---|
| `web3d-projects/` | Command Center — planning, project bible, MCP hub | F.2 MCP Bridge | ✅ Active |
| `THREEJS/` | Three.js engine — GPU effects, TSL shaders, modules | Phase D — 26 modules | ✅ Complete |
| `Factory/` | DCC pipeline — Blender → .glb → production | Phase 0 — MCP server | ✅ Ready |
| `BABYLONJS/` | Babylon.js engine | Phase A | ⏳ Planned |
| `Web-3D/assets/` | Shared 3D assets — dùng chung mọi engine | — | Shared storage |

### Connection Types

| Từ | Đến | Cơ chế | Mô tả |
|---|---|---|---|
| `web3d-projects` | `THREEJS` | MCP stdio | Planning agent query module status không switch terminal |
| `web3d-projects` | `Factory` | MCP stdio | Planning agent tạo asset order, check queue status |
| `web3d-projects` | tất cả | File protocol | STATUS.md (shared state) · HANDOFF.md (task transfer) |
| `Factory/baked/` | `Web-3D/assets/` | `deploy.js` | .glb thô → compressed production-ready |
| `THREEJS/` | `Web-3D/assets/` | TypeScript import | Load .glb bằng GLTFLoader trong scene |
