---
title: "QC Pet — Tài liệu Yêu cầu Sản phẩm (PRD)"
status: final
created: 2026-06-12
updated: 2026-06-12
project: qc-pet
source_brief: "_bmad-output/planning-artifacts/briefs/brief-qc-pet-2026-06-12/brief.md"
source_spec: "_bmad-output/specs/spec-qc-pet/SPEC.md"
---

# QC Pet — Tài liệu Yêu cầu Sản phẩm (PRD)

## 1. Vấn đề

Junior tester đã đi làm biết cách thực hiện công việc — nhưng không có tín hiệu nào cho biết họ có đang tiến bộ không. Thị trường EdTech bán nội dung: video, PDF, khóa học trả lời câu hỏi "tôi cần biết gì?" — nhưng để người học mắc kẹt trong **Sương mù Năng lực (Competence Fog)**: làm cùng một công việc mỗi ngày mà không có bằng chứng nào về sự tăng trưởng.

Những hành vi sai vẫn tồn tại không được sửa:
- Test case chỉ là luồng click UI happy-path, không có assertion nào về business outcome
- Bug report mô tả triệu chứng hiển thị mà không phân biệt đúng severity/priority
- Họp planning ước tính công việc ngay sau khi đọc requirement, không ai hỏi "boundary condition của 'done' là gì?"
- Nói chuyện với Dev về lỗi: mô tả màn hình hiển thị gì, không mô tả business impact

Các công cụ hiện tại (luyện thi ISTQB, khóa học online, cộng đồng QC Vietnam) bán kiến thức. Không ai bán sự cải thiện đo được trong bối cảnh công việc thực tế hàng ngày. Không sản phẩm nào hiện đang chiếm trục **"tốt hơn hôm qua."**

Vấn đề thứ hai: một số junior tester làm việc trong môi trường không khuyến khích raise bug thật — văn hóa team, seniority gatekeeping, hoặc giai đoạn dự án. Giải pháp cần có path khả thi cho nhóm này.

---

## 2. Tầm nhìn Sản phẩm

**QC Pet** là ứng dụng mobile-first (iOS + Android) kết hợp chăm sóc thú cưng ảo kiểu Tamagotchi với thực hành kỹ năng QC/Testing hàng ngày.

Người dùng nhận nuôi Bugsy — một con bug vừa thoát khỏi production server — và giữ Bugsy khỏe mạnh, hạnh phúc bằng cách hoàn thành các mission học kỹ năng testing hàng ngày. Trạng thái của Bugsy phản chiếu việc thực hành của người dùng: pet bị bỏ bê phản chiếu thói quen bị bỏ bê; pet phát triển phản chiếu việc áp dụng nhất quán trong công việc thực.

Sự khác biệt của sản phẩm không phải là một định dạng học mới. Đây là **công cụ đầu tiên trả lời câu hỏi mà junior tester thực sự mất ngủ: "Tôi test như vậy có đúng không?"** — được trả lời không qua điểm quiz, mà qua hành trình của một con pet chỉ có thể evolve khi người dùng áp dụng kỹ năng trong công việc thực.

**Triết lý thiết kế:** App là giàn giáo. Mục tiêu là tự gỡ bỏ nó. Sau 90 ngày, nếu người dùng vẫn cần mở app để nhớ cách đặt câu hỏi đúng trong planning meeting — sản phẩm đã thất bại. Mọi cơ chế phải có ngày hết hạn: cơ chế trở nên không cần thiết khi hành vi nó đang luyện tập đã được internalize.

**Tagline:** *"Pet bạn đói. Đi tìm bug đi."*

---

## 3. Người dùng Mục tiêu

### 3.1 Người dùng Chính — Thuỳ

**Là ai:** Junior tester, 1–3 năm kinh nghiệm, đang làm việc tại công ty phần mềm ở Việt Nam (Hà Nội hoặc TP.HCM). Dùng Jira hàng ngày. Làm trong Scrum team.

**Thuỳ làm được gì:** Chạy regression suite, viết test case từ requirement, log bug vào tracker.

**Thuỳ không biết được điều gì:** Liệu bug report của mình có tốt không, liệu test case của mình có đang cover đúng chỗ không. Team lead không nói cô ấy sai. Cũng chưa ai nói cô ấy đúng. Cô ấy không có gương.

**Pain cụ thể của cô ấy:** Trong sprint review vừa rồi, một bug lọt ra production. Tester từ team khác tìm ra trong 10 phút. Thuỳ là người viết test case đã bỏ lỡ nó. Cô ấy không biết mình bỏ lỡ vì thiếu kỹ năng hay vì cấu trúc test case có vấn đề.

**Thuỳ muốn gì từ QC Pet:** Không phải "thêm nội dung để học." Cô ấy đã xem YouTube tutorials. Cô ấy muốn biết **mình có đang tiến bộ không** — bằng chứng rằng những việc cô ấy làm hàng ngày tại công ty đang tốt hơn.

### 3.2 Người dùng Phụ — Minh

**Là ai:** Junior tester, cũng 1–3 năm kinh nghiệm, làm tại công ty nơi vai trò QC chủ yếu là sign-off, không phải exploratory testing. Minh không được phép raise bug đối với tính năng do senior developer sở hữu. Bug anh ấy tìm ra đôi khi bị chuyển hướng mà không được log.

