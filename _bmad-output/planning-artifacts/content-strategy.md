---
title: "QC Pet — Content Strategy & Question Design"
status: draft
created: 2026-06-12
updated: 2026-06-14
source: Party Mode brainstorm — Murat (ISTQB), Samus (Game Design), Mary (Content Analysis), Sally (UX)
reference: ISTQB Foundation Level 4.0
target: Fresher tester (0–2 năm, đã đi làm)
---

# QC Pet — Content Strategy & Question Design

---

## 1. ISTQB Chapter Mapping → 5 Content Categories

| ISTQB FL Chapter | Ưu tiên Fresher | Content Category |
|---|---|---|
| Ch.1 Fundamentals of Testing | 🔴 CRITICAL | Mindset & Process + Bug Detective |
| Ch.2 Testing Throughout SDLC | 🔴 CRITICAL | Agile Tester |
| Ch.3 Static Testing | 🟡 MEDIUM | Bug Detective |
| Ch.4 Test Analysis & Design | 🔴 CRITICAL | Test Architect |
| Ch.5 Managing Test Activities | 🟡 MEDIUM | Bug Detective |
| Ch.6 Test Tools | 🟢 LOW | Tool Master (supplement với Industry Practice) |

**Ngoài scope fresher level:** State Transition phức tạp, Test Estimation (PERT), Configuration Management, full Test Automation tooling.

---

## 2. 27 Lesson Titles — Đầy đủ với ISTQB Source Tag

### 🐛 Bug Detective ×8

| Bài | Tên bài học | ISTQB Source |
|---|---|---|
| BD-1 | "Bug là gì? Không phải mọi sự khác biệt đều là lỗi" | FL 1.2 — failure, defect, error |
| BD-2 | "Anatomy of a Bug Report: Tại sao dev nói 'Cannot Reproduce'?" | FL 5.5 — defect report content |
| BD-3 | "Khi nào Severity ≠ Priority: câu chuyện của 1 bug tưởng Critical" | FL 5.5.1 — severity vs priority |
| BD-4 | "Tỉ lệ tái hiện bug: 100%, 50%, hay 'thỉnh thoảng'?" | FL 5.5 — reproduction rate, flaky bugs |
| BD-5 | "Root Cause hay Symptom? Đừng report cái ngọn" | FL 1.2.3 — root cause analysis |
| BD-6 | "Bug lifecycle: Từ New → Closed không phải đường thẳng" | FL 5.5 — defect lifecycle states |
| BD-7 | "Business Impact: Con số thiệt hại khi bug này lọt production" | FL 1.2.2 — business impact, failure consequences |
| BD-8 | "Bug Clustering: Lỗi không xuất hiện ngẫu nhiên — tìm đâu ra nhiều nhất?" | FL 1.3.6 — defect clustering principle |

**Dependency order:** BD-1 → BD-4 → BD-2 → BD-3 → BD-5 → BD-6 → BD-7 → BD-8

### 🏗️ Test Architect ×5

| Bài | Tên bài học | ISTQB Source |
|---|---|---|
| TA-1 | "Equivalence Partitioning: Tại sao test 1 giá trị đủ đại diện cả nhóm?" | FL 4.2 — EP, valid/invalid partitions |
| TA-2 | "Boundary Value Analysis: Dev thường sai nhất ở đâu?" | FL 4.2.2 — BVA 2-value và 3-value |
| TA-3 | "Decision Table: Khi nào dùng bảng thay vì viết 50 test cases?" | FL 4.2.3 — Decision Table Testing |
| TA-4 | "State Transition: App của bạn có bao nhiêu trạng thái ẩn?" | FL 4.2.4 — State Transition Testing |
| TA-5 | "Chọn kỹ thuật nào? Bản đồ quyết định cho test designer" | FL 4.2 — Selecting test techniques |

### 🧠 Mindset & Process ×4

