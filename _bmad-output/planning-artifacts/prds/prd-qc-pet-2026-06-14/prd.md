---
title: "QC Pet — Tài liệu Yêu cầu Sản phẩm (PRD)"
status: final
created: 2026-06-14
updated: 2026-06-14
project: qc-pet
sources:
  - "_bmad-output/planning-artifacts/briefs/brief-qc-pet-2026-06-12/brief.md"
  - "_bmad-output/planning-artifacts/game-flow.md"
  - "_bmad-output/specs/spec-qc-pet/SPEC.md"
  - "_bmad-output/planning-artifacts/content-strategy.md"
---

# PRD: QC Pet — Ứng dụng Gamification Kỹ năng QC/Testing

## 0. Mục đích Tài liệu

PRD này định nghĩa đầy đủ yêu cầu sản phẩm cho QC Pet — ứng dụng mobile Freemium gamification nuôi thú cưng kết hợp học kỹ năng QC/Testing. Tài liệu dành cho PM, stakeholders, và các workflow xuôi dòng (UX Design, Architecture, Epics & Stories). Cấu trúc: Glossary-anchored vocabulary (§3), features nhóm theo chức năng với FRs lồng nhau và ID ổn định (§4), assumptions tagged inline và index tại §9. Tài liệu này build trên: brief.md (product vision), game-flow.md (6-room game world), SPEC.md (canonical constraints CAP-1→CAP-10), và content-strategy.md (27 lessons + daily question design).

---

## 1. Tầm nhìn

QC Pet đặt ra câu trả lời cho câu hỏi mà junior tester mất ngủ: **"Tôi đang test có đúng không?"** Người dùng nuôi Bugsy — một con bug nhân cách hóa vừa thoát khỏi production server — trong một căn hộ 6 phòng có thể khám phá. Bugsy sống trong thời gian thật: đói, mệt, và cô đơn khi người dùng không mở app. Chăm sóc Bugsy hiệu quả nhất bằng cách hoàn thành daily learning missions về kỹ năng QC — tạo ra vòng lặp tự nhiên: **học tốt hơn → chăm Bugsy tốt hơn → Bugsy được đi xa hơn**.

Thị trường EdTech hiện tại bán "đèn pin" — trả lời "học được gì rồi?" nhưng không cho người dùng tín hiệu họ có tiến bộ không. QC Pet phá vỡ điều đó: pet của bạn phản chiếu những gì bạn *thực hành* trong công việc thật, không chỉ những gì bạn *xem* trên video. Disruption không phải ở format học — mà ở trục đo: **"Mình có đang tốt hơn không?" thay vì "Mình có biết thêm không?"**

Trong 2–3 năm nếu Transfer Gate data đủ lớn, QC Pet có khả năng trở thành công cụ assessment khách quan đầu tiên cho junior tester Việt Nam — đo được không qua quiz score mà qua pattern real-world submissions theo thời gian. App tự gỡ bỏ chính mình là thành công thực sự: người dùng internalize kỹ năng và không còn cần nhắc nhở.

---

## 2. Người dùng Mục tiêu

### 2.1 Jobs To Be Done

- **Functional:** Biết cách thực hành kỹ năng QC đúng (bug report, severity/priority, BVA, exploratory testing, agile testing) và nhận được tín hiệu rõ ràng mình đang cải thiện.
- **Emotional:** Cảm thấy tự tin hơn khi raise bug, hỏi câu hỏi boundary trong planning meeting, và thảo luận với dev về business impact — không chỉ triệu chứng màn hình.
- **Social:** Có bằng chứng cụ thể (Sprint Demo Card, Transfer Gate submissions) để tự nhìn lại và chia sẻ tiến bộ của mình.
- **Contextual:** Học trong những khoảng thời gian nhỏ (5–10 phút/ngày), không cảm thấy áp lực hay bị phạt nặng khi bỏ lỡ một ngày.

### 2.2 Non-Users (v1)

- Senior tester — nội dung và thách thức ngoài scope v1
- Người mới học QC chưa đi làm — thiếu context công việc thật để dùng Transfer Gate và Weekly Bug Log
- Team manager / QA Lead tìm công cụ quản lý team
- Người dùng ngoài thị trường Việt Nam [ASSUMPTION: v1 launch Vietnam-only]

### 2.3 Key User Journeys

**UJ-1. Linh gặp Bugsy lần đầu và quyết định ở lại.**

- **Persona + context:** Linh, 23 tuổi, junior tester 1 năm kinh nghiệm. Hay viết bug theo happy-path UI click, không biết mình có đang tốt lên không. Tải app từ store sau khi thấy tagline *"Pet bạn đói. Đi tìm bug đi."*
- **Entry state:** Chưa tạo tài khoản. Màn hình tối, tiếng bàn phím, không có hướng dẫn.
- **Path:** (1) Quả trứng run rẩy → nở → Bugsy ngáp nhìn camera. (2) Linh đặt tên pet. (3) Bugsy: *"Mình hơi đói rồi... mà mình chỉ ăn bug thôi."* (4) Warm-up: Pass/Fail bug report ngắn — Linh đoán. (5) Aha Moment: bug report đầy đủ, Story-Rule Feedback, Bugsy kể câu chuyện → rule landing. (6) Reward: BC và QP animate — server đã commit trước. (7) Cliffhanger: *"Bạn nghĩ mình có qua được không...?"* (8) Notification preference. (9) Sign-up: *"Lưu [tên] lại"* — driven by pet attachment.
- **Climax:** Linh hoàn thành Cliffhanger screen và muốn quay lại ngày mai. Giá trị được cảm nhận trước khi tạo tài khoản.
- **Resolution:** HOME → Phòng Làm Việc. Cửa bếp hé mở ở góc màn hình. Không có tooltip.
- **Edge case:** Kill app sau Aha Moment nhưng trước Sign-up → state đã commit server-side → resume đúng chỗ khi mở lại.

**UJ-2. Linh chăm Bugsy trong một ngày bình thường (Day 7+).**

- **Persona + context:** Linh, đã quen app 1 tuần, 5 phòng unlocked, streak 7 ngày liên tiếp.
- **Entry state:** Đã sign-in. Mở app lúc 7h sáng, thấy Apartment View.
- **Path:** (1) Sáng — Phòng Bếp nhấp nháy: tap feed nhanh (1 phút). (2) Trưa — notification từ Bugsy, deep link vào Work Room. (3) Core Mission: lesson 30s + quiz 8 câu (framework 2-5-1-2, emotional arc Q1–Q8). (4) 3-2-1 Summary card. (5) Tất cả Need Bars buff lên, Trophy Cabinet mới. (6) Tùy chọn: ghé Phòng Khách, TV quiz mini. (7) Tối — Phòng Ngủ, spaced repetition 1 câu, tắt đèn, Daily Recap Bubble.
- **Climax:** Core Mission done, card kéo sang "Done" trên Mission Board. Bugsy nhảy.
- **Resolution:** Đóng app. Tổng thời gian: ~12–16 phút trong ngày.
- **Edge case:** Đóng app giữa quiz → auto-save mỗi câu → *"Chào mừng trở lại, bạn làm được 4/8 câu rồi đó."*

**UJ-3. Bugsy sắp evolve — Linh nộp Transfer Gate.**

- **Persona + context:** Linh, Day 21, đủ QP cho v0.5 nhưng thiếu Transfer Gate evidence.
- **Entry state:** Đã sign-in. Thấy evolution progress bar gần đầy, có "pending" indicator.
- **Path:** (1) Notification: *"Bugsy đang chuẩn bị hành lý... còn thiếu 1 thứ."* (2) Vào Transfer Gate screen trong Work Room. (3) Prompt: *"Tuần này bạn đã report bug nào được đồng nghiệp confirm?"* (4) Linh submit text + screenshot. (5) App nhận: *"Evidence đã ghi nhận."* (6) Evolution animation: Bugsy nhảy, đóng gói vali, cinematic chuyến đi đầu tiên. (7) Phòng Ngủ unlock. (8) Souvenir đầu tiên xuất hiện trong căn hộ.
- **Climax:** Bugsy evolve lên Junior Tester Pet. Linh thấy lần đầu Bugsy rời căn hộ.
- **Resolution:** HOME. Souvenir mới trên bàn. Linh hiểu hành trình Bugsy qua không gian sống.

