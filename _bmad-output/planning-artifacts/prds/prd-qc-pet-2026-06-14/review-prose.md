---
title: "Prose Editorial Review — prd.md"
reviewer: claude-sonnet-4-6 (editorial-review-prose role)
date: 2026-06-14
scope: Writing quality only — not structure or completeness
verdict: MINOR ISSUES (not a blocking fail; fixable before downstream handoff)
---

# Prose Editorial Review: prd.md

## Verdict

**MINOR ISSUES** — The document is largely well-written and internally consistent. No major ambiguity or register violations were found in body copy. The issues below are fixable before handing off to UX/Architecture without requiring a full rewrite.

---

## Finding 1 — Glossary term inconsistency: "BC" used before definition anchor

**Severity: Low**

The Glossary (§3) defines the canonical term as **"Bug Coins (BC)"** and states no synonyms should be used. However, two patterns appear in the body:

- Most FR bullet points use "BC" alone (e.g., FR-7, FR-15, FR-17).
- The section headings use the full form: "Bug Coins (BC)" (FR-15 heading).
- §4.5 description uses "Bug Coins" without "(BC)" — acceptable, but inconsistent with FR body text that uses only "BC".

**Recommendation:** Decide on one pattern for body text: either always "BC" after the first use within a section, or always "Bug Coins (BC)" on first mention per major section (§4.x). The current mix is not wrong but could confuse a developer skimming individual sections without reading §3 first.

---

## Finding 2 — Register slip: §1 (Tầm nhìn) uses "tôi/bạn" voice

**Severity: Medium — this is the stated register rule**

NFR-4 mandates "mình/bạn" throughout the app. §3 Glossary and NFR-4 reinforce this. However, §1 Tầm nhìn (the product vision section) uses the "tôi" pronoun twice:

> *"QC Pet đặt ra câu trả lời cho câu hỏi mà junior tester mất ngủ: **'Tôi đang test có đúng không?'"***
> *"Thị trường EdTech hiện tại bán 'đèn pin' — trả lời 'tôi cần biết gì?'"*

These are framed as quotes of what the target user thinks internally. However, NFR-4 says "Zero violations in production" and doesn't carve out an exception for illustrative quotes. A developer reading NFR-4 literally will flag these as violations during voice review.

**Recommendation:** Either (a) change the internal monologue quotes to "mình" voice (`"Mình đang test có đúng không?"`) to stay consistent, or (b) add an explicit note in NFR-4 that user-perspective illustrative quotes in the vision section are exempt from the register rule.

---

## Finding 3 — FR-31 (Sprint Hold) is missing its FR body — only has "Testable consequences"

**Severity: Medium — untestable as written because no normative statement exists**

FR-31 has no descriptive requirement sentence above the testable consequences block. The section jumps straight to bullets. Developers and QA will have no normative anchor to test against — the bullet list defines behavior but doesn't state the *requirement* in active voice.

Compare to FR-7 which correctly reads: *"Pet Care actions (Feed, Play, Train) fill bars ngay lập tức nhưng không đầy đủ."* then lists consequences.

FR-31 has: `#### FR-31: Sprint Hold tokens và rules` then immediately `**Testable consequences:**`.

**Recommendation:** Add a 1–2 sentence normative requirement statement before the testable consequences block. Example: *"Sprint Hold token được earned, không thể mua, và tạm dừng streak hợp lệ trong 1 ngày. Tối đa 2 token/tháng (free tier)."*

---

## Finding 4 — Vague testable consequence in FR-19 and FR-21

**Severity: Low**

**FR-19:** `"Mỗi format render đúng trên iOS và Android với touch interaction."` — "render đúng" is not testable. A developer or QA cannot write a pass/fail test case for this. What does "render đúng" mean? Does it mean: layouts don't overflow? All interactive targets are ≥44px? Animations complete without frame drop?

**FR-21:** `"Card có thể screenshot và share."` — "có thể" (can) is ambiguous. Does this mean the OS share sheet opens? That the image is exportable as PNG? That a specific share target (Zalo, Facebook) is supported?

**Recommendation:**
- FR-19: Replace with something specific, e.g.: *"Mỗi format render không bị overflow và tất cả tap targets ≥44px trên iOS và Android."*
- FR-21: Specify the mechanism: *"Card export qua native OS share sheet dưới dạng ảnh PNG — không cần tài khoản thứ ba."*

