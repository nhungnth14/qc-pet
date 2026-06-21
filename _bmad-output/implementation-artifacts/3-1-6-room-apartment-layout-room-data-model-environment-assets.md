---
baseline_commit: b5318c4
---

# Story 3.1: 6-Room Apartment Layout, Room Data Model & Environment Assets

Status: done

## Story

As a user,
I want to see Bugsy's fully realized home with distinct room environments,
so that each room feels like a real place I want to visit and care for.

## Context & Background

Epic 2 (Onboarding) đã xây Work Room screen cơ bản (`work-room-screen.tsx`) và `RoomType` enum
trong `use-room-navigation.ts`. Story 3-1 xây nền tảng data model đầy đủ cho cả 6 phòng:
definitions/constants, unlock state store, environment visual component, và DB table.

Story 3-2 sẽ build Apartment View (isometric grid + swipe navigation) dựa trên nền này.

**Open Questions resolved:**
- **OQ-A**: `RoomType` đã có trong `use-room-navigation.ts` — reuse, không duplicate.
- **OQ-B**: Room unlock state cần store riêng (`use-room-store.ts`) tách khỏi navigation store.
- **OQ-C**: `ROOM_DEFINITIONS` là constant object (không phải DB table) — chứa static metadata
  (label, emoji, bg color, unlock trigger string). DB `rooms` table chứa per-user unlock state.
- **OQ-D**: `RoomEnvironment` component render background + visual state cho 1 phòng.
  Story 3-2 dùng để tile vào Apartment View.

## Acceptance Criteria

**AC-1: Room definitions constant**
- `ROOM_DEFINITIONS` export 6 entry theo RoomType key
- Mỗi entry có: `label` (tiếng Việt), `emoji`, `bgColor` (hex), `unlockTrigger` (string mô tả điều kiện)
- Màu sắc khớp spec DESIGN.md:
  - Work Room: `#FFE5D9` (warm-peach-bg)
  - Bếp: `#FFF3CC` (kitchen-amber)
  - Ngủ: `#EDE7F6` (bedroom soft lavender)
  - Khách: `#FFF8E1` (living-warm)
  - Tắm: `#E0F2F1` (bathroom-mint)
  - Sân: `#E3F2FD` (yard-sky)

**AC-2: Room store (Zustand + MMKV)**
- `useRoomStore` có: `rooms: Record<RoomType, RoomState>`, `setUnlocked`, `setTriggerMet`, `loadFromLocal`, `saveToLocal`
- `RoomState = { isUnlocked: boolean; unlockTriggerMet: boolean }`
- Khởi tạo: Work Room `isUnlocked: true`, 5 phòng còn lại `isUnlocked: false`
- Persist vào MMKV key `rooms:unlock_state` (JSON)
- `loadFromLocal()` được gọi khi app mount (Work Room screen)

**AC-3: RoomEnvironment component**
- Props: `roomType: RoomType`, `state: 'normal' | 'attention' | 'locked'`, `children?: React.ReactNode`
- `normal`: background color theo ROOM_DEFINITIONS, no overlay
- `attention`: background + amber glow border pulsing (Animated.loop, 2s cycle, border color `#FFB000`)
- `locked`: background desaturated 40% (opacity 0.6 overlay) + `?` chip centered
- Children rendered on top of environment

**AC-4: DB migration (rooms table)**
```sql
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL,
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  unlock_trigger_met BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, room_type)
);
```
- `WORK_ROOM` seed per user khi user provisioned (trigger or app logic — Story 3-4 owns full logic)
- RLS: `user_id = auth.uid()`
- Index: `idx_rooms_user_id` on `user_id`

**AC-5: Prisma schema (Room model)**
- `Room` model với đủ 7 cột + relation tới `User`
- `@@unique([userId, roomType])`

**AC-6: Unit tests**
- `ROOM_DEFINITIONS` có đủ 6 keys, mỗi key có đủ 4 fields
- `useRoomStore` initial state: Work Room unlocked, others locked
- `setUnlocked('KITCHEN')` → KITCHEN unlocked, Work Room vẫn unlocked
- `loadFromLocal()` restore từ MMKV mock

## Technical Notes

### File structure

```
src/features/rooms/
  room-types.ts               # RoomType (re-export từ use-room-navigation) + definitions + RoomState
  stores/
    use-room-navigation.ts    # ĐÃ CÓ — không đổi
    use-room-store.ts         # NEW: unlock state store
  components/
    room-environment.tsx      # NEW: visual environment component
  room-types.test.ts          # NEW: unit tests
```

### room-types.ts pattern