---

## 3. Bảng Thuật ngữ

Các workflow xuôi dòng phải dùng đúng các thuật ngữ này. Không dùng synonym ở bất kỳ đâu trong PRD.

- **Bugsy** — Nhân vật pet chính. Một con bug nhân cách hóa. Tên mặc định "Bugsy"; người dùng có thể đặt tên khác trong onboarding.
- **Bug Coins (BC)** — Tiền tệ ngắn hạn. Dùng để mua customization items. Giảm khi user miss ngày. Không bao giờ về âm.
- **Quality Points (QP)** — Tiền tệ dài hạn. Unlock pet evolution. Không bao giờ giảm. Không mua được bằng BC.
- **Need Bars** — 4 thanh nhu cầu của Bugsy: Hunger, Happiness, Health, Discipline. Giảm theo thời gian thật kể cả khi app đóng.
- **Core Mission** — Hoạt động học tập chính hàng ngày: 1 lesson (30s) + quiz (số câu theo nhóm). Cách fill Need Bars hiệu quả nhất.
- **Side Quest** — Hoạt động học tập tùy chọn: Bug Hunt, Peer Review, Repro Steps. Fill Happiness bar.
- **Pet Care** — Tương tác chăm sóc nhanh không-learning: Feed (Hunger), Play (Happiness), Train (Health). Fill bars một phần.
- **Transfer Gate** — Bằng chứng real-world (text hoặc ảnh) cần nộp trước mỗi bước evolution của Bugsy. Honor system — app không verify nội dung.
- **Sprint Hold** — Cơ chế tạm dừng streak hợp lệ. Earned (không mua được), tối đa 2 token/tháng (free tier), yêu cầu ghi lý do. *Còn gọi là "Hotfix Day" trong SPEC.md — cùng một cơ chế, Sprint Hold là tên canonical trong PRD này.*
- **Sprint Demo Card** — Card tóm tắt tiến độ 7 ngày, tự động tạo cuối mỗi sprint, có thể share.
- **Apartment View** — Góc nhìn isometric toàn bộ 6 phòng căn hộ Bugsy. Truy cập qua icon 🏠 góc trên phải.
- **Immersive Mode** — Full-screen view khi đang trong một phòng cụ thể. Chế độ mặc định.
- **Work Room (Phòng Làm Việc)** — Phòng trung tâm, gắn với Core Mission. Hoàn thành Core Mission ở đây fill tất cả Need Bars.
- **Weekly Bug Log** — Nhật ký bug thật gặp tại công việc, submit hàng tuần trong app.
- **Retrospective Loop** — Phản chiếu hàng tuần về những gì đã học và áp dụng. Tạo "My Journey" view.
- **Spaced Repetition** — Câu hỏi retrieval xuất hiện ≥24h sau lần học đầu tiên.
- **Story-Rule Feedback** — Cơ chế feedback sau quiz: Bugsy kể chuyện ngắn trước, rule (nguyên tắc) landing sau. Không phán xét, chỉ giải thích.
- **Cliffhanger** — Màn hình kết thúc onboarding Day 1, tạo anticipation cho ngày mai.
- **Aha Moment** — Khoảnh khắc user lần đầu cảm nhận giá trị app trong onboarding. Xảy ra trước Sign-up Gate.
- **Personal Best** — Thước đo tiến bộ so với bản thân tuần trước. Không có leaderboard so sánh với người khác.
- **3-2-1 Summary** — Card tóm tắt cuối mỗi lesson: 3 điều cần nhớ, 2 lỗi phổ biến, 1 đối chiếu thực tế.
- **Rescue Mechanic** — Cơ chế hỗ trợ kích hoạt sau 3 câu sai liên tiếp: xem gợi ý / đọc lý thuyết / bỏ qua câu.
- **Flash Quiz** — Quiz nhanh 2–3 câu không có hint option. Xuất hiện trong Phòng Tắm hàng ngày. Mục tiêu: rèn Discipline.
- **Mission Board** — Bảng kanban mini trong Work Room. User kéo card Todo → In Progress → Done khi hoàn thành Core Mission.
- **My Journey** — View tổng hợp theo timeline: Transfer Gate submissions, Weekly Bug Log, Retrospective entries. Accessible từ Work Room.
- **Weekly Challenge** — Thử thách thực hành thực tế 1 lần/tuần, gắn với mỗi content category. Không bắt buộc nhưng earn BC bonus.

---

## 4. Features

### 4.1 Pet & Thế Giới Bugsy

**Mô tả:** Bugsy là nhân vật trung tâm — một con bug nhân cách hóa sống trong căn hộ 6 phòng, có hành động vô tri (idle behaviors) phản ánh trạng thái Need Bars hiện tại. Căn hộ phát triển theo từng giai đoạn evolution của Bugsy: từ bàn gỗ đơn giản (v0.1) đến full setup (v3.0). Mỗi chuyến đi để lại souvenir trong căn hộ — người dùng đọc được hành trình qua không gian sống của Bugsy. Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-1: Idle Behaviors phản ánh trạng thái

Hệ thống hiển thị idle behavior của Bugsy phản ánh trạng thái Need Bars hiện tại bất cứ lúc nào user mở app. Bugsy không bao giờ đứng yên.

**Testable consequences:**
- Khi tất cả bars ổn: Bugsy gõ bàn phím, uống cà phê, viết note rồi vò ném.
- Khi Hunger < 30%: Bugsy mở tủ lạnh trống, bụng kêu sôi.
- Khi Happiness < 30%: Bugsy ngồi ngẩn ngơ, tựa đầu vào bàn, thở dài.
- Khi Health < 30%: Bugsy ngủ gật, gõ phím sai liên tục.
- Khi Discipline < 30%: Bugsy lướt mạng thay vì làm việc.
- Sau khi hoàn thành Core Mission: Bugsy nhảy lên, lấy vali ngắm nghía, mơ màng.

#### FR-2: Đặt tên pet

User đặt tên cho Bugsy trong onboarding. App cung cấp 3 gợi ý + free text. Tên được dùng xuyên suốt toàn app (notifications, UI copy, Transfer Gate prompts).

**Testable consequences:**
- Tên hiển thị đúng ở mọi màn hình sau khi đặt.
- Free text chấp nhận tối đa 20 ký tự [ASSUMPTION: giới hạn 20 ký tự phù hợp UI mobile].
- Default name nếu user bỏ qua = "Bugsy".

#### FR-3: Pet Evolution (v0.1 → v3.0)

Bugsy evolve qua 5 giai đoạn khi đạt đủ QP threshold VÀ nộp Transfer Gate evidence tương ứng. Cả hai điều kiện phải thỏa mãn — QP đủ mà thiếu Transfer Gate thì evolution pending, không bị block nhưng chưa trigger.

| Version | Giai đoạn | Travel Destination | Phòng mới unlock | QP để unlock |
|---|---|---|---|---|
| v0.1 | Baby Bug Hunter | Căn hộ mới — bỡ ngỡ | Work Room + Bếp | — (starting) |
| v0.5 | Junior Tester Pet | Chuyến đi đầu: thành phố trong nước | Phòng Ngủ | 150 QP |
| v1.0 | Tester Pet | Ra nước ngoài lần đầu: Đông Nam Á | Phòng Khách | 400 QP |
| v2.0 | Senior Tester Pet | Châu Á hoặc châu Âu | Phòng Tắm | 900 QP |
| v3.0 | QA Lead Pet | Dream destination — làm việc remote | Sân (full features) | 1800 QP [ASSUMPTION] |

**Testable consequences:**
- Evolution animation chỉ trigger sau khi cả QP ≥ threshold VÀ Transfer Gate submitted cho version gate đó.
- "Evolution pending" state hiển thị rõ khi QP đủ nhưng thiếu Transfer Gate.
- Server ghi nhận evolution timestamp và evidence reference trước khi trigger animation.

#### FR-4: Souvenirs & Căn hộ thay đổi theo evolution

Sau mỗi chuyến đi (evolution), souvenir tương ứng tự động xuất hiện trong căn hộ. Không cần giải thích — user thấy và hiểu Bugsy đã đi đâu.

