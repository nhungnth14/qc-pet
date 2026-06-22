---
project_name: 'qc-pet'
user_name: 'Nhung'
date: '2026-06-14'
stage: 'pre-architecture'
sections_completed:
  - platform_constraints
  - architecture_constraints
  - performance_requirements
  - content_rules
  - design_system_rules
  - critical_product_logic
  - ux_constraints
note: 'Tech stack TBD — cập nhật sau khi architecture workflow hoàn thành'
sources:
  - '_bmad-output/planning-artifacts/prds/prd-qc-pet-2026-06-14/prd.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/DESIGN.md'
  - '_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/EXPERIENCE.md'
---

# Project Context for AI Agents — QC Pet

_File này chứa các ràng buộc và quy tắc quan trọng mà mọi AI agent phải nắm vững trước khi ra bất kỳ quyết định implementation nào cho dự án QC Pet._

---

## Technology Stack

> ⚠️ **TBD** — Sẽ điền sau khi `architecture.md` hoàn thành.
>
> Hint từ EXPERIENCE.md: "Tech delivery format: HTML/CSS/JS per screen (Stitch export) → **React Native** component mapping (Phase 2 dev)."
>
> Cập nhật section này sau khi `/bmad-create-architecture` hoàn thành.

```
Frontend:  [TBD — React Native strongly implied]
Backend:   [TBD]
Database:  [TBD]
State:     [TBD]
```

---

## Critical Implementation Rules

### Platform Constraints

- **Target:** iOS và Android mobile. **Không có web trong v1.**
- **Orientation:** Portrait-only. **Không support landscape trong MVP.**
- **Form factor:** Smartphone (375–430px wide). Tablet **không** phải target v1.
- **Dark mode:** Chưa hỗ trợ trong MVP. `darkMode: "class"` có thể config trong Tailwind nhưng class `dark` **không được apply.** Dark mode cần Phase 2.
- **Language tag:** `lang="vi"` trên toàn bộ HTML/screens.

### Architecture Constraints

- **Server-side state là bắt buộc.** Toàn bộ game state (pet state, QP/BC, mission history, Transfer Gate submissions, Spaced Repetition history, Sprint Hold log, Weekly Bug Log, Retrospective entries) **phải lưu server-side** — không phải client-only.
- **Server commit TRƯỚC animation.** Server-side state **phải commit thành công** trước khi client trigger bất kỳ animation reward nào (BC earn, QP earn, evolution, achievement). Đây là hard constraint không được vi phạm.
- **Online-first + Last Known State.** App yêu cầu kết nối để commit state. Khi offline: render Bugsy ở last known state, disable Pet Care và Core Mission (grayed out, không phải hidden), Need Bars **không decay** khi offline (decay chỉ tính từ server timestamp lần sync cuối).
- **Need Bar decay tính từ server time**, không phải client time.
- **QP counter không thể bị manipulate client-side** — tính từ server.
- **Content delivery:** Server-driven JSON, versioned cache, batch update 4–6 tuần/lần.
- **Auto-save:** Mỗi câu quiz trả lời phải auto-save ngay — không batch-save cuối session.

### Performance Requirements (Hard Limits)

| Metric | Limit | Ghi chú |
|--------|-------|---------|
| App cold launch | < 3 giây | Trên thiết bị entry-level 2022+ |
| Idle animation | ≥ 30fps | Không drop frame trên target device |
| Need Bar update latency | < 1 giây | Sau khi mở app, fetch từ server |
| Quiz next question load | < 500ms | Sau khi submit câu |
| Core Mission total time | ≤ 10 phút | Nếu consistently > 10 phút → product bug |
| Daily loop minimum | 5–8 phút | Chỉ Core Mission, không Side Quest |

### Content & Language Rules

