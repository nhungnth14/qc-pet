# QC Pet — EXPERIENCE.md
## Behavioral Spec · IA · Flows · States

---

**Version:** 2.0.0  
**Status:** Draft  
**Date:** 2026-06-14  
**Source:** PRD (final, 2026-06-14) · game-flow.md · Stitch export (MVP screens) · `.decision-log.md`  
**Design ref:** `DESIGN.md` — tokens referenced as `{colors.*}`, `{typography.*}`, `{spacing.*}`.

---

## Foundation

**Platform:** Mobile — iOS và Android. Portrait orientation. Không hỗ trợ landscape MVP.  
**Form factor:** Smartphone (target 375–430px wide). Safe area bottom (notch/home indicator) được tính vào `{spacing.md}` bottom padding của Bottom Nav.  
**UI system:** Custom — Tailwind CSS v3, Material Design 3 color roles (xem `DESIGN.md`). Không dùng component library nào (MUI, Chakra, v.v.) — tất cả component tự build theo DESIGN.md spec.  
**Language:** `lang="vi"` trên toàn bộ HTML.  
**Tech delivery format:** HTML/CSS/JS per screen (Stitch export) → React Native component mapping (Phase 2 dev).  
**Offline:** App phải load được màn hình Home từ cache nếu không có mạng. Mission quiz yêu cầu mạng; hiển thị retry state nếu offline.  
**Dark mode:** Không trong MVP (xem `DESIGN.md §Dark Mode`).

---

## Information Architecture

### Cấu trúc tổng thể

```
QC Pet — Thế Giới 6 Phòng
│
├── [Onboarding — lần đầu, 1 lần duy nhất]
│   ├── Màn hình tối → tiếng bàn phím → Quả Trứng Run Rẩy
│   ├── Bugsy nở ra, ngáp, nhìn camera
│   ├── Đặt tên pet (3 gợi ý + free text)
│   ├── Warm-up: Pass/Fail bug report ngắn
│   ├── Aha Moment: Bug report đầy đủ + Story-Rule Feedback
│   ├── Reward: BC + QP animate (server commit trước animation)
│   ├── Cliffhanger screen
│   ├── Notification Preference
│   └── Sign-up Gate ("Lưu [tên] lại" — driven by pet attachment)
│
└── [Main App — sau onboarding]
    │
    ├── 🗺️ APARTMENT VIEW (tap 🏠 icon, sau ≥2 phòng unlocked)
    │   ├── Isometric view tất cả 6 phòng
    │   ├── Flash indicator: phòng cần chú ý nhấp nháy nhẹ
    │   ├── One Room Emergency: 🔥 chip trên phòng cần nhất
    │   └── Locked rooms: cửa đóng, "?" gợi tò mò
    │
    ├── 🏢 PHÒNG LÀM VIỆC — mở ngay từ onboarding
    │   ├── Core Mission: Lesson 30s + Quiz 8 câu (framework 2-5-1-2)
    │   ├── Mission Board: Todo → In Progress → Done (kanban mini)
    │   ├── Bug Report Wall: sticky notes tích lũy 1/lesson
    │   ├── Weekly Bug Log form
    │   ├── Transfer Gate (khi QP ≥ threshold và evolution pending)
    │   └── My Journey view (timeline submissions)
    │
    ├── 🍳 PHÒNG BẾP — unlock: ngay sau Aha Moment (cửa hé mở)
    │   ├── Quick Feed Bugsy (+Hunger)
    │   └── Bug Report submission ("nấu ăn" cho Bugsy)
    │
    ├── 🛏️ PHÒNG NGỦ — unlock: sau Core Mission đầu tiên hoàn thành
    │   ├── Spaced Repetition (1–2 câu ôn, không điểm, không streak impact)
    │   ├── "Tắt đèn" action
    │   └── Daily Recap Bubble (thought bubble xuất hiện khi tắt đèn)
    │
    ├── 🛋️ PHÒNG KHÁCH — unlock: khi Happiness < 50%
    │   ├── Side Quests: Bug Hunt, Peer Review, Repro Steps
    │   ├── TV: Real Bug of the Week, Weekly Challenge content
    │   ├── Sprint Demo Card: tạo + share (→ fill Happiness +50%)
    │   └── Delight Tap: Bugsy trên sofa (pure delight, no game effect)
    │
    ├── 🚿 PHÒNG TẮM — unlock: sau streak 3 ngày
    │   ├── Flash Quiz: 2–3 câu, không hint option (rèn Discipline)
    │   ├── Mirror Moment: Bugsy nhìn gương sau Flash Quiz (visual only)
    │   └── Streak Tracker: counter ngày liên tiếp làm Flash Quiz
    │
    └── 🌿 SÂN — unlock: streak 7 ngày / Week 1 complete
        ├── Day 7 cinematic: không text, không UI — chỉ khoảnh khắc
        ├── Outdoor idle: Bugsy tự do, hoa, cỏ
        └── Item Shop placeholder (Phase 2)
```

### Navigation model

**Immersive Mode (default):** User đang ở trong một phòng, full-screen. UI chrome = room-specific (không có bottom tab bar chung). Cảm giác "đang ở với Bugsy".

