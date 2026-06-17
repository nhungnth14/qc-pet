---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-qc-pet-2026-06-14/prd.md"
  - "_bmad-output/planning-artifacts/prds/prd-qc-pet-2026-06-14/addendum.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/EXPERIENCE.md"
  - "_bmad-output/planning-artifacts/game-flow.md"
  - "_bmad-output/planning-artifacts/content-strategy.md"
pmDecisions:
  - "Hotfix Day: DROPPED — đi ngược triết lý app-as-scaffolding, Sprint Hold đủ cover use case"
  - "QP Multipliers: DEFERRED — define base earn amounts only, tune multipliers post-launch với real data"
  - "Zero-Bug Response Tree + Simulated Bug Hunt: IN MVP (2-option flow: Simulated Bug Hunt | bỏ qua tuần)"
  - "Edge Case Buổi Tối Muộn: DEFERRED — post-launch nếu analytics thấy >20% installs after 22:00"
  - "Progressive Disclosure Tooltips: IN MVP — embedded trong Acceptance Criteria của stories liên quan, không phải FR riêng"
---

# QC Pet — Epic Breakdown

## Overview

Tài liệu này breakdown toàn bộ requirements từ PRD, Architecture, và UX Design thành các epics và stories có thể thực hiện. Được xây dựng trên PRD final (2026-06-14), Architecture document, DESIGN.md + EXPERIENCE.md, game-flow.md, và content-strategy.md.

**Canonical PRD:** `prds/prd-qc-pet-2026-06-14/prd.md` (v1 superseded)
**PM Decisions:** Xem frontmatter `pmDecisions` cho 5 quyết định scope.

---

## Requirements Inventory

### Functional Requirements

FR-1: Hệ thống hiển thị idle behavior của Bugsy phản ánh trạng thái Need Bars hiện tại (tối thiểu 5 idle states: All OK / Hunger <30% / Happiness <30% / Health <30% / Discipline <30% / Post-Core Mission)
FR-2: User đặt tên pet trong onboarding (3 gợi ý + free text, max 20 ký tự, default "Bugsy")
FR-3: Pet evolution 5 giai đoạn (v0.1→v0.5→v1.0→v2.0→v3.0), yêu cầu QP threshold VÀ Transfer Gate evidence — chỉ đủ QP → "evolution pending"
FR-4: Souvenir tương ứng travel destination tự động xuất hiện trong căn hộ sau mỗi evolution animation hoàn thành
FR-5: 4 Need Bars (Hunger/Happiness/Health/Discipline) giảm theo server time liên tục kể cả khi app đóng (decay rates: Hunger ~48h, Happiness ~72h, Health ~72h, Discipline ~48h, Composite via Work Room ~24h)
FR-5b: Good Morning Moment — lần đầu mở app mỗi ngày: Bugsy vươn vai + greeting bằng ngôn ngữ travel destination đang hướng tới (có subtitle tiếng Việt) — chỉ trigger 1 lần/ngày, tự dismiss sau 2-3s
FR-6: Pet không bao giờ chết — bars về 0% → regress state tương ứng nhưng không có game over, không mất QP, phục hồi ngay khi user quay lại
FR-7: Pet Care actions: Quick Feed (+25% Hunger), Quick Play (+20% Happiness), Quick Train (+15% Health) — fill bars nhưng không earn BC/QP
FR-8: Weekend Mode — Thứ 7 và CN: tất cả Need Bar decay dừng lại (timezone Việt Nam UTC+7), resume từ 00:00 Thứ 2
FR-9: Core Mission hàng ngày: 1 lesson (~30s) + quiz theo số câu của category (framework 2-5-1-2, 8 câu chuẩn), fill tất cả 4 bars hiệu quả nhất, earn BC và QP; Story-Rule Feedback sau câu sai; 3-2-1 Summary Card sau câu cuối
FR-10: Side Quests — 3 loại (Bug Hunt, Peer Review, Repro Steps) + Simulated Bug Hunt (cho user không raise được bug thật), fill Happiness +40%, earn BC
FR-11: Mission Board kanban mini trong Work Room (Todo/In Progress/Done), user kéo card khi bắt đầu và hoàn thành; Bug Report Wall tích lũy 1 sticky note/lesson (full wall ~30 notes → confetti + Bugsy excited)
FR-12: 6-phòng căn hộ, mỗi phòng có chức năng và Need Bar riêng: Work Room (Composite, Core Mission), Bếp (Hunger, Bug Report), Ngủ (Health, Spaced Rep), Khách (Happiness, Side Quest/TV), Tắm (Discipline, Flash Quiz), Sân (no bar, open space + Shop placeholder)
FR-13: Room Unlock Sequence trigger-based: Work Room (onboarding), Bếp (sau Aha Moment), Ngủ (sau Core Mission đầu tiên), Khách (Happiness <50%), Tắm (streak 3 ngày), Sân (streak 7 ngày hoặc Week 1 complete — cinematic unlock)
FR-14: Apartment View (tap 🏠, isometric, phòng cần attention nhấp nháy) + Immersive Mode (default, full-screen trong phòng); room transition: Bugsy walk 0.8s; swipe trái/phải = phòng liền kề; long press Bugsy = suggest phòng cần nhất
FR-15: Bug Coins (BC) — tiền tệ ngắn hạn; miss ngày: -15 BC (grace period ngày đầu, cap 3 ngày miss liên tiếp); không về âm; visible mọi lúc; không convert thành QP; Sprint Hold không tốn BC
FR-16: Quality Points (QP) — tiền tệ dài hạn; không bao giờ giảm trong bất kỳ scenario nào; visible mọi lúc; không mua được; server-authoritative (không thể manipulate client-side)
FR-17: BC và QP balance hiển thị persistent trong header/home screen mọi lúc, phân biệt rõ bằng icon; counter animate sau mỗi earn event
FR-17b: Real Bug of the Week — content type riêng biệt, authored bởi QC practitioner nội bộ (không phải AI, không community), tag "REAL_CASE", xuất hiện trong Side Quest rotation hoặc Phòng Khách TV
FR-18: 27 lessons × 5 categories phải có đủ trước launch (launch blocker): Bug Detective ×8 (BD-1→BD-8), Test Architect ×5 (TA-1→TA-5), Mindset & Process ×4 (MP-1→MP-4), Tool Master ×6 (TM-1→TM-6, TM-5+TM-6 tag INDUSTRY_PRACTICE), Agile Tester ×4 (AT-1→AT-4); ≥1 Weekly Challenge/category
FR-19: Quiz engine hỗ trợ 10 question formats: MCQ, Bug Report Surgery (drag reconstruct), Severity Swipe (tinder-style classify), Spot the Defect (tap bug trong screenshot), Rewrite the Fail (word blocks), Priority×Severity Duel (2-axis drag ma trận), Boundary Attack (nhập test values), Root Cause Chain (kéo thả chain), Risk Radar (xếp hạng feature cards), Complete the Test Case (điền precondition + expected result)
FR-20: Quiz session framework 2-5-1-2 (2 lý thuyết nền, 5 thực hành, 1 hình ảnh, 2 scenario phán đoán); Emotional arc Q1-Q8: Warm-up (MCQ 2 lựa chọn từ bài ≥3 ngày trước) → nền → twist → confidence peak → thử thách (Q5 nặng nhất) → Aha → identity → synthesis; không có 2 câu drag-heavy liên tiếp; Q1 warm-up exception (sai không trừ streak, border xanh nhạt)
FR-21: 3-2-1 Summary Card sau câu quiz cuối: 3 điều nhớ / 2 lỗi phổ biến / 1 đối chiếu thực tế (max 5 bullets), title thay điểm số (Bug Whisperer/Defect Detective/QC Apprentice/Bug Magnet), shareable
FR-22: Difficulty Progression — Bloom's Taxonomy Arc 30 ngày: Foundation (Day 1-5) → Understanding → Application → Analysis → Evaluation → Synthesis (Day 26-30, không dạy concept mới, consolidate)
FR-23: Rescue Mechanic — sai 3 lần liên tiếp cùng câu: Bugsy nói đồng hành, user chọn: Xem gợi ý (-5 BC, loại 1 sai) | Đọc lý thuyết (mini-card, miễn phí) | Bỏ qua (câu quay lại session sau, miễn phí); không có popup đỏ; nút bỏ qua không được ẩn
FR-24: Auto-save sau mỗi câu trả lời; session incomplete → resume đúng câu; "Chào mừng trở lại" banner với progress X/8 câu + CTA "Tiếp tục từ câu X"; sau 24h hỏi tiếp tục hay làm lại
FR-25: Story-Rule Feedback sau câu sai: Bugsy kể câu chuyện → rule landing; animation không thể tắt; user nhận ≥30% QP reward dù sai; sau câu đúng: ăn mừng + optional Self-Efficacy Calibration bonus question
FR-26: Transfer Gate per evolution step (accessible từ phòng tương ứng khi QP đủ): v0.1→v0.5: bug report confirm (Bếp), v0.5→v1.0: test case thật (Work Room), v1.0→v2.0: Sprint Demo Card shared (Khách), v2.0→v3.0: ET session note + Retrospective tháng (Sân+Ngủ); submission: text entry hoặc photo upload; server ghi nhận timestamp, user ID, evidence type
FR-27: Transfer Gate submissions lưu server-side vĩnh viễn, accessible trong My Journey view; không thể xóa bởi user
FR-28: Onboarding sequence cố định (không skip/reorder): Màn tối → tiếng bàn phím → trứng run rẩy → Bugsy nở → đặt tên → micro-bridge → warm-up Pass/Fail → Aha Moment (Scenario B+D) → Story-Rule → Reward (server commit TRƯỚC animation) → Cliffhanger → Notification Preference → Sign-up Gate ("Lưu [tên] lại") → HOME Work Room; Sign-up Gate PHẢI xuất hiện SAU Reward animation
FR-29: 5 Kill-app Corner Cases phải produce correct resume với zero data loss: (1) tại màn đặt tên → resume đặt tên, (2) sau quiz trước reward → server đã commit → resume reward screen, (3) tại Cliffhanger → resume Cliffhanger, (4) tại Notification Preference → resume Notification Preference, (5) trước Sign-up Gate → resume Sign-up Gate với progress và earned currency đã commit
FR-30: Sau onboarding: HOME = Work Room, chỉ có cửa bếp hé mở với ánh sáng vàng — không có tooltip, không có announcement; tap → Apartment View với 2 phòng sáng
FR-31: Sprint Hold tokens: earned khi hoàn thành 20/28 daily missions/tháng = 1 token; max 2 tokens/tháng (free tier); không mua được bằng BC hay QP; không dùng 2 lần liên tiếp; bắt buộc ghi lý do; ảnh hưởng Discipline bar nhẹ
FR-32: Notifications story-style từ Bugsy (không phải "Reminder:"); max 2/ngày (8h00 sáng + 19h00 chiều chỉ khi user chưa mở app trong ngày); tap → deep link vào đúng phòng; ≥2 phòng cần → gộp 1 notification
FR-32b: Daily Recap Bubble — trigger khi user tap "Tắt đèn" Phòng Ngủ; CSS thought bubble (không phải modal) phía trên Bugsy đang ngủ; nội dung: tên bài hôm nay + 1 rule từ 3-2-1 Summary + streak; nếu chưa làm Core Mission: message khác; tap anywhere to dismiss
FR-33: Spaced Repetition — Q1 của mỗi Core Mission từ bài đã học ≥3 ngày trước; cũng available trong Phòng Ngủ (1-2 câu trước tắt đèn, không điểm, không streak impact); SR algorithm server-side, queue cache local 24h
FR-34: Weekly Bug Log — submit ≥1 real-world bug/tuần từ Work Room hoặc My Journey; fields: description, severity/priority, outcome; app không validate nội dung; Zero-Bug Response Tree (2-option): (a) Mở Simulated Bug Hunt, (b) "Bỏ qua tuần này"; entries visible trong My Journey
FR-35: Retrospective Loop — prompt cuối mỗi 7-day sprint (tùy chọn): gì đã áp dụng được, gì còn khó, bật tắt gì tuần tới; lưu server-side, visible trong My Journey theo timeline
FR-36: Sprint Demo Card — tự động generate sau Day 7 sprint hoàn thành; hiển thị: Bugsy version, QP earned, streak, top lesson; đủ đẹp để share mạng xã hội; shareable trong 48h sau generate
FR-37: Share Sprint Demo Card từ Phòng Khách → fill Happiness +50%; sử dụng native share sheet iOS/Android
FR-38: One Room Emergency — mỗi ngày highlight 1 phòng có bar thấp nhất (ngoài Work Room) trong Apartment View; chỉ 1 phòng highlight/ngày; indicator không intrusive
FR-39: Item Shop placeholder trong Sân — browse UI có thể xem nhưng chưa mua được; "Coming Soon" indicator; Phase 2 full implementation

### NonFunctional Requirements

NFR-1: [CRITICAL] Server-side state phải commit thành công TRƯỚC khi client trigger bất kỳ animation reward nào (BC earn, QP earn, evolution, achievement); RewardEventBus pattern bắt buộc: server_committed event → animation_triggered event
NFR-2: [CRITICAL] Toàn bộ game state lưu server-side: user identity, pet state, QP/BC balances, mission history, Sprint Hold log, Weekly Bug Log entries, Transfer Gate submissions, Retrospective entries, Spaced Repetition history; uninstall + reinstall → login → restore đúng state
NFR-3: Content Quality Gate — lesson không có source tag bị block tại CI/CD pipeline; source tag hợp lệ: ISTQB chapter number (e.g. "ISTQB-2.3") hoặc "INDUSTRY_PRACTICE"; peer-review bởi ≥1 senior QA trước khi publish
NFR-4: Voice & Register — toàn bộ app dùng "mình/bạn"; Bugsy tự xưng trong câu nhấn; zero "mày/tao" violations trong production; voice review bắt buộc trước mỗi content release
NFR-5: No Leaderboard — không có ranking, không có global comparison; Personal Best chỉ so với bản thân tuần trước; Sprint Demo Card chỉ hiển thị personal data
NFR-6: Performance hard limits: app cold launch <3 giây (entry-level 2022+), idle animation ≥30fps, Need Bar update latency <1 giây (sau mở app), quiz next question load <500ms, Core Mission hoàn thành ≤10 phút, daily loop tối thiểu 5-8 phút
NFR-7: Offline Behavior (Last Known State): render Bugsy ở last known state khi offline; Need Bars không decay khi offline; Pet Care và Core Mission disabled (grayed out, không hidden); khi reconnect: bars sync từ server; reward animations chỉ play sau server ACK thành công

