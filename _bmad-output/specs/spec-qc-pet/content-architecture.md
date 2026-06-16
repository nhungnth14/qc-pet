# Content Architecture — QC Pet

Companion to SPEC.md (CAP-3, CAP-7). Covers the five skill categories, learning design rules, and content quality process.

---

## Five Skill Categories

Each category is an independent content collection importable to the database. Lessons within a category are sequenced from foundational to advanced.

### 1. Bug Detective
Focus: finding, describing, and classifying defects accurately.
Topics: writing a standards-compliant bug report; severity vs priority (definition and correct assignment); steps to reproduce with preconditions; evidence collection (screenshot, log, video); intermittent bug handling.
Day 1 anchor scenarios: **Scenario B** (Expected Result ≠ testable outcome) and **Scenario D** (Severity/Priority inverted).

### 2. Test Architect
Focus: designing tests that verify business outcomes, not just UI flows.
Topics: test case design principles; boundary value analysis; equivalence partitioning; decision tables; negative and edge-case coverage; asserting on business outcomes, not screen states.

### 3. Mindset & Process
Focus: the thinking model behind effective testing.
Topics: testing vs checking; risk-based testing; exploratory testing; shift-left testing; the Tester's questioning instinct ("But what if…?"); recognising absence of requirements as a test risk.

### 4. Tool Master
Focus: practical use of tools encountered in real junior-to-mid Tester roles.
Topics: test management in Jira; basic Postman for API response validation; Browser DevTools for network and console inspection; SQL SELECT queries for data verification.

### 5. Agile Tester
Focus: functioning effectively inside a Scrum team.
Topics: Tester's role in sprint ceremonies; Definition of Done from a QC perspective; collaborating with Dev and BA on acceptance criteria; raising risk blockers without creating friction.

---

## Learning Design Rules

These rules govern how every lesson and quiz is authored.

### Rule 1 — Story before Rule
Every concept is introduced via a short contextual narrative (a real or realistic scenario) before the rule is stated. This creates emotional anchoring. The narrative is followed by an explicit Rule Landing sentence — one sentence, copyable, search-engine indexable.

### Rule 2 — Prior Commitment before Aha
Before presenting a scenario with a known-wrong pattern, the user must make a small commitment (Pass/Fail on a shorter version, or a choice between two approaches). This activates recognition rather than passive reading.

### Rule 3 — Spaced Retrieval on Day 2+
Each session opens with one retrieval question referencing the prior session's Rule Landing. No score impact. The question is shown before any new content loads. This is not a quiz; it is a memory activation prompt.

### Rule 4 — Self-Efficacy Calibration
If a user answers correctly on the first attempt without hints, the system appends a second-layer question or observation that surfaces a related edge case. Prevents over-confident users from mentally opting out.

### Rule 5 — Bug Severity is always contextual
Every quiz question that involves severity or priority must include the user-impact context (e.g., "this affects 2% of users on older devices"). Severity without context trains incorrect instincts.

---

## Five Universal "Everybody-Gets-This-Wrong" Scenarios

Used primarily in onboarding but available as content anywhere.

| ID | Scenario | Correct behaviour |
|---|---|---|
| A | Steps to Reproduce missing precondition | Always include: account type, environment, prior state |
| B | Expected Result copied from requirement spec verbatim | Expected Result must describe an observable, testable system behaviour |
| C | Test case written as UI click-path with no assertion | Test cases must verify a business outcome, not just that clicks work |
| D | Severity = Critical, Priority = High, but only 2% of users affected | Priority must reflect user impact and business risk, not only technical severity |
| E | Bug raised without second reproduction attempt | Intermittent bugs must be logged as such with reproduction rate noted |

---

## Content Quality Process

Applies to every lesson before it is published.

### Step 1 — Traceable Source
Every factual claim in a lesson must be tagged with one of:
- ISTQB Foundation Level (chapter reference)
- Named industry domain (e.g., "common in e-commerce checkout flows")
- Community consensus (VSTA, QC Vietnam Facebook group, cited post)

No tag → content is blocked from publication.

### Step 2 — Cross-Domain Peer Review
Author writes content from their own domain experience. A reviewer from a **different** domain (web vs mobile vs API vs embedded) reads for hidden domain assumptions. Goal: flag claims that are true narrowly but presented as universal.

Recommended reviewer sources: VSTA members, QC Vietnam Facebook community (free).

### Step 3 — Junior Tester Usability Test
Two to three users matching the target profile (junior, already employed) attempt the lesson and answer the quiz without assistance. Observer notes where they slow down or misinterpret. Confusion = content gap, not user error.

### Step 4 — Versioning and Deprecation
Every lesson is tagged with the publication year. A review is scheduled every six months. Lessons older than 18 months without a review are flagged as "needs review" in the CMS. Lessons describing tooling (Tool Master category) are reviewed annually minimum.

---

## Tagline and Positioning Reference

**Primary tagline (locked):** "Pet bạn đói. Đi tìm bug đi."
Rationale: compresses the two core mechanics (pet companion + bug as resource) into six syllables; drives immediate action; no explanation needed.

**Backup / A-B test candidates:**
- "Nó không cần bạn giỏi ngay. Nó chỉ cần bạn quay lại mỗi ngày." — emotional, lowers entry barrier
- "Game duy nhất trả lời câu hỏi: tôi test như vậy có đúng chưa?" — addresses the core pain point directly
- "Tamagotchi biết test case. Bạn thì chưa chắc." — self-roast, high viral potential

**Retired:** "QC Pet: pet chết nếu bạn quên test hôm nay." — conflicts with the no-death / regress-only constraint.

**Disruption frame (Victor):** Competitors compete on "know more." QC Pet competes on "better than yesterday." No competitor currently occupies the axis of measurable daily improvement within real work context.
