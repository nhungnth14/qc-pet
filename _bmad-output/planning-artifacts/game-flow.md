---
title: "QC Pet — Game Flow Document"
status: draft
created: 2026-06-12
updated: 2026-06-12
source: Brainstorming session 2026-06-12 + Brief + SPEC
phase: Pre-PRD / Pre-UX reference
---

# QC Pet — Game Flow Document

> Tài liệu này định nghĩa game flow, hệ thống phòng, onboarding, và daily loop.
> Dùng làm input trực tiếp cho PRD và UX Design.

---

## 1. Tổng quan Game World

Bugsy — một con bug vừa thoát khỏi production server — dọn vào một **căn hộ nhỏ** và bắt đầu hành trình trở thành một tester giỏi đủ để đi du lịch khắp thế giới.

Căn hộ có **6 không gian**. Mỗi không gian gắn với một nhu cầu và một loại hoạt động học tập khác nhau.

### Sơ đồ căn hộ

```
┌─────────────────────────────────────┐
│  🌿 SÂN                              │
│  (Play area + Shop — Phase 1)        │
├──────────────┬──────────────────────┤
│ 🛋️ PHÒNG    │ 🏢 PHÒNG LÀM VIỆC    │
│    KHÁCH    │    [KHÔNG GIAN CHÍNH] │
│  Happiness  │    Core Missions      │
├──────────────┼──────────────────────┤
│ 🍳 PHÒNG    │ 🛏️ PHÒNG NGỦ         │
│    BẾP      │    Health bar         │
│  Hunger bar │                       │
├──────────────┴──────────────────────┤
│  🚿 PHÒNG TẮM   │  Discipline bar   │
└─────────────────────────────────────┘
```

---

## 2. Hệ thống Phòng & Need Bars

### Nguyên tắc chung
- **4 need bars** giảm theo **thời gian thật** — kể cả khi người dùng không mở app
- **Chỉ Phòng Làm Việc là bắt buộc hàng ngày**
- Các phòng khác có decay chậm hơn → có thể bỏ 1–2 ngày trước khi bar xuống đáng kể
- **Hard minimum mỗi ngày: 5–8 phút** (chỉ Core Mission ở Work Room)
- **Full experience: 15–20 phút/ngày** (tất cả phòng)

### Bảng phòng

| Phòng | Need Bar | Decay Rate | Hoạt động chính | Learning mechanic |
|---|---|---|---|---|
| 🏢 Phòng Làm Việc | (tổng hợp tất cả) | 24h — nhanh nhất | Core Mission (lesson + quiz) | Học bài mới + quiz 3–5 câu |
| 🍳 Phòng Bếp | Hunger | 48h | Feed Bugsy | Nộp Bug Report ("nấu ăn" cho Bugsy) |
| 🛏️ Phòng Ngủ | Health | 72h | Rest | Spaced Repetition review trước khi ngủ |
| 🛋️ Phòng Khách | Happiness | 72h | Play / chill | Peer Review, Side Quest, chia sẻ Sprint Demo Card |
| 🚿 Phòng Tắm | Discipline | 48h | Grooming | Flash Quiz không dùng hint (2–3 câu) |
| 🌿 Sân | — (không decay) | Không có | Play + Shop | Exploratory / bonus (Phase 1 scope bên dưới) |

### Sân — Phase 1 Scope

Sân là không gian mở, **không gắn need bar**, **không bắt buộc**.

**Phase 1:**
- Bugsy ra sân chơi tự do (idle animations ngoài trời)
- **Item Shop**: mua vật phẩm trang trí căn hộ bằng Bug Coins
- Không có learning mechanic bắt buộc

**Phase 2+ (ngoài scope hiện tại):**
- Exploratory Testing mini-game
- Social features / Pet visit
- Travel destination preview

---

## 3. Tương tác trong từng phòng

### 🏢 Phòng Làm Việc — KHÔNG GIAN CHÍNH

**Visual:** Bàn làm việc với màn hình, sticky notes bug reports trên tường, kanban board nhỏ, trophy cabinet. Room grow theo level của Bugsy (v0.1: bàn gỗ đơn giản → v3.0: full setup).