| Bài | Tên bài học | ISTQB Source |
|---|---|---|
| MP-1 | "Exploratory Testing: Không phải 'test linh tinh' — đây là kỹ năng có cấu trúc" | FL 4.4 — Experience-based techniques |
| MP-2 | "Risk-Based Testing: Test cái gì trước khi deadline đến?" | FL 5.2 — Risk Management |
| MP-3 | "Shift-Left: Tại sao tester phải đọc requirements trước khi có code?" | FL 2.1 — shift-left, early involvement |
| MP-4 | "Tester Mindset: Tại sao developer khó tự test code của mình?" | FL 1.4 — independence of testing |

### 🔧 Tool Master ×6

| Bài | Tên bài học | Source Tag |
|---|---|---|
| TM-1 | "Jira workflow thực tế: Ticket đi từ Backlog đến Done như thế nào?" | FL 6.1 + INDUSTRY |
| TM-2 | "Viết bug trên Jira: Fields nào quan trọng, field nào hay bỏ sót?" | FL 5.5 + FL 6.1 |
| TM-3 | "Postman cơ bản: Gửi API request đầu tiên trong 10 phút" | FL 6.1 + INDUSTRY |
| TM-4 | "Postman nâng cao: Viết test assertion để tự động kiểm tra response" | FL 6.1 + INDUSTRY |
| TM-5 | "DevTools cho tester: Network tab tiết lộ gì khi bug xảy ra?" | **INDUSTRY_PRACTICE** |
| TM-6 | "SQL SELECT cho tester: Kiểm tra data thật sự lưu đúng chưa?" | **INDUSTRY_PRACTICE** |

> ⚠️ TM-5 và TM-6 không có ISTQB source trực tiếp — tag INDUSTRY_PRACTICE để content reviewer không tìm chapter không tồn tại.

### 🏃 Agile Tester ×4

| Bài | Tên bài học | ISTQB Source |
|---|---|---|
| AT-1 | "Scrum cho tester: Sprint, ceremony nào tester PHẢI có mặt?" | FL 2.1.3 |
| AT-2 | "Definition of Done: Khi nào một story thực sự xong?" | FL 2.1.5 |
| AT-3 | "Ba Amigos: Conversation giữa Dev, BA, Tester trước khi viết code" | FL 2.1.4 |
| AT-4 | "Agile Testing Quadrants: Tester làm gì trong từng giai đoạn sprint?" | FL 2.1.6 |

---

## 3. Top 10 "Everybody-Gets-This-Wrong" — Fresher Việt Nam

Nguồn: ISTQB FL + pattern thực tế. Đây là backbone của mission content.

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

## 4. Question Formats — Vượt ra ngoài MCQ

| Format | Cơ chế | ISTQB concept phù hợp |
|---|---|---|
| **Bug Report Surgery** | Drag & reconstruct bug report fields; nhận ra field sai và xóa | BD-2, BD-3 |
| **Severity Swipe** | Tinder-style: swipe P/T/L/U để classify; combo streak | BD-3, TA-1 |
| **Spot the Defect** | Hidden object: tap vào bug trong UI screenshot/prototype | MP-1, BD-1 |
| **Rewrite the Fail** | Ghép word blocks tạo Expected Result đúng | BD-2, Scenario B |
| **Priority×Severity Duel** | Drag bug vào ma trận 2×2; bẫy ở corner cases | BD-3 |
| **Boundary Attack** | Nhập test values, đánh dấu Pass/Fail expected, reveal boundary | TA-2 |
| **Root Cause Chain** | Kéo thả: Failure → Defect → Error → Process Gap → Prevention | BD-5, MP-4 |
| **Risk Radar** | Xếp hạng feature cards theo risk; so sánh với expert ranking | MP-2 |
| **Complete the Test Case** | Điền Precondition + Expected Result + Test Data vào template | BD-2, TA-1 |
| **Scenario Judgment Call** | Tình huống phức tạp, chọn hành động → consequence story | MP-4, AT-2 |

---

## 5. Difficulty Progression — Bloom's Taxonomy Arc

