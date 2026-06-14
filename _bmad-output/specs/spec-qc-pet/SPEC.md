---
id: SPEC-qc-pet
companions:
  - gameplay-systems.md
  - onboarding-flow.md
  - content-architecture.md
  - skill-transfer.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate.

# QC Pet — Gamified Testing Skills App

## Why

Junior Testers already on the job know how to do the work — but cannot tell whether they are improving. No mirror exists. The EdTech market sells flashlights (videos, PDFs, courses) that answer "what should I know?" but leave the practitioner inside a Competence Fog: doing the same job every day with no signal of growth. QC Pet breaks that fog by making a virtual pet the daily mirror of the user's testing skill — the pet reflects what the user practises, not just what they consume. The disruption is not a new learning format; it is the first tool that answers the question junior testers actually lose sleep over: **"Am I testing correctly?"**

Design philosophy: **the app is scaffolding; the goal is to remove it.** Every mechanic must drive observable behavior change in the user's real job. After 90 days a user who still needs the app to remember how to ask the right question means the app failed.

## Capabilities

- id: CAP-1
  intent: User can feed and evolve a virtual pet by completing daily testing-skill missions, so that the pet's state visibly reflects the user's learning progress.
  success: Pet version advances (v0.1 → v3.0) only when corresponding skill milestones are reached AND at least one real-world Transfer Gate task is submitted per version step.

- id: CAP-2
  intent: User can earn Bug Coins and Quality Points through daily missions, so that short-term engagement (BC) and long-term growth (QP) are rewarded by separate currencies with separate loss rules.
  success: Bug Coins decrease when a user misses a day; Quality Points never decrease. Both are visible on the home screen and behave according to their documented rules in 100% of tested scenarios.

- id: CAP-3
  intent: User can complete a structured Daily Mission Loop (Core Mission → optional Side Quest → Pet Care) so that five to ten minutes of daily practice covers one testable skill.
  success: A user completing only Core Missions every day for 30 days covers all five skill categories at least once, verified by content coverage report.

- id: CAP-4
  intent: User can activate a Sprint Hold to pause their streak for legitimate reasons, so that real-life interruptions do not force streak anxiety or app abandonment.
  success: Sprint Hold tokens are earnable (not purchasable), capped at 2/month, non-consecutive, and the hold log reason is recorded server-side on every use.

- id: CAP-5
  intent: User receives a structured Onboarding Flow on Day 1 that delivers an Aha Moment within the first two minutes, so that the app's value is felt before any sign-up wall.
  success: Day 1 completion rate (reaching the Cliffhanger screen) ≥ 60% in first-cohort testing; sign-up conversion from "Save Bugsy" prompt ≥ 40%.

- id: CAP-6
  intent: User can submit a Weekly Bug Log entry (real-world bug encountered at work) so that the app is connected to actual job performance, not just in-app quiz performance.
  success: Weekly Bug Log submission rate among active users (Day 14+) ≥ 50%, measured over the first 60 days post-launch.

- id: CAP-7
  intent: User receives spaced-repetition retrieval prompts on Day 2+ that reference prior session content, so that knowledge is retained beyond short-term memory.
  success: Correct-on-Retry Rate ≥ 60% when retry is measured ≥ 24 hours after first exposure; tracked per skill category.

- id: CAP-8
  intent: User can view a shareable Sprint Demo Card at the end of each 7-day sprint, summarising their progress in a visually distinct format, so that external sharing reinforces identity as a learning tester.
  success: Sprint Demo Card is generated automatically; ≥ 10% of active users share or export it within 48 hours of generation.

- id: CAP-9
  intent: User's pet persona and in-app voice use a consistent "mình/bạn" register with "Bugsy" self-reference for emphasis, so that tone is warm, professional, and avoids alienating formality or offensive informality.
  success: Zero "mày/tao" or equivalent register violations in any shipped string; voice review passes before each content release.