**Cơ chế chính:**
- **Mission Board (Kanban mini):** Card Todo → In Progress → Done. Player kéo card khi hoàn thành.
- **Core Mission:** 1 lesson + 3–5 quiz câu hỏi. Hoàn thành fill tất cả need bars hiệu quả nhất.
- **Bug Report Wall:** Mỗi kiến thức mới unlock = 1 sticky note xuất hiện trên tường. Sau 30 ngày tường đầy = visual progression.
- **Visitor NPCs (Phase 2):** Senior tester, client ghé Work Room để lại challenge đặc biệt.
- **Trophy Cabinet:** Achievement, badges, Bug Trophies. Animation mở cabinet khi earn achievement mới.

**Fill efficiency:** Hoàn thành Core Mission fill TẤT CẢ need bars — đây là lý do work room là trung tâm, không phải chỉ một bar.

---

### 🍳 Phòng Bếp — Hunger Bar

**Visual:** Bếp nhỏ ấm cúng, tủ lạnh, bàn ăn mini.

**Cơ chế chính:**
- **Quick Feed:** Tap để kéo "bug-food" vào miệng Bugsy. Mỗi loại thức ăn = một bug type (cơm = UI bug, phở = logic error, bò lúc lắc = critical bug).
- **Collectible Quote:** Khi Bugsy ăn no, hiện một testing wisdom quote ngẫu nhiên — có thể collect/share.
- **Idle khi đói:** Bugsy mở tủ lạnh trống, nhìn quanh, bụng kêu sôi.

**Learning mechanic:** Nộp Bug Report = "nấu ăn cho Bugsy". Bug report chất lượng → Bugsy no hơn.

**Quick care (non-learning):** Tap feed đơn giản, fill Hunger 1 phần (không bằng nộp Bug Report thật).

---

### 🛏️ Phòng Ngủ — Health Bar

**Visual:** Giường nhỏ, đèn ngủ, rèm cửa.

**Cơ chế chính:**
- **Tắt đèn:** Player tap "tắt đèn" → màn hình fade nhẹ, nhạc ambient, Bugsy ngủ.
- **Daily Recap Bubble:** Khi Bugsy ngủ, thought bubble hiện tóm tắt hôm nay đã học gì — format cute, không phải report khô.
- **Good morning moment:** Lần đầu mở app buổi sáng, Bugsy vươn vai, nói "chào buổi sáng" theo ngôn ngữ của travel destination đang hướng tới (tiếng Nhật, tiếng Pháp...).
- **Idle:** Ngủ gật trên bàn (nếu ở work room và health thấp), đắp chăn, ngáy.

**Learning mechanic:** Spaced Repetition review — 1–2 câu ôn bài cũ trước khi "tắt đèn". Không có điểm, chỉ nhắc nhở.

**Note:** Không nên có mini-game phức tạp ở đây — phòng ngủ phải là sanctuary, không phải challenge.

---

### 🛋️ Phòng Khách — Happiness Bar

**Visual:** Sofa, TV, đèn ấm, kệ sách nhỏ.

**Cơ chế chính:**
- **TV Channels = Quiz:** Bugsy xem TV, player chọn kênh. Mỗi kênh là một mini-quiz chủ đề QC. Trả lời đúng → Bugsy vui, nhảy múa.
- **Delight moment:** Tap vào Bugsy đang ngồi trên sofa → Bugsy giật mình rồi cười. Không có tác dụng game — pure delight.
- **Sprint Demo Card share:** Chia sẻ card từ đây → fill Happiness lớn.
- **Movie Night (weekly event):** Phim hoạt hình ngắn 30s về QC history, sau đó boss quiz. Max Happiness nếu đạt điểm cao.

**Learning mechanic:** Side Quests (Peer Review, Repro Steps), chia sẻ kiến thức ra ngoài = "khách đến chơi."

---

### 🚿 Phòng Tắm — Discipline Bar

**Visual:** Gương lớn, vòi hoa sen, kệ đồ dùng.

**Cơ chế chính:**
- **Flash Quiz:** 2–3 câu nhanh, không dùng hint. "Vệ sinh tinh thần" mỗi ngày.
- **Mirror moment:** Sau khi xong, Bugsy nhìn vào gương. Discipline bar cao → Bugsy mặc outfit đẹp, tự tin. Discipline thấp → tóc tai bù xù, trông mệt mỏi. Visual feedback tức thì.
- **Streak tracker nhỏ:** Hiển thị số ngày liên tiếp đã làm flash quiz.

**Learning mechanic:** Flash quiz không hint = thước đo kỷ luật thật sự, không phải chỉ biết đúng sai.

