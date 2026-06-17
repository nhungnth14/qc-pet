---
title: "QC Pet PRD — Source Reconciliation"
created: 2026-06-14
prd: prd-qc-pet-2026-06-14/prd.md
sources:
  - brief.md (brief-qc-pet-2026-06-12)
  - game-flow.md
  - SPEC.md
  - content-strategy.md
---

# QC Pet PRD — Source Reconciliation Report

> Mục đích: Liệt kê nội dung, ý định, hoặc yêu cầu có trong 4 source documents nhưng KHÔNG ĐƯỢC capture (hoặc capture không đầy đủ) trong PRD v2026-06-14. Những gì đã có trong addendum.md được ghi rõ và KHÔNG bị flag lại.

---

## GAP-01 — Mirror Moment trong Phòng Tắm (game-flow.md §3.🚿)

**Nguồn:** game-flow.md, mô tả Phòng Tắm:
> "Mirror moment: Sau khi xong, Bugsy nhìn vào gương. Discipline bar cao → Bugsy mặc outfit đẹp, tự tin. Discipline thấp → tóc tai bù xù, trông mệt mỏi. Visual feedback tức thì."

**PRD:** FR-12 mô tả Phòng Tắm gắn với Flash Quiz và Discipline bar. FR-1 mô tả idle behaviors nhưng không đề cập Mirror Moment là visual feedback riêng biệt sau khi hoàn thành Flash Quiz.

**Gap:** Mirror Moment là một **mechanic riêng** với semantic rõ ràng — Discipline phản chiếu ra ngoài hình thức của Bugsy. Đây không chỉ là idle behavior (FR-1) mà là feedback loop có chủ ý sau Flash Quiz. Hiện không có FR nào capture cơ chế này.

**Mức độ:** Trung bình. Ảnh hưởng đến UX Design và animation spec cho Phòng Tắm.

---

## GAP-02 — Streak Tracker nhỏ trong Phòng Tắm (game-flow.md §3.🚿)

**Nguồn:** game-flow.md:
> "Streak tracker nhỏ: Hiển thị số ngày liên tiếp đã làm flash quiz."

**PRD:** Sprint Hold (FR-31) có streak tracking logic server-side, nhưng không có FR nào mô tả một **streak display riêng trong Phòng Tắm** gắn với Flash Quiz completion.

**Gap:** Đây là UI element riêng biệt với ý nghĩa game design cụ thể: kỷ luật được đo bằng streak flash quiz, không phải streak toàn app. Cần FR hoặc ít nhất là note design.

**Mức độ:** Nhỏ-trung bình. Có thể xử lý trong UX phase, nhưng tốt hơn nếu được explicitly stated trong PRD.

---

## GAP-03 — Good Morning Moment — Ngôn ngữ Travel Destination (game-flow.md §3.🛏️)

**Nguồn:** game-flow.md, Phòng Ngủ:
> "Good morning moment: Lần đầu mở app buổi sáng, Bugsy vươn vai, nói 'chào buổi sáng' theo ngôn ngữ của travel destination đang hướng tới (tiếng Nhật, tiếng Pháp...)."

**PRD:** FR-1 (idle behaviors), FR-3 (evolution và travel destinations), FR-13 (room unlock). Không có FR nào mô tả Good Morning Moment là mechanic đặc biệt gắn với evolution stage.

**Gap:** Đây là mechanic có thiết kế rõ ràng — tạo liên kết cảm xúc giữa Bugsy's current evolution level và travel destination đang hướng tới, thể hiện qua ngôn ngữ greeting mỗi sáng. Cũng là cơ chế tạo anticipation cho evolution tiếp theo. Không được capture trong bất kỳ FR nào.

**Mức độ:** Trung bình. Ảnh hưởng trực tiếp đến content ops (danh sách phrases theo language/destination) và animation spec.

---

## GAP-04 — Daily Recap Bubble khi Bugsy ngủ (game-flow.md §3.🛏️)

