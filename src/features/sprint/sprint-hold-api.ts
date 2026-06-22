import { supabase } from '@/lib/supabase';

// Story 7.4: Sprint Hold token server ops. Award (cron) defer.

export async function getHoldTokens(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('sprint_hold_tokens')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle();
  if (error)
    throw new Error(`getHoldTokens failed: ${error.message}`);
  return (data as { balance: number } | null)?.balance ?? 0;
}

/** Deduct 1 token + log hold day (reason bắt buộc, penalty_waived=true). Throw nếu hết token. */
export async function submitSprintHold(userId: string, reason: string): Promise<void> {
  const { data, error: fetchErr } = await supabase
    .from('sprint_hold_tokens')
    .select('balance')
    .eq('user_id', userId)
    .maybeSingle();
  if (fetchErr)
    throw new Error(`useSprintHold fetch failed: ${fetchErr.message}`);

  const balance = (data as { balance: number } | null)?.balance ?? 0;
  if (balance <= 0)
    throw new Error('No sprint hold tokens');

  const { error: deductErr } = await supabase
    .from('sprint_hold_tokens')
    .upsert(
      { user_id: userId, balance: balance - 1, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  if (deductErr)
    throw new Error(`useSprintHold deduct failed: ${deductErr.message}`);

  const { error: logErr } = await supabase
    .from('sprint_hold_logs')
    .insert({ user_id: userId, reason, penalty_waived: true });
  if (logErr)
    throw new Error(`useSprintHold log failed: ${logErr.message}`);
}