---

### 🌿 Sân — Open Space (Phase 1)

**Visual:** Không gian ngoài trời, cỏ, bầu trời, đơn giản và thoáng.

**Phase 1 features:**
- Bugsy chạy ra sân, idle animations ngoài trời (chạy nhảy, nằm cỏ, nhìn trời)
- **Item Shop:** Browse và mua vật phẩm trang trí căn hộ bằng Bug Coins
- Không có task bắt buộc — không gian thư giãn

**Idle behaviors ngoài sân:** Nằm nhìn mây, đuổi bướm, ngủ trên cỏ dưới ánh nắng.

---

## 4. Idle Behaviors — Bugsy tự làm gì khi không được tương tác

Bugsy có **hành động vô tri** phản ánh trạng thái need bars hiện tại. Khi mở app, player thấy Bugsy đang làm gì đó — không bao giờ chỉ đứng yên.

| Trạng thái | Idle behavior |
|---|---|
| Tất cả ổn | Gõ bàn phím chậm rãi, nhìn màn hình, uống cà phê, viết note rồi vò ném |
| Hunger thấp | Bụng kêu sôi, mở tủ lạnh trống, nhìn menu đồ ăn trên điện thoại |
| Happiness thấp | Ngồi ngẩn ngơ, tựa đầu vào bàn, thở dài |
| Health thấp | Ngủ gật, mắt lim dim, gõ phím sai liên tục, đắp chăn nhỏ |
| Discipline thấp | Lướt mạng thay vì làm việc, ăn snack lúc đêm khuya |
| Sau khi làm mission | Nhảy lên, cười, lấy vali ra ngắm nghía, mơ màng |

---

## 5. Onboarding Flow — Day 1

### Nguyên tắc
> "Căn hộ được khám phá, không được giảng giải."
Không có tour guide. Rooms reveal qua emotional pulls từ Bugsy. Player tự hiểu qua hành động, không qua tutorial text.

### Sequence chi tiết

```
Màn hình tối → tiếng bàn phím → quả trứng run rẩy
    ↓
Bugsy nở ra, ngáp, nhìn vào camera
    ↓
[Đặt tên pet] — 3 gợi ý + free text
    ↓
Micro-bridge: "Mình hơi đói rồi... mà mình chỉ ăn bug thôi."
    ↓
[Warm-up] Bug report ngắn — Pass / Fail
    ↓
[Aha Moment] Bug report đầy đủ (Scenario B + D)
    ↓
[Story-Rule Feedback] Bugsy kể câu chuyện → Rule landing
    ↓
[Reward] BC và QP animate. Server đã commit TRƯỚC animation.
    ↓
[Cliffhanger] "Bạn nghĩ mình có qua được không...?"
    ↓
[Notification Preference] Sáng / Tối / Không cố định
    ↓
[Sign-up Gate] "Lưu [tên pet] lại" — motivated by attachment
    ↓
HOME — Phòng làm việc. Cửa bếp hé mở ở góc màn hình.
       Không có tooltip. Chỉ là ánh sáng vàng le lói.
```

### First-time navigation reveal

Sau khi onboarding xong, player ở lại **Phòng Làm Việc**. Không có map. Không có "6 phòng unlocked!" announcement.

Chỉ có: một cánh cửa hé mở. Ánh sáng vàng. Nếu player tò mò và tap → lần đầu thấy **Apartment View** (isometric) — chỉ 2 phòng sáng (Work Room + Kitchen). Các phòng khác: cửa đóng, im lặng.

---

## 6. Room Unlock Sequence — Trigger-based

Rooms không unlock theo lịch cố định — chúng **reveal theo hành động và trạng thái tự nhiên của Bugsy**. Player nhanh hay chậm tùy mức độ engage. Không có announcement — chỉ có emotional pull từ Bugsy.

