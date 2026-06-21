import type { PetVersion } from '../evolution';
import { create } from 'zustand';
import { storage } from '@/lib/storage';

// Souvenir unlock state (Story 3-5). Danh sách evolution step đã unlock souvenir, persist MMKV.
// Evolution thật (populate) tới ở Epic 7; hiện store sẵn sàng, mặc định trống.

const SOUVENIRS_KEY = 'souvenirs:unlocked';

type SouvenirStoreState = {
  unlockedSteps: PetVersion[];
  loadFromLocal: () => void;
  unlock: (step: PetVersion) => void;
};

export const useSouvenirStore = create<SouvenirStoreState>((set, get) => ({
  unlockedSteps: [],

  loadFromLocal: () => {
    const saved = storage.getItem<PetVersion[]>(SOUVENIRS_KEY);
    if (saved)
      set({ unlockedSteps: saved });
  },

  unlock: (step) => {
    if (get().unlockedSteps.includes(step))
      return;
    const next = [...get().unlockedSteps, step];
    set({ unlockedSteps: next });
    storage.setItem(SOUVENIRS_KEY, next);
  },
}));