| Giai đoạn | Bloom Level | Ngày | Nội dung | Format chủ đạo |
|---|---|---|---|---|
| Foundation | REMEMBER | Day 1–5 | Vocabulary, definitions, anatomy | MCQ + Spot the Defect (simple) |
| Understanding | UNDERSTAND | Day 6–10 | Concept distinction, "tại sao" | Scenario Judgment + Fill-in-blank |
| Application | APPLY | Day 11–15 | Technique execution hands-on | Complete Test Case + Boundary Attack |
| Analysis | ANALYZE | Day 16–20 | Multi-variable thinking | Risk Radar + Triage Judge |
| Evaluation | EVALUATE | Day 21–25 | Quality judgment, review others | Bug Report Surgery + Peer Review |
| Synthesis | SYNTHESIZE | Day 26–30 | End-to-end real scenario | Multi-step missions, Boss format |

**Quan trọng:** Day 26–30 không dạy concept mới — consolidate toàn bộ. Peak motivation moment khi learner nhận ra họ đã giỏi hơn so với Day 1.

---

## 6. Cliffhanger Examples

### Cliffhanger 1 — "Cái Bug Kỳ Lạ"
Bugsy: *"Bạn đã biết severity rồi. Nhưng hôm nay tôi gặp một bug chỉ xảy ra vào thứ Sáu. Đúng thứ Sáu. Không phải thứ Năm, không phải thứ Bảy. Severity của nó là gì? Câu trả lời... không đơn giản như bạn nghĩ."*

### Cliffhanger 2 — "Dev vs Tester"
Notification: *"Dev vừa comment vào bug bạn viết hôm nay: 'Không repro được. Cần thêm info.'"*
Bugsy: *"Ngày mai tôi sẽ dạy bạn cách viết để dev KHÔNG THỂ nói 'không repro được' nữa."*

### Cliffhanger 3 — "The Missing Precondition"
Bug report bỏ lửng, chữ mờ dần: *"P _ _ _ _ _ _ _ _ _ _ _"*
Bugsy thì thầm: *"Có một thứ bị thiếu mà bạn chưa học tên của nó. Ngày mai. Bugsy sẽ tiết lộ."*

---

## 7. Side Quest Examples

### Bug Hunt — "Đêm Trước Release"
Setup: APK mới, 5 phút smoke test, 5 hidden bugs trong prototype UI interactive.
Mechanic: Tap tự do + Report nhanh. 3/5 bugs = Pass. 5/5 = "Bug Hunter Elite".
ISTQB link sau màn: Session-Based Exploratory Testing (FL 4.4).

### Peer Review — "Kiểm Tra Chéo"
Setup: Bug report của "JuniorDev_Minh" cần review — có 3 vấn đề ẩn.
Mechanic: Annotate → Approve/Request Changes/Reject → version 2 xuất hiện để check lại.
Cảm xúc được tạo: Responsibility + empathy.

### Repro Steps — "Mission: Impossible Repro"
Setup: Video ngắn 15–20s user gặp bug, viết lại Repro Steps đầy đủ từ video.
Mechanic: Replay tối đa 3 lần + template điền. Scoring: Precondition 30đ + Steps 40đ + Repro rate 30đ.
Kết thúc: Dev confirm "Repro được rồi!" → Bugsy: *"Một bug report tốt = dev không phải hỏi lại = sprint nhanh hơn."*

---

## 8. Boss Mission Examples

### v0.5 Boss — "The Haunted Bug Report" (5 tasks, 3 phút)
Multi-step: Identify 4 vấn đề → Classify severity → Rewrite Expected Result → Fill Precondition → Final call: Submit hay không?
Timer: 3 phút đếm ngược. Thất bại → nhận dev feedback + làm lại ngay.

### v2.0 Boss — "The Regression Storm" (10 phút)
Scenario: Release trong 2 tiếng, 6 test cases, 2 bug hidden, viết 1 bug report, quyết định Go/No-Go + justification.
Covers: Regression testing + test case design + release decision.

---

## 9. Mission Scenario Examples (Story-first)

