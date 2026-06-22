# Maestro E2E flows

E2E kill-app scenarios cho QC Pet (NFR-1/NFR-2, FR-29).

## Chạy

```bash
# Prerequisite: Maestro CLI đã cài (https://maestro.mobile.dev) + 1 build dev đang chạy
# trên emulator/thiết bị (iOS Simulator hoặc Android Emulator).
pnpm e2e-test
# = maestro test .maestro/ -e APP_ID=com.qcpet.development
```

APP_ID `com.qcpet.development` khớp `bundleIdentifier`/`package` của profile `development`
(EAS profile development — xem `app.config.ts` + `env.js`).

## Flows

| File | Story | Bao phủ |
|------|-------|---------|
| `onboarding-kill-app.yaml` | 2.6 | 5 kill-app corner case của onboarding: force-quit tại Đặt tên / Reward (sau server commit) / Cliffhanger / Notification / trước Sign-up → relaunch → resume đúng màn, zero data loss |

## Cơ chế kill-app trong Maestro

- `stopApp` = force-quit app.
- `launchApp: { clearState: false }` = mở lại GIỮ nguyên MMKV → đúng để test resume.
- `launchApp: { clearState: true }` = reset sạch state (dùng đầu mỗi case để cô lập).

Resume dựa trên `onboarding_step` (MMKV) đọc ở `src/app/onboarding/index.tsx` → `router.replace`
tới đúng màn (`src/features/onboarding/onboarding-progress.ts`).

## Lưu ý selector

Flow hiện dùng text tiếng Việt (Maestro match regex). Nếu on-device gặp selector trùng hoặc
text đổi, thêm `testID` vào element tương ứng trong các màn `src/app/onboarding/*.tsx` rồi đổi
sang `id:` selector cho ổn định.

## Verify idempotency (chống cộng đôi BC/QP)

Maestro không truy cập DB trực tiếp. Việc "server không commit lại khi resume" được khoá bằng
unit test thuần: `shouldCreditReward` trong `src/features/onboarding/onboarding-progress.test.ts`
(+ cờ `reward_committed` MMKV và check `game_state.onboarding_completed` phía server trong
`src/app/onboarding/reward.tsx`).
