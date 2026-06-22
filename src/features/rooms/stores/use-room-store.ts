import type { RoomState } from '../room-types';
import type { RoomType } from './use-room-navigation';

import { create } from 'zustand';

import { storage } from '@/shared/lib/storage';

const ROOMS_STORAGE_KEY = 'rooms:unlock_state';

type RoomStoreState = {
  rooms: Record<RoomType, RoomState>;
  setUnlocked: (room: RoomType, unlockTriggerMet?: boolean) => void;
  setTriggerMet: (room: RoomType) => void;
  loadFromLocal: () => void;
  saveToLocal: () => void;
};

const INITIAL_ROOMS: Record<RoomType, RoomState> = {
  WORK_ROOM: { isUnlocked: true, unlockTriggerMet: true },
  KITCHEN: { isUnlocked: false, unlockTriggerMet: false },
  BEDROOM: { isUnlocked: false, unlockTriggerMet: false },
  LIVING_ROOM: { isUnlocked: false, unlockTriggerMet: false },
  BATHROOM: { isUnlocked: false, unlockTriggerMet: false },
  GARDEN: { isUnlocked: false, unlockTriggerMet: false },
};

export const useRoomStore = create<RoomStoreState>()((set, get) => ({
  rooms: { ...INITIAL_ROOMS },

  setUnlocked: (room, unlockTriggerMet = false) => {
    set(s => ({
      rooms: {
        ...s.rooms,
        [room]: { isUnlocked: true, unlockTriggerMet },
      },
    }));
    get().saveToLocal();
  },

  setTriggerMet: (room) => {
    set(s => ({
      rooms: {
        ...s.rooms,
        [room]: { ...s.rooms[room], unlockTriggerMet: true },
      },
    }));
    get().saveToLocal();
  },

  loadFromLocal: () => {
    const persisted = storage.getItem<Record<RoomType, RoomState>>(ROOMS_STORAGE_KEY);
    if (persisted) {
      // Merge với INITIAL_ROOMS để đảm bảo mọi key tồn tại khi có phòng mới được thêm
      set({ rooms: { ...INITIAL_ROOMS, ...persisted } });
    }
  },

  saveToLocal: () => {
    storage.setItem(ROOMS_STORAGE_KEY, get().rooms);
  },
}));
