---
baseline_commit: b5318c4
---

# Story 1.3: OTA Content Delivery & Version Management

Status: done

## Story

As a learner,
I want the app to always serve the latest lesson content without requiring a reinstall,
so that content improvements and new lessons appear seamlessly and the app works offline.

## Context & Background

Story 1-1 định nghĩa JSON Schema + 2 seed lessons. Story 1-2 thêm RBOTW + author format + CI quality gate.
Story 1-3 xây dựng **runtime layer**: làm thế nào app *load* lesson data, *phát hiện* content mới, và *bảo vệ* session đang chạy khỏi bị interrupt.

**Architecture decision (OQ-A resolved):**
Content delivery dùng EAS Update (bundle-based OTA) cho MVP, không phải CDN riêng. Lý do:
- Tất cả content JSONs trong `content/` folder được Metro bundle vào JS bundle
- Khi content thay đổi → CI push EAS Update → user nhận bundle mới lần mở app tiếp theo
- ContentRepository encapsulates loading logic → switching sang CDN sau là 1-file change
- CDN fetch path được thiết kế (interface) nhưng không wire trong story này

**OQ-B resolved:** Metro `require()` không dynamic → cần `content-index.ts` static registry mapping lesson ID → require() call. Được update mỗi khi thêm lesson mới.

**OQ-C resolved:** `expo-updates` chỉ hoạt động trong production/EAS builds. Trong dev → guard bằng `!__DEV__` và `Updates.isAvailable`.

**Inputs từ Story 1-1/1-2 (đã có):**
- `content/lessons/BD-1.json`, `content/lessons/TA-1.json`
- `content/real-bugs/RBOTW-001.json`
- `content/authors/nhung-nguyen.json`
- `content/manifest.json` (content_version: "0.1.1")
- `src/features/content/lesson-types.ts` — `Lesson`, `ContentManifest`, `RealBugOfTheWeek`

## Acceptance Criteria

**AC-1: ContentRepository API**
- `getManifest()` trả về `ContentManifest` từ bundled `content/manifest.json`
- `getLesson(id)` trả về `Lesson | null` — null nếu không tìm thấy (không throw)
- `getLessonsByCategory(category)` trả về `Lesson[]` đã sort theo `dependency_order`
- `getAllPublishedLessons()` trả về `ManifestEntry[]` chỉ `is_published: true`
- `getRealBug(id)` trả về `RealBugOfTheWeek | null`

**AC-2: Content version tracking (MMKV)**
- Sau khi app load xong content, `CONTENT_LAST_SEEN_VERSION` được ghi vào MMKV
- `useContentVersion()` hook expose: `{ bundledVersion: string, lastSeenVersion: string | null, isFirstLoad: boolean }`

**AC-3: OTA update check (background)**
- Khi app mount, `checkForOtaUpdate()` được gọi trong background (không await on mount)
- Trong `__DEV__` hoặc `!Updates.isAvailable` → no-op, không throw
- Nếu update available → `Updates.fetchUpdateAsync()` download silently
- Update KHÔNG apply ngay (`reloadAsync` không được gọi tự động) — chờ lần launch tiếp theo
- Current session không bị interrupt

**AC-4: Session isolation**
- Quiz session đọc lesson data 1 lần khi session bắt đầu (snapshot pattern)
- Nếu OTA update hoàn tất trong lúc quiz đang chạy → current session tiếp tục với data cũ
- Lesson data mới chỉ available từ session tiếp theo

**AC-5: Graceful fallback**
- `getLesson(id)` trả về `null` cho ID không biết (không crash)
- UI layer phải handle null → show "Nội dung đang tải, thử lại sau" (UI implementation là Story 5-1, nhưng ContentRepository contract phải support)

**AC-6: DB migration + Prisma schema (game_state)**
- `game_state` table thêm 2 cột: `content_version TEXT` (nullable), `last_content_synced_at TIMESTAMPTZ` (nullable)
- Prisma schema reflect cả 2 cột
- Migration file tạo tại `supabase/migrations/`
- Mục đích: khi user đăng nhập từ device mới → server biết content version họ đã có