**Apartment View:** Tap 🏠 icon góc trên phải → isometric view tất cả phòng. Tap phòng → Bugsy walk animation 0.8s → vào phòng đó. Tap 🏠 lại = trở về phòng trước.

**Swipe:** Khi đang trong Immersive Mode, swipe trái/phải = chuyển phòng liền kề (theo thứ tự: Work Room ↔ Kitchen ↔ Bedroom ↔ Living Room ↔ Bathroom ↔ Yard).

**Long press Bugsy:** Bugsy nghĩ 1.5s → bubble gợi ý phòng cần nhất (bar thấp nhất). Tap bubble → navigate.

**Good Morning Moment:** Lần đầu mở app mỗi ngày, Bugsy vươn vai + nói chào bằng ngôn ngữ travel destination. Overlay 2–3s, auto-dismiss. Không add depth.

### Depth model

Max depth = 3. Không có breadcrumb, không có back button trong quiz flow — chỉ có X.

| Level | Surface | Dismiss |
|-------|---------|---------|
| L0 | Apartment View | 🏠 tap lần 2 |
| L1 | Immersive Mode (trong phòng) | 🏠 icon hoặc swipe |
| L2 Full | Core Mission, Transfer Gate, My Journey | X (exit) |
| L2 Sheet | Story Panel, Daily Recap Bubble, Mission Board expand | Tap backdrop / CTA |

### Surfaces và stated needs

| Need người dùng | Surface | Delivered by |
|-----------------|---------|--------------|
| Học QC hàng ngày | Work Room → Core Mission | Quiz 8 câu + Story-Rule |
| Thấy Bugsy tổng quan | Apartment View / Immersive Mode | Room flash, Need Bars, idle |
| Nuôi Bugsy (Hunger) | Phòng Bếp | Quick Feed + Bug Report |
| Nghỉ ngơi / ôn bài | Phòng Ngủ | Spaced Rep + tắt đèn + Recap Bubble |
| Chill / Side Quests | Phòng Khách | TV, Side Quest, Sprint Demo |
| Rèn Discipline | Phòng Tắm | Flash Quiz + Mirror Moment |
| Pet evolve | Work Room → Transfer Gate | QP + real-world evidence |
| Chia sẻ progress | Phòng Khách → Sprint Demo Card | Native share sheet |
| Explore tự do | Sân | Open space, Day 7 cinematic |
| Giới thiệu lần đầu | Onboarding | Splash → Egg → Aha → Sign-up Gate |

---

## Voice and Tone

### Nhân cách thương hiệu

Bugsy là **đồng nghiệp nhỏ**, không phải thầy giáo. QC Pet nói chuyện như một người bạn trong team — vui vẻ, khích lệ, không bao giờ phán xét khi sai.

| Attribute | Thể hiện |
|-----------|---------|
| **Friendly** | "Bạn" (không phải "bạn dùng" hay "người dùng") |
| **Playful** | Emoji phù hợp, wordplay nhẹ, game references |
| **Encouraging** | Sai → "Lần này bạn chưa catch được, nhưng..." không phải "Sai rồi!" |
| **Bite-sized** | Câu ngắn, 1 ý mỗi câu, không viết đoạn dài |
| **Expert-lite** | Dùng thuật ngữ QC nhưng luôn giải thích trong context |

### Microcopy patterns

**Tagline (bất biến):** *"Pet bạn đói. Đi tìm bug đi."*

**Bugsy dialogue (onboarding):**
- Hungry state: *"Mình hơi đói rồi đó bạn ơi. Bạn có thể giúp mình tìm bug đầu tiên không?"*
- Post-correct: *"Tuyệt vời!"*
- Egg waiting: *"Chạm để nở trứng! 🐣"*
- Name prompt: *"Đặt Tên Thú Cưng"*

**Quiz feedback:**
- Correct: *"Bug Smashed! 🔨"* (không phải "Đúng!")
- Wrong: *"Bug Escaped! 🐛"* (không phải "Sai!")
- Next: *"Câu tiếp theo →"* / *"TIẾP TỤC HỌC"*

**Weekly Bug Log:**
- Prompt: *"Tuần trước bạn gặp bug gì thú vị ở công việc?"*
- Submit: *"Cho Bugsy ăn 🍔"*
- Dismiss: *"Bỏ qua tuần này"* (không phải "Hủy")

**Error messages:**
- Network: *"Mạng bị bug? Thử lại nhé!"*
- Name empty: input highlight, không cần toast
- Submit fail: *"Lưu chưa được, thử lại nhé"* — nhẹ nhàng, không có exclamation

**Empty states:**
- Mission done: *"Hoàn thành rồi! Quay lại ngày mai nha ✓"*
- After long absence: *"Bugsy nhớ bạn lắm... 😢"* (push notification)

**Name suggestions (Egg Hatching):** Bugsy 🔍 · Null 🤖 · Mèo Prod 😈

---

## Component Patterns

*(Behavioral spec — visual spec xem `DESIGN.md §Components`)*

### Navigation — Room Navigation

**Persistent top bar (mọi Immersive Mode screen):**
- Left: pet name + Bugsy avatar chip
- Center: streak flame counter
- Right: QP chip + BC chip + 🏠 icon (44×44px)
- Top bar hidden trong: Onboarding screens, Day 7 cinematic, Flash Quiz active state