```ts
export type { RoomType } from './stores/use-room-navigation';

export type RoomState = {
  isUnlocked: boolean;
  unlockTriggerMet: boolean;
};

export type RoomDefinition = {
  label: string;
  emoji: string;
  bgColor: string;
  unlockTrigger: string;
};

export const ROOM_DEFINITIONS: Record<RoomType, RoomDefinition> = {
  WORK_ROOM: { label: 'Work Room', emoji: '🖥️', bgColor: '#FFE5D9', unlockTrigger: 'onboarding' },
  KITCHEN:   { label: 'Bếp', emoji: '🍳', bgColor: '#FFF3CC', unlockTrigger: 'after_aha_moment' },
  BEDROOM:   { label: 'Ngủ', emoji: '🛏️', bgColor: '#EDE7F6', unlockTrigger: 'after_first_core_mission' },
  LIVING_ROOM: { label: 'Phòng Khách', emoji: '🛋️', bgColor: '#FFF8E1', unlockTrigger: 'happiness_below_50' },
  BATHROOM:  { label: 'Phòng Tắm', emoji: '🚿', bgColor: '#E0F2F1', unlockTrigger: 'streak_3_days' },
  GARDEN:    { label: 'Sân', emoji: '🌿', bgColor: '#E3F2FD', unlockTrigger: 'streak_7_days_or_week1' },
};
```

### use-room-store.ts pattern

```ts
const INITIAL_STATE: Record<RoomType, RoomState> = {
  WORK_ROOM:    { isUnlocked: true,  unlockTriggerMet: true },
  KITCHEN:      { isUnlocked: false, unlockTriggerMet: false },
  BEDROOM:      { isUnlocked: false, unlockTriggerMet: false },
  LIVING_ROOM:  { isUnlocked: false, unlockTriggerMet: false },
  BATHROOM:     { isUnlocked: false, unlockTriggerMet: false },
  GARDEN:       { isUnlocked: false, unlockTriggerMet: false },
};
```

### Prisma additions

```prisma
enum RoomType {
  WORK_ROOM
  KITCHEN
  BEDROOM
  LIVING_ROOM
  BATHROOM
  GARDEN
  @@map("room_type")
}

model Room {
  id                String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  roomType          RoomType  @map("room_type")
  isUnlocked        Boolean   @default(false) @map("is_unlocked")
  unlockTriggerMet  Boolean   @default(false) @map("unlock_trigger_met")
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt         DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz(6)

  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, roomType])
  @@map("rooms")
}
```

## Dependencies

- **Requires**: Story 0-2 (Supabase + Prisma + `users` table) ✅
- **Requires**: Epic 2 (Onboarding done, Work Room screen exists) ✅
- **Enables**: Story 3-2 (Apartment View dùng ROOM_DEFINITIONS + useRoomStore)
- **Enables**: Story 3-3 (Bugsy idle states per room)
- **Enables**: Story 3-4 (Room unlock sequence checks unlockTrigger)

## Definition of Done

- [ ] `room-types.ts` — 6 ROOM_DEFINITIONS, RoomState type
- [ ] `use-room-store.ts` — Zustand + MMKV, initial state correct
- [ ] `room-environment.tsx` — 3 visual states, animation attention
- [ ] `prisma/migrations/20260621110000_rooms_table/migration.sql`
- [ ] `prisma/schema.prisma` updated (Room model + RoomType enum)
- [ ] Unit tests: ≥6 cases, all pass
- [ ] `pnpm type-check` → 0 errors
- [ ] `pnpm lint` → 0 errors
- [ ] sprint-status.yaml: 3-1 → done

## Story Points: 3

### Review Findings

- [x] [Review][Patch] `LOCKED_OVERLAY_OPACITY = 0.4` → 0.6 — spec AC-3 yêu cầu opacity 0.6 cho locked overlay [`src/features/rooms/components/room-environment.tsx:17`]
- [x] [Review][Patch] `isTransitioning` kẹt `true` khi unmount trước timer 800ms — thêm `setTransitioning(false)` vào cleanup [`src/features/rooms/apartment-container.tsx:36`]
- [x] [Review][Patch] `WALK_DURATION_MS` export từ `walk-transition.tsx`, import vào `apartment-container.tsx` — xóa duplicate definition [`src/features/rooms/apartment-container.tsx:13`, `src/features/rooms/components/walk-transition.tsx:5`]
- [x] [Review][Defer] RLS `rooms_user_policy` thiếu `WITH CHECK` explicit — PG FOR ALL dùng USING làm check expression cho INSERT, kỹ thuật ổn nhưng thiếu clarity so với các table khác [`prisma/migrations/20260621110000_rooms_table/migration.sql:29`]
- [x] [Review][Defer] `SCREEN_WIDTH` bắt tại module-eval time, stale sau rotation — low risk với MVP mobile portrait-only [`src/features/rooms/components/walk-transition.tsx:6`]
- [x] [Review][Defer] `getMostNeededRoom` fallback khi ALL rooms locked (corrupted state) có thể navigate tới WORK_ROOM ngay cả khi locked [`src/features/rooms/apartment-layout.ts:101`]
- [x] [Review][Defer] Stale swipe gesture closure nếu rooms unlock event xảy ra mid-swipe (800ms window) [`src/features/rooms/apartment-container.tsx:60`]
- [x] [Review][Defer] `mockStorage` trong test chỉ clear ở `afterEach`, không có `beforeEach` — minor test hygiene [`src/features/rooms/room-types.test.ts:3`]
