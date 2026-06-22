import { storage } from './storage';

export type RewardPayload = {
  type: 'bc' | 'qp' | 'evolution';
  amount?: number;
  // Story 6.2: target tuyệt đối cho counter tick-up (tránh race với syncFromSupabase).
  from?: number;
  to?: number;
  // Story 6.3: reward đa-currency — BC giữ top-level (backward compat onboarding emit),
  // QP nested. core-mission emit 1 event chứa cả hai → 1 pending, không bị đè.
  qp?: { amount: number; from: number; to: number };
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

  // Story 6.2 — deferred animation: đọc + XOÁ pending reward (server_committed đã set,
  // chưa animate). Consumer (CurrencyHeader) gọi lúc mount lại (về Work Room) để chạy
  // animation. Trả null nếu không có. Đảm bảo consume đúng 1 lần (đã remove).
  consumePending(): RewardPayload | null {
    const pending = storage.getItem<RewardPayload>(PENDING_KEY);
    if (pending) {
      storage.remove(PENDING_KEY);
    }
    return pending ?? null;
  },
};
