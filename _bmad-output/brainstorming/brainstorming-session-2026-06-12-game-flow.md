---
stepsCompleted: [1]
inputDocuments:
  - _bmad-output/planning-artifacts/briefs/brief-qc-pet-2026-06-12/brief.md
  - _bmad-output/specs/spec-qc-pet/SPEC.md
session_topic: 'Game flow, room system, onboarding, daily task loop — QC Pet'
session_goals: 'Xác định rõ các phòng trong game, flow onboarding, daily tasks để quyết định UX và design'
selected_approach: 'Party Mode multi-agent brainstorm'
techniques_used: []
ideas_generated: []
---

## Session Overview

**Topic:** Game flow + room system + onboarding + daily loop cho QC Pet
**Goals:** Xác định đủ chi tiết để làm UX và design

### Confirmed Game World

- 🏢 Phòng làm việc — KHÔNG GIAN CHÍNH (missions, learning)
- 🛏️ Phòng ngủ → Health bar
- 🍳 Phòng bếp → Hunger bar
- 🛋️ Phòng khách → Happiness bar
- 🚿 Phòng tắm → Discipline bar
- 🌿 Sân → vai trò TBD

### Need Bars (Tamagotchi real-time)

Hunger / Happiness / Health / Discipline — giảm theo thời gian thật kể cả offline.

### Core Design Decision

Phòng làm việc là không gian chính + có đủ phòng sinh hoạt như căn hộ thật.

---

## Ideas & Brainstorm Log

### Round 1 — Game Flow, Rooms, Onboarding (Party Mode)

**Agents:** 🎲 Samus (Game Designer), 🎨 Sally (UX Designer), 📊 Mary (Analyst)

---

#### 🎲 Samus — Highlights

- **Sân = Dream Space / Travel Launch Pad**: stargazing mini-game, kết nối sao thành chòm sao bug loại sắp học. Fills Dream Meter (đếm ngược đến evolution), không phải need bar thông thường. Emotional hook: ra sân = mơ cùng Bugsy, không phải fill bar.
- **Room interactions (verb + delight)**: Bếp: kéo bug-food vào miệng Bugsy + collectible quote. Phòng khách: TV channels = quiz topics. Phòng ngủ: tắt đèn + Daily Recap bubble. Phòng tắm: swipe-to-clean = Code Review mini-game. Mirror moment: Bugsy mặc outfit khác theo discipline level.
- **Unlock sequence theo ngày**: Day 1 (Work Room + Bếp) → Day 2 (Ngủ) → Day 3-4 (Khách) → Day 5 (Tắm) → Day 7 (Sân — cinematic unlock moment).
- **Work Room as HQ**: Kanban Mission Board, Bug Report Wall (knowledge tích lũy trực quan), Visitor NPCs (senior tester ghé thăm), Trophy Cabinet, Room grows với player (v0.1 bàn gỗ → v3.0 RGB gaming setup).
- **Perfect Day 3 loop**: 2 phút sáng (check, feed) + 10 phút trưa (Core Mission) + 3 phút tối (Living Room quiz + tắt đèn) = 15 phút/ngày sustainable.

---

#### 🎨 Sally — Highlights

- **Principle: "Căn hộ được khám phá, không được giảng giải"** — không tour guide, rooms reveal qua emotional pulls từ Bugsy (bụng kêu → kitchen; ngáp → bedroom; buồn → living room).
- **Navigation UX**: Isometric Apartment View (bird's eye khi cần, immersive khi muốn). Phòng có visual state: đèn ấm (ổn), nhấp nháy (cần attention), tắt + dấu "?" (chưa unlock). Long press Bugsy → Bugsy suggest phòng cần đến.
- **Day 1**: Chỉ Work Room visible. Cửa bếp hé mở ở góc — không tooltip, chỉ ánh sáng vàng. Tò mò thuần túy.
- **Notification là câu chuyện nhỏ**: "Bụng Bugsy kêu to rồi. Tủ lạnh trống không có gì hết á 😅" — deep link thẳng vào đúng phòng. Smart timing: học theo thói quen user.
- **7-day emotional arc**: D1 tò mò → D2 chăm sóc → D3 đồng cảm (Bugsy cần ngủ) → D4 bất ngờ (Bugsy buồn = root cause analysis) → D5 reflection (Discipline = habits) → D6 tự hào (weekly review) → D7 delight (Sân mở ra, ánh sáng tràn vào).

---

#### 📊 Mary — Highlights

- **Room-to-learning mapping**: Bếp = nộp Bug Report, Ngủ = Spaced Repetition, Khách = Peer Review/Chia sẻ, Tắm = Flash Quiz không hint, Sân = Exploratory Testing tự do (Bug Safari).
- **Daily minimum thực tế**: Chỉ Work Room BẮT BUỘC (5-8 phút). Các phòng khác decay chậm hơn → có thể bỏ 1-2 ngày. Hard minimum = 5-8 phút/ngày (đúng brief). Full experience = 15-20 phút.
- **Decay Rate Hierarchy**: Work Room (24h decay nhanh) > Bếp/Tắm (48h) > Ngủ/Khách (72h) > Sân (không decay, bonus only).
- **"One Room Emergency"**: Mỗi ngày highlight 1 phòng cần nhất → user không cảm thấy phải check hết 6 nơi.
- **Weekend Mode**: Thứ 7-CN decay dừng → giảm guilt, tăng sustainable engagement.
- **Transfer Gate per room**: Work Room = test case thật, Bếp = bug report được confirm, Khách = Sprint Demo Card chia sẻ, Tắm = Streak 7 ngày, Ngủ = Retrospective note, Sân = exploratory session note.
- **Key insight**: "Bugsy không tiến hóa vì user giỏi trong game. Bugsy tiến hóa vì user giỏi hơn trong công việc thật."

---