**Hạn chế của anh ấy:** Weekly Bug Log và Transfer Gate cảm giác không thể đạt được vì không có bug thực để submit. Con đường tiêu chuẩn bị chặn bởi môi trường, không phải bởi kỹ năng.

**Minh cần gì từ QC Pet:** Một path thay thế — Simulated Bug Hunt — cho anh ấy XP, pet care credit, và cảm giác áp dụng kỹ năng giống hệt, ngay cả khi môi trường làm cho phiên bản thật không thể tiếp cận.

### 3.3 Ngoài phạm vi người dùng

- Senior tester (5+ năm, vượt quá cấp độ QA Lead)
- Người học QC lần đầu chưa có kinh nghiệm đi làm
- Team manager hoặc QA lead quản lý đội nhóm
- Thị trường ngoài Việt Nam (v1 tập trung Vietnam-first)

---

## 4. Hành trình Người dùng

### UJ-1 — Tuần đầu của Thuỳ

**Thứ Hai (Ngày 1):** Thuỳ tải app sau khi thấy nhắc đến trong group QC Vietnam Facebook. Màn hình tối, tiếng gõ phím mờ nhạt, một quả trứng đang run rẩy. Cô ấy chạm vào mà không cần hướng dẫn. Bugsy chui ra. Cô ấy đặt tên cho pet. Cô ấy hoàn thành một kịch bản bug report và nhận Story-Rule Feedback — nó chạm đúng chỗ đau, cô ấy đã viết một report y chang như vậy tuần trước. Cô ấy thấy thanh Hunger của Bugsy đầy lên. Cô ấy được hỏi giờ online trước khi được hỏi xin quyền thông báo. Đến lúc màn hình sign-up hiện ra, cô ấy lưu pet theo tên — không phải vì gặp tường chặn, mà vì cô ấy đã có cảm giác gắn bó.

**Thứ Ba (Ngày 2):** Cô ấy mở app buổi sáng. Bugsy hơi đói. Prompt đầu tiên là câu hỏi spaced-retrieval từ Ngày 1. Cô ấy trả lời đúng — điều đó làm cô ấy ngạc nhiên. Core Mission mất 6 phút. Cô ấy làm thêm Side Quest (Bug Hunt) để fill thanh Happiness của Bugsy.

**Tại công ty (Thứ Ba):** Trong planning meeting, ai đó hỏi về test estimate. Trước khi trả lời, cô ấy nhận ra mình sắp hỏi "boundary condition của 'done' là gì?" — và cô ấy đã hỏi thật. Cô ấy ghi chú lại trong đầu.

**Thứ Sáu:** Cô ấy submit Weekly Bug Log đầu tiên — hai câu về một tình huống nhầm lẫn Priority/Severity cô ấy chứng kiến trên một ticket thật. Bugsy ăn nó.

**Chủ Nhật (cuối Sprint 1):** Sprint Demo Card xuất hiện. Một hình ảnh có thể chia sẻ tóm tắt 7 ngày sprint. Cô ấy chụp màn hình lại.

### UJ-2 — Path thay thế của Minh

**Thứ Hai:** Minh mở app. Anh hoàn thành Core Mission. Slide-up Weekly Bug Log xuất hiện. Anh chọn *"Tôi chưa được test thật."* App mở Simulated Bug Hunt mà không phán xét. Anh phân tích một kịch bản screenshot thực tế. Pet được feed giống hệt như submit bug log thật — không có sự khác biệt XP, không có mặt Bugsy thất vọng.

**Sau 4 tuần:** Transfer Gate prompt xuất hiện. Anh không thể submit test case thật từ công việc. Anh submit screenshot của một test case anh viết trong Simulated Bug Hunt, kèm ghi chú về môi trường của mình. App chấp nhận mà không chấm điểm. Bugsy evolve.

---

## 5. Tính năng & Yêu cầu

### F1 — Hệ thống Pet

Pet là ẩn dụ trung tâm. Mọi cơ chế phải củng cố mối liên hệ giữa việc học trong app và thay đổi hành vi trong công việc thực.