**AC-7: Unit tests**
- `ContentRepository.getLesson()` — known ID: trả lesson đúng; unknown ID: trả null
- `ContentRepository.getAllPublishedLessons()` — chỉ là_published=true
- `ContentRepository.getLessonsByCategory('BD')` — sort đúng dependency_order
- `useContentVersion()` — mock MMKV, kiểm tra isFirstLoad behavior

## Technical Notes

### Files sẽ tạo

```
src/features/content/
  content-index.ts          # Static registry: ID → require(JSON)
  content-repository.ts     # ContentRepository class
  content-repository.test.ts
  use-content-version.ts    # Hook: version tracking + OTA trigger
  use-content-version.test.ts
```

### content-index.ts pattern

```ts
// Static require — Metro bundler cần thấy literal string paths
import type { Lesson } from './lesson-types';
import type { RealBugOfTheWeek } from './lesson-types';

export const LESSON_REGISTRY: Record<string, Lesson> = {
  'BD-1': require('../../../content/lessons/BD-1.json'),
  'TA-1': require('../../../content/lessons/TA-1.json'),
  // Thêm lesson mới vào đây — scripts/update-manifest.mjs chạy sau để sync manifest
};

export const RBOTW_REGISTRY: Record<string, RealBugOfTheWeek> = {
  'RBOTW-001': require('../../../content/real-bugs/RBOTW-001.json'),
};

// Manifest được import trực tiếp (auto-updated bởi update-manifest.mjs)
export { default as MANIFEST } from '../../../content/manifest.json';
```

### ContentRepository pattern

```ts
class ContentRepository {
  getManifest(): ContentManifest { ... }
  getLesson(id: string): Lesson | null { ... }
  getLessonsByCategory(category: Category): Lesson[] { ... }
  getAllPublishedLessons(): ManifestEntry[] { ... }
  getRealBug(id: string): RealBugOfTheWeek | null { ... }
}
export const contentRepository = new ContentRepository(); // singleton
```

### MMKV keys (thêm vào shared/lib/constants.ts)

```ts
export const CONTENT_LAST_SEEN_VERSION = 'content:last_seen_version';
export const CONTENT_LAST_SYNCED_AT = 'content:last_synced_at';
```

### expo-updates guard pattern

```ts
import * as Updates from 'expo-updates';

async function checkForOtaUpdate(): Promise<void> {
  if (__DEV__ || !Updates.isAvailable) return;
  try {
    const result = await Updates.checkForUpdateAsync();
    if (result.isAvailable) await Updates.fetchUpdateAsync();
  } catch {
    // Network error — không block user, không log noise
  }
}
```

### DB migration (add to game_state)

```sql
ALTER TABLE game_state
  ADD COLUMN IF NOT EXISTS content_version TEXT,
  ADD COLUMN IF NOT EXISTS last_content_synced_at TIMESTAMPTZ;
```

### Prisma schema additions (GameState model)

```prisma
contentVersion      String?   @map("content_version")
lastContentSyncedAt DateTime? @map("last_content_synced_at") @db.Timestamptz(6)
```

## Dependencies

- **Requires**: Story 1-1 (content/ folder + lesson-types.ts) ✅
- **Requires**: Story 1-2 (RBOTW JSONs + authors) ✅
- **Enables**: Story 5-1 (Core Mission lesson player dùng ContentRepository để load lesson)
- **Enables**: Story 1-3b future (CDN fetch path nếu cần scale)

## Definition of Done

- [ ] `content-index.ts` — static registry cho 2 lessons + 1 RBOTW
- [ ] `content-repository.ts` — 5 methods, singleton export
- [ ] `use-content-version.ts` — hook với MMKV + expo-updates guard
- [ ] `supabase/migrations/YYYYMMDD_game_state_content_version.sql`
- [ ] `prisma/schema.prisma` updated (GameState + 2 fields)
- [ ] Unit tests: ≥7 cases, all pass
- [ ] `pnpm type-check` → 0 errors
- [ ] `pnpm lint` → 0 errors
- [ ] sprint-status.yaml: 1-3 → done

## Story Points: 3
