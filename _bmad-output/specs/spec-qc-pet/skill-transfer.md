# Skill Transfer — QC Pet

Companion to SPEC.md (CAP-1, CAP-6). Covers the mechanisms that drive observable behaviour change in the user's real job — the test of whether QC Pet is scaffolding or a cage.

---

## Design Philosophy

> "The app is scaffolding. The goal is to remove it."

Transfer is not a feature. It is the success criterion. If after 90 days a user still needs to open the app to remember how to ask the right question in a planning meeting, the product has failed. Every mechanic must have an expiry date: the mechanic becomes unnecessary when the behaviour it was training has been internalised.

---

## Observable Behaviour Change Targets (30-day horizon)

These are the behaviours that a user's team lead or PM can observe without being told. If these are not happening, retention metrics are misleading.

| Behaviour | Before QC Pet | After 30 days |
|---|---|---|
| Writing test cases | Happy-path UI clicks, no assertions | Includes boundary values; asserts on business outcomes |
| Filing bug reports | Symptom description; severity = Priority | Includes preconditions; correct severity/priority split; reproduction rate noted for intermittent bugs |
| In planning meetings | Estimates effort after requirements are read | Asks "What's the boundary condition of 'done'?" and "What's the riskiest part to test?" before estimating |
| Discussing defects with Dev | Describes what the screen showed | Describes business impact and user population affected |

---

## Transfer Mechanisms

### 1. Transfer Gate
**What it is:** A version-advance gate. The pet cannot evolve to the next version until the user submits evidence of applying the skill in real work.

**How it works:**
- When a user reaches a QP threshold for a version step, the pet enters a "pending evolution" state.
- A prompt appears: *"Mình sắp thay lông — nhưng mình cần bạn thử kỹ thuật này ở công việc thật trước."*
- User submits a text entry or photo (e.g., a screenshot of a test case they wrote using the new technique).
- The app does not grade the submission. The act of submitting unlocks the evolution.
- Submission is stored in the database.

**Why this matters:** Without this gate, users can reach QA Lead Pet via quiz performance alone, which measures in-app recognition, not real-world recall. The Transfer Gate makes skill transfer a literal requirement for pet progression.

### 2. Weekly Bug Log
**What it is:** A Monday prompt asking the user to log one bug or testing observation from their real job during the previous week.

**How it works:**
- Every Monday, a slide-up prompt appears: *"Tuần trước bạn gặp bug gì thú vị ở công việc?"*
- User types 1–2 sentences. No format required. No grading.
- Pet "eats" the entry: Bug Coins awarded, small animation.
- Entry stored in database.

**Metric:** Weekly Bug Log submission rate among Day 14+ active users ≥ 50%.

**Edge case:** If a user submits "no bugs this week" or leaves it blank, the system accepts it without penalty and logs the submission. Whether zero-bug weeks indicate skill gap or environment gap is an open question (OQ-1).

### 3. Retrospective Loop
**What it is:** A weekly in-app reflection prompt connecting app sessions to real work.

**How it works:**
- Once per week, Bugsy asks: *"Tuần này bạn có gặp situation nào mà bạn nhớ đến QC Pet không? Bạn đã làm gì?"*
- User answers in free text or skips.
- No score. Not required. But answered entries are stored and shown back to the user in a "My Journey" view over time.

**Why this matters:** After 4–8 weeks, a user reading their own Retrospective Loop answers sees a narrative of their own growth. This is the "mirror" the product promises — not pet level, not QP total, but the user's own words describing how they tested better.

---

## Success Metrics — Full Set

| Metric | Target | Notes |
|---|---|---|
| Day 7 Retention | ≥ 30% | Benchmark for mobile learning apps |
| Correct on Retry Rate | ≥ 60% | Retry must be ≥ 24 h after first exposure; measures retention, not short-term memory |
| Shared a Bug / Sprint Demo Card | ≥ 10% of DAU | Externalization metric: user is articulating knowledge outside their own head |
| Applied Knowledge Declaration Rate | Trending upward at session 14 and 30 | Self-reported; measured via in-app prompt. Not a vanity metric — trend matters more than absolute value |
| Weekly Bug Log submission rate | ≥ 50% among Day 14+ active users | Proxy for app-to-job connection |
| Vocabulary shift | Qualitative review | In-app free-text entries (Bug Log, Retro Loop) reviewed monthly for correct QC terminology use |

---

## The Scaffold Removal Test

At the 90-day mark, the product team should be able to answer yes to at least one of:

- Has a user, unprompted, described asking a boundary-condition or risk question in a real planning meeting?
- Does the Retrospective Loop data show an increasing number of "I applied this at work" entries per user over time?
- Does the Applied Knowledge Declaration Rate at session 30 exceed that at session 7?

If none of these are true, the mechanics are producing engagement without transfer. That is the cage, not the wings.

---

## Open Question on Environment

**OQ-1 (from John):** Some junior testers work in environments where they are not permitted or encouraged to raise real bugs — team culture, seniority gatekeeping, or project phase. For these users, the Weekly Bug Log and Transfer Gate will feel impossible, not just difficult.

The question is whether QC Pet should:
(a) Acknowledge the environment problem explicitly and offer a "simulated" alternative submission for users who flag this
(b) Stay silent and let the metric gap surface the issue
(c) Treat it as a coaching moment: Bugsy surfacing the question "Is your team using your bug-finding skills?"

This is deferred to post-launch learning. The default for v1 is (b).