| ID | Yêu cầu |
|---|---|
| FR-1.1 | Pet (Bugsy) sống trong một văn phòng ảo. Văn phòng được duy trì liên tục, hiển thị ngay khi mở app, và phản chiếu trạng thái thanh nhu cầu của Bugsy qua các idle animation. |
| FR-1.2 | Bốn thanh nhu cầu — Hunger, Happiness, Health, Discipline — giảm theo thời gian thực, kể cả khi app đóng. Tốc độ giảm được xác định bởi game-balance parameters (quyết định trong giai đoạn tuning). |
| FR-1.3 | Hunger giảm theo thời gian. Hoàn thành Core Mission fill Hunger đầy hoàn toàn. Tương tác quick-feed fill Hunger một phần. |
| FR-1.4 | Happiness giảm trong thời gian không hoạt động. Side Quest, tương tác Pet Care "Play", và quick-play fill Happiness. |
| FR-1.5 | Health giảm khi Hunger hoặc Happiness về 0. Hoàn thành bài Train (deep-dive) và phục hồi thanh thụ động khôi phục Health. |
| FR-1.6 | Discipline giảm khi người dùng miss nhiều ngày liên tiếp. Duy trì streak và sử dụng Sprint Hold đúng cách ngăn Discipline mất. |
| FR-1.7 | Pet **không bao giờ chết**. Nếu bị bỏ bê, Bugsy regress — buồn, uể oải, animation chậm — nhưng luôn phục hồi khi người dùng quay lại. Đây là hard brand constraint, không có ngoại lệ. |
| FR-1.8 | Bugsy có idle animation phù hợp với trạng thái thanh nhu cầu hiện tại. Tối thiểu 3 idle animation khác nhau cho mỗi trạng thái (vui, đói, buồn, mệt) phải ship khi launch. |
| FR-1.9 | Văn phòng tích lũy souvenir từ mỗi điểm đến du lịch sau mỗi sự kiện evolution. Souvenir chỉ kiếm được qua evolution — không thể mua. |
| FR-1.10 | Pet evolution tiến qua 5 phiên bản: v0.1 Baby Bug Hunter → v0.5 Junior Tester Pet → v1.0 Tester Pet → v2.0 Senior Tester Pet → v3.0 QA Lead Pet. Mỗi phiên bản mở khóa một điểm đến du lịch. |
| FR-1.11 | Evolution yêu cầu đạt ngưỡng Quality Points cho version đó **và** submit ít nhất một Transfer Gate task cho bước version đó. Chỉ đạt ngưỡng QP là không đủ. |
| FR-1.12 | Khi pet gần ngưỡng version, Bugsy hiển thị trạng thái "pending evolution" với tin nhắn: *"Mình sắp thay lông — nhưng mình cần bạn thử kỹ thuật này ở công việc thật trước."* |

### F2 — Vòng lặp Mission Hàng ngày

Mission loop là cơ chế tương tác và cung cấp kỹ năng chính. Không có màn hình chọn mode — độ dài session tự nhiên xuất hiện từ trạng thái thanh nhu cầu.

| ID | Yêu cầu |
|---|---|
| FR-2.1 | Khi mở app, người dùng thấy Bugsy trong văn phòng với tất cả 4 thanh nhu cầu hiển thị. Nếu thanh nào ở mức nguy cấp (≤ 20%), quick-care interaction được đưa lên trước. Nếu tất cả ổn, Daily Mission được highlight là hành động tiếp theo được gợi ý. |
| FR-2.2 | **Core Mission (Tier 1):** Một lesson từ một skill category cộng với 3–5 câu quiz có Story-Rule Feedback. Hoàn thành Core Mission fill Hunger đầy hoàn toàn và thưởng Bug Coins và Quality Points. Thời lượng mục tiêu: 5–10 phút. |
| FR-2.3 | Cấu trúc Story-Rule Feedback: câu trả lời sai (và tùy chọn câu đúng ngay lần đầu) nhận được một câu chuyện ngắn theo ngữ cảnh, sau đó là một câu Rule Landing rõ ràng. Cả story và rule đều bắt buộc trong mỗi feedback. |
| FR-2.4 | **Side Quest (Tier 2):** Tùy chọn, thưởng BC/QP. Ba loại bắt buộc khi launch: Bug Hunt (xác định lỗi trong screenshot/kịch bản), Peer Review (đánh giá sample test case), Repro Steps (viết lại bug report mơ hồ theo chuẩn). Side Quest fill Happiness. |
| FR-2.5 | **Pet Care (Tier 3):** Feed (hoàn thành Core Mission), Play (quiz không dùng hint), Train (lesson nâng cao/Deep Dive). Mỗi loại gắn trực tiếp với thanh nhu cầu tương ứng. |
| FR-2.6 | Tương tác quick-care (tap-to-feed, tap-to-play) luôn có sẵn. Chúng fill thanh một phần — đủ để ngăn regression — nhưng không thưởng đầy đủ như hoàn thành mission. Sự bất đối xứng này phải hiển thị rõ với người dùng. |
| FR-2.7 | Mỗi session kết thúc bằng **Cliffhanger**: lesson hiện tại đóng lại với một câu hỏi bỏ ngỏ, câu trả lời chỉ có trong session tiếp theo. |
| FR-2.8 | Mỗi session từ Ngày 2 trở đi mở đầu bằng một **câu hỏi spaced-retrieval** tham chiếu Rule Landing của session trước. Câu hỏi này hiển thị trước khi bất kỳ nội dung mới nào load và không ảnh hưởng đến điểm. |

### F3 — Cơ chế Skill Transfer

Đây là điểm khác biệt cốt lõi của sản phẩm. Chúng kết nối việc học trong app với thay đổi hành vi có thể quan sát được tại công việc thực.