**Testable consequences:**
- Souvenir xuất hiện ngay sau animation evolution hoàn thành.
- Souvenir gắn với travel destination của version tương ứng, không thể mua hay xóa.
- Souvenir khác biệt về mặt visual với customization items mua bằng BC.

#### FR-5b: Good Morning Moment — Ngôn ngữ Travel Destination

Lần đầu mở app mỗi buổi sáng, Bugsy vươn vai và nói "chào buổi sáng" bằng ngôn ngữ của travel destination đang hướng tới ở evolution hiện tại. Mechanic này kết nối Bugsy's current stage với travel dream hàng ngày.

| Evolution | Ngôn ngữ greeting |
|---|---|
| v0.1 | Tiếng Việt (home) |
| v0.5 | Tiếng địa phương thành phố trong nước đang hướng tới |
| v1.0 | Tiếng của nước ĐNA đang hướng tới (ví dụ: tiếng Thái, tiếng Indo) |
| v2.0 | Tiếng Nhật / tiếng Pháp / tiếng Đức tùy destination |
| v3.0 | Ngôn ngữ dream destination cuối cùng của Bugsy |

**Testable consequences:**
- Good Morning Moment chỉ trigger ở lần mở app đầu tiên của mỗi ngày.
- Greeting phrase là một trong danh sách được curate sẵn theo evolution level — không AI-generated.
- Greeting có subtitle tiếng Việt nhỏ bên dưới.

**Feature-specific NFR:** Idle animation phải chạy ở 30fps tối thiểu trên thiết bị phổ thông (entry-level 2022+). [ASSUMPTION: định nghĩa "thiết bị phổ thông" cần xác định khi chọn tech stack.]

**Design notes (không là FR — ảnh hưởng đến UX spec):**
- *Mirror Moment (GAP-01):* Sau khi hoàn thành Flash Quiz trong Phòng Tắm, Bugsy nhìn vào gương. Discipline cao → Bugsy mặc outfit đẹp, tự tin. Discipline thấp → tóc bù xù, mệt mỏi. Visual feedback tức thì — đây là intentional design, không phải idle behavior thông thường.
- *Streak Tracker (GAP-02):* Phòng Tắm có streak counter nhỏ riêng hiển thị số ngày liên tiếp đã làm Flash Quiz.
- *Delight Tap (GAP-07):* Tap vào Bugsy khi đang ngồi trên sofa (Phòng Khách) → Bugsy giật mình rồi cười. Không có game effect — pure delight. Design principle: không phải mọi interaction đều cần phục vụ game mechanic.
- *Day 7 Sân unlock cinematic (GAP-15):* "Không có chữ. Chỉ là khoảnh khắc." Bugsy dậy sớm, chạy ra sân, nằm trên cỏ nhìn trời. Player tự hiểu. Design team không được thêm explanatory text vào cinematic này.

---

### 4.2 Hệ thống Nhu Cầu (Need Bars)

**Mô tả:** 4 Need Bars (Hunger, Happiness, Health, Discipline) giảm theo thời gian thật kể cả khi app đóng. Mỗi bar gắn với một phòng và một loại hoạt động học tập. Decay rate khác nhau theo phòng để tránh cảm giác phải check tất cả mọi ngày. Realizes UJ-2.

**Functional Requirements:**

#### FR-5: Real-time decay theo thời gian thật

4 Need Bars giảm liên tục theo server time, không phải theo session time.

| Need Bar | Phòng gắn với | Decay Rate (đến 0) | Fill bằng |
|---|---|---|---|
| Hunger | Phòng Bếp | ~48h | Bug Report / Feed nhanh |
| Happiness | Phòng Khách | ~72h | Side Quests / Play / Sprint Demo Card share |
| Health | Phòng Ngủ | ~72h | Spaced Repetition / Rest |
| Discipline | Phòng Tắm | ~48h | Flash Quiz không hint |
| (Composite) | Work Room | ~24h fastest | Core Mission fill tất cả bars hiệu quả nhất |

**Testable consequences:**
- Bar value tính từ server timestamp của lần fill cuối, không phải client time.
- Bars giảm đúng rate ngay cả khi app bị kill hoàn toàn trong 24h.
- Bars hiển thị chính xác khi user mở lại app sau bất kỳ khoảng offline nào.

#### FR-6: Pet không bao giờ chết — chỉ regress

Khi bars về 0, Bugsy regress (buồn, mệt, chậm) nhưng luôn phục hồi khi user quay lại. Không có "game over", không mất QP.

**Testable consequences:**
- Bar không thể xuống dưới 0%.
- Khi ≥1 bar = 0%, Bugsy hiển thị regressed state tương ứng (FR-1).
- Không có event "pet chết" hoặc "reset" — chỉ thay đổi visual state.
- QP không giảm dù bars về 0.

#### FR-7: Pet Care — fill bars một phần

Pet Care actions (Feed, Play, Train) fill bars ngay lập tức nhưng không đầy đủ. Đủ để ngăn Bugsy regress thêm, không đủ để bằng Core Mission.

**Testable consequences:**
- Quick Feed fill Hunger +25%.
- Quick Play fill Happiness +20%.
- Quick Train fill Health +15%.
- Core Mission fill tất cả 4 bars thêm ≥50% từ giá trị hiện tại.
- Pet Care không earn BC hoặc QP.

#### FR-8: Weekend Mode — decay tạm dừng

Thứ Bảy và Chủ Nhật: tất cả Need Bar decay dừng lại. Chỉ có bonus activities (không bắt buộc). Mục đích: giảm guilt khi nghỉ cuối tuần, tăng sustainable engagement.

**Testable consequences:**
- Từ 00:00 Thứ Bảy đến 23:59 Chủ Nhật (theo timezone Việt Nam), bars không giảm.
- Bars resume decay tự nhiên từ 00:00 Thứ Hai.
- Weekend Mode hiển thị visual indicator nhỏ trong app.

---

### 4.3 Daily Mission Loop

**Mô tả:** Vòng lặp học tập hàng ngày gồm ba lớp: Core Mission (bắt buộc để fill bars hiệu quả), Side Quests (tùy chọn, fill Happiness), và Pet Care (quick care, không learning). Entry point duy nhất — không có "chọn mode". Độ dài session emerge tự nhiên từ trạng thái bars. Realizes UJ-2.

**Functional Requirements:**

#### FR-9: Core Mission — lesson + quiz hàng ngày

Core Mission có sẵn mỗi ngày: 1 lesson (video/animation ngắn ~30s) + quiz (số câu theo nhóm nội dung). Hoàn thành Core Mission là cách fill Need Bars hiệu quả nhất và earn BC + QP.

**Testable consequences:**
- Mỗi user có đúng 1 Core Mission available mỗi ngày (reset theo calendar day).
- Mission Board trong Work Room hiển thị card ở trạng thái Todo → In Progress → Done.
- Hoàn thành Core Mission fill tất cả 4 bars hiệu quả hơn bất kỳ Pet Care combination nào.
- Hoàn thành Core Mission earn BC và QP (lượng cụ thể xác định trong game balance).
- Story-Rule Feedback xuất hiện sau mỗi câu sai trong quiz (FR-25).
- 3-2-1 Summary card hiển thị sau khi hoàn thành tất cả câu quiz.

#### FR-10: Side Quests — học tập tùy chọn

Ba loại Side Quest có sẵn tùy chọn hàng ngày: Bug Hunt (in-app prototype), Peer Review (review bug report người khác), Repro Steps (viết lại bước tái hiện từ video). Fill Happiness bar. Realizes UJ-2 (optional path).

**Testable consequences:**
- Ít nhất 1 Side Quest loại có sẵn mỗi ngày [ASSUMPTION: rotation logic xác định trong content ops].
- Hoàn thành Side Quest fill Happiness +40% [ASSUMPTION: cần balance testing].
- Side Quest earn BC nhưng ít hơn Core Mission.
- Simulated Bug Hunt là Side Quest đặc biệt cho users không thể raise bug thật — cơ chế giống Bug Hunt nhưng scenario trong app. [NOTE FOR PM: không phải Transfer Gate alternative, chỉ là Side Quest thay thế.]

