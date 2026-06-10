# 07 — Infrastructure

> Repo structure, asset pipeline, CI/CD, naming conventions.

---

## Repo Structure

```
[project-name]/
├── src/
│   ├── world/          ← Scene assembly
│   ├── imported/       ← Modules từ threejs-modules (không sửa)
│   └── assets/         ← Symlink hoặc copy từ Web-3D/assets/
├── public/
│   └── models/         ← .glb files (production-ready)
├── SUMMARY.md          ← Handoff doc cho Claude khi tích hợp module
└── package.json
```

---

## Asset Naming Convention

| Loại | Convention | Ví dụ |
|---|---|---|
| Building | `bld_[name]_lod[n].glb` | `bld_nobita_house_lod0.glb` |
| Prop | `prp_[name].glb` | `prp_lamp_post.glb` |
| Character | `chr_[name].glb` | `chr_doraemon.glb` |
| Texture | `[asset]_[type].png` | `bld_nobita_house_albedo.png` |
| Environment | `env_[name].glb` | `env_road_segment.glb` |

---

## Asset Path Convention

```
Web-3D/assets/
├── buildings/[name]/production/    ← buildings
├── props/[name]/production/        ← street furniture, objects
├── characters/[name]/production/   ← characters
└── environments/[name]/production/ ← terrain, sky, ground
```

---

## CI / Automation

| Task | Trigger | Tool |
|---|---|---|
| Validate asset | sau Factory deploy | `node validate.js` |
| Sync docs | push to main | GitHub Actions |
| Type check | pre-commit | Husky + tsc |
| Deploy preview | PR open | Vercel |

---

## AI Workflow

| AI | Vai trò trong project này |
|---|---|
| **Claude Code** | Toàn bộ: module integration, shader, scene assembly, Factory liaison (qua MCP), git, Blender pipeline |

> Gemini rời hệ sinh thái 2026-05-29 (Antigravity bỏ hỗ trợ IDE) — Claude đảm nhận solo. NgQuan duyệt + quyết định push.

**Handoff protocol:** Planning session viết `HANDOFF.md` → THREEJS session đọc và build.