**Apartment View:**
- Truy cập: tap 🏠 icon từ bất kỳ Immersive Mode screen
- Room tap: Bugsy walk animation → Immersive Mode mới
- Never stack hai Apartment Views — tap 🏠 khi đang ở Apartment View = trở về phòng trước

**Immersive Mode switching:**
- Swipe trái/phải: next/prev phòng trong order (Work Room → Kitchen → Bedroom → Living Room → Bathroom → Yard). Swipe sẽ chỉ đến phòng đã unlock — skip locked room.
- Long press Bugsy: suggestion bubble → tap = navigate to suggested room

**Rooms không có universal bottom nav.** Mỗi phòng có room-specific action area ở bottom (Work Room: Mission start CTA; Kitchen: Feed button; etc.)

**Không có swipe-to-dismiss trong mission quiz** — tránh accidental exit. Chỉ có X button explicit.

### Card (Tactile Card)

- Tất cả card có `hover:scale-105` trên mobile (touch: `:active` scale 0.98).
- Card là interactive (tappable) → `cursor-pointer`.
- Card non-interactive (display only) → không có hover effect.
- Need bar cards: tappable, future → mở care detail panel (Phase 2).

### Button — Primary CTA

- Một CTA duy nhất per screen/panel.
- Width: `w-full` trong slide-up panels; auto-width trên action rows.
- Press feedback: `translateY(4px)` + shadow reduce (100ms) → spring back.
- Loading state: text đổi sang "Đang Tải..." + `animate-spin` icon; button disabled.
- Never hai primary buttons cùng level.

### Slide-up Panel (Sheet)

- Trigger: external event (correct/wrong answer, Monday morning) hoặc user action (tap Mission card).
- Dismiss: tap backdrop hoặc CTA button; không có X trong Story Panel.
- Focus trap: khi panel open, tab navigation ở lại trong panel.
- Scroll: panel nội dung có thể scroll nếu dài hơn 80vh.
- Stacking: chỉ 1 panel mở tại 1 thời điểm; closing cũ trước khi opening mới.

### Speech Bubble

- Render trong: Aha Moment (cố định ở top), Egg Hatching guide bubble (animate-bounce).
- Tap Bugsy trên Home Screen → ephemeral bubble 2s rồi tự dismiss (không cần tap).
- Bubble direction: luôn downward (tail pointing down) khi bubble ở trên Bugsy.

### Terminal / Code Block

- Chỉ dùng trong: Bug Ticket card, Pet Naming input, Weekly Bug Log textarea.
- Không dùng trong general UI text.
- Traffic-light dots header: decorative, không functional.
- Cursor blinking là visual affordance, không indicate loading state.

### Progress Dots (Mission step indicator)

- Luôn visible trong Daily Mission header — cho user biết còn bao nhiêu câu.
- Không có back navigation qua dots (quiz là linear).
- Dots fill left-to-right theo thứ tự hoàn thành.

### Confetti

- Trigger: chỉ khi trả lời ĐÚNG, và khi hoàn thành toàn bộ session.
- Không trigger khi sai — confetti là reward signal, không phải decoration thường xuyên.
- 50 pieces, 4 colors, fall 1–3s, tự cleanup sau khi animation xong.

### Mission Board

- Kanban 3 columns: **Todo | In Progress | Done**.
- Card drag: user thực hiện khi bắt đầu và hoàn thành Core Mission — không tự động.
- In Progress: chỉ 1 card cùng lúc (1 mission/ngày).
- Done: cards stack với rotation nhẹ ±3deg (paper pile feel).
- Bug Report Wall: grid sticky notes bên dưới kanban, 1 note/lesson hoàn thành.
  - Wall đầy (~30 notes): confetti + Bugsy excited + visual milestone chip.
- Mission Board accessible từ Work Room — không truy cập được từ phòng khác.

### Flash Quiz

- Render trong Phòng Tắm, stripped-down UI: không có scenario card, không có category badge.
- 2–3 câu/session; không có hint button ở bất kỳ thời điểm nào.
- Feedback: instant color (đúng → lime, sai → error-container) nhưng không có Story-Rule Panel.
- Sau câu cuối: Mirror Moment auto-triggers (không cần user action).
- Flash Quiz không earn QP nhưng fill Discipline bar + tăng Streak Tracker.
- Q1 Exception từ Core Mission (GAP-14) không áp dụng cho Flash Quiz.

### Mirror Moment

- Trigger: tự động 0.5s sau Flash Quiz hoàn thành.
- Duration: 2.5s, self-dismiss — không cần tap.
- Visual: Bugsy + reflection in mirror. Reflection state phụ thuộc Discipline:
  - ≥70%: outfit pressed, tư thế tự tin, sparkle aura trên reflection.
  - 30–69%: normal outfit, tư thế neutral.
  - <30%: tóc bù xù, tư thế mệt, không sparkle.
- No text overlay trong Mirror Moment — visual only (design constraint, không được thêm text).
- Không dismissable sớm — user chờ 2.5s. Đây là intentional pause.

### Daily Recap Bubble

