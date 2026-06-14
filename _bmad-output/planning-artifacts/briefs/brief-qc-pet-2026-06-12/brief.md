---
title: "QC Pet — Product Brief"
status: draft
created: 2026-06-12
updated: 2026-06-12
source: Distilled từ SPEC.md + companion files + coaching session (game design)
---

# Product Brief: QC Pet

## Executive Summary

QC Pet là ứng dụng mobile kết hợp nuôi thú cưng Tamagotchi-style với học kỹ năng QC/Testing. Người dùng nuôi Bugsy — một con bug vừa thoát khỏi production server — trong một văn phòng nhỏ có thể trang trí. Bugsy tồn tại trong thời gian thật: có nhu cầu ăn uống, nghỉ ngơi, vui chơi ngay cả khi người dùng không online. Chăm sóc Bugsy qua daily learning missions là cách hiệu quả nhất để fill nhu cầu và giúp Bugsy tích lũy đủ kinh nghiệm để thực hiện giấc mơ: xách vali đi du lịch vòng quanh thế giới.

Thị trường EdTech hiện tại bán "flashlight" — trả lời "tôi cần biết gì?" nhưng không cho người dùng biết họ có tiến bộ không. QC Pet phá vỡ điều đó: pet của bạn phản chiếu những gì bạn *thực hành*, không chỉ những gì bạn *xem*. Câu hỏi mà junior tester mất ngủ — **"Tôi đang test có đúng không?"** — được trả lời qua từng chuyến đi của Bugsy.

Mô hình: Freemium, mobile-first (iOS + Android), nhắm junior tester đã đi làm tại Việt Nam.

## Vấn đề

Junior tester đã đi làm biết cách làm việc — nhưng không thể tự đánh giá có đang tiến bộ không. Không có gương. EdTech hiện tại bán nội dung ("học thêm"), không bán tiến bộ đo được.

Hệ quả cụ thể người dùng đang sống hàng ngày:
- Viết test case theo happy-path UI click, không có assertion về business outcome
- Báo bug theo triệu chứng, không phân biệt severity/priority đúng
- Trong planning meeting: estimate sau khi đọc requirement, không hỏi "boundary condition của 'done' là gì?"
- Nói chuyện với dev về defect: mô tả màn hình hiển thị gì, không mô tả business impact

Môi trường làm trầm trọng thêm: một số junior tester không được phép raise bug thật — team culture, seniority gatekeeping, hoặc project phase. App cần có path thay thế cho nhóm này.

## Thiết kế Game

### Con pet & thế giới

Bugsy sống trong một **văn phòng nhỏ** — nơi Bugsy dọn vào ngay sau khi thoát khỏi production server. Không gian này là home base của Bugsy và có thể được trang trí bằng điểm: wallpaper, đồ vật (bàn, đèn, cây cảnh, poster), ánh sáng. Khi Bugsy đi du lịch và trở về, văn phòng tích dần souvenirs từ các chuyến đi.

### Hệ thống nhu cầu — Tamagotchi-style

Bốn thanh nhu cầu giảm theo **thời gian thật** — kể cả khi người dùng không mở app:

| Thanh | Giảm khi | Fill bằng |
|---|---|---|
| **Hunger** | Thời gian trôi qua | Hoàn thành Core Mission (fill đầy) hoặc quick-feed (fill một phần) |
| **Happiness** | Bỏ app lâu, không tương tác | Side Quests, Pet Care "Play", quick-play interaction |
| **Health** | Hunger hoặc Happiness về 0 | Hoàn thành bài học Train, nghỉ ngơi đủ |
| **Discipline** | Miss nhiều ngày liên tiếp | Streak duy trì, Sprint Hold sử dụng đúng lý do |

Pet không chết. Nếu bị bỏ bê, Bugsy regress — buồn, mệt, chậm chạp — nhưng luôn phục hồi khi người dùng quay lại.

### Một entry point duy nhất — độ dài session emerge tự nhiên

Không có "chọn mode." Người dùng mở app và thấy Bugsy đang làm gì đó trong văn phòng cùng trạng thái các thanh nhu cầu:

- **Bars nguy cấp** → care interface nổi bật, quick interaction trước (1–2 phút)
- **Bars ổn** → daily mission được highlight là bước tiếp theo (5–10 phút)

