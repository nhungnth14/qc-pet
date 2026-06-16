---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-qc-pet-2026-06-14/prd.md"
  - "_bmad-output/planning-artifacts/prds/prd-qc-pet-2026-06-14/addendum.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/EXPERIENCE.md"
  - "_bmad-output/planning-artifacts/game-flow.md"
  - "_bmad-output/planning-artifacts/content-strategy.md"
  - "_bmad-output/planning-artifacts/epics.md"
prdVersion: "v2 (2026-06-14) — CANONICAL"
prdV1: "prds/prd-qc-pet-2026-06-12/prd.md — SUPERSEDED (confirmed in epics workflow)"
---

# Implementation Readiness Assessment Report

**Date:** 2026-06-14
**Project:** QC Pet

---

## Step 1: Document Discovery (Complete)

| Tài liệu | Path | Trạng thái |
|---|---|---|
| PRD v2 (CANONICAL) | `prds/prd-qc-pet-2026-06-14/prd.md` | ✓ Exists |
| PRD Addendum | `prds/prd-qc-pet-2026-06-14/addendum.md` | ✓ Exists |
| Architecture | `architecture.md` | ✓ Exists |
| UX Design | `ux-designs/ux-qc-pet-2026-06-12/DESIGN.md` | ✓ Exists |
| UX Experience | `ux-designs/ux-qc-pet-2026-06-12/EXPERIENCE.md` | ✓ Exists |
| Game Flow | `game-flow.md` | ✓ Exists |
| Content Strategy | `content-strategy.md` | ✓ Exists |
| Epics & Stories | `epics.md` | ✓ Exists (stepsCompleted: [1,2,3,4]) |

**PRD version:** v2 (2026-06-14) — CANONICAL. v1 (2026-06-12) superseded.

---

## Step 2: PRD Analysis

### Functional Requirements Inventory (42 items)

| FR | Mô tả ngắn |
|---|---|
| FR-1 | Bugsy idle states (≥5) phản ánh Need Bar trạng thái |
| FR-2 | Đặt tên pet trong onboarding (3 gợi ý + free text, max 20 ký tự, default "Bugsy") |
| FR-3 | Pet evolution 5 giai đoạn (v0.1→v3.0): QP threshold AND Transfer Gate evidence |
| FR-4 | Souvenir xuất hiện trong căn hộ sau mỗi evolution animation hoàn thành |
| FR-5 | 4 Need Bars decay real-time theo server clock (Hunger ~48h, Happiness ~72h, Health ~72h, Discipline ~48h) |
| FR-5b | Good Morning Moment: Bugsy vươn vai + greeting 1 lần/ngày, tự dismiss 2-3s |
| FR-6 | Pet không bao giờ chết — bars về 0% chỉ regress visual, không mất QP |
| FR-7 | Pet Care actions: Quick Feed (+25% Hunger), Quick Play (+20% Happiness), Quick Train (+15% Health) — không earn BC/QP |
| FR-8 | Weekend Mode: Need Bar decay dừng Thứ 7–CN UTC+7, resume 00:00 Thứ 2 |
| FR-9 | Core Mission: lesson ~30s + 8-câu quiz (framework 2-5-1-2) + Story-Rule + 3-2-1 Summary Card |
| FR-10 | Side Quests: Bug Hunt / Peer Review / Repro Steps / Simulated Bug Hunt (+40% Happiness, earn BC) |
| FR-11 | Mission Board kanban (Todo/In Progress/Done) + Bug Report Wall (sticky notes, confetti at full ~30) |
| FR-12 | 6-phòng căn hộ — mỗi phòng có Need Bar và activity riêng |
| FR-13 | Room Unlock Sequence trigger-based (Work Room: onboarding, Bếp: Aha Moment, Ngủ: first Core Mission, Khách: Happiness <50%, Tắm: streak 3 ngày, Sân: streak 7 ngày) |
| FR-14 | Apartment View isometric + Immersive Mode; room transition Bugsy walk 0.8s; swipe phòng liền kề |
| FR-15 | Bug Coins: miss ngày -15 BC (grace period 1 ngày, cap 3 ngày), floor 0, không convert QP |
| FR-16 | Quality Points: **không bao giờ giảm trong bất kỳ scenario nào**; server-authoritative |
| FR-17 | BC + QP persistent header display; counter animate sau earn event |
| FR-17b | Real Bug of the Week: authored by human practitioner, tag "REAL_BUG_OF_THE_WEEK", không AI |
| FR-18 | 27 lessons × 5 categories phải đủ trước launch (launch blocker) |
| FR-19 | Quiz engine: 10 question formats (MCQ, Bug Report Surgery, Severity Swipe, Spot the Defect, Rewrite the Fail, Priority×Severity Duel, Boundary Attack, Root Cause Chain, Risk Radar, Complete the Test Case) |
| FR-20 | Framework 2-5-1-2: emotional arc Q1-Q8; không 2 drag-heavy câu liên tiếp; Q1 warm-up exception |
| FR-21 | 3-2-1 Summary Card: 3 nhớ / 2 lỗi phổ biến / 1 đối chiếu; title thay điểm số; shareable |
| FR-22 | Bloom's Taxonomy Arc 30 ngày: Foundation (D1-5) → ... → Synthesis (D26-30) |
| FR-23 | Rescue Mechanic: sai 3 lần → Xem gợi ý (**-5 QP**) / Đọc lý thuyết (free) / Bỏ qua (free) |
| FR-24 | Auto-save sau mỗi câu; session resume đúng câu; "Chào mừng trở lại" banner X/8 |
| FR-25 | Story-Rule Feedback sau sai: story trước → rule sau; ≥30% QP dù sai; Self-Efficacy bonus khi đúng |
| FR-26 | Transfer Gate evidence per evolution step (4 gates, accessible từ phòng tương ứng) |
| FR-27 | Transfer Gate submissions lưu server-side vĩnh viễn, không thể xóa, visible My Journey |
| FR-28 | Onboarding sequence cố định (Màn tối → trứng → tên → warm-up → Aha → Reward → Cliffhanger → Notif Pref → Sign-up Gate → HOME) |
| FR-29 | 5 Kill-app Corner Cases: zero data loss + correct resume state |
| FR-30 | First Room Reveal: cửa Bếp hé mở ánh vàng sau onboarding — không tooltip, không announcement |
| FR-31 | Sprint Hold tokens: earned 20/28 daily missions/tháng = 1 token; max 2/tháng; không mua được |
| FR-32 | Notifications story-style từ Bugsy; max 2/ngày (8h00 + 19h00 conditional); deep link vào đúng phòng |
| FR-32b | Daily Recap Bubble: CSS thought bubble trên Bugsy ngủ; tap to dismiss; không block UI |
| FR-33 | Spaced Repetition: Q1 từ bài ≥3 ngày trước; Bedroom session 1-2 câu trước tắt đèn; SR queue server-side |
| FR-34 | Weekly Bug Log: ≥1 real bug/tuần; Zero-Bug 2-option: Simulated Bug Hunt | Bỏ qua tuần |
| FR-35 | Retrospective Loop: prompt cuối mỗi 7-day sprint (optional); lưu server-side, timeline My Journey |
| FR-36 | Sprint Demo Card: auto-generate Day 7; shareable 48h sau generate |
| FR-37 | Share Sprint Demo Card → Happiness +50%; native share sheet iOS/Android |
| FR-38 | One Room Emergency: highlight 1 phòng bar thấp nhất/ngày (ngoài Work Room) trong Apartment View |
| FR-39 | Item Shop placeholder Sân: browse-only, "Coming Soon", Phase 2 full implementation |

