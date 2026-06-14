# QC Pet 🐛

App mobile gamification: nuôi thú cưng **Bugsy** để học Kiểm thử phần mềm (QC/Testing).

Built với React Native + Expo (Obytes template), TypeScript strict mode, NativeWind, Expo Router, Zustand, React Query, MMKV, i18next (tiếng Việt mặc định).

---

## ⚡ Quick Start (~15 phút)

### 1. Prerequisites

| Công cụ | Phiên bản | Ghi chú |
|---|---|---|
| **Node.js** | v20+ | https://nodejs.org |
| **pnpm** | v9+ | Package manager **duy nhất**. Cài: `npm install -g pnpm` |
| **Expo Go** | mới nhất | App trên điện thoại (iOS App Store / Google Play) để test nhanh |
| **Android Studio** | mới nhất | (Tùy chọn) Để chạy Android Emulator |
| **iOS Simulator** | — | ⚠️ **Chỉ có trên macOS** — không chạy được trên Windows |

> 💡 Dùng **Git Bash** hoặc **PowerShell** trên Windows (không dùng CMD).

### 2. Clone & Install

```bash
git clone <repo-url> qc-pet
cd qc-pet
pnpm install
```

> ⚠️ Dự án này **chỉ** dùng `pnpm`. Chạy `npm install` hoặc `yarn` sẽ bị chặn (preinstall hook `only-allow pnpm`).

### 3. Environment Variables

Tạo file `.env.development` ở thư mục gốc (template đầy đủ sẽ được cấu hình ở **Story 0-2**):

```bash
# .env.development (sample — giá trị thật điền sau Story 0-2)
EXPO_PUBLIC_API_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Schema validate biến môi trường nằm trong [`env.ts`](env.ts) (dùng Zod).

### 4. Chạy app

```bash
pnpm start            # Khởi động Expo dev server (Metro bundler)
```

Sau đó:
- **Điện thoại (nhanh nhất trên Windows):** mở app **Expo Go**, quét QR code hiển thị trong terminal.
- **Android Emulator:** nhấn `a` trong terminal (cần Android Studio + emulator đang chạy).
- **iOS Simulator:** nhấn `i` — ⚠️ **chỉ trên macOS**.

---

## 📁 Cấu trúc dự án

```
src/
├── app/              # Expo Router — file-based routes
├── features/         # Feature modules (pet, currency, quiz, rooms, ...)
│   └── <feature>/stores/   # Zustand stores theo từng feature
├── shared/
│   ├── components/   # UI components dùng chung
│   ├── hooks/        # Hooks dùng chung
│   ├── lib/          # clock, wal, supabase, formatters, constants
│   ├── stores/       # Stores toàn cục (useUiState, useClockOffset)
│   └── types/        # Types dùng chung
├── translations/vi/  # i18next — tiếng Việt (common, quiz, pet, onboarding)
└── types/            # API types (StandardResponse, RFC7807ErrorResponse)
```

## 🛠️ Lệnh thường dùng

```bash
pnpm start            # Expo dev server
pnpm tsc --noEmit     # Kiểm tra type (phải pass, strict mode bật)
pnpm lint             # ESLint
pnpm test             # Jest unit tests
```

## 🌐 Ngôn ngữ

Mặc định là **tiếng Việt** (`lng: 'vi'`, `fallbackLng: 'vi'`). Không hardcode chuỗi tiếng Việt trong component — luôn dùng `t('key')` từ `useTranslation()`. File dịch: [`src/translations/vi/`](src/translations/vi).

## 📚 Tài liệu

- [Architecture](_bmad-output/planning-artifacts/architecture.md) — quyết định kỹ thuật, cấu trúc, naming
- [Epics & Stories](_bmad-output/planning-artifacts/epics.md) — backlog & acceptance criteria
- [Expo docs](https://docs.expo.dev)
- [Obytes template](https://github.com/obytes/react-native-template-obytes)

---

> ✅ **Đã verify**: `pnpm install`, `pnpm tsc --noEmit` (0 lỗi) và `pnpm start` (Metro bundler) đều chạy được. Bước còn lại: mở app trên Android Emulator / Expo Go để xác nhận màn hình load.
