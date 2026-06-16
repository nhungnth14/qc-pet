import { storage } from './storage';

export type RewardPayload = {
  type: 'bc' | 'qp' | 'evolution';
  amount?: number;
  meta?: unknown;
};

const PENDING_KEY = 'reward_pending';

const animationCallbacks = new Set<(payload: RewardPayload) => void>();

export const rewardEventBus = {
  // server_committed MUST fire before animation_triggered
  emit(event: 'server_committed' | 'animation_triggered', payload: RewardPayload): void {
    if (event === 'server_committed') {
      storage.setItem(PENDING_KEY, payload);
    }
    else {
      const pending = storage.getItem<RewardPayload>(PENDING_KEY);
      if (!pending) {
        console.error(
          '[RewardEventBus] animation_triggered called without prior server_committed — skipped',
        );
        return;
      }
      storage.remove(PENDING_KEY);
      animationCallbacks.forEach(cb => cb(payload));
    }
  },

  on(_event: 'animation_triggered', callback: (payload: RewardPayload) => void): () => void {
    animationCallbacks.add(callback);
    return () => {
      animationCallbacks.delete(callback);
    };
  },
};