### Mission "Vụ Án Ngày Sinh Nhật" — BVA
**Context:** App có khuyến mãi giảm 10% cho đơn 100k–500k VNĐ.
**Bug:** Boundary sai — không apply cho đúng 100k, nhưng apply cho 500,001đ.
**Fresher mistake:** Test 200k, 50k, 600k — báo "passed." Không bao giờ test boundary.
**Bugsy teaches:** BVA 3-value: 99,999 / 100,000 / 100,001 và 499,999 / 500,000 / 500,001.
**ISTQB:** FL 4.2.2.

### Mission "Bí Ẩn Của Bug Biến Mất" — Intermittent
**Context:** App crash khi checkout, developer không reproduce được.
**Bug:** Race condition khi network chuyển WiFi → 4G. Reproduce rate ~30%.
**Fresher mistake:** 2 lần không thấy → "Cannot reproduce, close ticket."
**Bugsy teaches:** Test 10 lần, ghi kết quả, ghi reproduction rate, ghi environmental variation.
**ISTQB:** FL 5.5.

### Mission "Cuộc Tranh Luận Dev vs Tester" — Severity ≠ Priority
**Context:** Button "Xác nhận thanh toán" màu xám như disabled nhưng vẫn click được.
**Bug:** Severity LOW (không crash) nhưng Priority HIGH (checkout screen + campaign đang chạy + CEO concern = business impact).
**Fresher mistake:** Ghi Low/Low → Dev bỏ vào backlog → lên production → UX team nổi giận.
**Bugsy teaches:** Severity = kỹ thuật. Priority = business decision. Hai thứ khác nhau.
**ISTQB:** FL 5.5.1.

---

## 10. Weekly Challenges (1 per category)

| Category | Challenge | Bài học kết nối |
|---|---|---|
| Bug Detective | Tìm 1 bug reproduction rate < 100% trong dự án thật, viết đầy đủ với env + freq + business impact | BD-2, BD-3, BD-4, BD-7 |
| Test Architect | Lấy 5 test cases happy-path cũ, refactor với EP + BVA, so sánh số lượng trước/sau | TA-1, TA-2, TA-5 |
| Mindset & Process | 15 phút ET có charter cho 1 feature mới trong sprint. Ghi notes + bugs + learning | MP-1, MP-2 |
| Tool Master | Dùng DevTools Network tab hoặc SQL để bắt 1 bug mà UI không thấy. Document cả UI screenshot + backend evidence | TM-5, TM-6, TM-2 |
| Agile Tester | Tham gia 3 Amigos, đặt ≥3 câu hỏi edge case, ghi lại câu hỏi nào thay đổi AC | AT-3, MP-3, MP-4 |

---

## 11. Gap Analysis — Cần bổ sung

| Gap | Mức độ | Đề xuất |
|---|---|---|
| BVA → viết assertion cụ thể trong test case | Nhỏ | Thêm exercise thực hành trong TA-2 |
| Kỹ năng hỏi clarification trước khi estimate | **Lớn** | Thêm checklist "câu hỏi phải hỏi" vào MP-3 hoặc AT-3 |
| Tool integration workflow (dùng 3 tools cùng lúc để debug) | Trung bình | Thêm Weekly Challenge tổng hợp hoặc bài capstone TM-7 |
| TM-5, TM-6 không có ISTQB source | Documentation | Tag INDUSTRY_PRACTICE — không tìm chapter không tồn tại |

---

## 12. Feedback Loop Design (Bugsy as Teacher)

**Khi SAI:**
- Tone: tò mò, không phán xét
- Animation: Bugsy gãi đầu, cầm kính lúp nhìn lại
- Reveal: highlight phần sai + giải thích ngắn tại sao
- XP: vẫn nhận (một phần) — không trừ điểm thô bạo
- Badge: "Học từ sai lầm" — gamify the failure

**Khi ĐÚNG:**
- Tone: ăn mừng thật sự
- Animation: Bugsy nhảy, giơ tay
- Depth add: Self-Efficacy Calibration — câu hỏi bonus cho người giỏi
- Rule capture: 1 câu rule ngắn có thể screenshot/share

