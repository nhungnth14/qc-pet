import type { SideQuestType } from './side-quest-types';
import { supabase } from '@/lib/supabase';
import { addCurrency, getNeedBars, getPet, updateNeedBars } from '@/lib/supabase-api';
import { applyHappinessReward, BC_REWARD, HAPPINESS_REWARD } from './side-quest-types';

export type SideQuestRewardResult = {
  bcEarned: number;
  happinessBefore: number;
  happinessAfter: number;
  /** true nếu BC đã commit server (đủ điều kiện animate — NFR-1). false = local-only (offline). */
  serverCommitted: boolean;
};

/**
 * Hoàn thành 1 side quest → commit reward server-authoritative (Story 5.6, kế thừa pipeline
 * 6-2/6-3). MIRROR `completeQuizSession`: thử Edge Function `process-side-quest-reward` trước,
 * fallback client `addCurrency` (+5 BC, 0 QP) + `updateNeedBars` (+40% Happiness, clamp 100).
 * KHÔNG validate nội dung (honor system). KHÔNG đụng store/animation — caller (screen) lo.
 *
 * Offline (không userId) → caller tự xử lý local-only; hàm này yêu cầu userId để commit server.
 */
export async function completeSideQuest(
  userId: string,
  type: SideQuestType,
): Promise<SideQuestRewardResult> {
  // Edge Function trước (có thể CHƯA deploy — OQ#2 deferred → catch fall-through).
  try {
    const { data, error } = await supabase.functions.invoke('process-side-quest-reward', {
      body: { userId, questType: type },
    });
    if (!error && data?.bcEarned !== undefined && data?.happinessAfter !== undefined) {
      return {
        bcEarned: data.bcEarned,
        happinessBefore: data.happinessBefore ?? data.happinessAfter - HAPPINESS_REWARD,
        happinessAfter: data.happinessAfter,
        serverCommitted: true,
      };
    }
  }
  catch {
    // Edge Function chưa deploy — fall through client fallback.
  }

  // Client fallback (server-authoritative qua PostgREST): BC vào pets, Happiness vào need_bars.
  const petRes = await getPet(userId);
  const petId = petRes.data?.id;
  const needRes = await getNeedBars(userId);
  const happinessBefore = needRes.data.happiness;
  const happinessAfter = applyHappinessReward(happinessBefore);

  if (petId) {
    await addCurrency(petId, BC_REWARD, 0);
  }
  await updateNeedBars(userId, { happiness: happinessAfter });

  return {
    bcEarned: BC_REWARD,
    happinessBefore,
    happinessAfter,
    serverCommitted: Boolean(petId),
  };
}