- **Tất cả UI copy:** Tiếng Việt. ISTQB terms giữ nguyên tiếng Anh nhưng **luôn kèm giải thích tiếng Việt** trong context.
- **Register bắt buộc:** `mình/bạn` xuyên suốt toàn app. Bugsy tự xưng trong câu nhấn. **Tuyệt đối không dùng "mày/tao"** hay register tương đương ở bất kỳ shipped string nào.
- **Không có AI-generated content.** Tất cả lesson content, bug scenarios, Story-Rule Feedback, và "Real Bug of the Week" đều phải được author bởi người thật.
- **Source tag bắt buộc:** Mọi lesson **phải có** source tag = ISTQB chapter number hoặc `"INDUSTRY_PRACTICE"`. Lesson thiếu source tag → **blocked, không được publish.**
- **27 lessons phải có đủ** trước khi launch. Thiếu → blocked.
- **Không có leaderboard.** Không có ranking hay so sánh user với user khác. Personal Best chỉ so với bản thân tuần trước.

### Design System Rules

- **Custom components only.** Không dùng MUI, Chakra, hay bất kỳ component library nào — tất cả component tự build theo DESIGN.md spec.
- **CSS framework:** Tailwind CSS v3.
- **Color system:** Material Design 3 color roles (xem `DESIGN.md §Colors`).
- **Fonts:** Nunito Sans (UI) + JetBrains Mono (code/terminal context only). **Không dùng font khác.**
- **Minimum font weight:** 600 (SemiBold) trong mọi UI text. **Không dùng weight < 600.**
- **Shadow:** Blocky flat shadow (`box-shadow: 0px 6px 0px 0px rgba(0,26,65,1)`). **Không dùng Gaussian blur / drop-shadow mờ.**
- **Border radius tối thiểu:** `rounded-xl` (12px) trên mọi card và container. **Không có góc vuông.**
- **Card style:** `border: 3px solid #001a41` + `box-shadow: 0px 6px 0px 0px rgba(0,26,65,1)` là standard tactile-card.
- **Currency colors:** `bc-amber` (#FFB000) cho Bug Coins, `qp-teal` (#00A8A8) cho Quality Points. **Không mix.**
- **Bugsy asset:** Luôn dùng `bugsy-transparent.png` (RGBA, nền trong suốt). **Không dùng Bugsy với white background trên nền màu.**
- **Confetti colors bất biến:** `#22b5ff`, `#fd9d89`, `#b59cff`, `#8ce68c`. Không thêm màu khác.
- **Dark panels** (`inverse-surface` #002e69): Chỉ dùng cho modal/overlay/story panel. **Không dùng làm app background.**
- **Terminal Green** (#8ce68c): Chỉ dùng trong code/terminal context. **Không dùng cho text thông thường.**

### Critical Product Logic (Never violate)

- **Pet không bao giờ chết.** Need Bars giảm đến 0% nhưng **không có "game over", không reset, không mất QP.** Chỉ regress về trạng thái visual buồn/mệt.
- **BC không về âm.** Floor = 0.
- **QP không bao giờ giảm** trong bất kỳ scenario nào (miss ngày, bar về 0, Rescue Mechanic, Sprint Hold).
- **Sprint Hold tokens không thể mua** bằng BC hay bất kỳ currency nào — chỉ earned qua hoàn thành missions.
- **Evolution cần cả hai điều kiện:** QP ≥ threshold VÀ Transfer Gate submitted. Chỉ một điều kiện → "evolution pending", không trigger animation.
- **Weekend Mode:** Thứ 7–CN, Need Bars **không decay** (theo timezone Việt Nam, UTC+7).
- **Onboarding sequence không thể skip hay reorder.** Sign-up Gate phải xuất hiện SAU Reward animation, không trước.
- **5 kill-app corner cases** phải produce correct resume state với zero data loss (xem PRD FR-29).
- **Confetti chỉ trigger khi trả lời ĐÚNG.** Không trigger khi sai.
- **Story-Rule animation luôn chạy sau câu sai** — không thể tắt.
- **Flash Quiz:** Không có hint button ở bất kỳ thời điểm nào. Không có Story-Rule panel.
- **Mirror Moment:** Không có text overlay — visual only. Không dismissable sớm (2.5s).
- **BC earn (Core Mission):** +10 BC. Missed day: -15 BC (grace period ngày đầu, cap 3 ngày miss liên tiếp).

### UX Constraints

- **Max navigation depth = 3.** Không có breadcrumb.
- **Touch targets ≥ 44×44px** cho mọi tappable element.
- **Không có universal bottom nav.** Mỗi phòng có room-specific action area riêng.
- **Swipe-to-dismiss trong mission quiz bị tắt** — tránh accidental exit. Chỉ có X button explicit.
- **Stacking panels:** Chỉ 1 slide-up panel mở tại 1 thời điểm. Đóng panel cũ trước khi mở mới.
- **Good Morning Moment:** Chỉ trigger **1 lần/ngày** — lần đầu mở app trong ngày. Không trigger lần 2.
- **Max 2 notifications/ngày:** Morning 8h00 + Evening 19h00 (gửi evening chỉ khi user chưa mở app trong ngày).
- **Apartment View:** Chỉ accessible sau khi ≥2 phòng unlocked.
- **Room transition:** Bugsy walk animation 0.8s — không phải cut scene, là overlay slide.
- **Không có back button trong quiz flow** — chỉ có X (exit).
- **Một Primary CTA per screen/panel.** Never hai primary buttons cùng level.

### Accessibility Floor (MVP Required)

- Tất cả tappable targets **≥ 44×44px**
- `aria-label` cho mọi icon-only button (Bottom Nav tabs)
- Focus trap khi slide-up panel mở; return focus khi đóng
- Input errors **không chỉ dùng màu** — phải kèm text hoặc border change
- `lang="vi"` trên tất cả HTML

---

## Room-to-Need Bar Mapping (Critical for game logic)

| Phòng | Need Bar | Decay rate | Fill bằng |
|-------|---------|------------|----------|
| 🏢 Work Room | Composite (tất cả) | ~24h fastest | Core Mission (fill tất cả hiệu quả nhất) |
| 🍳 Bếp | Hunger | ~48h | Bug Report / Quick Feed (+25%) |
| 🛋️ Khách | Happiness | ~72h | Side Quests / Quick Play (+20%) / Share Sprint Demo Card (+50%) |
| 🛏️ Ngủ | Health | ~72h | Spaced Repetition / Quick Train (+15%) |
| 🚿 Tắm | Discipline | ~48h | Flash Quiz (không hint) |
| 🌿 Sân | — | Không decay | Open space / Shop Phase 2 |

---

## Evolution Gates (Critical thresholds)

| Version | QP Threshold | Transfer Gate requirement |
|---------|-------------|--------------------------|
| v0.1 → v0.5 | 150 QP | Bug report thật được đồng nghiệp confirm (Bếp) |
| v0.5 → v1.0 | 400 QP | Test case thật từ sprint hiện tại (Work Room) |
| v1.0 → v2.0 | 900 QP | Sprint Demo Card đã share hoặc peer review log (Khách) |
| v2.0 → v3.0 | 1800 QP | Exploratory test session note + Retrospective tháng (Sân + Ngủ) |

---

## Out of Scope — MVP (Đừng implement)

- Customization Shop đầy đủ (wallpaper, items, outfits)
- Travel destination visuals chi tiết
- Visitor NPCs trong Work Room
- Sân Exploratory Testing Zone
- Social / pet visit features
- Movie Night weekly event
- Premium content tier
- Responsive web
- Certificate / accreditation
- Multiplayer
- Community-sourced content
- Dark mode
- Tablet layout
- Notification center trong app
- Settings / profile screen riêng

---

_Cập nhật lần cuối: 2026-06-14 — Nhung (qc-pet planning stage)_
_Tech Stack section sẽ được điền sau khi `_bmad-output/planning-artifacts/architecture.md` hoàn thành._
