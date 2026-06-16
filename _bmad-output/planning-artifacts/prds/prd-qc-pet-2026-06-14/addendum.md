# Addendum — QC Pet PRD (2026-06-14)

> Tài liệu này chứa nội dung có chiều sâu thuộc về downstream documents (UX Design, Architecture, Content Ops) hoặc earned a place nhưng không fit vào PRD chính. Không phải yêu cầu — là context.

---

## A1. Cliffhanger Examples (Day 1 Onboarding)

Cliffhanger là màn hình cuối onboarding, tạo anticipation cho Day 2. Dưới đây là 3 ví dụ đã thiết kế — lựa chọn và điều chỉnh trong UX phase.

**Cliffhanger 1 — "Cái Bug Kỳ Lạ"**
> *"Bạn đã biết severity rồi. Nhưng hôm nay tôi gặp một bug chỉ xảy ra vào thứ Sáu. Đúng thứ Sáu. Không phải thứ Năm, không phải thứ Bảy. Severity của nó là gì? Câu trả lời... không đơn giản như bạn nghĩ."*

**Cliffhanger 2 — "Dev vs Tester"**
> Notification: *"Dev vừa comment vào bug bạn viết hôm nay: 'Không repro được. Cần thêm info.'"*
> Bugsy: *"Ngày mai tôi sẽ dạy bạn cách viết để dev KHÔNG THỂ nói 'không repro được' nữa."*

**Cliffhanger 3 — "The Missing Precondition"**
> Bug report bỏ lửng, chữ mờ dần: *"P _ _ _ _ _ _ _ _ _ _ _"*
> Bugsy thì thầm: *"Có một thứ bị thiếu mà bạn chưa học tên của nó. Ngày mai. Bugsy sẽ tiết lộ."*

---

## A2. Side Quest Examples — Design Detail

### Bug Hunt — "Đêm Trước Release"
- Setup: APK mới, 5 phút smoke test, 5 hidden bugs trong prototype UI interactive.
- Mechanic: Tap tự do + report nhanh. 3/5 bugs = Pass. 5/5 = "Bug Hunter Elite".
- ISTQB link sau màn: Session-Based Exploratory Testing (FL 4.4).

### Peer Review — "Kiểm Tra Chéo"
- Setup: Bug report của "JuniorDev_Minh" cần review — có 3 vấn đề ẩn.
- Mechanic: Annotate → Approve/Request Changes/Reject → version 2 xuất hiện để check lại.
- Cảm xúc được tạo: Responsibility + empathy.

### Repro Steps — "Mission: Impossible Repro"
- Setup: Video ngắn 15–20s user gặp bug, viết lại Repro Steps đầy đủ từ video.
- Mechanic: Replay tối đa 3 lần + template điền. Scoring: Precondition 30đ + Steps 40đ + Repro rate 30đ.
- Kết thúc: Dev confirm "Repro được rồi!" → Bugsy: *"Một bug report tốt = dev không phải hỏi lại = sprint nhanh hơn."*

---

## A3. Boss Mission Examples

### v0.5 Boss — "The Haunted Bug Report" (5 tasks, 3 phút)
Multi-step: Identify 4 vấn đề → Classify severity → Rewrite Expected Result → Fill Precondition → Final call: Submit hay không?
Timer: 3 phút đếm ngược. Thất bại → nhận dev feedback + làm lại ngay.

### v2.0 Boss — "The Regression Storm" (10 phút)
Scenario: Release trong 2 tiếng, 6 test cases, 2 bug hidden, viết 1 bug report, quyết định Go/No-Go + justification.
Covers: Regression testing + test case design + release decision.

---

## A4. Mission Scenario Examples (Story-first content design)

### "Vụ Án Ngày Sinh Nhật" — BVA
- Context: App có khuyến mãi giảm 10% cho đơn 100k–500k VNĐ.
- Bug: Boundary sai — không apply cho đúng 100k, nhưng apply cho 500,001đ.
- Fresher mistake: Test 200k, 50k, 600k — báo "passed." Không bao giờ test boundary.
- Bugsy teaches: BVA 3-value: 99,999 / 100,000 / 100,001 và 499,999 / 500,000 / 500,001.
- ISTQB: FL 4.2.2.