- Trigger: user tap "Tắt đèn" trong Phòng Ngủ.
- Visual: CSS thought bubble (không phải modal, không phải sheet) phía trên Bugsy đang ngủ.
- Nội dung: tên bài học hôm nay + 1 rule ngắn từ 3-2-1 Summary + streak hiện tại.
- Nếu chưa làm Core Mission trong ngày: *"Bugsy ngủ mà chưa học gì hôm nay... nhưng ngày mai vẫn ở đây nhé."*
- Tap anywhere = dismiss. Không block UI.
- Không có CTA, không có link — chỉ là recap nhẹ nhàng.

### Good Morning Moment

- Trigger: lần đầu mở app trong ngày (chỉ 1 lần/ngày, không trigger lần 2+).
- Visual: Bugsy vươn vai + speech bubble ngắn bằng ngôn ngữ travel destination.
- Duration: 2–3s auto-dismiss (không cần tap, nhưng tap = dismiss sớm).
- Không add navigation depth — renders trên L1 hiện tại.
- Subtitle tiếng Việt nhỏ bên dưới ngôn ngữ foreign.

### Delight Tap

- Trigger: user tap Bugsy khi đang ngồi trên sofa (Phòng Khách).
- Visual: Bugsy giật mình → rotate 10deg → trở về → cười (2 frame animation).
- Duration: 1.5s, self-resets.
- Không có game effect (không fill bar, không earn currency).
- Design principle: không phải mọi interaction đều phục vụ game mechanic.
- Cooldown: 5s sau khi trigger trước (tránh spam nhưng không cần thông báo).

### Room Transition Animation

- Trigger: tap phòng trong Apartment View, hoặc swipe sang phòng khác.
- Visual: Bugsy walk-cycle 0.8s qua "hành lang" (không phải cut scene, chỉ overlay slide).
- Không có loading indicator trong transition — transition nhanh đủ để không cần.
- Nếu phòng cần load data (Core Mission mới), hiện shimmer skeleton khi đến nơi.

---

## State Patterns

### Work Room states

| State | Trigger | Visual change |
|-------|---------|---------------|
| **Normal** | All bars > 30% | Bugsy idle cycle (typing, coffee, note-scribble) |
| **Mission available** | Core Mission chưa done today | Mission start CTA glows (`floating-glow`) |
| **Mission in progress** | Core Mission đang active | Mission Board card "In Progress", Progress dots visible |
| **Mission done today** | Core Mission hoàn thành | Board card → "Done" column, Bugsy Excited, bars fill |
| **Transfer Gate pending** | QP ≥ threshold, chưa submit | Lock icon trên evolution bar, "?" floats over Bugsy |
| **Bug Report Wall full** | ~30 lessons done | Confetti, Bugsy Excited, visual milestone chip |

### Core Mission states

| State | Visual |
|-------|--------|
| Loading | Shimmer skeleton trên Scenario Card |
| Q1 warm-up | Card border xanh nhạt thay vì trắng (GAP-14 signal) |
| Unanswered | Answer buttons neutral, equal visual weight |
| Correct selected | Button `{colors.primary-container}` + Bugsy happy + confetti + Story panel |
| Wrong selected | Button `{colors.error-container}` + Bugsy sad + Story panel (Rule vẫn hiện) |
| 3 sai liên tiếp | Rescue Mechanic: Bugsy nói + 3 options xuất hiện |
| Session complete | 3-2-1 Summary card → bars animate → Mission Board card drag to Done |
| Session resume | "Chào mừng trở lại — X/8 câu rồi đó" banner + Continue CTA |
| Exited early (X) | Confirm: "Thoát? Progress câu này sẽ không lưu" → Yes/Cancel |

### Kitchen states

| State | Trigger | Visual change |
|-------|---------|---------------|
| **Normal** | Hunger > 30% | Bugsy idle tại bếp, tủ lạnh đóng |
| **Hunger critical** | Hunger ≤ 20% | Tủ lạnh hé mở, Bugsy mở tủ nhìn vào trống, Quick Feed CTA nổi bật |
| **After Quick Feed** | Quick Feed tapped | Tủ lạnh đóng, Bugsy ăn animation, Hunger bar fill +25% |
| **Bug Report submitted** | Submission complete | Bugsy stirring pot, steam animation, Hunger fill |
| **Bug Report form** | Tap "Nộp Bug" | Form slide-up (textarea + severity/priority fields) |

### Bedroom states

| State | Trigger | Visual change |
|-------|---------|---------------|
| **Awake** | Default on enter | Room bright (30%), Bugsy đứng/ngồi |
| **Spaced Rep available** | Bedside card glows | Card pulse animation draws attention |
| **Spaced Rep active** | Tap card | Quiz card centered, no score display |
| **Pre-sleep** | "Tắt đèn" tapped | Room dims 70%, stars appear on ceiling |
| **Lights out** | Dim complete | Room near-black, Bugsy curled/sleeping, Recap Bubble triggers |
| **Recap Bubble** | Post lights-out | Thought bubble above sleeping Bugsy, 1 rule inside |

### Living Room states