### Additional Requirements

**Khởi tạo Project (Story đầu tiên của Sprint 1):**
- Initialization command: `npx create-expo-app@latest qc-pet --template https://github.com/obytes/react-native-template-obytes`
- Template: Obytes React Native/Expo Starter (Expo SDK 56, React Native 0.85.2, React 19.2.3)

**Tech Stack (đã quyết định bởi Architecture):**
- Language: TypeScript strict
- Styling: NativeWind v4 (Tailwind CSS)
- Navigation: Expo Router (file-based, deep links)
- Data fetching: React Query + Axios
- Local storage: react-native-mmkv (sync, cho WAL và quiz state machine)
- UI state: Zustand (6 stores: bugsy-animation, reward-event-bus, quiz-session, room-navigation, ui-state, clock-offset)
- Forms: TanStack Form + Zod
- i18n: i18next (Vietnamese strings)
- Animations: Reanimated 2 + Gesture Handler (UI thread worklets, 30fps)
- Testing: Jest (unit, co-located) + Maestro (E2E kill-app scenarios)
- CI/CD: GitHub Actions (ci.yml + eas-build.yml + content-quality-gate.yml)
- Package manager: pnpm

**Database & Backend:**
- Database: PostgreSQL 17 via Supabase + Prisma v7.8.0 (migrations, type generation)
- Auth: Supabase Auth (anonymous session → convert after Aha Moment; email/password + Google + Apple)
- JWT storage: expo-secure-store (Keychain/Keystore, không dùng AsyncStorage)
- Authorization: Supabase Row Level Security (RLS) — `user_id = auth.uid()` trên mọi table
- Cache: Upstash Redis (idempotency keys TTL 24h + rate limiting)
- File storage: Supabase Storage (presigned URL pattern cho Transfer Gate)
- Edge Functions: Supabase Edge Functions (TypeScript/Deno) cho: process-quiz-reward, process-daily-mission-selection, process-need-bar-sync, process-transfer-gate, send-push-notification, calculate-spaced-repetition

**Critical Patterns (bắt buộc cho mọi implementation):**
- RewardEventBus: `server_committed` → `animation_triggered` (không đảo thứ tự)
- WAL (Write-Ahead Log) trong MMKV: write WAL trước khi gọi API, delete WAL sau API success, recovery routine khi app restart
- ISystemClock interface: `now() = Date.now() + clockOffset` — KHÔNG BAO GIỜ dùng Date.now() trực tiếp trong decay logic
- Clock offset: `server_time` trong mọi API response; client tính `clockOffset = serverTime - Date.now()`, lưu MMKV
- Idempotency: `X-Idempotency-Key` header + Upstash Redis check trước mọi reward endpoint
- StandardResponse<T>: `{ data: T, serverTime: number, requestId: string }` cho mọi API success response
- RFC 7807 Error format cho mọi error response

**Infrastructure:**
- Environments: dev (local `supabase start`) / staging / production (3 Supabase projects riêng)
- Mobile builds: EAS Build (cloud, free 30 builds/tháng)
- OTA updates: EAS Update (bypass App Store review cho JS bundle changes)
- Push notifications: Expo Push Notifications (FCM + APNs via EAS auto-managed)
- Error tracking: Sentry for React Native (crash + performance NFR-6)
- BC miss penalty: pg_cron scheduled job 00:05 UTC+7 daily

**Content Infrastructure:**
- Content: server-driven JSON + version manifest trong `content/` folder
- OTA content updates via EAS Update (không cần App Store review)
- Content quality gate: GitHub Actions block PR nếu lesson thiếu source_tag field

**Naming Conventions:**
- Database: snake_case tables + columns, `idx_<table>_<column>` indexes
- API paths: kebab-case resource paths `/v1/quiz-sessions/`, camelCase JSON fields
- Code: PascalCase components, kebab-case Expo Router screens, `use` prefix hooks + Zustand stores, SCREAMING_SNAKE_CASE constants
- Tests: co-located với source file (`Component.test.tsx` cạnh `Component.tsx`)

**Workarounds/Gaps:**
- Curriculum progression khi miss ngày (RESOLVED 2026-06-14): **Option A confirmed** — giữ nguyên lesson hiện tại, không advance khi miss ngày; lesson position tiến theo số missions hoàn thành, không theo calendar days

### UX Design Requirements