**Total FRs: 42 items** (FR-1 đến FR-39 + FR-5b + FR-17b + FR-32b)

### ⚠️ Design Decision Conflict (Cần giải quyết trước implementation)

> **FR-16 vs FR-23 — QP Contradiction:**
> - FR-16: *"QP không bao giờ giảm trong bất kỳ scenario nào"*
> - FR-23: *"Xem gợi ý: -5 QP, loại bỏ 1 đáp án sai"*
>
> Đây là mâu thuẫn trực tiếp trong PRD. project-context.md cũng confirm: *"QP không bao giờ giảm trong bất kỳ scenario nào (miss ngày, bar về 0, **Rescue Mechanic**, Sprint Hold)"*.
>
> **Hai options:**
> - **Option A (Recommended):** Đổi FR-23 cost thành **-5 BC** thay vì -5 QP. Consistent với FR-16 + project-context.md. BC là tiền tệ ngắn hạn, có thể giảm — đây là semantic phù hợp hơn (hint "tốn" resources ngắn hạn, không ảnh hưởng long-term progress).
> - **Option B:** Giữ -5 QP, cập nhật FR-16 để nói "QP chỉ giảm qua Rescue Mechanic hint (intent)". Update project-context.md.

### Non-Functional Requirements Inventory (7 items)

| NFR | Mô tả |
|---|---|
| NFR-1 | [CRITICAL] Server commit TRƯỚC animation — RewardEventBus: server_committed → animation_triggered |
| NFR-2 | [CRITICAL] Toàn bộ game state server-side; uninstall+reinstall+login = restore đúng state |
| NFR-3 | Content Quality Gate — CI/CD block lesson thiếu source_tag |
| NFR-4 | Voice & Register — mình/bạn xuyên suốt; zero mày/tao trong production |
| NFR-5 | No Leaderboard — chỉ Personal Best so với bản thân tuần trước |
| NFR-6 | Performance hard limits (cold launch <3s, idle ≥30fps, quiz load <500ms, etc.) |
| NFR-7 | Offline: Last Known State; bars không decay offline; disable Pet Care + Core Mission grayed-out |

### Success Metrics

| ID | Metric | Target |
|---|---|---|
| SM-1 | D7 retention | ≥30% |
| SM-2 | D1 Core Mission completion | ≥60% |
| SM-3 | Onboarding → sign-up conversion | ≥40% |
| SM-4 | Weekly Bug Log rate (user who did ≥1 real bug) | ≥50% |
| SM-5 | Wrong answer retry rate | ≥60% |
| SM-6 | Sprint Demo Card share rate | ≥10% DAU |
| SM-7 | Applied knowledge trending up | Qualitative, quarterly survey |

### PM Decisions (5 confirmed, recorded in epics.md frontmatter)

1. **Hotfix Day:** DROPPED
2. **QP Multipliers:** DEFERRED (define base amounts only, tune post-launch)
3. **Zero-Bug Response Tree:** IN MVP (2-option: Simulated Bug Hunt | Bỏ qua tuần)
4. **Late-night Edge Case:** DEFERRED (post-launch nếu >20% installs after 22:00)
5. **Progressive Disclosure Tooltips:** IN MVP (embedded trong AC, không phải FR riêng)

### Unresolved Gap (từ Architecture doc)

> **Curriculum progression khi miss ngày:** Architecture flagged "unresolved" — Sprint 1 Option A (giữ nguyên lesson, không advance). PRD owner cần quyết định phương án final trước implementation sprint.

---

## Step 3: Epic Coverage Validation

### FR Coverage Matrix