Quick care (tap feed, tap play) fill bars **một phần** — đủ để giữ Bugsy không regress. Làm mission fill bars **đầy đủ** + earn Bug Coins và Quality Points + unlock Bugsy animations đặc biệt. Không ép buộc — nhưng làm mission luôn đáng hơn.

### Hành động vô tri (Idle Behaviors)

Bugsy tự làm nhiều thứ khi người dùng không tương tác, phản ánh trạng thái hiện tại:

**Khi ổn:**
- Ngồi gõ bàn phím chậm rãi, tự debug một màn hình con
- Uống cà phê, nhìn ra cửa sổ
- Lấy note pad ra viết gì đó, rồi vò viên ném đi

**Khi buồn / Happiness thấp:**
- Ngồi ngẩn ngơ nhìn vào khoảng không
- Tựa đầu vào bàn, thở dài

**Khi đói / Hunger thấp:**
- Bụng kêu sôi, Bugsy nhìn quanh tìm bug để ăn
- Mở tủ lạnh trống, đóng lại, mặt thất vọng

**Khi mệt / Health thấp:**
- Ngủ gật trên bàn, đắp chăn nhỏ, ngáy nhẹ
- Mắt lim dim, gõ phím sai liên tục

**Khi hạnh phúc (sau mission):**
- Nhảy lên, làm crash stack trace trên màn hình rồi cười
- Lấy vali ra ngắm nghía, mơ màng

### Narrative Arc — Hành trình của Bugsy

Bugsy thoát khỏi production server với một vali nhỏ và một giấc mơ: đi du lịch khắp thế giới. Nhưng muốn đi được, Bugsy cần trở thành một tester đủ giỏi để được tin tưởng làm việc remote từ bất cứ đâu.

Mỗi lần pet evolve = Bugsy unlock một điểm đến mới:

| Version | Stage | Điểm đến |
|---|---|---|
| v0.1 | Baby Bug Hunter | Văn phòng nhỏ — mới đến, còn bỡ ngỡ |
| v0.5 | Junior Tester Pet | Chuyến đi đầu tiên: một thành phố trong nước |
| v1.0 | Tester Pet | Lần đầu ra nước ngoài: một nước Đông Nam Á |
| v2.0 | Senior Tester Pet | Chuyến xa: châu Á hoặc châu Âu |
| v3.0 | QA Lead Pet | Điểm đến trong mơ — Bugsy làm việc remote từ nơi Bugsy luôn muốn đến |

Văn phòng thay đổi theo: souvenirs từ mỗi chuyến đi xuất hiện trên bàn, trên tường. Người dùng thấy hành trình của Bugsy qua không gian sống của nó.

### Customization Shop (Phase sau)

Người dùng dùng Bug Coins để mua items trang trí văn phòng:
- Wallpaper (chủ đề: terminal, pixel art, cà phê sáng, ban đêm)
- Đồ vật bàn (cây cảnh, đèn bàn, mug, sticky notes)
- Trang phục Bugsy (outfit cho từng điểm đến)
- Souvenirs (unlock tự động theo evolution, không mua được)

## Giải pháp — Learning Loop

Học QC là cách chính để chăm sóc Bugsy hiệu quả — không phải yêu cầu bắt buộc, nhưng là con đường đáng nhất.

**Daily Mission Loop (5–10 phút):**
- Core Mission: 1 lesson + 3–5 quiz với Story-Rule feedback → fill Hunger đầy đủ nhất
- Side Quests (tùy chọn): Bug Hunt, Peer Review, Repro Steps → fill Happiness
- Pet Care: Feed (submit bug report), Play (quiz không hint), Train (deep dive) → fill Health

**Dual Currency:**
- Bug Coins (BC): ngắn hạn, mua items custom, giảm khi miss ngày
- Quality Points (QP): dài hạn, không bao giờ giảm, mở khóa pet evolution

**Skill Transfer Mechanics:**
- Transfer Gate: bằng chứng real-world trước khi Bugsy evolve (không chỉ quiz score)
- Weekly Bug Log: log bug thật gặp tại công việc mỗi tuần
- Retrospective Loop: phản chiếu hàng tuần, tạo "My Journey" view theo thời gian
- Spaced Repetition: câu hỏi retrieval mỗi session (≥ 24h sau lần tiếp xúc đầu)

**Nội dung (MVP):** 27 lessons × 5 categories: Bug Detective ×8, Test Architect ×5, Mindset & Process ×4, Tool Master ×6, Agile Tester ×4.

## Điểm khác biệt