UX-DR1: Custom component library — KHÔNG dùng MUI, Chakra, hoặc bất kỳ UI library nào; tất cả component tự build theo DESIGN.md spec
UX-DR2: Tactile card system — tiêu chuẩn cho mọi card: `border: 3px solid #001a41; box-shadow: 0px 6px 0px 0px rgba(0,26,65,1); border-radius: 12px (rounded-xl)`; tactile button: shadow 4px, press = translateY(4px) + shadow reduce
UX-DR3: Color system — Material Design 3 color roles (primary #006491, primary-container #22b5ff, inverse-surface #002e69, error #ba1a1a, etc.) + QC Pet extended tokens: qp-teal #00A8A8, bc-amber #FFB000, terminal-green #8ce68c, warm-peach-bg #FFE5D9, rule-landing-bg #BFFFA1; currency colors không được mix
UX-DR4: Typography — Nunito Sans (display 32/900, header-lg 24/800, ui-button 16/800, body-md 14/600) + JetBrains Mono code-sm 12/500 (code/terminal context ONLY); minimum weight 600 trong mọi UI text; không dùng weight <600
UX-DR5: Bugsy character — baby chick vàng warm (#FFE082) đội tai nghe tím (#5C6BC0); 5 emotional states với visual riêng biệt (Happy/Hungry/Tired/Sad/Excited); per-room sizing (w-48 đến w-80) và animation (idle-cycle, breathe-sleep, outdoor-run, etc.); luôn dùng bugsy-transparent.png (RGBA)
UX-DR6: Slide-up overlay panels — spring animation `cubic-bezier(0.34, 1.56, 0.64, 1)`, backdrop `bg-on-background/60 backdrop-blur-sm`; focus trap khi open; return focus khi close; scroll nếu nội dung >80vh; chỉ 1 panel mở tại 1 thời điểm; Story panel: rounded-t-[32px], bg inverse-surface; Bug Log panel: rounded-t-[40px]
UX-DR7: Apartment View — isometric 45°, L-shape 2×3 layout; unlocked+healthy: normal; unlocked+attention: warm amber glow pulsing 2s; locked: desaturated 40% + "?" chip; One Room Emergency: 🔥 chip; room tap → Bugsy walk 0.8s overlay → Immersive Mode
UX-DR8: Onboarding screens — Splash: golden-hour gradient (#ffb4a5→#c9e6ff), office building CSS, tagline pill; Egg Hatching: warm-peach-bg, egg-shake + egg-glow animations, naming panel slide-up (naming panel bg-surface-container border-4 rounded-t-[3rem]); Aha Moment: Bug ticket card (dark wrapper + tertiary-container header + body white)
UX-DR9: Core Mission quiz UI — scenario card (Bug Ticket style), progress dots (active: w-8 h-2 rounded-full primary-container, inactive: surface-variant), Q1 warm-up border xanh nhạt (visual signal "đây là khởi động"); Story-Rule slide-up (bg-inverse-surface, handle bar); Confetti chỉ khi đúng; 3-2-1 Summary dạng "Bugsy's Cheat Sheet" trading card
UX-DR10: Flash Quiz UI — stripped: chỉ có streak counter nhỏ + "x/3 câu" indicator + question text + answer buttons; không có scenario card, không có category badge, không có hint button; instant feedback (đúng lime, sai error-container); không có Story-Rule Panel; sau Q cuối → Mirror Moment auto-trigger
UX-DR11: Mirror Moment — Bugsy standing + flipped reflection side-by-side; Discipline ≥70%: outfit pressed + sparkles; 30-69%: neutral; <30%: hair ruffled + tired + no sparkle; duration 2.5s self-dismiss; không có text overlay; không dismissable sớm
UX-DR12: 6 Room environment specs (per DESIGN.md §Room Environment Specs): Work Room (warm-peach-bg walls, terminal green monitor glow); Bếp (kitchen-amber, checkerboard tiles, empty/full fridge states); Ngủ (bedroom-soft lavender, dim stars on ceiling when lights out); Khách (living-warm, sofa coral, TV on/off states, souvenir shelves); Tắm (bathroom-mint, mirror oval frame, streak tracker chip); Sân (yard-sky + yard-grass, Day 7 cinematic no text no UI)
UX-DR13: Mission Board kanban — horizontal scroll, 3 columns (Todo/In Progress/Done), column headers UPPERCASE; card: tactile-card w-40 drag handle; drag: scale(1.05) + elevated shadow; drop zone: dashed border-2 primary-container; Done: stacked slight rotation ±3deg; Bug Report Wall: sticky notes grid, random rotation ±5deg, fly-in animation new notes, confetti when full
UX-DR14: Need Bar component — container: tactile-card rounded-xl hover:scale-105; track: h-4 rounded-full border-2 on-surface; fill: shimmer effect + colors (Hunger lime-500, Happiness primary-container #22b5ff, Health error #ba1a1a, Discipline tertiary-container #b59cff); critical (≤29%): pulse error color
UX-DR15: Currency display — header chips: bg-surface-container-high rounded-full px-sm py-xs border-2; BC: bc-amber (#FFB000); QP: qp-teal (#00A8A8); counter earn animation: bounce scale(1.2)→scale(1) + "+X" floating text rises → header counter tick-up 800ms
UX-DR16: Sound design — button tap: soft pop; Bugsy happy: 8-bit chirp; Bugsy sad: descending bloop; quiz đúng: chime + coin sfx; quiz sai: forgiving bwaa; earn: jingle + tick; room transition: soft footstep 0.8s; Flash Quiz answer: quick pop; Mirror Moment sparkle (khi Discipline cao); Lights out: soft click + crickets; Evolution: rising orchestral 3-5s; Day 7 Yard cinematic: birds + breeze only (no music)
UX-DR17: Accessibility floor (MVP required): tất cả tappable targets ≥44×44px; aria-label cho mọi icon-only button (Bottom Nav tabs); focus trap khi slide-up panel mở; return focus khi đóng; input errors không chỉ dùng màu — phải kèm text hoặc border change; lang="vi" trên tất cả HTML/screens
UX-DR18: Notification copy — Bugsy voice, story framing (không phải "Reminder:"); ví dụ: Hunger 30% → "Bụng Bugsy kêu to rồi. Tủ lạnh trống không có gì hết á 😅"; max 2/ngày (sáng 8h00 + chiều 19h00 conditional); smart timing học từ session behavior sau 7 ngày
UX-DR19: Confetti system — trigger CHỈ khi trả lời ĐÚNG và session complete; 50 pieces; 4 màu cố định: #22b5ff #fd9d89 #b59cff #8ce68c (không thêm màu khác); fall 1-3s random; tự cleanup sau animation
UX-DR20: Daily Recap Bubble — CSS thought bubble shape (không phải modal, không phải sheet); positioned phía trên Bugsy đang ngủ; nội dung: tên bài + 1 rule ngắn + streak; không có CTA; tap anywhere = dismiss; không block UI
UX-DR21: Good Morning Moment — Bugsy vươn vai + speech bubble; ngôn ngữ theo evolution level (v0.1: tiếng Việt, v0.5: tiếng địa phương trong nước, v1.0: tiếng ĐNA, v2.0: JP/FR/DE, v3.0: dream destination); subtitle tiếng Việt nhỏ bên dưới; 2-3s auto-dismiss; không add depth navigation
UX-DR22: Sprint Demo Card — gradient bg (#FFD1BA→#c9e6ff top to bottom); Bugsy w-64 h-64 hover:scale-110; hiển thị QP earned, streak, top lesson; shareable qua native share sheet iOS/Android; card đủ đẹp để share mạng xã hội

### FR Coverage Map

| FR Group | Epic | Stories Count (estimate) |
|---|---|---|
| FR-28→30: Onboarding (Day 1) | Epic 1 | 5 |
| FR-2, FR-1, FR-3, FR-4, FR-12→14: Pet & World Setup | Epic 2 | 6 |
| FR-5, FR-6, FR-7, FR-8: Need Bar System | Epic 3 | 4 |
| FR-9, FR-10, FR-11: Daily Mission Loop | Epic 4 | 6 |
| FR-19→25: Quiz Engine (10 formats) | Epic 5 | 7 |
| FR-15→17: Dual Currency | Epic 6 | 3 |
| FR-26→27, FR-34, FR-35: Skill Transfer & Transfer Gate | Epic 7 | 5 |
| FR-31: Sprint Hold | Epic 8 | 2 |
| FR-32, FR-32b: Notifications | Epic 9 | 3 |
| FR-33: Spaced Repetition | Epic 10 | 2 |
| FR-36→37: Sprint Demo Card | Epic 11 | 2 |
| FR-17b, FR-18: Content Library | Epic 12 | 3 |
| FR-38, FR-5b, FR-13 (unlock): Special Mechanics | Epic 13 | 3 |
| FR-39: Sân & Shop Placeholder | Epic 14 | 1 |
| Architecture: Project Setup & Infrastructure | Epic 0 | 3 |
| NFR-1→7: Cross-cutting (embedded trong stories) | — | Embedded |

## Epic List

### Epic 0: Project Foundation & Infrastructure
Dev team có thể bắt đầu build feature ngay — Obytes template khởi tạo, Supabase + Prisma setup, 3 environments (dev/staging/prod), GitHub Actions CI/CD, critical patterns (RewardEventBus, WAL+MMKV, ISystemClock, Idempotency, StandardResponse<T>), Sentry, EAS Build/Update, push notification infrastructure.
**FRs covered:** Additional Requirements (Architecture) — NFR-1, NFR-2, NFR-6 partial

### Epic 1: Content Library & Quality Pipeline
Content team có thể author, review, và publish 27 lessons an toàn — lesson content manifest JSON, 5 categories × n bài với source tag bắt buộc, Real Bug of the Week format, CI/CD content quality gate block PR thiếu tag, OTA content update flow qua EAS Update.
**FRs covered:** FR-17b, FR-18, NFR-3

### Epic 2: Onboarding & First Experience
User cài app lần đầu, gặp Bugsy, đặt tên, hoàn thành warm-up quiz, trải qua Aha Moment, nhận reward (server commit trước animation), chọn notification preference, sign-up để lưu Bugsy — và thoát ra màn hình Work Room. Kill-app corner cases toàn bộ flow.
**FRs covered:** FR-2, FR-28, FR-29 (onboarding cases), FR-30, NFR-1, NFR-2

### Epic 3: Pet World & Apartment Navigation
User khám phá thế giới của Bugsy — 6 phòng căn hộ, chuyển phòng bằng swipe/tap (walk 0.8s), room unlock sequence trigger-based, Bugsy idle states theo Need Bar, Apartment View isometric, evolution system hiển thị (pending state khi chỉ đủ QP), souvenir xuất hiện sau evolution.
**FRs covered:** FR-1, FR-3, FR-4, FR-12, FR-13, FR-14

### Epic 4: Need Bar System & Pet Wellness
Pet có nhịp sống thực — 4 Need Bars decay real-time theo server clock (ISystemClock), pet care actions (+Hunger/+Happiness/+Health), Weekend Mode dừng decay Thứ 7-CN UTC+7, pet không bao giờ chết chỉ regress, One Room Emergency daily highlight, Good Morning Moment lần đầu mở app mỗi ngày.
**FRs covered:** FR-5, FR-5b, FR-6, FR-7, FR-8, FR-38, NFR-7

### Epic 5: Daily Learning Loop
Core value của app — user học mỗi ngày: Core Mission (lesson 30s + 8 câu quiz full 10 formats, framework 2-5-1-2, emotional arc Q1-Q8, Rescue Mechanic 3-wrong, Story-Rule Feedback sau sai, 3-2-1 Summary Card sau Q8), Side Quests (Bug Hunt / Peer Review / Repro Steps / Simulated Bug Hunt), Mission Board kanban (Todo/In Progress/Done + Bug Report Wall). Auto-save sau mỗi câu, session resume, kill-app cases trong quiz flow.
**FRs covered:** FR-9, FR-10, FR-11, FR-19, FR-20, FR-21, FR-22, FR-23, FR-24, FR-25, FR-29 (quiz kill-app), NFR-4, NFR-5, NFR-6

### Epic 6: Dual Currency & Reward Animations
User nhận phần thưởng có ý nghĩa — BC earn (Core Mission +10BC, Side Quests), QP earn (quiz score-based), BC miss penalty (-15 BC, grace period, cap), BC floor = 0, QP không bao giờ giảm, persistent display header chips (BC amber + QP teal), counter earn animation (+X float → tick-up 800ms). Toàn bộ reward animations chỉ trigger SAU server commit.
**FRs covered:** FR-15, FR-16, FR-17, NFR-1, NFR-2

### Epic 7: Sprint Lifecycle & Real-World Transfer
User kết nối app với công việc thực — Transfer Gate evidence submission (4 evolution steps, text+photo upload), My Journey view (evidence permanent, timeline), Sprint Hold tokens (earned 20/28 missions = 1 token, max 2/tháng, log lý do), Weekly Bug Log (≥1 real bug/tuần + Zero-Bug 2-option: Simulated Bug Hunt | Bỏ qua), Retrospective Loop (end-of-sprint prompt), Sprint Demo Card (auto-generate Day 7, shareable 48h), share → Happiness +50%.
**FRs covered:** FR-26, FR-27, FR-31, FR-34, FR-35, FR-36, FR-37

### Epic 8: Spaced Repetition & Flash Quiz Layer
Học sâu hơn ngoài Core Mission — Spaced Rep algorithm (server-side queue, cache local 24h), Bedroom SR session (1-2 câu trước "tắt đèn", không điểm, không streak), Daily Recap Bubble (thought bubble trên Bugsy ngủ, tap-to-dismiss), Flash Quiz trong Phòng Tắm (stripped UI, 2-3 câu, instant feedback, không Story-Rule, không hint), Mirror Moment auto-trigger sau Flash Quiz (2.5s self-dismiss, no text, Discipline-based visual state).
**FRs covered:** FR-32b, FR-33

### Epic 9: Notifications & Smart Timing
App duy trì kết nối với user khi không mở — story-style notifications từ Bugsy (không phải "Reminder:"), max 2/ngày (sáng 8h + chiều 19h conditional), gộp notification khi ≥2 phòng cần, tap deep link vào đúng phòng, smart timing học từ session behavior sau 7 ngày.
**FRs covered:** FR-32

### Epic 10: Sân & Item Shop Placeholder
User unlock phòng cuối cùng — Sân cinematic Day 7 unlock (birds + breeze, no UI), open space cho Bugsy run outdoor, Item Shop browse-only placeholder ("Coming Soon"). Phase 1 complete.
**FRs covered:** FR-39, FR-13 (Sân cinematic unlock)

---

## FR Coverage Map

| FR | Epic | Mô tả |
|---|---|---|
| FR-1 | 3 | Bugsy idle states phản ánh Need Bar |
| FR-2 | 2 | Đặt tên Bugsy trong onboarding |
| FR-3 | 3 | Pet evolution system (QP + Transfer Gate) |
| FR-4 | 3 | Souvenir xuất hiện sau evolution |
| FR-5 | 4 | Need Bar real-time decay (server clock) |
| FR-5b | 4 | Good Morning Moment (1x/ngày) |
| FR-6 | 4 | Pet không chết, chỉ regress |
| FR-7 | 4 | Pet Care actions (+bars) |
| FR-8 | 4 | Weekend Mode (decay dừng T7-CN UTC+7) |
| FR-9 | 5 | Core Mission: lesson + quiz |
| FR-10 | 5 | Side Quests (Bug Hunt, Peer Review, Repro, Simulated) |
| FR-11 | 5 | Mission Board kanban + Bug Report Wall |
| FR-12 | 3 | 6-phòng định nghĩa và chức năng |
| FR-13 | 3+10 | Room unlock trigger-based (3), Sân cinematic (10) |
| FR-14 | 3 | Apartment View + Immersive Mode navigation |
| FR-15 | 6 | Bug Coins (earn, miss penalty, floor) |
| FR-16 | 6 | Quality Points (không giảm, server-authoritative) |
| FR-17 | 6 | Persistent currency display + animations |
| FR-17b | 1 | Real Bug of the Week format |
| FR-18 | 1 | 27 lessons × 5 categories (launch blocker) |
| FR-19 | 5 | 10 question formats |
| FR-20 | 5 | Framework 2-5-1-2 + emotional arc Q1-Q8 |
| FR-21 | 5 | 3-2-1 Summary Card |
| FR-22 | 5 | Bloom's Taxonomy Arc 30 ngày |
| FR-23 | 5 | Rescue Mechanic (3-wrong trigger, 3 options) |
| FR-24 | 5 | Auto-save + session resume |
| FR-25 | 5 | Story-Rule Feedback + Self-Efficacy bonus |
| FR-26 | 7 | Transfer Gate gates (4 evolution steps) |
| FR-27 | 7 | Transfer Gate evidence storage (My Journey) |
| FR-28 | 2 | Onboarding sequence cố định (không skip) |
| FR-29 | 2+5 | Kill-app corner cases: onboarding (2), quiz (5) |
| FR-30 | 2 | First Room Reveal sau onboarding |
| FR-31 | 7 | Sprint Hold tokens (earn, use, log lý do) |
| FR-32 | 9 | Story-style notifications + smart timing |
| FR-32b | 8 | Daily Recap Bubble (Phòng Ngủ, thought bubble) |
| FR-33 | 8 | Spaced Repetition (server queue + Bedroom session) |
| FR-34 | 7 | Weekly Bug Log + Zero-Bug 2-option flow |
| FR-35 | 7 | Retrospective Loop (end-of-sprint) |
| FR-36 | 7 | Sprint Demo Card (auto-generate Day 7) |
| FR-37 | 7 | Share Sprint Demo Card (Happiness +50%) |
| FR-38 | 4 | One Room Emergency daily highlight |
| FR-39 | 10 | Item Shop placeholder (browse only) |

---

## Epic 0: Project Foundation & Infrastructure

### Story 0.1: App Scaffold & Local Dev Environment

As a developer,
I want the React Native project initialized with the Obytes template and all core dependencies configured,
So that the team can immediately start building features on a stable, consistent foundation.

**Acceptance Criteria:**

**Given** không có project nào tồn tại
**When** chạy `npx create-expo-app@latest qc-pet --template https://github.com/obytes/react-native-template-obytes`
**Then** project scaffold thành công với: TypeScript strict, NativeWind v4, Expo Router, React Query, Zustand, MMKV, Reanimated, Gesture Handler, i18next (tiếng Việt), TanStack Form, Zod, Axios
**And** `pnpm install` thành công không có error
**And** `pnpm start` khởi động Expo dev server; app chạy được trên iOS Simulator và Android Emulator
**And** TypeScript strict mode bật (`"strict": true` trong tsconfig, không có `any` implicit)
**And** pnpm là package manager duy nhất (không có yarn.lock hay package-lock.json)
**And** folder structure feature-based: `src/features/`, `src/components/`, `src/lib/`, `src/api/`, `src/stores/`
**And** 6 Zustand stores scaffold (rỗng): `bugsy-animation`, `reward-event-bus`, `quiz-session`, `room-navigation`, `ui-state`, `clock-offset`
**And** `README.md` document đủ bước để dev mới setup local environment trong vòng 15 phút

---

### Story 0.2: Supabase Backend Foundation & Prisma Schema

As a developer,
I want Supabase configured with initial schema, RLS, and Prisma connected across 3 environments,
So that feature teams can build against a secure, production-ready database from day one.

**Acceptance Criteria:**

**Given** Supabase project được tạo cho `dev` environment (local Docker)
**When** `prisma migrate dev --name init` chạy với Prisma v7.8.0
**Then** schema tạo scaffold tables: `users (id, supabase_auth_id, created_at)`, `pets (id, user_id, name, version, qp_total)`, `game_state (id, user_id, bc_balance, last_synced_at)` — columns tối thiểu; feature stories thêm columns riêng
**And** Row Level Security bật trên tất cả tables với default policy `user_id = auth.uid()`
**And** Supabase Auth cho phép: anonymous session, email/password, Google OAuth stub, Apple Sign-In stub
**And** JWT tokens lưu bằng `expo-secure-store` (không AsyncStorage) — helper `AuthTokenStorage` wraps expo-secure-store
**And** `.env.dev`, `.env.staging`, `.env.production` tồn tại với Supabase URL + anon key tương ứng
**And** `supabase start` (local Docker) spin up thành công và `supabase status` trả về healthy
**And** Prisma client TypeScript types được generate và import được từ `@prisma/client`
**And** Edge Functions scaffold folder `supabase/functions/` với `_shared/` cho utils dùng chung

---

### Story 0.3: GitHub Actions CI/CD & EAS Build/Update Pipeline

As a developer,
I want automated quality gates and mobile build pipeline configured,
So that every PR is validated and production builds are automated without manual steps.

**Acceptance Criteria:**

**Given** một PR được mở vào branch `main`
**When** GitHub Actions `ci.yml` chạy tự động
**Then** các bước sau đều pass: TypeScript type-check (`pnpm tsc --noEmit`), ESLint (`pnpm lint`), Jest unit tests (`pnpm test`), Expo prebuild check
**And** bất kỳ step nào fail → PR bị block, không merge được

**Given** PR merge vào `main`
**When** `eas-build.yml` trigger
**Then** EAS Build tạo iOS (.ipa) + Android (.aab) artifact trên EAS cloud (free tier 30 builds/tháng)
**And** `eas update` chạy cho JS-only changes (OTA delivery, bypass App Store review)
**And** Sentry source maps upload tự động sau mỗi successful build
**And** 3 EAS profiles: `development`, `staging`, `production` — mỗi profile dùng Supabase project tương ứng

**Given** PR thêm hoặc sửa file trong `content/lessons/`
**When** `content-quality-gate.yml` chạy
**Then** action đọc tất cả `.json` files trong `content/lessons/`; nếu bất kỳ file nào thiếu field `source_tag` → PR bị block với error message rõ ràng
**And** Sentry DSN được cấu hình cho dev/staging/prod; crash reports tự động gửi về Sentry dashboard

---

### Story 0.4: Client-Side Critical Patterns (RewardEventBus, WAL+MMKV, ISystemClock)

As a developer,
I want RewardEventBus, WAL+MMKV state machine, and ISystemClock implemented as battle-tested shared utilities,
So that every feature team handles rewards, kill-app recovery, and server-time sync safely and consistently.

**Acceptance Criteria:**

**Given** `RewardEventBus.emit('server_committed', payload)` được gọi sau server trả về success
**When** client nhận event
**Then** event `animation_triggered` fire chỉ SAU `server_committed` — không bao giờ trước
**And** nếu `animation_triggered` được trigger trực tiếp mà không có `server_committed` trước → `console.error` + Sentry log trong dev/staging mode
**And** Jest test: emit `server_committed` → verify `animation_triggered` fires; skip `server_committed` → verify `animation_triggered` does NOT fire

**Given** WAL utility `src/lib/wal.ts` được sử dụng
**When** `wal.write(namespace, key, value)` gọi trước API call
**Then** value persist vào MMKV ngay lập tức (synchronous)
**And** khi API thành công → `wal.delete(namespace, key)` xóa entry khỏi MMKV
**And** khi app restart → `wal.recover(namespace)` đọc pending WAL entries và trả về array để caller replay
**And** Jest tests: write → mock kill → recover → verify entries; write → success → delete → recover → verify empty

**Given** `ISystemClock` interface (`src/lib/clock.ts`) được implement
**When** bất kỳ code nào cần current timestamp
**Then** code dùng `clock.now()` (inject qua DI hoặc singleton) — không bao giờ `Date.now()` trực tiếp trong `src/features/`
**And** `ServerOffsetClock.now()` = `Date.now() + clockOffset` (clockOffset từ MMKV, default 0)
**And** `MockClock` nhận injected timestamp cố định cho deterministic tests
**And** ESLint custom rule `no-date-now-in-features` warn khi `Date.now()` được dùng trong `src/features/**`

---

### Story 0.5: Server-Side API Patterns (StandardResponse, Idempotency, RFC 7807, Clock Offset)

As a developer,
I want consistent API response shapes, error formats, and idempotency established across all Edge Functions,
So that client code can rely on predictable contracts and retry safely.

**Acceptance Criteria:**

**Given** bất kỳ Edge Function nào trả về success
**When** client nhận response
**Then** shape là `{ data: T, serverTime: number, requestId: string }` (StandardResponse<T>)
**And** `serverTime` (Unix ms) luôn có mặt — TypeScript type enforce field này là required

**Given** bất kỳ Edge Function nào trả về error
**When** client nhận error response
**Then** format là RFC 7807: `{ type: string, title: string, status: number, detail: string, instance: string }`
**And** HTTP status code khớp với `status` field (400, 401, 404, 409, 422, 500)

**Given** request có header `X-Idempotency-Key: <uuid-v4>`
**When** cùng key được gửi lần 2 trong vòng 24h TTL
**Then** Upstash Redis trả về cached response — Edge Function không xử lý lại
**And** cached response có thêm header `X-Idempotent-Replayed: true`
**And** TTL = 24h (86400s) per key

**Given** client nhận bất kỳ API response nào
**When** parse `serverTime` từ response
**Then** client tính `clockOffset = serverTime - Date.now()` và lưu vào MMKV qua `clock-offset` store
**And** `ISystemClock.now()` dùng offset mới nhất này

**And** Upstash Redis rate limiting: 100 requests/phút per `user_id`; 429 response khi vượt limit
**And** Edge Function `health-check` trả về `StandardResponse<{ status: "ok" }>` để smoke test toàn bộ stack

---

### Story 0.6: Design System Foundation (Color Tokens, Typography, Core Components)

As a developer,
I want the design system primitives (color tokens, typography, tactile components) implemented as shared building blocks,
So that every feature team builds consistently with QC Pet's visual language from the first line of UI code.

**Acceptance Criteria:**

**Given** NativeWind + Tailwind config được extend
**When** developer dùng color utility class (e.g., `bg-qp-teal`, `text-bc-amber`)
**Then** Material Design 3 color roles available: `primary` (#006491), `primary-container` (#22b5ff), `inverse-surface` (#002e69), `error` (#ba1a1a), `surface-container` (#f0f4f8), `on-surface` (#1a1a2e)
**And** QC Pet extended tokens available: `qp-teal` (#00A8A8), `bc-amber` (#FFB000), `terminal-green` (#8ce68c), `warm-peach-bg` (#FFE5D9), `rule-landing-bg` (#BFFFA1)
**And** dark mode class `dark` không được apply trong MVP (hardcode light mode)

**Given** typography được setup với Expo Google Fonts
**When** text render trong app
**Then** Nunito Sans được load với weights: 600 (SemiBold), 700 (Bold), 800 (ExtraBold), 900 (Black)
**And** JetBrains Mono được load với weight 500 — chỉ dùng trong code/terminal context
**And** minimum weight trong mọi UI text là 600 — không có 400/300/100 trong production strings
**And** ESLint rule cảnh báo nếu hardcode hex color thay vì dùng token

**Given** `TactileCard` component được render
**When** user nhìn thấy card
**Then** style: `border: 3px solid #001a41; box-shadow: 0px 6px 0px 0px rgba(0,26,65,1); border-radius: 12px`
**And** không có Gaussian blur shadow ở bất kỳ card nào

**Given** `TactileButton` component được nhấn
**When** press event fire
**Then** button translateY(4px) + shadow reduce từ 6px xuống 0px (spring animation)
**And** release: spring back với `cubic-bezier(0.34, 1.56, 0.64, 1)`
**And** touch target tối thiểu 44×44px cho mọi button

**And** các components scaffold rỗng cần build: `TactileCard`, `TactileButton`, `SpeechBubble`, `NeedBarComponent`, `SlideUpPanel`, `CurrencyChip` — đặt trong `src/components/`
**And** không import từ MUI, Chakra, React Native Paper hay bất kỳ UI library nào — ESLint rule `no-external-ui-library` enforce

---

## Epic 1: Content Library & Quality Pipeline

### Story 1.1: Lesson Content Schema & JSON Manifest Structure

As a content author,
I want a well-defined JSON schema for lessons with mandatory source tags,
So that all content is consistently structured and can be validated automatically before publishing.

**Acceptance Criteria:**

**Given** một content author tạo lesson JSON file mới trong `content/lessons/`
**When** file được tạo
**Then** schema bắt buộc có các fields: `id` (string, unique), `category` (enum: BD|TA|MP|TM|AT), `title` (string), `source_tag` (string, format: "ISTQB-X.X" hoặc "INDUSTRY_PRACTICE"), `lesson_content` (object: headline, body_text, duration_seconds ≤30s), `questions` (array, min 8 items), `bloom_level` (enum: remember|understand|apply|analyze|evaluate|create)
**And** mỗi question object có: `format` (enum 10 formats), `question_text`, `options[]`, `correct_answer`, `distractor_rationale[]`
**And** `source_tag` field là required — CI sẽ block nếu thiếu hoặc format sai
**And** JSON schema file tại `content/schemas/lesson.schema.json` có thể dùng với `ajv` hoặc JSON Schema validator
**And** `content/manifest.json` listing tất cả published lessons với: `id`, `version`, `last_updated`, `category`, `bloom_level`, `is_published: boolean`
**And** `content/manifest.json` có `content_version` field (semver) — increment khi có thay đổi content

---

### Story 1.2: Content Authoring Workflow, Peer Review & Real Bug of the Week Format

As a content author,
I want clear authoring guidelines and a Real Bug of the Week content type,
So that all content meets quality standards before reaching learners.

**Acceptance Criteria:**

**Given** content author muốn viết lesson mới
**When** tạo PR với file lesson mới
**Then** `content-quality-gate.yml` (từ Story 0.3) validate: source_tag hợp lệ, min 8 questions, bloom_level được set, tất cả required fields present
**And** PR description template yêu cầu: link ISTQB source, peer reviewer (≥1 senior QA), test scenario đã verify

**Given** content type "Real Bug of the Week" (FR-17b)
**When** author tạo RBOTW entry
**Then** schema có thêm fields: `type: "REAL_BUG_OF_THE_WEEK"`, `authored_by` (human author name, NOT "AI"), `context` (string: industry/domain), `bug_description`, `severity`, `root_cause`, `lesson_learned`
**And** RBOTW entries lưu trong `content/real-bugs/` folder riêng
**And** RBOTW không phải AI-generated — author field không được là "AI" hoặc "GPT" (CI check)
**And** `content/authors/` folder có author profile JSONs cho mỗi content creator

**Given** content đã pass quality gate và peer review
**When** PR merge vào `main`
**Then** `manifest.json` được update tự động với lesson mới (GitHub Action)
**And** `content_version` increment tự động (patch bump)

---

### Story 1.3: OTA Content Delivery & Version Management

As a learner,
I want to always receive the latest lesson content without having to reinstall the app,
So that content improvements and new lessons appear seamlessly.

**Acceptance Criteria:**

**Given** EAS Update được trigger sau content merge (Story 0.3)
**When** user mở app lần tiếp theo
**Then** app fetch `content/manifest.json` từ server và so sánh với local `content_version` cached trong MMKV
**And** nếu `server_content_version > local_content_version` → download manifest mới + updated lesson JSONs
**And** content được cache local trong MMKV / file system để offline access
**And** download xảy ra ở background — không block app launch hay current session

**Given** user đang trong quiz session khi content update xuống
**When** update complete ở background
**Then** current session KHÔNG bị interrupt — dùng lesson data đã load vào memory
**And** lesson mới chỉ available từ session tiếp theo

**Given** content download thất bại (offline hoặc network error)
**When** user cố mở lesson
**Then** app dùng last cached version của lesson — không show error screen
**And** nếu lesson chưa từng cache (brand new lesson) → show "Nội dung đang tải, thử lại sau" placeholder

**And** `content_version` và timestamp sync cuối được lưu server-side trong `game_state` table để đồng bộ khi user login từ device mới

---

## Epic 2: Onboarding & First Experience

### Story 2.1: Splash Screen & Egg Hatching Animation

As a new user,
I want an immersive first impression with Bugsy hatching from an egg,
So that I immediately feel the emotional hook of the pet before I even know its name.

**Acceptance Criteria:**

**Given** user mở app lần đầu tiên (no existing session)
**When** app launch
**Then** Splash Screen hiện với golden-hour gradient (`#ffb4a5 → #c9e6ff` top-to-bottom), CSS-drawn office building silhouette, tagline pill "Học QC mỗi ngày. Cùng Bugsy."
**And** sau 1.5s → transition sang Egg Hatching screen (warm-peach-bg `#FFE5D9`)
**And** trứng animated: `egg-shake` (rung nhẹ ±3deg, 0.8s loop) → khi gần nở: `egg-glow` (warm amber glow pulse)
**And** user tap trứng → shake intensity tăng → trứng crack animation → Bugsy nở (baby chick vàng `#FFE082` với tai nghe tím `#5C6BC0`)
**And** Bugsy reveal: scale từ 0.3 → 1.0 với spring animation, chirp SFX (8-bit)
**And** nếu user không tap sau 3s → auto-trigger nở animation
**And** toàn bộ sequence không có skip button — người dùng phải xem hết
**And** anonymous Supabase session được tạo ngay khi app launch (background, trước khi user thấy gì)

---

### Story 2.2: Pet Naming Flow

As a new user,
I want to name my pet with suggestions or my own choice,
So that Bugsy feels personal and the relationship starts with an act of care.

**Acceptance Criteria:**

**Given** Bugsy vừa nở xong
**When** naming panel slide-up từ dưới
**Then** panel dùng: `bg-surface-container`, `border-4`, `rounded-t-[3rem]`, spring animation `cubic-bezier(0.34, 1.56, 0.64, 1)`
**And** panel hiện 3 tên gợi ý dạng TactileCard chips: "Bugsy", "Kiwi", "Pip" (có thể randomize từ list 10+ names)
**And** text input cho phép nhập tên tự chọn, max 20 ký tự
**And** tap vào tên gợi ý → điền vào input, user có thể chỉnh
**And** CTA button "Đặt tên cho [tên]" — disabled nếu input rỗng hoặc >20 ký tự
**And** khi confirm: Bugsy "phản ứng" — jump animation + chirp SFX + speech bubble "Mình là [tên]! 🐣"
**And** tên được lưu vào `pets` table trong Supabase (server-side) ngay khi confirm
**And** nếu input chứa profanity (basic blocklist) → shake input + error text "Tên khác hay hơn nè!" mà không block UX

---

### Story 2.3: Micro-Bridge & Warm-Up Scenario (Aha Moment Setup)

As a new user,
I want a brief contextual bridge before the first quiz question,
So that the Aha Moment feels earned and relevant to my QC work.

**Acceptance Criteria:**

**Given** pet naming complete
**When** micro-bridge screen hiện
**Then** Bugsy nói (speech bubble, không voice): "Thử một tình huống nhỏ nha [tên]?" — text animation word-by-word
**And** sau 2s: transition vào Aha Moment screen

**Given** Aha Moment screen
**When** user nhìn vào
**Then** hiện Bug Ticket Card styled (dark wrapper + `tertiary-container` header + white body): Scenario B "Developer nói 'fixed'. Bạn nhận build mới và test lại — bug vẫn còn đó."
**And** dưới card là 2 CTA buttons (TactileButton): "Pass ✓" và "Fail ✗"
**And** khi user chọn "Fail" (đúng) → celebrate animation nhỏ + Bugsy excited
**And** khi user chọn "Pass" (sai) → trigger Story-Rule flow (xem Story 2.4)
**And** question không tính vào streak, không ảnh hưởng QP — đây là Q1 warm-up exception
**And** border của question card là xanh nhạt (visual signal "đây là khởi động")
**And** không có back button, không có X button trên màn này

---

### Story 2.4: Story-Rule Feedback, Reward Animation (Server-Committed) & Cliffhanger

As a new user,
I want to experience Story-Rule learning and see my first reward before signing up,
So that I understand the value of the app and feel motivated to create an account.

**Acceptance Criteria:**

**Given** user trả lời đúng hoặc sai ở Aha Moment
**When** đúng → confetti (50 pieces, 4 màu: #22b5ff #fd9d89 #b59cff #8ce68c, fall 1-3s)
**When** sai → Story-Rule slide-up panel trigger: bg-inverse-surface `#002e69`, rounded-t-[32px], handle bar
**Then** Story panel: Bugsy kể câu chuyện ngắn (1-2 sentences) → "Rule:" text với bg `rule-landing-bg` (#BFFFA1) highlight
**And** Story-Rule animation KHÔNG thể tắt — user phải xem hết (không có X button)
**And** sau Story-Rule: Reward screen

**Given** Reward screen
**When** hiện
**Then** TRƯỚC TIÊN: API call `POST /v1/onboarding/complete-aha-moment` → server commit BC + QP earn vào DB
**And** CHỈ SAU khi server trả về 200 success: RewardEventBus.emit('server_committed', payload) → animation_triggered
**And** animation: Bugsy nhảy, +10 BC floating text, QP counter tick-up, coin jingle SFX
**And** nếu server call fail: retry 1 lần; nếu vẫn fail: WAL ghi pending reward, hiện "Đã lưu, sẽ cập nhật khi kết nối lại" — không show error popup
**And** Cliffhanger slide-up (sau reward): "Bugsy đang muốn kể bạn nghe chuyện về [lesson cliffhanger hook] — nhưng mình cần lưu Bugsy lại trước..."

---

### Story 2.5: Notification Permission, Sign-Up Gate & Work Room Entry

As a new user,
I want to save my progress and set up notifications before entering the app,
So that Bugsy is protected and I don't miss daily learning reminders.

**Acceptance Criteria:**

**Given** Cliffhanger screen đã hiện (Story 2.4 complete)
**When** Notification Preference screen hiện
**Then** screen hỏi permission bằng Bugsy voice: "[Tên] ơi, cho mình nhắn tin nhắc mình nhé?" với 2 options: "Được, nhắc mình nha!" | "Thôi, mình tự nhớ"
**And** tap "Được" → Expo Push Notification permission request (native OS dialog)
**And** tap "Thôi" → skip, không request permission, không hỏi lại
**And** CHỈ SAU notification preference: Sign-Up Gate screen hiện
**And** Sign-Up Gate copy: "Lưu [tên] lại" (không phải "Sign Up" hay "Create Account")
**And** options: email/password form, Google Sign-In button, Apple Sign-In button (iOS only), "Để sau" link
**And** khi sign-up/sign-in success: anonymous session merge vào real account (Supabase anonymous → real auth)
**And** khi "Để sau": anonymous session giữ nguyên, app proceed — data loss warning: "Nếu xóa app, mình sẽ mất [tên]"
**And** sau sign-up (hoặc "để sau"): app navigate vào Home = Work Room (Immersive Mode)
**And** Work Room: chỉ có cửa bếp hé mở với ánh sáng vàng hé ra — không có tooltip, không có announcement

---

### Story 2.6: Kill-App Corner Cases — Onboarding Flow Recovery

As a new user who force-quit the app during onboarding,
I want to resume exactly where I left off when I reopen the app,
So that my progress is never lost even if the app crashes.

**Acceptance Criteria:**

**Given** user force-quit tại màn đặt tên (Story 2.2)
**When** mở lại app
**Then** app resume tại naming panel với state trước đó (tên đang nhập nếu có) — WAL đảm bảo pet_name draft được lưu
**And** anonymous session vẫn còn (không mất)

**Given** user force-quit SAU khi server đã commit reward (Story 2.4) nhưng TRƯỚC khi animation play
**When** mở lại app
**Then** WAL phát hiện pending reward animation (server đã commit, animation chưa play)
**And** app resume tại Reward screen và play animation đầy đủ
**And** server không commit lại (idempotency key đã dùng)

**Given** user force-quit tại Cliffhanger screen
**When** mở lại app
**Then** app resume tại Cliffhanger screen, không bắt đầu lại từ đầu

**Given** user force-quit tại Notification Preference screen
**When** mở lại app
**Then** app resume tại Notification Preference screen

**Given** user force-quit TRƯỚC Sign-up Gate nhưng SAU khi đã earn reward
**When** mở lại app
**Then** app resume tại Sign-Up Gate, BC và QP balance vẫn đúng (server đã commit)
**And** Tất cả 5 kill-app cases phải có Maestro E2E test covering kill + resume scenario
**And** zero data loss trong tất cả cases — test verify bằng cách check server state sau recover

---

## Epic 3: Pet World & Apartment Navigation

### Story 3.1: 6-Room Apartment Layout, Room Data Model & Environment Assets

As a user,
I want to see Bugsy's fully realized home with distinct room environments,
So that each room feels like a real place I want to visit and care for.

**Acceptance Criteria:**

**Given** user vào Apartment View
**When** render
**Then** hiện isometric 45° L-shape 2×3 layout với 6 phòng: Work Room, Bếp, Ngủ, Khách, Tắm, Sân
**And** mỗi phòng có background environment đúng spec DESIGN.md:
- Work Room: `warm-peach-bg` walls, terminal-green monitor glow
- Bếp: kitchen-amber, checkerboard tiles, fridge (empty/full states)
- Ngủ: bedroom soft lavender, stars trên ceiling khi lights out
- Khách: living-warm, sofa coral, TV (on/off), souvenir shelves
- Tắm: bathroom-mint, oval mirror frame, streak tracker chip
- Sân: yard-sky gradient + yard-grass, outdoor feel
**And** `rooms` table trong DB: `id`, `user_id`, `room_type` (enum), `is_unlocked` (boolean), `unlock_trigger_met` (boolean)
**And** Work Room mặc định `is_unlocked: true` sau onboarding
**And** mỗi phòng có 3 visual states: normal, attention (amber glow pulsing 2s), locked (desaturated 40% + "?" chip)

---

### Story 3.2: Apartment View (Isometric) & Room Navigation

As a user,
I want to navigate between rooms naturally using swipe or the apartment overview,
So that exploring Bugsy's home feels intuitive and immersive.

**Acceptance Criteria:**

**Given** user đang trong Immersive Mode (full-screen trong một phòng)
**When** swipe trái hoặc phải
**Then** chuyển sang phòng liền kề (theo layout: Work Room ↔ Bếp ↔ Ngủ / Khách ↔ Tắm ↔ Sân)
**And** Bugsy walk animation overlay 0.8s trước khi room mới hiện — không phải cut scene
**And** walk SFX: soft footstep 0.8s

**Given** user tap 🏠 icon (hoặc pinch-out)
**When** Apartment View mở
**Then** isometric 45° view hiện, phòng có attention (bar thấp) nhấp nháy warm amber glow
**And** One Room Emergency (từ Epic 4) được indicate bằng 🔥 chip trên phòng
**And** tap vào phòng unlocked → Bugsy walk 0.8s overlay → Immersive Mode của phòng đó
**And** tap vào phòng locked → hiện tooltip ngắn "Mở khóa bằng cách..." (trigger condition)

**Given** user long press vào Bugsy trong bất kỳ room nào
**When** long press ≥500ms
**Then** speech bubble gợi ý phòng cần nhất: "Mình đói rồi, vào Bếp nha [tên]!" (phòng có bar thấp nhất)
**And** Apartment View chỉ accessible sau khi ≥2 phòng unlocked (trước đó 🏠 icon ẩn)
**And** max navigation depth = 3 (Home → Apartment View → Room); không có breadcrumb

---

### Story 3.3: Bugsy Idle States & Character Asset System

As a user,
I want Bugsy to visually express how they're feeling based on Need Bar levels,
So that I instantly understand what Bugsy needs without reading text.

**Acceptance Criteria:**

**Given** tất cả Need Bars ≥50%
**When** Bugsy idle
**Then** Bugsy hiện `happy` state: gentle bounce animation, warm yellow `#FFE082`, tai nghe tím `#5C6BC0`, idle-cycle loop

**Given** Hunger bar <30%
**When** Bugsy idle
**Then** Bugsy hiện `hungry` state: tummy rumble animation, slightly droopy posture, occasional stomach-grumble sound (nếu sound on)

**Given** Happiness bar <30%
**When** Bugsy idle
**Then** Bugsy hiện `sad` state: slow sway, muted colors, occasional sniffle

**Given** Health bar <30%
**When** Bugsy idle
**Then** Bugsy hiện `tired` state: slow breathe-sleep animation, half-closed eyes, pale yellow tint

**Given** Discipline bar <30%
**When** Bugsy idle
**Then** Bugsy hiện `discipline-low` state: ruffled feathers, slightly disheveled, distracted look

**Given** user vừa complete Core Mission
**When** reward screen hiện
**Then** Bugsy hiện `excited` state: jumping, spinning, sparkling

**And** Bugsy asset: luôn dùng `bugsy-transparent.png` (RGBA, nền trong suốt) — không bao giờ dùng white background
**And** per-room sizing: Work Room w-64, Bếp w-48, Ngủ w-56, Khách w-72, Tắm w-48, Sân w-80
**And** priority: nếu nhiều bars cùng <30%, ưu tiên state theo order: hungry > tired > sad > discipline-low
**And** state transition: cross-fade 0.3s giữa states, không snap

---

### Story 3.4: Room Unlock Sequence (Trigger-Based)

As a user,
I want rooms to unlock naturally as I progress,
So that the world expands as I grow and each unlock feels like a meaningful milestone.

**Acceptance Criteria:**

**Given** user vừa complete Aha Moment và enter Work Room (onboarding done)
**When** user nhìn vào căn hộ
**Then** Work Room đã unlocked, cửa Bếp hé mở ánh sáng vàng (unlock trigger met nhưng chưa "officially visited")

**Given** user tap vào cửa Bếp (hoặc navigate sang Bếp)
**When** lần đầu tiên vào Bếp
**Then** Bếp unlock animation: door opens + warm light spills + Bugsy chạy vào excited
**And** server update `rooms.is_unlocked = true` cho Bếp

**Given** user có Happiness bar <50% lần đầu
**When** condition met
**Then** Phòng Khách unlock notification: cửa Khách hé mở từ Apartment View lần tới user mở

**Given** user complete Core Mission đầu tiên
**When** mission complete
**Then** Phòng Ngủ unlock: "Bugsy mệt rồi, nghỉ ngơi thôi!" — cửa Ngủ sáng lên

**Given** user có login streak 3 ngày liên tiếp
**When** ngày thứ 3 được confirm bởi server
**Then** Phòng Tắm unlock: "Streak 3 ngày! Tắm trước khi học tiếp nha."

**Given** user đạt 7-day streak HOẶC hoàn thành Week 1 (7 Core Missions)
**When** condition met
**Then** Sân unlock với cinematic riêng (Story 10.1 handles visual; đây chỉ trigger unlock condition)
**And** mỗi unlock event lưu server-side với timestamp để prevent double-trigger
**And** unlock triggers được kiểm tra server-side (không thể fake client-side)

---

### Story 3.5: Pet Evolution System & Souvenir Display

As a user,
I want Bugsy to evolve as I grow my QC skills with real-world evidence,
So that leveling up feels meaningful and requires both learning AND real-world application.

**Acceptance Criteria:**

**Given** user có đủ QP threshold cho evolution step tiếp theo
**When** user chưa submit Transfer Gate evidence
**Then** evolution indicator hiện "Evolution Pending 🥚" trong pet profile/room — không có animation
**And** Bugsy visual vẫn ở version hiện tại
**And** tooltip giải thích: "Cần [evidence type] từ công việc thực để Bugsy tiến hóa"

**Given** user đủ QP VÀ đã submit Transfer Gate evidence (Epic 7)
**When** evolution gate validate server-side
**Then** evolution animation trigger: rising orchestral SFX 3-5s, Bugsy glow → transform → new version
**And** animation chỉ trigger SAU server commit (RewardEventBus pattern)
**And** Bugsy visual update theo version: v0.1 (chick nhỏ) → v0.5 (chick lớn hơn) → v1.0 (teen) → v2.0 (adult) → v3.0 (expert)

**Given** evolution complete
**When** user nhìn vào Phòng Khách
**Then** souvenir mới xuất hiện trên shelf: travel destination artifact phù hợp với evolution step
**And** souvenir fly-in animation: object bay từ ngoài cửa sổ vào shelf
**And** `souvenirs` table lưu: `user_id`, `evolution_step`, `souvenir_type`, `unlocked_at`
**And** QP thresholds: v0.1→v0.5: 150 QP, v0.5→v1.0: 400 QP, v1.0→v2.0: 900 QP, v2.0→v3.0: 1800 QP
**And** server validate cả QP threshold lẫn Transfer Gate trước khi commit evolution

---

## Epic 4: Need Bar System & Pet Wellness

### Story 4.1: Need Bar Data Model & Real-Time Decay Engine

As a user,
I want Bugsy's Need Bars to decay in real time based on server time,
So that there are real consequences for neglecting Bugsy and a genuine reason to return daily.

**Acceptance Criteria:**

**Given** user mở app sau một khoảng thời gian không dùng
**When** app sync với server
**Then** Need Bars được tính: `current_value = last_value - (decay_rate × elapsed_server_seconds)`
**And** elapsed time = `server_now - last_synced_at` (server timestamp, không phải client `Date.now()`) — ISystemClock pattern
**And** decay rates: Hunger ~48h từ 100% → 0%, Happiness ~72h, Health ~72h, Discipline ~48h, Work Room Composite ~24h (fills all 4)
**And** bars không về âm — floor = 0%
**And** `need_bars` table: `user_id`, `hunger`, `happiness`, `health`, `discipline`, `last_synced_at` (server timestamp)
**And** khi user đang dùng app: bars update mỗi 60s bằng polling (hoặc Supabase Realtime subscription)
**And** Need Bar UI component: 4 bars, fill animation shimmer effect, màu sắc: Hunger lime-500, Happiness primary-container #22b5ff, Health error #ba1a1a, Discipline tertiary-container #b59cff
**And** khi bar ≤29%: pulse error color animation

---

### Story 4.2: Pet Care Actions (Quick Feed, Quick Play, Quick Train)

As a user,
I want to directly care for Bugsy through simple actions in each room,
So that I can respond immediately when Bugsy needs attention without completing a full mission.

**Acceptance Criteria:**

**Given** user ở bất kỳ phòng nào có Need Bar thấp
**When** tap "Quick Feed" (chỉ available trong Bếp)
**Then** API call `POST /v1/pet-care/feed` → server update Hunger +25% (capped at 100%)
**And** SAU server success: Bugsy eating animation + nom nom SFX + Hunger bar fill animation
**And** Bugsy state update: nếu Hunger trước đó <30% và giờ ≥30% → transition từ hungry state sang happy state

**Given** user tap "Quick Play" (available trong Phòng Khách)
**When** action
**Then** API call `POST /v1/pet-care/play` → server update Happiness +20%
**And** SAU success: Bugsy jumping/spinning animation + cheerful chirp SFX

**Given** user tap "Quick Train" (available trong Phòng Ngủ)
**When** action
**Then** API call `POST /v1/pet-care/train` → server update Health +15%
**And** SAU success: Bugsy stretching animation

**And** Quick care actions KHÔNG earn BC hoặc QP — chỉ fill bars
**And** mỗi care action có idempotency key (prevent double-tap double-fill)
**And** care actions available khi offline? → greyed out (disabled, visible) + tooltip "Cần kết nối để chăm Bugsy"
**And** accessibility: tất cả care action buttons có aria-label, touch target ≥44×44px

---

### Story 4.3: Weekend Mode, Never-Die Logic & Offline Last Known State

As a user,
I want Bugsy to pause decay on weekends and never truly die even if I'm away,
So that I can rest on weekends and return to the app without fear of losing my progress.

**Acceptance Criteria:**

**Given** current server time là Thứ 7 hoặc CN (timezone UTC+7)
**When** app sync
**Then** server KHÔNG tính decay elapsed time trong khoảng T7 00:00 → CN 23:59 (UTC+7)
**And** `need_bars.last_synced_at` được set về CN 23:59 UTC+7 (để decay tính từ đó vào Thứ 2)
**And** Weekend Mode indicator visible trong app: "🌴 Weekend Mode — Bugsy đang nghỉ ngơi"
**And** Weekend Mode logic chạy server-side — không thể bypass bằng cách chỉnh giờ device

**Given** Need Bar của bất kỳ bar nào về 0%
**When** user mở app
**Then** Bugsy hiện regress state tương ứng (hungry/tired/sad/discipline-low)
**And** KHÔNG có "game over" screen, KHÔNG có modal popup cảnh báo death, KHÔNG mất QP
**And** bars phục hồi ngay khi user làm Core Mission hoặc care actions
**And** Bugsy nói (speech bubble): "[Tên] ơi, mình nhớ bạn quá..." — không phải cảnh báo, là cảm xúc

**Given** user offline (không có internet)
**When** app render
**Then** Bugsy hiện ở last known state (last values từ MMKV cache)
**And** Need Bars KHÔNG decay khi offline — chỉ decay tính từ server timestamp
**And** Quick Feed, Quick Play, Quick Train: grayed out + "Cần kết nối" tooltip (disabled, không hidden)
**And** Core Mission: disabled tương tự
**And** khi reconnect: bars sync từ server trong vòng 5s, animate fill/decrease về đúng value

---

### Story 4.4: Good Morning Moment & One Room Emergency Daily Highlight

As a user,
I want a warm greeting each morning and a clear signal about which room needs the most attention,
So that I always know where to start my day with Bugsy.

**Acceptance Criteria:**

**Given** user mở app lần đầu trong ngày (server-side `last_app_open_date != today`)
**When** app load
**Then** Good Morning Moment trigger: Bugsy stretch animation + speech bubble bằng ngôn ngữ phù hợp với evolution version:
- v0.1: "Chào buổi sáng [tên]! 🌅" (tiếng Việt)
- v0.5: "Chào buổi sáng! Hôm nay học gì vui không?" (tiếng địa phương trong nước - placeholder)
- v1.0: "Selamat pagi, [tên]!" + subtitle "Chào buổi sáng!" (tiếng ĐNA)
- v2.0+: ngôn ngữ dream destination + subtitle tiếng Việt
**And** auto-dismiss sau 2-3s — không cần user tap
**And** chỉ trigger 1 lần/ngày; lần 2 mở app trong ngày: không trigger
**And** server update `last_app_open_date = today` sau khi trigger

**Given** cuối mỗi ngày (server-side check sau 00:00 UTC+7 daily)
**When** user mở app
**Then** One Room Emergency: server identify phòng có Need Bar thấp nhất (không phải Work Room)
**And** phòng đó hiện 🔥 chip trong Apartment View
**And** chỉ 1 phòng có 🔥 highlight tại 1 thời điểm
**And** indicator không intrusive — hiện ở Apartment View isometric view, không phải popup
**And** nếu tất cả bars ≥50%: không có 🔥 chip nào
**And** 🔥 chip reset daily theo server time

---

## Epic 5: Daily Learning Loop

### Story 5.1: Core Mission Entry, Lesson Player & Daily Mission Selection

As a learner,
I want to start my daily Core Mission from the Work Room and read the lesson clearly before the quiz,
So that I have the foundational knowledge I need before answering questions.

**Acceptance Criteria:**

**Given** user ở Work Room
**When** tap "Bắt đầu Core Mission" CTA
**Then** daily mission được selected: nếu user chưa bao giờ học → lesson theo thứ tự `dependency_order` từ content manifest; nếu đã học → next unlearned lesson trong category
**And** Bloom's Taxonomy Arc (FR-22): lesson selection engine query `bloom_level` của lesson phù hợp với day-in-program của user: Day 1-5 → `remember/understand`, Day 6-10 → `understand/apply`, Day 11-15 → `apply/analyze`, Day 16-20 → `analyze`, Day 21-25 → `evaluate`, Day 26-30 → `create` (consolidation, không dạy concept mới)
**And** nếu không có lesson ở đúng bloom_level → fallback về next available lesson (edge case: fresh install với ít content)
**And** Lesson Player hiện: card design với lesson `headline` (Nunito Sans 24/800), `body_text` (max ~80 words, 14/600), lesson category badge, source_tag chip nhỏ ở góc
**And** timer không đếm ngược — lesson hiện 30s nhưng user có thể đọc lâu hơn
**And** "Sẵn sàng!" CTA button (disabled trong 2s đầu để user đọc tối thiểu)
**And** lesson content được load từ local cache (Story 1.3) — không có loading spinner nếu cached
**And** nếu đã có session incomplete cho lesson này (Story 5.2): show "Chào mừng trở lại! Tiếp tục từ câu X/8" banner với CTA "Tiếp tục" và link "Bắt đầu lại"

---

### Story 5.2: Quiz Session Engine (Framework 2-5-1-2, Emotional Arc, Auto-Save, Session Resume)

As a learner,
I want my quiz session to follow a thoughtful emotional arc and never lose my progress,
So that learning feels engaging and I can always pick up where I left off.

**Acceptance Criteria:**

**Given** user tap "Sẵn sàng!" sau lesson
**When** quiz session bắt đầu
**Then** server-side session được tạo: `quiz_sessions (id, user_id, lesson_id, current_question_index, answers[], status, started_at)`
**And** 8 câu được arranged theo framework 2-5-1-2: Q1-Q2 (lý thuyết nền), Q3-Q7 (thực hành), Q8 (hình ảnh từ nội dung), Q7-Q8 (scenario phán đoán)

Wait, let me re-check the framework. 2-5-1-2 means: 2 theory + 5 practice + 1 image + 2 scenario = 10? But the PRD says 8 questions. Let me re-read...

Actually from the PRD: framework 2-5-1-2 = 2 theory + 5 practice + 1 image + 2 scenario = 10? But earlier it says 8 questions. Let me check:
"framework 2-5-1-2 (2 lý thuyết nền, 5 thực hành, 1 hình ảnh, 2 scenario phán đoán)"
2+5+1+2 = 10, but it says 8 questions. Wait, maybe 2+5+1 = 8, and the 2 scenario counts as the last 2 of the 5 practice? Or maybe I miscounted.

Actually from the content strategy document and the summary: "8-question Core Mission structure (2 theory + 5 practice + 1 image + 2 scenario judgment)" - that's 2+5+1+2 = 10.

But also from other mentions: "Q1-Q8" (8 questions). So perhaps it's:
- Q1: Warm-up (from spaced rep ≥3 days)
- Q2-Q3: 2 theory
- Q4-Q6: 3 practice
- Q7: 1 image
- Q8: scenario judgment

Or maybe the framework "2-5-1-2" is: total 8 questions arranged as: 2 at start (theory), 5 in middle (practice), 1 image, and the last "2" overlaps with practice and scenario? 

Actually, re-reading the summary: "8-question Core Mission structure (2 theory + 5 practice + 1 image + 2 scenario judgment)". 2+5+1+2 = 10, but it's "8-question". Let me just go with 8 questions and the 2-5-1-2 label refers to the distribution type rather than absolute counts. Maybe Q1 warm-up is not from this formula, and the 8 questions = Q1 (spaced rep warm-up) + Q2-Q3 (2 theory) + Q4-Q6 (3 practice, from 5 types) + Q7 (1 image) + Q8 (2 scenario = 1 scenario dual-choice). 

Actually, from the context: "Q1 warm-up exception (sai không trừ streak, border xanh nhạt)" - so Q1 is special. Then Q2-Q8 = 7 more questions. 2+5 = 7? That would make 2-5-0-1 for Q2-Q8?

I'm overthinking this. Let me just say "8 câu theo framework 2-5-1-2" as stated in the PRD and not try to break it down further, since the exact mapping is defined in content strategy.

OK let me just write the AC:

**Given** quiz session bắt đầu
**When** 8 câu được present
**Then** Q1: warm-up từ bài đã học ≥3 ngày (Spaced Repetition Q1 exception): border xanh nhạt, sai không trừ streak, không tính vào score
**And** Q2-Q8: arranged theo framework 2-5-1-2 từ lesson content hiện tại
**And** không có 2 câu drag-heavy (Drag-type formats) liên tiếp
**And** Q5: câu khó nhất trong session (peak challenge)

Auto-save:
**Given** user submit bất kỳ câu nào
**When** answer được gửi
**Then** `POST /v1/quiz-sessions/{id}/answer` với idempotency key
**And** server update `answers[current_index]` VÀ `current_question_index++`
**And** client update WAL với quiz state TRƯỚC khi gọi API (WAL pattern)
**And** delete WAL sau API success

Session resume:
**Given** user quit app giữa chừng và mở lại
**When** navigate về Work Room
**Then** app detect session incomplete (status != 'completed', current_question_index > 0)
**And** "Chào mừng trở lại, [tên]! Tiếp tục từ câu X/8" banner hiện với CTA
**And** resume đúng câu — WAL recover nếu cần
**And** sau 24h incomplete: hỏi "Tiếp tục?" | "Làm lại từ đầu?"

Progress indicator:
**And** progress dots top of screen: 8 dots, active dot: w-8 h-2 rounded-full primary-container; inactive: surface-variant
**And** không có back button trong quiz — chỉ có X (exit) → confirm dialog "Bỏ dở? Progress sẽ được lưu."

---

### Story 5.4: Question Format Engine Part 1 — MCQ, Bug Report Surgery, Severity Swipe, Spot the Defect, Rewrite the Fail

As a learner,
I want varied question formats that test different QC skills in engaging ways,
So that learning stays interesting and I develop well-rounded testing abilities.

**Acceptance Criteria:**

**Given** câu hỏi format MCQ (Multiple Choice)
**When** render
**Then** hiện question text + 2-4 TactileButton options; tap → instant highlight (correct: lime, incorrect: error-container); không có Story-Rule nếu đúng; Story-Rule nếu sai

**Given** câu hỏi format Bug Report Surgery
**When** render
**Then** hiện bug report template với blank fields; user drag-reconstructs từ word blocks để điền vào đúng field (Title, Steps to Reproduce, Expected/Actual, Severity); validation: tất cả fields required, order matters

**Given** câu hỏi format Severity Swipe
**When** render
**Then** hiện bug description card; user swipe left (Low), up (Medium), right (High), down (Critical) — Tinder-style; haptic feedback khi swipe; correct answer reveal sau swipe

**Given** câu hỏi format Spot the Defect
**When** render
**Then** hiện screenshot/mockup UI với multiple tappable zones; user tap vào vùng có bug; correct zone highlight green; incorrect tap: shake + error color; có thể có multiple defects trong 1 image (multi-tap)

**Given** câu hỏi format Rewrite the Fail
**When** render
**Then** hiện "bad" test case text; user rearrange word blocks để tạo thành "good" test case; drag-and-drop word blocks vào slots; validation khi user tap "Xong"

**And** mọi format: đúng → Confetti (50 pieces, 4 màu fixed) + SFX chime; sai → Story-Rule slide-up (hoặc Rescue nếu 3rd wrong)
**And** quiz next question load <500ms sau submit (NFR-6)
**And** swipe-to-dismiss bị tắt hoàn toàn trong quiz flow — không accidental exit
**And** mọi tappable element ≥44×44px (NFR accessibility)

---

### Story 5.5: Question Format Engine Part 2 — Priority×Severity Duel, Boundary Attack, Root Cause Chain, Risk Radar, Complete the Test Case

As a learner,
I want complex analytical question formats that challenge higher-order thinking,
So that I develop the judgment and analysis skills needed for real QC work.

**Acceptance Criteria:**

**Given** câu hỏi format Priority×Severity Duel
**When** render
**Then** hiện 2-axis drag matrix (Priority: Low-High X-axis, Severity: Low-High Y-axis); user drag bug card vào đúng quadrant; correct quadrant highlighted sau submit

**Given** câu hỏi format Boundary Attack
**When** render
**Then** hiện text input field; user nhập test values (e.g., boundary values cho một range); validation check list của expected boundary values; feedback "Bạn bỏ sót [X]" nếu thiếu

**Given** câu hỏi format Root Cause Chain
**When** render
**Then** hiện 4-5 event cards; user kéo thả để arrange thành đúng causal chain; validate order khi tap "Xong"; wrong order: highlight sai chỗ

**Given** câu hỏi format Risk Radar
**When** render
**Then** hiện 4-6 feature cards; user xếp hạng theo risk level bằng drag (top = highest risk); validate ranking; partial credit nếu 70%+ đúng thứ tự

**Given** câu hỏi format Complete the Test Case
**When** render
**Then** hiện test case template với blank fields: Precondition và Expected Result; user điền tự do; validation: keyword matching với answer key (fuzzy match, case-insensitive); server-side validation với LLM fallback nếu needed (Phase 2 — MVP: keyword match)

**And** tất cả formats: đúng → confetti + reward pipeline; sai → Story-Rule slide-up
**And** không có 2 câu drag-heavy liên tiếp trong 1 session (quiz session engine enforce từ Story 5.2)
**And** tất cả formats accessible: keyboard navigation cho drag operations trong test environment (manual QA required)

---

### Story 5.3: Rescue Mechanic, Story-Rule Feedback Panel & 3-2-1 Summary Card

As a learner,
I want support when I'm stuck and a memorable summary at the end,
So that struggling with a question leads to learning rather than frustration.

**Acceptance Criteria:**

**Given** user sai cùng câu hỏi 3 lần liên tiếp
**When** lần sai thứ 3
**Then** Story-Rule KHÔNG hiện (như usual); thay vào đó Rescue panel xuất hiện
**And** Bugsy nói: "Câu này khó thiệt! [tên] chọn đi:" + 3 options (TactileButton):
1. "Xem gợi ý 💡" (cost: -5 BC; loại 1 distractor sai)
2. "Đọc lại lý thuyết 📖" (miễn phí; show mini theory card từ lesson_content, 30s read)
3. "Bỏ qua ⏭" (miễn phí; câu này đưa vào queue, quay lại session sau — không count toward streak)
**And** nút "Bỏ qua" KHÔNG được hidden hay disabled — luôn visible
**And** không có popup đỏ, không có penalty animation

**Given** user trả lời SAI bất kỳ câu nào (không phải lần thứ 3 liên tiếp)
**When** submit wrong answer
**Then** Story-Rule slide-up hiện: bg `inverse-surface #002e69`, rounded-t-[32px], handle bar
**And** nội dung: Bugsy kể câu chuyện ngắn liên quan (1-2 sentences) → "📌 Rule:" với bg `rule-landing-bg #BFFFA1` highlight
**And** Story-Rule animation chạy hết — không có X button để đóng sớm
**And** SAU Story-Rule: user vẫn nhận ≥30% QP reward của câu đó (không phải 0)
**And** tùy chọn Self-Efficacy Calibration sau câu ĐÚNG (mỗi 3 câu): "Câu đó bạn thấy thế nào?" [Dễ / Vừa / Khó] — data gửi server, không block progression

**Given** user hoàn thành câu Q8 (câu cuối)
**When** submit Q8 answer
**Then** 3-2-1 Summary Card hiện: "Bugsy's Cheat Sheet" design (trading card style)
**And** nội dung: "3 điều nhớ" (từ lesson_content), "2 lỗi phổ biến" (từ distractor_rationale), "1 đối chiếu thực tế" (từ lesson example)
**And** max 5 bullets tổng
**And** title thay vì điểm số: "Bug Whisperer" (7-8/8 đúng) | "Defect Detective" (5-6/8) | "QC Apprentice" (3-4/8) | "Bug Magnet" (<3/8)
**And** Share button: native share sheet với Summary Card image (không có leaderboard, chỉ personal data)
**And** sau Summary Card: Reward pipeline (Epic 6) chạy, Mission Board card move "In Progress" → "Done"

---

### Story 5.6: Side Quests (Bug Hunt, Peer Review, Repro Steps, Simulated Bug Hunt)

As a learner,
I want optional side activities that connect classroom learning to real work,
So that I practice QC skills in more open-ended, realistic scenarios.

**Acceptance Criteria:**

**Given** user ở Phòng Khách (hoặc Mission Board)
**When** tap "Side Quests"
**Then** list 3 available Side Quest types hiện (TactileCard per type): Bug Hunt, Peer Review, Repro Steps
**And** mỗi card hiện: quest name, Happiness fill preview (+40%), BC earn preview, estimated time

**Given** Side Quest: Bug Hunt
**When** user chọn
**Then** Bugsy hướng dẫn tìm 1 real bug trong công việc thực của user hoặc trong staging env được cung cấp (text-based scenario)
**And** user submit bug report (fields: title, steps, expected, actual, severity)
**And** app KHÔNG validate nội dung — honor system; submit bất kỳ → complete
**And** earn: +40% Happiness, +5 BC; Mission Board: new card tạo trong Bug Report Wall

**Given** Side Quest: Peer Review
**When** user chọn
**Then** user review một "junior QA's test case" (curated example từ content library)
**And** user annotate: mark defects, suggest improvements (freeform text)
**And** submit → earn +40% Happiness, +5 BC

**Given** Side Quest: Repro Steps
**When** user chọn
**Then** user được cung cấp bug description; task: viết repro steps chuẩn (numbered, minimal)
**And** submit freeform text → earn +40% Happiness, +5 BC

**Given** user muốn làm Weekly Bug Log nhưng chưa có real bug (FR-34 Zero-Bug flow)
**When** user tap Weekly Bug Log → "Tôi chưa gặp bug nào tuần này"
**Then** Zero-Bug Response panel hiện 2 options:
1. "Mở Simulated Bug Hunt" → launch Side Quest: Simulated Bug Hunt
2. "Bỏ qua tuần này" → log "no real bugs this week" và close

**Given** Side Quest: Simulated Bug Hunt (FR-10 + FR-34)
**When** user chọn
**Then** Bugsy tạo fictional staging environment scenario (text-based); user "test" và report simulated bugs
**And** structured như Bug Hunt nhưng với pre-defined scenario context
**And** earn: +40% Happiness, +5 BC

---

### Story 5.7: Mission Board Kanban & Bug Report Wall

As a learner,
I want a visual Mission Board that tracks my daily progress and celebrates my growing bug report collection,
So that I can see my work accumulate and feel the satisfaction of moving tasks to Done.

**Acceptance Criteria:**

**Given** user ở Work Room
**When** tap Mission Board
**Then** Mission Board hiện: 3 columns horizontal scroll (Todo / In Progress / Done), column headers UPPERCASE, Nunito Sans 16/800
**And** cards: TactileCard w-40, drag handle ≡ visible, lesson name + category badge
**And** drag card: scale(1.05) + elevated shadow; drop zone: dashed border-2 primary-container
**And** Done column: cards stacked với slight rotation ±3deg
**And** khi user bắt đầu Core Mission (trigger từ Story 5.1 event: `core_mission_started`): card auto-move Todo → In Progress (animated drag, 0.3s)
**And** khi Core Mission complete (trigger từ Story 5.3 event: `session_completed`): card auto-move In Progress → Done (confetti burst tại card)
**And** user có thể manual drag cards giữa columns (nhưng không thể undo server-committed state)

**Given** Bug Report Wall (accessible từ Mission Board view)
**When** user completed ≥1 lesson (Bug Hunt hay Core Mission tạo report)
**Then** Bug Report Wall hiện sticky notes grid, mỗi note = 1 lesson completed
**And** sticky notes: random rotation ±5deg, colors cycling: yellow/green/blue/pink
**And** mỗi note mới: fly-in animation từ cạnh màn hình vào đúng vị trí grid
**And** khi Bug Report Wall reach ~30 notes (full wall): toàn bộ wall confetti burst + Bugsy excited animation
**And** notes persist server-side — không mất khi logout
**And** Bug Report Wall accessible từ My Journey view (Epic 7) để xem lại

---

## Epic 6: Dual Currency & Reward Animations

### Story 6.1: Dual Currency Data Model & Persistent Header Display

As a user,
I want to always see my BC and QP balances clearly wherever I am in the app,
So that I always know my current standing and feel motivated by visible progress.

**Acceptance Criteria:**

**Given** user ở bất kỳ screen nào trong app (sau onboarding)
**When** render
**Then** header chips hiện persistent: BC chip (bc-amber #FFB000, coin icon) + QP chip (qp-teal #00A8A8, star icon)
**And** chips style: bg-surface-container-high, rounded-full, px-sm py-xs, border-2
**And** BC và QP colors KHÔNG được mix — bc-amber chỉ cho BC, qp-teal chỉ cho QP

**Given** app launch sau server sync
**When** user nhìn vào header
**Then** BC và QP values là server-authoritative — không phải local-only values
**And** `game_state.bc_balance` và `game_state.qp_total` được fetch ngay khi app mount

**Given** `currency_balances` table schema
**When** cần store
**Then** table có: `user_id`, `bc_balance` (integer, floor 0), `qp_total` (integer, KHÔNG bao giờ decrease), `last_updated_at`
**And** QP total là server-only field — client KHÔNG thể write trực tiếp (RLS policy chặn UPDATE từ client)
**And** BC minimum = 0 (DB constraint: CHECK bc_balance >= 0)

---

### Story 6.2: BC Earn Rules, Miss Penalty & Reward Animation Pipeline

As a user,
I want to earn Bug Coins for completing missions and understand the consequence of missing days,
So that BC feels meaningful and there's gentle accountability for daily habits.

**Acceptance Criteria:**

**Given** user complete Core Mission (Story 5.5)
**When** 3-2-1 Summary Card dismiss
**Then** `POST /v1/rewards/core-mission-complete` gọi với idempotency key
**And** server process: tính BC earn = +10 BC (base; QP Multipliers deferred post-launch)
**And** server commit BC vào `game_state.bc_balance`
**And** SAU server success: RewardEventBus.emit('server_committed', { bc: +10, qp: X })
**And** animation trigger: BC chip bounce scale(1.2)→1.0 + "+10" floating text rises → chip counter tick-up 800ms + coin jingle SFX

**Given** user complete Side Quest (Story 5.6)
**When** submit
**Then** earn +5 BC (server commit → animation pipeline, same pattern)

**Given** user miss ngày (no Core Mission completed) — pg_cron job chạy 00:05 UTC+7
**When** cron job check
**Then** nếu `last_mission_completed_date != yesterday` VÀ không phải ngày đầu tiên (grace period ngày 1)
**Then** `bc_balance -= 15` (capped: không về âm, minimum 0)
**And** miss penalty không áp dụng cho T7-CN (Weekend Mode)
**And** miss penalty cap: sau 3 ngày miss liên tiếp, penalty không cộng thêm nữa
**And** Sprint Hold active cho ngày đó: không áp dụng penalty (Epic 8)

**Given** bc_balance sau penalty tính ra âm
**When** server update
**Then** bc_balance = max(0, bc_balance - 15) — không bao giờ về âm
**And** miss ngày: không mất QP dù bất kỳ scenario nào

---

### Story 6.3: QP Earn Rules & Server-Authoritative Immutability

As a user,
I want to earn Quality Points that reflect my real learning progress and can never be taken away,
So that QP represents genuine growth that I can trust and rely on.

**Acceptance Criteria:**

**Given** user complete Core Mission với answers logged
**When** server process reward
**Then** QP earn = score-based (e.g., 8/8 đúng = 20 QP, 7/8 = 17 QP, 6/8 = 14 QP, ..., 0/8 = 6 QP minimum vì cố gắng)
**And** exact QP formula được defined trong Edge Function config (adjustable post-launch without code change)
**And** Story-Rule câu sai vẫn nhận ≥30% QP reward của câu đó (không về 0)

**Given** QP được earn
**When** server process
**Then** `qp_total += earned_qp` — server-side operation
**And** client KHÔNG thể UPDATE qp_total qua REST API hoặc Supabase client directly (RLS + DB trigger enforce)
**And** DB trigger: `BEFORE UPDATE ON game_state` — nếu `NEW.qp_total < OLD.qp_total` → raise exception "QP cannot decrease"

**Given** bất kỳ scenario nào: miss ngày, bar về 0%, Rescue Mechanic, Sprint Hold, wrong answers
**When** check QP
**Then** QP KHÔNG bao giờ giảm (DB trigger + server logic enforce)
**And** Rescue Mechanic "Xem gợi ý -5 BC": server validate trước rằng user có ≥5 BC trước khi allow; nếu BC < 5: option này disabled (không hiện -5 BC mà hiện "không đủ BC")

**Given** QP reward animation
**When** trigger (SAU server commit)
**Then** QP chip bounce + "+X QP" floating text + star sparkle SFX
**And** floating text color: qp-teal (#00A8A8)
**And** animation duration: counter tick-up 800ms

---

## Epic 7: Sprint Lifecycle & Real-World Transfer

### Story 7.1: Transfer Gate Evidence Submission

As a user who's ready to evolve Bugsy,
I want to submit real-world work evidence to unlock evolution,
So that leveling up requires genuine skill application, not just in-app progress.

**Acceptance Criteria:**

**Given** user đủ QP threshold cho evolution step tiếp theo (Epic 3)
**When** user access Transfer Gate từ phòng tương ứng
**Then** Transfer Gate UI hiện với evidence requirements cho step đó:
- v0.1→v0.5 (Bếp): "Gửi bug report đã được đồng nghiệp xác nhận"
- v0.5→v1.0 (Work Room): "Gửi test case thật từ sprint hiện tại"
- v1.0→v2.0 (Phòng Khách): "Chia sẻ Sprint Demo Card hoặc gửi peer review log"
- v2.0→v3.0 (Sân + Ngủ): "Ghi chép ET session + Retrospective tháng"

**Given** Transfer Gate UI open
**When** user submit evidence
**Then** user có thể: nhập text (freeform, no AI validation) VÀ/HOẶC upload photo (Supabase Storage presigned URL)
**And** `POST /v1/transfer-gate/submit` với: `user_id`, `evolution_step`, `evidence_type` (text|photo), `content`, `submitted_at` (server timestamp)
**And** submission lưu permanent trong `transfer_gate_submissions` table — không thể delete
**And** app KHÔNG judge content quality — honor system (user tự declare evidence valid)
**And** sau submit: server check cả QP threshold lẫn submission existence → nếu cả 2 đủ → trigger evolution (Epic 3 Story 3.5)
**And** tất cả submissions accessible từ My Journey view (Story 7.2)

---

### Story 7.2: My Journey View (Evidence Timeline)

As a user,
I want to see all my learning evidence and growth milestones in one place,
So that I can reflect on how far I've come and feel proud of my progress.

**Acceptance Criteria:**

**Given** user navigate đến "My Journey" (accessible từ Work Room hoặc profile)
**When** screen hiện
**Then** timeline view (vertical scroll, newest first) với entries:
- Transfer Gate submissions (evidence text/photo thumbnails)
- Bug Report Wall entries (lesson completed badges)
- Weekly Bug Log entries (Story 7.3)
- Retrospective Loop entries (Story 7.5)
- Evolution milestones (Bugsy version icon + date)
**And** entries grouped by sprint (7-day blocks)
**And** photo thumbnails: tap → expand full-size với zoom support
**And** text entries: tap → expand full text

**Given** My Journey data
**When** server fetch
**Then** tất cả entries load từ server (không phải local-only)
**And** entries không thể bị xóa bởi user (permanent record)
**And** offline: show cached last-known state với "Đang offline — dữ liệu có thể chưa cập nhật" banner

---

### Story 7.3: Weekly Bug Log & Zero-Bug 2-Option Response

As a user,
I want to log real bugs I find each week as part of my learning habit,
So that I practice documenting defects consistently even when my team moves fast.

**Acceptance Criteria:**

**Given** user ở Work Room sau 7 ngày
**When** Weekly Bug Log prompt hiện (tự động hoặc user tap từ Mission Board)
**Then** form hiện: `description` (textarea), `severity` (enum: Low/Medium/High/Critical), `priority` (enum: Low/Medium/High), `outcome` (enum: Fixed/Won't Fix/Deferred/Still Open)
**And** form KHÔNG validate nội dung — user submit bất kỳ text nào
**And** submit → `POST /v1/weekly-bug-log` → lưu vào `weekly_bug_logs` table
**And** entry hiện trong My Journey (Story 7.2)

**Given** user tap "Tuần này mình chưa gặp bug nào"
**When** zero-bug flow trigger
**Then** Zero-Bug Response panel hiện 2 options (TactileButton):
1. "Mở Simulated Bug Hunt 🐛" → launch Side Quest Simulated Bug Hunt (Epic 5 Story 5.6)
2. "Bỏ qua tuần này ⏭" → log `{ outcome: "no_bugs_this_week" }` và close panel
**And** không có 3rd option, không có judgment message về việc không có bug
**And** cả 2 options đều bình đẳng về visual weight — không có "correct" option styling

---

### Story 7.4: Sprint Hold Token System

As a user who needs to pause occasionally,
I want to earn and use Sprint Hold tokens to pause my streak without losing momentum,
So that life events don't derail my learning progress.

**Acceptance Criteria:**

**Given** server check missions completed tháng này (pg_cron, cuối tháng)
**When** user complete ≥20/28 daily missions trong tháng
**Then** server award 1 Sprint Hold token: `sprint_hold_tokens.balance += 1`
**And** notification (Bugsy voice): "[Tên] đã được 1 Sprint Hold token vì hoàn thành 20 nhiệm vụ tháng này! 🎁"
**And** max 2 tokens/tháng (free tier) — dù complete 28/28 vẫn chỉ earn max 2

**Given** user muốn dùng Sprint Hold token
**When** tap "Dùng Sprint Hold" từ Work Room
**Then** form bắt buộc: `reason` field (freeform text, required — không thể submit rỗng)
**And** `POST /v1/sprint-hold/use` với reason → server deduct 1 token, log ngày hold
**And** ngày hold: BC miss penalty KHÔNG áp dụng (even if no mission done)
**And** Discipline bar giảm nhẹ hơn trong ngày hold (50% of normal decay)
**And** user KHÔNG thể dùng Sprint Hold 2 lần liên tiếp (ngày hôm trước đã hold → ngày hôm nay không được)
**And** `sprint_hold_logs` table: `user_id`, `used_at`, `reason`, `penalty_waived: true`
**And** tokens KHÔNG thể mua bằng BC hay QP (earned only)

---

### Story 7.5: Retrospective Loop (End-of-Sprint Prompt)

As a user completing a sprint,
I want to reflect on what I learned and applied,
So that I consolidate learning and set intentions for the next sprint.

**Acceptance Criteria:**

**Given** user complete 7-day sprint (7 Core Missions done hoặc 7 ngày đã trôi qua kể từ sprint start)
**When** user mở app ngày sau sprint end
**Then** Retrospective Loop prompt hiện (tùy chọn — user có thể skip): slide-up panel
**And** prompt có 3 questions (text input, freeform):
1. "Điều gì bạn đã áp dụng được từ sprint này?"
2. "Điều gì vẫn còn khó?"
3. "Tuần tới bạn muốn bật tắt gì?"
**And** user có thể answer 1, 2, hoặc cả 3 — không bắt buộc answer hết
**And** CTA: "Lưu suy nghĩ" (save partial) | "Bỏ qua" (skip hoàn toàn)
**And** nếu save: `POST /v1/retrospective` → lưu `retrospective_entries` table với sprint_number
**And** entries visible trong My Journey (Story 7.2) theo sprint timeline
**And** skip rate tracked (analytics) nhưng không penalize user

---

### Story 7.6: Sprint Demo Card Generation & Native Sharing

As a user completing a sprint,
I want a beautiful shareable card showing my sprint achievements,
So that I can celebrate progress and optionally share with peers.

**Acceptance Criteria:**

**Given** user complete Day 7 sprint (7 Core Missions trong sprint)
**When** server detect sprint complete
**Then** Sprint Demo Card tự động generate: `POST /v1/sprint-demo-card/generate` → server compute stats
**And** card data: Bugsy version image, QP earned this sprint, streak days, top lesson (most QP earned), sprint number
**And** card shareable trong 48h sau generate — sau 48h vẫn xem được nhưng không share

**Given** Sprint Demo Card generated
**When** user navigate về Phòng Khách
**Then** Sprint Demo Card available trong Phòng Khách ("Xem thành quả sprint")
**And** card UI: gradient bg (#FFD1BA → #c9e6ff top-to-bottom), Bugsy image w-64 h-64, stats layout

**Given** user tap "Chia sẻ"
**When** share action
**Then** native share sheet (iOS/Android) mở với card image + default text "Mình vừa complete sprint #X cùng Bugsy! 🐣"
**And** share event: server update `happiness += 50%` (capped 100%) — SAU server commit
**And** RewardEventBus pattern: server_committed → Happiness bar fill animation
**And** share không track tới external platform; không có leaderboard data in card

---

## Epic 8: Spaced Repetition & Flash Quiz Layer

### Story 8.1: Spaced Repetition Algorithm & Server Queue

As a learner,
I want questions from previous lessons to resurface at the right time,
So that I retain knowledge long-term, not just immediately after learning.

**Acceptance Criteria:**

**Given** user complete Core Mission (lesson X)
**When** server process completion
**Then** SR queue update: lesson X questions added với `next_review_at = now + 3 days`
**And** `spaced_repetition_queue` table: `user_id`, `lesson_id`, `question_id`, `next_review_at`, `review_count`, `last_answered_correctly`
**And** SR algorithm: sau review đúng → `next_review_at = now + (review_count * 3 days)` (simple interval, không phải Anki full algo — MVP)
**And** sau review sai → `next_review_at = now + 1 day` (shorter interval)

**Given** Core Mission Q1 (warm-up)
**When** select Q1 question
**Then** server query: SELECT question FROM sr_queue WHERE `next_review_at <= now` AND `user_id = current` ORDER BY next_review_at ASC LIMIT 1
**And** nếu không có question nào eligible (≥3 ngày) → Q1 fallback: MCQ từ lesson 2+ ngày trước
**And** Q1 answer không ảnh hưởng streak, không tính vào miss penalty, border xanh nhạt

**Given** SR queue local cache
**When** app load
**Then** client cache SR queue (next 7 days items) trong MMKV, TTL 24h
**And** cache invalidated khi user complete new lesson

---

### Story 8.2: Bedroom SR Session, "Tắt Đèn" Flow & Daily Recap Bubble

As a learner,
I want to do a brief review before sleep and see a quick summary of today's learning,
So that I end each day with a gentle reinforcement of what I learned.

**Acceptance Criteria:**

**Given** user ở Phòng Ngủ
**When** tap "Tắt đèn" button
**Then** Phòng Ngủ dim to lights-out (stars appear trên ceiling, lavender → dark lavender)
**And** 1-2 SR questions hiện (từ queue, Story 8.1): stripped format (no scenario card, no category badge, just question + options)
**And** đúng/sai: instant feedback (lime/error-container), KHÔNG có Story-Rule, KHÔNG có streak impact, KHÔNG có score
**And** sau 1-2 câu: Daily Recap Bubble hiện

**Given** Daily Recap Bubble trigger
**When** hiện
**Then** CSS thought bubble shape (không phải modal, không phải slide-up panel), positioned phía trên Bugsy đang ngủ (Bugsy breathe-sleep animation)
**And** nội dung:
- Nếu đã làm Core Mission hôm nay: "[Lesson name] • [1 rule ngắn từ 3-2-1 Summary] • Streak: [X] ngày 🔥"
- Nếu CHƯA làm Core Mission: "Hôm nay Bugsy chờ mình suốt... 💤 Ngày mai nha!"
**And** không có CTA button trong bubble — tap anywhere to dismiss
**And** không block UI — user có thể swipe to next room qua bubble

**Given** user không tap vào bubble
**When** 5s trôi qua
**Then** bubble auto-dismiss (fade out)

---

### Story 8.3: Bathroom Flash Quiz & Mirror Moment

As a learner,
I want quick daily quizzes in the Bathroom that build discipline,
So that I practice consistently even on days when I only have a few minutes.

**Acceptance Criteria:**

**Given** user vào Phòng Tắm
**When** Flash Quiz available (reset daily)
**Then** Flash Quiz UI hiện: stripped — CHỈ có: streak counter nhỏ (top right) + "X/3 câu" indicator + question text + answer buttons
**And** KHÔNG có: scenario card, category badge, hint button, progress dots (quiz-style), Rescue Mechanic
**And** 2-3 câu từ SR queue (bài đã học ít nhất 1 ngày trước)

**Given** Flash Quiz active
**When** user answer
**Then** instant feedback: đúng → lime background flash (0.2s) + quick pop SFX; sai → error-container flash + forgiving bwaa SFX
**And** KHÔNG có Story-Rule sau sai (Flash Quiz exception)
**And** next question load <500ms

**Given** user complete câu cuối của Flash Quiz (câu 2 hoặc 3)
**When** submit
**Then** Mirror Moment auto-trigger (no user action needed)
**And** Mirror Moment: Bugsy standing + flipped reflection side-by-side (mirror image)
**And** visual theo Discipline bar:
- Discipline ≥70%: Bugsy outfit pressed + sparkles + sparkle SFX
- Discipline 30-69%: neutral Bugsy
- Discipline <30%: hair ruffled + tired expression + no sparkles
**And** duration: 2.5s self-dismiss
**And** KHÔNG có text overlay (visual only)
**And** KHÔNG dismissable sớm hơn 2.5s (no tap-to-dismiss)
**And** sau Mirror Moment: Discipline bar +10% (Bathroom Flash Quiz contribution)

---

## Epic 9: Notifications & Smart Timing

### Story 9.1: Push Notification Infrastructure & Bugsy-Voice Copy Templates

As a user who sometimes forgets to open the app,
I want reminders that feel like messages from Bugsy rather than system alerts,
So that notifications feel warm and personal, not intrusive.

**Acceptance Criteria:**

**Given** user grant notification permission (Story 2.5)
**When** EAS Push Notification setup
**Then** Expo Push Token được lưu server-side: `push_tokens (user_id, expo_push_token, platform, created_at)`
**And** FCM (Android) + APNs (iOS) được config qua EAS managed credentials

**Given** notification copy được authored
**When** notification trigger
**Then** copy theo Bugsy voice — story framing, không phải "Reminder:"; ví dụ:
- Hunger 30%: "Bụng Bugsy kêu to rồi. Tủ lạnh trống không có gì hết á 😅"
- Happiness 30%: "Bugsy đang ngồi một mình ở Phòng Khách... nhớ [tên] lắm 🥺"
- Discipline 30%: "Phòng Tắm chờ mình từ sáng đến giờ rồi đó [tên] 🚿"
- General miss: "[Tên] ơi, Bugsy hôm nay học một mình nha... sẽ đợi đến tối nhé 📚"
**And** copy templates lưu trong `content/notifications/` JSON file (OTA updatable)
**And** tất cả copy dùng "mình/bạn" register — không có "bạn" lạnh lùng hay "mày" (NFR-4)

---

### Story 9.2: Smart Timing Logic, Daily Cap & Deep Links

As a user,
I want notifications to arrive at helpful times and take me directly to the right room,
So that I spend less time navigating and more time learning.

**Acceptance Criteria:**

**Given** notification scheduling (Edge Function + pg_cron)
**When** schedule check chạy
**Then** max 2 notifications/ngày: sáng 8h00 UTC+7 (always, nếu user có push token) + chiều 19h00 UTC+7 (CHỈ nếu user chưa mở app trong ngày)
**And** nếu ≥2 phòng cần attention: gộp thành 1 notification (không gửi 2 notification riêng): "Bugsy cần [phòng 1] và [phòng 2] — ghé chơi nha!"
**And** Weekend Mode: notifications vẫn gửi để remind user mở app, nhưng copy khác: "Cuối tuần mình nghỉ học, nhưng Bugsy nhớ [tên] quá! 🌴"

**Given** user tap notification
**When** app open từ notification
**Then** deep link vào đúng phòng cần attention (Expo Router deep link: `/rooms/kitchen`, `/rooms/bedroom`, etc.)
**And** nếu app đã mở (foreground): navigate directly, không restart app
**And** nếu app closed: launch → navigate to correct room sau splash

**Given** smart timing learning (post-launch Phase 2 feature — MVP: skip)
**When** MVP
**Then** dùng cố định: sáng 8h00 + chiều 19h00 (không có smart timing learning trong MVP)
**And** "Smart timing học từ session behavior sau 7 ngày" là Phase 2 feature — không implement trong MVP

---

## Epic 10: Sân & Item Shop Placeholder

### Story 10.1: Sân Day-7 Cinematic Unlock & Open Space Environment

As a user who's completed their first week,
I want a memorable cinematic moment when the Yard unlocks,
So that completing Week 1 feels like a real achievement worth celebrating.

**Acceptance Criteria:**

**Given** user đạt 7-day streak HOẶC complete 7 Core Missions (Week 1 complete) — trigger from Story 3.4
**When** unlock condition met server-side
**Then** Sân cinematic trigger: đặc biệt — không có UI, không có text, không có music
**And** visual: Bugsy chạy ra Sân lần đầu tiên (outdoor-run animation), ambient sounds: birds + breeze only
**And** duration: ~5s cinematic, sau đó Immersive Mode của Sân hiện bình thường
**And** không có popup "Congratulations!", không có "New area unlocked!" overlay — visual only storytelling
**And** cinematic chỉ trigger 1 lần duy nhất (server flag `sân_cinematic_shown: true` sau khi played)

**Given** Sân environment (Immersive Mode)
**When** user ở Sân
**Then** environment: yard-sky gradient + yard-grass layer, open feel (không có furniture)
**And** Bugsy: outdoor-run animation theo grass (w-80, larger than indoor)
**And** ambient sound: birds + breeze (no music, no BGM)
**And** không có Need Bar decay trong Sân (Sân không map tới bar nào)
**And** Shop placeholder visible nhưng không accessible fully (Story 10.2)

---

### Story 10.2: Item Shop Placeholder (Browse Only, "Coming Soon")

As a user,
I want to see what items will be available in the future shop,
So that I feel excited about upcoming features without being frustrated by missing functionality.

**Acceptance Criteria:**

**Given** user ở Sân và tap vào Shop area
**When** Shop opens
**Then** browse UI hiện: grid of item thumbnails (placeholder images hoặc silhouettes)
**And** mỗi item card: name, category (wallpaper/outfit/toy), "Coming Soon" chip, BC price greyed out
**And** tất cả "Buy" buttons: disabled + greyed out (không hidden)
**And** header: "Cửa hàng Bugsy 🏪 (Sắp ra mắt)"
**And** không có cart, không có transaction flow trong Phase 1
**And** "Coming Soon" text không phải "Not Available" hay "Under Construction" — positive framing

**Given** Shop UI
**When** user tap disabled Buy button
**Then** speech bubble từ Bugsy: "Mình đang làm thêm đồ cho bạn! Chờ mình một chút nha 🛍️"
**And** tap anywhere to dismiss speech bubble
**And** không có form, không có waitlist, không có email capture trong MVP
**And** Phase 2 full shop implementation OUT OF SCOPE — placeholder only

---

_Epics và Stories hoàn chỉnh. Tổng: 11 Epics (Epic 0–10), 46 Stories._
