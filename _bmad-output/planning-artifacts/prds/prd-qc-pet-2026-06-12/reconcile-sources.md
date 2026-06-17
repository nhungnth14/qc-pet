# Reconciliation — Sources vs PRD
Run: 2026-06-12 | Checked against: prd.md (draft)

---

## brief.md

| Nội dung nguồn | Trạng thái trong PRD | Ghi chú |
|---|---|---|
| Tagline "Pet bạn đói. Đi tìm bug đi." | ✅ §2 | |
| 4 need bars + Tamagotchi mechanic | ✅ F1 | |
| Single entry point, no mode select | ✅ FR-2.1 | |
| Idle animation examples (coffee, debugging, etc.) | ⚪ Không capture | UX/art direction detail — phù hợp cho phase UX design, không phải PRD |
| Narrative arc + travel destinations bảng | ✅ FR-1.10 | |
| Customization shop items chi tiết | ✅ §10 Phase 2 | Đúng chỗ |
| Dual currency BC/QP | ✅ F4 | |
| Daily Mission Loop 3 tiers | ✅ F2 | |
| Transfer Gate + Weekly Bug Log + Retrospective | ✅ F3 | |
| 27 lessons × 5 categories | ✅ §8 | |
| Sprint Hold mechanic | ✅ FR-4.5 đến FR-4.7 | |
| Onboarding Day 1 | ✅ F5 | |
| Success metrics table | ✅ §9 | |
| Freemium model | ✅ §7 | |
| No leaderboard constraint | ✅ §11 #7 | |
| Secondary users (blocked environment) | ✅ §3.2 + FR-3.6 | |

**Kết quả brief.md:** Không có gap cần xử lý trong PRD.

---

## SPEC.md

| Capability | FR mapping | Trạng thái |
|---|---|---|
| CAP-1 Pet evolution + Transfer Gate | FR-1.10, FR-1.11, FR-3.1 | ✅ |
| CAP-2 Dual currency BC/QP | FR-4.1, FR-4.2 | ✅ |
| CAP-3 Daily Mission Loop | FR-2.1 đến FR-2.8 | ✅ |
| CAP-4 Sprint Hold | FR-4.5 đến FR-4.7 | ✅ |
| CAP-5 Onboarding + Aha Moment | FR-5.1 đến FR-5.12 | ✅ |
| CAP-6 Weekly Bug Log | FR-3.3 đến FR-3.5 | ✅ |
| CAP-7 Spaced retrieval | FR-2.8, FR-6.6 | ✅ |
| CAP-8 Sprint Demo Card | FR-6.3, FR-6.4 | ✅ |
| CAP-9 Voice register mình/bạn | F7 | ✅ |
| CAP-10 Server-side commit | FR-8.2, FR-8.3 | ✅ |
| Constraints (9 items) | §11 | ✅ |
| Non-goals | §10 Out of Scope | ✅ |
| Assumptions (6 items) | Captured trong NFRs, §8, OQs | ✅ |

**Kết quả SPEC.md:** Không có gap.

---

## gameplay-systems.md

| Nội dung nguồn | Trạng thái | Ghi chú |
|---|---|---|
| Dual currency + earn/lose/use rules | ✅ FR-4.1, FR-4.2 | |
| XP Multipliers bảng đầy đủ | ✅ FR-4.4 | |
| 3 Mission tiers | ✅ FR-2.2, FR-2.4, FR-2.5 | |
| Pet evolution 5 versions + unlock | ✅ FR-1.10 | |
| Sprint Hold rules + earn paths | ✅ FR-4.5, FR-4.6 | |
| Sprint Hold reason dropdown | ✅ FR-4.7 | |
| Retention hooks (Cliffhanger, Pet Mood, Hotfix Day, RBOTW, Sprint Demo Card) | ✅ FR-6.1 đến FR-6.5 + FR-4.8 | |
| Monetisation freemium table | ✅ §7 | |
| Weekly Challenge hard blocker | ✅ §8 | |
| OQ-1 Zero-Bug Response Tree | ✅ FR-3.6, FR-3.7 | |
| Self-Efficacy Calibration | ✅ FR-6.6 | |

**Kết quả gameplay-systems.md:** Không có gap.

---

## onboarding-flow.md

| Nội dung nguồn | Trạng thái | Ghi chú |
|---|---|---|
| Voice contract mình/bạn/Bugsy | ✅ F7 | |
| Day 1 flow 10 steps | ✅ FR-5.1 đến FR-5.10 | |
| Progressive disclosure | ✅ FR-5.12 | |
| Late-night edge case | ✅ FR-5.11 | |
| Kill-app 5 corner cases + resume behaviour | ✅ FR-8.3 | |
| 5 UX Principles (Resume/Commit/Gentle/Narrative/Voice) | ✅ Covered trong FR-8.2, FR-8.3, FR-3.3, FR-7.5, FR-7.1 | Không cần liệt kê riêng — tất cả đã có trong FRs |

**Kết quả onboarding-flow.md:** Không có gap.

---

## skill-transfer.md

| Nội dung nguồn | Trạng thái | Ghi chú |
|---|---|---|
| Transfer Gate mechanism | ✅ FR-3.1, FR-3.2 | |
| Weekly Bug Log | ✅ FR-3.3 đến FR-3.5 | |
| Retrospective Loop + My Journey | ✅ FR-3.8, FR-3.9 | |
| Observable Behaviour Change Targets (bảng before/after) | ⚠️ Chỉ implicit trong §1 | Bảng 4-hành-vi không có trong PRD. Đây là qualitative context hữu ích cho §9 — cần bổ sung. |
| Scaffold Removal Test | ✅ §9 | |
| Success metrics full set | ✅ §9 | |
| OQ-1 environment problem | ✅ FR-3.6, OQ-1 | |

**Kết quả skill-transfer.md:** 1 gap — Observable Behaviour Change Targets.

---

## content-architecture.md

| Nội dung nguồn | Trạng thái | Ghi chú |
|---|---|---|
| 5 skill categories + counts | ✅ §8 | |
| Learning Design Rule 1 (Story before Rule) | ✅ FR-2.3 | |
| Learning Design Rule 2 (Prior Commitment) | ✅ FR-5.4 | |
| Learning Design Rule 3 (Spaced Retrieval Day 2+) | ✅ FR-2.8 | |
| Learning Design Rule 4 (Self-Efficacy Calibration) | ✅ FR-6.6 | |
| **Learning Design Rule 5 (Severity always contextual, must include user-impact)** | ❌ MISSING | Rule quan trọng: mọi câu quiz liên quan severity/priority phải kèm user-impact context. Thiếu → content sai sẽ không bị chặn. Cần thêm NFR-4.5. |
| Five Universal Scenarios A–E | ✅ §8 | |
| Content Quality Process 4 steps | ✅ NFR-4.1 đến NFR-4.4 | |
| Tagline + rationale | ✅ §2 | |

**Kết quả content-architecture.md:** 1 gap quan trọng — Learning Design Rule 5.

---

## Tổng kết Reconciliation

| Mức độ | Gap | Hành động |
|---|---|---|
| ❌ Thiếu (cần thêm) | Learning Design Rule 5 (severity contextual) | Thêm NFR-4.5 |
| ⚠️ Implicit (cần rõ hơn) | Observable Behaviour Change Targets | Thêm reference trong §9 |
| ⚪ UX detail | Idle animation examples | Defer sang UX phase |