| State | Trigger | Visual change |
|-------|---------|---------------|
| **Idle** | Default | Bugsy on sofa, TV off, warm ambient |
| **TV on** | Tap TV | Screen lights up, content plays (Weekly Challenge, Real Bug) |
| **Side Quest available** | Card floats above coffee table | Tap → Side Quest begins |
| **Side Quest complete** | Hoàn thành | Happiness bar fill +40%, brief celebration |
| **Sprint Demo Card ready** | End of 7-day sprint | Card appears framed on wall, share CTA |
| **Share success** | Share complete | Happiness bar fill +50%, Bugsy happy |
| **Delight Tap** | Tap sofa-Bugsy | Startled → giggle animation 1.5s |
| **Happiness critical** | Happiness ≤ 20% | Bugsy huddled in corner, sofa has sad plushie |

### Bathroom states

| State | Trigger | Visual change |
|-------|---------|---------------|
| **Normal** | Default | Bugsy idle at sink, Streak Tracker chip visible |
| **Flash Quiz active** | Tap Flash Quiz CTA | Full-screen quiz overlay, room bg dimmed |
| **Flash Quiz — correct** | Correct answer | Instant lime flash, next Q |
| **Flash Quiz — wrong** | Wrong answer | Instant error flash, next Q (no Story-Rule) |
| **Flash Quiz complete** | Q3 done | Score instant reveal + Mirror Moment trigger |
| **Mirror Moment** | Auto 0.5s post-quiz | Bugsy + reflection state based on Discipline |
| **Discipline critical** | Discipline ≤ 20% | Room feels slightly grimy (grout darker), Bugsy disheveled |

### Yard states

| State | Trigger | Visual change |
|-------|---------|---------------|
| **Locked** | Before Day 7 | Visible in Apartment View: door locked, "?" chip |
| **Day 7 Cinematic** | Unlock trigger fires | Full-screen, no UI. Bugsy runs, lies on grass, looks up |
| **Post-cinematic** | Cinematic ends | Yard Immersive Mode, Bugsy idle outdoors |
| **Outdoor idle** | Default | Bugsy walks, sniffs flowers, sits in sun |
| **Item Shop placeholder** | Tap shop kiosk | "Shop coming soon" chip, no purchase UI |

### Apartment View states

| State | Trigger | Visual change |
|-------|---------|---------------|
| **Normal** | Default | All unlocked rooms lit, Bugsy in current room |
| **One Room Emergency** | Bar thấp nhất | 🔥 chip trên phòng đó, warm glow rim |
| **Multiple attention** | ≥2 phòng cần | All needing rooms flash gently (không panic) |
| **Room locked** | Not yet unlocked | Desaturated, "?" on door |
| **Room unlock preview** | Trigger condition almost met | Door hé mở 10%, warm light peek |

### Egg Hatching states (Onboarding)

| State | Visual |
|-------|--------|
| Idle | `egg-shake` 0.5s + `egg-glow` |
| Tap 1–4 | Shake speed tăng (duration = 0.5 / clickCount) |
| Tap 5 | Egg scale(1.5) opacity(0) → Bugsy appears |
| Post-hatch | `bugsy-pop` animation, naming panel slides up |
| Name empty submit | Input border → `{colors.error}` flash 1000ms, shake |
| Confirming | Button "Đang Tải..." + animate-spin, disabled |

### Bugsy need bar states

| Range | Bar visual | Bugsy behavior |
|-------|-----------|-------|
| 70–100% | Full color + shimmer | Happy idle, responsive |
| 30–69% | Màu nhạt hơn | Normal idle |
| 0–29% | Pulse `{colors.error}` | State-specific (Hungry/Tired/Sad/Distracted) |
| 0% | Constant `{colors.error}` no pulse | Regressed state (không chết — FR-6) |

### Overlay / Modal states

| State | Trigger | Visual |
|-------|---------|--------|
| Closed | Default | `translateY(100%)` |
| Opening | Event trigger | Spring animation `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Open | Fully visible | `translateY(0)`, backdrop active |
| Closing | CTA tap / backdrop tap | `translateY(100%)` reverse |

### Egg Hatching states

| State | Visual |
|-------|--------|
| Idle | `egg-shake` 0.5s + `egg-glow` |
| Tap 1–4 | Shake speed tăng (duration = 0.5 / clickCount) |
| Tap 5 | Egg scale(1.5) opacity(0) → Bugsy appears |
| Post-hatch | `bugsy-pop` animation, naming panel slides up |
| Name empty submit | Input border → `{colors.error}` flash 1000ms, shake |
| Confirming | Button "Đang Tải..." + animate-spin, disabled |

### Bugsy need bar states

| Range | Bar visual | Bugsy |
|-------|-----------|-------|
| 70–100% | Full color + shimmer | Happy / Excited |
| 30–69% | Màu nhạt hơn | Normal idle |
| 0–29% | Pulse `{colors.error}` | State: Sad/Hungry/Tired |

### Overlay / Modal states

| State | Trigger | Visual |
|-------|---------|--------|
| Closed | Default | `translateY(100%)` |
| Opening | Event trigger | Spring animation `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Open | Fully visible | `translateY(0)`, backdrop active |
| Closing | CTA tap / backdrop tap | `translateY(100%)` reverse |

---

## Interaction Primitives

### Tap