---

## Finding 5 — Duplicate FR ID: "FR-17b" and "FR-32b" break the ID numbering contract

**Severity: Low but worth flagging**

The PRD uses stable FR IDs as a navigation contract for downstream workflows. Two IDs use a "b" suffix (FR-17b at §4.6 and FR-32b at §4.11). This suggests these were added after initial numbering. While not ambiguous in content, it breaks the clean increment pattern and could cause issues if downstream tools or tickets reference IDs numerically.

Additionally, FR-17 appears twice: once at §4.5 (Cả hai currency visible) and once at §4.6 as FR-17b (Real Bug of the Week). This creates a legitimate duplicate at the numeric level (17).

**Recommendation:** Renumber FR-17b → FR-17c or a new sequential ID (FR-40), and FR-32b → FR-41 or similar. The §3 Glossary note on stable IDs makes this worth fixing before Architecture handoff.

---

## Finding 6 — Excessive hedging in FR-10 Side Quest and FR-35

**Severity: Low**

**FR-10:** `"Ít nhất 1 Side Quest loại có sẵn mỗi ngày [ASSUMPTION: rotation logic xác định trong content ops]."` — the ASSUMPTION tag is correct, but the phrase "Side Quest loại có sẵn" is ambiguous. Does this mean: ≥1 *type* of Side Quest (Bug Hunt OR Peer Review OR Repro Steps) is available? Or ≥1 *instance* of any type? A developer will interpret these differently.

**FR-35:** `"User điền: gì đã áp dụng được, gì còn khó, bật tắt gì trong tuần tới."` — "bật tắt gì" is informal shorthand that could confuse. Is this a toggle UI? A free-text field? The phrasing is unclear in isolation.

**Recommendation:**
- FR-10: Clarify to: *"Ít nhất 1 Side Quest instance (thuộc bất kỳ type nào trong 3 loại) có sẵn mỗi ngày."*
- FR-35: Clarify to: *"User điền text tự do: (1) gì đã áp dụng được, (2) gì còn khó, (3) ý định thay đổi gì trong tuần tới."*

---

## Non-Findings (Checked, No Issue)

- **"mình/bạn" register in Bugsy voice lines:** All sampled notification copy, FR body sentences referencing Bugsy speech, and onboarding sequence copy correctly use "mình/bạn". No "mày/tao" found anywhere.
- **"Quality Points" vs "QP":** Used consistently — full form in headings/first mention, abbreviation in body. No "quality points" lowercase violation.
- **"Sprint Hold" vs "Hotfix Day":** §3 Glossary correctly flags the alias and names Sprint Hold as canonical. No stray "Hotfix Day" usage found in FR body text.
- **Passive vs active voice:** The document predominantly uses active constructions. Passive is used appropriately in server-side constraint language (e.g., "Server ghi nhận...") where the subject (server) is explicit.
- **"Pet Care" vs "Quick Care":** Two names exist — "Pet Care" in the Glossary (§3) and "Quick Care" used in FR-7 heading and FR-9 bullet. This is a minor synonym inconsistency but contained within §4.3; recommend standardizing to "Pet Care" throughout body text.

---

## Summary Table

| # | Finding | Severity | Action |
|---|---------|----------|--------|
| 1 | BC/Bug Coins inconsistent abbreviation pattern in body text | Low | Decide one pattern per §4.x section |
| 2 | §1 uses "tôi" in user-voice quotes — violates NFR-4 literally | Medium | Change quotes to "mình" or add exemption note in NFR-4 |
| 3 | FR-31 missing normative requirement body — jumps straight to testable bullets | Medium | Add 1–2 sentence FR statement before bullets |
| 4 | FR-19 "render đúng" and FR-21 "có thể screenshot" are not testable | Low | Replace with specific, pass/fail-able language |
| 5 | FR-17b and FR-32b create ID collision/non-sequential naming | Low | Renumber before Architecture handoff |
| 6 | FR-10 "Side Quest loại" ambiguous; FR-35 "bật tắt" unclear | Low | Clarify with specific mechanism language |
| — | "Pet Care" vs "Quick Care" synonym slip (non-Glossary term) | Low | Standardize to "Pet Care" |
