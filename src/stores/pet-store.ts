import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { getNeedBars, getPet } from '@/lib/supabase-api';

const PET_KEY = 'pet_data';

type NeedBars = { hunger: number; happiness: number; health: number; discipline: number };

type PetState = {
  name: string;
  version: string;
  bcBalance: number;
  qpTotal: number;
  needBars: NeedBars;
  isLoading: boolean;
  setName: (name: string) => void;
  addBC: (amount: number) => void;
  addQP: (amount: number) => void;
  setNeedBars: (bars: Partial<NeedBars>) => void;
  loadFromLocal: () => void;
  savePetLocally: (name: string) => void;
  syncFromSupabase: (userId: string) => Promise<void>;
};

export const usePetStore = create<PetState>((set, get) => ({
  name: 'Bugsy',
  version: 'v0.1',
  bcBalance: 0,
  qpTotal: 0,
  needBars: { hunger: 80, happiness: 80, health: 80, discipline: 80 },
  isLoading: false,

  setName: name => set({ name }),
  addBC: (amount) => {
    set(s => ({ bcBalance: Math.max(0, s.bcBalance + amount) }));
    const s = get();
    try {
      storage.setItem(PET_KEY, { name: s.name, bcBalance: s.bcBalance, qpTotal: s.qpTotal, needBars: s.needBars });
    }
    catch {}
  },
  addQP: (amount) => {
    set(s => ({ qpTotal: s.qpTotal + amount }));
    const s = get();
    try {
      storage.setItem(PET_KEY, { name: s.name, bcBalance: s.bcBalance, qpTotal: s.qpTotal, needBars: s.needBars });
    }
    catch {}
  },
  setNeedBars: bars => set(s => ({ needBars: { ...s.needBars, ...bars } })),

  loadFromLocal: () => {
    const saved = storage.getItem<any>(PET_KEY);
    if (saved) {
      set({
        name: saved.name ?? 'Bugsy',
        bcBalance: saved.bcBalance ?? 0,
        qpTotal: saved.qpTotal ?? 0,
        needBars: saved.needBars ?? { hunger: 80, happiness: 80, health: 80, discipline: 80 },
      });
    }
  },

  savePetLocally: (name: string) => {
    const s = get();
    storage.setItem(PET_KEY, { name, bcBalance: s.bcBalance, qpTotal: s.qpTotal, needBars: s.needBars });
    set({ name });
  },

  syncFromSupabase: async (userId: string) => {
    if (get().isLoading)
      return;
    set({ isLoading: true });
    try {
      const [petRes, needBarsRes] = await Promise.all([getPet(userId), getNeedBars(userId)]);
      const pet = petRes.data;
      const update: Partial<PetState> = { needBars: needBarsRes.data, isLoading: false };
      if (pet) {
        update.name = pet.name;
        update.version = pet.version;
        update.bcBalance = pet.bcBalance;
        update.qpTotal = pet.qpTotal;
      }
      set(update);
      const s = get();
      storage.setItem(PET_KEY, { name: s.name, bcBalance: s.bcBalance, qpTotal: s.qpTotal, needBars: s.needBars });
    }
    catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },
}));
