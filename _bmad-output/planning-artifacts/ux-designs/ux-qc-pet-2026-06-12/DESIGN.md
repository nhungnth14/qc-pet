---
name: QC Pet — Bubbly Tech Companion
version: 1.0.0
status: draft
date: 2026-06-14
source: Stitch export (imports/stitch-output/) + stitch-prompt.md + tamagotchi-reference.md
colors:
  surface: '#f9f9ff'
  surface-dim: '#cbdaff'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e0e8ff'
  surface-container-highest: '#d8e2ff'
  on-surface: '#001a41'
  on-surface-variant: '#3e4851'
  inverse-surface: '#002e69'
  inverse-on-surface: '#edf0ff'
  outline: '#6e7882'
  outline-variant: '#bdc8d2'
  surface-tint: '#006491'
  primary: '#006491'
  on-primary: '#ffffff'
  primary-container: '#22b5ff'
  on-primary-container: '#004464'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#8aceff'
  inverse-primary: '#8aceff'
  secondary: '#944839'
  on-secondary: '#ffffff'
  secondary-container: '#fd9d89'
  on-secondary-container: '#773224'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a5'
  tertiary: '#674bb5'
  on-tertiary: '#ffffff'
  tertiary-container: '#b59cff'
  on-tertiary-container: '#472894'
  tertiary-fixed: '#e8ddff'
  tertiary-fixed-dim: '#cebdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  background: '#f9f9ff'
  on-background: '#001a41'
  surface-variant: '#d8e2ff'
  # Extended — không có trong Material 3 base nhưng dùng xuyên suốt app
  warm-peach-bg: '#FFE5D9'
  golden-hour-from: '#ffb4a5'
  golden-hour-to: '#c9e6ff'
  terminal-green: '#8ce68c'
  lime-submit: '#ccff00'
  rule-landing-bg: '#BFFFA1'
  qp-teal: '#00A8A8'
  bc-amber: '#FFB000'
  # Room environment backgrounds
  kitchen-amber: '#FFF8E7'
  bedroom-soft: '#ECEEFF'
  living-warm: '#FFF4E8'
  bathroom-mint: '#E6F5F2'
  yard-sky: '#E8F4FF'
  yard-grass: '#C5E8C7'
typography:
  display:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '900'
    lineHeight: 40px
  header-lg:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
  ui-button:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '800'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
spacing:
  xs: 4px
  base: 8px
  sm: 12px
  md: 24px
  lg: 40px
  container-padding: 20px
rounded:
  DEFAULT: 0.25rem
  lg: 0.5rem
  xl: 0.75rem
  2xl: 1rem
  3xl: 1.5rem
  full: 9999px
  # Slide-up panels: arbitrary rounded-t-[32px] / rounded-t-[40px]
  # Egg hatching: arbitrary rounded-[100%_100%_80%_80%]
---

# QC Pet — DESIGN.md

---

## Brand & Style

**"Cuteness-Driven Development"** — QC Pet hòa trộn hai thẩm mỹ tưởng chừng đối lập một cách có chủ ý:

- **Toy/Pet aesthetic**: Mềm mại, bo tròn, màu sắc tươi sáng, nhân vật có hồn — cảm giác như đang cầm một món đồ chơi đáng yêu trên tay.
- **Tech/Terminal aesthetic**: Pixel font, console output màu xanh lime, ticket card phong cách Jira, border dày kiểu comic — nhắc nhở người dùng rằng đây là công cụ học nghề thực sự.

Sự đối lập này là chủ ý: Bugsy đội tai nghe tím ngồi trước terminal xanh lá. Phần mềm nghiêm túc nhưng nhân vật thì đáng yêu — hạ thấp rào cản tâm lý khi học QC/testing.

**Nguyên tắc cốt lõi:**
1. Mọi thứ đều **bo tròn** — không có góc sắc trên card, button, hay khung.
2. Mọi element quan trọng đều có **viền 3px `{colors.on-surface}`** — tạo cảm giác comic/toy.
3. Độ sâu được tạo bởi **blocky flat shadow** (0px X, 4–6px Y), không phải drop-shadow mờ.
4. **Màu nền luôn sáng** — `{colors.warm-peach-bg}` hoặc `{colors.golden-hour-from→to}` làm nền chính. Không có dark theme trong MVP.
5. **Terminal dark** (`{colors.inverse-surface}`) chỉ xuất hiện bên trong content area như "cửa sổ vào thế giới code" — không phải theme tổng thể.

**Giọng điệu thương hiệu:** Vui vẻ, khích lệ, không phán xét. Bugsy là đồng nghiệp nhỏ, không phải thầy giáo. Xem thêm microcopy trong EXPERIENCE.md §Voice and Tone.

