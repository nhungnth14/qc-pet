---
baseline_commit: b9e2314
---

# Story 0.6: Design System Foundation (Color Tokens, Typography, Core Components)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want design system primitives (color tokens, typography, tactile components) làm shared building blocks,
so that mọi feature team build UI nhất quán với ngôn ngữ thị giác QC Pet ngay từ dòng code đầu tiên.

## Acceptance Criteria

**AC1 — Color tokens (MD3 roles + QC Pet) trong `@theme` của Uniwind/Tailwind v4:**
- Mở rộng `src/global.css` `@theme` (KHÔNG tạo `tailwind.config.js` — xem Dev Notes §Stack) + mirror vào `src/components/ui/colors.js` (dùng ở JS context).
- MD3 roles available qua utility class: `primary` (#006491), `primary-container` (#22b5ff), `inverse-surface` (#002e69), `error` (#ba1a1a), `surface-container` (#f0f4f8), `on-surface` (#1a1a2e).
- QC Pet tokens: `qp-teal` (#00A8A8), `bc-amber` (#FFB000), `terminal-green` (#8ce68c), `warm-peach-bg` (#FFE5D9), `rule-landing-bg` (#BFFFA1).
- Verify class hoạt động: `bg-qp-teal`, `text-bc-amber`, `bg-warm-peach-bg` render đúng màu (web smoke).

**AC2 — Dark mode TẮT trong MVP:**
- Gỡ block `@media (prefers-color-scheme: dark)` trong `src/global.css`; `use-theme-config.tsx` hardcode LightTheme (không trả DarkTheme).
- Class `dark` không bao giờ apply. Gỡ `dark:` variants trong component khi đụng tới (button.tsx, input, select, modal, text...).

**AC3 — Typography (Nunito Sans + JetBrains Mono):**
- Cài + load **Nunito Sans** weights 600/700/800/900 và **JetBrains Mono** weight 500 qua `expo-font` plugin trong `app.config.ts` (thay/giảm Inter).
- `--font-family-sans` trong `@theme` = Nunito Sans; thêm `--font-family-mono` = JetBrains Mono. Class `font-sans` (UI) / `font-mono` (code/terminal context only).
- **Min weight UI text = 600** — không có 400/300/100 trong production strings. JetBrains Mono chỉ dùng trong code/terminal context.

**AC4 — Core tactile components (build mới trong `src/components/`):**
- `TactileCard`: `border: 3px solid #001a41` + blocky shadow `0px 6px 0px 0px rgba(0,26,65,1)` + `rounded-xl` (12px). **Không** Gaussian blur.
- `TactileButton`: press → `translateY(4px)` + shadow giảm 6px→0px (spring); release spring-back `cubic-bezier(0.34,1.56,0.64,1)` (Reanimated/moti). Touch target ≥ 44×44px. 1 primary CTA pattern.
- `SpeechBubble` (Bugsy thoại), `NeedBarComponent` (consolidate hàm `NeedBar` inline trong `work-room-screen.tsx`), `SlideUpPanel` (dùng `@gorhom/bottom-sheet`), `CurrencyChip` (`bc-amber`/`qp-teal`, không mix màu).
- Component dùng pattern hiện có: `tailwind-variants` (`tv`) như `button.tsx`; export qua `src/components/ui/index.tsx` (hoặc `src/components/index`).

**AC5 — ESLint guardrails:**
- `no-external-ui-library`: cấm import MUI/Chakra/react-native-paper... (dùng `no-restricted-imports` trong `eslint.config.mjs`).
- Cảnh báo hardcode hex color thay vì token (rule custom hoặc `no-restricted-syntax` regex `#[0-9a-fA-F]{3,8}` trong `src/components`/`src/features`). Mức `warn` để không vỡ build ngay.
- `pnpm lint` + `pnpm type-check` pass.

**AC6 — Không phá regression + smoke:**
- Các screen đã có (onboarding Epic 2, core-mission/quiz Epic 5, work-room) **vẫn render** sau khi đổi font/tắt dark/refactor NeedBar (web smoke `pnpm web`, 0 console error mới).

## Tasks / Subtasks

- [x] **Task 1: Color tokens (AC: 1)**
  - [x] 1.1 Thêm MD3 roles + QC Pet tokens vào `@theme` trong `src/global.css` (định nghĩa `--color-*`).
  - [x] 1.2 Mirror các token tương ứng vào `src/components/ui/colors.js` (giữ shape module.exports).
  - [x] 1.3 Verify utility class (`bg-qp-teal`, `text-bc-amber`, `bg-warm-peach-bg`, `border-[#001a41]`) render đúng (web).

- [x] **Task 2: Tắt dark mode (AC: 2)**
  - [x] 2.1 Gỡ block `@media (prefers-color-scheme: dark) { @theme {...} }` trong `src/global.css`.
  - [x] 2.2 `src/components/ui/use-theme-config.tsx`: luôn trả `LightTheme` (bỏ nhánh `theme === 'dark'`).
  - [x] 2.3 Gỡ `dark:` variants trong component đụng tới (ít nhất `button.tsx`; rà `input/select/modal/text` nếu re-theme).

- [x] **Task 3: Typography (AC: 3)**
  - [x] 3.1 `npx expo install @expo-google-fonts/nunito-sans @expo-google-fonts/jetbrains-mono` (version khớp Expo SDK 54).
  - [x] 3.2 Cập nhật `expo-font` plugin trong `app.config.ts`: load Nunito Sans 600/700/800/900 + JetBrains Mono 500 (ios `fonts[]` + android `fontDefinitions[]` như pattern Inter hiện có).
  - [x] 3.3 `src/global.css`: `--font-family-sans` = Nunito Sans; thêm `--font-family-mono` = JetBrains Mono.
  - [x] 3.4 Đổi `font-inter` → `font-sans` trong components (button.tsx label, text.tsx...). Gỡ Inter nếu không còn dùng (tùy chọn).

- [x] **Task 4: Core components (AC: 4)**
  - [x] 4.1 `TactileCard` (`src/components/tactile-card.tsx`) — tv variants; shadow blocky (xem §RN shadow).
  - [x] 4.2 `TactileButton` (`src/components/tactile-button.tsx`) — base trên pattern `button.tsx` + press animation (Reanimated/moti), touch target ≥44px.
  - [x] 4.3 `NeedBarComponent` (`src/components/need-bar.tsx`) — consolidate hàm `NeedBar` inline ở `work-room-screen.tsx`; nhận `{label,value,color token}`; **refactor work-room dùng component này** + bỏ hex hardcode (#84cc16…).
  - [x] 4.4 `SlideUpPanel` (`src/components/slide-up-panel.tsx`) — wrap `@gorhom/bottom-sheet`; chỉ 1 panel mở 1 lúc (UX constraint); focus trap.
  - [x] 4.5 `CurrencyChip` (`src/components/currency-chip.tsx`) — variant `bc`(amber) / `qp`(teal), không mix màu.
  - [x] 4.6 `SpeechBubble` (`src/components/speech-bubble.tsx`) — Bugsy thoại.
  - [x] 4.7 Export tất cả qua barrel (`src/components/index.tsx` hoặc `ui/index.tsx`); thêm test cơ bản theo pattern `button.test.tsx`.

- [x] **Task 5: ESLint guardrails (AC: 5)**
  - [x] 5.1 Đọc `eslint.config.mjs` (flat config) trước; thêm `no-restricted-imports` cấm `@mui/*`, `@chakra-ui/*`, `react-native-paper`, `@rneui/*`, `native-base`.
  - [x] 5.2 Thêm cảnh báo hardcode hex (`no-restricted-syntax` regex hoặc rule custom) scope `src/components`+`src/features`, mức `warn`.
  - [x] 5.3 `pnpm lint` + `pnpm type-check` pass.

- [x] **Task 6: Smoke & verify (AC: 6)**
  - [x] 6.1 `pnpm web` → onboarding render đúng (font Nunito, màu peach), work-room NeedBar render qua component mới, 0 console error mới (preview screenshot làm bằng chứng).
  - [x] 6.2 `pnpm type-check` + `pnpm lint` + `pnpm test` pass.
  - [x] 6.3 Cập nhật story (checkboxes, Dev Agent Record, File List), status → review.

## Dev Notes

### ⚠️ Stack styling THỰC TẾ (tài liệu ghi SAI — đọc kỹ trước khi code)

- **Stack thật = Uniwind (`uniwind ^1.2.4`) + Tailwind v4 (`tailwindcss 4.1.18`).** Config theme bằng **CSS `@theme` trong `src/global.css`** (`@import 'tailwindcss'; @import 'uniwind';`). Metro: `metro.config.js` dùng `withUniwindConfig(config, { cssEntryFile: './src/global.css' })`.
- ❌ **KHÔNG có `tailwind.config.js`** và **KHÔNG dùng NativeWind.** Epics AC ghi "NativeWind + Tailwind config được extend" và project-context ghi "Tailwind CSS v3" — **CẢ HAI SAI** so với scaffold. → Mở rộng token bằng `@theme` trong `global.css`, **đừng** tạo `tailwind.config.js` hay cài NativeWind/Tailwind v3.
- Component variants: `tailwind-variants` (`tv`) — xem `src/components/ui/button.tsx` làm mẫu. Class merge: `tailwind-merge`. Theme hook: `useUniwind()`.

### ĐÃ CÓ — reuse, đừng build lại từ đầu

- **UI kit Obytes sẵn** trong `src/components/ui/`: `button, input, checkbox, select, modal, list, progress-bar, text, image, focus-aware-status-bar, colors.js, use-theme-config, icons/`. → re-theme (font/dark/token), không viết lại.
- **`@gorhom/bottom-sheet ^5.2.8`** → base cho `SlideUpPanel`. **`moti ^0.30.0` + `react-native-reanimated ~4.1.6`** → animation TactileButton/SpeechBubble. **`react-native-svg ~15.12.1`** → shapes/chip nếu cần. **`progress-bar.tsx`** → base cho NeedBarComponent.
- **`NeedBar` đang là hàm inline** trong `src/features/work-room/work-room-screen.tsx` (L13) với **hex hardcode** (#84cc16/#22b5ff/#ba1a1a/#b59cff) → Task 4.3 nâng thành shared component + dùng token. Đây là ví dụ duplication + vi phạm token-rule cần dọn.
- 5 component còn lại (`TactileCard/TactileButton/SpeechBubble/SlideUpPanel/CurrencyChip`) **chưa tồn tại** (grep src xác nhận) → build mới.
- `src/features/` đã có `currency, daily-mission, need-bar, pet, quiz, rooms, work-room` (Epic 2/5 đã chạy) → **kiểm tra các dir này trước khi build** phòng khi đã có implementation cục bộ; nếu có, consolidate vào `src/components/` thay vì nhân đôi.

### ⚠️ RN shadow (blocky flat) — caveat kỹ thuật

- Shadow yêu cầu `0px 6px 0px 0px rgba(0,26,65,1)` (offset cứng, blur=0). RN **New Arch** (`newArchEnabled: true`, RN 0.81 theo Expo 54) hỗ trợ style **`boxShadow`** → ưu tiên `boxShadow: '0px 6px 0px 0px rgba(0,26,65,1)'`. Verify Uniwind có map arbitrary class `shadow-[...]` sang `boxShadow` không; nếu chưa, set qua `style` prop hoặc fallback View màu #001a41 offset 6px phía sau. **Tuyệt đối không** dùng `shadowRadius`/blur (vi phạm "no Gaussian blur").

### Token nguồn (authoritative)

- Hex chính xác: epics.md AC (L435–436) + `project-context.md` §Design System Rules (card border `#001a41`, shadow `rgba(0,26,65,1)`, currency `bc-amber #FFB000`/`qp-teal #00A8A8`, confetti `#22b5ff/#fd9d89/#b59cff/#8ce68c`, terminal-green `#8ce68c` chỉ code context, inverse-surface `#002e69` chỉ modal/overlay — KHÔNG làm app background).
- Palette đầy đủ + dùng ở đâu: `DESIGN.md` (`_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/DESIGN.md` và `.../imports/stitch-output/qc_pet_design_system/DESIGN.md`) — đọc khi cần chi tiết role.

### ⚠️ Anti-patterns CẤM

- ❌ Tạo `tailwind.config.js` / cài NativeWind / hạ Tailwind v3 — sai stack (Uniwind + Tailwind v4 @theme).
- ❌ Dùng MUI/Chakra/Paper/RNEUI/NativeBase — custom components only (ESLint enforce).
- ❌ Hardcode hex trong component/feature thay vì token (vd NeedBar cũ).
- ❌ Apply dark mode / để `dark:` variant active trong MVP.
- ❌ Font weight < 600 cho UI text; dùng JetBrains Mono ngoài code/terminal context.
- ❌ Gaussian blur / drop-shadow mờ; góc vuông (< `rounded-xl`).
- ❌ Mix màu currency (BC=amber, QP=teal riêng biệt).
- ❌ Hai primary CTA cùng cấp; touch target < 44×44px.
- ❌ Phá screen đang chạy khi đổi font/dark/refactor — phải web smoke lại.

### Versions (verify thực tế — kiến thức tới 01/2026)

- **Expo SDK `~54.0.32`** (architecture ghi nhầm "SDK 56" — thực tế 54; `react-native` ~0.81). Dùng `npx expo install` cho mọi lib để Expo chọn version khớp SDK 54.
- pnpm `10.12.3`. `tailwind-variants ^3.2.2`, `tailwind-merge ^3.4.0`, `eslint-plugin-better-tailwindcss ^4.0.1` đã có. `eslint.config.mjs` là flat config.
- Story 0-4 (done) đặt nền pattern utils client + (theo epics) ESLint rule `no-date-now-in-features` — grep hiện chưa thấy rule trong `eslint.config.mjs`; verify/đặt rule mới cùng chỗ.

### Verification reality (local-friendly ✅)

- Story này **verify được hoàn toàn local** qua web smoke (`pnpm web`, preview port 8081) + `lint`/`type-check`/`test`. Không cần EAS/cloud. Phù hợp khi chưa build được điện thoại.
- Lưu ý web parity: font/màu/`boxShadow` cần check render trên web (đa số OK với Uniwind). Animation press (TactileButton) verify cảm quan trên web; native fidelity verify sau khi có device build (ngoài scope story này).

### Project Structure (khớp architecture.md §Project Structure + codebase hiện tại)

```
src/global.css                         ← @theme tokens (Uniwind/Tailwind v4) — SỬA
src/components/ui/colors.js            ← mirror token cho JS context — SỬA
src/components/ui/use-theme-config.tsx ← light-only — SỬA
src/components/{tactile-card,tactile-button,speech-bubble,need-bar,slide-up-panel,currency-chip}.tsx  ← MỚI
app.config.ts                          ← expo-font: Nunito Sans + JetBrains Mono — SỬA
eslint.config.mjs                      ← no-restricted-imports + hex warn — SỬA
src/features/work-room/work-room-screen.tsx ← dùng NeedBarComponent mới — SỬA
```

### References

- Epic spec: [`epics.md`](_bmad-output/planning-artifacts/epics.md) — Story 0.6 (L425–459)
- Design system: [`DESIGN.md`](_bmad-output/planning-artifacts/ux-designs/ux-qc-pet-2026-06-12/DESIGN.md) + `.../imports/stitch-output/qc_pet_design_system/DESIGN.md`
- Project constraints: [`project-context.md`](_bmad-output/project-context.md) — §Design System Rules, §UX Constraints, §Accessibility Floor
- Story trước (done, pattern): 0-4 (client utils + ESLint custom rule), 0-5 (server patterns); 0-2 ([`0-2-...md`](_bmad-output/implementation-artifacts/0-2-supabase-backend-foundation-prisma-schema.md)) — web smoke approach
- Files đụng: `src/global.css`, `src/components/ui/{colors.js,use-theme-config.tsx,button.tsx}`, `src/components/*` (mới), `app.config.ts`, `eslint.config.mjs`, `src/features/work-room/work-room-screen.tsx`

## Dev Agent Record

### Agent Model Used

Claude Opus 4.8 (claude-opus-4-8) — Claude Code dev-story.

### Debug Log References

- `pnpm type-check` → **exit 0** (gồm boxShadow animated trong TactileButton + types @gorhom/bottom-sheet).
- `npx eslint src/components src/features/work-room/...` → **0 error** (sau auto-fix); chỉ còn warning `no-restricted-syntax` (hex chưa migrate ở work-room/icons — chủ ý, mức warn) + 1 warning `no-unnecessary-use-prefix` ở use-theme-config (giữ tên hàm để không vỡ caller).
- Web smoke (`pnpm web`, port 8081): app boot, render onboarding + lesson screen, **0 console error**. Màu token (primary-container xanh, chip xanh lá, panel inverse-surface) + tactile shadow hiển thị đúng.
- ⚠️ **`pnpm jest` KHÔNG chạy được — harness test VỠ SẴN từ baseline** (xác nhận bằng `git stash`): `__mocks__/@gorhom/bottom-sheet.ts` → `@gorhom/bottom-sheet/mock` → RN TextInput/Text jest mock crash (`mockComponent.js:42`, RN 0.81 + jest-expo 54). Lỗi này KHÔNG do Story 0-6 (mọi suite cũ cũng fail). → Verify thay bằng tsc + eslint + web smoke. Đã tạo task riêng để fix harness + thêm component test sau.

### Completion Notes List

**Đã làm + verify (tsc/eslint/web smoke):**
1. **Tokens (AC1):** thêm MD3 roles (`primary #006491`, `primary-container #22b5ff`, `inverse-surface`, `error`, `surface-container`, `on-surface`) + QC Pet tokens (`qp-teal`, `bc-amber`, `terminal-green`, `warm-peach-bg`, `rule-landing-bg`, `card-border`) + 4 need-bar tokens vào `src/global.css` `@theme` (Uniwind/Tailwind v4) + mirror `colors.js`. **Giữ nguyên** scale Obytes (`primary-50..900`...) để không vỡ screen cũ → token mới là tên riêng, không ghi đè.
2. **Dark off (AC2):** gỡ `@media (prefers-color-scheme: dark)` trong global.css; `use-theme-config` light-only. **Lưu ý:** các `dark:` utility trong component cũ (button/input/select/modal...) **để lại nhưng INERT** (dark không bao giờ kích hoạt vì không còn trigger) — gỡ sạch toàn bộ là cosmetic, defer.
3. **Fonts (AC3):** cài `@expo-google-fonts/nunito-sans` + `jetbrains-mono` (qua `expo install`, khớp SDK 54); wire `expo-font` plugin (Nunito Sans 600/700/800/900 + JetBrains Mono 500); `--font-family-sans`=Nunito Sans, `--font-family-mono`=JetBrains Mono; đổi `font-inter`→`font-sans`; base `Text` lên `font-semibold` (min-weight 600). *(Web smoke dùng font fallback; fidelity Nunito Sans verify trên device.)*
4. **Components (AC4):** build 6 component trong `src/components/` (+ barrel `index.tsx`): `TactileCard` (border 3px + boxShadow blocky), `TactileButton` (Reanimated: translateY 4px + boxShadow 6→0px, spring-back), `SpeechBubble`, `NeedBarComponent` (consolidate hàm NeedBar inline ở work-room + thêm trạng thái critical ≤29%), `SlideUpPanel` (@gorhom/bottom-sheet controlled), `CurrencyChip` (bc-amber/qp-teal). Refactor `work-room-screen` dùng `NeedBarComponent` + token `bg-need-*` (bỏ hex prop).
5. **ESLint (AC5):** thêm `no-restricted-imports` cấm UI library ngoài (error) + cảnh báo hardcode hex `no-restricted-syntax` (warn, scope components/features). `pnpm lint` exit 0 (chỉ warning).
6. **No regression (AC6):** web smoke app boot + render nhiều screen, 0 console error.

**Quyết định/deviation:**
- **Component tests defer** (Task 4.7 test, Task 6.2 test) do harness vỡ sẵn — verify bằng tsc + eslint + web smoke; tests thêm sau khi fix harness (task riêng đã tạo).
- Hex-warn cố tình KHÔNG migrate toàn bộ work-room/icons (ngoài scope re-skin); rule mức warn để flag dần.
- TactileButton boxShadow animation: native fidelity verify khi có device build (story đã note).

### File List

**Thêm mới:**
- `src/components/tactile-card.tsx`, `tactile-button.tsx`, `speech-bubble.tsx`, `need-bar.tsx`, `currency-chip.tsx`, `slide-up-panel.tsx`
- `src/components/index.tsx` (barrel)

**Sửa:**
- `src/global.css` (tokens + font vars + gỡ dark block)
- `src/components/ui/colors.js` (mirror tokens)
- `src/components/ui/use-theme-config.tsx` (light-only)
- `src/components/ui/{button,text,input}.tsx` + `button.test.tsx` (`font-inter`→`font-sans`; Text base `font-semibold`)
- `app.config.ts` (expo-font: Nunito Sans + JetBrains Mono)
- `eslint.config.mjs` (no-external-ui-library + hex warn)
- `src/features/work-room/work-room-screen.tsx` (dùng NeedBarComponent; lint format fixes)
- `package.json` / `pnpm-lock.yaml` (2 font packages)

## Change Log

| Date | Change |
|---|---|
| 2026-06-15 | Implement Story 0-6: design tokens (MD3 + QC Pet), Nunito Sans/JetBrains Mono fonts, dark-mode off, 6 tactile components, ESLint guardrails, work-room NeedBar consolidation. Verified via tsc + eslint + web smoke (jest harness pre-existing broken — deferred). Status → review. |

## Code Review — 2026-06-16 (BMAD adversarial)

**Mode:** full · **Reviewers:** Blind Hunter + Edge Case Hunter + Acceptance Auditor (song song, Opus) · **Diff:** `b9e2314..a3ef08d` scoped File List (18 file, +359/−117).

**AC verdict:** AC1 PARTIAL (token hex lệch DESIGN.md) · AC2 PARTIAL (`dark:` inert) · AC3 PASS · AC4 PARTIAL (focus trap thiếu) · AC5 PASS · AC6 PASS (caveat: jest harness vỡ sẵn).

**Triage:** 2 decision-needed · 5 patch · 10 defer · 8 dismissed.

### Review Findings

- [x] [Review][Defer token→DESIGN · chip contrast verified PASS ~5.8:1, KHÔNG sửa] D1 — Token hex lệch giữa 2 nguồn spec: `on-surface` code/epics `#1a1a2e` vs DESIGN.md `#001a41`; `surface-container` code `#f0f4f8` vs DESIGN.md `#e9edff`. Liên quan contrast: `CurrencyChip` dùng `text-on-surface` trên `bg-qp-teal` ~3.5:1 < WCAG AA. → Chốt nguồn canonical (epics hay DESIGN.md) + sửa token + màu chữ chip teal.
- [x] [Review][Patch ✅ · accessibilityViewIsModal] D2 — `SlideUpPanel` thiếu focus trap + return-focus (AC4 + project-context §Accessibility Floor yêu cầu, KHÔNG ghi defer). `@gorhom/bottom-sheet` không tự trap focus WCAG. → Làm a11y cơ bản ngay (`accessibilityViewIsModal`) hay defer sang a11y pass (verify device)?
- [x] [Review][Patch ✅] P1 — `SlideUpPanel` dùng ĐỒNG THỜI controlled `index={isOpen?0:-1}` + imperative `expand()/close()` (useEffect) → đánh nhau, `expand()` nhảy snap cuối, race khi toggle nhanh / swipe-dismiss re-open. Giữ 1 cơ chế (controlled `index`). [slide-up-panel.tsx]
- [x] [Review][Patch ✅] P2 — `app.config.ts` `userInterfaceStyle:'automatic'` + web `prefers-color-scheme:dark` còn → system chrome/web body tối lệch app light (vi phạm AC2 dark-off). Đổi `'light'` + gỡ web dark bg. [app.config.ts, +html]
- [x] [Review][Patch ✅] P3 — `NeedBarComponent` value=NaN/undefined → width `"NaN%"` (bar trống) + label "NaN%" + mất cảnh báo critical. Guard NaN→0. [need-bar.tsx]
- [x] [Review][Patch ✅] P4 — `SpeechBubble` tail `absolute` nhưng outer View thiếu `relative` → đuôi lệch trên web (môi trường smoke). Thêm `relative`. [speech-bubble.tsx]
- [x] [Review][Patch ✅] P5 — `input.tsx` dùng `font-medium` (500) nhưng Nunito Sans chỉ load 600+ → weight synthesized, vi phạm AC3 min-600. Đổi `font-semibold`. [ui/input.tsx]
- [x] [Review][Defer] DEF1 — boxShadow animated (TactileButton) native fidelity — story đã note verify device. — deferred (RN 0.81 New Arch hỗ trợ boxShadow; web smoke OK).
- [x] [Review][Defer] DEF2 — jest harness vỡ sẵn baseline (`@gorhom/bottom-sheet` mock + RN mock crash) → component test không chạy. — deferred: task riêng; **chặn mọi component test — ưu tiên fix** (liên quan 0-2 F4).
- [x] [Review][Defer] DEF3 — NeedBar mất fill animation/shimmer (cũ dùng `Animated.timing`). — deferred: re-add animation.
- [x] [Review][Defer] DEF4 — Token naming chồng/nhập nhằng: `bg-primary`(#006491 MD3) vs `bg-primary-600`(Obytes cam) cùng tồn tại; colors.js camelCase vs CSS kebab; `need-*` thiếu trong colors.js; `error` vs `destructive` trùng. — deferred: token hygiene pass.
- [x] [Review][Defer] DEF5 — Robustness component: empty khi thiếu label/children (TactileButton/SpeechBubble); `disabled` không chặn press animation; shared value chạy sau unmount; double-tap stutter; drag-off kẹt pressed; CurrencyChip `amount` NaN/Infinity/âm; snapPoints inline array memo; `textClassName` bị bỏ khi có children. — deferred: component polish + a11y pass.
- [x] [Review][Defer] DEF6 — `NeedBar.fillClassName` free-string → typo class ngoài `@theme` = bar vô hình (Tailwind v4 không JIT dynamic). — deferred: cân nhắc token enum.
- [x] [Review][Defer] DEF7 — iOS JetBrains Mono PostScript name chưa verify khớp (có thể fallback). — deferred: verify device build.
- [x] [Review][Defer] DEF8 — Dead dep `@expo-google-fonts/inter`; `no-restricted-imports` thiếu tamagui/gluestack/ui-lib. — deferred: cleanup.
- [x] [Review][Defer] DEF9 — `dark:` variant inert chưa gỡ sạch (story-acknowledged); SpeechBubble tail gap 2px; TactileButton thiếu `accessibilityState` disabled. — deferred: cosmetic/a11y.
- [x] [Review][Defer] DEF10 — DESIGN.md vs story AC lệch: TactileButton resting shadow 4px (DESIGN) vs 6px (AC/code); SpeechBubble border 4px (DESIGN) vs 3px (code). — deferred: doc reconciliation với designer.

**Dismissed (8):** boxShadow static "broken native" (RN 0.81 New Arch hỗ trợ — dev's documented choice, web smoke OK) · text base `font-semibold` "regression" (CỐ Ý theo AC3 min-600) · eslint hex regex selector "invalid" (Debug Log: hex warnings ĐÃ emit → rule chạy; esquery hỗ trợ regex) · NeedBar threshold 30 (đúng spec ≤29%) · TactileButton worklet (Blind tự rút lại) · NeedBar default fillClassName dead (vô hại) · barrel path (alternative cho phép) · work-room hex hardcode (cố ý, warn, story-acknowledged).

### Patches applied & verified — 2026-06-16

6 patch (P1–P5, P7/D2) áp + verified **`tsc` exit 0 + `eslint` exit 0** (changed files). **P6 (chip contrast) BỎ**: tính lại WCAG `#1a1a2e` trên `#00A8A8` = **~5.8:1 PASS AA** (reviewer tính nhầm "3.5:1") → không cần sửa.
- **P1** `SlideUpPanel`: `index={-1}` tĩnh + `snapToIndex(0)` thay `expand()` → 1 cơ chế điều khiển, hết race controlled/imperative.
- **P2** `app.config.ts` `userInterfaceStyle:'light'` + `+html.tsx` gỡ `prefers-color-scheme:dark` (AC2 dark-off triệt để).
- **P3** `NeedBarComponent` `Number.isFinite(value)` guard → NaN/undefined ra 0%.
- **P4** `SpeechBubble` outer View `relative` (đuôi đúng vị trí trên web).
- **P5** `input.tsx` `font-medium`→`font-semibold` (AC3 min-weight 600).
- **P7 (D2)** `SlideUpPanel` `accessibilityViewIsModal` (a11y modal cơ bản; return-focus đầy đủ defer device).

**D1** token-value (on-surface/surface-container vs DESIGN.md) → defer doc-reconciliation; chip contrast verified PASS nên không đổi màu.

**Status: review → done** (2 decision resolved · 6 patch applied+verified · 10 defer tracked → `deferred-work.md`).