#### FR-11: Mission Board (Kanban mini)

Work Room có Mission Board dạng kanban mini. User kéo card khi hoàn thành. Sau 30 ngày, Bug Report Wall đầy → visual progression milestone.

**Testable consequences:**
- Mission card hiển thị đúng trạng thái (Todo / In Progress / Done).
- User action "kéo card" là confirmation hoàn thành — không tự động.
- Bug Report Wall (sticky notes) tích lũy đúng 1 note mỗi lesson hoàn thành.
- Khi wall đầy (sau ~30 lessons), trigger visual celebration event.

---

### 4.4 Hệ thống Phòng & Navigation

**Mô tả:** Căn hộ Bugsy có 6 phòng, mỗi phòng gắn với 1 Need Bar và 1 loại hoạt động. Rooms unlock trigger-based (theo hành động và trạng thái Bugsy), không theo lịch cố định. Navigation: Immersive Mode (default, full-screen trong phòng) và Apartment View (isometric, di chuyển giữa phòng). Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-12: 6-phòng căn hộ với chức năng riêng

| Phòng | Need Bar | Hoạt động chính | Learning mechanic |
|---|---|---|---|
| 🏢 Phòng Làm Việc | Composite (tất cả) | Core Mission | Lesson + Quiz |
| 🍳 Phòng Bếp | Hunger | Feed Bugsy | Nộp Bug Report ("nấu ăn") |
| 🛏️ Phòng Ngủ | Health | Rest | Spaced Repetition trước khi ngủ |
| 🛋️ Phòng Khách | Happiness | Play / chill | Side Quest, TV quiz, Sprint Demo Card share |
| 🚿 Phòng Tắm | Discipline | Flash Quiz | Quiz 2–3 câu không dùng hint |
| 🌿 Sân | — (không decay) | Open space + Shop | Exploratory / bonus (Phase 2) |

**Testable consequences:**
- Mỗi phòng chỉ cho phép actions gắn với Need Bar của phòng đó.
- Work Room là phòng duy nhất fill tất cả bars đồng thời (qua Core Mission).
- Phòng Tắm Flash Quiz: 2–3 câu, không có hint option.
- Sân: Phase 1 chỉ có Item Shop và idle animations ngoài trời. Không có decay.

#### FR-13: Room Unlock Sequence — trigger-based

Rooms không unlock theo lịch — reveal theo hành động và trạng thái tự nhiên của Bugsy. Không có announcement text. Chỉ có emotional pull.

| Thứ tự | Phòng | Unlock trigger |
|---|---|---|
| 1 | 🏢 Phòng Làm Việc | Onboarding bắt đầu — ngay lập tức |
| 2 | 🍳 Phòng Bếp | Onboarding kết thúc — Bugsy đói ngay sau Aha Moment |
| 3 | 🛏️ Phòng Ngủ | Core Mission đầu tiên hoàn thành → Bugsy mệt, ngáp |
| 4 | 🛋️ Phòng Khách | Happiness bar lần đầu < 50% → Bugsy buồn nhìn về phía cửa |
| 5 | 🚿 Phòng Tắm | Streak 3 ngày → Discipline bar xuất hiện, cửa hé mở |
| 6 | 🌿 Sân | 7-day streak hoàn thành hoặc Week 1 complete — cinematic unlock |

**Testable consequences:**
- Phòng chưa unlock: cửa đóng, đèn tắt, dấu "?" trong Apartment View.
- Trigger phải fire đúng điều kiện, không fire sớm hơn hoặc muộn hơn.
- Player nhanh (engage tích cực): 5 phòng sau 2–3 ngày, Sân sau Day 7.
- Player casual: 5 phòng sau 4–5 ngày — không bao giờ bị locked out vĩnh viễn.

#### FR-14: Apartment View & Immersive Mode

**Immersive Mode (default):** User đang ở trong một phòng, full screen. Cảm giác "đang ở với Bugsy".

**Apartment View:** Tap icon 🏠 góc trên phải → isometric view tất cả phòng đã unlock. Phòng cần attention: đèn nhấp nháy nhẹ + icon nhỏ. Phòng chưa unlock: cửa đóng, "?" gợi tò mò.

**Testable consequences:**
- Apartment View luôn accessible qua icon 🏠 (sau khi ≥2 phòng unlocked).
- Room transition: Bugsy chạy qua hành lang animation — không phải cut scene.
- Swipe trái/phải di chuyển sang phòng liền kề theo layout logic.
- Long press Bugsy → Bugsy suggest phòng cần đến nhất (dựa trên bar thấp nhất).
- Apartment View visual state cập nhật realtime (không cần refresh).

---

### 4.5 Dual Currency & Progression

**Mô tả:** Hai loại tiền tệ phục vụ hai mục tiêu khác nhau: Bug Coins cho engagement ngắn hạn và customization, Quality Points cho progression dài hạn và pet evolution. Hai thước đo không thể hoán đổi. Realizes UJ-3.

**Functional Requirements:**

#### FR-15: Bug Coins (BC) — tiền tệ ngắn hạn

Bug Coins earned qua Core Mission, Side Quests. Dùng để mua customization items (wallpaper, đồ vật, trang phục) trong Item Shop.

**Testable consequences:**
- BC giảm -15/ngày khi user miss. Ngày miss đầu tiên: grace period (không trừ). Cap 3 ngày liên tiếp — ngày 4 trở đi không deduct thêm.
- BC không về âm — floor = 0.
- BC balance hiển thị trên home screen mọi lúc.
- BC không thể convert thành QP và ngược lại.
- Sprint Hold không tốn BC.

#### FR-16: Quality Points (QP) — tiền tệ dài hạn

Quality Points earned qua Core Mission, Side Quests. Không bao giờ giảm. Là điều kiện cần (nhưng không đủ) để evolution.

**Testable consequences:**
- QP không giảm trong bất kỳ scenario nào (miss ngày, bar về 0, dùng Rescue Mechanic).
- QP balance hiển thị trên home screen mọi lúc.
- Evolution threshold QP cụ thể cho từng version (xác định trong game balance) [ASSUMPTION: thresholds cần playtesting].
- QP counter không thể bị manipulate client-side — tính từ server.

#### FR-17: Cả hai currency visible mọi lúc

BC và QP balance luôn hiển thị trong persistent header / home screen. Không cần vào menu riêng để xem.

**Testable consequences:**
- BC và QP hiển thị cùng nhau, phân biệt rõ ràng bằng icon.
- Sau mỗi earn event, counter animate tăng (số đếm).
- Server đã ghi nhận earn trước khi animation play (NFR-1).

---

### 4.6 Content Library & Question Engine

**Mô tả:** 27 lessons × 5 categories, mỗi lesson có ISTQB source tag hoặc INDUSTRY_PRACTICE tag bắt buộc. Quiz theo framework 2-5-1-2 (8 câu/session) với emotional arc thiết kế có chủ ý. 10 question formats vượt ra ngoài MCQ. Difficulty progression theo Bloom's Taxonomy arc 30 ngày. Realizes UJ-2.

**Functional Requirements:**

#### FR-17b: Real Bug of the Week — Nội dung nội bộ

Mỗi tuần một "Real Bug of the Week" được author bởi practitioner QC nội bộ — một bug thật từ industry, được viết thành learning piece ngắn. Đây là content type riêng biệt với 27 Core Lessons.

**Testable consequences:**
- Real Bug of the Week xuất hiện trong Side Quest rotation hoặc Phòng Khách (TV Channels) — vị trí cụ thể xác định trong UX phase.
- Author là practitioner QC nội bộ — không phải AI-generated, không phải community submission.
- Content phải có source tag "REAL_CASE" thay vì ISTQB chapter.
- Community-sourced submissions là out of scope đến post-launch (§5 Non-Goals).

#### FR-18: 27 Lessons × 5 Categories

MVP phải có đủ 27 lessons trước khi launch. Thiếu thì blocked.

| Category | Số bài | Ưu tiên ISTQB |
|---|---|---|
| Bug Detective | 8 | 🔴 CRITICAL |
| Test Architect | 5 | 🔴 CRITICAL |
| Mindset & Process | 4 | 🔴 CRITICAL |
| Tool Master | 6 | 🟢 INDUSTRY + ISTQB mix |
| Agile Tester | 4 | 🔴 CRITICAL |