| ID | Yêu cầu |
|---|---|
| FR-3.1 | **Transfer Gate:** Khi QP của người dùng đạt ngưỡng cho một version step, pet evolution bị gated bởi việc submit một Transfer Gate task. Người dùng submit văn bản hoặc ảnh làm bằng chứng đã áp dụng kỹ năng trong công việc thực. |
| FR-3.2 | Transfer Gate submission được lưu server-side. App không chấm điểm hay đánh giá nội dung submission. Hành động submit mở khóa evolution. |
| FR-3.3 | **Weekly Bug Log:** Mỗi thứ Hai, một slide-up (không chặn) mời người dùng log một bug hoặc quan sát testing từ công việc tuần trước. Prompt là slide-up card, không phải modal blocker. |
| FR-3.4 | Bất kỳ Weekly Bug Log submission nào — kể cả "tuần này không có bug" — đều được chấp nhận không phạt. Submit trống hoặc zero-bug trigger Zero-Bug Response Tree (FR-3.6). |
| FR-3.5 | Weekly Bug Log submission thành công được lưu server-side, thưởng Bug Coins, và trigger animation ngắn của Bugsy ("Bugsy ăn bug"). |
| FR-3.6 | **Zero-Bug Response Tree:** Bugsy hiển thị prompt không chặn: *"Tuần này bạn không log bug nào — chuyện gì xảy ra vậy?"* Ba path có thể chọn: (a) *"Tôi chưa được test thật"* → mở Simulated Bug Hunt; (b) *"Team không cho tôi access"* → micro-tip + mở Simulated Bug Hunt; (c) *"Sprint quá nhỏ, không có bug"* → chấp nhận không phạt, streak duy trì. |
| FR-3.7 | **Simulated Bug Hunt** thưởng XP, Bug Coins, và pet care credit giống hệt như Weekly Bug Log submission thật. Không được có sự khác biệt UX ở màn hình kết quả. |
| FR-3.8 | **Retrospective Loop:** Mỗi tuần một lần, Bugsy hỏi một prompt phản chiếu free-text: *"Tuần này bạn có gặp situation nào mà bạn nhớ đến QC Pet không? Bạn đã làm gì?"* Prompt là tùy chọn. Các entry được trả lời lưu server-side. |
| FR-3.9 | **My Journey View:** Người dùng có thể xem chronological view các Retrospective Loop entry của chính mình. View này có thể truy cập từ profile hoặc progress section. |

### F4 — Currency & Tiến trình

| ID | Yêu cầu |
|---|---|
| FR-4.1 | **Bug Coins (BC):** Currency ngắn hạn. Kiếm qua hoàn thành quiz, Bug Hunt, và daily streak. Giảm khi người dùng miss một ngày (số lượng giảm là quyết định game-balance tuning). Dùng để mua item trang trí pet (Phase 2) và mở khóa hint. |
| FR-4.2 | **Quality Points (QP):** Currency dài hạn. Kiếm qua tất cả loại mission với multipliers. **Không bao giờ giảm trong bất kỳ điều kiện nào.** Xác định Tester Level, gate pet evolution, và mở khóa Secret Bug Cases. |
| FR-4.3 | Cả hai currency đều hiển thị trên home screen mọi lúc. |
| FR-4.4 | QP multipliers: đúng ngay lần đầu, không dùng hint (×2 QP); tốc độ trả lời < 15 giây (+streak multiplier, có thể stack); streak 7 ngày vào ngày thứ 7 (×3 QP cho cả ngày hôm đó); Bug Severity Critical (100 QP base), Major (50 QP), Minor (20 QP); câu Deep Dive optional được trả lời (×1.5 QP); bonus Sprint Report (tỷ lệ với % hoàn thành 7 ngày). |
| FR-4.5 | **Sprint Hold ("Blocked Status"):** Token kiếm được để tạm dừng streak một ngày. Token được kiếm — không thể mua bằng bất kỳ currency nào. Cách kiếm: hoàn thành streak 7 ngày liên tiếp (+1 token), vượt milestone quiz với ≥ 80% (+1 token), bug report được community upvote (+1 token). |
| FR-4.6 | Quy tắc Sprint Hold: tối đa 2 token/tháng dương lịch (free tier), 10+ token/tháng (premium tier); token không roll over sang tháng tiếp theo; không thể dùng hai ngày liên tiếp. |
| FR-4.7 | Trước khi dùng Sprint Hold token, người dùng phải chọn lý do từ dropdown: Sức khỏe / OT–Release day / Cam kết gia đình / Deadline khác. Lý do được lưu server-side không cần xác minh. Hành động log tạo trách nhiệm giải trình. |
| FR-4.8 | **Hotfix Day:** Một ngày free-pass kiếm được mỗi tháng dương lịch. Pet tự hoàn thành mission của ngày hôm đó thay cho người dùng. Điều kiện mở khóa: hoàn thành ngưỡng mission nhất định trong tháng dương lịch (ngưỡng là quyết định game-balance tuning; phải cảm giác được kiếm, không phải tầm thường). Không tự động cấp; phải sử dụng trước cuối tháng. |

### F5 — Onboarding (Luồng Ngày 1)

Onboarding phải tạo ra Aha Moment — cảm giác nhận ra không thoải mái về một lỗi thực người dùng đã mắc — trước khi bất kỳ tường sign-up nào xuất hiện.

