// Bugsy character asset (Story 3-3). Dùng `require` (KHÔNG static import) để type-check không phụ
// thuộc `expo-env.d.ts` (gitignored — vắng trên CI thì `import x from '*.png'` fail). Metro resolve
// asset lúc runtime; kiểu = number (asset module id) cho expo-image source.
// eslint-disable-next-line ts/no-require-imports -- Metro asset; static import cần *.png decl (CI vắng expo-env.d.ts)
export const BUGSY_IMAGE = require('../../../assets/bugsy-transparent.png') as number;
