import type { CareAction } from '@/features/pet/pet-care';
import { create } from 'zustand';
import { syncNeedBars as apiSyncNeedBars } from '@/features/pet/need-bar-api';
import { computeDecayedBars } from '@/features/pet/need-bar-decay';
import { effectiveElapsedMs } from '@/features/pet/need-bar-weekend';
import { careAction as apiCareAction } from '@/features/pet/pet-care-api';
import { storage } from '@/lib/storage';
import { getNeedBars, getPet } from '@/lib/supabase-api';
import { clock } from '@/shared/lib/clock';
import { useConnectivity } from '@/stores/use-connectivity';

const PET_KEY = 'pet_data';

type NeedBars = { hunger: number; happiness: number; health: number; discipline: number };

const DEFAULT_BARS: NeedBars = { hunger: 80, happiness: 80, health: 80, discipline: 80 };

type PetState = {
  name: string;
  version: string;
  bcBalance: number;
  qpTotal: number;
  needBars: NeedBars;
  /** Giá trị bars tại lần sync server gần nhất (gốc để tính decay client-side). */
  needBarsBaseline: NeedBars;
  /** Server time (ms) lúc anchor baseline. */
  needBarsSyncedAtMs: number;
  isLoading: boolean;
  setName: (name: string) => void;
  addBC: (amount: number) => void;
  addQP: (amount: number) => void;
  setNeedBars: (bars: Partial<NeedBars>) => void;
  /** Recompute bars hiển thị từ baseline + elapsed (client tick 60s, KHÔNG gọi server). */
  recomputeDecay: () => void;
  /** Server-authoritative sync (Edge Function decay). Gọi khi mount/foreground. */
  syncNeedBars: (userId: string) => Promise<void>;
  /** Care action (feed/play/train) — cộng bar, re-anchor. Throw nếu offline (caller nuốt). */
  careAction: (userId: string, action: CareAction) => Promise<void>;
  loadFromLocal: () => void;
  savePetLocally: (name: string) => void;
  syncFromSupabase: (userId: string) => Promise<void>;
};

export const usePetStore = create<PetState>((set, get) => ({
  name: 'Bugsy',
  version: 'v0.1',
  bcBalance: 0,
  qpTotal: 0,
  needBars: { ...DEFAULT_BARS },
  needBarsBaseline: { ...DEFAULT_BARS },
  needBarsSyncedAtMs: clock.now(),
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
  // Re-anchor baseline khi set trực tiếp (reward 5-x/6-x, care 4-2) → decay tiếp tục từ giá trị mới.
  setNeedBars: bars => set((s) => {
    const merged = { ...s.needBars, ...bars };
    return { needBars: merged, needBarsBaseline: merged, needBarsSyncedAtMs: clock.now() };
  }),

  recomputeDecay: () => {
    const s = get();
    // Story 4-3: loại trừ cuối tuần (UTC+7) để khớp server (weekend non-decay).
    const elapsed = effectiveElapsedMs(s.needBarsSyncedAtMs, clock.now());
    set({ needBars: computeDecayedBars(s.needBarsBaseline, elapsed) });
  },

  syncNeedBars: async (userId: string) => {
    try {
      const { bars, serverTimeMs } = await apiSyncNeedBars(userId);
      clock.updateOffset(serverTimeMs);
      set({ needBars: bars, needBarsBaseline: bars, needBarsSyncedAtMs: serverTimeMs });
      const s = get();
      storage.setItem(PET_KEY, { name: s.name, bcBalance: s.bcBalance, qpTotal: s.qpTotal, needBars: s.needBars });
      useConnectivity.getState().setOnline(true);
    }
    catch {
      // offline / fail → giữ last-known (đã load từ MMKV); decay tick vẫn chạy từ baseline.
      useConnectivity.getState().setOnline(false);
    }
  },

  careAction: async (userId: string, action: CareAction) => {
    const idempotencyKey = `care:${userId}:${action}:${clock.now()}`;
    const { bars } = await apiCareAction(userId, action, idempotencyKey);
    set({ needBars: bars, needBarsBaseline: bars, needBarsSyncedAtMs: clock.now() });
    const s = get();
    storage.setItem(PET_KEY, { name: s.name, bcBalance: s.bcBalance, qpTotal: s.qpTotal, needBars: s.needBars });
  },

  loadFromLocal: () => {
    const saved = storage.getItem<any>(PET_KEY);
    if (saved) {
      const bars = saved.needBars ?? { ...DEFAULT_BARS };
      set({
        name: saved.name ?? 'Bugsy',
        bcBalance: saved.bcBalance ?? 0,
        qpTotal: saved.qpTotal ?? 0,
        needBars: bars,
        needBarsBaseline: bars,
        needBarsSyncedAtMs: clock.now(),
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
      const update: Partial<PetState> = {
        needBars: needBarsRes.data,
        needBarsBaseline: needBarsRes.data,
        needBarsSyncedAtMs: clock.now(),
        isLoading: false,
      };
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