| ID | Yêu cầu |
|---|---|
| FR-5.1 | Ngày 1 mở đầu với màn hình tối, tiếng gõ phím mờ nhạt, và một quả trứng run rẩy. Không có form sign-up, không có dialog xin quyền, không có nút skip. Người dùng chạm vào trứng để bắt đầu. |
| FR-5.2 | Sau khi trứng nở, ba gợi ý tên hiển thị (Bugsy / Null / Mèo Prod) cộng với ô nhập free-text. Người dùng đặt tên cho pet trước khi bất kỳ nội dung nào load. |
| FR-5.3 | Một câu micro-bridge chuyển người dùng từ chế độ cảm xúc (pet dễ thương) sang chế độ phân tích (nhiệm vụ) trước khi kịch bản bug xuất hiện: *"Mình hơi... đói rồi đó bạn ơi. Mà mình chỉ ăn được bug thôi. Bạn có thể giúp mình tìm bug đầu tiên không?"* |
| FR-5.4 | Warm-up calibration đưa ra một bug report ngắn (2 dòng) để người dùng trả lời Pass/Fail. Tạo prior commitment trước Aha Moment. |
| FR-5.5 | **Aha Moment** đưa ra một bug report đầy đủ chứa Scenario B (Expected Result copy nguyên văn từ spec, không phải testable outcome) và Scenario D (Severity Critical, Priority Low, 2% user impact). Người dùng phân tích và trả lời. Không hiển thị verdict đúng/sai ngay lập tức. |
| FR-5.6 | **Story-Rule Feedback** theo sau Aha Moment: Bugsy kể câu chuyện ngữ cảnh về việc bug đến production như thế nào, sau đó đưa ra câu Rule Landing. Cả story và rule đều bắt buộc. |
| FR-5.7 | Màn hình reward hiển thị Bug Coins và QP animate tăng lên với animation Bugsy no bụng. Server phải đã commit kết quả quiz trước khi animation này bắt đầu. |
| FR-5.8 | Màn hình **Cliffhanger** theo sau reward: Bugsy đặt một câu hỏi bỏ ngỏ; Pet Mood ngày mai hiển thị dạng silhouette với "?". |
| FR-5.9 | Notification preference được thu thập sau Cliffhanger — không phải trước: *"Mình thường online lúc mấy giờ?"* → Buổi sáng / Buổi tối / Không cố định. OS notification permission dialog chỉ được trigger sau lựa chọn này. |
| FR-5.10 | **Sign-up gate** chỉ xuất hiện vào cuối Ngày 1. Prompt: *"Bạn muốn lưu [tên pet] lại không? Nếu không, ngày mai nó sẽ quên bạn."* CTA chính: "Lưu [tên pet] lại". Phụ (chữ nhỏ): "Xem [tên pet] có gì hôm nay" (tiếp tục khách). |
| FR-5.11 | **Edge case buổi tối muộn:** Nếu app được mở lần đầu tiên sau 22:00, luồng rút gọn: đặt tên pet (30 giây) + một câu True/False duy nhất. Bugsy xuất hiện buồn ngủ. Không có cảnh báo "Ngày 1 chưa hoàn thành." Người dùng rời đi cảm thấy đã làm được gì đó, không phải đã thất bại. |
| FR-5.12 | **Progressive disclosure:** Cơ chế game chỉ được giới thiệu khi lần đầu sử dụng — không có tutorial slides. Tooltip Bug Coins khi lần đầu nhận BC; tooltip QP khi lần đầu nhận QP; giải thích Sprint Hold khi lần đầu tap "Tôi bận hôm nay"; Sprint Demo Card tự động hiển thị cuối sprint 7 ngày đầu tiên. |

### F6 — Cơ chế Giữ chân

| ID | Yêu cầu |
|---|---|
| FR-6.1 | **Cliffhanger Hàng ngày:** Mỗi session kết thúc bằng một câu hỏi bỏ ngỏ chỉ có thể trả lời trong session tiếp theo. Áp dụng cho tất cả session sau Ngày 1. |
| FR-6.2 | **Sự đa dạng Pet Mood:** Bugsy hiển thị idle animation hoặc hoạt động khác nhau mỗi sáng khi mở app. Lặp lại chính xác cùng một animation hai lần mở liên tiếp là defect. |
| FR-6.3 | **Sprint Demo Card:** Cuối mỗi sprint 7 ngày, một Sprint Demo Card tự động được tạo ra. Nó tóm tắt sprint theo định dạng hình ảnh nổi bật, được tối ưu cho chia sẻ mạng xã hội (LinkedIn, Facebook). |
| FR-6.4 | Sprint Demo Card phải có thể chia sẻ qua OS share sheet dưới dạng hình ảnh trong vòng 48 giờ sau khi được tạo. |
| FR-6.5 | **Real Bug of the Week:** Mỗi tuần một lần, một case bug thực tế ẩn danh (được author nội bộ bởi QC practitioner) được đưa ra để người dùng phân tích. Content community-sourced nằm ngoài scope cho v1. |
| FR-6.6 | **Self-Efficacy Calibration:** Khi người dùng trả lời đúng ngay lần đầu không dùng hint, Bugsy đưa ra câu hỏi layer hai tham chiếu một edge case liên quan. Ví dụ: *"Bugsy biết bạn sẽ bắt được mà! Nhưng tester thường bỏ qua [edge case liên quan] — bạn có muốn xem không?"* Mục đích: ngăn người dùng tự tin thái quá rời khỏi nội dung dễ. |

### F7 — Giọng điệu & Ngôn ngữ

| ID | Yêu cầu |
|---|---|
| FR-7.1 | Pet tự xưng "mình" và gọi người dùng là "bạn" trong toàn bộ in-app strings, bao gồm cả notification. |
| FR-7.2 | Pet dùng tên được đặt (Bugsy, hoặc tên người dùng chọn) chỉ để nhấn mạnh cảm xúc — không phải đại từ mặc định trong mọi câu. |
| FR-7.3 | "Mày/tao" hoặc bất kỳ register thô tục/phản cảm tương đương nào không được xuất hiện trong bất kỳ string nào đã ship. Zero violation được phép. Đây là hard quality gate áp dụng trước mỗi content release. |
| FR-7.4 | Tất cả authored strings (lesson, quiz feedback, Bugsy dialogue, notification copy) phải qua voice review trước khi release. Tone mục tiêu: ấm áp, hóm hỉnh, hơi tự nhận thức — giọng của một tester đã trải qua nhiều thứ. |
| FR-7.5 | Tất cả notification copy dùng **framing hậu quả câu chuyện**: Bugsy kể câu chuyện về điều sẽ xảy ra; app không đe dọa hay tạo cảm giác xấu hổ cho người dùng. |