**Philosophy:** Bugsy không phải examiner. Bugsy là pair programmer — người đầu tiên bạn muốn khoe khi làm đúng, và người đầu tiên bạn muốn hỏi khi bị stuck.

---

## 13. Daily Question Structure — Cấu trúc Câu Hỏi Mỗi Ngày

*Nguồn: Party Mode brainstorm — Murat (ISTQB), Samus (Game Design), Sally (UX) — 2026-06-14*

---

### 13.1 Phân bổ số câu theo nhóm chủ đề

**Nguyên tắc:** Số câu tỷ lệ với độ phức tạp kỹ năng và rủi ro nếu fresher hiểu sai trong thực tế.

| Nhóm | Số câu / bài | Lý do |
|---|---|---|
| Bug Detective ×8 | **8–10** | Kỹ năng hàng ngày, risk cao nhất nếu hiểu sai |
| Test Architect ×5 | **9–10** | BVA/EP cần nhiều tính toán thực hành, không được học vẹt |
| Tool Master ×6 | **7–8** | Đủ context thực tế, không cần quá nhiều lý thuyết |
| Agile Tester ×4 | **6–7** | Cần bẻ gãy misconception, không cần kéo dài |
| Mindset & Process ×4 | **5–6** | Nội dung mềm — quá nhiều MCQ sẽ phản tác dụng |

---

### 13.2 Tỷ lệ loại câu hỏi — Framework "2-5-1-2"

Trong 1 session bài học, phân bổ theo thứ tự:

| Loại | Số câu | Mô tả |
|---|---|---|
| **Lý thuyết nền** | 2 | Definition, concept distinction — đà xuất phát |
| **Thực hành** | 5 | Scenario, tính toán, phân tích, classification |
| **Hình ảnh minh họa** | 1 | Screenshot / diagram / ma trận — quan sát thực tế |
| **Scenario phán đoán** | 2 | Tình huống đa biến — người dùng sắm vai QA |

*Điều chỉnh nhẹ theo từng nhóm: Test Architect thêm câu tính toán; Mindset giảm lý thuyết, tăng scenario.*

---

### 13.3 Flow cảm xúc 1 session — 8 câu chuẩn

| Câu | Tên giai đoạn | Loại câu | Cảm giác người dùng |
|---|---|---|---|
| Q1 | Warm-up | Lý thuyết (MCQ 2 lựa chọn) | *"Mình biết cái này rồi!"* — momentum dương |
| Q2 | Đặt nền | Lý thuyết nhẹ | *"Đang vào guồng"* — nhịp đều, pattern recognition |
| Q3 | Cú twist đầu | Hình ảnh / scenario | *"Câu này khác!"* — ngẩng đầu lên khỏi auto-mode |
| Q4 | Confidence peak | Thực hành (áp dụng Q3) | *"Mình làm được mà!"* — reward rõ ràng |
| Q5 | Thử thách thực sự | Thực hành nặng nhất | *"Khó... nhưng handle được"* — cognitive friction có kiểm soát |
| Q6 | Aha Moment | Scenario (giải thích Q5) | *"À, tại sao Q5 lại khó"* — insight được thiết kế có chủ ý |
| Q7 | Lấy lại đà | Scenario vai trò | *"Mình đang học để làm điều này"* — identity formation |
| Q8 | Về đích | Câu synthesis | *"Mình nhớ hết rồi!"* — kết nối toàn session |

**Nguyên tắc sắp xếp:**
- Không xếp 2 câu drag-heavy liên tiếp (tay mỏi, não mỏi)
- Câu nặng lý thuyết đặt ở Q3 hoặc Q6, không phải Q1 hoặc Q8
- Xen kẽ visual và text để mắt không đơn điệu

---

### 13.4 Warm-up Question — Tiêu chuẩn câu đầu tiên

Câu Q1 không phải để test — mục đích là **calibrate confidence**, đưa não từ "chế độ offline" sang "chế độ QC".

**Tiêu chuẩn:**
- Nội dung từ bài đã học **ít nhất 3 ngày trước** (memory recall nhẹ)
- **MCQ 2 lựa chọn** — cognitive load tối thiểu
- Dạng definition: "Cái này là gì?" thay vì "Điều gì xảy ra nếu...?"
- Thời gian trả lời trung bình < 8 giây
- Không có đáp án đánh lừa