**Testable consequences:**
- Content release pipeline chặn publish nếu lesson thiếu source tag.
- Mỗi category có ≥1 Weekly Challenge khi launch.
- Dependency order trong mỗi category được enforce (ví dụ: BD-1 → BD-4 → BD-2...).
- TM-5 và TM-6 tag INDUSTRY_PRACTICE, không phải ISTQB chapter.

#### FR-19: Question Format — 10 loại

App hỗ trợ 10 question formats. Mỗi lesson phối hợp nhiều formats theo emotional arc.

| Format | Mô tả |
|---|---|
| MCQ | Multiple choice chuẩn |
| Bug Report Surgery | Drag & reconstruct bug report fields |
| Severity Swipe | Tinder-style: swipe để classify |
| Spot the Defect | Tap vào bug trong UI screenshot |
| Rewrite the Fail | Ghép word blocks tạo Expected Result đúng |
| Priority×Severity Duel | Drag bug vào ma trận 2×2 |
| Boundary Attack | Nhập test values, đánh dấu Pass/Fail expected |
| Root Cause Chain | Kéo thả: Failure → Defect → Error → Process Gap |
| Risk Radar | Xếp hạng feature cards theo risk |
| Complete the Test Case | Điền Precondition + Expected Result + Test Data |

**Testable consequences:**
- Mỗi format render đúng trên iOS và Android với touch interaction.
- Không có 2 câu "drag-heavy" liên tiếp trong cùng session.
- Câu có hình ảnh chiếm ≥60% màn hình, đáp án ẩn dưới fold.

#### FR-20: Framework 2-5-1-2 và Emotional Arc (8 câu/session)

Mỗi Core Mission session gồm 8 câu theo phân bổ cố định:

| Loại | Số câu | Vị trí trong session |
|---|---|---|
| Lý thuyết nền | 2 | Q1 (warm-up) + Q2 |
| Thực hành | 5 | Q3–Q7 (Q5 = nặng nhất) |
| Hình ảnh minh họa | 1 | Q3 hoặc Q6 |
| Scenario phán đoán | 2 | Q7 + Q8 (synthesis) |

Emotional arc Q1–Q8: Warm-up → Đặt nền → Cú twist → Confidence peak → Thử thách → Aha Moment → Identity formation → Về đích.

**Testable consequences:**
- Q1 luôn là MCQ 2 lựa chọn, từ bài đã học ≥3 ngày trước (spaced recall).
- Q5 là câu "thực hành nặng nhất" của session — cognitive friction có kiểm soát.
- Sequence không đặt 2 câu drag-heavy liên tiếp.
- Q8 là câu synthesis — kết nối toàn session.

**Q1 Warm-up exception rule (GAP-14):** Nếu user trả lời sai Q1, không trừ streak và không hiện big red X — chỉ giải thích nhẹ và tiếp tục. Q1 không phải test, mà là calibration. Q1 card dùng border màu xanh nhạt thay vì trắng (visual signal: "đây là khởi động").

**Điều chỉnh số câu theo category:**
- Bug Detective: 8–10 câu/bài
- Test Architect: 9–10 câu (nhiều tính toán thực hành)
- Tool Master: 7–8 câu
- Agile Tester: 6–7 câu
- Mindset & Process: 5–6 câu (nội dung mềm)

#### FR-21: 3-2-1 Summary Card

Sau khi hoàn thành tất cả câu quiz, hiện Summary card dạng "Bugsy's Cheat Sheet": 3 điều cần nhớ, 2 lỗi phổ biến, 1 đối chiếu thực tế. Tối đa 5 bullet tổng cộng.

**Testable consequences:**
- Summary card luôn xuất hiện sau Q cuối, không thể skip.
- Title thay vì điểm số: Bug Whisperer (10/10) / Defect Detective (8–9) / QC Apprentice (6–7) / Bug Magnet (<6).
- Card có thể screenshot và share.
- Story-Rule kết thúc tại đây nếu chưa trigger trước đó.

#### FR-22: Difficulty Progression — Bloom's Taxonomy Arc

Nội dung tăng độ khó theo arc 30 ngày: Foundation (Day 1–5) → Understanding → Application → Analysis → Evaluation → Synthesis (Day 26–30).

**Testable consequences:**
- Day 1–5: MCQ + Spot the Defect đơn giản.
- Day 26–30: Multi-step missions, Boss format — không dạy concept mới mà consolidate.
- Spaced repetition câu Q1 lấy từ đúng tier của ngày đó hoặc thấp hơn.

#### FR-23: Rescue Mechanic — hỗ trợ khi sai 3 lần liên tiếp

Sai lần 3 liên tiếp: Bugsy nói *"Phần này không dễ đâu. Mình cũng bị hỏi câu này lúc mới học."* User chọn 1 trong 3 options.

| Lựa chọn | Cơ chế | Chi phí |
|---|---|---|
| Xem gợi ý nhỏ | Loại bỏ 1 đáp án sai; user vẫn phải suy nghĩ | -5 BC |
| Đọc lại lý thuyết | Mini-card mở ngay trong màn; thử lại sau khi đọc | Không |
| Bỏ qua câu này | Câu đó quay lại ở session sau | Không |

**Testable consequences:**
- Rescue Mechanic chỉ trigger sau đúng 3 lần sai liên tiếp cùng 1 câu.
- Không có popup đỏ "SAI RỒI!!!" ở bất kỳ thời điểm nào.
- Nút bỏ qua luôn visible và accessible khi Rescue Mechanic kích hoạt.

#### FR-24: Auto-save và Session Incomplete

Auto-save sau mỗi câu trả lời. Nếu crash hoặc đóng app giữa session, mở lại resume đúng trạng thái.

**Testable consequences:**
- Màn "Chào mừng trở lại" khi quay lại trong 24h: hiển thị progress `X/8 câu`, CTA chính "Tiếp tục từ câu X".
- Sau 24h: hỏi user muốn tiếp tục hay làm lại.
- CTA phụ "Làm lại từ đầu" nhỏ hơn, không cạnh tranh với CTA chính.

#### FR-25: Story-Rule Feedback

Sau mỗi câu sai: Bugsy gãi đầu, cầm kính lúp, kể câu chuyện ngắn giải thích lý do sai → rule landing. Không phán xét. User vẫn nhận QP (giảm).

**Testable consequences:**
- Story-Rule animation luôn chạy sau câu sai — không thể tắt.
- User nhận ≥30% QP reward của câu dù trả lời sai.
- Sau câu đúng: ăn mừng + bonus câu hỏi Self-Efficacy Calibration cho user giỏi.

---

### 4.7 Transfer Gate

**Mô tả:** Cơ chế kết nối in-app progress với real-world job performance. Bugsy không evolve chỉ bằng quiz score — phải có bằng chứng thực tế từ công việc. Honor system — app không verify nội dung, chỉ ghi nhận act of submission. Realizes UJ-3.

**Functional Requirements:**

#### FR-26: Transfer Gate evidence per evolution step

Mỗi version gate yêu cầu 1 Transfer Gate submission gắn với phòng tương ứng.

| Version Gate | Phòng liên quan | Evidence cần nộp |
|---|---|---|
| v0.1 → v0.5 | 🍳 Bếp | Bug report thật được đồng nghiệp confirm |
| v0.5 → v1.0 | 🏢 Work Room | Test case thật từ sprint hiện tại (screenshot) |
| v1.0 → v2.0 | 🛋️ Khách | Sprint Demo Card đã chia sẻ hoặc peer review log |
| v2.0 → v3.0 | 🌿 Sân + 🛏️ Ngủ | Exploratory test session note + Retrospective tháng |

**Testable consequences:**
- Transfer Gate UI accessible từ phòng tương ứng khi QP threshold đã đạt.
- Submission types: text entry hoặc photo upload — không required cả hai.
- Sau submit: server ghi nhận timestamp, user ID, evidence type, submission text/photo reference.
- App confirm nhận nhưng không assign quality score.
- Cả QP đủ VÀ Transfer Gate submitted → trigger evolution (FR-3).

#### FR-27: Transfer Gate evidence storage