### F8 — Tính toàn vẹn Dữ liệu & Quản lý Trạng thái

| ID | Yêu cầu |
|---|---|
| FR-8.1 | Toàn bộ game state được lưu server-side: trạng thái pet, số dư QP/BC, lịch sử mission, log Sprint Hold, Weekly Bug Log entries, Transfer Gate submissions, và Retrospective Loop entries. |
| FR-8.2 | **Server-first commit:** Server phải hoàn thành và xác nhận việc lưu trữ trạng thái trước khi bất kỳ reward animation hoặc reward screen nào chạy trên client. Điều này được thực thi ở cấp độ API contract — client không render reward theo kiểu optimistic. |
| FR-8.3 | Năm kill-app corner case sau phải tạo ra resume state đúng với zero data loss trong integration testing: (1) kill khi đang nhập tên → quay lại màn hình name-entry, Bugsy: *"Bạn quay lại rồi! Bạn muốn đặt tên gì cho mình?"*; (2) kill sau submit quiz, trước reward animation → server đã commit, trigger full reward khi mở lại; (3) kill trong màn hình cliffhanger → về home với notification dot, Bugsy nhắc cliffhanger khi mở tiếp theo; (4) kill trước khi chọn notification preference → slide-up card khi mở tiếp theo, lặp tối đa 3 lần trong 3 ngày; (5) kill trước sign-up ở trạng thái guest → màn hình "Bugsy is waiting" với tone wistful, CTA chính "Lưu Bugsy lại." |
| FR-8.4 | Identity người dùng và toàn bộ lịch sử session có thể chuyển đổi thiết bị. Đăng nhập trên thiết bị mới phải khôi phục đầy đủ trạng thái. |

---

## 6. Yêu cầu Phi Chức năng

### Hiệu năng

| ID | Yêu cầu |
|---|---|
| NFR-1.1 | Khởi động app đến home screen (Bugsy hiển thị): ≤ 2 giây trên thiết bị Android tầm trung (2022 trở lên, ~3 GB RAM). |
| NFR-1.2 | Core Mission load (câu hỏi đầu tiên hiển thị sau khi tap "Bắt đầu"): ≤ 1.5 giây. |
| NFR-1.3 | Reward animation bắt đầu trong vòng 500ms sau khi server xác nhận. |

### Độ tin cậy

| ID | Yêu cầu |
|---|---|
| NFR-2.1 | Việc giảm thanh nhu cầu được tính đúng cho thời gian thực trôi qua kể cả khi app đóng. Giá trị thanh khi mở lại phải phản chiếu thời gian từ session cuối. |
| NFR-2.2 | Số lượng Sprint Hold token là source-of-truth server-side. Client không thể thay đổi số dư token mà không có server transaction được validate. |
| NFR-2.3 | Weekly Bug Log và Transfer Gate submission phải bền vững — gián đoạn mạng trong khi submit không được âm thầm mất entry. Cần cơ chế retry hoặc draft-save. |

### Nền tảng

| ID | Yêu cầu |
|---|---|
| NFR-3.1 | Nền tảng hỗ trợ khi launch: iOS (hai phiên bản major mới nhất) và Android (API level 26+, nhắm đến khoảng 90% thiết bị Android đang hoạt động tại Việt Nam). |
| NFR-3.2 | Responsive web nằm ngoài scope MVP. |

### Chất lượng Nội dung

| ID | Yêu cầu |
|---|---|
| NFR-4.1 | Mọi lesson phải có traceable source tag (chương ISTQB, tên domain, hoặc tham chiếu community consensus) trước khi publish. Nội dung không có tag bị chặn. |
| NFR-4.2 | Mọi lesson phải qua cross-domain peer review (reviewer từ domain QC khác tác giả) trước khi publish. |
| NFR-4.3 | Mọi lesson phải qua junior-tester usability test (2–3 người dùng target, đã đi làm) trước khi publish. Sự nhầm lẫn được xem là content gap, không phải lỗi của người dùng. |
| NFR-4.4 | Lesson được tag năm publish. Lesson cũ hơn 18 tháng không có review bị đánh dấu "cần review" trong CMS. Lesson category Tool Master được review hàng năm tối thiểu. |
| NFR-4.5 | Mọi câu quiz liên quan đến severity hoặc priority **phải kèm theo user-impact context** (ví dụ: "lỗi này ảnh hưởng 2% người dùng trên thiết bị cũ"). Severity không có context đào tạo sai instinct — đây là content authoring rule bắt buộc, vi phạm là publish blocker. |

---

## 7. Mô hình Kiếm tiền

Core gameplay loop (pet, daily mission, sprint cycle, progress tracking, Sprint Demo Card) luôn miễn phí. Premium chỉ gate chiều sâu và chiều rộng nội dung — **không bao giờ chặn gameplay path**. Gating là horizontal (trải nghiệm rộng hơn), không phải vertical (bước tiếp theo bị chặn).

