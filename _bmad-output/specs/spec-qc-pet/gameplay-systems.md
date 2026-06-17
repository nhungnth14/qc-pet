# Gameplay Systems — QC Pet

Companion to SPEC.md (CAP-1, CAP-2, CAP-3, CAP-4, CAP-8).

---

## Dual Currency

| Currency | Earn | Lose | Use |
|---|---|---|---|
| **Bug Coins (BC)** | Quiz completion, Bug Hunt, daily streak | Missing a day (amount TBD by tuning) | Buy pet items, unlock hints |
| **Quality Points (QP)** | All missions (with multipliers below), Sprint Report bonus | Never | Determine Tester Level, unlock pet evolution, unlock Secret Bug Cases |

---

## XP Multipliers

| Trigger | Multiplier |
|---|---|
| Correct answer, first attempt, no hint | ×2 QP |
| Answer speed < 15 s | +streak multiplier (stacks) |
| 7-day streak — day 7 only | ×3 QP for entire day |
| Bug Severity: Critical | 100 QP base |
| Bug Severity: Major | 50 QP base |
| Bug Severity: Minor | 20 QP base |
| Deep Dive optional question answered | ×1.5 QP |
| Sprint Report (7-day completion %) | Bonus QP proportional to % |

---

## Daily Mission — Three Tiers

### Tier 1 — Core Mission (required, ~5 min)
- 1 lesson from a skill category
- 3–5 quiz questions
- Story-Rule feedback on wrong or first-correct answers

### Tier 2 — Side Quests (optional, bonus BC/QP)
- **Bug Hunt**: identify errors in a screenshot or scenario
- **Peer Review**: evaluate a sample test case
- **Repro Steps**: rewrite a vague bug report to standard format

### Tier 3 — Pet Care (tied directly to pet state)
- **Feed**: submit a bug report (Core Mission completion counts)
- **Play**: complete a quiz with no hints used
- **Train**: complete an advanced/Deep Dive lesson

---

## Pet Evolution

Evolution gates on **version** (mirrors Tester career stages), not calendar time. Advancing requires meeting a QP threshold AND submitting a Transfer Gate task for that version step.

| Version | Name | Capability unlock |
|---|---|---|
| v0.1 | Baby Bug Hunter | Minor bug detection only |
| v0.5 | Junior Tester Pet | Bug report writing skills |
| v1.0 | Tester Pet | Confident bug severity judgement |
| v2.0 | Senior Tester Pet | Asks "But what if…?" — surfaces edge case prompts |
| v3.0 | QA Lead Pet | Reviews user's test cases; unlocks community features |

Pet does **not** die. Missed days cause regression toward a prior state; the pet always recovers when the user returns.

---

## Sprint Hold ("Blocked Status")

A strategic pause mechanic. Named for the real QC concept of a blocked ticket.

**Rules:**
- Maximum 2 tokens per calendar month
- Tokens do **not** roll over to the next month
- Consecutive-day use is blocked (cannot use two days in a row)
- Tokens cannot be purchased with Bug Coins

**Earning tokens:**
- 7-day unbroken streak completed → +1 token
- Milestone quiz passed ≥ 80% → +1 token
- Bug report upvoted by community → +1 token

**Using a token:**
User must select a reason from a dropdown before the hold is applied:
- 🏥 Health
- 🔥 OT / Release day
- 👪 Family commitment
- 📚 Other deadline

Reason is stored server-side. No verification. The act of logging creates accountability.

---

## Retention Hooks

| Hook | Cadence | Mechanism |
|---|---|---|
| **Cliffhanger Daily** | Every session end | Lesson closes on an open question; answer available next session only |
| **Pet Mood** | Every app open | Pet is doing something different each morning (debugging, drinking coffee, being asked by PM) |
| **Hotfix Day** | 1× per month (earned) | Free-pass day; pet completes the mission on the user's behalf. Unlocked by completing a defined mission threshold in the month. Must be used before month end. NOT automatically granted. |
| **Real Bug of the Week** | Weekly | One anonymised real-world bug case authored internally by a practitioner QC; user analyses root cause and classification |
| **Sprint Demo Card** | End of each 7-day sprint | Auto-generated shareable image summarising the sprint; optimised for LinkedIn / social sharing |

---

## Monetisation — Freemium Model

Core gameplay loop (pet, daily missions, sprint cycle, progress tracking, Sprint Demo Card) is always free.

Premium unlocks content depth and breadth only — never blocks the gameplay path.

| Feature | Free | Premium |
|---|---|---|
| Daily Core Mission | ✅ | ✅ |
| Pet evolution (all versions) | ✅ | ✅ |
| Sprint Hold tokens | 2 / month | 10+ / month |
| Bug library — foundational | ✅ | ✅ |
| Advanced scenarios & industry-specific cases | ❌ | ✅ |
| Interview-style challenge mode | ❌ | ✅ |
| Real Bug of the Week archive (past cases) | Last 4 weeks | Full archive |

Sprint Hold tokens remain **earnable by all users** regardless of tier. Premium increases the cap — it does not replace the earn mechanic.

---

## Weekly Challenge (Launch Blocker)

Each skill category must ship with at least one Weekly Challenge that integrates with the Weekly Bug Log. A Weekly Challenge is a scenario-based task that connects in-app learning to a real-work action (e.g., "This week, find a test case at work that is missing a precondition and submit it as your Bug Log entry").

Launching without a Weekly Challenge per category is a **hard launch blocker**.

---

## OQ-1 Resolution — Weekly Bug Log: Zero-Bug Response Tree

When a user submits no Weekly Bug Log entry or explicitly reports zero bugs found, Bugsy surfaces a gentle prompt (not a blocker):

> *"Tuần này bạn không log bug nào — chuyện gì xảy ra vậy?"*

User selects one of three paths:

| Selection | App response |
|---|---|
| "Tôi chưa được test thật" | Opens **Simulated Bug Hunt** (practice mode). Full XP and BC awarded. Pet is fed. |
| "Team không cho tôi access" | Bugsy offers a micro-tip: *"Hãy thử đề xuất review test case của người khác — đó cũng là bug-finding skill."* Then opens Simulated Bug Hunt. |
| "Sprint quá nhỏ, không có bug" | Accepted without penalty. Streak maintained via lesson completion. No further prompt this week. |

The app never diagnoses or escalates the workplace situation. It redirects toward what the user *can* control.

---

## Self-Efficacy Calibration

When a user answers correctly on the first attempt without hints:
- Bugsy acknowledges the speed: "Bugsy knew you'd catch that!"
- Bugsy reveals an additional layer: "But testers often also miss [related edge case] — want to see it?"

This prevents over-confident users from disengaging after easy content and keeps the loop challenging.