| Target | Feedback | Result |
|--------|----------|--------|
| Bugsy (Work Room / idle) | scale(1.2) → scale(1) 150ms | Speech bubble 2s |
| Bugsy (sofa / Phòng Khách) | scale(1.1) rotate 10deg | Delight Tap — startled → giggle |
| Egg (onboarding) | Shake speeds up per tap | 5th tap → hatch |
| Answer button (Core Mission) | `translateY(4px)` + shadow 2px | Immediate feedback + Story Panel |
| Answer button (Flash Quiz) | `translateY(4px)` instant color | Next question (no Story Panel) |
| Chip (Bug Log) | scale-105 flash | Appends text to textarea |
| 🏠 icon | Ripple | Toggle Apartment View |
| Room tile (Apartment View) | Highlight glow | Bugsy walk → Immersive Mode |
| "Tắt đèn" button (Bedroom) | Dim room 70% | → Daily Recap Bubble |
| Quick Feed button (Kitchen) | scale-105 press | +Hunger 25% + animation |
| Splash screen | Sparkle at touch point | Navigate to Egg Hatching |

### Press-and-hold

| Target | Duration | Result |
|--------|----------|--------|
| Bugsy (any Immersive Mode room) | 1.5s | Suggestion bubble → suggested room name + icon |

### Swipe

| Gesture | Surface | Result |
|---------|---------|--------|
| Swipe left/right | Immersive Mode | Navigate to adjacent unlocked room |
| Swipe down | Bottom sheet open | Dismiss sheet |
| Swipe down | Apartment View | Collapse to Immersive Mode (last room) |

### Hover (desktop preview only)

Sprint Demo Card: `perspective(1000px) rotateX(Ydeg) rotateY(Xdeg)` — decorative, không functional trên mobile.

### Micro-interactions (animations)

| Interaction | Animation |
|-------------|-----------|
| Button press | translateY(4px) + shadow 4px→2px, 100ms |
| Card hover | scale(1.05) transition |
| Chip tap | scale-105 → scale-95 |
| Progress bar fill | shimmer-effect overlay sweep 2s loop |
| XP counter increment | Bounce scale(1.2)→scale(1) + float "+X QC" text upward |
| Textarea focus | Parent scale(1.01) |

---

## Accessibility Floor

*(Foundation MVP — Phase 2 sẽ audit chi tiết)*

| Category | Requirement | Status |
|----------|-------------|--------|
| Color contrast | `{colors.on-surface}` #001a41 trên white/peach: >7:1 WCAG AAA | ✓ |
| Touch target | Tất cả tappable targets ≥ 44×44px | Required |
| Text size minimum | `code-sm` 12px — chỉ UI labels phụ; body text ≥ 14px | ✓ |
| Alt text | Tất cả Bugsy images có `alt` text đầy đủ | ✓ (trong Stitch HTML) |
| Language declaration | `lang="vi"` trên tất cả HTML | ✓ |
| Focus management | Slide-up panels: focus trap khi mở, return focus khi đóng | Required |
| Reduced motion | `@media (prefers-reduced-motion)` → disable bounce/shimmer animations | Phase 2 |
| Screen reader | `aria-label` cho icon-only buttons (Bottom Nav tabs) | Required |
| Error identification | Input errors không chỉ dùng màu — kèm text hoặc border change | Required |

---

## Key Flows

*(Nguồn: PRD §2.3 User Journeys — mirror source-spec names verbatim)*

### UJ-1: Linh gặp Bugsy lần đầu và quyết định ở lại

*Linh, 23 tuổi, junior tester 1 năm kinh nghiệm. Hay viết bug theo happy-path UI click, không biết mình có đang tốt lên không. Tải app từ store sau khi thấy tagline "Pet bạn đói. Đi tìm bug đi."*

**Entry state:** Chưa tạo tài khoản. App chưa từng mở.

1. App load → màn hình tối → tiếng bàn phím → **Quả trứng run rẩy** trên bàn. Không có text, không có tutorial. Linh tò mò chạm vào.
2. **Egg Hatching**: tap 5 lần — trứng shake nhanh dần → vỡ ra → Bugsy ngáp, nhìn thẳng vào camera. Naming panel slide up. Linh đặt tên "Junior".
3. Bugsy: *"Mình hơi đói rồi... mà mình chỉ ăn bug thôi."* → **Warm-up**: bug report ngắn, Pass/Fail. Linh đoán.
4. **Aha Moment**: bug report đầy đủ hơn (Scenario B + D). Linh đọc kỹ console log, chọn FAIL. Đúng.
5. **Climax:** Story Panel slide up — Bugsy vui, kể câu chuyện bug thật. Rule Landing: *"Luôn kiểm tra giá trị biên (0, null, âm)."* Linh lần đầu cảm thấy mình làm đúng việc tester thực sự.
6. **Reward**: BC + QP counters animate (server đã commit trước). Bugsy excited.
7. **Cliffhanger**: *"Bạn nghĩ mình có qua được không...?"* — Linh muốn quay lại.
8. **Notification Preference** → **Sign-up Gate**: *"Lưu Junior lại"* — Linh sign up vì không muốn mất pet.
9. **Resolution**: HOME → Phòng Làm Việc. Cửa bếp hé mở ở góc màn hình. Không có tooltip.

