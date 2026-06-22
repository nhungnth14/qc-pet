---
baseline_commit: 37a24bb
---

# Story 7.1: Transfer Gate Evidence Submission

Status: done

## Story

As a user who's ready to evolve Bugsy, I want to submit real-world work evidence to unlock evolution,
so that leveling up requires genuine skill application, not just in-app progress.

## Context

3-5 đã build evolution status + pending UI + souvenir, NHƯNG transform thật defer chờ **Transfer Gate
evidence (story này)**. 7.1 đóng vòng: submit evidence + đủ QP → evolve (bump version + unlock souvenir
+ RewardEventBus animation). Honor system (no AI validation — AC).

## Open Questions resolved

- **OQ-A (Photo upload):** `expo-image-picker`/Storage CHƯA cài → **text-only** evidence (freeform).
  `evidence_type` column hỗ trợ 'photo' sẵn; photo upload (presigned Supabase Storage) → defer.
- **OQ-B (Server validate):** AC muốn server check QP + submission. Pragmatic: client orchestration qua
  PostgREST (insert submission → nếu qpReached → updatePetVersion + insert souvenir). Server-side
  edge-fn enforcement (anti-cheat) → defer (giống pattern các story trước).
- **OQ-C (Access point):** EvolutionPending chip (WorkRoom, từ 3-5) tap → mở Transfer Gate panel
  (SlideUpPanel). AC "từ phòng tương ứng" → defer per-room access; chip là entry chính.
- **OQ-D (Permanent):** `transfer_gate_submissions` RLS chỉ SELECT + INSERT (no UPDATE/DELETE policy) →
  không xóa được (AC).
- **OQ-E (Evolution commit):** evolve = `pets.version` bump + insert `souvenirs` row + pet-store.setVersion
  + souvenirStore.unlock + `rewardEventBus` (server_committed→animation_triggered, type 'evolution') →
  Bugsy excited (3-3) + souvenir hiện ở shelf (3-5).

## Acceptance Criteria

**AC-1: Evidence config (pure)**
- `EVIDENCE_REQUIREMENTS` keyed theo target version (v0.5/v1.0/v2.0/v3.0) với requirement text + room.
- `canEvolve(qpReached, hasEvidence)` = qpReached && hasEvidence.

**AC-2: Submission**
- `submitEvidence(userId, step, content)` insert `transfer_gate_submissions` (evidence_type 'text').
- Permanent (RLS no delete). Honor system (no validation).

**AC-3: Evolution trigger**
- Submit + qpReached → evolve: version bump + souvenir unlock + RewardEventBus animation. Bugsy excited.
- qp chưa đủ → submission lưu, chưa evolve.

**AC-4: UI**
- EvolutionPending tap → Transfer Gate panel: requirement text + text input + submit. Success →
  evolve (nếu đủ QP) hoặc xác nhận đã lưu evidence.

**AC-5: Tests**
- `EVIDENCE_REQUIREMENTS` đủ 4 step; `canEvolve` truth table.

## Technical Notes

```
src/features/pet/
  transfer-gate.ts          # NEW: EVIDENCE_REQUIREMENTS, canEvolve (pure)
  transfer-gate.test.ts     # NEW
  transfer-gate-api.ts      # NEW: submitEvidence, getSubmissions, evolvePet
  components/transfer-gate-panel.tsx  # NEW: SlideUpPanel form
  components/evolution-pending.tsx    # EDIT: chip tap → open panel
src/stores/pet-store.ts     # EDIT: setVersion
src/lib/supabase-api.ts     # EDIT: updatePetVersion
prisma: TransferGateSubmission model + migration
```

## Dependencies

- **Requires**: 3-5 (evolution status/pending/souvenir) ✅, 3-3 (excited) ✅, RewardEventBus ✅
- **Unblocks**: 3-5 evolution transform (vòng hoàn chỉnh)

## DoD
- [ ] transfer-gate.ts + test · api · panel · pet-store.setVersion · supabase updatePetVersion · DB
- [ ] type-check/lint 0 · tests pass · sprint-status 7-1 done

## Story Points: 5

## Review Findings

> Reviewed 2026-06-22 (epic-level review 7-1→7-6). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 1 patch · 1 defer · 1 dismissed.

- [x] [Review][Patch] `evolvePet` souvenir upsert error không check → version bumped nhưng DB souvenir missing khi mạng lỗi mid-evolve [`src/features/pet/transfer-gate-api.ts:66-70`] — fixed: destructure + throw
- [x] [Review][Defer] `TransferGatePanel.done` state không reset khi close/reopen SlideUpPanel → stale success message lần sau (DEF-7-1-1) [`src/features/pet/components/transfer-gate-panel.tsx:31`]

## Deferred
- Photo evidence (image-picker + Supabase Storage presigned) → khi thêm dep.
- Server-side QP+evidence enforcement (edge fn anti-cheat).
- Per-room Transfer Gate access (hiện qua EvolutionPending chip).
