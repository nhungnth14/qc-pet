# Deferred Work

Tổng hợp các việc được hoãn lại từ code review / dev — để các story sau pick up.

## Deferred from: code review of story-0-2 (2026-06-16)

- **F1 — Cloud migration drift (0-3).** Init migration Prisma tạo lại `quiz_sessions` + enum `quiz_session_status` đã tồn tại trên cloud dev (từ `002_quiz_sessions.sql` cũ) → `prisma migrate deploy` sẽ fail/clobber. Story 0-3 PHẢI baseline cloud bằng `prisma db pull` (introspect schema thật, gồm cả `need_bars` + cột feature) trước khi quản bằng Prisma — KHÔNG `migrate deploy` mù (rủi ro DROP bảng/cột → mất data). [prisma/migrations/20260614195014_init]
- **F2 — Stub `auth.uid()` shadow DB.** Stub trả `NULL::uuid` để `migrate dev` chạy được trên shadow DB (không có schema `auth`). An toàn hiện tại vì mọi migration là DDL-only; nhưng migration tương lai trộn DML trên bảng RLS có thể âm thầm tác động 0 row (không lỗi). Document cảnh báo cho người viết migration sau. [prisma/migrations/20260614195015_enable_rls]
- **F3 — `initSession` thiếu concurrency guard.** Gọi `initSession` 2 lần trước khi lần đầu resolve (React StrictMode double-effect, điều hướng nhanh) → tạo 2 anonymous account, account đầu mồ côi. Thuộc code Story 2-5; xử lý trong Story 2-6 (kill-app corner cases). [src/stores/session-store.ts]
- **F4 — `supabase.ts` throw lúc load module.** Env fail-fast (từ 0-1 Patch #4) throw ở module-eval; nếu `pnpm test` chạy mà jest không inject env Supabase → cả suite fail với lỗi khó hiểu. Verify `jest.config.js`/setup có set env không; nếu không, guard cho môi trường test. [src/lib/supabase.ts]
- **F5 — `auth-token-storage.ts` chunking edge cases.** (a) Race `removeChunked` đọc head rồi xoá, `setChunked` đồng thời ghi head mới → chunk mồ côi, mất token → logout bất ngờ. (b) Slice theo UTF-16 code unit, comment overclaim "byte-safe"; JWT là ASCII nên an toàn hiện tại, nhưng giá trị non-ASCII tương lai có thể vỡ. Harden cùng lúc test luồng login/logout thật (carry-forward Patch #5 của Story 0-1, cần backend). [src/lib/auth-token-storage.ts]
- **F6 — Reconcile spec/doc.** AC1 vẫn liệt kê cột `supabase_auth_id` dù đã bỏ theo quyết định RLS Phase A (`users.id = auth.uid()`); cập nhật AC1. Apple OAuth stub (`[auth.external.apple]`) thiếu comment "STUB (Story 0-2)" như block Google → thêm cho rõ là stub cố ý. Doc-only.
- **D1 — Giữ schema Prisma minimal (quyết định review 0-2).** Lý do: đúng AC1 (cột tối thiểu, feature stories tự thêm). Việc còn lại: feature stories viết migration cho `need_bars` + cột `game_state` của họ; Story 0-3 baseline cloud bằng `prisma db pull` để Prisma nắm schema thật (gồm `need_bars`). 0-2 chỉ sửa comment "source of truth" trong `schema.prisma` cho khớp thực tế.

## Deferred from: code review of story-0-6 (2026-06-16)

- **DEF1 — TactileButton boxShadow animated: native fidelity.** RN 0.81 New Arch hỗ trợ `boxShadow`; web smoke render OK. Animated boxShadow (Reanimated) cần verify cảm quan/hiệu năng trên device build. [src/components/tactile-button.tsx]
- **DEF2 — Jest harness vỡ sẵn từ baseline.** `__mocks__/@gorhom/bottom-sheet` → RN TextInput/Text jest mock crash (RN 0.81 + jest-expo 54). Chặn MỌI component test (0-6 + suite cũ). Ưu tiên fix để bật lại test. Liên quan 0-2 F4 (supabase.ts throw lúc load module cũng cản test). [jest.config.js, __mocks__]
- **DEF3 — NeedBar mất fill animation/shimmer.** Bản cũ dùng `Animated.timing` cho width; component mới set width tĩnh → bar nhảy. Re-add animation + shimmer (DESIGN.md §Need Bar). [src/components/need-bar.tsx]
- **DEF4 — Token hygiene.** `bg-primary`(#006491 MD3) vs `bg-primary-600`(Obytes cam) nhập nhằng; `colors.js` camelCase vs CSS kebab; `--color-need-*` thiếu trong `colors.js`; `error` vs `destructive` trùng đỏ. Dọn 1 lượt khi re-skin screen cũ. [src/global.css, src/components/ui/colors.js]
- **DEF5 — Component robustness + a11y.** TactileButton/SpeechBubble render rỗng khi thiếu label/children; `disabled` không chặn press animation (Android); shared value chạy sau unmount; double-tap stutter; drag-off kẹt pressed; CurrencyChip `amount` không guard NaN/Infinity/âm; snapPoints inline array invalidate memo; `textClassName` bị bỏ khi dùng children; thiếu `accessibilityState`. Làm trong component-polish/a11y pass. [src/components/*]
- **DEF6 — NeedBar.fillClassName free-string.** Typo class ngoài `@theme` → bar vô hình (Tailwind v4 không JIT dynamic string). Cân nhắc đổi sang token enum (`need: 'hunger'|...`). [src/components/need-bar.tsx]
- **DEF7 — iOS JetBrains Mono PostScript name.** Verify tên PostScript trong .ttf khớp `font-family` để không fallback. Verify trên device build. [app.config.ts]
- **DEF8 — Cleanup.** Gỡ dead dep `@expo-google-fonts/inter`; bổ sung `no-restricted-imports` (tamagui, gluestack-ui, react-native-ui-lib...). [package.json, eslint.config.mjs]
- **DEF9 — Cosmetic/a11y nhỏ.** Gỡ sạch `dark:` variant inert (story-acknowledged); SpeechBubble tail gap 2px; TactileButton `accessibilityState={{disabled}}`. [src/components/*, ui/*]
- **DEF10 — DESIGN.md vs story AC lệch.** TactileButton resting shadow 4px (DESIGN.md) vs 6px (AC/code); SpeechBubble border 4px (DESIGN.md) vs 3px (code). Reconcile với designer; cập nhật nguồn thắng. [DESIGN.md / story AC]