- id: CAP-10
  intent: The app persists all game state server-side before triggering any client-side animation or reward screen, so that killing the app at any point does not lose earned progress.
  success: All five documented kill-app corner cases (name entry, post-quiz pre-reward, cliffhanger, notification preference, pre-sign-up) produce the correct resume state with zero data loss in integration testing.

## Constraints

- Pet never dies; it only regresses. Loss of Quality Points is permanently out of scope. This is a hard brand constraint: the app must never trigger abandonment via punitive loss mechanics.
- Sprint Hold tokens cannot be purchased with Bug Coins or any in-app currency. Earning only. Prevents farming that breaks the learning loop. Free tier: 2 tokens/month. Paid tier: 10+ tokens/month.
- Content must carry a traceable source tag (ISTQB chapter, named domain, community consensus) before publishing. Untagged content is blocked from release.
- Server-side state commit must complete before any reward animation plays on the client. Enforced at the API contract level.
- Pet evolution version gates require at least one Transfer Gate submission (real-world task evidence) per version step — not quiz score alone.
- No leaderboard comparing users against each other. Competition is against the user's own prior week only (Personal Best). Avoids discouraging junior users.
- Monetisation model: Freemium. Core gameplay loop (pet, daily mission, sprint cycle, progress tracking) is always free. Premium gates content depth and breadth (advanced scenarios, industry-specific cases, interview-style challenges) — never the gameplay path itself. Gating is horizontal (wider experience), not vertical (blocked next step).
- MVP launch requires a minimum of 27 lessons across 5 categories (Bug Detective ×8, Test Architect ×5, Mindset & Process ×4, Tool Master ×6, Agile Tester ×4) AND at least one Weekly Challenge per category. Launching below this threshold is blocked.
- Real Bug of the Week content is authored internally by a practitioner QC. Community submissions are out of scope until post-launch.
- Hotfix Day is earned (not automatically granted). Unlock condition: completing a defined number of missions within the calendar month. Automatic monthly grants are out of scope.

## Non-goals

- This app is not a task or test-case management tool. It does not integrate with Jira, TestRail, or any live project system.
- Automated grading of free-text content (Weekly Bug Log, Transfer Gate submissions) is out of scope. The app rewards the act of submission, not assessed quality.
- Certificate or formal accreditation issuance is out of scope. The app does not position itself as an exam-prep tool.
- Diagnosing or fixing toxic workplace environments (e.g., teams that block juniors from real bugs) is out of scope. The app offers a Simulated Bug Hunt alternative path for affected users but does not counsel or escalate.
- Multiplayer or real-time collaboration features are out of scope.
- Content for senior testers (beyond v3.0 QA Lead level) is out of scope for the initial content set.
- Community-sourced Real Bug of the Week submissions are out of scope for v1.

## Success signal

Day 7 Retention ≥ 30% and Applied Knowledge Declaration Rate trending upward at session 14 and session 30 — together these indicate users are returning and self-reporting skill application at work, not just enjoying the pet. A secondary signal: at least one cohort user, unprompted, describes asking a boundary-condition or risk question in a real planning meeting that they attribute to the app.

## Assumptions

- The initial content set will be authored by the product owner (a practitioner QC/Tester) and peer-reviewed by at least one senior QA from a different domain before publishing.
- The platform target is mobile (iOS and Android). Responsive web is a later consideration.
- The database stores user identity, pet state, QP/BC balances, mission history, Sprint Hold log, Weekly Bug Log entries, Transfer Gate submissions, and Retrospective Loop entries.
- "Real-world task evidence" for Transfer Gates is a user-submitted text entry or photo — not verified by the app. Honour system, accountability via the act of logging.
- Content will be structured for database import; the schema design is deferred to the architecture phase.
- Hotfix Day unlock threshold (number of missions required) is a tuning decision deferred to the game-design phase; the constraint is that it must feel earned, not trivial.
