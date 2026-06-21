import { useEffect } from 'react';
import { AppState } from 'react-native';
import { DECAY_POLL_INTERVAL_MS } from '@/shared/lib/constants';
import { useConnectivity } from '@/stores/use-connectivity';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';

const OFFLINE_RETRY_MS = 5000;

/**
 * Real-time decay engine (Story 4-1). Mount ở màn (app) chính:
 * - Server-authoritative sync khi mount + khi app trở lại foreground (AppState `active`).
 * - Tick 60s (`DECAY_POLL_INTERVAL_MS`): recompute client-side từ baseline (KHÔNG gọi server).
 */
export function useNeedBarDecay() {
  const userId = useSessionStore(s => s.userId);
  const online = useConnectivity(s => s.online);
  const syncNeedBars = usePetStore(s => s.syncNeedBars);
  const recomputeDecay = usePetStore(s => s.recomputeDecay);

  useEffect(() => {
    if (!userId)
      return;

    void syncNeedBars(userId);

    const interval = setInterval(() => recomputeDecay(), DECAY_POLL_INTERVAL_MS);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active')
        void syncNeedBars(userId);
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [userId, syncNeedBars, recomputeDecay]);

  // Story 4-3: khi offline, retry sync mỗi 5s để reconnect nhanh (AC "sync trong 5s").
  useEffect(() => {
    if (online || !userId)
      return;
    const retry = setInterval(() => void syncNeedBars(userId), OFFLINE_RETRY_MS);
    return () => clearInterval(retry);
  }, [online, userId, syncNeedBars]);
}