**Nguồn:** game-flow.md:
> "Daily Recap Bubble: Khi Bugsy ngủ, thought bubble hiện tóm tắt hôm nay đã học gì — format cute, không phải report khô."

**PRD:** UJ-2 đề cập "Daily Recap Bubble" trong story path của Linh (tối, tắt đèn). Tuy nhiên không có FR nào define cơ chế này — nội dung gì xuất hiện, trigger condition, format, hay khác biệt với 3-2-1 Summary (FR-21).

**Gap:** Daily Recap Bubble và 3-2-1 Summary Card là hai cơ chế KHÁC NHAU. Summary Card sau mỗi quiz session (FR-21). Recap Bubble là tóm tắt toàn ngày khi Bugsy "ngủ" tối. Chỉ có UJ-2 mention trong story context — không có FR hoặc testable consequences.

**Mức độ:** Trung bình. Cần FR để distinguish rõ hai cơ chế và define trigger + format cho Recap Bubble.

---

## GAP-05 — Collectible Quote khi Bugsy ăn no (game-flow.md §3.🍳)

**Nguồn:** game-flow.md:
> "Collectible Quote: Khi Bugsy ăn no, hiện một testing wisdom quote ngẫu nhiên — có thể collect/share."

**PRD:** FR-12 mô tả Phòng Bếp với Quick Feed và Bug Report. Không có FR hay mention về Collectible Quote mechanic.

**Gap:** Collectible Quote là một micro-engagement mechanic riêng biệt — tạo delight moment và shareable content. Có hai chiều: (1) collection mechanic, (2) share action. Hoàn toàn absent khỏi PRD.

**Mức độ:** Nhỏ. Có thể là Phase 2, nhưng brief.md scope không explicitly defer nó. Nếu MVP, cần FR; nếu Phase 2, cần explicit deferral trong §6.2.

---

## GAP-06 — TV Channels trong Phòng Khách là mini-quiz theo topic (game-flow.md §3.🛋️)

**Nguồn:** game-flow.md:
> "TV Channels = Quiz: Bugsy xem TV, player chọn kênh. Mỗi kênh là một mini-quiz chủ đề QC."

**PRD:** FR-12 ghi "Phòng Khách: Side Quest, TV quiz, Sprint Demo Card share" nhưng chỉ là một bullet trong bảng. FR-10 (Side Quests) không mô tả TV quiz. Không có FR riêng cho TV Channel mechanic.

**Gap:** TV Channels là mechanic có cấu trúc riêng — channels map to topics, user selects channel, UI là TV interface. Đây không giống Side Quest (Bug Hunt / Peer Review / Repro Steps). Hiện chỉ được mention implicitly trong FR-12 table mà không có definition, trigger, hay testable consequences.

**Mức độ:** Trung bình. Nếu TV quiz là phần của Side Quest rotation (FR-10), cần nói rõ. Nếu là mechanic riêng, cần FR riêng.

---

## GAP-07 — Delight Tap Bugsy trên sofa (game-flow.md §3.🛋️)

**Nguồn:** game-flow.md:
> "Delight moment: Tap vào Bugsy đang ngồi trên sofa → Bugsy giật mình rồi cười. Không có tác dụng game — pure delight."

**PRD:** Không có mention nào. FR-1 (idle behaviors) không bao gồm interactive delight moments.

**Gap:** Nhỏ nhưng có ý nghĩa về product philosophy — "pure delight with no game effect" là design intent rõ ràng. Nếu không stated trong PRD, có thể bị team cut như "unnecessary." Cần ít nhất một note.

**Mức độ:** Nhỏ. Nhưng liên quan đến §Aesthetic & Tone section — có thể add dưới dạng design principle thay vì FR.

---

## GAP-08 — Hotfix Day mechanic (SPEC.md Constraints)