| Thứ tự | Phòng | Unlock trigger | Cảm xúc player |
|---|---|---|---|
| 1 | 🏢 Phòng Làm Việc | Onboarding bắt đầu — ngay lập tức | Tò mò + hồi hộp |
| 2 | 🍳 Phòng Bếp | Onboarding kết thúc — Bugsy đói ngay sau Aha Moment | Chăm sóc + khám phá |
| 3 | 🛏️ Phòng Ngủ | Core Mission đầu tiên hoàn thành → Bugsy mệt, ngáp, nhìn player "đi cùng không?" | Đồng cảm |
| 4 | 🛋️ Phòng Khách | Happiness bar lần đầu xuống dưới 50% → Bugsy buồn nhìn về phía cửa phòng khách | Bất ngờ + trách nhiệm |
| 5 | 🚿 Phòng Tắm | Streak 3 ngày đạt được → Discipline bar xuất hiện, cửa phòng tắm hé mở | Reflection + self-awareness |
| 6 | 🌿 Sân | 7-day streak hoàn thành hoặc Week 1 complete — cinematic unlock | Delight + anticipation |

### Tốc độ unlock thực tế

- **Player engage tích cực:** Có đủ 5 phòng sau 2–3 ngày, Sân sau Day 7
- **Player casual:** Có đủ 5 phòng sau 4–5 ngày, Sân có thể sau Day 10+
- **Không bao giờ bị locked out:** Trigger dựa trên hành động, không phải deadline

### Day 7 Sân unlock — Cinematic moment

Bugsy dậy sớm hơn thường lệ. Chạy đến một cánh cửa player chưa bao giờ chú ý. Ánh sáng buổi sáng tràn vào khi cửa mở. Bugsy chạy ra ngoài, nằm trên cỏ, nhìn lên trời. Không có chữ. Chỉ là khoảnh khắc. Player hiểu: Bugsy đang nhìn về phía những chuyến đi sắp tới.

---

## 7. Navigation UX

### Hai chế độ (không phải explicit choice — toggle)

**Immersive mode (default):** Player ở trong một phòng, full screen. Cảm giác ở với Bugsy.

**Apartment View (khi cần di chuyển):** Tap icon 🏠 góc trên phải → isometric view.

### Apartment View — Visual states của từng phòng

| State | Visual |
|---|---|
| Ổn | Đèn ấm, bình thường |
| Cần attention | Đèn nhấp nháy nhẹ + icon nhỏ (bong bóng, âm nhạc) |
| Chưa unlock | Cửa đóng, đèn tắt, dấu "?" gợi tò mò |

### Gesture navigation
- Tap phòng trong Apartment View → transition: Bugsy chạy qua hành lang (không phải cut scene)
- Swipe trái/phải → di chuyển sang phòng liền kề (theo layout logic)
- Long press Bugsy → Bugsy suggest phòng cần đến nhất dựa trên need bar

---

## 8. Daily Loop — Một ngày điển hình (Day 7+)

### Sáng — Morning Check-in (1–3 phút)

```
Mở app → Apartment View
    ↓
Thấy phòng nào đang nhấp nháy (cần attention)
    ↓
Vào phòng đó → Quick care (tap, feed, swipe)
    ↓
Liếc Work Room → Mission card có sẵn → "Làm trưa"
    ↓
Đóng app
```

### Trưa / Chiều — Learning Session (5–10 phút)

```
Notification: "Bugsy đang chờ bạn tại Work Room!"
    ↓
Mở app → Work Room
    ↓
Core Mission: lesson (30s) + quiz (3–5 câu)
    ↓
Card moved to Done → Trophy Cabinet có gì mới?
    ↓
Tất cả need bars buff lên (Work Room là cách fill bars hiệu quả nhất)
    ↓
Optional: ghé 1–2 phòng khác nếu có time
```

### Tối — Wind-down (2–3 phút)

```
Happiness bar xuống → Phòng Khách
    ↓
TV mini-quiz hoặc chia sẻ Sprint Demo Card
    ↓
Phòng Ngủ → Spaced Repetition 1 câu → Tắt đèn
    ↓
Daily Recap Bubble → Đóng app
```

**Tổng thời gian điển hình:** 2–3 phút sáng + 8–10 phút trưa + 2–3 phút tối = **12–16 phút/ngày**

---

## 9. Notification System

### Nguyên tắc
- Notification = câu chuyện nhỏ từ Bugsy, không phải cảnh báo
- Deep link thẳng vào đúng phòng khi tap
- Smart timing: học theo thói quen user (không spam)
- Gộp notification nếu nhiều phòng cần cùng lúc

### Ví dụ notification theo phòng