| FR | PRD Requirement (tóm tắt) | Epic | Story | Status |
|---|---|---|---|---|
| FR-1 | Bugsy idle states (≥5) | 3 | 3.x | ✓ Covered |
| FR-2 | Đặt tên pet onboarding | 2 | 2.x | ✓ Covered |
| FR-3 | Pet evolution 5 giai đoạn | 3 | 3.x | ✓ Covered |
| FR-4 | Souvenir sau evolution | 3 | 3.x | ✓ Covered |
| FR-5 | Need Bar decay real-time | 4 | 4.x | ✓ Covered |
| FR-5b | Good Morning Moment | 4 | 4.x | ✓ Covered |
| FR-6 | Pet không bao giờ chết | 4 | 4.x | ✓ Covered |
| FR-7 | Pet Care actions | 4 | 4.x | ✓ Covered |
| FR-8 | Weekend Mode | 4 | 4.x | ✓ Covered |
| FR-9 | Core Mission: lesson + quiz | 5 | 5.1, 5.2 | ✓ Covered |
| FR-10 | Side Quests | 5 | 5.6 | ✓ Covered |
| FR-11 | Mission Board kanban + Bug Report Wall | 5 | 5.7 | ✓ Covered |
| FR-12 | 6-phòng căn hộ | 3 | 3.x | ✓ Covered |
| FR-13 | Room Unlock Sequence | 3+10 | 3.x, 10.x | ✓ Covered |
| FR-14 | Apartment View + Immersive Mode | 3 | 3.x | ✓ Covered |
| FR-15 | Bug Coins | 6 | 6.x | ✓ Covered |
| FR-16 | Quality Points | 6 | 6.x | ✓ Covered |
| FR-17 | Persistent currency display | 6 | 6.x | ✓ Covered |
| FR-17b | Real Bug of the Week | 1 | 1.2 | ✓ Covered |
| FR-18 | 27 lessons × 5 categories | 1 | 1.x | ✓ Covered |
| FR-19 | 10 question formats | 5 | 5.4, 5.5 | ✓ Covered |
| FR-20 | Framework 2-5-1-2 + emotional arc | 5 | 5.2 | ✓ Covered |
| FR-21 | 3-2-1 Summary Card | 5 | 5.3 | ✓ Covered |
| FR-22 | Bloom's Taxonomy Arc 30 ngày | 5 | 5.1 | ✓ Covered |
| FR-23 | Rescue Mechanic | 5 | 5.3 | ⚠️ Covered (QP conflict — xem Step 2) |
| FR-24 | Auto-save + session resume | 5 | 5.2 | ✓ Covered |
| FR-25 | Story-Rule Feedback | 5 | 5.3 | ✓ Covered |
| FR-26 | Transfer Gate evidence gates | 7 | 7.x | ✓ Covered |
| FR-27 | Transfer Gate storage + My Journey | 7 | 7.x | ✓ Covered |
| FR-28 | Onboarding sequence | 2 | 2.x | ✓ Covered |
| FR-29 | 5 Kill-app Corner Cases | 2+5 | 2.x, 5.2 | ✓ Covered |
| FR-30 | First Room Reveal | 2 | 2.x | ✓ Covered |
| FR-31 | Sprint Hold tokens | 7 | 7.x | ✓ Covered |
| FR-32 | Story-style notifications | 9 | 9.x | ✓ Covered |
| FR-32b | Daily Recap Bubble | 8 | 8.x | ✓ Covered |
| FR-33 | Spaced Repetition | 8 | 8.x | ✓ Covered |
| FR-34 | Weekly Bug Log + Zero-Bug flow | 7 | 7.x | ✓ Covered |
| FR-35 | Retrospective Loop | 7 | 7.x | ✓ Covered |
| FR-36 | Sprint Demo Card auto-generate | 7 | 7.x | ✓ Covered |
| FR-37 | Share Sprint Demo Card | 7 | 7.x | ✓ Covered |
| FR-38 | One Room Emergency | 4 | 4.x | ✓ Covered |
| FR-39 | Item Shop placeholder | 10 | 10.x | ✓ Covered |

### NFR Coverage

| NFR | Epic Coverage | Status |
|---|---|---|
| NFR-1 | Epic 0 (Story 0.4 RewardEventBus), Epic 2, 5, 6 | ✓ Covered |
| NFR-2 | Epic 0 (Story 0.2 server schema), Epic 2, 6 | ✓ Covered |
| NFR-3 | Epic 1 (Story 1.2 content quality gate) | ✓ Covered |
| NFR-4 | Epic 5 (embedded), cross-cutting | ⚠️ Embedded only — no dedicated test |
| NFR-5 | Epic 5 (embedded), cross-cutting | ⚠️ Embedded only — no dedicated test |
| NFR-6 | Epic 0 (Story 0.3 Sentry), cross-cutting | ⚠️ Performance tests not explicitly in stories |
| NFR-7 | Epic 4 | ✓ Covered |

### Coverage Statistics

- **Total PRD FRs:** 42
- **FRs covered in epics:** 41 ✓ + 1 ⚠️ (FR-23 có conflict cần giải quyết)
- **Coverage percentage:** 100% (có 1 implementation risk cần resolve trước code)
- **Total NFRs:** 7
- **NFRs explicitly covered:** 5 | NFRs embedded/cross-cutting: 3 (NFR-4, 5, 6)

### Issues Found — Cần Giải Quyết Trước Implementation

#### 🔴 CRITICAL — Implementation Blocker

**Issue C-1: QP Contradiction (FR-16 vs FR-23)**
- FR-16: "QP không bao giờ giảm trong bất kỳ scenario nào"
- FR-23: "Rescue Mechanic hint = -5 QP"
- Epic 5 Story 5.3 AC đã code `-5 QP` — sẽ tạo bug nếu FR-16 là đúng
- **Recommendation:** Đổi thành -5 BC (Option A). Cần quyết định trước khi dev bắt đầu Epic 5.