**Nguồn:** SPEC.md, Constraints:
> "Hotfix Day is earned (not automatically granted). Unlock condition: completing a defined number of missions within the calendar month. Automatic monthly grants are out of scope."

**PRD:** Sprint Hold (FR-31, §4.9) là cơ chế tạm dừng streak có trong PRD. Nhưng "Hotfix Day" được nêu trong SPEC.md như một cơ chế **khác biệt** với Sprint Hold — không phải đồng nghĩa.

**Gap:** SPEC constraint nói "Hotfix Day" với unlock condition dựa trên số missions trong tháng. FR-31 (Sprint Hold) định nghĩa Sprint Hold token earn bằng 20/28 missions/tháng. Có thể đây là cùng một cơ chế với tên khác, hoặc là hai cơ chế riêng. PRD không acknowledge sự tồn tại của "Hotfix Day" term hay resolve rõ relationship của nó với Sprint Hold.

**Mức độ:** Cao. Cần PM decision: là Sprint Hold = Hotfix Day (chỉ là naming)? Hay đây là hai cơ chế khác nhau? Nếu khác nhau, thiếu một FR hoàn toàn. Nếu cùng một, cần note trong §3 Glossary.

---

## GAP-09 — Real Bug of the Week content type (SPEC.md Constraints)

**Nguồn:** SPEC.md, Constraints:
> "Real Bug of the Week content is authored internally by a practitioner QC. Community submissions are out of scope until post-launch."

**PRD:** §5 Non-Goals có: "Không có community-sourced content (Real Bug of the Week) trong v1." §6.2 Out of Scope có "Community-sourced content — Post-launch." Nhưng không có FR hoặc definition nào mô tả "Real Bug of the Week" là một **content type tồn tại trong v1** (authored internally) — chỉ được nêu như "community version bị defer."

**Gap:** SPEC.md nói rõ đây là internally-authored content type với practitioner QC là author. Điều đó có nghĩa nó IS trong scope v1 — chỉ community submissions bị defer. PRD hoàn toàn không có FR hay mention về "Real Bug of the Week" như một in-scope content type trong v1.

**Mức độ:** Cao. Nếu Real Bug of the Week là v1 content type (chỉ internal authorship, không community), đây là missing content mechanic. Cần clarification từ PM và có thể cần FR.

---

## GAP-10 — 90-Day scaffold vision và "app tự gỡ bỏ chính mình" (brief.md + SPEC.md)

**Nguồn:** brief.md:
> "App is scaffolding; goal is to remove it (90 days user internalizes skills, no longer needs app)"

SPEC.md Why section:
> "After 90 days a user who still needs the app to remember how to ask the right question means the app failed."

**PRD:** §1 Vision có: "App tự gỡ bỏ chính mình là thành công thực sự." Nhưng không có **90-day explicit timeframe** hay metric liên quan đến "user no longer needs app."

**Gap:** "90 days" là concrete timeframe cho skill internalization. Không có SM nào measure "scaffold removal signal" — e.g., churn after Day 90 không phải metric negative, mà là positive signal. Counter-metrics (SM-C1, SM-C2) cover streak và lesson count, nhưng không có explicit statement rằng **churn sau 90 ngày = success signal**, khác với normal churn.

**Mức độ:** Trung bình. Ảnh hưởng đến cách đọc retention metrics. Nếu bị bỏ qua, analytics team sẽ lo lắng về D90 churn khi thực ra đó là thành công.

---

## GAP-11 — Content gap "Kỹ năng hỏi clarification trước estimate" không có trong PRD (content-strategy.md §11)

**Nguồn:** content-strategy.md, Gap Analysis:
> "Kỹ năng hỏi clarification trước khi estimate — Lớn — Thêm checklist 'câu hỏi phải hỏi' vào MP-3 hoặc AT-3"

addendum.md (A7): Đã ghi nhận gap này trong addendum.

