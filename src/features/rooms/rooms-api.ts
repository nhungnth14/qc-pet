import type { RoomType } from './stores/use-room-navigation';
import { supabase } from '@/lib/supabase';

// Story 3-4: persist room unlock state lên server `rooms` table (upsert on user_id+room_type).
// `updated_at` trigger (migration 3-1) ghi timestamp. Caller fire-and-forget (offline → MMKV giữ).

export async function upsertRoomState(
  userId: string,
  room: RoomType,
  state: { isUnlocked?: boolean; unlockTriggerMet?: boolean },
): Promise<void> {
  const payload: Record<string, unknown> = {
    user_id: userId,
    room_type: room,
    updated_at: new Date().toISOString(),
  };
  if (state.isUnlocked !== undefined)
    payload.is_unlocked = state.isUnlocked;
  if (state.unlockTriggerMet !== undefined)
    payload.unlock_trigger_met = state.unlockTriggerMet;

  const { error } = await supabase.from('rooms').upsert(payload, { onConflict: 'user_id,room_type' });
  if (error)
    throw new Error(`upsertRoomState failed: ${error.message}`);
}
