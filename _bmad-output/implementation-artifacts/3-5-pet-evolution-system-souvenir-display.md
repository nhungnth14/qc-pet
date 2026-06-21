---
baseline_commit: 37a24bb
---

# Story 3.5: Pet Evolution System & Souvenir Display

Status: done

## Story

As a user,
I want Bugsy to evolve as I grow my QC skills with real-world evidence,
so that leveling up feels meaningful and requires both learning AND real-world application.

## Context & Background

`EVOLUTION_THRESHOLDS` đã có trong `constants.ts` (150/400/900/1800). pet-store có `version` +
`qpTotal`. 3-3 có BugsyCharacter (version-aware sizing sẵn sàng). Evolution **2 cổng**: đủ QP **VÀ**
Transfer Gate evidence (Epic 7). Evidence gate chưa tồn tại → **actual transform blocked** (giống
streak ở 3-4). Phần buildable ngay: **Evolution Pending** state + souvenir data model + shelf display.

## Open Questions resolved

- **OQ-A (Evolution gate — Epic 7):** Evolve thật cần QP **+ evidence** (Transfer Gate, Epic 7). Evidence
  chưa có → `getEvolutionStatus.isPending = qpReached` (đủ QP nhưng chưa evolve được). UI hiện
  "Evolution Pending 🥚" + tooltip. **Actual transform (animation + version bump + souvenir fly-in +
  server validate)** → defer Epic 7. Bugsy giữ version hiện tại (AC nói rõ).
- **OQ-B (QP thresholds):** dùng `EVOLUTION_THRESHOLDS`: v0.1→v0.5 150, v0.5→v1.0 400, v1.0→v2.0 900,
  v2.0→v3.0 1800. v3.0 = max.
- **OQ-C (Pending indicator vị trí):** WorkRoom (pet profile hub) — chip "🥚 Evolution Pending", tap →
  tooltip "Cần bằng chứng từ công việc thực để Bugsy tiến hóa lên {next}".
- **OQ-D (Souvenir):** `souvenirs` table (user_id, evolution_step, souvenir_type, unlocked_at) +
  `SOUVENIRS` config (travel-destination artifact mỗi step) + `SouvenirShelf` ở Phòng Khách. Evolution
  chưa xảy ra → shelf trống (placeholder "Chưa có kỷ niệm"); Epic 7 populate. fly-in animation → defer.
- **OQ-E (Server validate):** Evolution commit server-side (QP + evidence) → Epic 7. 3-5 không commit
  evolve; chỉ data model + pending + shelf scaffold.

## Acceptance Criteria

**AC-1: Evolution status (pure)**
- `getEvolutionStatus(version, qpTotal)` → current, next|null, qpRequired, qpRemaining, qpReached,
  isMaxed, isPending. v3.0 → isMaxed. Version lạ → mặc định v0.1.

**AC-2: Evolution Pending UI**
- Khi đủ QP cho step kế (qpReached) nhưng chưa evolve → "🥚 Evolution Pending" + tooltip; Bugsy visual
  KHÔNG đổi, KHÔNG animation. Chưa đủ QP → không hiện.

**AC-3: Souvenir data + display**
- `souvenirs` table (Prisma + migration idempotent). `SOUVENIRS` config per evolution step.
- `SouvenirShelf` ở Phòng Khách render souvenir đã unlock (store MMKV); trống → placeholder.

**AC-4: Unit tests**
- `getEvolutionStatus`: chưa đủ QP / đủ QP→pending / maxed / version lạ / từng step threshold.
- `SOUVENIRS` có step v0.5..v3.0 (không v0.1).

## Technical Notes

```
src/features/pet/
  evolution.ts             # NEW: PetVersion, NEXT_EVOLUTION, EVOLUTION_LABELS, getEvolutionStatus (pure)
  evolution.test.ts        # NEW
  souvenir.ts              # NEW: SOUVENIRS config (pure)
  stores/use-souvenir-store.ts  # NEW: unlockedSteps (MMKV)
  components/evolution-pending.tsx  # NEW
  components/souvenir-shelf.tsx     # NEW
src/features/work-room/work-room-screen.tsx   # EDIT: render EvolutionPending
src/features/rooms/components/room-screen.tsx # EDIT: SouvenirShelf khi LIVING_ROOM
prisma/schema.prisma + migration              # NEW: Souvenir model
```

### getEvolutionStatus

```ts
export type PetVersion = 'v0.1' | 'v0.5' | 'v1.0' | 'v2.0' | 'v3.0';
// isPending = qpReached (evidence gate Epic 7 chưa có → đủ QP = pending)
```

## Dependencies

- **Requires**: constants EVOLUTION_THRESHOLDS ✅, pet-store version/qpTotal ✅, 3-3 BugsyCharacter ✅
- **BLOCKED (transform)**: Transfer Gate evidence → **Epic 7**; evolve animation/version-bump/souvenir
  fly-in/server-commit chờ đó.
- **Closes**: Epic 3 (3-1→3-5)

## Definition of Done

- [ ] `evolution.ts` + `souvenir.ts` + tests
- [ ] `use-souvenir-store.ts`
- [ ] `Souvenir` Prisma model + migration
- [ ] `EvolutionPending` + `SouvenirShelf` + wire
- [ ] `pnpm type-check` 0 · `pnpm lint` 0 · tests pass
- [ ] sprint-status: 3-5 → done; epic-3 → done

## Story Points: 5

## Deferred (Epic 7 / art)

- Actual evolution transform: evidence gate, evolve animation (orchestral SFX 3-5s, glow→transform),
  version bump, server validate QP+evidence → **Epic 7**.
- Souvenir fly-in animation (bay từ cửa sổ) + populate shelf → **Epic 7** + art pass.