**PRD:** FR-18 liệt kê 27 lessons nhưng không acknowledge rằng có một **large content gap** đã được xác định trong source analysis.

**Gap:** Addendum đã capture (A7), nên không phải PRD gap về content. Tuy nhiên, PRD §5 Non-Goals hoặc §9 Assumptions không có note nào về known content gaps sẽ address post-MVP. Nếu checklist được add vào MP-3/AT-3 trước launch, lesson count vẫn là 27 nhưng scope thay đổi. Nếu defer, cần explicit note.

**Mức độ:** Nhỏ (đã có trong addendum). Flag để PM confirm handling intention trong PRD.

---

## GAP-12 — Bloom's Taxonomy day-by-day arc không referenced trong PRD FR-22 (content-strategy.md §5)

**Nguồn:** content-strategy.md §5:
> Explicit 6-phase arc với day ranges: Foundation Day 1–5 (REMEMBER) → Understanding Day 6–10 → Application Day 11–15 → Analysis Day 16–20 → Evaluation Day 21–25 → Synthesis Day 26–30

**PRD:** FR-22 có: "Nội dung tăng độ khó theo arc 30 ngày: Foundation (Day 1–5) → Understanding → Application → Analysis → Evaluation → Synthesis (Day 26–30)." Các phase names và day ranges được capture. Testable consequences có Day 1–5 và Day 26–30.

**Gap:** FR-22 ĐÚNG nhưng THIẾU intermediate checkpoints — Day 6–10, 11–15, 16–20, 21–25 không có testable consequences riêng. Chỉ có endpoints được test. Nếu QA muốn verify arc at Day 15, không có concrete acceptance criterion.

**Mức độ:** Nhỏ. FR-22 đủ để start, nhưng intermediate phase testable consequences cần được add hoặc delegated đến test design phase.

---

## GAP-13 — Session time targets không explicitly stated (game-flow.md §2)

**Nguồn:** game-flow.md §2:
> "Hard minimum mỗi ngày: 5–8 phút (chỉ Core Mission ở Work Room) / Full experience: 15–20 phút/ngày (tất cả phòng)"

brief.md §JTBD: "Học trong những khoảng thời gian nhỏ (5–10 phút/ngày)"

**PRD:** §2.1 JTBD có "5–10 phút/ngày." UJ-2 Resolution có "Tổng thời gian: ~12–16 phút trong ngày." Không có NFR hay FR nào set **session time target** là acceptance criterion.

**Gap:** Session time là constraint thiết kế (không phải chỉ mô tả). Nếu Core Mission consistently takes 15+ phút, đó là a product bug. Nên là NFR với testable consequence: "Core Mission (lesson + 8 câu quiz) hoàn thành trong ≤ 10 phút khi measured on target device."

**Mức độ:** Trung bình. Không có session time NFR là missing testable constraint.

---

## GAP-14 — Warm-up Q1 visual distinction (content-strategy.md §13.4)

**Nguồn:** content-strategy.md §13.4:
> "Visual phân biệt: Card warm-up dùng border màu xanh nhạt thay vì trắng — signal ngầm 'đây là khởi động'. Bugsy đứng tư thế 'ready to start!'. Nếu sai warm-up (hiếm): Không trừ streak, không hiện big red X — chỉ giải thích nhẹ và tiếp tục."

**PRD:** FR-20 và FR-25 (Story-Rule Feedback) không mention visual distinction của warm-up card hoặc exception rule khi sai Q1.

**Gap:** Hai elements chưa captured: (1) Visual distinction cho Q1 warm-up card, (2) Exception rule — sai Q1 không trừ streak. Đây là design decisions có implication cho game balance và UX implementation.

**Mức độ:** Nhỏ. Có thể handle trong UX phase, nhưng "không trừ streak khi sai Q1" là rule cần captured somewhere để không bị implement incorrectly.

---

## GAP-15 — Day 7 Sân Unlock là Cinematic Moment (game-flow.md §6)