Tất cả Transfer Gate submissions được lưu server-side vĩnh viễn, accessible trong "My Journey" view.

**Testable consequences:**
- User có thể xem lại tất cả submissions trong My Journey.
- Submissions không thể xóa bởi user.
- Server lưu: user ID, version gate, timestamp, submission type, content reference.

---

### 4.8 Onboarding Day 1

**Mô tả:** Onboarding 5–7 phút, không có tour guide, không có tutorial text. Rooms reveal qua emotional pulls từ Bugsy. Sign-up gate đặt sau Aha Moment để attachment có thời gian hình thành. Server commit state trước mọi animation reward. Realizes UJ-1.

**Functional Requirements:**

#### FR-28: Onboarding Sequence

Sequence bắt buộc theo đúng thứ tự:

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
[Cliffhanger] Bugsy: "Bạn nghĩ mình có qua được không...?"
    ↓
[Notification Preference] Sáng / Tối / Không cố định
    ↓
[Sign-up Gate] "Lưu [tên pet] lại" — motivated by attachment
    ↓
HOME — Phòng Làm Việc. Cửa bếp hé mở ở góc. Không có tooltip.
```

**Testable consequences:**
- Sequence không thể skip hay reorder.
- Sign-up Gate xuất hiện SAU Reward animation, KHÔNG trước.
- Day 1 Completion Rate (đến Cliffhanger screen) ≥ 60% trong first-cohort testing (SM-2).
- Sign-up conversion từ "Lưu [tên] lại" ≥ 40% (SM-3).

#### FR-29: Kill-app Corner Cases (5 cases)

5 corner cases phải xử lý đúng — resume state không mất data:

| Case | Trigger | Expected Resume |
|---|---|---|
| 1 | Kill app tại màn đặt tên | Resume đúng màn đặt tên, tên chưa có thì blank |
| 2 | Kill app sau quiz nhưng trước reward | Server đã commit → resume từ reward screen |
| 3 | Kill app tại Cliffhanger | Resume Cliffhanger, chưa trigger notification pref |
| 4 | Kill app tại Notification Preference | Resume Notification Preference |
| 5 | Kill app trước Sign-up Gate | Resume Sign-up Gate, progress và earned currency đã commit |

**Testable consequences:**
- Tất cả 5 cases produce correct resume state với zero data loss trong integration testing.
- Server state commit hoàn thành trước khi client bắt đầu bất kỳ animation reward nào.

#### FR-30: First-time Room Reveal

Sau onboarding, HOME = Phòng Làm Việc. Không có map, không có "6 phòng unlocked!" announcement. Chỉ có cửa bếp hé mở, ánh sáng vàng le lói. Nếu user tò mò tap → lần đầu thấy Apartment View với 2 phòng sáng (Work Room + Kitchen). Phòng còn lại: cửa đóng, im lặng.

---

### 4.9 Sprint Hold

**Mô tả:** Cơ chế tạm dừng streak hợp lệ cho real-life interruptions. Earned không mua được — giữ integrity của learning signal. Realizes CAP-4.

**Functional Requirements:**

#### FR-31: Sprint Hold tokens và rules

Hệ thống cung cấp Sprint Hold token như một cơ chế tạm dừng streak hợp lệ. Token phải được earned qua việc hoàn thành daily missions — không được mua bằng currency. Khi dùng, streak không bị reset nhưng Discipline bar giảm nhẹ để duy trì tính trung thực của learning signal.

**Testable consequences:**
- Sprint Hold tokens: tối đa 2 token/tháng (free tier), tối đa 10+ token/tháng (premium tier) [ASSUMPTION: premium tier số lượng xác định sau].
- Tokens không thể mua bằng BC hoặc bất kỳ in-app currency nào.
- Tokens earned khi hoàn thành **20/28 daily missions** trong tháng (không cần liên tiếp).
- Tokens không thể dùng 2 lần liên tiếp (non-consecutive rule).
- Mỗi lần dùng Sprint Hold bắt buộc user ghi lý do — recorded server-side.
- Dùng Sprint Hold ảnh hưởng Discipline bar một phần (giảm nhẹ, không về 0).

---

### 4.10 Notification System

**Mô tả:** Notifications kể câu chuyện nhỏ từ Bugsy — không phải system alerts. Deep link thẳng vào phòng tương ứng. Smart timing, không spam, gộp khi nhiều phòng cần cùng lúc.

**Functional Requirements:**

#### FR-32: Story-style notifications với deep link

**Testable consequences:**
- Tất cả notification copy ở dạng Bugsy nói chuyện (không phải "Reminder: ...").
- Tap notification → deep link vào đúng phòng cần attention.
- **Max 2 notifications/ngày:** Morning 8h00 + Evening 19h00 (chỉ gửi evening nếu user chưa mở app trong ngày).
- Smart timing học từ session behavior thực tế của user sau 7 ngày đầu.
- Nếu ≥2 phòng cần cùng lúc → gộp thành 1 notification.

**Ví dụ notification voice:**
- Hunger 30%: *"Bụng Bugsy kêu to rồi. Tủ lạnh trống không có gì hết á 😅"*
- Happiness thấp: *"Bugsy tìm mãi không thấy bạn. Có vẻ hơi lonely rồi đó 🥺"*
- Nhiều phòng: *"Bugsy cần cả 3 thứ: ăn, ngủ, và một người bạn. Chạy qua nhé?"*

---

### 4.11 Skill Retention Mechanics

**Mô tả:** Ba cơ chế giữ knowledge không bị quên và kết nối in-app learning với real job performance: Spaced Repetition, Weekly Bug Log, và Retrospective Loop. Cùng nhau tạo "My Journey" view theo thời gian.

**Functional Requirements:**

#### FR-32b: Daily Recap Bubble

Khi user "tắt đèn" trong Phòng Ngủ, Bugsy ngủ và một thought bubble xuất hiện với tóm tắt hôm nay — format cute, không phải report khô. Đây khác với 3-2-1 Summary Card (FR-21): Summary Card là per-lesson sau quiz, Recap Bubble là per-day tổng hợp trước khi ngủ.

**Testable consequences:**
- Recap Bubble trigger khi user tap "tắt đèn" trong Phòng Ngủ.
- Nội dung hiển thị: tên bài học hôm nay, 1 rule ngắn từ 3-2-1 Summary của lesson đó, streak hiện tại.
- Format visual: thought bubble (không phải modal, không phải full-screen report).
- Nếu user chưa làm Core Mission trong ngày: Recap Bubble hiển thị "Bugsy ngủ mà chưa học gì hôm nay... nhưng ngày mai vẫn ở đây nhé."
- Recap Bubble không block user — tap anywhere to dismiss.

#### FR-33: Spaced Repetition

Câu hỏi retrieval tự động xuất hiện ≥24h sau lần học đầu tiên, mỗi session (Q1 warm-up). Realizes CAP-7.

**Testable consequences:**
- Q1 của mỗi Core Mission lấy từ bài đã học ≥3 ngày trước (FR-20).
- Correct-on-Retry Rate ≥ 60% khi retry ≥24h sau lần đầu (SM-5).
- Spaced Repetition prompt cũng available trong Phòng Ngủ (1–2 câu ôn trước "tắt đèn").
- Phòng Ngủ spaced review: không có điểm, không có streak impact — chỉ nhắc nhở.

#### FR-34: Weekly Bug Log

User submit ≥1 real-world bug gặp tại công việc mỗi tuần. Cơ chế này kết nối app với job performance thực tế. Realizes CAP-6.

**Testable consequences:**
- Weekly Bug Log entry form accessible từ Work Room hoặc My Journey view.
- Fields: description, severity/priority user đánh giá, outcome (dev confirm? rejected?).
- App không validate nội dung — chỉ ghi nhận act of submission.
- Weekly Bug Log submission rate ≥ 50% trong active users (Day 14+) (SM-4).
- Weekly Bug Log entries visible trong "My Journey" view theo timeline.

#### FR-35: Retrospective Loop

Phản chiếu hàng tuần về những gì đã học và áp dụng. Tạo "My Journey" cumulativeview.

**Testable consequences:**
- Retrospective prompt xuất hiện cuối mỗi 7-day sprint.
- User điền: gì đã áp dụng được, gì còn khó, bật tắt gì trong tuần tới.
- Retrospective entries lưu server-side, visible trong My Journey.
- Applied Knowledge Declaration Rate trending up tại session 14 và 30 (SM-7).

---

### 4.12 Sprint Demo Card & Chia sẻ

**Mô tả:** Card tóm tắt tiến độ 7 ngày, tự động tạo cuối sprint, thiết kế share-worthy. Chia sẻ card reinforces identity là "learning tester". Realizes CAP-8.

**Functional Requirements:**

#### FR-36: Sprint Demo Card tự động tạo

**Testable consequences:**
- Card tự động generate sau khi Day 7 của sprint hoàn thành.
- Card hiển thị: Bugsy version hiện tại, QP earned, streak, top lesson của sprint.
- Card visual đủ đẹp để share lên mạng xã hội.
- ≥ 10% active users share/export card trong 48h sau khi generate (SM-6).

#### FR-37: Sharing fill Happiness bar

Chia sẻ Sprint Demo Card từ Phòng Khách fill Happiness bar đáng kể.

**Testable consequences:**
- Chia sẻ thành công fill Happiness +50% [ASSUMPTION: cần balance testing].
- Share action native share sheet trên iOS/Android — không custom implementation.

---

### 4.13 Special Mechanics

**Functional Requirements:**

#### FR-38: One Room Emergency

Mỗi ngày hệ thống highlight 1 phòng đang cần nhất (ngoài Work Room) trong Apartment View. User chỉ cần làm 1 việc bổ sung để "giữ mạng" Bugsy.

**Testable consequences:**
- Chỉ 1 phòng được highlight là Emergency mỗi ngày.
- Tiêu chí: phòng có bar thấp nhất.
- Emergency indicator hiển thị rõ trong Apartment View nhưng không intrusive.

---

### 4.14 Shop & Customization (Phase 2)

**Mô tả:** Item Shop trong Sân, mở trong Phase 2. User dùng BC mua wallpaper, đồ vật trang trí, trang phục Bugsy. Souvenirs từ evolution không mua được — earned tự động.

**Functional Requirements:**

#### FR-39: Item Shop (Phase 2)

[NOTE FOR PM: Đây là Phase 2 feature. Phase 1 chỉ có Item Shop placeholder trong Sân — browse nhưng chưa purchase. Launch date và content catalog xác định sau MVP.]

**Out of Scope (MVP):** Customization Shop đầy đủ, travel destination visuals chi tiết, visitor NPCs trong Work Room, social / pet visit features.

---

## Cross-cutting NFRs

### NFR-7: Offline Behavior (Last Known State)

App yêu cầu kết nối để commit state và nhận reward. Khi mất kết nối:

**Testable consequences:**
- App render Bugsy ở last known state (không spinner vô tận, không màn hình trắng).
- Bugsy đứng im, nhìn ra cửa sổ. Caption: *"Mình đang không kết nối được với thế giới bên ngoài. Nhưng bạn vẫn có thể ngồi chơi với mình một chút..."*
- Need Bars **không decay** khi offline — decay chỉ tính từ server timestamp của lần sync cuối.
- Pet Care và Core Mission disabled khi offline (UI grayed out, không phải hidden).
- Khi reconnect: micro-animation Bugsy vẫy tay, bars sync từ server, resume normal state.
- Reward animations chỉ play sau khi server ACK thành công.

### NFR-1: Server-side State Commit trước Animation

Server-side state phải commit thành công trước khi client trigger bất kỳ animation reward nào (BC earn, QP earn, evolution, achievement).

**Testable consequences:**
- Trong integration testing: tắt network ngay trước animation → state đã committed → resume đúng khi network trở lại.
- 5 kill-app corner cases (FR-29) produce zero data loss.

### NFR-2: Game State Storage

Tất cả game state lưu server-side: user identity, pet state, QP/BC balances, mission history, Sprint Hold log, Weekly Bug Log entries, Transfer Gate submissions, Retrospective entries, Spaced Repetition history.

**Testable consequences:**
- Uninstall và reinstall app → login → restore đúng toàn bộ state.
- Đổi device → login → state unchanged.

### NFR-3: Content Quality Gate

Không có lesson nào được publish nếu thiếu source tag. Content release pipeline enforce điều này.

**Testable consequences:**
- Lesson có source tag = ISTQB chapter number hoặc "INDUSTRY_PRACTICE".
- Lesson không có source tag bị block ở content pipeline — không đến app.
- Content được peer-review bởi ≥1 senior QA từ domain khác trước khi publish.

### NFR-4: Voice & Register

Toàn bộ app dùng "mình/bạn" register. "Bugsy" tự xưng trong câu nhấn. Không có "mày/tao" hoặc register tương đương ở bất kỳ shipped string nào.

**Testable consequences:**
- Voice review bắt buộc trước mỗi content release.
- Zero "mày/tao" violations trong production.

### NFR-5: No Leaderboard

Không có feature so sánh user với user khác. Personal Best duy nhất là so với bản thân tuần trước.

**Testable consequences:**
- Không có ranking, không có global leaderboard, không có "X người khác đang học bài này".
- Sprint Demo Card chỉ hiển thị personal data — không có comparison với average.

### NFR-6: Performance & Session Time

**Testable consequences:**
- App cold launch < 3 giây trên thiết bị phổ thông (entry-level 2022+) [ASSUMPTION].
- Idle animation chạy ≥ 30fps.
- Need Bar update latency < 1 giây sau khi mở app (fetch từ server).
- Quiz câu tiếp theo load < 500ms sau khi submit.
- **Core Mission (lesson + quiz đủ số câu theo nhóm) hoàn thành trong ≤ 10 phút** khi đo trên target device — nếu consistently > 10 phút, đây là product bug cần xử lý ở content hoặc UX level.
- Daily loop tối thiểu (chỉ Core Mission, không Side Quest) hoàn thành trong 5–8 phút.

---

## Aesthetic & Tone

- **Visual style:** Pixel art hoặc cute 2D illustration — ấm cúng, không sterile. Không corporate. Căn hộ Bugsy có cảm giác "lived-in".
- **Color palette:** Warm tones chủ đạo. Debug terminal aesthetic dành cho Work Room. Không flashy.
- **Voice (app):** "mình/bạn" xuyên suốt. Ấm, hơi tinh nghịch, không infantilizing. Bugsy là pair programmer — không phải giáo viên nghiêm khắc, không phải mascot vô hồn.
- **Feedback tone:** Sai → tò mò, đồng hành ("Phần này nhiều người hay nhầm vì..."), không phán xét. Đúng → ăn mừng thật sự, không giả tạo.
- **Anti-references:** Duolingo's punitive streak mechanics; corporate e-learning "Congratulations! You completed Module 3."

---

## Thông tin Kiến trúc & Platform

- **Platform:** Mobile-first — iOS và Android. Responsive web là later consideration (ngoài scope v1).
- **Form factor:** Smartphone. Tablet không phải target v1.
- **Monetization:** Freemium. Core gameplay loop (pet, daily mission, sprint cycle, progress tracking) + toàn bộ 27 lessons: luôn **miễn phí**. Premium gates advanced scenarios, industry-specific cases, interview-style challenges (content bổ sung, không gated bài cơ bản). Horizontal gating — không có "next step bị blocked" cho free user.
- **Content language:** Tiếng Việt. ISTQB terms xuất hiện bằng tiếng Anh với giải thích tiếng Việt.
- **Backend requirement:** Server-side game state (NFR-2). Real-time bar sync. Content delivery.

---

## 5. Non-Goals (Explicit)

- **Không phải task management tool.** Không integrate với Jira, TestRail, hay bất kỳ live project system nào.
- **Không có automated grading.** Weekly Bug Log và Transfer Gate submissions: app rewards act of submission, không phải quality. Không có AI scoring.
- **Không có certificate hay accreditation.** App không positioning là exam-prep tool.
- **Không có multiplayer hay real-time collaboration.**
- **Không có nội dung cho senior tester** trong v1 content set.
- **Không có community-sourced "Real Bug of the Week"** trong v1. Internally-authored version IS in scope (FR-17b).
- **Không diagnose toxic workplace.** App cung cấp Simulated Bug Hunt path cho users không thể raise bug thật — nhưng không counsel hay escalate vấn đề culture.
- **Không có responsive web trong v1.**
- **Không có Jira/TestRail integration trong v1.**

---

## 6. Phạm vi MVP

### 6.1 In Scope

- Game core: 6-phòng căn hộ, 4 Need Bars real-time, idle animations theo trạng thái, pet evolution v0.1→v3.0 với travel narrative.
- Room unlock sequence trigger-based (FR-13).
- Apartment View (isometric) + Immersive Mode navigation.
- 27 lessons × 5 categories, ≥1 Weekly Challenge/category, đầy đủ source tags.
- Daily Mission Loop: Core Mission + Side Quests + Pet Care.
- Question Engine: 10 formats, framework 2-5-1-2, 3-2-1 Summary, Rescue Mechanic.
- Dual currency (BC + QP), cả hai visible mọi lúc.
- Transfer Gate với real-world submission (honor system).
- Sprint Hold mechanic (earned, max 2 token/tháng free).
- Onboarding Day 1: 5–7 phút, Aha Moment trước Sign-up Gate, Cliffhanger.
- Server-side state commit trước mọi animation reward.
- 5 kill-app corner cases xử lý đúng.
- Notification system: story-style, deep link, smart timing.
- Weekend Mode (decay pause Thứ 7–CN).
- One Room Emergency indicator.
- Sprint Demo Card (auto-generate, shareable).
- Weekly Bug Log + Retrospective Loop + Spaced Repetition.
- Sân Phase 1: idle animations + Item Shop placeholder.

### 6.2 Out of Scope cho MVP

- Customization Shop đầy đủ (wallpaper, items, outfits) — Phase 2. [NOTE FOR PM: Là emotionally load-bearing feature, nên prioritize sớm trong Phase 2.]
- Travel destination visuals chi tiết — Phase 2. MVP có cinematic đơn giản.
- Visitor NPCs trong Work Room (Senior Tester, Client) — Phase 2.
- Sân Exploratory Testing Zone — Phase 2.
- Social / pet visit features — Phase 2+.
- Movie Night weekly event — Phase 2.
- Premium content tier (advanced scenarios) — Post-MVP.
- Responsive web — Post-v1.
- Certificate / accreditation — Ngoài scope vĩnh viễn (v1).
- Multiplayer — Ngoài scope vĩnh viễn (v1).
- Community-sourced content — Post-launch.

---

## 7. Metrics Thành công

**Primary**

- **SM-1: Day 7 Retention ≥ 30%** — Phần trăm users quay lại ngày thứ 7 sau install. Benchmark mobile learning apps. Validates FR-1, FR-8, FR-13 (pet là lý do quay lại).
- **SM-2: Day 1 Completion Rate ≥ 60%** — Tỷ lệ users đạt Cliffhanger screen trong onboarding. Validates FR-28, FR-9 (Aha Moment đủ mạnh).
- **SM-3: Sign-up Conversion ≥ 40%** — Tỷ lệ users convert từ "Lưu [tên] lại" prompt. Validates FR-28 (attachment hình thành đủ sớm).

**Secondary**

- **SM-4: Weekly Bug Log Submission Rate ≥ 50% (Day 14+)** — Tỷ lệ active users submit Weekly Bug Log, đo trong 60 ngày đầu post-launch. Proxy cho app-to-job connection thực tế. Validates FR-34.
- **SM-5: Correct-on-Retry Rate ≥ 60%** — Khi retry ≥24h sau lần đầu. Validates FR-33 (Spaced Repetition hoạt động). Tracked per category.
- **SM-6: Sprint Demo Card Share Rate ≥ 10% DAU** — Trong 48h sau generate. Validates FR-36, FR-37.
- **SM-7: Applied Knowledge Declaration Rate — trending up tại session 14 và 30** — Tỷ lệ users báo cáo đã áp dụng được kiến thức vào công việc thật (qua Retrospective). Trend quan trọng hơn absolute value. Validates FR-35.

**Tín hiệu định tính**
Ít nhất 1 user trong first cohort mô tả việc hỏi câu hỏi boundary-condition trong planning meeting thật và gán credit cho app — đây là signal quan trọng hơn tất cả metrics kể trên.

**Counter-metrics (không optimize)**

- **SM-C1: Streak count** — Không optimize streak dài nhất; streak là proxy của gamification, không phải skill growth. Optimize retention (SM-1) và Applied Knowledge (SM-7) thay vì streak number.
- **SM-C2: Total lessons completed** — Completionism không phải mục tiêu. Optimize Correct-on-Retry (SM-5) thay vì total count.
- **SM-C3: Day 90+ Retention** — Churn sau ngày 90 KHÔNG phải failure signal. App là scaffolding — nếu user internalize kỹ năng và không còn cần app sau 90 ngày, đó là thành công thực sự (brief.md + SPEC.md). Analytics team không được dùng D90 churn như a negative metric. Signal cần đo thay thế: Applied Knowledge Declaration Rate tại session 30 (SM-7).

---

## 8. Open Questions

*Tất cả OQs đã được resolve trong Party Mode session (2026-06-14). Ghi lại decision log DL-006 → DL-013.*

~~1. **QP threshold**~~ → **Resolved DL-006:** 150/400/900/1800 QP cho 4 evolution gates. Failure signal: median days_to_first_evolution > 12 ngày → giảm ngưỡng cấp 1 20%.

~~2. **BC decay rate**~~ → **Resolved DL-007:** -15 BC/ngày miss, grace period ngày đầu, cap 3 ngày liên tiếp.

~~3. **Sprint Hold token earn**~~ → **Resolved DL-008:** 20/28 missions/tháng = 1 token. Target token_earn_rate: 35–50% DAU.

~~4. **Premium content tier**~~ → **Resolved DL-009:** Deferred hoàn toàn. Không launch cùng MVP.

~~5. **Notification frequency**~~ → **Resolved DL-010:** Max 2/ngày: Morning 8h00 + Evening 19h00.

~~6. **Offline capability**~~ → **Resolved DL-011:** Online-only + Last Known State UX (NFR-7). Bars không decay khi offline.

~~7. **Content update cadence**~~ → **Resolved DL-012:** Server-driven JSON, batch 4–6 tuần/lần, versioned cache.

~~8. **Quick Feed fill values**~~ → **Resolved DL-013:** Feed +25% / Play +20% / Train +15%.

---

## 9. Assumptions Index

*Những assumptions có [RESOLVED] đã được confirm qua Party Mode (2026-06-14).*

- **[A-1]** §2.2 — v1 launch Vietnam-only. Thị trường khác là later consideration.
- **[A-2]** FR-2 — Giới hạn tên pet 20 ký tự.
- **[A-3]** FR-7 — Quick Feed +25% / Play +20% / Train +15%. **[RESOLVED DL-013]** Failure signal: train_action_rate < 15% → tăng Train fill lên 25%.
- **[A-4]** FR-15 — BC -15/ngày miss, grace period ngày đầu, cap 3 ngày. **[RESOLVED DL-007]**
- **[A-5]** FR-16 — QP thresholds: 150/400/900/1800 QP. **[RESOLVED DL-006]** Gate cuối (v3.0) cần confirm qua playtesting.
- **[A-6]** FR-31 — Premium Sprint Hold tier = 10+ tokens/tháng. Cần confirm khi define premium tier.
- **[A-7]** FR-31 — Sprint Hold earn: 20/28 missions/tháng = 1 token. **[RESOLVED DL-008]**
- **[A-8]** FR-32 — Max 2 notifications/ngày, 8h00 + 19h00. **[RESOLVED DL-010]** Failure signal: opt_out_rate > 30% → giảm 1/ngày.
- **[A-9]** FR-37 — Share Sprint Demo Card fill Happiness +50%. Cần A/B testing sau launch.
- **[A-10]** NFR-6 — Thiết bị phổ thông = entry-level smartphone 2022+. Cần define khi chọn tech stack.
- **[A-11]** §4.14 — Premium content: advanced scenarios, industry-specific, interview challenges. Detail và pricing xác định sau ≥2 content batch. **[RESOLVED DL-009: defer hoàn toàn]**
