---
title: Multi-Agent Orchestration với Claude Code
type: innovation
domain: agent-system
tags: [mcp, multi-agent, orchestration, hitl, claude-code, cross-repo]
status: validated
date: 2026-05-17
apply_when: "Khi ecosystem có nhiều Claude Code session chuyên biệt cần phối hợp mà không switch terminal liên tục"
related: []
replaced_by: null
---

# Multi-Agent Orchestration với Claude Code

> Dùng MCP bridge + file protocol để nhiều Claude Code agent chuyên biệt phối hợp — human làm orchestrator, không phải relay.

---

## APPLY WHEN

- Có ≥ 2 Claude Code workspace với skills/CLAUDE.md khác nhau cần trao đổi thông tin
- Human đang phải copy-paste output từ session này sang session khác
- Agent cần biết trạng thái repo khác (module có sẵn chưa? asset đã validate chưa?) mà không switch terminal

## DO NOT APPLY WHEN

- Chỉ có 1 workspace — không cần orchestration
- Task thuần coding trong 1 repo — mở THREEJS session thẳng, không qua planning layer
- Muốn fully-automated (không human approval) — F.3 SDK orchestrator chưa stable, không nên dùng trong production workflow

---

## Context

Web-3D Ecosystem có 4 repo với domain knowledge khác nhau:

| Workspace | Domain | Skills |
|---|---|---|
| `web3d-projects/` | Planning, project bible | Studio skills |
| `THREEJS/` | Shader, GPU, modules | dispose-pattern, shader-tsl, triplanar-mapping... |
| `Factory/` | Blender, asset pipeline | gltf-pipeline, bake-policy... |
| `BABYLONJS/` | (tương lai) | — |

Skills không cross-repo — THREEJS skills chỉ load trong THREEJS workspace. Human phải switch terminal để relay thông tin giữa các agent.

## Problem / Observation

**Friction thật** (không phải human làm message bus — mà là chi phí của nó):

1. Agent mới mở → không biết context → hỏi lại từ đầu (~5 phút re-brief mỗi session)
2. Không có shared status → không ai biết agent nào đang ở đâu
3. Planning agent không query được "FireSystem unit-pass chưa?" mà không switch terminal
4. HANDOFF.md format không chuẩn → agent nhận thiếu info, hỏi lại

## Root Cause / Analysis

**Human-in-the-loop là feature, không phải bug.** Human làm orchestrator = quality gate thực sự.

Root cause thật: thiếu 2 thứ:
1. **Shared context file** → agent mới không biết gì
2. **Cross-repo query mechanism** → phải switch terminal để hỏi repo khác

## Solution

### Tầng F.1 — File Protocol (validated)

`STATUS.md` làm bảng điều khiển trung tâm. Session opener chuẩn:

```
Đọc _studio/CLAUDE.md + STATUS.md + [project]/HANDOFF.md rồi báo cáo trạng thái.
```

### Tầng F.2 — MCP Bridge (proposed)

Claude Code là MCP CLIENT — connect được MCP server từ repo khác.

`.mcp.json` trong web3d-projects:

```json
{
  "mcpServers": {
    "threejs": {
      "type": "stdio",
      "command": "node",
      "args": ["c:\\Web-3D\\THREEJS\\mcp-server.js"]
    },
    "factory": {
      "type": "stdio",
      "command": "node",
      "args": ["c:\\Factory\\mcp-server.js"]
    }
  }
}
```

THREEJS MCP tools: `list_modules`, `get_module_info`, `validate_module`, `get_phase_status`
Factory MCP tools: `list_assets`, `queue_asset_order`, `get_order_status`

### Tầng F.3 — SDK Orchestrator (future)

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"
// Spawn subagent với custom system prompt + restricted tools
// Constraint: subagent không spawn được subagent, không inherit parent history
```

## Outcome

| Phase | Status | Impact đo được |
|---|---|---|
| F.1 — STATUS.md + session opener | ✅ Validated 2026-05-17 | Re-brief giảm từ ~5 phút → 1 câu |
| F.2 — MCP bridge (THREEJS + Factory) | ✅ Built 2026-05-17 | Planning agent query cả 2 repo không switch terminal |
| F.3 — SDK orchestrator | 🔮 Future | — |

---

## Known Limitations (2026-05-17)

> Ghi lại để không re-invent khi revisit. Những giới hạn này chưa đau — match đúng workflow 1 người sequential hiện tại.

### 1. MCP 1 chiều — Planning query được THREEJS/Factory, ngược lại không

THREEJS/Factory agent khi xong việc phải tự ghi vào STATUS.md thủ công.
Planning agent không biết có update trừ khi tự đọc lại.
**Chưa đau vì:** workflow sequential, không có 2 agent chạy song song.
**Sẽ đau khi:** F.3 spawn concurrent sub-agents.

### 2. STATUS.md không có locking

2 agent ghi cùng lúc → conflict.
**Chưa xảy ra vì:** human là relay, thực tế là sequential.
**Sẽ vỡ khi:** F.3 SDK Orchestrator spawn 2+ sub-agent đồng thời.

### 3. Factory MCP thiếu `update_order_status`

Order tạo được (queue_asset_order) nhưng không update status được.
Factory agent phải edit asset-orders.json tay.
**Fix:** thêm tool — đã ghi vào `c:\Factory\deferred\README.md`.
**Revisit khi:** Factory agent thực sự xử lý queue.

---

## FOR AI AGENTS

> Đọc section này trước khi bắt đầu bất kỳ session nào trong Web-3D Ecosystem.

**Preconditions:**
- `STATUS.md` tồn tại tại `c:\Projects\studio-3D\STATUS.md`
- `_studio/CLAUDE.md` tồn tại tại `c:\Projects\studio-3D\_studio\CLAUDE.md`

**Steps:**
1. Đọc `STATUS.md` → biết active project, phase hiện tại, blockers
2. Đọc `_studio/CLAUDE.md` → biết role của agent này trong studio
3. Nếu có HANDOFF.md trong project folder → đọc trước khi làm bất cứ gì
4. Cập nhật `STATUS.md` khi xong khâu hoặc chuyển agent

**Watch out for:**
- Không tự switch sang repo khác để check status — nếu F.2 chưa build, báo user đây là friction cần giải quyết
- Không bỏ qua STATUS.md dù session "nhanh" — context mất đi là chi phí thật
- Không tự route task sang agent khác mà không có human approval

**Verify success by:** User không phải re-explain context khi bắt đầu session mới