| Phòng | Notification text |
|---|---|
| 🍳 Hunger 30% | "Bụng Bugsy kêu to rồi. Tủ lạnh trống không có gì hết á 😅" |
| 🍳 Hunger 10% | "Bugsy đang gõ menu đồ ăn trên điện thoại. Đặt đồ ăn mà không có tiền... 😭" |
| 🛏️ Health thấp | "Bugsy vừa ngáp lần thứ 17. Đang đếm cừu nhưng mất tập trung vì chưa có bạn 🐑" |
| 🛋️ Happiness thấp | "Bugsy tìm mãi không thấy bạn. Có vẻ hơi lonely rồi đó 🥺" |
| 🚿 Discipline thấp | "Bugsy bỏ lỡ bài tập sáng nay. Phòng tắm đang nhìn Bugsy với ánh mắt thất vọng 🚿" |
| Nhiều phòng cùng lúc | "Bugsy cần cả 3 thứ: ăn, ngủ, và một người bạn. Chạy qua nhé?" |

---

## 10. Special Mechanics

### Weekend Mode
- Thứ 7–CN: tất cả need bar decay dừng lại
- Chỉ có bonus activities (không bắt buộc)
- Mục đích: giảm guilt khi nghỉ, tăng sustainable engagement

### One Room Emergency
- Mỗi ngày hệ thống highlight **1 phòng đang cần nhất** (ngoài Work Room)
- User chỉ cần làm 1 việc bổ sung để "giữ mạng" Bugsy
- Tránh cảm giác phải check hết 6 nơi mỗi ngày

### Sprint Hold ("Blocked Status")
- Mechanic từ SPEC giữ nguyên: pause streak hợp lệ có ghi lý do
- Max 2 tokens/tháng (free), earned không mua được
- Liên quan đến Discipline bar: dùng Sprint Hold ảnh hưởng Discipline một phần

---

## 11. Transfer Gate — Room-based Evidence

> Bugsy không tiến hóa vì user giỏi trong game. Bugsy tiến hóa vì user giỏi hơn trong công việc thật.

Mỗi evolution step yêu cầu **evidence từ công việc thật**, gắn với phòng tương ứng:

| Version gate | Phòng liên quan | Evidence cần nộp |
|---|---|---|
| v0.1 → v0.5 | 🍳 Bếp | Bug report thật được đồng nghiệp confirm |
| v0.5 → v1.0 | 🏢 Work Room | Test case thật từ sprint hiện tại (screenshot) |
| v1.0 → v2.0 | 🛋️ Khách | Sprint Demo Card đã chia sẻ hoặc peer review log |
| v2.0 → v3.0 | 🌿 Sân + 🛏️ Ngủ | Exploratory test session note + Retrospective tháng |

---

## 12. Pet Evolution & Travel Narrative

| Version | Pet Stage | Travel Destination | Phòng unlock mới |
|---|---|---|---|
| v0.1 | Baby Bug Hunter | Căn hộ mới — bỡ ngỡ | Work Room + Bếp |
| v0.5 | Junior Tester Pet | Chuyến đi đầu: thành phố trong nước | Phòng Ngủ |
| v1.0 | Tester Pet | Ra nước ngoài lần đầu: ĐNA | Phòng Khách |
| v2.0 | Senior Tester Pet | Châu Á hoặc châu Âu | Phòng Tắm |
| v3.0 | QA Lead Pet | Dream destination — làm việc remote | Sân (full features) |

Souvenirs từ mỗi chuyến đi xuất hiện trong căn hộ như items trang trí. Không cần giải thích — player thấy và hiểu Bugsy đã đi đâu.

---

## 13. Scope Summary — Phase 1 vs Phase 2+

| Feature | Phase 1 (MVP) | Phase 2+ |
|---|---|---|
| 6 phòng cơ bản | ✅ | — |
| 4 need bars real-time | ✅ | — |
| Idle behaviors per room state | ✅ | — |
| Core Mission + quiz | ✅ | — |
| Room unlock D1–D7 | ✅ | — |
| Isometric Apartment View | ✅ | — |
| Sân: open space + shop | ✅ | — |
| Notification system | ✅ | — |
| Weekend Mode | ✅ | — |
| Transfer Gate (per evolution) | ✅ | — |
| Customization Shop đầy đủ | ❌ | ✅ |
| Visitor NPCs trong Work Room | ❌ | ✅ |
| Sân: Exploratory Testing Zone | ❌ | ✅ |
| Social / Pet visit | ❌ | ✅ |
| Travel destination visuals chi tiết | Cơ bản | ✅ Full |
| Movie Night event | ❌ | ✅ |
