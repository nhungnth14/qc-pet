---
baseline_commit: 37a24bb
---

# Story 10.2: Item Shop Placeholder (Browse Only, "Coming Soon")

Status: done

## Story

As a user, I want to see what items will be available in the future shop, so that I feel excited
without frustration.

## OQ resolved
- **Browse-only placeholder:** grid item cards (emoji, name, category, "Sắp ra mắt" chip, BC price greyed).
  Buy buttons greyed (KHÔNG hidden) — KHÔNG dùng prop `disabled` để onPress vẫn fire → tap → Bugsy speech
  bubble "Mình đang làm thêm đồ cho bạn! Chờ mình một chút nha 🛍️" (tap dismiss). Positive framing.
- **Không** cart/transaction/waitlist/email (Phase 2 OUT OF SCOPE).
- **Vị trí:** trong Sân (GARDEN RoomScreen), horizontal ScrollView card.

## Acceptance Criteria
- **AC-1:** Header "Cửa hàng Bugsy 🏪 (Sắp ra mắt)" + grid cards (name, category, Coming Soon chip, price greyed).
- **AC-2:** Buy greyed (visible) → tap → Bugsy speech bubble → tap dismiss.
- **AC-3:** `SHOP_ITEMS` config (wallpaper/outfit/toy). tests.

## Technical Notes
```
src/features/shop/
  shop-items.ts          # SHOP_ITEMS + SHOP_CATEGORY_LABEL (pure)
  shop-items.test.ts
  components/shop-placeholder.tsx
src/features/rooms/components/room-screen.tsx  # EDIT: GARDEN → GardenCinematic + ShopPlaceholder
```

## Dependencies
- Requires: 10.1 Sân (GARDEN room) ✅
- **Closes Epic 10 + toàn roadmap**

## DoD
- [ ] shop-items + test · shop-placeholder · wire GARDEN · type-check/lint 0 · tests · sprint-status 10-2 done; epic-10 done

## Story Points: 3

## Review Findings

> Reviewed 2026-06-23 (epic-level review 10-1→10-2). Layers: Blind Hunter inline · ECH/Auditor skipped.
> 1 patch · 0 defer · 2 dismissed.

- [x] [Review][Patch] `buyGreyed` minHeight: 32 < 44px vi phạm project accessibility floor "Touch targets ≥ 44×44px" [`src/features/shop/components/shop-placeholder.tsx:70`] — fixed: `minHeight: 44`

## Deferred
- Phase 2 full shop (cart, transaction, BC purchase, real item assets).
