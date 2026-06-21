import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { clock } from '@/shared/lib/clock';
import { dateKeyUTC7, diffDays } from '../date-key';
import { computeStreak } from '../streak';

// Sprint/streak state (Story 7.4). Client MVP (MMKV); server sync defer. Unblock 3-4 streak triggers.

const SPRINT_KEY = 'sprint:state';
const SPRINT_DAYS = 7;

type SprintPersisted = {
  streakDays: number;
  missionsThisSprint: number;
  holdTokens: number;
  lastActiveDateKey: string | null;
  lastHoldDateKey: string | null;
  sprintStartKey: string | null;
  sprintNumber: number;
};

type SprintStoreState = SprintPersisted & {
  recordActivity: () => void;
  recordMission: () => void;
  useHoldToken: () => void;
  loadFromLocal: () => void;
};

const INITIAL: SprintPersisted = {
  streakDays: 0,
  missionsThisSprint: 0,
  holdTokens: 0,
  lastActiveDateKey: null,
  lastHoldDateKey: null,
  sprintStartKey: null,
  sprintNumber: 1,
};

function persist(s: SprintPersisted): void {
  storage.setItem(SPRINT_KEY, {
    streakDays: s.streakDays,
    missionsThisSprint: s.missionsThisSprint,
    holdTokens: s.holdTokens,
    lastActiveDateKey: s.lastActiveDateKey,
    lastHoldDateKey: s.lastHoldDateKey,
    sprintStartKey: s.sprintStartKey,
    sprintNumber: s.sprintNumber,
  });
}

export const useSprintStore = create<SprintStoreState>((set, get) => ({
  ...INITIAL,

  recordActivity: () => {
    const today = dateKeyUTC7(clock.now());
    const s = get();
    const streakDays = computeStreak(s.lastActiveDateKey, today, s.streakDays);
    let sprintStartKey = s.sprintStartKey;
    let missionsThisSprint = s.missionsThisSprint;
    let sprintNumber = s.sprintNumber;
    if (sprintStartKey === null) {
      sprintStartKey = today;
    }
    else if (diffDays(sprintStartKey, today) >= SPRINT_DAYS) {
      sprintStartKey = today;
      missionsThisSprint = 0;
      sprintNumber += 1;
    }
    const next = { ...s, streakDays, lastActiveDateKey: today, sprintStartKey, missionsThisSprint, sprintNumber };
    set({ streakDays, lastActiveDateKey: today, sprintStartKey, missionsThisSprint, sprintNumber });
    persist(next);
  },

  recordMission: () => {
    const s = get();
    const missionsThisSprint = s.missionsThisSprint + 1;
    set({ missionsThisSprint });
    persist({ ...s, missionsThisSprint });
  },

  useHoldToken: () => {
    const today = dateKeyUTC7(clock.now());
    const s = get();
    const holdTokens = Math.max(0, s.holdTokens - 1);
    set({ holdTokens, lastHoldDateKey: today });
    persist({ ...s, holdTokens, lastHoldDateKey: today });
  },

  loadFromLocal: () => {
    const saved = storage.getItem<SprintPersisted>(SPRINT_KEY);
    if (saved)
      set({ ...saved });
  },
}));