**Nhân vật Bugsy:** Baby chick vàng đội tai nghe tím — xem §Bugsy Character Spec.

---

## Colors

### Token chính (Material Design 3)

| Token | Hex | Vai trò |
|-------|-----|---------|
| `primary` | `#006491` | Deep Ocean Blue — link, icon navigation thụ động |
| `primary-container` | `#22b5ff` | Sky Blue — **màu action chính**, CTA button, active tab, highlight |
| `on-primary-container` | `#004464` | Text trên Sky Blue |
| `primary-fixed` | `#c9e6ff` | Ice Blue — stats card bg nhẹ, Sprint Demo Card gradient |
| `secondary` | `#944839` | Terracotta — streak icon, secondary text |
| `secondary-container` | `#fd9d89` | Coral/Peach — màu nền môi trường (tường, gradient) |
| `tertiary` | `#674bb5` | Deep Purple — màu tai nghe Bugsy, card accent |
| `tertiary-container` | `#b59cff` | Soft Purple — ticket header, tag bg |
| `inverse-surface` | `#002e69` | Dark Navy — story panel slide-up, overlay modal |
| `error` | `#ba1a1a` | Alert Red — bar critical, FAIL button, severity badge |
| `error-container` | `#ffdad6` | Soft Red — wrong-answer feedback bg |
| `surface` | `#f9f9ff` | Off-white — app background |
| `surface-container` | `#e9edff` | Light blue-white — card background thụ động |
| `on-surface` | `#001a41` | **Deep Navy** — text chính + border + shadow color |
| `on-surface-variant` | `#3e4851` | Slate — text secondary, placeholder |

### Extended colors (ngoài Material 3)

| Token | Hex | Dùng ở đâu |
|-------|-----|------------|
| `warm-peach-bg` | `#FFE5D9` | Body bg Egg Hatching, Aha Moment |
| Golden Hour gradient | `#ffb4a5` → `#c9e6ff` | Splash screen bg (180deg linear) |
| Sprint Card gradient | `#FFD1BA` → `#c9e6ff` | Sprint Demo Card bg (top → bottom) |
| `terminal-green` | `#8ce68c` | Console text, terminal input text |
| `lime-submit` | `#ccff00` | Bug Log submit button bg |
| `rule-landing-bg` | `#BFFFA1` | Rule Landing highlight box |
| `qp-teal` | `#00A8A8` | Quality Points currency display |
| `bc-amber` | `#FFB000` | Bug Coins currency display |

### Semantic mapping