### "Bí Ẩn Của Bug Biến Mất" — Intermittent
- Context: App crash khi checkout, developer không reproduce được.
- Bug: Race condition khi network chuyển WiFi → 4G. Reproduce rate ~30%.
- Fresher mistake: 2 lần không thấy → "Cannot reproduce, close ticket."
- Bugsy teaches: Test 10 lần, ghi kết quả, ghi reproduction rate, ghi environmental variation.
- ISTQB: FL 5.5.

### "Cuộc Tranh Luận Dev vs Tester" — Severity ≠ Priority
- Context: Button "Xác nhận thanh toán" màu xám như disabled nhưng vẫn click được.
- Bug: Severity LOW (không crash) nhưng Priority HIGH (checkout + campaign + CEO concern).
- Fresher mistake: Ghi Low/Low → Dev bỏ vào backlog → lên production → UX team nổi giận.
- Bugsy teaches: Severity = kỹ thuật. Priority = business decision.
- ISTQB: FL 5.5.1.

---

## A5. Weekly Challenges — 1 per Category

| Category | Challenge | Bài học kết nối |
|---|---|---|
| Bug Detective | Tìm 1 bug reproduction rate < 100% trong dự án thật, viết đầy đủ với env + freq + business impact | BD-2, BD-3, BD-4, BD-7 |
| Test Architect | Lấy 5 test cases happy-path cũ, refactor với EP + BVA, so sánh số lượng trước/sau | TA-1, TA-2, TA-5 |
| Mindset & Process | 15 phút ET có charter cho 1 feature mới trong sprint. Ghi notes + bugs + learning | MP-1, MP-2 |
| Tool Master | Dùng DevTools Network tab hoặc SQL để bắt 1 bug mà UI không thấy. Document cả UI screenshot + backend evidence | TM-5, TM-6, TM-2 |
| Agile Tester | Tham gia 3 Amigos, đặt ≥3 câu hỏi edge case, ghi lại câu hỏi nào thay đổi AC | AT-3, MP-3, MP-4 |

---

## A6. Top 10 "Everybody-Gets-This-Wrong" — Backbone Content

Đây là danh sách 10 concept backbone của mission content — không phải trong PRD vì là content decision, nhưng cần để content ops tham chiếu.

| # | Concept | ISTQB Ref | Risk Score |
|---|---|---|---|
| 1 | Severity ≠ Priority | FL 5.5.1 | 9/10 |
| 2 | Happy Path only testing | FL 1.3 Principle #2 | 9/10 |
| 3 | Risk-based prioritization không tồn tại | FL 5.2 | 8/10 |
| 4 | Error ≠ Defect ≠ Failure | FL 1.2.3 | 8/10 |
| 5 | Test Case không có Precondition | FL 4.1 | 8/10 |
| 6 | "Test passed" ≠ "Software works" | FL 1.3 Principle #1 | 7/10 |
| 7 | BVA sai cách (quên off-by-one) | FL 4.2.2 | 7/10 |
| 8 | Không ghi Reproduction Rate cho intermittent bug | FL 5.5 | 7/10 |
| 9 | Test Objective vs Test Condition bị lẫn | FL 4.1 | 6/10 |
| 10 | Verification vs Validation nhầm lẫn | FL 1.2.2 | 6/10 |

---

## A7. Content Gap Analysis

| Gap | Mức độ | Đề xuất |
|---|---|---|
| BVA → viết assertion cụ thể trong test case | Nhỏ | Thêm exercise thực hành trong TA-2 |
| Kỹ năng hỏi clarification trước khi estimate | **Lớn** | Thêm checklist "câu hỏi phải hỏi" vào MP-3 hoặc AT-3 |
| Tool integration workflow (dùng 3 tools cùng lúc) | Trung bình | Thêm Weekly Challenge tổng hợp hoặc bài capstone TM-7 |
| TM-5, TM-6 không có ISTQB source | Documentation | Tag INDUSTRY_PRACTICE — không tìm chapter không tồn tại |

---

## A8. Micro-animations Design Intent (UX reference)

| Tình huống | Animation | Bugsy |
|---|---|---|
| Đúng → câu tiếp | Card bay sang trái; card mới slide cong vào (bouncy) | Giơ tay tương ứng loại câu |
| Sai → câu tiếp | Card rung → vết nứt → "vỡ tan thành pixel" → build lại | Ngồi xuống đồng hành, chỉ vào explanation |
| Câu cuối → Summary | Grid thu thành ngôi sao → Summary card nở hoa | Nhảy, xoay tròn, đọc cuộn giấy tóm tắt |