**Edge case**: Kill app sau Aha Moment nhưng trước Sign-up → server đã commit → resume đúng chỗ khi mở lại.

---

### UJ-2: Linh chăm Bugsy trong một ngày bình thường (Day 7+)

*Linh, đã quen app 1 tuần, 5 phòng unlocked, streak 7 ngày liên tiếp.*

**Entry state:** Sign-in. Mở app lúc 7h sáng. Good Morning Moment: Bugsy vươn vai, nói "Xin chào" (tiếng địa phương đang hướng tới).

1. **Sáng — Phòng Bếp**: Bugsy nhìn tủ lạnh trống. Linh tap Quick Feed (1 phút) → Hunger bar +25%, Bugsy ăn animation.
2. **Trưa** — notification từ Bugsy: *"Công việc có bug gì hôm nay không?"* → deep link vào Work Room.
3. **Work Room — Core Mission**: Mission Board card kéo "In Progress". Lesson 30s. Quiz 8 câu (framework 2-5-1-2):
   - Q1 warm-up (border xanh nhạt, GAP-14) → Q2 nền → Q3–Q7 thực hành → Q8 synthesis.
   - **Climax**: Q5 — câu nặng nhất, Linh dừng lại suy nghĩ 45 giây → trả lời đúng. Confetti. Rule Landing.
4. **3-2-1 Summary card**: 3 điều nhớ, 2 lỗi phổ biến, 1 đối chiếu thực tế.
5. Mission Board card kéo "Done". Tất cả Need Bars buff lên. Bugsy nhảy.
6. **Tùy chọn — Phòng Khách**: Linh tap TV → Weekly Challenge. 1 task thực hành.
7. **Tối — Phòng Tắm**: Flash Quiz 2 câu → Mirror Moment (Discipline 65% → neutral reflection).
8. **Phòng Ngủ**: Spaced Rep 1 câu (Q từ bài học 3 ngày trước). Tap "Tắt đèn" → Daily Recap Bubble. Linh đọc rule → dismiss → ngủ.

**Resolution**: Đóng app. Tổng: ~12–16 phút phân tán trong ngày.

**Edge case**: Đóng app giữa quiz → auto-save mỗi câu → *"Chào mừng trở lại, bạn làm được 4/8 câu rồi đó."*

---

### UJ-3: Bugsy sắp evolve — Linh nộp Transfer Gate

*Linh, Day 21, đủ QP cho v0.5 nhưng thiếu Transfer Gate evidence.*

**Entry state:** Evolution progress bar gần đầy, "pending" indicator trên Work Room trong Apartment View.

1. Notification: *"Bugsy đang chuẩn bị hành lý... còn thiếu 1 thứ."* → deep link vào Work Room.
2. Transfer Gate screen: *"Tuần này bạn đã report bug nào được đồng nghiệp confirm?"*
3. Linh submit text + screenshot. App nhận: *"Evidence đã ghi nhận."*
4. **Climax**: Evolution animation — Bugsy nhảy, đóng gói vali, cinematic chuyến đi đầu tiên (domestic city). Phòng Ngủ unlock.
5. Souvenir đầu tiên (thành phố trong nước) tự động xuất hiện trên kệ Phòng Khách.
6. **Resolution**: HOME. Souvenir mới. Linh hiểu hành trình Bugsy qua không gian sống — không cần giải thích.

**Edge case**: Linh nộp Transfer Gate khi QP chưa đủ → hệ thống ghi nhận nhưng evolution không trigger. Indicator: *"Evidence đã lưu. Cần thêm X QP nữa để Bugsy xuất phát."*

---

## Bugsy Behavior

### Idle cycle (Home Screen)

Bugsy không đứng yên. Random interval 30–60s, cycle qua:
- Gõ keyboard chậm (cánh vỗ nhẹ)
- Nhìn camera (mắt nhìn thẳng vào user)
- Uống cà phê (cánh nâng mug)
- Gãi đầu (một cánh gãi)

Base: `animate-bounce-subtle` (translateY -5px, 3s loop) luôn active.

### Reactive tap (Home Screen)

Tap Bugsy → random utterance bubble 2s:
- *"Cheep! (Debugging...)"*
- *"Phát hiện bug rồi!"*
- *"[Tên pet] đang học cách test!"*
- *"Cần bug hơn!"*

### Transfer Gate visual (Evolution pending)

Khi QP đạt threshold nhưng chưa có real-world submission:
- "?" floating above Bugsy
- Evolution progress bar hiện khóa `🔒`
- Tooltip: *"Gửi bug thật từ công việc để Bugsy tiến hóa"*

### Pet không bao giờ chết (Brand constraint — PRD hard constraint)

- Bars giảm đến minimum, không về 0 hard delete
- Không có "game over" state
- Sau vắng nhiều ngày: Bugsy sad nhưng vẫn còn → bubble *"Hôm nay bạn ở đâu vậy?"*
- Recover hoàn toàn sau 1 session

---

## Currency & Reward Behavior

### Bug Coins (BC) — `{colors.bc-amber}`

- Earn: Daily Mission hoàn thành (+10 BC), Weekly Bug Log submit (+5 BC)
- Spend: Shop items Phase 2, workspace upgrades
- Không bao giờ giảm do need bars thấp
- Display: `{colors.secondary}` text trong header chip

