# Knowledge Base — Web-3D Ecosystem

> Tủ hồ sơ kỹ thuật. Mỗi entry = 1 case đã xử lý — vấn đề, phân tích, giải pháp.
> Mục đích kép: tài liệu cho con người **và** nguồn context cho AI agent.

---

## Cách dùng

**Cho con người:** Tìm theo category → đọc case liên quan trước khi bắt đầu task tương tự.

**Cho AI agent:** Đọc section liên quan trước khi propose solution.
Nếu problem bác gặp **đã có trong đây** → solution đã được validate, dùng ngay, đừng reinvent.

---

## Categories

| Category | Nội dung | Khi nào đọc |
|---|---|---|
| [Decisions](decisions/) | Tại sao chọn X thay vì Y — trade-off đã cân nhắc | Trước khi thay đổi stack hoặc architecture |
| [Errors](errors/) | Bug gặp phải → root cause → fix đã verify | Khi gặp lỗi tương tự |
| [Innovations](innovations/) | Insight mới, approach chưa phổ biến, discovery | Khi tìm hướng giải quyết |
| [Patterns](patterns/) | Proven code/workflow patterns đã dùng nhiều lần | Trước khi viết abstraction mới |

---

## Entries

### Innovations
- [Multi-Agent Orchestration](innovations/multi-agent-orchestration) — Kiến trúc multi-agent với MCP bridge, HITL pattern, Phase F roadmap

### Decisions
_(chưa có entry)_

### Errors
_(chưa có entry)_

### Patterns
_(chưa có entry)_

---

## Quy trình thêm entry mới

```
1. Xác định category (decision / error / innovation / pattern)
2. Tạo file: _knowledge/[category]/[kebab-case-title].md
3. Dùng template bên dưới
4. Cập nhật mục "Entries" trong file này
5. node c:\Docs\sync.js --push
```

### Template

```markdown
# [Tiêu đề]

> Một câu tóm tắt vấn đề hoặc insight.
> Date: YYYY-MM-DD | Status: validated / proposed / deprecated

---

## Bối cảnh
[Tại sao issue này phát sinh — context project, giai đoạn nào]

## Vấn đề / Observation
[Mô tả rõ vấn đề hoặc insight]

## Phân tích
[Root cause hoặc reasoning]

## Giải pháp / Approach
[Cái đã làm hoặc đề xuất làm]

## Kết quả
[Outcome — validated? partial? pending?]

## Áp dụng cho AI agent
[Câu lệnh ngắn cho AI biết khi nào dùng knowledge này]
```