**Game đứng vững một mình:** Nếu bỏ hết phần QC learning, phần game còn lại — Tamagotchi với Bugsy trong văn phòng, bars real-time, idle animations, travel narrative — đủ vui để chơi trong lúc rảnh. Learning là fuel, không phải gánh nặng.

**"Better than yesterday" thay vì "know more":** Không competitor nào đang chiếm trục đo được cải thiện hàng ngày trong bối cảnh công việc thật.

**Transfer Gate:** Pet không evolve bằng quiz score — phải có real-world evidence. Làm đúng việc ở công việc thật = Bugsy được đi xa hơn.

**No leaderboard:** Cạnh tranh với bản thân tuần trước, không phải người khác. Không trigger abandonment qua punitive comparison.

**Tagline đã chọn:** *"Pet bạn đói. Đi tìm bug đi."*

## Đối tượng người dùng

**Primary:** Junior tester đã đi làm, 1–3 năm kinh nghiệm, Việt Nam. Biết làm việc nhưng không biết mình có đang tốt lên không. Pain point cốt lõi: "Tôi test như vậy có đúng không?"

**Secondary:** Junior tester trong môi trường không cho phép raise bug thật → cần Simulated Bug Hunt path thay thế.

**Không phải cho:** Senior tester (ngoài scope v1), người học QC từ đầu chưa đi làm, team manager.

## Tiêu chí thành công

| Metric | Target | Ghi chú |
|---|---|---|
| Day 7 Retention | ≥ 30% | Benchmark mobile learning apps |
| Day 1 Completion Rate (đến Cliffhanger) | ≥ 60% | First-cohort testing |
| Sign-up conversion từ "Save Bugsy" | ≥ 40% | |
| Weekly Bug Log submission rate (Day 14+) | ≥ 50% | Proxy app-to-job connection |
| Correct-on-Retry Rate | ≥ 60% | Retry ≥ 24h sau lần đầu |
| Sprint Demo Card share rate | ≥ 10% DAU | |
| Applied Knowledge Declaration Rate | Trending up tại session 14 và 30 | Trend quan trọng hơn absolute value |

**Tín hiệu định tính:** Ít nhất 1 user trong cohort đầu mô tả việc hỏi câu hỏi boundary-condition trong planning meeting thật và gán credit cho app.

## Phạm vi MVP

**Bắt buộc:**
- Game core: văn phòng, 4 need bars real-time, idle animations, pet evolution v0.1→v3.0
- 27 lessons × 5 categories, ≥1 Weekly Challenge/category
- Daily Mission Loop hoàn chỉnh (Core + Side Quest + Pet Care)
- Transfer Gate với real-world submission
- Dual currency (BC + QP)
- Sprint Hold mechanic (earned, không mua được)
- Onboarding Day 1 (5–7 phút, sign-up sau Aha Moment)
- Server-side state commit trước mọi animation reward
- 5 kill-app corner cases xử lý đúng

**Phase sau (không phải MVP):**
- Customization shop (wallpaper, items, outfits)
- Travel destination visuals chi tiết
- Nhân vật phụ xuất hiện trong văn phòng (PM, Dev)
- Responsive web

**Ngoài scope v1:**
- Jira/TestRail integration
- Automated grading free-text
- Certificate/accreditation
- Multiplayer
- Community-sourced content
- Content cho senior tester

## Tầm nhìn

Bugsy bắt đầu hành trình từ một văn phòng nhỏ với một chiếc vali. Kết thúc ở nơi Bugsy luôn mơ đến — làm việc remote, nhìn ra cảnh đẹp, bug report hoàn hảo trên màn hình.

Người dùng kết thúc hành trình đó không còn cần mở app để nhớ cách đặt câu hỏi đúng trong meeting. Họ đã internalize nó. App đã tự gỡ bỏ chính mình — đó là thành công thực sự.

Trong 2–3 năm: nếu Transfer Gate data đủ lớn, QC Pet có thể trở thành công cụ assessment khách quan đầu tiên cho junior tester Việt Nam — không qua quiz score, mà qua pattern real-world submissions theo thời gian.

---
*Game detail → `_bmad-output/specs/spec-qc-pet/gameplay-systems.md`*
*Onboarding → `_bmad-output/specs/spec-qc-pet/onboarding-flow.md`*
*Skill transfer → `_bmad-output/specs/spec-qc-pet/skill-transfer.md`*