**Visual phân biệt:** Card warm-up dùng border màu xanh nhạt thay vì trắng — signal ngầm "đây là khởi động". Bugsy đứng tư thế "ready to start!".

**Nếu sai warm-up (hiếm):** Không trừ streak, không hiện big red X — chỉ giải thích nhẹ và tiếp tục.

---

### 13.5 Câu hỏi có hình ảnh minh họa — 5 loại phù hợp nhất

| Loại hình ảnh | Dùng cho | Tương tác trên mobile |
|---|---|---|
| **Screenshot UI có defect** | Bug Detective | Render trong "frame device" thật; pinch-to-zoom; tap vùng → khoanh vùng nghi ngờ; reveal sau submit |
| **Ma trận Severity × Priority** | Bug Detective, Mindset | Heatmap grid: xanh = coverage, đỏ = thiếu, vàng = đang hỏi; tap ô → expand modal |
| **EP/BVA Diagram** | Test Architect | Trục số với partition boundaries; animation "điện chạy qua dây" khi chọn đúng path |
| **Bug Report Form có lỗi** | Bug Detective | Sticky note kỹ thuật số; tap field để highlight; Bugsy chỉ tay vào field cần chú ý |
| **Sprint Board / Kanban** | Agile Tester | Pan bằng swipe; tap card → tooltip chi tiết; Bugsy ngồi trên header canh gác |

**UX chi tiết cho câu có hình ảnh:**
- Ảnh chiếm **60% màn hình**, đáp án ẩn dưới fold (phải scroll)
- Hotspot nhấp nháy (như Google Maps Street View) → tap → tooltip gợi ý (không cho đáp án)
- Sau khi submit: "Reveal Mode" — overlay xanh (phần đúng) / đỏ nhạt (phần bỏ sót); tap từng vùng đỏ để đọc giải thích

---

### 13.6 Câu hỏi có bẫy — Distractor tinh tế

Fresher hay bị lừa bởi 3 kiểu bẫy:
1. Hai đáp án trông gần giống nhưng khác nghĩa tinh tế
2. Đáp án "đúng lý thuyết nhưng sai ngữ cảnh"
3. Câu dùng từ phủ định ("KHÔNG phải", "NGOẠI TRỪ")

**Ví dụ bẫy 1 — Severity vs Priority:**

> *Bug sau được phân loại thế nào? "Nút 'Thanh toán' bị lỗi hoàn toàn, nhưng PM xác nhận sẽ có hotfix ngay sau launch."*
>
> A. Severity: High / Priority: High
> B. Severity: High / Priority: Medium
> C. Severity: Critical / Priority: High
> **D. Severity: Critical / Priority: Low** ✓

*Bẫy:* Fresher chọn A hoặc C vì không hiểu Priority là **quyết định business**, không phải kỹ thuật. (ISTQB FL 5.5.1)

**Ví dụ bẫy 2 — Testing shows presence, not absence:**

> *Developer: "Tôi đã test hết function trong module. Không thấy bug nào. Module an toàn để release." Nhận định ĐÚNG nhất?*
>
> A. Developer đúng — đã test toàn bộ function là đủ
> B. Cần thêm integration test vì unit test không đủ
> C. Testing chứng minh sự hiện diện của bug, không phải sự vắng mặt — không thể kết luận "an toàn"
> **D. B và C đều đúng** ✓

