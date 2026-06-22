import type { SideQuestPayload, SideQuestSubmission, SideQuestType } from './side-quest-types';
import { create } from 'zustand';
import { storage } from '@/lib/storage';

const SUBMISSIONS_KEY = 'side_quest_submissions';
const ZERO_BUG_WEEKS_KEY = 'zero_bug_weeks';

type SideQuestState = {
  submissions: SideQuestSubmission[];
  /** ISO date các tuần user khai "không gặp bug" (Zero-Bug flow, AC5 option 2). */
  zeroBugWeeks: string[];
  loadFromLocal: () => void;
  addSubmission: (type: SideQuestType, payload: SideQuestPayload) => SideQuestSubmission;
  logZeroBugWeek: (isoDate: string) => void;
};

function genId(): string {
  return `sq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Lưu submission side quest local (MMKV) — nguồn cho Bug Report Wall (Story 5.7 render).
 * Server-side persist deferred sang 5.7 (OQ#1). Pattern theo pet-store (`storage`).
 */
export const useSideQuestStore = create<SideQuestState>((set, get) => ({
  submissions: [],
  zeroBugWeeks: [],

  loadFromLocal: () => {
    const subs = storage.getItem<SideQuestSubmission[]>(SUBMISSIONS_KEY);
    const weeks = storage.getItem<string[]>(ZERO_BUG_WEEKS_KEY);
    set({
      submissions: Array.isArray(subs) ? subs : [],
      zeroBugWeeks: Array.isArray(weeks) ? weeks : [],
    });
  },

  addSubmission: (type, payload) => {
    const submission: SideQuestSubmission = {
      id: genId(),
      type,
      payload,
      createdAt: new Date().toISOString(),
    };
    const next = [...get().submissions, submission];
    set({ submissions: next });
    storage.setItem(SUBMISSIONS_KEY, next);
    return submission;
  },

  logZeroBugWeek: (isoDate) => {
    const next = [...get().zeroBugWeeks, isoDate];
    set({ zeroBugWeeks: next });
    storage.setItem(ZERO_BUG_WEEKS_KEY, next);
  },
}));
