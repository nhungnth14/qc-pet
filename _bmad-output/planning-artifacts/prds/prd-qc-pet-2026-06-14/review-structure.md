---
review_type: structural-editorial
target: prd.md
reviewer: bmad-editorial-review-structure
date: 2026-06-14
verdict: FAIL — multiple structural defects requiring resolution before downstream handoff
---

# Structural Review: prd.md

## Verdict: FAIL

Three categories of defects found: FR numbering breaks, a broken internal cross-reference, and undefined glossary terms used throughout the document. These must be resolved before UX Design or Architecture workflows consume this PRD.

---

## Finding 1 — FR Numbering Breaks (3 instances, CRITICAL)

Three FRs were inserted mid-document using lettered suffixes, breaking the numeric sequence. Downstream tools (story creation, test traceability) will generate inconsistent FR IDs.

| Rogue FR | Location | Problem |
|---|---|---|
| **FR-5b** | §4.1 (line ~162) | Appears between FR-4 and FR-5. FR-5 is in §4.2. FR-5b is an unrelated feature (Good Morning Moment) grafted into a different section. |
| **FR-17b** | §4.6 (line ~385) | Appears between FR-17 and FR-18. FR-17 is in §4.5 (currency visibility), FR-17b is content (Real Bug of the Week) — wrong section. |
| **FR-32b** | §4.11 (line ~662) | Appears between FR-32 (§4.10, Notifications) and FR-33 (§4.11, Spaced Repetition). FR-32 and FR-32b are in different sections, creating split numbering across section boundary. |

**Required fix:** Renumber all three to sequential IDs (FR-40, FR-41, FR-42 or similar). Update all references. If FR-5b belongs in §4.1, confirm it is intentional and renumber accordingly; its current placement after FR-4 but numbered "5b" implies it was appended after document freeze.

---

## Finding 2 — Broken Cross-Reference in FR-9 (CRITICAL)

FR-9 (Core Mission, §4.3) contains this testable consequence:

> "Story-Rule Feedback xuất hiện sau mỗi câu sai trong quiz (FR-33 phần feedback)."

**FR-33 is Spaced Repetition** (§4.11). Story-Rule Feedback is **FR-25** (§4.6). This is a wrong cross-reference — it will cause traceability failures when stories are generated from FR-9 and FR-33 simultaneously.

**Required fix:** Change `(FR-33 phần feedback)` → `(FR-25)` in FR-9's testable consequences.

---

## Finding 3 — Undefined Glossary Terms (§3 gaps, SIGNIFICANT)

The following terms appear repeatedly in FRs and UJs but are absent from §3 Glossary. Downstream UX and Architecture specs will have no canonical definition to anchor to.

| Term | Appears in | Severity |
|---|---|---|
| **XP** | FR-23 ("-5 XP"), FR-25 ("≥30% XP") | HIGH — appears to be a third currency or score, contradicts the Dual Currency system defined in §4.5. Relation to BC/QP is undefined. |
| **Flash Quiz** | FR-12 table, FR-13 table, GAP-01, GAP-02 design notes | HIGH — core mechanic of Phòng Tắm with its own streak tracker (GAP-02), not defined anywhere. |
| **Mission Board** | FR-9, FR-11 | MEDIUM — appears as a named UI component without canonical definition. |
| **My Journey** | FR-27, FR-34, FR-35 | MEDIUM — referenced as a persistent view but not defined in §3. |
| **Weekly Challenge** | FR-18, §6.1 | MEDIUM — referenced as a content type distinct from lessons, no definition. |
| **Boss format** | FR-22 | LOW — single appearance in difficulty progression, unclear what format type this maps to in the 10-format list (FR-19). |

**Most critical:** "XP" — if this is a display label for QP earned per question, it must be stated explicitly in §3 and FR-23/FR-25 must be updated to use the canonical term. If XP is a separate mechanic, it needs a full FR. As written it appears to be a phantom currency.

---

## Finding 4 — NFR Numbering Out of Order (MINOR)

In the Cross-cutting NFRs section, the presentation order is: NFR-7 → NFR-1 → NFR-2 → NFR-3 → NFR-4 → NFR-5 → NFR-6. NFR-7 (Offline Behavior) appears before NFR-1 (Server-side State Commit), which is likely a late addition. This does not break references but creates reader confusion and makes it harder to verify NFR completeness.

**Required fix:** Reorder to NFR-1 through NFR-7 sequentially, or add an editorial note explaining why NFR-7 leads the section (e.g., it is the most important for readers to encounter first).

---

## Finding 5 — CAP Tags Referenced Without Definition (MINOR)

Three FRs reference CAP tags from an external document (SPEC.md) without defining them in the PRD:

- §4.9 description: "Realizes CAP-4"
- FR-33: "Realizes CAP-7"
- FR-34: "Realizes CAP-6"

SPEC.md is listed as a source in the frontmatter, but CAP constraints are not reproduced or summarized in the PRD. Downstream workflows consuming only the PRD cannot resolve these references.

**Required fix:** Either add a §3 entry for each CAP tag used (one-line description + SPEC.md pointer), or add a note in §0 stating that CAP-N references require SPEC.md to resolve.

---

## Summary of Required Actions

| Priority | Action |
|---|---|
| CRITICAL | Renumber FR-5b, FR-17b, FR-32b to sequential IDs; update all references |
| CRITICAL | Fix FR-9 cross-reference: FR-33 → FR-25 |
| HIGH | Add "XP" to §3 Glossary; clarify relationship to BC/QP or remove term |
| HIGH | Add "Flash Quiz" to §3 Glossary |
| MEDIUM | Add "Mission Board", "My Journey", "Weekly Challenge" to §3 Glossary |
| MINOR | Reorder NFR section to NFR-1 through NFR-7 |
| MINOR | Add CAP tag definitions or resolution note |
