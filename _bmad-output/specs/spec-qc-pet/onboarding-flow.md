# Onboarding Flow — QC Pet

Companion to SPEC.md (CAP-5, CAP-9, CAP-10).

---

## Voice & Wording Contract

- Pet self-refers as **"mình"**; addresses user as **"bạn"**
- Pet uses its given name (**"Bugsy"** by default, or the name the user assigns) when emphasising personality
- **Never** use "mày / tao" or equivalent registers in any shipped string
- Tone target: warm, witty, lightly self-aware — the voice of a Tester who has seen things

---

## Day 1 Flow (target: 5–7 minutes, reducible to 2 minutes for late-night edge case)

### Step 1 — First Screen
Dark screen. Faint keyboard sound. An egg appears, trembling.
Text fades in: *"Có gì đó đang chờ bên trong..."*
User taps egg → egg cracks → Bugsy emerges, yawns, looks at camera.
No sign-up form. No permission dialog. No skip button.

### Step 2 — Pet Introduction (~30 s)
Bugsy: *"Xin chào — mình là Bugsy, một con bug vừa thoát khỏi production!"*
Three name suggestions shown (Bugsy 🔍 / Null 🤖 / Mèo Prod 😈) + free-text field.
User picks or types. Pet jumps. Ownership is established.

### Step 3 — Micro-bridge (cognitive mode shift)
Bugsy: *"Mình hơi... đói rồi đó bạn ơi. Mà mình chỉ ăn được bug thôi. Bạn có thể giúp mình tìm bug đầu tiên không?"*
This line shifts the user from emotional (cute pet) to analytical (task) mode before the bug report appears.

### Step 4 — Warm-up Calibration (~30 s)
A very short bug report (2 lines) is shown. User answers Pass / Fail.
Purpose: creates prior commitment so the Aha Moment in Step 5 lands with recognition, not just information.

### Step 5 — Aha Moment
Full bug report shown (Scenario B + D combined):
- **Scenario B**: Expected Result copied verbatim from the requirement spec, not a testable observable outcome
- **Scenario D**: Severity marked Critical but Priority set Low (low user impact)

User analyses and answers. **No immediate Correct/Wrong verdict.**

### Step 6 — Story-Rule Feedback
Bugsy tells the contextual story: *"Tester đó đang vội. Sprint deadline ngày mai. Họ copy-paste expected result từ ticket mà không đọc lại. Bug lên prod. Khách hàng gọi lúc 11 giờ đêm."*
Then the Rule Landing: *"Mình học được rồi — Expected Result phải mô tả hành vi hệ thống, không phải mong muốn của tester."*
Story creates the emotional hook. Rule landing creates the cognitive hook. Both are required.

### Step 7 — Reward
Bug Coins and QP animate upward. Bugsy full-belly animation plays.
**Server has already committed the quiz result before this animation starts.**

### Step 8 — Cliffhanger
Bugsy: *"Bạn nghĩ mình có qua được không...?"*
Preview of tomorrow's Pet Mood shown as a silhouette with "?".

### Step 9 — Notification Preference
Single question: *"Mình thường online lúc mấy giờ?"* → Morning / Evening / Irregular
**Notification permission is requested only after this selection**, after the user has already felt the pet needs them — not before.

### Step 10 — Sign-up Gate (end of Day 1)
Narrative prompt: *"Bạn muốn lưu [pet name] lại không? Nếu không, ngày mai nó sẽ quên bạn."*
CTA: **"Lưu [pet name] lại"** (primary) / *"Xem [pet name] có gì hôm nay"* (guest continue, small text)
No account is required to experience Day 1. Sign-up is motivated by attachment, not by a wall.

---

## Progressive Disclosure — No Tutorial Slides

Mechanics are revealed at the moment of first use only:

| Mechanic | Reveal trigger |
|---|---|
| Bug Coins | First time BC balance increases after a quiz |
| Quality Points | First QP gain; brief tooltip |
| Pet Evolution | When pet is near a version threshold: *"Mình sắp thay lông..."* |
| Sprint Hold | First time user taps "Tôi bận hôm nay" |
| Sprint Demo Card | Auto-presented at end of first 7-day sprint |

---

## Late-Night Edge Case (< 2 minutes available)

If user opens app for the first time after 22:00 or explicitly indicates limited time:
Bugsy appears drowsy, mirroring the user.
Truncated flow: name the pet (30 s) + one True/False question only.
Bugsy: *"Được rồi. Ngủ đi. Ngày mai mình cần bạn tỉnh táo hơn."*
No pressure. No "Day 1 incomplete" warning. User leaves feeling they did something, not that they failed.

---

## Kill-App Corner Cases

All five cases must be covered in integration testing (see CAP-10).

| Kill point | Resume behaviour |
|---|---|
| During name entry | Return to name-entry screen; input blank; Bugsy: *"Bạn quay lại rồi! Bạn muốn đặt tên gì cho mình?"* |
| After quiz submit, before reward animation | Server already committed result; app detects "quiz complete, reward not shown"; triggers full reward screen on re-open |
| During cliffhanger screen | Return to home; small notification dot; Bugsy references the cliffhanger on next open |
| Before notification preference selection | Slide-up card on next open (not a blocking popup); repeats max 3 times over 3 days |
| Before sign-up (guest state) | "Bugsy is waiting" screen with draining progress bar (wistful + hopeful tone, not threatening); CTA "Lưu Bugsy lại" primary, "Xem Bugsy có gì hôm nay" secondary |

---

## Five UX Principles (apply to all screens, not just onboarding)

1. **Resume, not restart** — always return the user to the exact interrupted state
2. **Commit before animate** — server-side state save must complete before client animation fires
3. **Gentle reminder, not blocker** — missing preferences use slide-up cards, never modal blockers
4. **Narrative consequence, not dark pattern** — Bugsy tells a story about what happens; the app never threatens
5. **Consistent voice** — mình/bạn throughout; pet name for emotional emphasis only
