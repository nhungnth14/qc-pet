import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { getGameState } from '@/lib/supabase-api';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { ALL_ROOM_TYPES } from './room-types';
import { evaluateRoomTriggers, UNLOCK_MESSAGES } from './room-unlock';
import { upsertRoomState } from './rooms-api';
import { useRoomStore } from './stores/use-room-store';

const NOTICE_MS = 4000;
let noticeTimer: ReturnType<typeof setTimeout> | null = null;

type UnlockNoticeState = {
  message: string | null;
  notify: (message: string) => void;
  dismiss: () => void;
};

// Notice store (Story 3-4): banner khi cửa phòng mới hé mở. Dùng store (không component setState
// trong effect) để react-compiler-safe.
export const useUnlockNotice = create<UnlockNoticeState>(set => ({
  message: null,
  notify: (message) => {
    set({ message });
    if (noticeTimer)
      clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => set({ message: null }), NOTICE_MS);
  },
  dismiss: () => set({ message: null }),
}));

/**
 * Room unlock engine (Story 3-4). Đánh giá trigger từ context (onboarding / first mission /
 * happiness / streak-stub) → tiến `unlockTriggerMet` (cửa hé mở) + push server + notice. Chỉ tiến,
 * không re-lock ("first time" tự nhiên). Mount trong apartment-container.
 */
export function useRoomUnlock() {
  const onboardingComplete = useSessionStore(s => s.onboardingComplete);
  const userId = useSessionStore(s => s.userId);
  const happiness = usePetStore(s => s.needBars.happiness);
  const rooms = useRoomStore(s => s.rooms);
  const setTriggerMet = useRoomStore(s => s.setTriggerMet);
  const [firstCoreMissionDone, setFirstCoreMissionDone] = useState(false);

  useEffect(() => {
    if (!userId)
      return;
    getGameState(userId)
      .then(r => setFirstCoreMissionDone(r.data.lastMissionCompletedDate != null))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    const met = evaluateRoomTriggers({
      onboardingComplete,
      firstCoreMissionDone,
      happiness,
      streakDays: 0, // Epic 7 — chưa có streak tracking
      weekOneComplete: false, // Epic 5/7 — chưa đếm core mission/tuần
    });
    for (const room of ALL_ROOM_TYPES) {
      if (met[room] && !rooms[room].unlockTriggerMet) {
        setTriggerMet(room);
        const message = UNLOCK_MESSAGES[room];
        if (message)
          useUnlockNotice.getState().notify(message);
        if (userId)
          void upsertRoomState(userId, room, { unlockTriggerMet: true }).catch(() => {});
      }
    }
  }, [onboardingComplete, firstCoreMissionDone, happiness, rooms, setTriggerMet, userId]);

  const message = useUnlockNotice(s => s.message);
  const dismiss = useUnlockNotice(s => s.dismiss);
  return { unlockMessage: message, dismissUnlock: dismiss };
}