| Ngữ nghĩa | Token |
|-----------|-------|
| Đúng / Pass / XP gain | `primary-container` (#22b5ff) + lime variants |
| Sai / Fail / Critical | `error` (#ba1a1a) + `error-container` |
| Bug Coins | `bc-amber` (#FFB000) |
| Quality Points | `qp-teal` (#00A8A8) |
| Streak | `secondary` (#944839) |
| Mission active | `primary-container` |
| Story / Rule panel | `inverse-surface` (#002e69) |
| Terminal / Code area | `on-background` (#001a41) bg + `terminal-green` text |

---

## Typography

Toàn UI dùng **Nunito Sans** — rounded terminals, thân thiện, năng động. Code sections dùng **JetBrains Mono** để tạo sự tương phản với context kỹ thuật.

| Scale | Font | Size | Weight | Line-height | Dùng cho |
|-------|------|------|--------|-------------|----------|
| `display` | Nunito Sans | 32px | 900 Black | 40px | App title, pet name, số đếm lớn |
| `header-lg` | Nunito Sans | 24px | 800 ExtraBold | 32px | Section header, ticket title, panel title |
| `ui-button` | Nunito Sans | 16px | 800 ExtraBold | 24px, ls 0.5px | CTA buttons, tab label, chip text |
| `body-md` | Nunito Sans | 14px | 600 SemiBold | 20px | Body copy, mission text, labels |
| `code-sm` | JetBrains Mono | 12px | 500 Medium | 16px | Terminal output, ticket ID, bug code, currency |

**Quy tắc:**
- Không dùng weight < 600 trong UI — không có thin text.
- Text trên dark panels (`inverse-surface`): `text-white`, `text-primary-fixed`, `text-surface-variant`.
- Text trên light bg: `text-on-surface` (#001a41).
- Headers + CTA labels: UPPERCASE với letter-spacing khi ở UI label context.
- Display headers có thể thêm 2px drop-shadow cùng màu tối hơn để tạo 3D depth.

---

## Layout & Spacing

Scale cơ sở 8px:

| Token | Value | Dùng cho |
|-------|-------|---------|
| `xs` | 4px | Gap nội tuyến (icon–text, chip inner padding) |
| `base` | 8px | Gap nhỏ giữa elements liên quan |
| `sm` | 12px | Padding chip, button compact, need bar card |
| `md` | 24px | Padding card, gap giữa sections |
| `lg` | 40px | Padding top cho màn hình flow (egg, sprint card) |
| `container-padding` | 20px | Margin trái/phải toàn màn hình |

**Grid:** Fluid, không có fixed column grid cứng. Các màn hình chính dùng:
- Mobile: single column, full-width cards
- Home Screen: 12-col bento (md breakpoint): [3 col need bars] [6 col Bugsy] [3 col stats]

**Safe areas:**
- Bottom nav: `pb-md pt-sm` (24px bottom padding) — luôn reserved
- Top App Bar: `py-base` (8px) — fixed, z-50
- Content area: `pt-24 pb-32` khi có cả top và bottom nav fixed

**Mobile reflow:** Cards chiếm 90–95% screen width. Không có horizontal scroll trong MVP.

---

## Elevation & Depth

QC Pet dùng **blocky flat shadow** thay vì Gaussian blur — tạo cảm giác đồ chơi/comic:

### Shadow types

| Tên | CSS | Dùng cho |
|-----|-----|---------|
| `tactile-card` | `border: 3px solid #001a41; box-shadow: 0px 6px 0px 0px rgba(0,26,65,1)` | Card, panel, need bar |
| `tactile-button` | `border: 3px solid #001a41; box-shadow: 0px 4px 0px 0px rgba(0,26,65,1)` | Button chính |
| `tactile-button:active` | `transform: translateY(4px); box-shadow: 0px 2px 0px 0px rgba(0,26,65,1)` | Button khi nhấn — "squish" |
| `floating-glow` | `box-shadow: 0 0 20px rgba(34,181,255,0.6); animation: pulse-glow` | Mission card (Home Screen) |
| Top App Bar | `shadow-[0px_6px_0px_0px_rgba(0,26,65,1)]` | Header |
| Bottom Nav | `shadow-[0px_-6px_0px_0px_rgba(0,26,65,1)]` | Nav bar |
| Story panel top | `shadow-[0px_-8px_20px_rgba(0,0,0,0.2)]` | Slide-up overlay |

### Elevation levels

- **L0 — Background/Environment**: Warm Peach, Sky Blue, golden-hour gradient — không có shadow.
- **L1 — Card/Panel**: `{colors.surface-container-lowest}` bg + `tactile-card` border + 6px blocky shadow.
- **L2 — Active Button**: `{colors.primary-container}` bg + `tactile-button` + 4px shadow → press: translateY(4px) + 2px.
- **L3 — Overlay/Modal**: `{colors.inverse-surface}` dark navy + rounded-t-[32px/40px] + `-8px` top shadow.
- **Backdrop**: `bg-on-background/60 backdrop-blur-sm` phủ app content khi L3 active.

---

## Shapes

**Không có góc vuông trong UI QC Pet.** Tất cả container đều bo tròn:

| Loại | Border radius | Ghi chú |
|------|---------------|---------|
| Pill button | `rounded-full` (9999px) | CTA, submit, chip |
| Card / Panel | `rounded-xl` → `rounded-2xl` (12–16px) | Tactile card |
| Slide-up panel top | `rounded-t-[32px]` / `rounded-t-[40px]` | Story, name, bug log |
| Avatar | `rounded-full` | Bugsy avatar trong feedback |
| Progress bar | `rounded-full` | Container + fill |
| Input field | `rounded-xl` | Text, textarea |
| Terminal input | `rounded-xl` | Dark bg context |
| Bottom nav | `rounded-t-xl` | Slight round top |
| Tag / Badge chip | `rounded-full` | Severity, category |
| Quả trứng | `rounded-[100%_100%_80%_80%]` | Egg Hatching screen |

**Icon containers:** Vuông bo tròn (`rounded-lg` → `rounded-xl`) với 3px border. Không dùng icon trần trong UI quan trọng.

---

## Components

### Top App Bar

```
Layout: fixed top-0, full-width, z-50, py-base (8px)
Bg: {colors.surface}
Border bottom: 4px solid {colors.on-surface}
Shadow: 0px 6px 0px 0px rgba(0,26,65,1)

Left: [Avatar 40×40px rounded-full border-2] + [Title "Bugsy QC" — display, primary]
Right: currency chips (rounded-full, surface-container-high bg, border-2)
  • Streak: "12 🔥" — teal-500
  • QP: "500 QC" — primary
  • BC: "25 BC" — secondary
```

### Bottom Navigation Bar

```
Layout: fixed bottom-0, full-width, z-50
Bg: {colors.surface-container}
Border top: 4px solid {colors.on-surface}
Shadow: 0px -6px 0px 0px rgba(0,26,65,1)
Rounded: rounded-t-xl
Padding: pb-md pt-sm

4 tabs: Mission [assignment] · Feed [restaurant] · Play [gamepad] · Train [menu_book]

Active tab:
  bg-primary-container text-on-primary-container
  rounded-lg border-2 border-on-surface
  shadow-[0px_4px_0px_0px_rgba(0,26,65,1)]

Inactive: text-on-surface-variant, hover bg-surface-container-high
```

### Tactile Card

```css
.tactile-card {
  background: #ffffff;
  border: 3px solid #001a41;
  box-shadow: 0px 6px 0px 0px rgba(0, 26, 65, 1);
  border-radius: 12px; /* rounded-xl */
  padding: 12px; /* p-sm */
}
/* Hover on interactive cards: scale(1.05), cursor-pointer */
```

### Tactile Button

```css
.tactile-button {
  border: 3px solid #001a41;
  box-shadow: 0px 4px 0px 0px rgba(0,26,65,1);
  transition: transform 0.1s, box-shadow 0.1s;
}
.tactile-button:active {
  transform: translateY(4px);
  box-shadow: 0px 0px 0px 0px #001a41;
}
```

**Primary CTA:** `bg-primary-container`, text white/on-primary-container, `rounded-full`, full-width trong modal.  
**Danger:** `bg-error-container` (FAIL, wrong, critical action).

### Speech Bubble (Bugsy dialogue)

```css
/* Container */
border: 4px solid #001a41;
border-radius: 32px;
background: white;
padding: 16px 24px;

/* Downward tail — CSS pseudo */
.bubble-tail::after {
  content: '';
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid #001a41;
  position: absolute; bottom: -12px; left: 40px;
}
.bubble-tail-inner::after {
  border-top: 10px solid #ffffff;
  bottom: -8px; left: 42px;
}
```

Text: `header-lg` (24px, 800) — to, dễ đọc.

### Pixel Terminal

```css
background: #001a41;          /* {colors.on-background} */
border: 2px solid #3e4851;
font-family: 'JetBrains Mono', monospace;
color: #8ce68c;               /* {colors.terminal-green} */
border-radius: 12px;
padding: 12px;
```

Header: 3 traffic-light circles (red/amber/green) + "Console Log" label. Cursor: `_` hoặc `|`, `blink 1s step-end infinite`.

### Bug Ticket Card

```
Wrapper: tactile-card, bg-on-background (dark)
Header: bg-tertiary-container — ticket ID (code-sm UPPERCASE) + severity badge
Body: bg-surface-container-lowest (white) — title (header-lg) + description (body-md) + console block
```

Severity badge: `bg-error text-white border-2` (CRITICAL) · `bg-secondary-container` (HIGH) · `bg-tertiary-container` (MEDIUM).

Ticket-rip effect (Daily Mission):
```css
.ticket-rip::before, .ticket-rip::after {
  width: 20px; height: 20px; background: #f9f9ff;
  border: 3px solid #001a41; border-radius: 50%;
  top: 50%; transform: translateY(-50%);
}
.ticket-rip::before { left: -12px; }
.ticket-rip::after { right: -12px; }
```

### Rule Landing Box

```
bg: {colors.rule-landing-bg} (#BFFFA1)
border: 3px solid {colors.on-surface}
box-shadow: 4px 4px 0px 0px rgba(0,26,65,1)
border-radius: 16px (rounded-2xl)

Label chip (absolute -top-4):
  bg-on-surface text-white px-sm py-xs rounded-lg font-code-sm
  push_pin icon (FILL 1) + "TEST RULE #N"

Body: font-ui-button text-on-background
```

### Need Bar

```
Container: bg-white tactile-card rounded-xl p-sm, hover:scale-105
Header: [emoji + label (bold)] [percentage — code-sm, on-surface-variant]
Track: h-4 rounded-full border-2 border-on-surface bg-surface-container overflow-hidden
Fill: shimmer-effect + color:
  Hunger 🍔   → lime-500
  Happiness 😊 → primary-container (#22b5ff)
  Health ❤️   → error (#ba1a1a)
  Discipline 🎯 → tertiary-container (#b59cff)
```

### Slide-up Overlay Panel

```
Backdrop: fixed inset-0 bg-on-background/60 backdrop-blur-sm (z-10)
Panel: fixed bottom-0 full-width, z-20/z-50

Story panel (Aha / Daily Mission):
  bg-inverse-surface rounded-t-[32px] border-x-4 border-t-4
  Handle: w-12 h-1.5 bg-on-surface-variant/30 mx-auto mb-md

Naming panel (Egg Hatching):
  bg-surface-container border-4 rounded-t-[3rem]
  shadow-[0px_-8px_0px_0px_rgba(0,26,65,1)]

Bug Log modal:
  bg-inverse-surface rounded-t-[40px] border-t-4
  slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)

Spring animation (Story):
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
  — overshoot = cảm giác squishy
```

### Terminal Input (Pet Naming)

```
Container: bg-on-background border-4 border-on-surface rounded-xl p-md
Label: code-sm primary-container text "PET_ID_GEN_01" + terminal icon
Input: display size text-[#00ff00] placeholder:primary/30 UPPERCASE focus:ring-0
Cursor indicator: edit_note icon, text-[#00ff00] animate-pulse
```

### Currency Chip (Header)

```
bg-surface-container-high rounded-full px-sm py-xs border-2 border-on-surface
Streak: text-teal-500 "12 🔥"
QP: text-primary "500 QC"
BC: text-secondary "25 BC"
```

### Progress Dots (Mission step)

```
Active: w-8 h-2 rounded-full bg-primary-container border border-on-background
Inactive: w-8 h-2 rounded-full bg-surface-variant border border-on-background
Gap: gap-xs between dots
```

### Mission Board (Work Room)

```
Layout: horizontal scroll, 3 columns — Todo | In Progress | Done
Column header: bg-surface-container-high, border-b-2, header-lg UPPERCASE
Card: tactile-card, w-40, truncated 2-line title, drag handle
Drag: card scale(1.05) + shadow elevated on drag-start
Drop zone: dashed border-2 border-primary-container when card hovering
Done column: cards stacked with slight rotation (paper-stack feel)
Bug Report Wall (below kanban): sticky-notes grid, random rotation ±5deg
  New note: fly-in scale(0) → scale(1) 300ms spring
  Full wall (30 notes): confetti + Bugsy excited
```

### Mirror Moment (Phòng Tắm)

```
Trigger: auto-play 0.5s sau Flash Quiz complete
Visual: 
  - Foreground: Bugsy standing, facing mirror (mirror = right edge of screen)
  - Mirror reflection: flipped Bugsy, separate asset
  Discipline ≥ 70%: outfit pressed, posture straight, sparkles on reflection
  Discipline 30–69%: normal outfit, neutral posture
  Discipline < 30%: hair ruffled, tired posture, no sparkles
Duration: 2.5s → self-dismiss (không cần tap)
No text overlay — visual only
```

### Apartment View Nav Bar

```
Trigger: tap 🏠 icon (position: top-right, 44×44px, bg-surface rounded-full tactile-button)
View:
  Canvas: isometric perspective, warm off-white bg
  Rooms: 6 chibi rooms arranged in L-shape layout (2 rows)
    Unlocked + healthy: normal brightness, soft glow on hover
    Unlocked + attention: pulsing warm light, tiny icon indicator
    Locked: desaturated, "?" chip on door, dim
  Bugsy: small (w-16) standing in current room, animate-bounce-subtle
Room tap → room-transition-animation (Bugsy walk 0.8s) → Immersive Mode
🏠 icon tap again (when in Apartment View) → return to last room
```

### Flash Quiz (Phòng Tắm)

```
Layout: stripped-down — no scenario card, no category badge
  Top: streak counter (small) + "x / 3 câu" indicator
  Middle: Question text only (header-lg, centered, generous padding)
  Bottom: 2–4 answer options (same tactile-button as Core Mission)
No hint button visible at any time
Answers: instant feedback (correct lime, wrong error-container)
No Story-Rule slide-up (tốc độ là mechanic, không phải depth)
After Q3 (last): Mirror Moment auto-triggers
Streak Tracker chip updates immediately after correct answer
```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Dùng blocky 3px border + 6px flat shadow cho mọi card | Dùng Gaussian drop-shadow mờ |
| Bo góc ≥ 12px (rounded-xl) trên mọi container | Dùng góc vuông sắc |
| Giữ nền sáng — Peach, Sky Blue, off-white | Dùng dark background làm nền app |
| Dùng `inverse-surface` CHỈ cho modal/overlay | Dùng `inverse-surface` làm app bg |
| Dùng Terminal Green `#8ce68c` CHỈ trong code/terminal context | Dùng lime xanh cho text thông thường |
| Text trắng trên dark panel (`inverse-surface`) | Text navy trên dark panel |
| Font weight ≥ 600 trong mọi UI text | Weight < 600 (thin text) |
| Dùng `qp-teal` và `bc-amber` nhất quán cho 2 currencies | Mix currency colors |
| Bugsy luôn có transparent background (`bugsy-transparent.png`) | Dùng Bugsy với white bg trên nền màu |
| Confetti 4 màu: `#22b5ff` `#fd9d89` `#b59cff` `#8ce68c` | Thêm màu khác vào confetti |

---

## Bugsy Character Spec

*(Nhân vật mascot — spec cố định từ DL-009, không thay đổi)*

**Tên:** Bugsy (mặc định) / đặt lại bởi user  
**Loài:** Baby chick — chim non mới nở  
**Asset:** `imports/bugsy-transparent.png` (1024×1024, RGBA, nền trong suốt)

| Thuộc tính | Mô tả |
|-----------|-------|
| Body | Tròn như quả cầu, soft warm yellow `#FFE082` |
| Head | Lớn hơn body, vài tufts lông tơ amber `#FFA726` |
| Beak | Tiny triangular, cam `#FF8F00` |
| Eyes | To, tròn, đen bóng, white sparkle highlights lớn |
| Headphones | Over-ear purple/indigo `#5C6BC0`, hơi to → càng cute |
| Cheeks | Blush peachy-orange `#FFAB91` |
| Pose | Ngồi tại bàn, cánh tỳ lên bàn, nhìn monitor |

**5 emotional states:**

| State | Trigger | Visual |
|-------|---------|--------|
| Happy | Bars > 70%, after mission | ^‿^ mắt cong, sparkles, cánh vỗ |
| Hungry | Hunger ≤ 30% | Mắt đẫm lệ, ôm bụng, mỏ hé |
| Tired | Health ≤ 30% | Mắt nửa nhắm, z z z, tư thế đổ |
| Sad | Happiness ≤ 30% | Nước mắt, tai nghe rũ, nhìn sàn |
| Excited | Level up / evolution | Nhảy, star sparkles trong mắt, cánh giơ cao |

**Size per screen:**

| Screen / Room | Size | Animation |
|---------------|------|-----------|
| Splash | w-32 h-32 | animate-bounce |
| Onboarding: Egg Hatching (post-hatch) | w-64 h-64 | bugsy-pop 2s |
| Onboarding: Aha Moment | w-48 h-48 | animate-bounce-soft 3s |
| 🏢 Work Room (idle) | w-64 h-64 | idle-cycle 30–60s random |
| 🍳 Phòng Bếp | w-56 h-56 | animate-float 3s, stir/eat idle |
| 🛏️ Phòng Ngủ | w-64 h-64 | breathe-sleep 4s ease-in-out |
| 🛋️ Phòng Khách (sofa) | w-72 h-72 | sofa-idle, delight-pop on tap |
| 🚿 Phòng Tắm | w-56 h-56 | stand-idle, mirror-look post-quiz |
| 🌿 Sân | w-80 h-80 | outdoor-run (Day 7), idle-stretch |
| Core Mission feedback (avatar) | w-32 h-32 | static |
| Sprint Demo Card | w-64 h-64 | hover:scale-110 |
| Apartment View (all rooms) | w-20 h-20 per room | room-specific mini-idle |

---

## Animation Library

### Bugsy motion

```css
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }

@keyframes bounce-custom {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.bugsy-pop, .animate-float { animation: bounce-custom 2–3s ease-in-out infinite; }
```

### UI effects

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.shimmer-effect::after {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(34,181,255,0.4); }
  50% { box-shadow: 0 0 30px rgba(34,181,255,0.8); }
}
.floating-glow { animation: pulse-glow 2s ease-in-out infinite; }

@keyframes blink { 50% { opacity: 0; } }
.terminal-blink { animation: blink 1s step-end infinite; }
```

### Egg hatching

```css
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}
.egg-shake { animation: shake 0.5s ease-in-out infinite; }
/* Speed increases: animationDuration = 0.5 / clickCount */

@keyframes pulse-glow-drop {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(34,181,255,0.6)); }
  50% { filter: drop-shadow(0 0 25px rgba(34,181,255,0.9)); }
}
.egg-glow { animation: pulse-glow-drop 2s infinite ease-in-out; }
```

### Confetti (Mission correct)

- 50 pieces, random left position
- Colors: `#22b5ff` `#fd9d89` `#b59cff` `#8ce68c`
- Fall: top → 100%, duration 1000–3000ms random, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Tap sparkle (Splash Screen)

```js
// Material icon "auto_awesome", màu tertiary
// Scale 0 → 1.5, rotate 0 → 45deg, opacity 1 → 0
// Duration 800ms ease-out, từ điểm chạm
```

---

## Screen Reference

*(Visual spec ngắn gọn — chi tiết behavior xem EXPERIENCE.md §Key Flows)*

| Surface | BG | Bugsy state | Key component |
|---------|----|----|---------------|
| Splash | golden-hour gradient | Happy, bounce | Office building CSS + tagline pill |
| Onboarding: Egg Hatching | `warm-peach-bg` | Excited (post-hatch) | Egg + naming panel |
| Onboarding: Aha Moment | `warm-peach-bg` | Hungry → Happy | Bug ticket + story slide-up |
| 🏢 Work Room | `warm-peach-bg` walls | Per Need Bars / idle | Mission Board kanban, Bug Report Wall, Weekly Bug Log |
| 🍳 Phòng Bếp | `kitchen-amber` | Hungry / Happy | Quick Feed, Bug Report form |
| 🛏️ Phòng Ngủ | `bedroom-soft` | Resting / Tired | Spaced Rep 1–2 câu, Daily Recap Bubble, tắt đèn |
| 🛋️ Phòng Khách | `living-warm` | Idle / Happy / Delight | TV, Side Quest card, Sprint Demo Card, sofa |
| 🚿 Phòng Tắm | `bathroom-mint` | Disciplined / Disheveled | Flash Quiz (2–3 câu no-hint), Mirror Moment, Streak Tracker |
| 🌿 Sân | `yard-sky` + `yard-grass` | Outdoors / Free | Item Shop placeholder, Day 7 cinematic (no text) |
| 🗺️ Apartment View | Isometric composite | All rooms visible | Room flash indicators, locked door "?" |

**Screen PNG references:** `imports/stitch-output/{screen_name}/screen.png`  
**Bugsy transparent asset:** `imports/bugsy-transparent.png`  
**Navigation:** 🏠 icon (top right) → Apartment View; swipe left/right = adjacent room; long press Bugsy = Bugsy suggest phòng cần nhất.

---

## Room Environment Specs

Mỗi phòng có visual identity riêng — màu tường, ánh sáng, vật trang trí — nhưng đều dùng chung hệ thống tactile border + blocky shadow và palette QC Pet.

### 🏢 Work Room (Phòng Làm Việc)

```
Wall bg: {colors.warm-peach-bg} (#FFE5D9) — coral/peach ấm
Floor: isometric wood grain, light honey
Lighting: warm desk lamp (amber glow #FFD54F), golden-hour window
Furniture: desk (white + navy border), monitor (terminal green glow), potted plant
Sticky notes: pastels — primary-container, tertiary-container, secondary-container
Mission Board: mounted on wall, whiteboard-white + border-2 {colors.on-surface}
Bug Report Wall: adjacent to board, notes accumulated per lesson
Ambient texture: keyboard, coffee mug (bc-amber), headphone cable
```

### 🍳 Phòng Bếp (Kitchen)

```
Wall bg: {colors.kitchen-amber} (#FFF8E7) — kem ấm áp
Floor: checkerboard tiles trắng/xanh nhạt (primary-fixed)
Lighting: warm pendant lamp, steam wisps from stove
Furniture: pastel kitchen counter (bc-amber accents), fridge (surface-container-lowest)
Bugsy action: stand at counter, stirring — tapping nấu ăn
Key visual: fridge door covered in sticky notes (Weekly Bug Log entries)
Empty fridge state: Hunger critical → fridge door ajar, empty inside
Full fridge state: Hunger OK → stacked colorful food items
Color accent: lime-500 for fresh food items, bc-amber for cooking warmth
```

### 🛏️ Phòng Ngủ (Bedroom)

```
Wall bg: {colors.bedroom-soft} (#ECEEFF) — lavender xanh nhạt
Floor: soft carpet, muted purple-grey
Lighting: dim bedside lamp ({colors.bc-amber} warm glow), star mobile overhead
Furniture: bed (pillows = tertiary-container, blanket = primary-fixed)
  Tắt đèn: room dims to 30% brightness, stars on ceiling glow
  Lights-off bg: #1a1a2e (near-black with faint star dots)
Daily Recap Bubble: thought bubble CSS shape, white, above sleeping Bugsy
Spaced Rep card: card appears on bedside table, glow-pulse to attract attention
Mood: cozy, quiet — no harsh colors, all pastels
```

### 🛋️ Phòng Khách (Living Room)

```
Wall bg: {colors.living-warm} (#FFF4E8) — kem cam ấm
Floor: area rug (tertiary-container pattern), light parquet
Lighting: floor lamp warm, afternoon window light (golden-hour gradient wash)
Furniture: sofa (secondary-container coral, rounded arms), TV (dark screen → active glow)
TV state on: screen bg primary-fixed with content, faint glow ring border-primary-container
TV state off: dark screen {colors.inverse-surface}, reflection of room
Sofa: Bugsy sits legs-dangling — Delight Tap target
Shelves: souvenir display (evolution mementos accumulate here)
Side Quest entry: card floats above coffee table
Sprint Demo Card: held by Bugsy, or displayed framed on wall when done
```

### 🚿 Phòng Tắm (Bathroom)

```
Wall bg: {colors.bathroom-mint} (#E6F5F2) — mint trắng sạch
Floor: white hex tiles with thin {colors.outline-variant} grout lines
Lighting: overhead bright white (task lighting) — brightest room in apartment
Furniture: sink (white, chrome taps), mirror (centered, tactile-border oval)
  Mirror: pure white bg, subtle sparkle rim when Bugsy disciplined
  Mirror frame: 3px {colors.on-surface} border, rounded oval
Streak Tracker: small counter chip, top-left corner, {colors.tertiary} text + fire icon
Flash Quiz overlay: semi-transparent white (#fff/90%) on room, quiz card centered
Mirror Moment: Bugsy + reflection side-by-side
Clean/sparse: không có decoration thừa — minimalism = discipline theme
```

### 🌿 Sân (Yard / Outdoor)

```
Sky bg: {colors.yard-sky} (#E8F4FF) — sky blue gradient
Ground: {colors.yard-grass} (#C5E8C7) — cartoon grass layer, rounded clumps
Lighting: full outdoor sun, bright + warm
Elements: tree (rounded canopy, lime-500), flower patch (secondary-container), bench
Bugsy idle: walking around, sniffing flowers, lying on grass
Day 7 cinematic: Bugsy runs from door → throws arms wide → lies on grass → looks up
  Sky animates: soft clouds drift left, subtle color shift dawn → morning
  Sound: birds + gentle breeze (sfx only, no music)
  No text, no UI chrome during cinematic — full screen
Item Shop placeholder: small cart/kiosk in corner, "Coming Soon" chip
Mood: peaceful, reward, freedom — contrast với indoor rooms
```

### 🗺️ Apartment View (Isometric)

```
Canvas bg: off-white {colors.surface} with faint grid lines
Perspective: isometric 45°, rooms arranged in L-shape 2×3 layout
Room tiles: miniature versions of each room, same color palette
  Unlocked + healthy: normal rendering
  Unlocked + attention needed: warm amber glow rim, pulsing 2s
  Locked: desaturated 40%, door has "?" chip ({colors.on-surface-variant} text)
Bugsy: w-16 in current room, visible to user
Room selection: tap → Bugsy walks animation (0.8s) + transition to Immersive Mode
One Room Emergency indicator: 🔥 chip on most-critical room
```

---

## Sound Design

| Sự kiện | Sound | Đặc điểm |
|---------|-------|----------|
| App mở | Welcome chime | 2-note ấm, 0.5s |
| Button tap | Pop | Soft satisfying "pop" |
| Bugsy happy | Chirp | 8-bit blip ngắn, ascending |
| Bugsy sad/hungry | Bloop | Descending soft, không harsh |
| Quiz đúng | Chime + sparkle | Ascending bright + coin sfx |
| Quiz sai | Bwaa | Forgiving, không punitive |
| XP/coin earn | Jingle + tick | Counter tick-up sfx |
| Ambient | Office hum + keyboard | Loop seamless, calming |
| Bar critical | Bloop nhẹ | Không urgent/harsh |
| Room transition (walk) | Soft footstep patter | 0.8s, 2–3 steps |
| Flash Quiz answer | Quick pop | Nhanh hơn Core Mission sfx |
| Mirror Moment reveal | Tinkle/sparkle | Khi Discipline cao; muted khi thấp |
| Lights out (Bedroom) | Soft click + crickets | Chuyển sang night ambient |
| Day 7 Yard cinematic | Birds + breeze | No music, nature sounds only |
| Evolution animation | Rising orchestral sting | 3–5s, once per evolution |
| Delight Tap (Sofa) | Startled chirp → giggle | 2 sfx sequential |

---

## Dark Mode

QC Pet **chưa hỗ trợ dark mode trong MVP.** Tailwind config có `darkMode: "class"` nhưng class `dark` không được apply. Dark mode cần redesign toàn bộ character art và illustration — Phase 2.

---

*Nguồn: `imports/stitch-output/` · `imports/bubbly_tech_companion/DESIGN.md` · `.working/stitch-prompt.md` · `imports/tamagotchi-reference.md` · `prds/prd-qc-pet-2026-06-14/prd.md`*  
*Workspace: `_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/`*  
*Updated: 2026-06-14 — v1.1 — 6-room apartment game world (PRD 2026-06-14 + game-flow.md integration)*