*Bẫy:* Fresher chọn C (nghe "có vẻ ISTQB") nhưng bỏ sót B. Đáp án D kiểm tra khả năng **tổng hợp**, không chỉ nhận diện. (ISTQB FL Principle #1)

---

### 13.7 Format tóm tắt cuối bài — "3-2-1 Summary"

Sau khi hoàn thành tất cả câu hỏi, màn tóm tắt xuất hiện với format cố định:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 3 ĐIỀU CẦN NHỚ
  • [Rule / Principle ngắn gọn]
  • [Rule / Principle ngắn gọn]
  • [Rule / Principle ngắn gọn]

⚠️ 2 LỖI PHỔ BIẾN
  • Fresher hay nhầm: [X vs Y]
  • Dễ bị bẫy: [tình huống Z]

✅ 1 ĐỐI CHIẾU THỰC TẾ
  • "Trong dự án thực, điều này có nghĩa là..."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Giới hạn:** Tối đa **5 bullet tổng cộng** — quá 5 là cognitive overload.

**Visual design:** Trình bày như "trading card" hoặc "Bugsy's Cheat Sheet" — có thể screenshot và share. Title kết quả thay cho điểm số khô khan:

| Kết quả | Title |
|---|---|
| 10/10 | Bug Whisperer |
| 8–9/10 | Defect Detective |
| 6–7/10 | QC Apprentice |
| < 6/10 | Bug Magnet (còn đang học!) |

---

### 13.8 Micro-animations giữa các câu hỏi

| Tình huống | Animation | Bugsy |
|---|---|---|
| **Đúng → câu tiếp** | Card bay sang trái; card mới slide cong vào (bouncy) | Giơ tay tương ứng: sách = lý thuyết; kính lúp = thực hành |
| **Sai → câu tiếp** | Card rung → vết nứt xuất hiện → "vỡ tan thành pixel" → card mới build lại từ đó | Ngồi xuống đồng hành, chỉ vào explanation — không tỏ vẻ thất vọng |
| **Câu cuối → Summary** | Grid nhỏ "nhìn lại hành trình" → thu thành ngôi sao bay vào XP counter → Summary card nở hoa từ trung tâm | Nhảy lên, xoay tròn, đáp xuống ngồi khoanh chân đọc cuộn giấy tóm tắt |

---

### 13.9 Rescue Mechanic — Khi sai 3 lần liên tiếp

**Sai lần 1:** Feedback nhẹ, giải thích ngắn, Bugsy hơi cụp tai.
**Sai lần 2:** Tone thay đổi — từ "Đáp án đúng là..." sang "Phần này nhiều người hay nhầm vì..." (ngôn ngữ cộng đồng, không phán xét).
**Sai lần 3:** Kích hoạt Rescue Mechanic — Bugsy ngồi xuống, nói:

> *"Phần này không dễ đâu. Mình cũng bị hỏi câu này lúc mới học."*

Người dùng chọn 1 trong 3:

| Lựa chọn | Cơ chế | Chi phí |
|---|---|---|
| **Xem gợi ý nhỏ** | Loại bỏ 1 đáp án sai; người dùng vẫn phải suy nghĩ | Mất 5 XP |
| **Đọc lại lý thuyết** | Mini-card mở ngay trong màn; không thoát câu hỏi; thử lại sau khi đọc | Không mất XP |
| **Bỏ qua câu này** | Câu đó được đánh dấu, tự động quay lại ở session sau | Không mất gì |

**Không được làm:** Popup đỏ "SAI RỒI!!!"; ẩn nút bỏ qua khi người dùng cần nó nhất.

---

### 13.10 Session Incomplete — Đóng app giữa chừng

**Auto-save:** Real-time, mỗi câu trả lời. Nếu crash, mở lại đúng trạng thái.

**Màn "Chào mừng trở lại"** (khi quay lại trong 24h):
- Bugsy ngồi cầm sách, nói: *"À, bạn về rồi! Hôm nay làm được 4 câu rồi đó."*
- Progress bar hiển thị: `████████░░░░░░░░  4/8 câu`
- CTA chính (lớn, nổi bật): **"Tiếp tục từ câu 5"**
- CTA phụ (nhỏ, không cạnh tranh): "Làm lại từ đầu"

**Nếu > 24h mới quay lại:**
> *"Bạn muốn tiếp tục từ câu 5 hay bắt đầu lại? Hơi lâu rồi, não có thể cần 'khởi động lại' một chút."*
Vẫn là lựa chọn của người dùng — app thành thật về giới hạn bộ nhớ ngắn hạn.