**Nguồn:** game-flow.md §6:
> "Bugsy dậy sớm hơn thường lệ. Chạy đến một cánh cửa player chưa bao giờ chú ý. Ánh sáng buổi sáng tràn vào khi cửa mở. Bugsy chạy ra ngoài, nằm trên cỏ, nhìn lên trời. Không có chữ. Chỉ là khoảnh khắc."

**PRD:** FR-13 có "7-day streak hoàn thành hoặc Week 1 complete — cinematic unlock" trong table. Nhưng không có mô tả về **ý đồ emotional** của cinematic này hay **"không có chữ"** design principle.

**Gap:** FR-13 capture trigger, không capture design intent. "Không có chữ. Chỉ là khoảnh khắc. Player hiểu: Bugsy đang nhìn về phía những chuyến đi sắp tới" là design intent cụ thể liên quan đến §Aesthetic & Tone. Có thể add vào FR-13 as design note hoặc §Aesthetic section.

**Mức độ:** Nhỏ. Qualitative — nhưng là loại intent dễ bị lost khi developers implement.

---

## Tóm tắt theo mức độ ưu tiên

### Cao (cần PM decision hoặc có thể affect scope)

| ID | Gap | Action cần thiết |
|---|---|---|
| GAP-08 | Hotfix Day vs Sprint Hold — là cùng một cơ chế hay khác nhau? | PM confirm + update Glossary hoặc add FR |
| GAP-09 | Real Bug of the Week là v1 content type (internal authoring) — absent khỏi PRD | PM confirm in-scope, add FR nếu có |

### Trung bình (ảnh hưởng UX, content ops, hoặc metrics)

| ID | Gap | Action cần thiết |
|---|---|---|
| GAP-01 | Mirror Moment — Phòng Tắm | Add FR hoặc design note trong FR-12 |
| GAP-03 | Good Morning Moment — ngôn ngữ travel destination | Add FR, gắn với FR-3 evolution stage |
| GAP-04 | Daily Recap Bubble — phân biệt với 3-2-1 Summary Card | Add FR, clarify scope và format |
| GAP-06 | TV Channels mechanic trong Phòng Khách | Clarify vs Side Quest (FR-10) hoặc add FR |
| GAP-10 | 90-day scaffold vision và churn-after-90 = success signal | Add counter-metric hoặc note trong §7 |
| GAP-13 | Session time không có NFR | Add NFR với testable time constraint |

### Nhỏ (có thể handle trong UX phase hoặc với design note)

| ID | Gap | Action cần thiết |
|---|---|---|
| GAP-02 | Streak tracker riêng trong Phòng Tắm | Add design note trong FR-12 |
| GAP-05 | Collectible Quote — Phòng Bếp | PM confirm: v1 hay defer? |
| GAP-07 | Delight tap Bugsy trên sofa | Add design principle trong §Aesthetic |
| GAP-11 | Content gap "clarification skills" (đã có trong addendum) | Confirm handling intent |
| GAP-12 | Bloom's Arc intermediate testable consequences | Delegate đến test design phase |
| GAP-14 | Warm-up Q1 visual distinction + sai Q1 không trừ streak | Add rule exception trong FR-20 |
| GAP-15 | Day 7 Sân unlock cinematic intent | Add design note trong FR-13 |

---

## Không được flag (đã có trong addendum)

- Boss Mission designs (A3) — addendum
- Side Quest detail examples (A2) — addendum
- Cliffhanger examples (A1) — addendum
- Mission scenario examples (A4) — addendum
- Weekly Challenges detail (A5) — addendum
- Top 10 backbone concepts (A6) — addendum
- Content gap analysis (A7) — addendum
- Micro-animation design detail (A8) — addendum
- 27 lesson individual titles — content ops (not PRD)

---

*Total gaps found: 15 (2 Cao, 6 Trung bình, 7 Nhỏ)*
