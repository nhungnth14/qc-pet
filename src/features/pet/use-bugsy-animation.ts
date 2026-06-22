import { create } from 'zustand';
import { rewardEventBus } from '@/lib/reward-event-bus';

// Bugsy animation store (Story 3-3): transient `excited` state sau reward. Tách khỏi pet-store
// (need bars) vì excited là event-driven, không persist.

const EXCITED_MS = 2500;

type BugsyAnimationState = {
  excited: boolean;
  celebrate: () => void;
};

let excitedTimer: ReturnType<typeof setTimeout> | null = null;

export const useBugsyAnimation = create<BugsyAnimationState>(set => ({
  excited: false,
  celebrate: () => {
    set({ excited: true });
    if (excitedTimer)
      clearTimeout(excitedTimer);
    excitedTimer = setTimeout(() => set({ excited: false }), EXCITED_MS);
  },
}));

// Reward commit → Bugsy excited. NFR-1: `animation_triggered` chỉ fire sau `server_committed`.
rewardEventBus.on('animation_triggered', () => useBugsyAnimation.getState().celebrate());
