# Google Stitch Prompt — QC Pet

> Copy toàn bộ nội dung bên dưới, paste vào Google Stitch (https://stitch.withgoogle.com).
> Sau khi Stitch sinh ra DESIGN.md + HTML screens, lưu vào thư mục `imports/` trong workspace này.
>
> **Sau khi export từ Stitch:**
> 1. Lấy `screen.png` của màn hình có Bugsy standalone (transparent bg) → chạy `rembg` để tách nền:
>    ```python
>    from rembg import remove
>    with open('input.png', 'rb') as f: output = remove(f.read())
>    with open('imports/bugsy-transparent.png', 'wb') as f: f.write(output)
>    ```
> 2. File `imports/bugsy-transparent.png` là asset canonical cho tất cả màn hình.

---

## PROMPT

**App Name:** QC Pet

**Platform:** Mobile (iOS + Android), portrait orientation

**Core Concept:**
A Tamagotchi-style virtual pet mobile app where a cute software bug character named "Bugsy" lives in a cozy tech office. The user keeps Bugsy fed, happy, and healthy by completing daily bite-sized QC/testing skill lessons. Bugsy reflects the user's learning progress — a thriving Bugsy means a thriving tester. The app targets junior testers (age 22–28) already working at software companies in Vietnam.

---

## Visual Style

**⚠️ CRITICAL STYLE RULE: 2D FLAT ILLUSTRATION ONLY.**
This app uses a **hand-drawn 2D flat illustration style** — like LINE Friends, Sanrio (Hello Kitty / Cinnamoroll), or Pokémon anime artwork. **DO NOT generate 3D renders. DO NOT use CGI. DO NOT use photorealistic shading.** Every element must look like it was drawn by a skilled 2D character illustrator.

**Aesthetic:** Cute, warm, hand-illustrated — like a children's storybook crossed with a Korean mobile game (LINE BROWN FARM, Tamagotchi Smart). BRIGHT and COLORFUL throughout. Cheerful and cozy, never dark or moody.

**Illustration rules (apply to ALL screens):**
- **Thick outlines (3px black)** on every character, furniture piece, and interactive element — like comic/cartoon drawing.
- **Cel-shading**: flat color fills with a single highlight blob (lighter shade, top-left position). NO gradient shading that looks 3D/rendered.
- **Hand-drawn quality**: slightly imperfect organic shapes, not perfectly geometric. Furniture legs are slightly tapered, windows have hand-drawn pane lines, plants have irregular leaf shapes.
- **Expressive proportions**: furniture is slightly oversized and rounded (chibi-room style), making the space feel cozy and toy-like.
- Rounded corners everywhere (16–24px on all cards, buttons, panels).
- Bubbly rounded speech bubbles with thick outline and a small triangular tail.
- Particle bursts (coins, sparkles, stars) on reward moments — drawn as cute 2D star/heart/bubble shapes.
- Retro pixel-art motifs for terminal/code areas only.

---

**Character — Bugsy (⚠️ MUST BE 2D FLAT ILLUSTRATION — NOT 3D RENDER):**

IMPORTANT: Bugsy is a BABY CHICK drawn in **2D flat chibi anime style** — like a Sanrio character or a LINE Friends character. NOT a bug/insect. NOT robotic. NOT scary. NOT a 3D rendered model.

**Art style mandate for Bugsy:**
- **2D flat illustration**: flat color fills + single cel-shade highlight. NO smooth 3D gradients. NO subsurface scattering. NO volumetric feathers.
- **Thick black outlines (3px)** around the entire body, wings, beak, headphones.
- **Clean, clear design** readable at small sizes (40×40px minimum).

**Design specifications:**
- Species: A tiny round baby chick — soft, warm yellow (#FFE082), the kind of character you want to protect and hug.
- Body: Very round and chubby circle — almost a perfect sphere. Flat yellow fill with a small off-white highlight circle at top-left. Tiny stubby wings on the sides (slightly darker amber #FFA726 wing tips).
- Head: Large round circle, slightly larger than body. 2–3 fluffy tuft lines on top in amber #FFA726. Beak: tiny cute equilateral triangle, orange #FF8F00.
- Eyes: HUGE round circles (almost 1/4 of face width). Solid black fill with a large white circle highlight (top-right). Eyebrows: two short curved lines that clearly show emotion. Cheek blush: two soft pink-orange ovals (#FFAB91), slightly transparent.
- Headphones: Over-ear style in purple/indigo (#5C6BC0). Simple 2D shape — two circles (ear cups) connected by a curved headband arc. Slightly too big for the head (cute). The headband rests on top of the head tufts.
- Feet: Two small rounded bird feet below the body, visible (either standing or dangling).
- Overall vibe: "Tiny Sanrio-style baby chick wearing oversized headphones." Warm, endearing, immediately recognizable at small sizes.

**⚠️ TRANSPARENT BACKGROUND REQUIRED:** Generate Bugsy on a FULLY TRANSPARENT background (PNG with alpha channel). No white background, no colored background, no shadow on background. The character floats with clean edges for compositing onto room scenes.

**Emotional states (2D expressions — must be clearly readable):**
- Happy: Eyes curve upward into crescents (^‿^), tiny star sparkles beside head, wings slightly raised.
- Hungry: Round teary eyes (glossy with shine line), tiny wings clutching tummy, beak drooped open.
- Tired: Half-moon drooped eyes, small "zzz" bubbles floating upward, headphones tilted 20deg.
- Sad: Large teary eyes with one teardrop line falling, headphones drooping downward at 45deg.
- Excited: Fully round eyes with star pupils ★, wings raised high, jumping with motion lines.

---

## Color Palette

**Overall tone: BRIGHT, WARM, VIBRANT — like Tamagotchi My Friends. Light pastel backgrounds, bold colorful UI. The "office" feel comes from the illustrations (desk, laptop, sticky notes), NOT from dark colors.**

| Role | Color | Hex |
|------|-------|-----|
| Background primary (office room) | Warm Peach / Coral | #FF9E8A |
| Background secondary (mission screens) | Sky Blue | #7AD7FF |
| Cards / panels | White with slight warm tint | #FFF8F6 |
| Primary UI (buttons, highlights) | Sky Blue Button | #22B5FF |
| Success / XP / Test-pass | Lime Green | #8EE500 |
| Bug Coins currency | Warm Amber | #F5A623 |
| Quality Points currency | Teal | #00C9B1 |
| Warning / Critical bars | Alert Red | #FF4B4B |
| Text primary | Deep Navy | #1A468A |
| Text on dark buttons | White | #FFFFFF |
| Accent / highlights | Soft Purple | #A78BFA |

---

## Typography

- **Display / App title:** 32pt, Bold, White, Rounded sans-serif (Nunito or Fredoka One style)
- **Pet name / Section headers:** 24pt, Bold, White with subtle glow, Rounded sans-serif
- **Stat labels / UI buttons:** 16pt, Bold, White or Lavender, Rounded sans-serif
- **Body / Lesson text / Feedback:** 14pt, Medium, White or Soft Lavender, Rounded sans-serif
- **Currency / Numbers:** 18pt, Bold, color-matched to currency (Amber for BC, Teal for QP)

---

## Key Screens (7 screens, MVP)

### Screen 1 — Splash / Establishing Shot
**Purpose:** Welcome the user into Bugsy's world. Must feel like opening a storybook.

**⚠️ STYLE: Pure 2D hand-drawn illustration. NO 3D renders. NO AI photo-realistic style.**

**Layout:**
- Full-screen exterior view of a small 2-story office building, drawn in **cute 2D storybook illustration style** (think: the buildings in Animal Crossing or Doraemon background art).
- Background sky: warm gradient from soft peach (#FFB4A5) at the horizon fading up to gentle sky blue (#C9E6FF). Two or three fluffy white cartoon clouds (simple rounded shapes with thick outline).
- Building: Illustrated in flat 2D — pastel coral-pink walls (#FF9E8A), white-framed windows with thick navy outline (3px), a little wooden sign above the door that says "QC Pet HQ" in rounded font. The door is rounded-rectangle, sky-blue (#22B5FF). Warm amber light glowing from the windows (yellow window glow shapes inside the panes). A small potted cactus beside the front door.
- Ground: Simple flat green grass strip at bottom, a few illustrated flowers (simple 4-petal cartoon flowers in pink and yellow).
- Bugsy: Small Bugsy illustration (w-24) on the rooftop, sitting on a chimney, waving one wing. Happy expression. This is the ONLY place Bugsy appears on this screen. Transparent background composited onto the scene.
- App logo "QC Pet" in large rounded bubble letters (#1A468A navy, white outline glow), centered over building.
- Tagline below logo: *"Pet bạn đói. Đi tìm bug đi."* — small, body-md, deep navy.
- Bottom: tiny pulsing dot with "Chạm để bắt đầu" text.

**Artistic feel:** Should look like the title screen of a cute indie mobile game — flat, illustrated, warm, inviting. NOT a photograph of a building, NOT a 3D-rendered scene.

---

### Screen 2 — Egg Hatching (Onboarding Day 1)
**Purpose:** First interaction — hatch Bugsy and name it.

**Layout:**
- Interior: Bugsy's office — BRIGHT and WARM. Coral/peach walls, colorful sticky notes, a cheerful potted plant, warm yellow lamp. The vibe is cozy and happy, like a colorful illustrated children's book office.
- Center: A glowing egg sitting on the desk, trembling gently. Bright sparkle aura pulses around it.
- No UI chrome. Just the egg and the cheerful office environment.
- User taps egg → crack animations → Bugsy pops out with a sparkle burst.

**After hatch:**
- Name input panel slides up from bottom.
- Three name chips: [Bugsy 🔍] [Null 🤖] [Mèo Prod 😈] + free text field.
- "Xác nhận" confirm button (Electric Blue, full-width rounded).
- Bugsy looks at the user expectantly with blinking eyes.

---

### Screen 3 — Aha Moment (First Lesson)
**Purpose:** Deliver the core value proposition — the bug-report analysis with Story-Rule feedback.

**Layout (two phases):**

**Phase A — Bug scenario:**
- Top: Bugsy (small, hungry expression) in corner with speech bubble: *"Mình hơi đói rồi đó bạn ơi. Bạn có thể giúp mình tìm bug đầu tiên không?"*
- Center: A styled "bug ticket card" — Jira-like but cute, with rounded corners and colored severity badge (red = Critical).
- Two large answer buttons at bottom: [✅ PASS — Xanh lá] [❌ FAIL — Đỏ]

**Phase B — Story-Rule feedback (slide up after answer):**
- Full-width panel slides up from bottom (dark indigo card, rounded top corners).
- Bugsy now shown happy/thoughtful, with a story speech bubble.
- Story text in white.
- Highlighted "Rule Landing" box: Lime green border, bold white text, 📌 icon.
- "Tiếp tục →" button at bottom.

---

### Screen 4 — Home Screen (Main Hub)
**Purpose:** Daily landing screen. Shows Bugsy's state and surfaces the next action.

**Layout:**
- **Top bar:** QP badge (teal, left) + BC badge (amber, right) + streak flame counter (center).
- **Main area (60% of screen):** Bugsy in full office environment — desk, monitor, lamp, accessories. Bugsy is animated (idle: typing slowly, drinking coffee, looking at camera).
- **Left side:** 4 vertical need bars — Hunger 🍔, Happiness 😊, Health ❤️, Discipline 🎯 — each with icon + fill color + percentage.
- **Bottom dock (persistent):** 4 rounded square buttons — [📋 Mission] [🍔 Feed] [🎮 Play] [📚 Train].

**State variants:**
- **Bars OK:** "Mission Hôm Nay" card glows with blue pulse above dock. Bugsy looks content, typing.
- **Bar critical (≤20%):** Critical bar pulses red. Quick-care buttons highlighted. Bugsy looks worried/sad. Gentle urgent sound.

---

### Screen 5 — Daily Mission (Core Mission Quiz)
**Purpose:** The main learning interaction — 3–5 quiz questions per session.

**Layout:**
- **Top:** Category badge (e.g., "Bug Detective 🔍"), progress dots (●●○○○), X to exit (top right).
- **Middle (scrollable):** Scenario card — either a screenshot of a bug report or short narrative text. Card styled like a ticket (navy background, rounded, code-font for bug details).
- **Bottom:** 2–4 answer options as large rounded buttons (Electric Blue outline, dark fill, white text). One correct option turns Lime Green after selection; wrong turns red briefly.

**Post-answer feedback:**
- Story panel slides up: Bugsy avatar (left) + narrative text (right).
- Rule Landing: Lime green highlighted box with bold rule text.
- "Câu tiếp theo →" or "Hoàn thành ✓" button.

**Completion:**
- Confetti + particle burst.
- Bugsy full-belly happy animation.
- QP and BC counters animate upward.
- "Cliffhanger" teaser card: *"Ngày mai Bugsy sẽ hỏi bạn điều này..."* with a "?" icon.

---

### Screen 6 — Weekly Bug Log Prompt
**Purpose:** Monday slide-up asking user to log a real bug from work.

**Layout:**
- Slide-up card from bottom (not full-screen modal). Background app content visible and dimmed behind.
- Card: Deep indigo, rounded top corners, shadow.
- Bugsy peeks up from bottom edge of card, curious expression.
- Speech bubble: *"Tuần trước bạn gặp bug gì thú vị ở công việc?"*
- Text input area: Rounded, soft lavender border, placeholder text.
- Three quick-select chips below input: [🚫 Chưa được test thật] [🔒 Team không cho access] [✅ Sprint quá nhỏ].
- Submit button: Lime Green, full-width, "Cho Bugsy ăn 🍔".
- Small dismiss link: "Bỏ qua tuần này" in tiny lavender text.

---

### Screen 7 — Sprint Demo Card (Shareable)
**Purpose:** End-of-sprint shareable progress card.

**Layout (portrait card, optimized for social share):**
- Background: Warm sky gradient (peach at top → sky blue at bottom) with cheerful pixel-art stars and clouds.
- Top: "QC Pet" logo small + date range (e.g., "Tuần 1 — 7–13/06/2026").
- Center: Large Bugsy illustration (current version/evolution).
- Stats block: QP earned this week (teal), Bug Coins earned (amber), streak days (flame), categories completed (colored badges for each skill: Bug Detective, Test Architect, etc.).
- Quote/tagline: User's top Rule Landing from the week in italic lavender.
- Bottom: "Pet bạn đói. Đi tìm bug đi." + QC Pet app icon.
- Share button: Electric Blue, rounded, "Chia sẻ 📤".

---

### Screen 8 — Apartment View (Isometric)

**Purpose:** Navigation hub — user sees all 6 rooms in one glance, taps to navigate.

**⚠️ STYLE: 2D isometric illustration — like the Animal Crossing: Pocket Camp map view, or Hay Day farm view. Flat illustrated rooms viewed from a 45° angle. NOT 3D render.**

**Layout:**
- Full-screen isometric 45° 2D illustration of a cute dollhouse-style apartment with all 6 rooms visible.
- Background: soft warm beige (#FFF8F0) with faint diagonal grid lines.
- **Top row (left to right):** 🏢 Work Room · 🍳 Kitchen · 🛏️ Bedroom
- **Bottom row (left to right):** 🛋️ Living Room · 🚿 Bathroom · 🌿 Yard
- Each room tile is a cute isometric room box (~120×90px each) with visible front wall cut away (doll-house style) so you can see inside:
  - Work Room: tiny desk + monitor visible, sticky notes on wall
  - Kitchen: mini counter + pot visible, checkerboard floor tiles
  - Bedroom: tiny bed with round headboard + bedside lamp visible
  - Living Room: mini sofa + tiny TV visible
  - Bathroom: mini sink + oval mirror visible
  - Yard: open space with mini tree + flowers visible (no walls — outdoor area)
- Bugsy (w-16, 2D flat) stands in the Work Room tile, wave animation.
- Unlocked + healthy rooms: bright colors, normal.
- Unlocked + needs attention: soft amber glow rim around room box + tiny bar icon (🍔/😊/❤️/🎯) on top.
- Locked rooms: entire room box desaturated to grey 40%, door shows "?" sticker.
- Top UI bar: persistent (QP chip · BC chip · streak chip).

**Room labels:** Below each room tile, small rounded label chip with emoji + room name.
**Interaction label:** "Chạm vào phòng để vào" — small italic hint at bottom center.

---

### Screen 9 — Phòng Bếp / Kitchen

**Purpose:** Feed Bugsy + submit Weekly Bug Report ("cooking" for Bugsy).

**⚠️ STYLE: 2D hand-drawn illustration room. All furniture must be drawn, not geometric shapes.**

**Room illustration (fill 60% of screen, top area):**
- Wall: warm cream (#FFF8E7) with illustrated wainscoting — white paneling on the lower third of the wall.
- Floor: hand-drawn checkerboard tiles (white + soft sky-blue #C9E6FF). Tiles have slightly imperfect edges (hand-drawn feel).
- **Ceiling-hung pendant lamp**: rounded drum shade in coral-orange, warm amber glow circle below it.
- **Kitchen counter (center-left)**: Rounded rectangular counter, white front + wooden butcher-block top (light honey color). On the counter: a round cute pot with a lid (bc-amber colored with steam wisps curling up), a small open recipe book propped up showing cute bug-shaped food illustrations.
- **Hanging pot rack** (above counter): A wooden dowel from ceiling with 3 small colorful pots hanging (coral, sky-blue, lime-green) — each with thick outline.
- **Fridge (right side)**: Tall rounded-corner fridge, off-white (#FFF8F6). Door is covered in: 3-4 bug-shaped ceramic magnets, a few sticky notes, a small QC Pet sticker. Hunger OK → fridge closed. Hunger critical → door slightly ajar, empty grey inside, wiggly "empty" smell lines floating up.
- **Windowsill (back wall)**: Three small herb pots (mint, basil, cilantro) in terracotta pots with tiny hand-written labels.
- **Bugsy (center)**: Standing at counter, stirring pot with wing, happy expression. Transparent background composited into scene.

**UI elements (bottom 40%):**
- Need Bar: Hunger bar (🍔) displayed prominently, current fill level.
- Two action buttons stacked: [🍔 Cho Bugsy ăn nhanh +25%] (primary, sky-blue, rounded-full) · [📝 Nộp Bug Report] (secondary, lime-green outline).
- Small label: "Bugsy chỉ ăn bug thôi 🐛" in body-md italic, above the buttons.

---

### Screen 10 — Phòng Ngủ / Bedroom

**Purpose:** Spaced repetition before sleep + Daily Recap Bubble.

**⚠️ STYLE: 2D hand-drawn cozy bedroom. Soft, warm, intimate — like a children's book bedroom illustration.**

**Room illustration (fill 65% of screen, top area):**
- Wall: soft lavender (#ECEEFF). Upper half: painted with hand-drawn constellations (dots + connecting lines in off-white) — like glow-in-dark star maps.
- Floor: warm honey-wood planks with subtle grain lines (drawn, not photo-texture).
- **Bed (center, large)**: Rounded rectangular headboard in dusty purple (#B39DDB). Fluffy pillow with polka dots (primary-fixed blue). Blanket: illustrated patchwork — squares of coral, sky-blue, mint, purple. Bed legs are short and stubby rounded wood.
- **Star mobile** hanging above bed: visible wire with 4–5 illustrated stars in different sizes (yellow, pink, blue) twirling from a tiny cloud shape.
- **Bookshelf (left wall)**: Small 3-shelf illustrated bookshelf. Books in bright colors: "Bug Patterns Vol.1" (red spine), "QC Handbook" (blue spine), a few notebooks. A small stuffed chick plushie sitting on the top shelf.
- **Bedside table (right of bed)**: Rounded nightstand, light wood. Desk lamp with round shade (warm amber glow circle on wall behind it). On the table: an open notebook with tiny drawn notes, a small glass of water.
- **Spaced Rep review card**: Floating above the nightstand with a soft pulse glow. Card is a small illustrated flashcard (sky-blue bg, question mark visible).
- **Bugsy**: Sitting on bed edge, feet dangling, slightly tired expression (half-moon eyes). Transparent background composited.

**Lights-out variant (Phase B):**
- Entire room at 20% brightness (everything darkens but stays visible).
- Ceiling constellations glow softly (brighter in dark).
- Bugsy curled into a round ball sleeping, "zzz" bubble floating.
- **Daily Recap thought bubble** (white cloud shape, thick navy outline) above Bugsy with 3 lines of text inside.

**UI elements (bottom 35%):**
- Health bar (❤️) displayed.
- [📖 Ôn bài trước khi ngủ] button + [🌙 Tắt đèn] button.

---

### Screen 11 — Phòng Khách / Living Room

**Purpose:** Side Quests, TV content, Sprint Demo Card share, Delight Tap on sofa.

**⚠️ STYLE: 2D hand-drawn cozy living room. Warm, inviting, like a Harvest Moon / Stardew Valley interior illustration.**

**Room illustration (fill 65% of screen):**
- Wall: warm off-white (#FFF4E8). Back wall has illustrated wallpaper with a subtle small diamond pattern in soft coral.
- Floor: light honey parquet planks (drawn grain lines). Area rug in center: oval shape with illustrated repeating floral border in tertiary-container purple.
- **Sofa (center-left, large and cozy)**: Deep rounded sofa shape, coral-pink (#fd9d89) fabric with small illustrated buttons. Rounded arms and back. Two throw pillows — one sky-blue with star pattern, one tertiary-container purple. Bugsy sits in center of sofa, legs not reaching floor, looking cozy. ← PRIMARY BUGSY POSITION.
- **TV (right side, wall-mounted)**: Large screen with very rounded corners (16px radius), thick navy outline frame. Screen OFF: shows dark reflection of the room. Screen ON: bright content frame — "Real Bug of the Week" thumbnail or "Weekly Challenge" card visible with colorful preview.
- **Shelf unit (left wall)**: 2-row illustrated bookshelf. Top shelf: 3–4 souvenir items (a tiny globe, a postcard, a snow globe). Bottom shelf: a small cactus pot, stacked books with colored spines, a photo frame showing a screenshot-style milestone.
- **Coffee table (in front of sofa)**: Round low table, light wood. On it: a mug of coffee with steam curling, a bug-themed notebook open. Side Quest card visible floating above the table (illustrated index card with "?" on it, glowing).
- **Floor lamp (far right)**: Tall lamp with round shade, warm amber light pool on the floor.

**UI elements (bottom 35%):**
- Happiness bar (😊) displayed.
- [📺 Mở TV] · [🎯 Side Quest] buttons side by side.
- When Sprint Demo Card is ready: [📤 Chia sẻ Sprint Card] full-width primary CTA appears above other buttons.

---

### Screen 12 — Phòng Tắm / Bathroom + Flash Quiz + Mirror Moment

**Purpose:** Daily Flash Quiz (no hint, rèn Discipline) + Mirror Moment visual feedback.

**⚠️ STYLE: 2D hand-drawn bathroom. Clean, bright, charming. Every object must be ILLUSTRATED — not geometric placeholder shapes.**

**Phase A — Normal Bathroom:**
- Wall: mint-white (#E6F5F2). Upper half: hand-drawn small hexagon tile pattern (white tiles with thin soft-grey grout lines drawn, not photo-texture).
- Floor: the same hex tile but slightly larger, viewed from above.
- Bright overhead lighting — round ceiling light fixture illustrated with a warm glow halo.
- **Vanity/Sink (center)**: Illustrated vanity cabinet (white, rounded corners, two drawers with small round knobs). Porcelain sink on top — white oval with chrome taps (illustrated, not 3D). Below the sink: two small cabinet doors with small shell-shaped handles.
- **On the vanity counter**: Illustrated accessories — a round soap dispenser with a rubber-duck label, a toothbrush holder (polka-dot ceramic cup) with two toothbrushes sticking out, a small succulents plant in a terracotta pot.
- **Mirror (back wall, prominent)**: An oval mirror with an **ornate illustrated wooden frame** — the frame has carved star/flower motif decorations at the top and sides. NOT a plain geometric oval. The frame is warm honey-wood color with thin navy outline.
- Mirror reflection: Bugsy reflected inside (smaller, same pose, mirrored).
- **Streak Tracker (top-left corner)**: Small illustrated chip — lightning bolt icon + "5 ngày ⚡" — in tertiary purple (#b59cff bg, navy text).
- **Bugsy (center, in front of sink)**: Standing idle, looking at mirror, slight happy expression.
- **Towel hook (right wall)**: Round hook with a striped towel (coral + white stripes) hanging neatly.
- Bottom CTA: [⚡ Bắt đầu Flash Quiz] — sky-blue, pill shape.

**Phase B — Flash Quiz Active (overlay):**
- Bathroom bg visible but dimmed (40% brightness).
- Semi-transparent white card (rounded-2xl, 3px navy border, tactile shadow) centered on screen.
- Card content: question text (header-lg, centered, navy). 2–4 answer option buttons.
- Top of card: "Câu 2 / 3" indicator.
- **No hint button** anywhere on screen.
- Correct: button flashes lime-green. Wrong: flashes error-container. Instant, no slide-up panel.

**Phase C — Mirror Moment:**
- Room fills screen. Only Bugsy + mirror visible. All other UI hidden.
- Bugsy stands in front of mirror, looking at reflection.
- Discipline ≥70%: Bugsy wearing a tiny pressed blazer illustration, good posture, sparkle stars (★) around the reflection.
- Discipline <30%: Bugsy with illustrated messy hair tufts, slouched posture, dull reflection (desaturated colors in mirror).
- No text, no UI, no tap targets. 2.5s then auto-fades.

---

### Screen 13 — Sân / Yard (Outdoor + Day 7 Cinematic)

**Purpose:** Free outdoor space, Day 7 cinematic unlock, Item Shop placeholder.

**⚠️ STYLE: 2D hand-drawn garden scene. Every element must be illustrated — like a Stardew Valley / Animal Crossing outdoor screen. NO generic circles/ovals as tree shapes. Draw actual illustrated trees with visible branch structure and individual leaf clumps.**

**Phase A — Day 7 Cinematic:**
- FULL SCREEN — no UI chrome whatsoever.
- Sky: soft morning sky, gradient from warm peach at horizon (#FFB4A5) to gentle sky-blue (#C9E6FF) up top.
- 2–3 illustrated clouds: each cloud is a cluster of 5–7 overlapping rounded shapes (like a proper cartoon cloud), NOT a single oval. Thick navy outline (2px).
- Ground: a bright green (#C5E8C7) grass layer with hand-drawn individual grass blade tufts at the top edge. NOT a plain rectangle.
- Bugsy: lying on the grass, on their back, looking up. Wings slightly spread. Happy, peaceful expression. 
- Scene detail: One illustrated butterfly (simple 2D shape with spots) floating nearby.

**Phase B — Normal Yard (main view):**

**Background illustration (fills 70% of screen):**
- Sky (top 35%): same morning sky as cinematic. One or two illustrated clouds.
- **Tree (right side, LARGE and ILLUSTRATED)**: NOT a circle on a stick. Draw an actual illustrated cartoon tree: visible curved trunk in warm brown, 3–4 distinct rounded leaf clump groups in lime-green (#8EE500) with darker green shadows, small illustrated fruits or flowers visible in the canopy.
- **Flower garden (left side)**: A small garden bed with:
  - 3 sunflowers: tall stems with hand-drawn petals (8 petals each), yellow with brown center, different heights.
  - 4–5 small colorful flowers mixed in: pink daisies, blue forget-me-nots, simple 5-petal cartoon shapes with visible yellow centers.
  - NOT just colored circles.
- **Stone pathway**: 5–6 irregular flat stone shapes (light grey, each slightly different shape with moss dots painted on) leading from a garden door to the center of yard.
- **Garden gate/fence**: Short white picket fence section (drawn with visible vertical pickets and horizontal rails) with an open gate, illustrated morning glory vines climbing up one side.
- **Bugsy (center, on path)**: Standing and looking around happily, or crouching to smell a flower.
- **Bench (left, near flowers)**: Illustrated wooden park bench — two plank seat boards visible, curved armrests, painted white with slight weathering.
- **Item Shop kiosk (back right corner)**: A cute illustrated market stall: wooden frame with a striped awning (coral + white stripes), a small counter. On the counter: "Coming Soon ✨" handwritten sign on a chalkboard. A closed padlock illustrated on the door.
- **Mailbox (near gate)**: Small illustrated post-box in red, with a little bug sticker on it.

**UI elements (bottom 30%):**
- No Need Bar (Yard is the free zone).
- [🌿 Nghỉ ngơi tại đây] button (soft, outline-only, no solid fill — emphasizes non-mandatory).
- Small note text: "Không gian tự do. Không cần làm gì cả."

---

## Navigation Flow (Updated — 6-Room World)

```
[Splash / Establishing Shot]
         │ (tap → zoom in)
         ▼
  [Egg Hatching + Naming]  ←── kill-app resume
         │
         ▼
 [Aha Moment / First Lesson]
         │
         ▼
  [Reward + Cliffhanger]
         │
         ▼
  [Notification Preference]
         │
         ▼
    [Sign-up Gate]
         │
         ▼
   [Phòng Làm Việc] ◄──────────────────────────────┐
         │                         ▲                │
         │  (🏠 icon)              │ swipe/tap room │
         ▼                         │                │
  [Apartment View] ────────────────┤                │
                                   │                │
   Phòng Bếp ◄─────────────────── ┤                │
   Phòng Ngủ ◄─────────────────── ┤                │
   Phòng Khách ◄───────────────── ┤ ───────────────┘
   Phòng Tắm ◄─────────────────── ┤
   Sân ◄────────────────────────── ┘ (unlocks Day 7)
```

---

## Sound Direction (descriptive)

- **Ambient:** Soft office hum + faint keyboard click loop (calming, loops seamlessly)
- **Bugsy happy:** Gentle 8-bit chirp/blip (Tamagotchi-inspired)
- **Bugsy worried/hungry:** Soft descending "bloop" — not harsh
- **Quiz correct (Core Mission):** Bright ascending chime + sparkle sfx
- **Quiz wrong:** Gentle "bwaa" — forgiving, not punitive
- **Flash Quiz correct:** Quick pop — faster, snappier than Core Mission
- **Reward (coins/XP):** Bright coin-collect jingle + tick-up counter sfx
- **App open:** Short warm 2-note welcome chime
- **Button tap:** Soft satisfying "pop" tap sfx
- **Room transition:** Soft footstep patter (2–3 steps, 0.8s)
- **Lights out (Bedroom):** Soft click + distant crickets
- **Day 7 cinematic:** Birds + breeze only — no music, no SFX tags
- **Mirror Moment:** Tinkle sparkle (Discipline high) / muted thud (Discipline low)

---

*Nguồn: QC Pet PRD (final, 2026-06-14) · game-flow.md · brief.md · tamagotchi-reference.md (imports/)*
*Workspace: _bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/*
*Updated: 2026-06-14 — v1.1 — Screens 8–13 added (6-room apartment game world)*
