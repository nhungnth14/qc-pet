import type { MissionCard } from './mission-board-types';
import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { nextColumn } from './mission-board-types';

const CARDS_KEY = 'mission_board_cards';

/** Card seed cho lesson hiện tại (Story 1.1 content thật sẽ thay sau). */
const SEED_CARD: MissionCard = {
  id: 'lesson-1',
  lessonName: 'Severity vs Priority',
  category: 'Bug Detective',
  status: 'todo',
};

type MissionBoardState = {
  cards: MissionCard[];
  loadFromLocal: () => void;
  startMission: (lessonId: string, lessonName: string, category: string) => void;
  completeMission: (lessonId: string) => void;
  moveCardForward: (id: string) => void;
};

function persist(cards: MissionCard[]): void {
  storage.setItem(CARDS_KEY, cards);
}

/**
 * Mission Board state (Story 5.7) — kanban cards persist local MMKV (Decision #3). Auto-move
 * gọi từ core-mission (Decision #2). Pattern theo pet-store / side-quest-store.
 */
export const useMissionBoardStore = create<MissionBoardState>((set, get) => ({
  cards: [],

  loadFromLocal: () => {
    const saved = storage.getItem<MissionCard[]>(CARDS_KEY);
    set({ cards: Array.isArray(saved) && saved.length > 0 ? saved : [SEED_CARD] });
  },

  startMission: (lessonId, lessonName, category) => {
    const cards = [...get().cards];
    const idx = cards.findIndex(c => c.id === lessonId);
    if (idx < 0)
      cards.push({ id: lessonId, lessonName, category, status: 'in_progress' });
    else if (cards[idx].status === 'todo')
      cards[idx] = { ...cards[idx], status: 'in_progress' };
    set({ cards });
    persist(cards);
  },

  completeMission: (lessonId) => {
    const cards = get().cards.map(c =>
      c.id === lessonId && c.status !== 'done'
        ? { ...c, status: 'done' as const, completedAt: new Date().toISOString() }
        : c,
    );
    set({ cards });
    persist(cards);
  },

  moveCardForward: (id) => {
    const cards = get().cards.map((c) => {
      if (c.id !== id)
        return c;
      const status = nextColumn(c.status);
      if (status === c.status)
        return c;
      return { ...c, status, completedAt: status === 'done' ? new Date().toISOString() : c.completedAt };
    });
    set({ cards });
    persist(cards);
  },
}));