| Tính năng | Miễn phí | Premium |
|---|---|---|
| Daily Core Mission | ✅ | ✅ |
| Pet evolution (đủ 5 phiên bản) | ✅ | ✅ |
| Sprint Hold token | 2 / tháng (kiếm được) | 10+ / tháng (kiếm được) |
| Bug library — foundational | ✅ | ✅ |
| Kịch bản nâng cao & case theo ngành | ❌ | ✅ |
| Interview-style challenge mode | ❌ | ✅ |
| Real Bug of the Week archive | 4 tuần gần nhất | Toàn bộ archive |

Sprint Hold token vẫn có thể kiếm được với tất cả người dùng bất kể tier. Premium tăng cap — không thay thế cơ chế kiếm.

---

## 8. Yêu cầu Nội dung

Khi launch MVP, các nội dung sau phải có sẵn:

- Tối thiểu **27 lesson** trên 5 skill category: Bug Detective ×8, Test Architect ×5, Mindset & Process ×4, Tool Master ×6, Agile Tester ×4
- Tối thiểu **một Weekly Challenge cho mỗi category** tích hợp với Weekly Bug Log
- Toàn bộ nội dung được author bởi QC/Tester practitioner (product owner) và peer-reviewed bởi senior QA từ domain khác trước khi publish
- Năm Universal Scenarios (A–E) được đại diện trong bộ nội dung; Scenario B và D là anchor của onboarding Ngày 1

**Launch với ít hơn 27 lesson là hard launch blocker.**

---

## 9. Chỉ số Thành công

| Chỉ số | Mục tiêu | Counter-metric |
|---|---|---|
| Day 7 Retention | ≥ 30% | Thời lượng session trung bình (retention cao với session rất ngắn = scroll thụ động, không phải học) |
| Day 1 Completion Rate (đến Cliffhanger) | ≥ 60% | Tỷ lệ drop-off tại Step 4 warm-up (nếu cao: kịch bản calibration có thể quá khó) |
| Tỷ lệ chuyển đổi sign-up từ "Lưu Bugsy" | ≥ 40% | Conversion theo cohort giờ trong ngày (edge case buổi tối muộn dự kiến thấp hơn) |
| Tỷ lệ submit Weekly Bug Log (user active Day 14+) | ≥ 50% | % dùng Simulated Bug Hunt vs submit thật (tỷ lệ cao = vấn đề environment-gap phổ biến) |
| Correct-on-Retry Rate | ≥ 60% (retry ≥ 24h sau lần đầu) | Breakdown theo category (thấp ở một category = content quality gap trong category đó) |
| Sprint Demo Card share/export rate | ≥ 10% DAU trong 48h sau khi tạo | Tỷ lệ tạo card vs share (tạo nhiều, share ít = vấn đề thiết kế card) |
| Applied Knowledge Declaration Rate | Trending upward tại session 14 và 30 | Absolute value tại session 7 (baseline; trend quan trọng hơn absolute value) |

**Tín hiệu định tính chính:** Ít nhất một người dùng trong cohort đầu, không được nhắc nhở, mô tả việc hỏi câu hỏi boundary-condition hoặc risk trong planning meeting thực và gán credit cho QC Pet.

**Mục tiêu thay đổi hành vi có thể quan sát (30 ngày)** — đây là định nghĩa rõ ràng nhất về "transfer thành công", quan sát được bởi team lead hoặc PM mà không cần người dùng tự báo cáo:

| Hành vi | Trước QC Pet | Sau 30 ngày |
|---|---|---|
| Viết test case | Click UI happy-path, không có assertion | Bao gồm boundary values; assert trên business outcomes |
| File bug report | Mô tả triệu chứng; severity = priority | Có precondition; severity/priority tách đúng; ghi reproduction rate cho bug intermittent |
| Trong planning meeting | Ước tính effort sau khi đọc requirement | Hỏi "Boundary condition của 'done' là gì?" và "Phần nào rủi ro nhất khi test?" trước khi ước tính |
| Nói chuyện với Dev về lỗi | Mô tả màn hình hiển thị gì | Mô tả business impact và user population bị ảnh hưởng |

**Scaffold Removal Test (90 ngày):** Team sản phẩm phải có thể trả lời "có" cho ít nhất một trong các điều sau. Nếu không điều nào đúng — cơ chế đang tạo ra engagement mà không có transfer:
1. Một người dùng, không được nhắc, mô tả việc áp dụng kỹ năng trong planning meeting hoặc review thực.
2. Dữ liệu Retrospective Loop cho thấy số entry "Tôi đã áp dụng điều này tại công việc" tăng dần theo người dùng theo thời gian.
3. Applied Knowledge Declaration Rate tại session 30 vượt qua session 7.

---

## 10. Phạm vi MVP

### Trong Scope