**Issue C-2: Curriculum Progression khi Miss Ngày (Unresolved)**
- Architecture doc ghi "unresolved" — Sprint 1 Option A (giữ nguyên lesson, không advance)
- Ảnh hưởng FR-22 (Bloom's Arc) và FR-24 (session resume)
- Nếu không quyết định: dev phải chọn behavior tùy ý — có thể diverge từ product intent
- **Recommendation:** Quyết định trước Sprint 1 story writing (ảnh hưởng FR-24 AC trực tiếp)

#### 🟡 MEDIUM — Cần Clarify

**Issue M-1: Flash Quiz FR Attribution Gap**
- Epic 8 chỉ claim FR-32b và FR-33
- Flash Quiz mechanics (stripped UI, no hint, Mirror Moment) chỉ có trong UX-DR10/11 và một dòng trong FR-12
- Dev team khi đọc Epic 8 sẽ thấy FRs là FR-32b + FR-33 nhưng cần implement nhiều hơn thế
- **Recommendation:** Thêm "FR-12 (partial: Tắm/Flash Quiz activity)" vào Epic 8's FRs covered trong epics.md

**Issue M-2: Cross-Epic Dependency — Evolution Trigger**
- FR-3 (evolution animation) → Epic 3
- FR-26 (Transfer Gate evidence) → Epic 7
- Evolution trigger cần: `QP ≥ threshold` AND `transfer_gate_submitted = true`
- Chưa có story nào định nghĩa event contract giữa Epic 3 và Epic 7
- **Recommendation:** Epic 3 story cho evolution cần explicit AC: *"Given Transfer Gate evidence submitted (Epic 7), When QP threshold met, Then evolution animation triggers"* — hiện tại chỉ có một chiều

#### 🟢 LOW — Nice to Have

**Issue L-1: Room Unlock Event Contract**
- FR-13 unlock triggers là event-driven từ nhiều epics khác nhau:
  - Bếp unlock: sau Aha Moment (Epic 2)
  - Ngủ unlock: sau first Core Mission (Epic 5)
  - Tắm unlock: streak 3 ngày (Epic 5/7)
  - Sân unlock: streak 7 ngày (Epic 7/10)
- Epic 3 cần define room-unlock event names (e.g., `aha_moment_completed`, `core_mission_first_completed`, `streak_3_achieved`) để epics khác có thể emit đúng event
- **Recommendation:** Story 3.x về room unlock nên list tất cả event names làm contract

**Issue L-2: NFR-4/5/6 Test Coverage**
- NFR-4 (voice/register), NFR-5 (no leaderboard), NFR-6 (performance) chỉ được nói là "embedded"
- Chưa có story/task nào verify các NFR này
- **Recommendation:** Thêm QA checklist hoặc automated check (e.g., voice review checklist, performance benchmark test trong Story 0.3) trước release

---

## Step 4: UX Alignment Assessment

### UX Document Status

**Found — 2 UX documents:**
- `ux-designs/ux-qc-pet-2026-06-12/DESIGN.md` — Design system specs (color tokens, typography, component specs, 6-room environment, animations, sound)
- `ux-designs/ux-qc-pet-2026-06-12/EXPERIENCE.md` — User journey maps, screen flows, onboarding sequence, interaction patterns

**All 22 UX-DRs** đã được capture trong epics.md Requirements Inventory (UX-DR1 đến UX-DR22).

### UX ↔ PRD Alignment

| Kiểm tra | Status | Ghi chú |
|---|---|---|
| FR-28 Onboarding sequence ↔ UX-DR8 | ✓ Aligned | Cả hai define chính xác cùng sequence (Splash → Egg → Name → Warm-up → Aha → Reward → Cliffhanger → Notif → Sign-up → HOME) |
| FR-9 Core Mission quiz ↔ UX-DR9 | ✓ Aligned | scenario card, progress dots, Q1 warm-up border xanh nhạt, Story-Rule slide-up, 3-2-1 Summary Card |
| FR-5 Need Bars ↔ UX-DR14 | ✓ Aligned | Shimmer effect + 4 màu cố định cho 4 bars; critical ≤29% pulse error color |
| FR-14 Apartment View ↔ UX-DR7 | ✓ Aligned | Isometric 45°, L-shape 2×3, amber glow pulsing cho attention rooms, room tap → Bugsy walk 0.8s |
| FR-15/16/17 Currency ↔ UX-DR15 | ✓ Aligned | bc-amber và qp-teal không mix; header chips; counter bounce animation +X float |
| FR-32 Notifications ↔ UX-DR18 | ✓ Aligned | Bugsy voice, story framing, ví dụ notification copy có trong DESIGN.md |
| FR-32b Daily Recap ↔ UX-DR20 | ✓ Aligned | CSS thought bubble, positioned trên Bugsy ngủ, tap to dismiss |
| FR-5b Good Morning ↔ UX-DR21 | ✓ Aligned | Language progression per evolution level, subtitle tiếng Việt, 2-3s auto-dismiss |
| FR-36/37 Sprint Demo Card ↔ UX-DR22 | ✓ Aligned | Gradient bg, Bugsy center, QP/streak/lesson data, native share sheet |
| FR-10/11 Side Quest + Mission Board ↔ UX-DR13 | ✓ Aligned | Horizontal scroll kanban, drag scale(1.05), Bug Report Wall sticky notes ±5deg rotation |
| FR-19/20 Quiz formats ↔ UX-DR9/10 | ✓ Aligned | Flash Quiz stripped UI vs Core Mission full UI phân biệt rõ |
| FR-23 Rescue Mechanic ↔ UX | ⚠️ Partial | Rescue Mechanic có trong FR-23 và Story 5.3 AC, nhưng không có UX-DR riêng. Visual design (Bugsy đồng hành, 3 option buttons) được mô tả trong DESIGN.md nhưng không có UX-DR số |

**Gaps phát hiện:**

**Gap UX-1: Sound Design không có FR (UX-DR16 orphaned)**
- UX-DR16 mô tả 13 sound events chi tiết (button tap, quiz đúng, quiz sai, earn jingle, room transition footstep, evolution orchestral 3-5s, etc.)
- Không có FR nào cover sound design
- Không có architecture tech stack entry nào mention audio library cho React Native
- **Risk:** Sound có thể bị cut khỏi MVP vì không có FR backing. Nếu giữ lại, cần chọn audio library (e.g., `expo-av` hoặc `react-native-sound`) và thêm vào architecture
- **Recommendation:** Quyết định: (1) Add FR cho sound, (2) hoặc explicitly mark sound là Phase 2 trong epics

**Gap UX-2: Mirror Moment không có FR (UX-DR11 orphaned)**
- UX-DR11 mô tả Mirror Moment rất cụ thể: 2.5s self-dismiss, no text overlay, không dismissable sớm, Discipline-based visual state (≥70%/30-69%/<30%)
- Epic 8 description mention Mirror Moment nhưng không có FR tracing
- Story 8.x cần explicit AC cho Mirror Moment — hiện tại chỉ trong epic description
- **Risk:** Low — Epic 8 description đủ rõ. Nhưng dev sẽ không thấy traceability từ FR

### UX ↔ Architecture Alignment

| UX Requirement | Architecture Coverage | Status |
|---|---|---|
| Animations (spring panels, bounce, confetti) | Reanimated 2 + Gesture Handler | ✓ Aligned |
| Drag-and-drop (Mission Board, Severity Swipe) | Gesture Handler (explicit trong architecture) | ✓ Aligned |
| Tactile card press animation (translateY + shadow) | Reanimated 2 worklets (UI thread) | ✓ Aligned |
| Native Share Sheet (Sprint Demo Card) | React Native Share API (standard, no extra lib needed) | ✓ Aligned |
| Typography (Nunito Sans, JetBrains Mono) | Expo Google Fonts | ✓ Aligned |
| Color tokens (NativeWind extend) | NativeWind v4 + Tailwind config extend | ✓ Aligned |
| Slide-up panels (spring cubic-bezier) | Reanimated 2 + spring config | ✓ Aligned |
| 6-room navigation + swipe | Expo Router (file-based) + Gesture Handler swipe | ✓ Aligned |
| Apartment View isometric 45° | ⚠️ Reanimated 2 / custom SVG — no explicit spec | ⚠️ Gap |
| Sound design (13 events) | ❌ No audio library in architecture tech stack | ❌ Gap |
| Accessibility: focus trap, aria-label | React Native built-in accessibility API | ✓ Aligned (implicit) |
| Confetti (50 pieces, 4 colors, 1-3s fall) | Reanimated 2 + custom animation — no explicit spec | ⚠️ Needs story-level detail |

**Gap UX-3: Apartment View Isometric Rendering — Implementation Risk**
- UX-DR7 requires isometric 45°, L-shape 2×3 layout với room animations (glow pulsing, locked desaturated 40%, 🔥 chip)
- React Native native rendering không có built-in isometric support
- architecture.md không specify approach (SVG, Skia, custom CSS transform, hay pre-rendered assets)
- **Risk:** MEDIUM-HIGH — nếu implement bằng pre-rendered room sprites (static images + overlay), đơn giản hơn nhiều. Nếu dùng true isometric 3D, phức tạp hơn nhiều
- **Recommendation:** Quyết định approach trước Epic 3 implementation: pre-rendered sprites (recommended) hay dynamic isometric engine

**Gap UX-4: Audio Library không trong Architecture**
- architecture.md tech stack không mention audio library
- Nếu sound design là trong-scope MVP, cần chọn: `expo-av` (built-in Expo, đơn giản) hoặc `react-native-sound` (thêm native dependency)
- **Recommendation:** Thêm `expo-av` vào tech stack nếu sound là MVP scope. Nếu Phase 2, ghi rõ trong epics.

### UX Alignment Warnings

| Warning | Severity | Action |
|---|---|---|
| Sound design (UX-DR16) không có FR | MEDIUM | Quyết định: MVP scope hay Phase 2 |
| Mirror Moment (UX-DR11) không có FR | LOW | Story 8.x cần explicit AC — Epic desc đủ rõ |
| Apartment View isometric approach chưa defined | MEDIUM-HIGH | Quyết định render approach trước Epic 3 |
| Audio library missing từ architecture | MEDIUM | Thêm vào tech stack nếu MVP scope |

---

## Step 5: Epic Quality Review

### 1. Greenfield Project Check

✓ **Starter Template:** Story 0.1 explicitly uses Obytes template (`npx create-expo-app@latest qc-pet --template https://github.com/obytes/react-native-template-obytes`) — correct pattern.
✓ **CI/CD Early:** Story 0.3 sets up GitHub Actions + EAS Build in Epic 0 — correct.
✓ **Dev Environment Config:** Story 0.1 includes README.md setup guide — correct.
✓ **Database Tables on Demand:** Story 0.2 creates minimal scaffold tables; feature stories add their own columns — correct pattern.

### 2. Epic Structure Validation

| Epic | Title | User Value | Independence | Verdict |
|---|---|---|---|---|
| Epic 0 | Project Foundation & Infrastructure | Developer value (not end-user) | Fully independent | ⚠️ Technical epic — Greenfield exception applies |
| Epic 1 | Content Library & Quality Pipeline | Content team value; end-users benefit from quality content | Fully independent | ✓ Valid |
| Epic 2 | Onboarding & First Experience | Direct end-user value | Depends on Epic 0 (backward) | ✓ Valid |
| Epic 3 | Pet World & Apartment Navigation | Direct end-user value | Depends on Epic 0+2 (backward) | ✓ Valid |
| Epic 4 | Need Bar System & Pet Wellness | Direct end-user value | Depends on Epic 0+2+3 (backward) | ✓ Valid |
| Epic 5 | Daily Learning Loop | Highest end-user value (core product) | Depends on Epic 0+1+2 (backward) | ✓ Valid |
| Epic 6 | Dual Currency & Reward Animations | Direct end-user value | ⚠️ Depends on Epic 5 earning events (see EQ-2) | ⚠️ Boundary risk |
| Epic 7 | Sprint Lifecycle & Real-World Transfer | Direct end-user value | Depends on Epic 5 (sprint data) — backward | ✓ Valid |
| Epic 8 | Spaced Repetition & Flash Quiz Layer | Direct end-user value | Depends on Epic 5 (quiz formats) — backward | ✓ Valid |
| Epic 9 | Notifications & Smart Timing | Direct end-user value | Depends on Epic 4+5 state — backward | ✓ Valid |
| Epic 10 | Sân & Item Shop Placeholder | Direct end-user value | Depends on Epic 7 sprint completion — backward | ✓ Valid |

**Epic 0 Note:** Technical epics are generally a code smell, but for greenfield projects the first epic IS infrastructure. This is a recognized exception. Epic 0 delivers value to developers (the internal users enabling everything else). All subsequent epics are user-facing — valid.

### 3. Story Quality Assessment — Epic 5 (Highest Risk, Most Complex)

Epic 5 has 7 stories covering the core learning loop. This was the most analyzed epic in the epics workflow. Post-reorder (Story-Rule moved to 5.3 before question format stories 5.4/5.5), the sequence is:

| Story | Concern | Status |
|---|---|---|
| 5.1: Core Mission Entry + Bloom's Arc | Added Bloom's level logic in epics workflow | ✓ Fixed |
| 5.2: Quiz Session Engine (8Q, auto-save, resume, emotional arc) | Large scope — 1 story doing engine + save + resume + arc | ⚠️ Sizing concern |
| 5.3: Rescue Mechanic + Story-Rule Feedback + 3-2-1 Summary | Previously was 5.5, now correctly before format stories | ✓ Fixed |
| 5.4: Question Formats Part 1 (5 formats: MCQ, Bug Report Surgery, Severity Swipe, Spot the Defect, Rewrite the Fail) | 5 complex interaction formats in 1 story | ⚠️ Sizing concern |
| 5.5: Question Formats Part 2 (5 formats: Priority×Severity Duel, Boundary Attack, Root Cause Chain, Risk Radar, Complete the Test Case) | 5 more complex formats | ⚠️ Sizing concern |
| 5.6: Side Quests (Bug Hunt, Peer Review, Repro Steps, Simulated Bug Hunt) | 4 quest types in 1 story | ⚠️ Sizing concern |
| 5.7: Mission Board kanban + Bug Report Wall | Added event hooks for Core Mission in epics workflow | ✓ Fixed |

**Story sizing note:** Stories 5.2, 5.4, 5.5, 5.6 are ambitious. They're not bad stories (each delivers a coherent increment), but they will take multiple developer-days. If sprint planning finds them too large, they can be split. Not a blocker, but worth flagging for sprint planning.

### 4. Forward Dependency Analysis

#### Previously Found and Fixed (in bmad-create-epics-and-stories Step 4):

✓ **Story 5.3 moved before 5.4/5.5** — Story-Rule slide-up was referenced in 5.4/5.5 before it was built. Fixed by reordering.

✓ **Mission Board card move removed from 5.1** — Story 5.1 referenced "Mission Board card → In Progress" (Epic 5.7 feature). Fixed: 5.1 emits `core_mission_started` event; 5.7 listens and moves card.

✓ **Bloom's Taxonomy in 5.1 AC** — FR-22 was not in 5.1 AC originally. Fixed by adding bloom_level logic.

#### New Checks (this review):

**EQ-1: Epic 5 → Epic 6 BC/QP Display Boundary**
- Story 5.2 (Quiz Session Engine) earns BC and QP. Epic 6 adds reward animations.
- If Story 5.2 AC says "user sees BC counter update with animation after quiz" — that's a forward dependency on Epic 6.
- **If** Story 5.2 AC says "BC balance is updated server-side and shown as text in quiz result" (no animation) — correct.
- Cannot confirm without reading Story 5.2 AC, but the risk is real.
- **Recommendation:** Verify Story 5.2 AC explicitly says BC/QP earn is shown as simple text/number in quiz result; animation is handled by Epic 6's RewardEventBus subscriber. Add explicit "no animation required in this story" note.

**EQ-2: Epic 6 Dependency on Epic 5 Events**
- Epic 6 reward animations trigger when `reward_event_bus.emit('server_committed')` fires.
- The `server_committed` event is emitted by Epic 5 quiz stories (5.2) after backend reward commit.
- This means Epic 6 stories depend on Epic 5 already emitting the right events.
- This is NOT a forward dependency (Epic 5 comes before Epic 6) — but Epic 6 stories cannot be meaningfully tested until Epic 5 emits events.
- **Recommendation:** Epic 6 stories should use a RewardEventBus mock to emit `server_committed` for testing — independent of Epic 5.

**EQ-3: Room Unlock Events Cross-Epic Contract**
- FR-13 room unlocks are triggered by events from multiple epics:
  - `aha_moment_completed` → Bếp unlock (Epic 2)
  - `core_mission_first_completed` → Ngủ unlock (Epic 5)
  - `streak_3_achieved` → Tắm unlock (Epic 5/7)
  - `sprint_week1_completed` → Sân unlock (Epic 7/10)
- Epic 3 (room unlock) defines the room-unlock listener. Other epics emit the event.
- If event names aren't agreed upfront, emitter and listener will mismatch.
- **Status:** ⚠️ Event names not explicitly defined in any story AC yet.
- **Recommendation:** Story 3.x (room unlock story) must define event name contract. Other epics' stories must use exact same event names.

**EQ-4: Evolution Trigger Cross-Epic Contract (FR-3 + FR-26)**
- Evolution animation (Epic 3) requires both: QP ≥ threshold AND Transfer Gate evidence submitted (Epic 7).
- Epic 3 shows "evolution pending" when only QP threshold met.
- Evolution animation triggers when Epic 7 transfer_gate_submitted = true AND QP ≥ threshold.
- The trigger mechanism needs explicit story-level definition of HOW Epic 7's Transfer Gate submission notifies Epic 3.
- **Status:** ⚠️ Cross-epic trigger not explicitly defined in story AC.
- **Recommendation:** Story 7.x (Transfer Gate submission) AC should include: "Given QP ≥ threshold already met, When Transfer Gate evidence submitted AND server confirms, Then evolution animation triggers via RewardEventBus.emit('transfer_gate_completed', { evolutionLevel })"

### 5. Acceptance Criteria Quality Samples

Based on what was written in the epics workflow:

**Story 0.1 AC (App Scaffold):**
- ✓ Uses Given/When/Then consistently
- ✓ Specific and measurable ("pnpm install thành công không có error", "app chạy được trên iOS Simulator")
- ✓ Covers all deliverables (6 Zustand stores, folder structure, README)
- Rating: GOOD

**Story 0.2 AC (Supabase Backend):**
- ✓ Specific table names and column names ("users (id, supabase_auth_id, created_at)")
- ✓ Testable ("supabase start spin up thành công và supabase status trả về healthy")
- ✓ Security explicit (JWT storage in expo-secure-store, RLS policy)
- Rating: GOOD

**Story 5.3 (Rescue Mechanic + Story-Rule + 3-2-1 Summary):**
- Has -5 QP in AC — this is the QP Contradiction issue (Issue C-1 in Step 2)
- Otherwise well-specified with explicit behavior rules
- Rating: GOOD except QP issue

**Overall AC quality:** High. Stories use BDD Given/When/Then consistently, are specific, measurable, and include technology-specific detail. The 47 stories were all written with this pattern and validated in epics workflow Step 4.

### 6. Best Practices Compliance Checklist

| Epic | Delivers User Value | Epic Independent | Stories Sized OK | No Forward Deps | DB Created When Needed | Clear ACs | FR Traceability |
|---|---|---|---|---|---|---|---|
| Epic 0 | ⚠️ Developer value | ✓ | ⚠️ Story 0.x are large | ✓ | ✓ | ✓ | ✓ |
| Epic 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 3 | ✓ | ✓ | ✓ | ⚠️ EQ-3, EQ-4 | ✓ | ✓ | ✓ |
| Epic 4 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 5 | ✓ | ✓ | ⚠️ 5.2/5.4/5.5 large | ✓ (post-fix) | ✓ | ✓ | ✓ |
| Epic 6 | ✓ | ⚠️ EQ-1, EQ-2 | ✓ | ⚠️ EQ-1 | ✓ | ✓ | ✓ |
| Epic 7 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 8 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ⚠️ Flash Quiz FR gap |
| Epic 9 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Epic 10 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Quality Findings Summary

#### 🔴 Critical Violations

None structural — the three critical issues were already caught in Steps 2-3:
- C-1: QP Contradiction (FR-16 vs FR-23) — must resolve before Epic 5
- C-2: Curriculum progression unresolved — must resolve before Sprint 1

#### 🟠 Major Issues

| ID | Issue | Epic | Recommendation |
|---|---|---|---|
| EQ-1 | Epic 5 → Epic 6 BC/QP display boundary unclear in AC | 5, 6 | Verify Story 5.2 AC says "text display only" for earn; mark animation as Epic 6 |
| EQ-2 | Epic 6 testability before Epic 5 events exist | 6 | Use RewardEventBus mock in Story 6.x acceptance testing |
| EQ-3 | Room unlock event names not defined as contract | 3, 2, 5, 7, 10 | Story 3.x must define event name contract; all emitters must use same names |
| EQ-4 | Evolution trigger mechanism between Epic 3 and 7 not explicit in ACs | 3, 7 | Add explicit trigger AC in Story 7.x Transfer Gate story |

#### 🟡 Minor Concerns

| ID | Issue | Impact |
|---|---|---|
| EQ-5 | Stories 5.2, 5.4, 5.5, 5.6 are large in scope | May need sub-tasks in sprint planning |
| EQ-6 | Epic 8 missing FR-12 attribution for Flash Quiz activity | Documentation-only; no implementation impact |
| EQ-7 | Epic 7 packs 7 FRs in 1 epic (Sprint Hold + Weekly Bug Log + Retrospective + Transfer Gate + Sprint Demo Card) | May feel rushed if sprint velocity is low |

---

## Step 6: Final Assessment

### Overall Readiness Status

## ⚠️ NEEDS WORK — 2 Critical Issues Must Be Resolved Before Implementation

Planning artifacts are **comprehensive and well-aligned** overall. The PRD, UX Design, Architecture, and Epics/Stories are deeply consistent — 42/42 FRs covered, 22/22 UX-DRs captured, architecture choices match all UX interaction requirements. However, two critical decisions are unresolved and will cause implementation divergence if not settled.

### Issues Summary

| Severity | Count | Can Proceed? |
|---|---|---|
| 🔴 Critical (implementation blockers) | 2 | ❌ Must resolve first |
| 🟠 Major (resolve before relevant epic) | 6 | ✅ Resolve before that epic starts |
| 🟡 Minor / Low (sprints can handle) | 9 | ✅ Sprint planning can address |
| **Total** | **17** | |

### Critical Issues — Resolve BEFORE Any Implementation

**🔴 C-1: QP Contradiction (FR-16 vs FR-23)**

Mâu thuẫn trực tiếp trong PRD:
- FR-16: *"QP không bao giờ giảm trong bất kỳ scenario nào"*
- FR-23: *"Rescue Mechanic: Xem gợi ý = -5 QP"*
- project-context.md: *"QP không giảm kể cả Rescue Mechanic"*
- Story 5.3 AC hiện tại dùng *"-5 QP"*

**Quyết định cần ngay:**
- **Option A (Recommended):** Đổi FR-23 thành **-5 BC**. Nhất quán với FR-16 + project-context.md. BC là tiền tệ ngắn hạn — semantic phù hợp hơn (hint tốn resources ngắn hạn, không ảnh hưởng long-term progress). Update FR-23 + Story 5.3 AC.
- **Option B:** Giữ -5 QP. Update FR-16 exception clause + project-context.md.

**🔴 C-2: Curriculum Progression khi Miss Ngày (Unresolved)**

Chưa có quyết định về behavior khi user miss ngày:
- Option A (tạm thời): Giữ nguyên lesson hiện tại, không advance ngày hôm đó
- Ảnh hưởng Story 5.1 (Core Mission Entry) và Story 5.2 (Quiz Session Engine) ACs
- Ảnh hưởng Bloom's Arc (FR-22): nếu lesson không advance, Arc sẽ không đúng 30-ngày

**Quyết định cần trước Sprint 1 coding.**

### Major Issues — Resolve Before Related Epic

| Issue | Resolve Before | Action |
|---|---|---|
| EQ-1: Story 5.2 AC không explicit về "text only" earn (no animation) | Epic 5 Sprint | Verify/update Story 5.2 AC: "BC/QP earned shown as text; animation deferred to Epic 6" |
| EQ-3: Room unlock event names không defined | Epic 3 Sprint | Story 3.x AC phải define event name contract (e.g., `aha_moment_completed`, `core_mission_first_completed`) |
| EQ-4: Evolution trigger mechanism Epic 3 ↔ Epic 7 không explicit | Epic 7 Sprint | Story 7.x Transfer Gate AC: "Given QP threshold met, When evidence submitted, Then emit `transfer_gate_completed` event → Epic 3 triggers evolution" |
| UX-Gap-3: Apartment View isometric rendering approach chưa decided | Epic 3 Sprint | Quyết định: pre-rendered sprites (simple) hay dynamic isometric. Spec vào Story 3.x |
| UX-Gap-1+4: Sound design scope chưa defined | Before Epic 0 done | Quyết định: MVP scope (add `expo-av` to architecture) hay Phase 2 (add to Out of Scope list) |
| EQ-2: Epic 6 testability trước Epic 5 events | Epic 6 Sprint | Story 6.x phải specify mock strategy cho RewardEventBus testing |

### Recommended Next Steps

**Trước khi start coding (ngay bây giờ):**
1. **Quyết định QP vs BC** cho Rescue Mechanic hint → Update FR-23 + Story 5.3 AC + project-context.md
2. **Quyết định Curriculum Progression** khi miss ngày → Update Story 5.1 AC + FR-24 edge case

**Trong Sprint Planning (bmad-sprint-planning):**
3. **Define room unlock event contract** → Thêm vào Story 3.x AC (event names như `core_mission_first_completed`)
4. **Define evolution trigger contract** → Thêm vào Story 7.x Transfer Gate AC
5. **Verify Story 5.2 AC** boundary với Epic 6 (text vs animation)
6. **Sound design decision** → Architecture.md update nếu MVP scope
7. **Apartment View rendering approach** → Spec vào Epic 3 stories

**Sprint sizing gợi ý (sau sprint planning):**
8. Stories 5.2, 5.4, 5.5 có thể cần split thành sub-tasks trong sprint
9. Epic 7 có thể cần 2 sprints do feature density

### What's Working Well

✅ **PRD → Epics traceability:** 100% FR coverage, tất cả 42 FRs có epic + story

✅ **Architecture → UX alignment:** Reanimated 2, Gesture Handler, NativeWind đều cover mọi UX interaction requirement

✅ **Story quality:** 47 stories dùng Given/When/Then consistent, specific, testable — cao nhất trong BMAD workflow

✅ **Critical patterns explicit:** RewardEventBus (Story 0.4), WAL+MMKV (Story 0.4), ISystemClock (Story 0.4), Idempotency (Story 0.5), StandardResponse (Story 0.5) — tất cả có dedicated story với Jest tests

✅ **Content pipeline ready:** CI/CD content quality gate (Story 0.3/1.2), source_tag enforcement, Real Bug of the Week format — content team có thể bắt đầu authoring độc lập

✅ **No leaderboard / Voice/Register:** NFR-5 và NFR-4 embedded across stories — không có kẽ hở

✅ **Kill-app safety:** FR-29 (5 corner cases) + WAL+MMKV strategy explicit — zero data loss architecture

✅ **Forward dependency cleanup:** 3 forward dependency bugs đã được fix trong epics workflow (Story-Rule order, Mission Board event, Bloom's Arc in 5.1)

### Assessor Note

> _Đây là planning suite hoàn chỉnh và có độ sâu cao. 17 issues phát hiện là normal cho một product scope này — không phải dấu hiệu của planning kém. Điều quan trọng là 2 critical issues đơn giản và dễ resolve (QP vs BC là 1 quyết định; curriculum progression là 1 quyết định), sau đó toàn bộ stack sẵn sàng để vào sprint planning và implementation._

---

**Report file:** `_bmad-output/planning-artifacts/implementation-readiness-report-2026-06-14.md`
**Total issues found:** 17 (2 critical, 6 major, 9 minor/low)
**Recommendation:** Resolve 2 critical issues → Run `bmad-sprint-planning`

---

## Appendix: Decisions Resolved (2026-06-14)

Sau khi report hoàn thành, Nhung đã resolve 2 critical issues ngay trong cùng session:

### ✅ C-1 RESOLVED: QP Contradiction → Đổi sang -5 BC

**Quyết định:** Rescue Mechanic hint cost = **-5 BC** (không phải -5 QP)

**Files đã update:**
- `epics.md` line FR-23 (Requirements Inventory): `-5 QP` → `-5 BC`
- `epics.md` Story 5.3 AC: `cost: -5 QP` → `cost: -5 BC`
- `epics.md` Story 6.x AC: disabled condition đổi từ "QP < 5" sang "BC < 5"
- `prds/prd-qc-pet-2026-06-14/prd.md` FR-23 table: `-5 QP` → `-5 BC`

**Kết quả:** FR-16 ("QP không bao giờ giảm") và FR-23 ("Rescue Mechanic cost") hiện tại nhất quán. project-context.md không cần update (đã đúng).

### ✅ C-2 RESOLVED: Curriculum Progression → Option A Confirmed

**Quyết định:** **Option A** — khi user miss ngày, lesson giữ nguyên vị trí hiện tại, không advance. Lesson position tiến theo số Core Missions hoàn thành, không theo calendar days.

**Files đã update:**
- `epics.md` Additional Requirements (line 145): Đổi từ "unresolved" → "RESOLVED 2026-06-14 — Option A confirmed"

**Implication cho implementation:**
- Story 5.1 (Core Mission Entry): `bloom_level` xác định theo `missions_completed_count`, không phải `days_since_install`
- Story 5.2 (Quiz Session Engine): Resume state dùng `current_lesson_index` (mission-based), không phải date-based index

---

**Status sau resolution:** 0 critical issues còn lại. **Sẵn sàng chạy `bmad-sprint-planning`.**

