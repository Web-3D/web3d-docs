# Multi-Agent Orchestration với Claude Code

> Kiến trúc dùng nhiều Claude Code agent chuyên biệt phối hợp trong một ecosystem.
> Date: 2026-05-17 | Status: F.1 validated, F.2 proposed

---

## Bối cảnh

Web-3D Ecosystem có 4 repo với domain knowledge khác nhau:
- `web3d-projects/` — planning, project bible
- `THREEJS/` — shader, GPU, module library (20 modules, skills: dispose-pattern, shader-tsl...)
- `Factory/` — Blender pipeline, asset production
- `BABYLONJS/` — (tương lai)

Mỗi Claude Code session trong 1 workspace = 1 agent với skills riêng, không cross-repo được.
**Vấn đề:** Human phải switch terminal, re-brief mỗi lần chuyển agent → tốn thời gian.

---

## Vấn đề / Observation

**Skills không cross-repo:** TSL shader skills, dispose-pattern skills chỉ có trong THREEJS workspace.
Planning agent không thể check "FireSystem có unit-pass chưa?" mà không switch session.

**Human làm message bus:** Thông tin từ THREEJS → Planning phải đi qua con người — copy-paste,
re-explain context, dễ mất thông tin.

**Re-brief overhead:** Mỗi lần mở agent mới phải giải thích lại context — project đang làm gì,
đang ở phase nào, blocker là gì.

---

## Phân tích

**Root cause thật:** Không phải human làm message bus — mà là *friction* của việc đó:
1. Agent mới không biết context → hỏi lại
2. Không có shared status → không ai biết ai đang làm gì
3. Handoff format không chuẩn → agent nhận thiếu info

**Human-in-the-loop là feature, không phải bug:**
Human làm orchestrator = quality gate thực sự, có judgment, catch agent đi sai hướng.
Target đúng: human chỉ làm **approve + route** — không phải relay info.

---

## Giải pháp — Phase F (3 tầng)

### F.1 — File Protocol (validated)

`STATUS.md` làm bảng điều khiển trung tâm:
- Active project, phase hiện tại
- Trạng thái mỗi agent
- Blocker đang chờ

Session opener chuẩn (1 câu, không cần re-brief):
```
Đọc _studio/CLAUDE.md + STATUS.md + [project]/HANDOFF.md rồi báo cáo trạng thái.
```

### F.2 — MCP Bridge (proposed)

**Key unlock:** Claude Code là MCP CLIENT — có thể connect đến MCP server từ repo khác.

Setup `.mcp.json` trong web3d-projects:
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

THREEJS MCP tools cần build:
- `list_modules(category?)` → modules + status
- `get_module_info(name)` → meta.json + exports
- `validate_module(name)` → PASS/FAIL
- `get_phase_status()` → phase hiện tại

Factory MCP tools:
- `list_assets(category?)` → validated assets
- `queue_asset_order(spec)` → ghi vào order queue

**Kết quả:** Planning agent hỏi "FireSystem sẵn chưa?" → MCP trả lời ngay, không switch terminal.

### F.3 — SDK Orchestrator (future)

Claude Agent SDK cho phép spawn subagent với custom system prompt + restricted tools:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"

// Mỗi agent có domain prompt riêng, tool set riêng
const agents = {
  "threejs": { prompt: THREEJS_CLAUDE_MD, tools: ["Read","Write","Edit","Bash"] },
  "factory": { prompt: FACTORY_CLAUDE_MD, tools: ["Read","Bash"] }
}
```

**Constraints cần biết:**
- Sub-agent KHÔNG spawn được sub-agent (no nesting)
- Sub-agent KHÔNG inherit parent conversation history
- Chỉ giao tiếp qua prompt text + file
- Working directory inheritance chưa documented rõ — test trước khi build on this

---

## Kết quả

| Phase | Status | Impact |
|---|---|---|
| F.1 — STATUS.md + session opener | ✅ Done | Giảm re-brief overhead |
| F.2 — MCP bridge | ⏳ Proposed | Giảm switch-terminal friction |
| F.3 — SDK orchestrator | 🔮 Future | Fully automated routing |

---

## Áp dụng cho AI agent

> Khi bắt đầu session trong bất kỳ workspace nào của Web-3D Ecosystem:
> đọc STATUS.md trong web3d-projects/, không hỏi lại context đã có trong đó.
>
> Khi cần biết module/asset status từ repo khác:
> nếu F.2 đã build → dùng MCP tools.
> nếu chưa → switch terminal và báo user rằng đây là friction cần giải quyết.
>
> Khi propose multi-agent solution:
> giữ Human làm orchestrator — không auto-route mà không có human approval.