### Quality Points (QP) — `{colors.qp-teal}`

- Earn: Quiz đúng (+10 QP/câu), streak bonus, skill submission
- Không bao giờ giảm — cumulative lifetime score (NFR-3.3 PRD)
- Transfer Gate: QP threshold + real submission → evolution unlock
- Display: `{colors.primary}` text trong header chip

### Counter earn animation

1. Header counter bounces (scale 1.2 → 1)
2. "+X QC" floating text rises từ mission area → header
3. Counter tick-up (duration 800ms)
4. Sound: coin jingle + tick sfx

---

## Notification Behavior

*(Visual integration — push managed by OS)*

| Trigger | Type | Copy |
|---------|------|------|
| Daily 9:00 AM | Push | *"Bugsy đang đợi bạn đó 🐣"* |
| Thứ Hai | Push | *"Bug Log tuần mới — Bugsy đói rồi!"* |
| Cuối sprint | Push | *"Sprint Demo Card sẵn sàng 🎉"* |
| Bar < 20% | In-app | Bugsy expression change + gentle alert sound |
| 3 ngày vắng | Push | *"Bugsy nhớ bạn lắm... 😢"* |

In-app notification: không dùng native toast banner. Dùng Bugsy expression change hoặc Mission card pulse.

---

## Error & Empty States

### Empty states

| Screen | Condition | Visual |
|--------|-----------|--------|
| Mission tab | Hôm nay đã hoàn thành | Bugsy với ✓, *"Hoàn thành rồi! Quay lại ngày mai nha"* |
| Sprint Card | Chưa có sprint data | Outline Bugsy + *"Sprint đầu tiên sắp bắt đầu!"* |
| Train tab | Chưa có bài | Bugsy đang đọc sách, *"Bài học đầu tiên sắp ra lò..."* |
| Feed tab | Phase 2 | Lock icon + *"Sắp ra mắt"* |

### Error states

| Error | Trigger | Visual |
|-------|---------|--------|
| Name input rỗng | Submit tap | Input container border → `{colors.error}` flash 1000ms |
| Network error | Mission load fail | Retry card: Bugsy với laptop lỗi, *"Mạng bị bug? Thử lại nhé!"* + Retry button |
| Submit fail | Bug Log POST fail | Small bottom toast: *"Lưu chưa được, thử lại nhé"* |

### Loading states

- **App cold start:** Splash Screen là loading screen — không cần spinner riêng.
- **Mission load:** Shimmer skeleton trên Scenario Card.
- **Image fail:** Fallback: rounded-full `{colors.secondary-container}` bg với Bugsy initial letter.

---

## Navigation Flow

```
[Splash / Establishing Shot]
         │ tap → zoom in through window
         ▼
  [Egg Hatching + Naming]
    • ×5 taps → hatch
    • Enter name → confirm
         │
         ▼
 [Aha Moment / First Lesson]
    • Bug ticket → answer → story panel
         │ "TIẾP TỤC HỌC"
         ▼
    [HOME SCREEN] ◄───────────────────────────────────┐
         │                                             │
    ┌────┼──────────────────────┬──────────────────┐   │
    ▼    ▼                      ▼                  ▼   │
 [Mission] [Feed-P2]  [Weekly Bug Log]        [Train]  │
 [Daily Mission]       [slide-up, Thứ Hai]  [Sprint   │
   quiz flow                                 Demo]     │
    │                           │               │      │
    └───────────────────────────┴───────────────┘      │
                   │ hoàn thành                        │
                   └───────────────────────────────────┘
```

---

## Responsive & Platform

**iOS:**
- Safe area bottom → extra `pb-safe` dưới Bottom Nav
- Haptic feedback trên button press (Light impact)
- Native share sheet khi tap SHARE trên Sprint Demo Card

**Android:**
- System back button → same behavior as X button (thoát mission, dismiss sheet)
- Material ripple bị tắt — dùng custom `active:scale-95` thay thế
- Không dùng Android Navigation Bar color match trong MVP

**Tablet (Phase 2):** Layout hiện tại không tối ưu cho iPad/tablet — Home Screen bento grid cần breakpoint riêng.

---

## MVP Scope

### Trong MVP (7 screens đã thiết kế)

- Splash → Egg Hatching → Aha Moment → Home → Daily Mission → Weekly Bug Log → Sprint Demo Card
- 4 need bars, 5 Bugsy states
- BC + QP currency display + earn animation
- Confetti, shimmer, tactile press interactions
- Slide-up panels (Story, Naming, Bug Log)
- Basic offline handling (Home from cache, retry on Mission)

### Ngoài MVP — Phase 2

- Feed screen (mua đồ ăn, care actions)
- Shop / Workspace customization (bàn, ghế, monitor mới)
- Travel destinations (evolution environments)
- Collection ledger / progress map
- Pet evolution visuals (Bugsy grown up)
- Multiplayer / leaderboard
- Dark mode
- Tablet layout
- Notification center trong app
- Settings / profile screen
- Gamification: achievements, badges collection

---

*Nguồn: PRD final (2026-06-12) · Stitch export (`imports/stitch-output/`) · `.decision-log.md`*  
*Workspace: `_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/`*
