import ar from '@/translations/ar.json';
import en from '@/translations/en.json';
import vi from '@/translations/vi.json';

export const resources = {
  vi: {
    translation: vi,
  },
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

export type Language = keyof typeof resources;