| Khu vực | Tóm tắt yêu cầu |
|---|---|
| Game core | Văn phòng ảo, 4 thanh nhu cầu (drain real-time, kể cả khi đóng app), idle animation theo trạng thái, pet evolution v0.1 → v3.0 |
| Nội dung | 27 lesson × 5 category + ≥ 1 Weekly Challenge/category |
| Mission loop | Daily Mission Loop đầy đủ: Core Mission (Tier 1) + Side Quest (Tier 2) + Pet Care (Tier 3) |
| Skill transfer | Transfer Gate + Weekly Bug Log + Retrospective Loop + Zero-Bug Response Tree + Simulated Bug Hunt |
| Spaced repetition | Câu hỏi retrieval khi mở session từ Ngày 2 trở đi |
| Currency | Dual currency (BC + QP) với tất cả multiplier theo §5 FR-4.4 |
| Sprint Hold | Token kiếm được, reason logging, 2/tháng free tier |
| Hotfix Day | Free-pass kiếm được, 1/tháng, gated bởi ngưỡng mission |
| Onboarding | Luồng Ngày 1 (5–7 phút), edge case buổi tối muộn (< 2 phút), 5 kill-app corner case xử lý đúng |
| State persistence | Server-first commit trước reward animation; tất cả 5 kill-app resumption đúng |
| Retention | Cliffhanger hàng ngày, Sprint Demo Card, Pet Mood variability, Real Bug of the Week |
| Monetization | Freemium split theo §7 |
| Voice | Register mình/bạn được thực thi trong tất cả shipped strings |
| Nền tảng | iOS + Android (quyết định kiến trúc defer sang technical design phase) |

### Phase 2 (Sau launch)

| Khu vực | Ghi chú |
|---|---|
| Customization shop | Wallpaper, item, outfit mua được bằng Bug Coins |
| Travel destination visuals | Backdrop animated chi tiết cho mỗi điểm đến evolution |
| Nhân vật phụ trong văn phòng | PM và Dev xuất hiện cameo trong văn phòng của Bugsy |
| Responsive web | Defer cho đến khi validate mobile post-launch |

### Ngoài Scope (v1 và xa hơn trừ khi được xem xét lại rõ ràng)

- Tích hợp Jira, TestRail, hoặc live project system
- Automated grading cho free-text content (Bug Log, Transfer Gate, Retrospective Loop)
- Cấp chứng chỉ hoặc accreditation chính thức
- Multiplayer hoặc real-time collaboration
- Nội dung cho senior tester (vượt cấp độ v3.0 QA Lead)
- Community-sourced Real Bug of the Week submissions
- Leaderboard so sánh người dùng với nhau

---

## 11. Hard Constraints

Các ràng buộc này không thể thương lượng và cần sign-off rõ ràng trước khi override.

1. **Pet không bao giờ chết.** Chỉ regression. Không có cơ chế nào được trigger abandonment qua punitive loss.
2. **Quality Points không bao giờ giảm.** Trong bất kỳ điều kiện nào. Permanently out of scope.
3. **Sprint Hold token không thể mua.** Chỉ kiếm được. Ngăn việc bỏ qua learning loop qua thanh toán.
4. **Mọi lesson phải có traceable source tag trước khi publish.** Nội dung không có tag bị chặn.
5. **Server-side commit trước bất kỳ reward animation nào.** Được thực thi ở cấp độ API contract.
6. **Transfer Gate yêu cầu submit real-world mỗi version step.** QP threshold một mình không đủ để mở khóa evolution.
7. **Không có leaderboard so sánh người dùng với nhau.** Cạnh tranh chỉ là người dùng với chính mình tuần trước.
8. **Tối thiểu 27 lesson khi launch.** Ship dưới ngưỡng này là hard launch blocker.
9. **Zero violation register "mày/tao" trong bất kỳ shipped string nào.** Voice gate áp dụng cho mọi content release.

---

## 12. Câu hỏi Mở

| ID | Câu hỏi | Owner | Quyết định / Trạng thái |
|---|---|---|---|
| OQ-1 | Weekly Bug Log zero-bug: v1 default hiện tại (chấp nhận yên lặng + Simulated Bug Hunt được cung cấp) có phải cách tiếp cận dài hạn đúng không, hay app nên chủ động coach về việc advocate cho test access? | Product | Defer post-launch. Default hiện tại: path (b) — chấp nhận yên lặng với Simulated Bug Hunt có sẵn. |
| OQ-2 | Ngưỡng mở khóa Hotfix Day: cần hoàn thành bao nhiêu mission trong tháng để kiếm được ngày free-pass? | Game Design | Defer sang game-balance tuning. Ràng buộc: phải cảm giác được kiếm, không phải tầm thường. |
| OQ-3 | Bug Coin drain hàng ngày khi miss ngày: số lượng nào vừa phạt vừa không làm nản lòng việc quay lại? | Game Design | Defer sang game-balance tuning. |
| OQ-4 | Transfer Gate evidence: honour-system (submission người dùng không được xác minh) là v1 default. Version tương lai có nên giới thiệu peer-review cho Transfer Gate submissions không? | Product | Ngoài scope v1. Xem xét lại trong post-launch retrospective. |

---

*Nguồn: [product brief](../../briefs/brief-qc-pet-2026-06-12/brief.md) · [SPEC.md](../../../specs/spec-qc-pet/SPEC.md) · [gameplay-systems.md](../../../specs/spec-qc-pet/gameplay-systems.md) · [onboarding-flow.md](../../../specs/spec-qc-pet/onboarding-flow.md) · [skill-transfer.md](../../../specs/spec-qc-pet/skill-transfer.md) · [content-architecture.md](../../../specs/spec-qc-pet/content-architecture.md)*
